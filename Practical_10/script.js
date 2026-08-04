/**
 * Practical 10: Brutalist API Database Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {

    const API_URL = "https://jsonplaceholder.typicode.com/users";

    const btnFetch = document.getElementById('btn-load-fetch');
    const btnJquery = document.getElementById('btn-load-jquery');
    const searchFilter = document.getElementById('search-filter');

    const teleLatency = document.getElementById('tele-latency');
    const teleCount = document.getElementById('tele-count');
    const teleMethod = document.getElementById('tele-method');

    const userTbody = document.getElementById('user-tbody');
    const rowPlaceholder = document.getElementById('row-placeholder');
    const rowError = document.getElementById('row-error');
    const errorMessageText = document.getElementById('error-message-text');

    const codeTabTitle = document.getElementById('code-tab-title');
    const codeDisplayPre = document.getElementById('code-display-pre');

    const skeletonRows = [
        document.getElementById('skeleton-row-1'),
        document.getElementById('skeleton-row-2'),
        document.getElementById('skeleton-row-3')
    ];

    let fetchedUsers = [];

    const fetchCodeSnippet = `// Native Fetch API Promise chain
fetch("https://jsonplaceholder.typicode.com/users")
  .then(res => {
    if (!res.ok) throw new Error("HTTP: " + res.status);
    return res.json();
  })
  .then(users => {
    renderTable(users);
  })
  .catch(err => {
    showError(err.message);
  });`;

    const jqueryCodeSnippet = `// jQuery $.getJSON Deferred call
$.getJSON("https://jsonplaceholder.typicode.com/users")
  .done(users => {
    renderTable(users);
  })
  .fail((jqXHR, status, err) => {
    showError(err || jqXHR.statusText);
  });`;

    function toggleLoader(show) {
        if (show) {
            searchFilter.disabled = true;
            searchFilter.value = "";

            rowPlaceholder.classList.add('hidden');
            rowError.classList.add('hidden');

            document.querySelectorAll('.user-row').forEach(r => r.remove());
            skeletonRows.forEach(r => r.classList.remove('hidden'));
        } else {
            skeletonRows.forEach(r => r.classList.add('hidden'));
        }
    }

    function showError(msg) {
        toggleLoader(false);
        errorMessageText.textContent = msg;
        rowError.classList.remove('hidden');

        teleLatency.textContent = "-- ms";
        teleCount.textContent = "00";
        teleMethod.textContent = "ERROR";
    }

    function getInitials(name) {
        const parts = name.split(/\s+/);
        let initials = "";
        if (parts.length > 0) initials += parts[0][0];
        if (parts.length > 1) initials += parts[parts.length - 1][0];
        return initials.toUpperCase();
    }

    function generateAvatarColor() {
        const colors = ['#00E676', '#00E5FF', '#FF3366', '#FFB800', '#9C27B0'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function renderUserTable() {
        document.querySelectorAll('.user-row').forEach(r => r.remove());

        const query = searchFilter.value.trim().toLowerCase();

        fetchedUsers.forEach(user => {
            const name = user.name;
            const email = user.email;
            const city = user.address ? user.address.city : "N/A";
            const company = user.company ? user.company.name : "N/A";

            if (query !== "" && !name.toLowerCase().includes(query) && !email.toLowerCase().includes(query) && !city.toLowerCase().includes(query)) {
                return;
            }

            const tr = document.createElement('tr');
            tr.className = 'user-row';

            const initials = getInitials(name);
            const color = generateAvatarColor();

            tr.innerHTML = `
                <td>
                    <div class="candidate-cell">
                        <div class="avatar-circle" style="background-color: ${color}">${initials}</div>
                        <span class="candidate-name">${highlight(name, query)}</span>
                    </div>
                </td>
                <td>${highlight(email, query)}</td>
                <td>${highlight(city, query)}</td>
                <td>${company}</td>
            `;

            userTbody.appendChild(tr);
        });

        const visibleCount = userTbody.querySelectorAll('.user-row').length;
        teleCount.textContent = visibleCount < 10 ? `0${visibleCount}` : visibleCount;
    }

    function highlight(sourceText, query) {
        if (query === "") return sourceText;
        const escaped = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        return sourceText.replace(regex, match => `<span class="highlight">${match}</span>`);
    }

    searchFilter.addEventListener('input', renderUserTable);

    // FETCH API PIPELINE
    btnFetch.addEventListener('click', () => {
        toggleLoader(true);
        const t0 = performance.now();

        fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP: ${res.status}`);
                return res.json();
            })
            .then(data => {
                const latency = Math.round(performance.now() - t0);

                teleLatency.textContent = `${latency} ms`;
                teleMethod.textContent = "FETCH";

                fetchedUsers = data;
                toggleLoader(false);
                renderUserTable();

                searchFilter.disabled = false;
                searchFilter.focus();

                codeTabTitle.textContent = "fetch_data.js";
                codeDisplayPre.textContent = fetchCodeSnippet;
            })
            .catch(err => {
                showError(err.message);
                codeTabTitle.textContent = "fetch_data.js";
                codeDisplayPre.textContent = fetchCodeSnippet;
            });
    });

    // JQUERY $.GETJSON PIPELINE
    btnJquery.addEventListener('click', () => {
        toggleLoader(true);
        const t0 = performance.now();

        $.getJSON(API_URL)
            .done(data => {
                const latency = Math.round(performance.now() - t0);

                teleLatency.textContent = `${latency} ms`;
                teleMethod.textContent = "JQUERY";

                fetchedUsers = data;
                toggleLoader(false);
                renderUserTable();

                searchFilter.disabled = false;
                searchFilter.focus();

                codeTabTitle.textContent = "jquery_get_json.js";
                codeDisplayPre.textContent = jqueryCodeSnippet;
            })
            .fail((xhr, status, err) => {
                showError(`jQuery: ${err || xhr.statusText}`);
                codeTabTitle.textContent = "jquery_get_json.js";
                codeDisplayPre.textContent = jqueryCodeSnippet;
            });
    });
});
