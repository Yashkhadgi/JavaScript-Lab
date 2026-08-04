/**
 * Practical 10: Executive Developer Portfolio & API Telemetry Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const API_URL = "https://jsonplaceholder.typicode.com/users";

    const btnFetch = document.getElementById('btn-load-fetch');
    const btnJquery = document.getElementById('btn-load-jquery');
    const searchFilter = document.getElementById('search-filter');

    const teleLatency = document.getElementById('tele-latency');
    const teleCount = document.getElementById('tele-count');
    const teleMethod = document.getElementById('tele-method');

    const developerGridContainer = document.getElementById('developer-grid-container');
    const emptyState = document.getElementById('empty-state');

    const codeTabTitle = document.getElementById('code-tab-title');
    const codeDisplayPre = document.getElementById('code-display-pre');

    let fetchedUsers = [];

    const fetchCodeSnippet = `// Native Fetch API Pipeline
fetch("https://jsonplaceholder.typicode.com/users")
  .then(res => res.json())
  .then(users => renderDeveloperGrid(users));`;

    const jqueryCodeSnippet = `// jQuery $.getJSON Pipeline
$.getJSON("https://jsonplaceholder.typicode.com/users")
  .done(users => renderDeveloperGrid(users));`;

    function getInitials(name) {
        const parts = name.split(/\s+/);
        let initials = "";
        if (parts.length > 0) initials += parts[0][0];
        if (parts.length > 1) initials += parts[parts.length - 1][0];
        return initials.toUpperCase();
    }

    function getRandomColor() {
        const colors = ['#00E5FF', '#818CF8', '#10B981', '#F59E0B', '#EC4899'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function renderGrid() {
        developerGridContainer.innerHTML = "";

        const query = searchFilter.value.trim().toLowerCase();

        const filtered = fetchedUsers.filter(user => {
            if (query === "") return true;
            return user.name.toLowerCase().includes(query) ||
                   user.email.toLowerCase().includes(query) ||
                   (user.address && user.address.city.toLowerCase().includes(query));
        });

        if (filtered.length === 0) {
            developerGridContainer.innerHTML = '<div style="grid-column:span 2; padding:2rem; text-align:center; color:#94A3B8; font-size:0.8rem;">No developers match query.</div>';
            teleCount.textContent = "00";
            return;
        }

        teleCount.textContent = filtered.length < 10 ? `0${filtered.length}` : filtered.length;

        filtered.forEach(user => {
            const card = document.createElement('div');
            card.className = 'developer-card';

            const initials = getInitials(user.name);
            const avatarBg = getRandomColor();
            const city = user.address ? user.address.city : "Remote";
            const company = user.company ? user.company.name : "Tech Corp";

            card.innerHTML = `
                <div class="dev-card-head">
                    <div class="dev-avatar" style="background-color: ${avatarBg}">${initials}</div>
                    <span class="dev-name">${user.name}</span>
                </div>
                <div class="dev-meta-line"><i class="fa-regular fa-envelope"></i> ${user.email}</div>
                <div class="dev-meta-line"><i class="fa-solid fa-location-dot"></i> ${city} &bull; ${company}</div>
            `;

            developerGridContainer.appendChild(card);
        });
    }

    searchFilter.addEventListener('input', renderGrid);

    // FETCH API PIPELINE
    btnFetch.addEventListener('click', () => {
        developerGridContainer.innerHTML = '<div style="grid-column:span 2; padding:2rem; text-align:center; color:#00E5FF;"><i class="fa-solid fa-spinner fa-spin" style="font-size:1.5rem;"></i><p style="font-size:0.75rem; margin-top:0.5rem;">Fetching Telemetry Data...</p></div>';
        
        const t0 = performance.now();

        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                const latency = Math.round(performance.now() - t0);

                teleLatency.textContent = `${latency} ms`;
                teleMethod.textContent = "FETCH";
                teleMethod.style.color = "#00E5FF";

                fetchedUsers = data;
                renderGrid();

                searchFilter.disabled = false;
                searchFilter.focus();

                codeTabTitle.textContent = "fetch_pipeline.js";
                codeDisplayPre.textContent = fetchCodeSnippet;
            })
            .catch(err => {
                developerGridContainer.innerHTML = `<div style="grid-column:span 2; color:#EF4444; text-align:center;">Failed: ${err.message}</div>`;
            });
    });

    // JQUERY $.GETJSON PIPELINE
    btnJquery.addEventListener('click', () => {
        developerGridContainer.innerHTML = '<div style="grid-column:span 2; padding:2rem; text-align:center; color:#818CF8;"><i class="fa-solid fa-spinner fa-spin" style="font-size:1.5rem;"></i><p style="font-size:0.75rem; margin-top:0.5rem;">Running $.getJSON Request...</p></div>';

        const t0 = performance.now();

        $.getJSON(API_URL)
            .done(data => {
                const latency = Math.round(performance.now() - t0);

                teleLatency.textContent = `${latency} ms`;
                teleMethod.textContent = "JQUERY";
                teleMethod.style.color = "#818CF8";

                fetchedUsers = data;
                renderGrid();

                searchFilter.disabled = false;
                searchFilter.focus();

                codeTabTitle.textContent = "jquery_pipeline.js";
                codeDisplayPre.textContent = jqueryCodeSnippet;
            })
            .fail((xhr, status, err) => {
                developerGridContainer.innerHTML = `<div style="grid-column:span 2; color:#EF4444; text-align:center;">Failed: ${err || status}</div>`;
            });
    });
});
