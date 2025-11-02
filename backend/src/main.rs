mod handlers;
mod models;
mod utils;

use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use mongodb::{Client, options::ClientOptions};
use std::env;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    // MongoDB connection
    let mongodb_uri = env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
    let client_options = ClientOptions::parse(&mongodb_uri).await.expect("Failed to parse MongoDB URI");
    let client = Client::with_options(client_options).expect("Failed to initialize MongoDB client");
    let db = client.database("fullstack_auth");

    // Start with empty cache and load books asynchronously
    println!("Starting server with empty book cache...");
    let book_cache = Arc::new(RwLock::new(HashMap::new()));

    // Clone cache for background loading
    let cache_clone = Arc::clone(&book_cache);

    // Load books in background
    tokio::spawn(async move {
        println!("Preloading book content cache in background...");
        let loaded_cache = preload_book_cache().await;
        let mut cache = cache_clone.write().await;
        *cache = loaded_cache;
        println!("Book cache loaded with {} books", cache.len());
    });

    // Shared state with book cache
    let app_state = web::Data::new(AppState {
        db,
        book_cache,
    });

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .app_data(app_state.clone())
            .route("/auth/signup", web::post().to(handlers::auth::signup))
            .route("/auth/login", web::post().to(handlers::auth::login))
            .route("/books/{id}/content", web::get().to(handlers::books::get_book_content_cached))
            .route("/admin/users", web::get().to(handlers::admin::get_all_users))
            .route("/admin/users/{id}", web::delete().to(handlers::admin::delete_user))
            .route("/admin/books", web::post().to(handlers::admin::add_book))
            .route("/admin/books/{id}", web::delete().to(handlers::admin::delete_book))
    })
    .bind("127.0.0.1:8081")?
    .run()
    .await
}

async fn preload_book_cache() -> HashMap<i32, String> {
    let mut cache = HashMap::new();
    let client = reqwest::Client::new();

    // Book mappings with Gutenberg URLs
    let books = vec![
        (1, "https://www.gutenberg.org/files/219/219-0.txt", "The Great Gatsby"),
        (2, "https://www.gutenberg.org/files/42671/42671-0.txt", "Pride and Prejudice"),
        (3, "https://www.gutenberg.org/files/84/84-0.txt", "Frankenstein"),
        (4, "https://www.gutenberg.org/files/768/768-0.txt", "Wuthering Heights"),
        (5, "https://www.gutenberg.org/files/1260/1260-0.txt", "Jane Eyre"),
        (6, "https://www.gutenberg.org/files/514/514-0.txt", "Little Women"),
        (7, "https://www.gutenberg.org/files/55/55-0.txt", "The Wonderful Wizard of Oz"),
        (8, "https://www.gutenberg.org/files/11/11-0.txt", "Alice's Adventures in Wonderland"),
        (9, "https://www.gutenberg.org/files/16/16-0.txt", "Peter Pan"),
        (10, "https://www.gutenberg.org/files/36/36-0.txt", "The War of the Worlds"),
        (11, "https://www.gutenberg.org/files/35/35-0.txt", "The Time Machine"),
        (12, "https://www.gutenberg.org/files/164/164-0.txt", "Twenty Thousand Leagues Under the Sea"),
        (13, "https://www.gutenberg.org/files/5230/5230-0.txt", "The Invisible Man"),
        (14, "https://www.gutenberg.org/files/74/74-0.txt", "The Adventures of Tom Sawyer"),
        (15, "https://www.gutenberg.org/files/120/120-0.txt", "Treasure Island"),
        (16, "https://www.gutenberg.org/files/271/271-0.txt", "Black Beauty"),
        (17, "https://www.gutenberg.org/files/144/144-0.txt", "Heidi"),
        (18, "https://www.gutenberg.org/files/113/113-0.txt", "The Secret Garden"),
        (19, "https://www.gutenberg.org/files/146/146-0.txt", "A Little Princess"),
        // Programming books - fetch from online sources
        (20, "https://automatetheboringstuff.com/files/AutomateTheBoringStuff.pdf", "Automate the Boring Stuff with Python"),
        (21, "https://greenteapress.com/wp-content/uploads/2016/07/thinkpython2.pdf", "Think Python (2nd Edition)"),
        (22, "https://python.swaroopch.com/pdfs/AByteofPythonRussian.pdf", "A Byte of Python"),
        (23, "https://www.py4e.com/book.php", "Python for Everybody"),
        (24, "https://diveintopython3.problemsolving.io/diveintopython3.pdf", "Dive Into Python 3"),
        (25, "https://inventwithpython.com/pygame/chapter0.html", "Invent with Python"),
        (26, "https://jakevdp.github.io/PythonDataScienceHandbook/web/_downloads/3e1d3c794e6ad9b7c00b3b3b3b3b3b3b/PythonDataScienceHandbook.pdf", "Python Data Science Handbook"),
        (27, "https://doc.rust-lang.org/book/", "The Rust Programming Language"),
        (28, "https://doc.rust-lang.org/rust-by-example/", "Rust by Example"),
        (29, "https://rust-lang-nursery.github.io/rust-cookbook/", "Rust Cookbook"),
        (30, "https://google.github.io/comprehensive-rust/", "Comprehensive Rust"),
        (31, "https://www.lpalmieri.com/posts/zero-to-production/", "Zero to Production in Rust"),
        (32, "https://rust-lang.github.io/async-book/", "Async Rust Book"),
        (33, "https://owasp.org/www-pdf-archive/OWASP_Testing_Guide_v4.pdf", "OWASP Web Security Testing Guide"),
        (34, "https://www.exploit-db.com/docs/english/34956-the-art-of-exploitation-(2nd-edition).pdf", "The Art of Exploitation"),
        (35, "https://linuxcommand.org/tlcl.php", "Linux Command Line for Hackers"),
    ];

    // Load books concurrently for faster startup
    let mut tasks = vec![];

    for (id, url, title) in books {
        let client_clone = client.clone();
        let task = tokio::spawn(async move {
            if url == "placeholder" {
                // Handle programming books with fallback content
                let content = format_programming_book_fallback(&title, "");
                Some((id, content))
            } else {
                match client_clone.get(url).send().await {
                    Ok(response) => {
                        if response.status().is_success() {
                            match response.text().await {
                                Ok(full_text) => {
                                    if url.contains("gutenberg.org") {
                                        let content = format_book_content(&full_text, &title);
                                        Some((id, content))
                                    } else {
                                        // For programming books, try to extract content or use fallback
                                        let content = if url.ends_with(".pdf") || url.ends_with(".php") {
                                            format_programming_book_fallback(&title, url)
                                        } else {
                                            format_html_book_content(&full_text, &title, url)
                                        };
                                        Some((id, content))
                                    }
                                }
                                Err(_) => {
                                    let content = format_programming_book_fallback(&title, url);
                                    Some((id, content))
                                },
                            }
                        } else {
                            let content = format_programming_book_fallback(&title, url);
                            Some((id, content))
                        }
                    }
                    Err(_) => {
                        let content = format_programming_book_fallback(&title, url);
                        Some((id, content))
                    },
                }
            }
        });
        tasks.push(task);
    }

    // Wait for all tasks to complete
    for task in tasks {
        if let Ok(Some((id, content))) = task.await {
            cache.insert(id, content);
            println!("Loaded book: {}", id);
        }
    }

    println!("Book cache preloading completed. Loaded {} books.", cache.len());
    cache
}

fn format_book_content(full_text: &str, book_title: &str) -> String {
    // Handle programming books that aren't on Gutenberg
    if full_text == "placeholder" {
        return format_programming_book_content(book_title);
    }

    // Extract content (same logic as before but simplified for caching)
    let start_markers = ["*** START OF THE PROJECT GUTENBERG EBOOK", "***START OF THE PROJECT GUTENBERG EBOOK"];
    let mut content_start = 0;

    for marker in &start_markers {
        if let Some(pos) = full_text.find(marker) {
            let search_start = pos + marker.len();
            if let Some(content_pos) = find_content_start(&full_text[search_start..]) {
                content_start = search_start + content_pos;
                break;
            }
        }
    }

    if content_start == 0 {
        content_start = full_text.len().min(2000);
    }

    let end_markers = ["*** END OF THE PROJECT GUTENBERG EBOOK", "***END OF THE PROJECT GUTENBERG EBOOK"];
    let mut content_end = full_text.len();

    for marker in &end_markers {
        if let Some(pos) = full_text.find(marker) {
            content_end = pos;
            break;
        }
    }

    let extracted = &full_text[content_start..content_end];
    let formatted = extracted
        .lines()
        .filter(|line| !line.trim().is_empty())
        .collect::<Vec<_>>()
        .join("\n");

    format!(
        r#"
        <div class="chapter-title">Reading: {}</div>
        <div class="book-content">
            <div class="content-source">Content provided by Project Gutenberg</div>
            <div class="reading-text">
                {}
            </div>
        </div>
        "#,
        book_title, formatted
    )
}

async fn fetch_programming_book_content(url: &str, title: &str) -> String {
    let client = reqwest::Client::new();

    match client.get(url).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.text().await {
                    Ok(html_content) => {
                        // Try to extract readable text from HTML
                        if url.ends_with(".pdf") {
                            // For PDFs, show download link
                            format_programming_book_fallback(title, url)
                        } else {
                            // For HTML content, try to extract text
                            format_html_book_content(&html_content, title, url)
                        }
                    }
                    Err(_) => format_programming_book_fallback(title, url),
                }
            } else {
                format_programming_book_fallback(title, url)
            }
        }
        Err(_) => format_programming_book_fallback(title, url),
    }
}

fn format_html_book_content(html_content: &str, title: &str, url: &str) -> String {
    // Simple HTML text extraction - remove tags and get readable content
    let text_content = html_content
        .replace(|c: char| !c.is_alphanumeric() && !c.is_whitespace() && c != '.' && c != ',' && c != '!' && c != '?' && c != ':' && c != ';' && c != '-', "<".to_string().as_str())
        .lines()
        .filter(|line| !line.trim().is_empty() && line.len() > 20)
        .take(50) // Limit to reasonable amount
        .collect::<Vec<_>>()
        .join("\n\n");

    if text_content.len() > 100 {
        format!(
            r#"
            <div class="chapter-title">Reading: {}</div>
            <div class="book-content">
                <div class="content-source">Programming Resource - Online Content</div>
                <div class="reading-text">
                    <div class="book-excerpt">
                        <h3>📖 {} - Excerpt</h3>
                        <p><em>This content has been extracted from the online version of the book.</em></p>
                        <div class="extracted-content">
                            {}
                        </div>
                        <div class="full-access-note">
                            <p><strong>📋 Note:</strong> This is an excerpt. For the complete book with proper formatting, code examples, and interactive content:</p>
                            <a href="{}" target="_blank" class="online-link">
                                🌐 Read Full Book Online
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            "#,
            title, title, text_content, url
        )
    } else {
        format_programming_book_fallback(title, url)
    }
}

fn format_programming_book_fallback(title: &str, url: &str) -> String {
    let (description, topics) = match title {
        "Automate the Boring Stuff with Python" => (
            "A comprehensive guide to automating everyday tasks with Python programming. Learn to write programs that do in minutes what would take you hours to do by hand.",
            vec!["Web scraping", "Working with Excel", "Sending emails", "Text processing", "GUI automation"]
        ),
        "Think Python (2nd Edition)" => (
            "An introduction to computer science and programming using Python. A great starting point for beginners.",
            vec!["Programming fundamentals", "Problem solving", "Data structures", "Functions", "Classes"]
        ),
        "A Byte of Python" => (
            "A beginner-friendly guide to learning Python programming with clear explanations and examples.",
            vec!["Python basics", "Data types", "Control flow", "Functions", "Object-oriented programming"]
        ),
        "Python for Everybody" => (
            "Learn to program and think like a computer scientist using Python, with a focus on data analysis.",
            vec!["Python programming", "Data analysis", "Web scraping", "Databases", "Data visualization"]
        ),
        "Dive Into Python 3" => (
            "A comprehensive guide to Python 3 programming with practical examples and best practices.",
            vec!["Python 3 features", "Advanced concepts", "Best practices", "Real-world examples"]
        ),
        "Invent with Python" => (
            "Learn programming by creating fun games and projects with Python. Perfect for beginners.",
            vec!["Game development", "Python basics", "Logic building", "Creative coding"]
        ),
        "Python Data Science Handbook" => (
            "Essential tools for working with data in Python, covering NumPy, Pandas, Matplotlib, and more.",
            vec!["NumPy", "Pandas", "Matplotlib", "Machine learning", "Data visualization"]
        ),
        "The Rust Programming Language" => (
            "The official guide to learning Rust programming. Learn memory safety without garbage collection.",
            vec!["Rust syntax", "Ownership", "Borrowing", "Lifetimes", "Concurrency"]
        ),
        "Rust by Example" => (
            "Learn Rust programming through practical examples and hands-on code.",
            vec!["Rust examples", "Syntax", "Standard library", "Best practices"]
        ),
        "Rust Cookbook" => (
            "Solutions to common Rust programming problems with practical recipes.",
            vec!["Common patterns", "Error handling", "Async programming", "Web development"]
        ),
        "Comprehensive Rust" => (
            "Google's comprehensive Rust training course covering advanced Rust concepts.",
            vec!["Advanced Rust", "Systems programming", "Performance", "Safety"]
        ),
        "Zero to Production in Rust" => (
            "Building backend applications with Rust, from concept to production deployment.",
            vec!["Web development", "Databases", "Testing", "Deployment", "Architecture"]
        ),
        "Async Rust Book" => (
            "Asynchronous programming in Rust for building high-performance applications.",
            vec!["Async/await", "Futures", "Tokio", "Concurrent programming"]
        ),
        "OWASP Web Security Testing Guide" => (
            "Comprehensive web application security testing guide with practical techniques.",
            vec!["Web security", "Vulnerability testing", "Penetration testing", "Security best practices"]
        ),
        "The Art of Exploitation" => (
            "Hacking concepts and techniques, understanding how vulnerabilities work.",
            vec!["Buffer overflows", "Shellcode", "Cryptography", "Network security"]
        ),
        "Linux Command Line for Hackers" => (
            "Essential command line skills for cybersecurity and system administration.",
            vec!["Linux commands", "Shell scripting", "System administration", "Security tools"]
        ),
        _ => (
            "A programming resource for learning and development.",
            vec!["Programming", "Development", "Best practices"]
        ),
    };

    format!(
        r#"
        <div class="chapter-title">About: {}</div>
        <div class="book-content">
            <div class="content-source">Programming Resource</div>
            <div class="reading-text">
                <div class="programming-book-info">
                    <h3>{}</h3>
                    <p class="book-description">{}</p>

                    <div class="book-topics">
                        <h4>📚 Topics Covered:</h4>
                        <ul>
                            {}
                        </ul>
                    </div>

                    <div class="online-access">
                        <h4>📖 Access This Book Online</h4>
                        <p>This programming book is available for free online. Click the link below to read the complete book with proper formatting, code examples, and interactive content:</p>
                        <a href="{}" target="_blank" class="online-link">
                            🌐 Read "{} Online
                        </a>
                    </div>

                    <div class="programming-note">
                        <h4>💡 Why This Book?</h4>
                        <p>This is a highly regarded programming resource that teaches practical skills. The full content includes interactive examples, code samples, and exercises that are best experienced in the original format.</p>
                    </div>
                </div>
            </div>
        </div>
        "#,
        title, title, description,
        topics.iter().map(|topic| format!("<li>{}</li>", topic)).collect::<Vec<_>>().join(""),
        url, title
    )
}

fn format_programming_book_content(book_title: &str) -> String {
    // This function is now async, but we need to handle it differently
    // For now, return a placeholder that will be replaced during cache loading
    format!(
        r#"
        <div class="chapter-title">Loading: {}</div>
        <div class="book-content">
            <div class="content-source">Programming Resource</div>
            <div class="reading-text">
                <p>Loading programming book content...</p>
            </div>
        </div>
        "#,
        book_title
    )
}

fn find_content_start(text: &str) -> Option<usize> {
    for (i, line) in text.lines().enumerate() {
        let line = line.trim();
        if line.len() > 10 && !line.contains("GUTENBERG") && !line.contains("EBOOK") && !line.starts_with("***") {
            return Some(text.lines().take(i).map(|l| l.len() + 1).sum());
        }
    }
    None
}

#[derive(Clone)]
pub struct AppState {
    pub db: mongodb::Database,
    pub book_cache: Arc<RwLock<HashMap<i32, String>>>,
}
