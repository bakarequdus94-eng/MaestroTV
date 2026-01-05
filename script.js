// --- 1. Global Variables ---
let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 12;

// --- 2. Initialize Site (REPLACE YOUR OLD ONE WITH THIS) ---
async function initSite() {
    const grid = document.getElementById('movie-display');
    if (!grid) return;

    try {
        // Try to fetch the data
        const response = await fetch('./data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allMovies = data;
        filteredMovies = data;
        
        renderGallery(); // Start showing the movies
        console.log("Database loaded successfully!");

    } catch (err) {
        console.error("JSON Error:", err);
        // This shows the error directly on your website so you can see it on mobile
        grid.innerHTML = `
            <div style="color:white; text-align:center; padding:50px; grid-column: 1/-1;">
                <h2 style="color:#e50914;">Database Connection Error</h2>
                <p>There is a typo in your data.json file.</p>
                <code style="background:#333; padding:10px; display:block; margin-top:10px;">
                    ${err.message}
                </code>
            </div>`;
    }
}

// --- 3. Render Gallery (Keep this as is) ---
function renderGallery() {
    const grid = document.getElementById('movie-display');
    if (!grid) return;
    grid.innerHTML = '';

    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const currentItems = filteredMovies.slice(start, end);

    currentItems.forEach(movie => {
        const watchButton = (movie.stream_url && movie.stream_url.trim() !== "") 
            ? `<button onclick="watchMovie('${movie.stream_url}')" class="watch-btn" style="flex:1; background:#e50914; color:white; border:none; border-radius:4px; cursor:pointer; height:40px;">Watch</button>` 
            : '';

        grid.innerHTML += `
            <div class="movie-card">
                <div class="poster-container">
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
}

// --- 4. Global Handlers ---
window.handleDownload = function(url) {
    const adsterraLink = "https://your-adsterra-smartlink.com"; // Add your link here
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

// --- 5. Run the script ---
initSite();
