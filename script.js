let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 12;

async function initSite() {
    try {
        const response = await fetch('./data.json');
        allMovies = await response.json();
        filteredMovies = allMovies;
        renderGallery();
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                filteredMovies = allMovies.filter(movie => 
                    movie.title.toLowerCase().includes(term)
                );
                currentPage = 1; 
                renderGallery(); 
            });
        }
    } catch (err) {
        console.error("Failed to load movies:", err);
    }
}

function renderGallery() {
    const grid = document.getElementById('movie-display');
    const nav = document.getElementById('pagination-nav');
    
    if (!grid || !nav) return; 
    grid.innerHTML = '';
    
    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const currentItems = filteredMovies.slice(start, end);

    if (currentItems.length === 0) {
        grid.innerHTML = `<h3 style="color:white; text-align:center; grid-column:1/-1;">No results found.</h3>`;
    }

 currentItems.forEach(movie => {
    // Check if the rating is 9.0 or higher
    const isTrending = parseFloat(movie.rating) >= 9.0;
    // If it is trending, we add the 'trending-card' class
    const cardClass = isTrending ? 'movie-card trending-card' : 'movie-card';

    grid.innerHTML += `
        <div class="${cardClass}">
            <div class="poster-container">
                ${isTrending ? '<span class="trending-tag">🔥 Trending</span>' : ''}
                <span class="genre-tag">${movie.genre.split(',')[0]}</span>
                <span class="rating-badge">⭐ ${movie.rating || '8.5'}</span>
                <span class="size-badge">${movie.size || 'N/A'}</span>
                <img src="${movie.poster_src}" alt="${movie.title}">
            </div>
            <div class="card-info">
                <h3 class="film-title">${movie.title}</h3>
                <p>${movie.year} | ${movie.quality}</p>
                <a href="${movie.download_url}" class="download-btn" target="_blank">Download</a>
            </div>
        </div>`;
});

    renderPagination(nav);
}

function renderPagination(navElement) {
    const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
    navElement.innerHTML = '';
    
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = (i === currentPage) ? 'page-btn active' : 'page-btn';
        btn.onclick = () => { 
            currentPage = i; 
            renderGallery(); 
            window.scrollTo({top: 0, behavior: 'smooth'}); 
        };
        navElement.appendChild(btn);
    }
}

// Filter functions
window.filterByType = (type) => {
    filteredMovies = allMovies.filter(m => m.type === type);
    currentPage = 1;
    renderGallery();
};

window.filterByGenre = (genre) => {
    filteredMovies = allMovies.filter(m => m.genre.toLowerCase().includes(genre.toLowerCase()));
    currentPage = 1;
    renderGallery();
};

window.resetFilters = () => {
    if(document.getElementById('searchInput')) document.getElementById('searchInput').value = ''; 
    filteredMovies = allMovies;
    currentPage = 1;
    renderGallery();
};
initSite();