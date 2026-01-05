// REPLACE your current renderGallery function with this one
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

        // LOGIC: Only create the Watch button if stream_url exists
        const watchButton = movie.stream_url 
            ? `<button onclick="watchMovie('${movie.stream_url}')" class="watch-btn" style="flex:1; background:#e50914; color:white; border:none; border-radius:4px; cursor:pointer; height:40px;">Watch</button>` 
            : '';

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
                    <div class="button-group" style="display:flex; gap:10px; margin-top:10px;">
                        <button onclick="handleDownload('${movie.download_url}')" class="download-btn" style="flex:1; height:40px; background:#2ecc71; color:white; border:none; border-radius:4px; cursor:pointer;">Download</button>
                        ${watchButton}
                    </div>
                </div>
            </div>`;
    });

    renderPagination(nav);
}

// NEW FUNCTION: Handle Monetized Download
window.handleDownload = function(nkiriUrl) {
    // 1. YOUR ADSTERRA SMARTLINK (Replace with your actual link from Adsterra dashboard)
    const adsterraLink = "https://your-adsterra-smartlink-here.com"; 

    // 2. Open the Ad in a new tab (you get paid for this click)
    window.open(adsterraLink, '_blank');

    // 3. Send the user to the NKIRI download page in the same window
    window.location.href = nkiriUrl;
}
