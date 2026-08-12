document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const searchInput = document.getElementById('searchInput');
    let allMovies = [];

    // Simulate fetching from an API (our local movies.json file)
    fetch('movies.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movies => {
            allMovies = movies; // Store all movies for filtering
            
            // Group movies by year and sort by rating
            const groupedAndSorted = processMovies(allMovies);
            
            // Render the UI
            renderMovies(groupedAndSorted, appContainer);
        })
        .catch(error => {
            appContainer.innerHTML = `<div class="loader" style="color: red;">Error loading data: ${error.message}</div>`;
            console.error('Error fetching movies:', error);
        });

    // Add search event listener
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Filter movies based on title
        const filteredMovies = allMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm)
        );
        
        const groupedAndSorted = processMovies(filteredMovies);
        renderMovies(groupedAndSorted, appContainer);
    });
});

function processMovies(movies) {
    // 1. Group movies by year
    const grouped = movies.reduce((acc, movie) => {
        if (!acc[movie.year]) {
            acc[movie.year] = [];
        }
        acc[movie.year].push(movie);
        return acc;
    }, {});

    // 2. Sort movies within each year by rating (high to low)
    for (const year in grouped) {
        grouped[year].sort((a, b) => b.rating - a.rating);
    }

    return grouped;
}

function renderMovies(groupedMovies, container) {
    // Clear loader
    container.innerHTML = '';

    // 3. Get years and sort them descending (e.g., 2026 to 2023)
    const sortedYears = Object.keys(groupedMovies).sort((a, b) => b - a);

    if (sortedYears.length === 0) {
        container.innerHTML = `<p style="text-align:center;">No movies found.</p>`;
        return;
    }

    // 4. Iterate over sorted years and create sections
    sortedYears.forEach((year, index) => {
        const yearSection = document.createElement('section');
        yearSection.className = 'year-section';
        // Add staggered animation delay
        yearSection.style.animationDelay = `${index * 0.15}s`;

        // Create Year Title
        const yearTitle = document.createElement('h2');
        yearTitle.className = 'year-title';
        yearTitle.innerHTML = `<span class="year-badge">${year}</span> Releases`;
        yearSection.appendChild(yearTitle);

        // Create Grid for Movies
        const moviesGrid = document.createElement('div');
        moviesGrid.className = 'movies-grid';

        // Add Movie Cards
        groupedMovies[year].forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';

            movieCard.innerHTML = `
                <div class="poster-container">
                    <img src="${movie.poster}" alt="${movie.title} Poster" class="poster-img" loading="lazy" onerror="this.src='https://placehold.co/500x750/1e293b/ec4899?text=${encodeURIComponent(movie.title)}'">
                    <div class="rating-badge">★ IMDb ${movie.rating.toFixed(1)}</div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                    <div class="movie-meta">${movie.genre || 'Bollywood'}</div>
                    ${movie.director && movie.director !== 'N/A' ? `<div class="movie-director" style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Dir: ${movie.director}</div>` : ''}
                </div>
            `;
            
            moviesGrid.appendChild(movieCard);
        });

        yearSection.appendChild(moviesGrid);
        container.appendChild(yearSection);
    });
}
