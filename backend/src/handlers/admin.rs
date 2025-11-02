use actix_web::{web, HttpResponse, Result};
use futures::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

use crate::models::{User, Book};
use crate::utils::verify_jwt;
use crate::AppState;

#[derive(Debug, Serialize)]
pub struct AdminUserInfo {
    pub id: String,
    pub username: String,
    pub email: String,
    pub role: String,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateBookRequest {
    pub title: String,
    pub author: String,
    pub description: String,
    pub cover_url: String,
    pub content_url: String,
}

pub async fn get_all_users(
    req: actix_web::HttpRequest,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse> {
    // Verify admin token
    let auth_header = req.headers().get("Authorization");
    if auth_header.is_none() {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Authorization header missing"
        })));
    }

    let token = auth_header.unwrap().to_str().unwrap().replace("Bearer ", "");
    let claims = match verify_jwt(&token) {
        Ok(c) => c,
        Err(_) => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid token"
            })));
        }
    };

    // Check if user is admin
    let collection = app_state.db.collection::<User>("users");
    let filter = doc! { "_id": ObjectId::parse_str(&claims.sub).unwrap() };
    let user = match collection.find_one(filter).await {
        Ok(Some(u)) => u,
        _ => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "User not found"
            })));
        }
    };

    if user.role != "admin" {
        return Ok(HttpResponse::Forbidden().json(serde_json::json!({
            "error": "Admin access required"
        })));
    }

    // Get all users
    let mut cursor = collection.find(doc! {}).await.unwrap();
    let mut users = Vec::new();

    while let Ok(Some(user)) = cursor.try_next().await {
        users.push(AdminUserInfo {
            id: user.id.unwrap().to_hex(),
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at.timestamp_millis().to_string(),
        });
    }

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "users": users
    })))
}

pub async fn delete_user(
    req: actix_web::HttpRequest,
    path: web::Path<String>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse> {
    // Verify admin token
    let auth_header = req.headers().get("Authorization");
    if auth_header.is_none() {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Authorization header missing"
        })));
    }

    let token = auth_header.unwrap().to_str().unwrap().replace("Bearer ", "");
    let claims = match verify_jwt(&token) {
        Ok(c) => c,
        Err(_) => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid token"
            })));
        }
    };

    // Check if user is admin
    let collection = app_state.db.collection::<User>("users");
    let filter = doc! { "_id": ObjectId::parse_str(&claims.sub).unwrap() };
    let user = match collection.find_one(filter).await {
        Ok(Some(u)) => u,
        _ => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "User not found"
            })));
        }
    };

    if user.role != "admin" {
        return Ok(HttpResponse::Forbidden().json(serde_json::json!({
            "error": "Admin access required"
        })));
    }

    // Delete user
    let user_id = path.into_inner();
    let filter = doc! { "_id": ObjectId::parse_str(&user_id).unwrap() };

    match collection.delete_one(filter).await {
        Ok(result) => {
            if result.deleted_count > 0 {
                Ok(HttpResponse::Ok().json(serde_json::json!({
                    "message": "User deleted successfully"
                })))
            } else {
                Ok(HttpResponse::NotFound().json(serde_json::json!({
                    "error": "User not found"
                })))
            }
        }
        Err(_) => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to delete user"
        }))),
    }
}

pub async fn add_book(
    req: actix_web::HttpRequest,
    book_req: web::Json<CreateBookRequest>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse> {
    // Verify admin token
    let auth_header = req.headers().get("Authorization");
    if auth_header.is_none() {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Authorization header missing"
        })));
    }

    let token = auth_header.unwrap().to_str().unwrap().replace("Bearer ", "");
    let claims = match verify_jwt(&token) {
        Ok(c) => c,
        Err(_) => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid token"
            })));
        }
    };

    // Check if user is admin
    let collection = app_state.db.collection::<User>("users");
    let filter = doc! { "_id": ObjectId::parse_str(&claims.sub).unwrap() };
    let user = match collection.find_one(filter).await {
        Ok(Some(u)) => u,
        _ => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "User not found"
            })));
        }
    };

    if user.role != "admin" {
        return Ok(HttpResponse::Forbidden().json(serde_json::json!({
            "error": "Admin access required"
        })));
    }

    // Create new book
    let now = DateTime::now();
    let book = Book {
        id: None,
        title: book_req.title.clone(),
        author: book_req.author.clone(),
        description: book_req.description.clone(),
        cover_url: if book_req.cover_url.is_empty() { None } else { Some(book_req.cover_url.clone()) },
        content_url: if book_req.content_url.is_empty() { None } else { Some(book_req.content_url.clone()) },
        created_at: now,
        updated_at: now,
    };

    // Insert book into database
    let books_collection = app_state.db.collection::<Book>("books");
    match books_collection.insert_one(&book).await {
        Ok(result) => {
            Ok(HttpResponse::Created().json(serde_json::json!({
                "message": "Book added successfully",
                "book_id": result.inserted_id.as_object_id().unwrap().to_hex(),
                "book": {
                    "title": book_req.title,
                    "author": book_req.author,
                    "description": book_req.description
                }
            })))
        }
        Err(e) => {
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Failed to add book: {}", e)
            })))
        }
    }
}

pub async fn delete_book(
    req: actix_web::HttpRequest,
    path: web::Path<String>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse> {
    // Verify admin token
    let auth_header = req.headers().get("Authorization");
    if auth_header.is_none() {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Authorization header missing"
        })));
    }

    let token = auth_header.unwrap().to_str().unwrap().replace("Bearer ", "");
    let claims = match verify_jwt(&token) {
        Ok(c) => c,
        Err(_) => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid token"
            })));
        }
    };

    // Check if user is admin
    let users_collection = app_state.db.collection::<User>("users");
    let filter = doc! { "_id": ObjectId::parse_str(&claims.sub).unwrap() };
    let user = match users_collection.find_one(filter).await {
        Ok(Some(u)) => u,
        _ => {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "User not found"
            })));
        }
    };

    if user.role != "admin" {
        return Ok(HttpResponse::Forbidden().json(serde_json::json!({
            "error": "Admin access required"
        })));
    }

    // Delete book
    let book_id = path.into_inner();
    let books_collection = app_state.db.collection::<Book>("books");
    let filter = doc! { "_id": ObjectId::parse_str(&book_id).unwrap() };

    match books_collection.delete_one(filter).await {
        Ok(result) => {
            if result.deleted_count > 0 {
                Ok(HttpResponse::Ok().json(serde_json::json!({
                    "message": "Book deleted successfully"
                })))
            } else {
                Ok(HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Book not found"
                })))
            }
        }
        Err(e) => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to delete book: {}", e)
        }))),
    }
}
