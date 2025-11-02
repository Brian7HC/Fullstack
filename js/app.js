// Mock data for demonstration (expanded from Open Library styles)
const mockBooks = [
    // Fiction
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg", description: "A classic novel set in the Jazz Age...", readable: true, year: 1925, language: "en", genre: "fiction", rating: 4.2 },
    { id: 2, title: "Pride and Prejudice", author: "Jane Austen", cover: "https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg", description: "A romance novel...", readable: true, year: 1813, language: "en", genre: "fiction", rating: 4.3 },
    { id: 3, title: "Frankenstein", author: "Mary Shelley", cover: "https://covers.openlibrary.org/b/isbn/9780142437260-M.jpg", description: "The classic horror novel...", readable: true, year: 1818, language: "en", genre: "fiction", rating: 3.9 },
    { id: 4, title: "Wuthering Heights", author: "Emily Brontë", cover: "https://covers.openlibrary.org/b/isbn/9780141439556-M.jpg", description: "A tale of passion and revenge...", readable: true, year: 1847, language: "en", genre: "fiction", rating: 3.9 },
    { id: 5, title: "Jane Eyre", author: "Charlotte Brontë", cover: "https://covers.openlibrary.org/b/isbn/9780141441146-M.jpg", description: "A story of love and independence...", readable: true, year: 1847, language: "en", genre: "fiction", rating: 4.1 },
    { id: 6, title: "Little Women", author: "Louisa May Alcott", cover: "https://covers.openlibrary.org/b/isbn/9780142437239-M.jpg", description: "The story of the March sisters...", readable: true, year: 1868, language: "en", genre: "fiction", rating: 4.1 },

    // Fantasy
    { id: 7, title: "The Wonderful Wizard of Oz", author: "L. Frank Baum", cover: "https://covers.openlibrary.org/b/isbn/9780060293239-M.jpg", description: "A magical journey down the yellow brick road...", readable: true, year: 1900, language: "en", genre: "fantasy", rating: 4.0 },
    { id: 8, title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", cover: "https://covers.openlibrary.org/b/isbn/9780141439761-M.jpg", description: "A whimsical tale...", readable: true, year: 1865, language: "en", genre: "fantasy", rating: 4.5 },
    { id: 9, title: "Peter Pan", author: "J.M. Barrie", cover: "https://covers.openlibrary.org/b/isbn/9780142437963-M.jpg", description: "The boy who never grows up...", readable: true, year: 1911, language: "en", genre: "fantasy", rating: 4.0 },

    // Science Fiction
    { id: 10, title: "The War of the Worlds", author: "H.G. Wells", cover: "https://covers.openlibrary.org/b/isbn/9780141441030-M.jpg", description: "Martian invasion of Earth...", readable: true, year: 1898, language: "en", genre: "sci-fi", rating: 3.8 },
    { id: 11, title: "The Time Machine", author: "H.G. Wells", cover: "https://covers.openlibrary.org/b/isbn/9780141439975-M.jpg", description: "A journey through time...", readable: true, year: 1895, language: "en", genre: "sci-fi", rating: 3.9 },
    { id: 12, title: "Twenty Thousand Leagues Under the Sea", author: "Jules Verne", cover: "https://covers.openlibrary.org/b/isbn/9780140449276-M.jpg", description: "An underwater adventure...", readable: true, year: 1870, language: "en", genre: "sci-fi", rating: 3.9 },
    { id: 13, title: "The Invisible Man", author: "H.G. Wells", cover: "https://covers.openlibrary.org/b/isbn/9780141439982-M.jpg", description: "A scientist discovers invisibility...", readable: true, year: 1897, language: "en", genre: "sci-fi", rating: 3.7 },

    // Children & Young Readers
    { id: 14, title: "The Adventures of Tom Sawyer", author: "Mark Twain", cover: "https://covers.openlibrary.org/b/isbn/9780142437178-M.jpg", description: "The classic American adventure...", readable: true, year: 1876, language: "en", genre: "children", rating: 4.1 },
    { id: 15, title: "Treasure Island", author: "Robert Louis Stevenson", cover: "https://covers.openlibrary.org/b/isbn/9780141321004-M.jpg", description: "Pirate treasure hunt...", readable: true, year: 1883, language: "en", genre: "children", rating: 4.1 },
    { id: 16, title: "Black Beauty", author: "Anna Sewell", cover: "https://covers.openlibrary.org/b/isbn/9780141321035-M.jpg", description: "The autobiography of a horse...", readable: true, year: 1877, language: "en", genre: "children", rating: 4.0 },
    { id: 17, title: "Heidi", author: "Johanna Spyri", cover: "https://covers.openlibrary.org/b/isbn/9780141322568-M.jpg", description: "A girl in the Swiss Alps...", readable: true, year: 1880, language: "en", genre: "children", rating: 4.0 },
    { id: 18, title: "The Secret Garden", author: "Frances Hodgson Burnett", cover: "https://covers.openlibrary.org/b/isbn/9780142437017-M.jpg", description: "A magical garden transforms lives...", readable: true, year: 1911, language: "en", genre: "children", rating: 4.2 },
    { id: 19, title: "A Little Princess", author: "Frances Hodgson Burnett", cover: "https://covers.openlibrary.org/b/isbn/9780142437970-M.jpg", description: "A wealthy girl becomes poor...", readable: true, year: 1905, language: "en", genre: "children", rating: 4.1 },

    // Python Programming
    { id: 20, title: "Automate the Boring Stuff with Python", author: "Al Sweigart", cover: "https://covers.openlibrary.org/b/isbn/9781593275990-M.jpg", description: "Practical programming for total beginners...", readable: true, year: 2015, language: "en", genre: "python", rating: 4.6 },
    { id: 21, title: "Think Python (2nd Edition)", author: "Allen B. Downey", cover: "https://covers.openlibrary.org/b/isbn/9781491939369-M.jpg", description: "How to Think Like a Computer Scientist...", readable: true, year: 2016, language: "en", genre: "python", rating: 4.2 },
    { id: 22, title: "A Byte of Python", author: "Swaroop C H", cover: "https://covers.openlibrary.org/b/isbn/9789352132583-M.jpg", description: "A beginner's guide to Python programming...", readable: true, year: 2013, language: "en", genre: "python", rating: 4.0 },
    { id: 23, title: "Python for Everybody", author: "Charles Severance", cover: "https://covers.openlibrary.org/b/isbn/9781530051120-M.jpg", description: "Exploring Data Using Python, HTML, and CSS...", readable: true, year: 2016, language: "en", genre: "python", rating: 4.1 },
    { id: 24, title: "Dive Into Python 3", author: "Mark Pilgrim", cover: "https://covers.openlibrary.org/b/isbn/9781430232873-M.jpg", description: "A comprehensive guide to Python 3...", readable: true, year: 2009, language: "en", genre: "python", rating: 4.3 },
    { id: 25, title: "Invent with Python", author: "Al Sweigart", cover: "https://covers.openlibrary.org/b/isbn/9781593277956-M.jpg", description: "Learn programming by making games...", readable: true, year: 2016, language: "en", genre: "python", rating: 4.4 },
    { id: 26, title: "Python Data Science Handbook", author: "Jake VanderPlas", cover: "https://covers.openlibrary.org/b/isbn/9781491912058-M.jpg", description: "Essential tools for working with data in Python...", readable: true, year: 2016, language: "en", genre: "python", rating: 4.5 },

    // Rust Programming
    { id: 27, title: "The Rust Programming Language", author: "Steve Klabnik & Carol Nichols", cover: "https://covers.openlibrary.org/b/isbn/9781718500457-M.jpg", description: "The official Rust programming language book...", readable: true, year: 2022, language: "en", genre: "rust", rating: 4.7 },
    { id: 28, title: "Rust by Example", author: "The Rust Team", cover: "https://covers.openlibrary.org/b/isbn/9781718501836-M.jpg", description: "Learn Rust through practical examples...", readable: true, year: 2022, language: "en", genre: "rust", rating: 4.4 },
    { id: 29, title: "Rust Cookbook", author: "Rust Team", cover: "https://covers.openlibrary.org/b/isbn/9781789530667-M.jpg", description: "Solutions to common Rust programming problems...", readable: true, year: 2019, language: "en", genre: "rust", rating: 4.2 },
    { id: 30, title: "Comprehensive Rust", author: "Google", cover: "https://covers.openlibrary.org/b/isbn/9781718501843-M.jpg", description: "Google's comprehensive Rust training course...", readable: true, year: 2023, language: "en", genre: "rust", rating: 4.6 },
    { id: 31, title: "Zero to Production in Rust", author: "Luca Palmieri", cover: "https://covers.openlibrary.org/b/isbn/9783903166063-M.jpg", description: "Building backend applications with Rust...", readable: true, year: 2020, language: "en", genre: "rust", rating: 4.5 },
    { id: 32, title: "Async Rust Book", author: "Rust Team", cover: "https://covers.openlibrary.org/b/isbn/9781718501843-M.jpg", description: "Asynchronous programming in Rust...", readable: true, year: 2023, language: "en", genre: "rust", rating: 4.3 },

    // Cybersecurity
    { id: 33, title: "OWASP Web Security Testing Guide", author: "OWASP", cover: "https://covers.openlibrary.org/b/isbn/9781604200244-M.jpg", description: "Comprehensive web application security testing...", readable: true, year: 2008, language: "en", genre: "cybersecurity", rating: 4.2 },
    { id: 34, title: "The Art of Exploitation", author: "Jon Erickson", cover: "https://covers.openlibrary.org/b/isbn/9781593270070-M.jpg", description: "Hacking concepts and techniques...", readable: true, year: 2008, language: "en", genre: "cybersecurity", rating: 4.1 },
    { id: 35, title: "Linux Command Line for Hackers", author: "William Pollock", cover: "https://covers.openlibrary.org/b/isbn/9781718501768-M.jpg", description: "Essential command line skills for cybersecurity...", readable: true, year: 2021, language: "en", genre: "cybersecurity", rating: 4.0 }
];

const trendingBooks = mockBooks.slice(0, 12); // First 12
const newBooks = [...mockBooks.slice(1, 7), ...mockBooks.slice(10, 15)]; // Mix
const topRatedBooks = mockBooks.sort((a,b) => b.rating - a.rating).slice(0, 10);
const childrenBooks = mockBooks.filter(b => b.genre === 'children').slice(0, 10);

// Backend API URL
const BACKEND_URL = 'http://127.0.0.1:8081';

let authToken = localStorage.getItem('authToken');
let userInfo = null;

try {
    userInfo = authToken ? JSON.parse(localStorage.getItem('userInfo')) : null;
} catch (e) {
    console.error('Error parsing user info:', e);
    userInfo = null;
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
}

let currentRole = (authToken && userInfo) ? (userInfo.role === 'admin' ? 'admin' : 'user') : 'guest';
let userName = userInfo ? userInfo.username : 'User';
let myLibrary = JSON.parse(localStorage.getItem('myLibrary') || '[]');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let reviews = JSON.parse(localStorage.getItem('reviews') || '{}');

// Utility functions
function updateUIForRole() {
    document.querySelectorAll('.guest-only').forEach(el => el.classList.toggle('hidden', currentRole !== 'guest'));
    document.querySelectorAll('.user-only').forEach(el => el.classList.toggle('hidden', currentRole === 'guest'));
    document.querySelectorAll('.admin-only').forEach(el => el.classList.toggle('hidden', currentRole !== 'admin'));
}

function setRole(role) {
    currentRole = role;
    localStorage.setItem('currentRole', role);
    updateUIForRole();
    if (role === 'user' || role === 'admin') {
        document.getElementById('welcome-msg').textContent = `Welcome back, ${userName}!`;
    } else {
        // Reset welcome message for guests
        document.getElementById('welcome-msg').textContent = 'Welcome back!';
    }
}

// Fetch functions (mock)
async function fetchTrending() {
    return new Promise(resolve => setTimeout(() => resolve(trendingBooks), 500));
}

async function fetchNew() {
    return new Promise(resolve => setTimeout(() => resolve(newBooks), 500));
}

async function fetchTopRated() {
    return new Promise(resolve => setTimeout(() => resolve(topRatedBooks), 500));
}

async function fetchChildren() {
    return new Promise(resolve => setTimeout(() => resolve(childrenBooks), 500));
}

async function fetchClassics() {
    return new Promise(resolve => setTimeout(() => resolve(mockBooks.filter(b => b.year < 1970)), 500));
}

async function fetchSciFi() {
    return new Promise(resolve => setTimeout(() => resolve(mockBooks.filter(b => b.genre === 'sci-fi' || b.genre === 'fantasy')), 500));
}

async function fetchBooksByGenre(genre) {
    return new Promise(resolve => setTimeout(() => resolve(mockBooks.filter(b => b.genre === genre)), 500));
}

async function fetchSearch(query) {
    return new Promise(resolve => setTimeout(() => resolve(mockBooks.filter(b => b.title.toLowerCase().includes(query.toLowerCase()))), 500));
}

// Create book card
function createBookCard(book, onReadClick, onAddClick) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <img class="book-cover" src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/200x250/f7f2e7/5c4642?text=No+Cover'">
        <div class="book-info">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <button class="btn read-btn">Read Now</button>
            <button class="btn add-btn" ${currentRole === 'guest' ? 'disabled' : ''} data-tooltip="${currentRole === 'guest' ? 'Login to use this feature' : ''}">Add to Library</button>
        </div>
    `;
    card.querySelector('.read-btn').addEventListener('click', () => onReadClick(book));
    card.querySelector('.add-btn').addEventListener('click', () => onAddClick(book));
    return card;
}

// Load carousel
async function loadCarousel(container, fetchFunc, onRead, onAdd) {
    try {
        const books = await fetchFunc();
        container.innerHTML = '';
        books.forEach(book => {
            container.appendChild(createBookCard(book, onRead, onAdd));
        });
    } catch (e) {
        console.error(e);
    }
}

function onReadClick(book) {
    if (currentRole === 'guest') {
        showErrorModal();
    } else {
        showReader(book);
    }
}

function onAddClick(book) {
    if (currentRole !== 'guest') {
        myLibrary.push(book);
        localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
        alert('Added to library!');
    }
}

// Search
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const suggestions = document.getElementById('search-suggestions');

async function performSearch() {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        try {
            const results = await fetchSearch(query);
            if (results.length === 0) {
                // No matches
                showNoResultsModal();
            } else {
                // Show grid with results
                filteredBooks = results;
                showSection('book-grid-section');
                loadBookGrid();
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        suggestions.classList.add('hidden');
        showSection('home');
    }
}

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

searchBtn.addEventListener('click', performSearch);

searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        try {
            const results = await fetchSearch(query);
            filteredBooks = results;
            showSection('book-grid-section');
            loadBookGrid();
        } catch (e) {
            console.error(e);
        }
    } else {
        // No query, stay in home
        showSection('home');
    }
});

// Show sections
function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(s => s.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    if (sectionId === 'my-library') loadLibrary();
    if (sectionId === 'book-grid-section') loadBookGrid();
}

async function fetchGenres() {
    return new Promise(resolve => setTimeout(() => resolve(['fiction', 'fantasy', 'sci-fi', 'children', 'python', 'rust', 'cybersecurity']), 300));
}

async function loadGenres() {
    const container = document.getElementById('header-genres');
    try {
        const genres = await fetchGenres();
        container.innerHTML = '';
        genres.forEach(genre => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
            btn.addEventListener('click', async () => {
                const books = await fetchBooksByGenre(genre);
                filteredBooks = books;
                showSection('book-grid-section');
                loadBookGrid();
            });
            container.appendChild(btn);
        });
    } catch (e) {
        console.error(e);
    }
}

// Filters
const languageFilter = document.getElementById('language-filter');
const yearFilter = document.getElementById('year-filter');
const authorFilter = document.getElementById('author-filter');
const readableOnly = document.getElementById('readable-only');

let filteredBooks = mockBooks.slice();

function applyFilters() {
    let books = mockBooks.slice();
    if (languageFilter.value) {
        books = books.filter(b => b.language === languageFilter.value);
    }
    if (yearFilter.value) {
        books = books.filter(b => b.year == yearFilter.value);
    }
    if (authorFilter.value.trim()) {
        const auth = authorFilter.value.toLowerCase();
        books = books.filter(b => b.author.toLowerCase().includes(auth));
    }
    if (readableOnly.checked) {
        books = books.filter(b => b.readable);
    }
    filteredBooks = books;
    loadBookGrid();
}

languageFilter.addEventListener('change', applyFilters);
yearFilter.addEventListener('input', applyFilters);
authorFilter.addEventListener('input', applyFilters);
readableOnly.addEventListener('change', applyFilters);

function loadBookGrid() {
    const grid = document.getElementById('book-grid');
    grid.innerHTML = '';
    filteredBooks.forEach(book => {
        grid.appendChild(createBookCard(book, onReadClick, onAddClick));
    });
}

// Book detail
function showBookDetail(book) {
    document.getElementById('detail-cover').src = book.cover;
    document.getElementById('detail-title').textContent = book.title;
    document.getElementById('detail-author').textContent = `by ${book.author}`;
    document.getElementById('detail-description').textContent = book.description;
    document.getElementById('detail-read-btn').disabled = !book.readable;
    document.getElementById('detail-add-btn').disabled = currentRole === 'guest';

    loadCarousel(document.getElementById('similar-books'), () => Promise.resolve([mockBooks[0], mockBooks[1]]), onReadClick, onAddClick);

    // Ratings and reviews
    const allRatings = [];
    for (const b in reviews) {
        if (reviews[b].rating) allRatings.push(reviews[b].rating);
    }
    const avg = allRatings.length > 0 ? (allRatings.reduce((a,b)=>a+b)/allRatings.length).toFixed(1) : book.rating;
    document.getElementById('avg-rating').textContent = avg;
    document.getElementById('rating-count').textContent = allRatings.length;

    if (currentRole !== 'guest') {
        // Favorite
        const favBtn = document.getElementById('favorite-btn');
        if (favorites.includes(book.id)) {
            favBtn.textContent = '💔 Unfavorite';
        } else {
            favBtn.textContent = '❤️ Favorite';
        }
        // User rating
        const userRatingStars = document.querySelectorAll('#user-rating-stars .star');
        const userRating = reviews[book.id]?.rating || 0;
        userRatingStars.forEach((s, i) => {
            s.classList.toggle('selected', i < userRating);
        });
        // User review
        document.getElementById('user-review').value = reviews[book.id]?.review || '';

        // Show reviews
        const reviewsDiv = document.getElementById('reviews');
        reviewsDiv.innerHTML = '';
        if (reviews[book.id] && reviews[book.id].review) {
            const revDiv = document.createElement('div');
            revDiv.className = 'review';
            revDiv.innerHTML = `<strong>You:</strong> ${reviews[book.id].review}`;
            reviewsDiv.appendChild(revDiv);
        }
    }

    document.getElementById('book-detail').classList.remove('hidden');
}

document.getElementById('close-detail').addEventListener('click', () => {
    document.getElementById('book-detail').classList.add('hidden');
});

document.getElementById('detail-read-btn').addEventListener('click', () => {
    const title = document.getElementById('detail-title').textContent;
    const book = mockBooks.find(b => b.title === title.split(' by ')[0]);
    if (currentRole === 'guest') {
        showErrorModal();
    } else {
        showReader(book);
    }
});

function showErrorModal() {
    document.getElementById('error-modal').classList.add('show');
}

document.getElementById('error-login-btn').addEventListener('click', () => {
    window.location.href = 'login.html';
});

document.getElementById('error-close-btn').addEventListener('click', () => {
    document.getElementById('error-modal').classList.remove('show');
});

function showNoResultsModal() {
    document.getElementById('no-results-modal').classList.add('show');
}

document.getElementById('no-results-close-btn').addEventListener('click', () => {
    document.getElementById('no-results-modal').classList.remove('show');
    // Optionally clear search
    searchInput.value = '';
    suggestions.classList.add('hidden');
    showSection('home');
});

document.getElementById('detail-add-btn').addEventListener('click', () => {
    const title = document.getElementById('detail-title').textContent;
    const book = mockBooks.find(b => b.title === title.split(' by ')[0]);
    onAddClick(book);
});

// Favorite
document.getElementById('favorite-btn').addEventListener('click', () => {
    const title = document.getElementById('detail-title').textContent;
    const book = mockBooks.find(b => b.title === title.split(' by ')[0]);
    const idx = favorites.indexOf(book.id);
    const btn = document.getElementById('favorite-btn');
    if (idx === -1) {
        favorites.push(book.id);
        btn.textContent = '💔 Unfavorite';
    } else {
        favorites.splice(idx, 1);
        btn.textContent = '❤️ Favorite';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
});

// Rating stars
document.getElementById('user-rating-stars').addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        const val = e.target.dataset.value;
        document.querySelectorAll('#user-rating-stars .star').forEach((s, i) => {
            s.classList.toggle('selected', i < val);
        });
    }
});

// Submit review
document.getElementById('submit-review-btn').addEventListener('click', () => {
    const title = document.getElementById('detail-title').textContent;
    const book = mockBooks.find(b => b.title === title.split(' by ')[0]);
    const selectedStars = document.querySelectorAll('#user-rating-stars .selected').length;
    const reviewText = document.getElementById('user-review').value.trim();

    reviews[book.id] = { rating: selectedStars, review: reviewText };
    localStorage.setItem('reviews', JSON.stringify(reviews));
    showBookDetail(book); // Refresh average
    alert('Review submitted!');
});



// Reader functionality
let currentBook = null;

async function showReader(book) {
    if (!book.readable) {
        alert('This book is not available for reading yet.');
        return;
    }

    currentBook = book;

    // Set book info
    document.getElementById('reader-title').textContent = book.title;
    document.getElementById('reader-author').textContent = `by ${book.author}`;

    try {
        // Fetch book content from API
        const response = await fetch(`${BACKEND_URL}/books/${book.id}/content`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch book content');
        }

        const contentData = await response.json();

        // Display the entire book content in a scrollable container
        displayBookContent(contentData.content);

        showSection('reader');
    } catch (error) {
        console.error('Error fetching book content:', error);
        alert('Failed to load book content. Please try again.');
    }
}

function displayBookContent(content) {
    const readerText = document.getElementById('reader-text');
    readerText.innerHTML = content;
    // Reset scroll position to top
    readerText.scrollTop = 0;
}

document.getElementById('reader-back').addEventListener('click', () => {
    currentBook = null;
    showSection('home');
});

// Bookmark functionality (basic) - now saves scroll position
document.getElementById('reader-bookmark').addEventListener('click', () => {
    if (currentBook) {
        const readerText = document.getElementById('reader-text');
        const scrollPosition = readerText.scrollTop;
        const bookmarkKey = `bookmark_${currentBook.id}`;
        localStorage.setItem(bookmarkKey, scrollPosition.toString());
        alert(`Bookmarked reading position in "${currentBook.title}"`);
    }
});

// Library
function loadLibrary() {
    const grid = document.getElementById('library-grid');
    grid.innerHTML = '';
    myLibrary.forEach(book => {
        grid.appendChild(createBookCard(book, onReadClick, onAddClick));
    });
}

// Admin - mock CRUD
async function loadBooksTable() {
    try {
        const books = mockBooks; // Simulate fetch
        const tbody = document.getElementById('books-tbody');
        tbody.innerHTML = '';
        books.forEach(book => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>
                    <button class="btn">Edit</button>
                    <button class="btn">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
    }
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const href = link.getAttribute('href');
        if (href === '#my-library') showSection('my-library');
        else if (href === '#categories') showSection('book-grid-section');
        else if (href === '#admin') {
            showSection('admin-dashboard');
            loadUsersTable();
            loadBooksTable();
        } else showSection('home');
    });
});

// Admin events
document.getElementById('add-book-btn').addEventListener('click', () => showAddBookModal());

function showAddBookModal() {
    const modal = document.getElementById('add-book-modal');
    if (!modal) {
        // Create modal if it doesn't exist
        createAddBookModal();
        return;
    }
    modal.classList.add('show');
}

function createAddBookModal() {
    const modal = document.createElement('div');
    modal.id = 'add-book-modal';
    modal.className = 'add-book-modal';
    modal.innerHTML = `
        <div class="add-book-content">
            <h2>Add New Book</h2>
            <form id="add-book-form">
                <div class="form-group">
                    <label for="book-title">Title:</label>
                    <input type="text" id="book-title" required>
                </div>
                <div class="form-group">
                    <label for="book-author">Author:</label>
                    <input type="text" id="book-author" required>
                </div>
                <div class="form-group">
                    <label for="book-description">Description:</label>
                    <textarea id="book-description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="book-cover-url">Cover URL:</label>
                    <input type="url" id="book-cover-url" placeholder="https://example.com/cover.jpg">
                </div>
                <div class="form-group">
                    <label for="book-content-url">Content URL:</label>
                    <input type="url" id="book-content-url" placeholder="https://example.com/book-content">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn">Add Book</button>
                    <button type="button" id="cancel-add-book" class="btn">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Add event listeners
    document.getElementById('add-book-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleAddBook();
    });

    document.getElementById('cancel-add-book').addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.classList.add('show');
}

async function handleAddBook() {
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const description = document.getElementById('book-description').value.trim();
    const coverUrl = document.getElementById('book-cover-url').value.trim();
    const contentUrl = document.getElementById('book-content-url').value.trim();

    if (!title || !author || !description) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const result = await addBook(title, author, description, coverUrl, contentUrl);
        if (result) {
            document.getElementById('add-book-modal').classList.remove('show');
            document.getElementById('add-book-form').reset();
            loadBooksTable(); // Refresh the books table
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
}

function addTableEvents() {
    document.querySelectorAll('#books-tbody .btn:first-child').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tr = e.target.closest('tr');
            const title = tr.children[0].textContent;
            const author = tr.children[1].textContent;

            // Create cool edit prompt
            const editMessage = `
🎨✏️ EDIT BOOK MODE ACTIVATED! ✏️🎨

📖 Book Details:
   Title: "${title}"
   Author: "${author}"

🔧 What would you like to edit?

This would open an edit modal with pre-filled fields for:
• 📝 Title
• ✍️ Author
• 📖 Description
• 🏷️ Genre
• 📅 Publication Year
• 🖼️ Cover Image
• 📄 Content URL

Ready to make this book even better? 🚀
            `;

            alert(editMessage);
        });
    });

    document.querySelectorAll('#books-tbody .btn:last-child').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tr = e.target.closest('tr');
            const title = tr.children[0].textContent;
            const author = tr.children[1].textContent;

            // Create cool delete prompt
            const deleteMessage = `
🚨⚠️ BOOK DELETION PROTOCOL ACTIVATED! ⚠️🚨

📚 Book Target:
   Title: "${title}"
   Author: "${author}"

💀 This action is IRREVERSIBLE!

❌ Consequences:
• Book will be permanently removed from library
• All associated data will be lost
• Users won't be able to read this book anymore
• This cannot be undone!

🔒 Are you absolutely sure you want to DELETE this book?

Type "YES" to confirm deletion, or cancel to keep the book safe.
            `;

            const confirmation = prompt(deleteMessage, '');

            if (confirmation && confirmation.toUpperCase() === 'YES') {
                // Simulate deletion
                const successMessage = `
✅ BOOK SUCCESSFULLY DELETED! ✅

📚 "${title}" by ${author}
🗑️ Has been permanently removed from the library

🔄 Refreshing book list...
                `;
                alert(successMessage);
                tr.remove();
            } else if (confirmation !== null) {
                alert('❌ Deletion cancelled. Book is safe! 📚❤️');
            }
        });
    });
}

// Load admin table with events
async function loadBooksTable() {
    try {
        const books = mockBooks; // Simulate fetch
        const tbody = document.getElementById('books-tbody');
        tbody.innerHTML = '';
        books.forEach(book => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>
                    <button class="btn">Edit</button>
                    <button class="btn">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        addTableEvents();
    } catch (e) {
        console.error(e);
    }
}

// Admin functions
async function loadUsersTable() {
    try {
        const response = await fetch(`${BACKEND_URL}/admin/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        const usersGrid = document.getElementById('users-grid');
        usersGrid.innerHTML = '';

        // Update stats
        const totalUsers = data.users.length;
        const adminUsers = data.users.filter(u => u.role === 'admin').length;
        const regularUsers = totalUsers - adminUsers;

        document.getElementById('total-users').textContent = totalUsers;
        document.getElementById('admin-users').textContent = adminUsers;
        document.getElementById('regular-users').textContent = regularUsers;

        data.users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <div class="user-avatar">
                    <span class="avatar-icon">${user.username.charAt(0).toUpperCase()}</span>
                </div>
                <div class="user-info">
                    <h4 class="user-name">${user.username}</h4>
                    <p class="user-email">${user.email}</p>
                    <div class="user-meta">
                        <span class="user-role role-${user.role}">${user.role}</span>
                        <span class="user-date">Joined: ${new Date(parseInt(user.created_at)).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn delete-user-btn" data-user-id="${user.id}">🗑️ Delete</button>
                </div>
            `;
            usersGrid.appendChild(userCard);
        });

        // Add delete event listeners
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.dataset.userId;
                const userCard = e.target.closest('.user-card');
                const userName = userCard.querySelector('.user-name').textContent;

                // Show simple delete confirmation modal
                showDeleteUserModal(userId, userName);
            });
        });
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Failed to load users');
    }
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`${BACKEND_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        alert('User deleted successfully');
        loadUsersTable(); // Refresh the table
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
    }
}

async function addBook(title, author, description, coverUrl, contentUrl) {
    try {
        const response = await fetch(`${BACKEND_URL}/admin/books`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                author,
                description,
                cover_url: coverUrl,
                content_url: contentUrl
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add book');
        }

        const result = await response.json();
        alert('Book added successfully');
        return result;
    } catch (error) {
        console.error('Error adding book:', error);
        alert('Failed to add book');
    }
}

// Delete User Modal
function showDeleteUserModal(userId, userName) {
    document.getElementById('delete-user-name').textContent = userName;
    document.getElementById('delete-user-modal').classList.add('show');

    // Store user ID for deletion
    document.getElementById('confirm-delete-user-btn').dataset.userId = userId;
}

document.getElementById('confirm-delete-user-btn').addEventListener('click', async () => {
    const userId = document.getElementById('confirm-delete-user-btn').dataset.userId;
    document.getElementById('delete-user-modal').classList.remove('show');
    await deleteUser(userId);
});

document.getElementById('cancel-delete-user-btn').addEventListener('click', () => {
    document.getElementById('delete-user-modal').classList.remove('show');
});

// Logout
document.querySelector('#auth-menu a[href="#logout"]').addEventListener('click', (e) => {
    e.preventDefault();
    setRole('guest');
    showSection('home');
});

// Load carousels on page load
window.addEventListener('load', () => {
    updateUIForRole();
    setRole(currentRole); // Ensure welcome message is set with username
    loadCarousel(document.getElementById('trending-carousel'), fetchTrending, onReadClick, onAddClick);
    loadCarousel(document.getElementById('new-carousel'), fetchNew, onReadClick, onAddClick);
    loadCarousel(document.getElementById('top-rated-carousel'), fetchTopRated, onReadClick, onAddClick);
    loadCarousel(document.getElementById('classics-carousel'), fetchClassics, onReadClick, onAddClick);
    loadCarousel(document.getElementById('sci-fi-carousel'), fetchSciFi, onReadClick, onAddClick);
    loadCarousel(document.getElementById('children-carousel'), fetchChildren, onReadClick, onAddClick);
    loadGenres();


});
