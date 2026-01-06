// --- 1. Global Variables ---
let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 12;

// --- 2. Initialize Site ---
async function initSite() {
    const grid = document.getElementById('movie-display');
    if (!grid) return;

    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        allMovies = data;
        filteredMovies = data;
        
        renderGallery();
        console.log("Database loaded successfully!");

    } catch (err) {
        console.error("JSON Error:", err);
        grid.innerHTML = `<div style="color:white;text-align:center;padding:50px;grid-column:1/-1;">
            <h2 style="color:#e50914;">Database Error</h2>
            <p>${err.message}</p>
        </div>`;
    }
}

// --- 3. Render Gallery (Updated to show Genre) ---
function renderGallery() {
    const grid = document.getElementById('movie-display');
    if (!grid) return;
    grid.innerHTML = '';

    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const currentItems = filteredMovies.slice(start, end);

    currentItems.forEach(movie => {
        // We create a variable for genre. If it's missing in JSON, we show "N/A"
        const genreText = movie.genre ? movie.genre : "General";

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
                    <p style="color: #e50914; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">${genreText}</p>
                    <p>${movie.year} | ${movie.quality} | ${movie.size}</p>
                    
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
    const adsterraLink = "https://your-adsterra-smartlink.com"; // <-- PUT YOUR ACTUAL LINK HERE
    
    // 1. Open Adsterra in a new tab
    window.open(adsterraLink, '_blank');
    
    // 2. Wait 500ms before starting the movie download to ensure the ad registers
    setTimeout(() => {
        window.location.href = url;
    }, 500);
};

window.watchMovie = function(url) {
    const modal = document.getElementById("videoModal");
    const player = document.getElementById("videoPlayer");
    if(modal && player) {
        player.src = url;
        modal.style.display = "flex"; // Changed to flex for centering
    }
};

// Function to close the modal
window.closeModal = function() {
    const modal = document.getElementById("videoModal");
    const player = document.getElementById("videoPlayer");
    if(modal && player) {
        modal.style.display = "none";
        player.src = ""; // Stops the video sound when closed
    }
}

// --- 5. Run ---
initSite();
