let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 12;

async function initSite() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error("Could not find data.json");
        
        allMovies = await response.json();
        filteredMovies = allMovies;
        renderGallery();
        
        // Search Logic
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
        console.error("Critical Error: Check data.json syntax.", err);
        const grid = document.getElementById('movie-display');
        if(grid) grid.innerHTML = `<h3 style="color:red; text-align:center;">Database Error: Check Console</h3>`;
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
        const isTrending = parseFloat(movie.rating) >= 9.0;
        const cardClass = isTrending ? 'movie-card trending-card' : 'movie-card';

        // Fix: Ensure stream_url is checked properly
        const watchButton = (movie.stream_url && movie.stream_url.trim() !== "") 
            ? `<button onclick="watchMovie('${movie.stream_url}')" class="watch-btn" style="flex:1; background:#e50914; color:white; border:none; border-radius:4px; cursor:pointer; height:40px;">Watch</button>` 
            : '';

        grid.innerHTML += `
            <div class="${cardClass}">
                <div class="poster-container">
                    ${isTrending ? '<span class="trending-tag">🔥 Trending</span>' : ''}
                    <span class="genre-tag">${movie.genre.split(',')[0]}</span>
                    <span class="rating-badge">⭐ ${movie.rating || '8.5'}</span>
                    <span class="size-badge">${movie.size || 'N/A'}</span>
                    <img src="${movie.poster_src}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'">
                </div>
                <div class="card-info">
                    <h3 class="film-title">${movie.title}</h3>
                    <p>${movie.year} | ${movie.quality}</p>
                    <div class="button-group" style="display:flex; gap:10px; margin-top:10px;">
                        <button onclick="handleDownload('${movie.download_url}')" class="download-btn" style="flex:1; height:40px; background:#2ecc71; color:white; border:none; border-radius:4px; cursor:pointer;">Download</button>
                        ${watchButton}
                    </div>
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

// Global Handlers
window.handleDownload = function(url) {
    const adsterraLink = "YOUR_SMARTLINK_HERE"; // Replace this!
    window.open(adsterraLink, '_blank');
    window.location.href = url;
};

window.watchMovie = function(url) {
    const modal = document.getElementById("videoModal");
    const player = document.getElementById("videoPlayer");
    if(modal && player) {
        player.src = url;
        modal.style.display = "block";
    }
};

// Start Site
initSite();
