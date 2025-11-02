use actix_web::{web, HttpResponse, Result};
use mongodb::bson::{doc, DateTime};

use crate::models::{SignupRequest, LoginRequest, AuthResponse, User, UserInfo};
use crate::utils::{hash_password, verify_password, create_jwt};
use crate::AppState;

pub async fn signup(
    signup_req: web::Json<SignupRequest>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse> {
    let collection = app_state.db.collection::<User>("users");

    // Check if user already exists
    let filter = doc! { "email": &signup_req.email };
    let count = collection.count_documents(filter).await.unwrap_or(0);
    if count > 0 {
        return Ok(HttpResponse::BadRequest().json(serde_json::json!({
            "error": "User with this email already exists"
        })));
    }

    // Check if username is taken
    let filter = doc! { "username": &signup_req.username };
    let count = collection.count_documents(filter).await.unwrap_or(0);
    if count > 0 {
        return Ok(HttpResponse::BadRequest().json(serde_json::json!({
            "error": "Username is already taken"
        })));
    }

    // Hash password
    let password_hash = match hash_password(&signup_req.password) {
        Ok(hash) => hash,
        Err(_) => {
            return Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to hash password"
            })))
        }
    };

    let now = DateTime::now();

    // Check if this is the admin account
    let role = if signup_req.email == "admin@Admin.com" && signup_req.username == "admin" {
        "admin".to_string()
    } else {
        "user".to_string()
    };

    let new_user = User {
        id: None,
        username: signup_req.username.clone(),
        email: signup_req.email.clone(),
        password_hash,
        role,
        created_at: now,
        updated_at: now,
    };

    // Insert user
    let result = collection.insert_one(new_user).await;
    match result {
        Ok(insert_result) => {
            let user_id = insert_result.inserted_id.as_object_id().unwrap();

            // Create JWT token
            let token = match create_jwt(&user_id) {
                Ok(t) => t,
                Err(_) => {
                    return Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": "Failed to create authentication token"
                    })))
                }
            };

            // Get the inserted user
            let filter = doc! { "_id": &user_id };
            let user_doc = collection.find_one(filter).await.unwrap().unwrap();
            let user_info = user_doc.into();

            Ok(HttpResponse::Created().json(AuthResponse { token, user: user_info }))
        }
        Err(_) => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to create user"
        }))),
    }
}

pub async fn login(
    login_req: web::Json<LoginRequest>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse> {
    use mongodb::bson::Document;

    let collection = app_state.db.collection::<Document>("users");

    // Find user by email using raw document
    let filter = doc! { "email": &login_req.email };
    let user_doc = match collection.find_one(filter).await {
        Ok(Some(doc)) => doc,
        Ok(None) => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid email or password"
            })))
        }
        Err(_) => {
            return Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Database error"
            })))
        }
    };

    // Extract password hash
    let password_hash = match user_doc.get_str("password_hash") {
        Ok(hash) => hash,
        Err(_) => {
            return Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Invalid user data"
            })))
        }
    };

    // Verify password
    match verify_password(&login_req.password, password_hash) {
        Ok(true) => {
            // Extract user ID
            let user_id = match user_doc.get_object_id("_id") {
                Ok(oid) => oid,
                Err(_) => {
                    return Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": "Invalid user data"
                    })))
                }
            };

            // Create JWT token
            let token = match create_jwt(&user_id) {
                Ok(t) => t,
                Err(_) => {
                    return Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": "Failed to create authentication token"
                    })))
                }
            };

            // Extract user info
            let username = user_doc.get_str("username").unwrap_or("Unknown");
            let email = user_doc.get_str("email").unwrap_or("unknown@example.com");
            // Determine role - admin@Admin.com is admin, others are user
            let role = if email == "admin@Admin.com" {
                "admin".to_string()
            } else {
                "user".to_string()
            };

            let user_info = UserInfo {
                id: user_id.to_hex(),
                username: username.to_string(),
                email: email.to_string(),
                role,
            };

            Ok(HttpResponse::Ok().json(AuthResponse { token, user: user_info }))
        }
        Ok(false) => Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid email or password"
        }))),
        Err(_) => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Password verification failed"
        }))),
    }
}
