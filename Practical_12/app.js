/**
 * ============================================================================
 * PULSEOPS — REAL-TIME CLOUD OPERATIONS & API TELEMETRY COMMAND HUB
 * Practical 12: DOM Manipulation, Event Handling, Web Storage & AJAX Integration
 * Author: Yash Khadgi | PRN: 24070521137
 * Technologies: Modern JavaScript (ES6+), jQuery 3.7.1, Web Storage API
 * ============================================================================
 */

(function($) {
    'use strict';

    // ===== CONFIGURATION & CONSTANTS =====
    const CONFIG = {
        STORAGE_KEY_ITEMS: 'pulseops_incidents_cache_v1',
        STORAGE_KEY_PREFS: 'pulseops_user_preferences_v1',
        STORAGE_KEY_STARRED: 'pulseops_starred_ids_v1',
        SESSION_KEY_LOGS: 'pulseops_session_telemetry_logs_v1',
        SESSION_KEY_STATS: 'pulseops_session_metrics_v1',
        API_ENDPOINTS: {
            REMOTE_USERS: 'https://jsonplaceholder.typicode.com/users',
            REMOTE_POSTS: 'https://jsonplaceholder.typicode.com/posts',
            REMOTE_HEALTH: 'https://httpbin.org/status/200'
        },
        DEFAULT_POLL_INTERVAL: 8000 // 8s
    };

    // Default Seed Incidents (for instant offline & first-load operation)
    const SEED_INCIDENTS = [
        {
            id: 'INC-1092',
            title: 'High Ingress Gateway Latency on EU-West Cluster',
            service: 'API Gateway',
            priority: 'Critical',
            status: 'Investigating',
            author: 'Yash Khadgi',
            latencyMs: 342,
            timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
            description: 'TLS renegotiation spikes on Kubernetes ingress controllers causing 95th percentile latency to breach 300ms SLA.',
            remoteSynced: true
        },
        {
            id: 'INC-1088',
            title: 'PostgreSQL Primary Replication Lag Exceeding Threshold',
            service: 'Database Cluster',
            priority: 'High',
            status: 'Identified',
            author: 'Database Ops Team',
            latencyMs: 185,
            timestamp: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
            description: 'WAL streaming delay of 4.2MB between primary pg-01 and standby pg-02 following index rebuild job.',
            remoteSynced: true
        },
        {
            id: 'INC-1084',
            title: 'CDN Cache Eviction Inconsistency Across AP-South Edge Nodes',
            service: 'CloudFront CDN',
            priority: 'Medium',
            status: 'Monitoring',
            author: 'Edge Network Core',
            latencyMs: 82,
            timestamp: new Date(Date.now() - 1000 * 60 * 125).toISOString(),
            description: 'Purge requests for static assets returned 200 OK but surrogate-key tags were cached on two Mumbai edge POPs.',
            remoteSynced: false
        },
        {
            id: 'INC-1079',
            title: 'Redis Distributed Session Store Memory Eviction Warning',
            service: 'Cache Layer',
            priority: 'Low',
            status: 'Resolved',
            author: 'Infrastructure Bot',
            latencyMs: 44,
            timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
            description: 'Key eviction policy volatile-lru triggered as memory consumption breached 85% watermark.',
            remoteSynced: true
        }
    ];

    // ===== APPLICATION STATE CLASS =====
    class PulseOpsEngine {
        constructor() {
            this.incidents = [];
            this.starredIds = new Set();
            this.sessionMetrics = {
                requestsMade: 0,
                successCount: 0,
                errorCount: 0,
                avgLatencyMs: 0,
                lastStatusCode: 200
            };
            this.sessionLogs = [];
            this.activeFilter = 'all'; // 'all', 'Critical', 'High', 'Medium', 'Low', 'starred'
            this.activeStatus = 'all'; // 'all', 'Investigating', 'Identified', 'Monitoring', 'Resolved'
            this.searchQuery = '';
            this.autoPollIntervalId = null;
            this.isPolling = false;
        }

        // ====================================================================
        // PILLAR 1: STORAGE MANAGEMENT (localStorage & sessionStorage)
        // ====================================================================
        initStorage() {
            try {
                // 1. localStorage: Persistent Incidents Cache
                const storedIncidents = localStorage.getItem(CONFIG.STORAGE_KEY_ITEMS);
                if (storedIncidents) {
                    this.incidents = JSON.parse(storedIncidents);
                } else {
                    this.incidents = [...SEED_INCIDENTS];
                    this.saveIncidentsToLocalStorage();
                }

                // 2. localStorage: Starred Items
                const storedStarred = localStorage.getItem(CONFIG.STORAGE_KEY_STARRED);
                if (storedStarred) {
                    this.starredIds = new Set(JSON.parse(storedStarred));
                }

                // 3. sessionStorage: Session Telemetry Metrics
                const storedSessionMetrics = sessionStorage.getItem(CONFIG.SESSION_KEY_STATS);
                if (storedSessionMetrics) {
                    this.sessionMetrics = JSON.parse(storedSessionMetrics);
                } else {
                    this.saveSessionMetrics();
                }

                // 4. sessionStorage: Session Audit Trail Logs
                const storedLogs = sessionStorage.getItem(CONFIG.SESSION_KEY_LOGS);
                if (storedLogs) {
                    this.sessionLogs = JSON.parse(storedLogs);
                }
            } catch (err) {
                console.warn('Storage initialisation warning:', err);
                this.incidents = [...SEED_INCIDENTS];
            }
        }

        saveIncidentsToLocalStorage() {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY_ITEMS, JSON.stringify(this.incidents));
                this.logSessionEvent('LOCAL_STORAGE_SYNC', `Synchronized ${this.incidents.length} incident records to localStorage.`);
            } catch (e) {
                console.error('Failed to save to localStorage:', e);
            }
        }

        saveStarredToLocalStorage() {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY_STARRED, JSON.stringify(Array.from(this.starredIds)));
            } catch (e) {
                console.error('Failed to save starred state:', e);
            }
        }

        saveSessionMetrics() {
            try {
                sessionStorage.setItem(CONFIG.SESSION_KEY_STATS, JSON.stringify(this.sessionMetrics));
            } catch (e) {
                console.error('Failed to save session metrics:', e);
            }
        }

        logSessionEvent(action, detail, latency = null, status = 200) {
            const entry = {
                id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                timestamp: new Date().toLocaleTimeString(),
                action,
                detail,
                latency: latency ? Math.round(latency) + 'ms' : '--',
                status
            };
            this.sessionLogs.unshift(entry);
            if (this.sessionLogs.length > 50) this.sessionLogs.pop(); // keep last 50

            try {
                sessionStorage.setItem(CONFIG.SESSION_KEY_LOGS, JSON.stringify(this.sessionLogs));
            } catch (e) {
                // Ignore storage quotas
            }

            // Custom jQuery event trigger
            $(document).trigger('pulse:sessionLogAdded', entry);
        }

        clearAllStorage() {
            localStorage.removeItem(CONFIG.STORAGE_KEY_ITEMS);
            localStorage.removeItem(CONFIG.STORAGE_KEY_STARRED);
            sessionStorage.removeItem(CONFIG.SESSION_KEY_STATS);
            sessionStorage.removeItem(CONFIG.SESSION_KEY_LOGS);

            this.incidents = [...SEED_INCIDENTS];
            this.starredIds.clear();
            this.sessionMetrics = {
                requestsMade: 0,
                successCount: 0,
                errorCount: 0,
                avgLatencyMs: 0,
                lastStatusCode: 200
            };
            this.sessionLogs = [];
            this.saveIncidentsToLocalStorage();
            this.saveSessionMetrics();
        }

        // ====================================================================
        // PILLAR 2: AJAX INTEGRATION ($.ajax, $.getJSON, Promises, Telemetry)
        // ====================================================================

        /**
         * Fetches live remote payloads via jQuery $.ajax() with high-precision latency measurement
         */
        fetchRemoteIncidents() {
            const startTime = performance.now();
            const $refreshBtn = $('#btnFetchAjax');
            const $spinner = $refreshBtn.find('.fa-sync-alt, .fa-arrows-rotate');

            // Indicate network in-flight in DOM
            $spinner.addClass('fa-spin');
            $refreshBtn.prop('disabled', true);
            this.showToast('AJAX Request Initiated', 'Dispatching $.ajax() GET request to remote REST API...', 'info', 2200);

            // Execute jQuery $.ajax
            return $.ajax({
                url: CONFIG.API_ENDPOINTS.REMOTE_POSTS + '?_limit=3',
                method: 'GET',
                dataType: 'json',
                timeout: 8000
            })
            .done((data, textStatus, jqXHR) => {
                const latency = performance.now() - startTime;
                this.updateMetricsOnSuccess(latency, jqXHR.status);

                // Transform remote data into incident models
                const services = ['Cloud Storage', 'Auth0 Identity', 'Edge Computing', 'GraphQL Mesh'];
                const priorities = ['Medium', 'High', 'Low'];
                const statuses = ['Investigating', 'Identified', 'Monitoring'];

                let newlyAddedCount = 0;
                data.forEach((item, index) => {
                    const customId = `API-${item.id + 100}`;
                    // Avoid duplicating if already present
                    if (!this.incidents.some(inc => inc.id === customId)) {
                        const newIncident = {
                            id: customId,
                            title: item.title.charAt(0).toUpperCase() + item.title.slice(1, 60),
                            service: services[index % services.length],
                            priority: priorities[index % priorities.length],
                            status: statuses[index % statuses.length],
                            author: 'Remote REST API Telemetry',
                            latencyMs: Math.round(latency + (Math.random() * 40 - 20)),
                            timestamp: new Date().toISOString(),
                            description: item.body.slice(0, 140) + '...',
                            remoteSynced: true
                        };
                        this.incidents.unshift(newIncident);
                        newlyAddedCount++;
                    }
                });

                this.saveIncidentsToLocalStorage();
                this.logSessionEvent('AJAX_GET_SUCCESS', `Fetched ${data.length} records (${newlyAddedCount} new) via $.ajax()`, latency, jqXHR.status);
                
                this.showToast(
                    'AJAX Request Succeeded (200 OK)',
                    `Synced remote data in ${Math.round(latency)}ms. Added ${newlyAddedCount} new live events.`,
                    'success',
                    3500
                );

                $(document).trigger('pulse:dataUpdated');
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                const latency = performance.now() - startTime;
                const status = jqXHR.status || 0;
                this.updateMetricsOnError(status);

                this.logSessionEvent('AJAX_GET_FAILED', `Request failed: ${textStatus} (${errorThrown || 'Network/CORS error'})`, latency, status);
                this.showToast(
                    'AJAX Request Warning',
                    `Remote endpoint unreachable (${textStatus}). Displaying local storage cache.`,
                    'warning',
                    4000
                );
            })
            .always(() => {
                $spinner.removeClass('fa-spin');
                $refreshBtn.prop('disabled', false);
                this.renderTelemetryHUD();
            });
        }

        /**
         * Simulates creating a remote incident via jQuery $.ajax(method: 'POST')
         */
        postNewIncident(incidentData) {
            const startTime = performance.now();
            this.showToast('Dispatching AJAX POST', 'Sending incident payload to REST endpoint...', 'info', 2000);

            return $.ajax({
                url: CONFIG.API_ENDPOINTS.REMOTE_POSTS,
                method: 'POST',
                data: JSON.stringify(incidentData),
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json'
            })
            .done((response, textStatus, jqXHR) => {
                const latency = performance.now() - startTime;
                this.updateMetricsOnSuccess(latency, jqXHR.status || 201);

                // Add to local state
                incidentData.remoteSynced = true;
                this.incidents.unshift(incidentData);
                this.saveIncidentsToLocalStorage();

                this.logSessionEvent('AJAX_POST_SUCCESS', `Created ${incidentData.id} via $.ajax() POST [201 Created]`, latency, 201);
                this.showToast('Incident Dispatched (201 Created)', `Successfully deployed ${incidentData.id} to telemetry grid!`, 'success');

                $(document).trigger('pulse:dataUpdated');
            })
            .fail((jqXHR) => {
                const latency = performance.now() - startTime;
                this.updateMetricsOnError(jqXHR.status || 500);

                // Resilient fallback: save locally anyway!
                incidentData.remoteSynced = false;
                this.incidents.unshift(incidentData);
                this.saveIncidentsToLocalStorage();

                this.logSessionEvent('AJAX_POST_OFFLINE', `POST failed, stored ${incidentData.id} locally in offline mode`, latency, 0);
                this.showToast('Saved to Local Cache', 'Network POST timed out; saved record to localStorage.', 'warning');

                $(document).trigger('pulse:dataUpdated');
            })
            .always(() => {
                this.renderTelemetryHUD();
            });
        }

        updateMetricsOnSuccess(latency, status) {
            this.sessionMetrics.requestsMade++;
            this.sessionMetrics.successCount++;
            this.sessionMetrics.lastStatusCode = status;
            
            // Rolling average
            const prevAvg = this.sessionMetrics.avgLatencyMs || latency;
            this.sessionMetrics.avgLatencyMs = Math.round((prevAvg * 0.7) + (latency * 0.3));
            this.saveSessionMetrics();
        }

        updateMetricsOnError(status) {
            this.sessionMetrics.requestsMade++;
            this.sessionMetrics.errorCount++;
            this.sessionMetrics.lastStatusCode = status;
            this.saveSessionMetrics();
        }

        // ====================================================================
        // PILLAR 3: DOM MANIPULATION & DYNAMIC RENDERING (jQuery)
        // ====================================================================

        renderIncidentsGrid() {
            const $grid = $('#incidentsGrid');
            $grid.empty(); // jQuery DOM removal

            // Filter logic
            const filtered = this.incidents.filter(item => {
                // Priority / Starred filter
                if (this.activeFilter === 'starred') {
                    if (!this.starredIds.has(item.id)) return false;
                } else if (this.activeFilter !== 'all') {
                    if (item.priority.toLowerCase() !== this.activeFilter.toLowerCase()) return false;
                }

                // Status filter
                if (this.activeStatus !== 'all') {
                    if (item.status.toLowerCase() !== this.activeStatus.toLowerCase()) return false;
                }

                // Search query
                if (this.searchQuery) {
                    const q = this.searchQuery.toLowerCase();
                    const matchTitle = item.title.toLowerCase().includes(q);
                    const matchService = item.service.toLowerCase().includes(q);
                    const matchId = item.id.toLowerCase().includes(q);
                    const matchAuthor = item.author.toLowerCase().includes(q);
                    if (!matchTitle && !matchService && !matchId && !matchAuthor) return false;
                }

                return true;
            });

            // Update stats badge
            $('#activeIncidentCounter').text(filtered.length);
            $('#totalIncidentCounter').text(this.incidents.length);

            // Empty state check
            if (filtered.length === 0) {
                const $empty = $(`
                    <div class="empty-state-card">
                        <div class="empty-icon-wrap"><i class="fa-solid fa-satellite-dish"></i></div>
                        <h3>No Incidents Found</h3>
                        <p>No operational incidents match your current filter parameters or search term.</p>
                        <button class="btn btn-outline-cyan" id="btnResetFilters">Reset Filter Criteria</button>
                    </div>
                `);
                $grid.append($empty);
                return;
            }

            // Dynamic card construction using jQuery elements
            filtered.forEach(item => {
                const isStarred = this.starredIds.has(item.id);
                const priorityClass = `badge-priority-${item.priority.toLowerCase()}`;
                const statusClass = `badge-status-${item.status.toLowerCase()}`;
                
                const $card = $(`
                    <article class="incident-card" data-id="${item.id}" data-priority="${item.priority}">
                        <div class="incident-card-top">
                            <div class="incident-meta-tags">
                                <span class="badge ${priorityClass}">
                                    <i class="fa-solid fa-triangle-exclamation"></i> ${item.priority}
                                </span>
                                <span class="badge ${statusClass}">
                                    <span class="status-pulse-dot"></span> ${item.status}
                                </span>
                                ${item.remoteSynced ? '<span class="badge badge-synced" title="Synchronized with Remote REST API"><i class="fa-solid fa-cloud"></i> Synced</span>' : '<span class="badge badge-local" title="Stored Locally in localStorage"><i class="fa-solid fa-database"></i> Local</span>'}
                            </div>
                            <div class="incident-top-actions">
                                <button class="btn-icon-subtle btn-star-incident ${isStarred ? 'is-starred' : ''}" title="${isStarred ? 'Unstar' : 'Star'}" data-id="${item.id}">
                                    <i class="fa-${isStarred ? 'solid' : 'regular'} fa-star"></i>
                                </button>
                                <button class="btn-icon-subtle btn-delete-incident" title="Acknowledge & Delete" data-id="${item.id}">
                                    <i class="fa-regular fa-trash-can"></i>
                                </button>
                            </div>
                        </div>

                        <div class="incident-card-body">
                            <div class="incident-id-row">
                                <span class="incident-code">${item.id}</span>
                                <span class="incident-latency"><i class="fa-solid fa-gauge-high"></i> ${item.latencyMs}ms</span>
                            </div>
                            <h3 class="incident-title">${this.escapeHTML(item.title)}</h3>
                            <p class="incident-desc">${this.escapeHTML(item.description)}</p>
                        </div>

                        <div class="incident-card-footer">
                            <div class="footer-left">
                                <span class="service-tag"><i class="fa-solid fa-server"></i> ${this.escapeHTML(item.service)}</span>
                                <span class="author-tag"><i class="fa-solid fa-user-check"></i> ${this.escapeHTML(item.author)}</span>
                            </div>
                            <div class="footer-right">
                                <select class="status-modifier-select" data-id="${item.id}">
                                    <option value="Investigating" ${item.status === 'Investigating' ? 'selected' : ''}>Investigating</option>
                                    <option value="Identified" ${item.status === 'Identified' ? 'selected' : ''}>Identified</option>
                                    <option value="Monitoring" ${item.status === 'Monitoring' ? 'selected' : ''}>Monitoring</option>
                                    <option value="Resolved" ${item.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                </select>
                            </div>
                        </div>
                    </article>
                `);

                $grid.append($card);
            });
        }

        renderTelemetryHUD() {
            $('#hudRequestsCount').text(this.sessionMetrics.requestsMade);
            $('#hudAvgLatency').text(`${this.sessionMetrics.avgLatencyMs}ms`);
            
            const $statusBadge = $('#hudLastStatus');
            $statusBadge.text(this.sessionMetrics.lastStatusCode || '200 OK');
            if (this.sessionMetrics.lastStatusCode >= 200 && this.sessionMetrics.lastStatusCode < 300) {
                $statusBadge.attr('class', 'telemetry-metric-badge badge-green');
            } else {
                $statusBadge.attr('class', 'telemetry-metric-badge badge-red');
            }

            $('#hudLocalStorageCount').text(this.incidents.length);
            $('#hudSessionLogsCount').text(this.sessionLogs.length);
        }

        renderSessionLogsDrawer() {
            const $logList = $('#sessionLogList');
            $logList.empty();

            if (this.sessionLogs.length === 0) {
                $logList.html('<div class="log-empty">No telemetry events logged in this session yet.</div>');
                return;
            }

            this.sessionLogs.slice(0, 20).forEach(log => {
                const statusColor = (log.status >= 200 && log.status < 300) ? 'text-green' : 'text-amber';
                const $item = $(`
                    <div class="log-row">
                        <span class="log-time">${log.timestamp}</span>
                        <span class="log-action">${log.action}</span>
                        <span class="log-detail">${this.escapeHTML(log.detail)}</span>
                        <span class="log-latency">${log.latency}</span>
                        <span class="log-status ${statusColor}">${log.status}</span>
                    </div>
                `);
                $logList.append($item);
            });
        }

        renderStorageInspectorModal() {
            // Raw JSON representation for evaluator verification
            const localData = {
                storageKey: CONFIG.STORAGE_KEY_ITEMS,
                totalItemsCount: this.incidents.length,
                starredCount: this.starredIds.size,
                items: this.incidents
            };

            const sessionData = {
                sessionKeyStats: CONFIG.SESSION_KEY_STATS,
                metrics: this.sessionMetrics,
                recentLogs: this.sessionLogs.slice(0, 10)
            };

            $('#localStorageDump').text(JSON.stringify(localData, null, 2));
            $('#sessionStorageDump').text(JSON.stringify(sessionData, null, 2));
        }

        showToast(title, message, type = 'info', duration = 3500) {
            const $container = $('#toastContainer');
            const icons = {
                info: 'fa-circle-info',
                success: 'fa-circle-check',
                warning: 'fa-triangle-exclamation',
                danger: 'fa-circle-xmark'
            };

            const $toast = $(`
                <div class="app-toast toast-${type}">
                    <div class="toast-icon-side"><i class="fa-solid ${icons[type] || 'fa-bell'}"></i></div>
                    <div class="toast-body">
                        <h4 class="toast-heading">${this.escapeHTML(title)}</h4>
                        <p class="toast-sub">${this.escapeHTML(message)}</p>
                    </div>
                    <button class="toast-dismiss-btn">&times;</button>
                </div>
            `);

            $container.append($toast);

            // Animate in using jQuery
            $toast.fadeIn(250).addClass('toast-active');

            const removeToast = () => {
                $toast.removeClass('toast-active').fadeOut(300, function() {
                    $(this).remove();
                });
            };

            $toast.find('.toast-dismiss-btn').on('click', removeToast);
            setTimeout(removeToast, duration);
        }

        escapeHTML(str) {
            if (!str) return '';
            return $('<div>').text(str).html();
        }

        // ====================================================================
        // PILLAR 4: EVENTS HANDLING (Delegation, Shortcuts, Forms, Polling)
        // ====================================================================

        bindEvents() {
            const self = this;

            // 1. AJAX Fetch Trigger Button (Click Event)
            $('#btnFetchAjax').on('click', function(e) {
                e.preventDefault();
                self.fetchRemoteIncidents();
            });

            // 2. Real-time Live Polling Toggle
            $('#btnTogglePolling').on('click', function() {
                self.isPolling = !self.isPolling;
                const $btn = $(this);

                if (self.isPolling) {
                    $btn.addClass('active btn-active-pulse');
                    $btn.html('<i class="fa-solid fa-spinner fa-spin"></i> Polling: Active (8s)');
                    self.showToast('Auto-Telemetry Polling Activated', 'Querying remote endpoints every 8 seconds via setInterval() & $.ajax()', 'info');
                    
                    self.autoPollIntervalId = setInterval(() => {
                        self.fetchRemoteIncidents();
                    }, CONFIG.DEFAULT_POLL_INTERVAL);
                } else {
                    $btn.removeClass('active btn-active-pulse');
                    $btn.html('<i class="fa-solid fa-wave-square"></i> Real-time Polling: Off');
                    if (self.autoPollIntervalId) {
                        clearInterval(self.autoPollIntervalId);
                        self.autoPollIntervalId = null;
                    }
                    self.showToast('Polling Deactivated', 'Background interval stopped.', 'info');
                }
            });

            // 3. Search Bar Live Event (Input / Keyup with real-time DOM filter)
            $('#searchIncidentsInput').on('input keyup', function() {
                self.searchQuery = $(this).val().trim();
                self.renderIncidentsGrid();
            });

            // 4. Priority Filter Tabs (Click Event on pill buttons)
            $('.filter-tab-pill').on('click', function() {
                $('.filter-tab-pill').removeClass('active');
                $(this).addClass('active');

                self.activeFilter = $(this).attr('data-filter');
                self.renderIncidentsGrid();
            });

            // 5. Status Dropdown Filter (Change Event)
            $('#statusSelectFilter').on('change', function() {
                self.activeStatus = $(this).val();
                self.renderIncidentsGrid();
            });

            // 6. Event Delegation: Star / Unstar Incident (Click Event)
            $('#incidentsGrid').on('click', '.btn-star-incident', function(e) {
                e.stopPropagation();
                const id = $(this).attr('data-id');
                const $btn = $(this);

                if (self.starredIds.has(id)) {
                    self.starredIds.delete(id);
                    $btn.removeClass('is-starred').attr('title', 'Star');
                    $btn.find('i').removeClass('fa-solid').addClass('fa-regular');
                    self.showToast('Removed from Watchlist', `Unstarred ${id}`, 'info', 2000);
                } else {
                    self.starredIds.add(id);
                    $btn.addClass('is-starred').attr('title', 'Unstar');
                    $btn.find('i').removeClass('fa-regular').addClass('fa-solid');
                    self.showToast('Added to Watchlist ⭐', `Bookmarked ${id} into localStorage`, 'success', 2000);
                }

                self.saveStarredToLocalStorage();
                self.logSessionEvent('STAR_TOGGLE', `Toggled bookmark for ${id}`);
                
                // If viewing 'starred' filter, re-render
                if (self.activeFilter === 'starred') {
                    self.renderIncidentsGrid();
                }
            });

            // 7. Event Delegation: Delete Incident with jQuery Animation SlideUp
            $('#incidentsGrid').on('click', '.btn-delete-incident', function(e) {
                e.stopPropagation();
                const id = $(this).attr('data-id');
                const $card = $(this).closest('.incident-card');

                if (confirm(`Acknowledge and purge incident record [${id}]?`)) {
                    $card.slideUp(300, function() {
                        self.incidents = self.incidents.filter(item => item.id !== id);
                        self.starredIds.delete(id);
                        self.saveIncidentsToLocalStorage();
                        self.saveStarredToLocalStorage();
                        self.logSessionEvent('INCIDENT_DELETED', `Acknowledged & deleted ${id} from storage.`);
                        self.showToast('Incident Resolved', `Record ${id} removed from dashboard.`, 'info');
                        self.renderIncidentsGrid();
                        self.renderTelemetryHUD();
                    });
                }
            });

            // 8. Event Delegation: Inline Status Modifier (Change Event)
            $('#incidentsGrid').on('change', '.status-modifier-select', function() {
                const id = $(this).attr('data-id');
                const newStatus = $(this).val();
                const item = self.incidents.find(inc => inc.id === id);

                if (item) {
                    item.status = newStatus;
                    self.saveIncidentsToLocalStorage();
                    self.logSessionEvent('STATUS_MUTATION', `Updated ${id} status to ${newStatus}`);
                    self.showToast('Status Updated', `${id} is now marked as "${newStatus}"`, 'info', 2200);
                    self.renderIncidentsGrid();
                }
            });

            // 9. Reset Filter Button in Empty State (Event Delegation)
            $('#incidentsGrid').on('click', '#btnResetFilters', function() {
                self.activeFilter = 'all';
                self.activeStatus = 'all';
                self.searchQuery = '';
                $('#searchIncidentsInput').val('');
                $('#statusSelectFilter').val('all');
                $('.filter-tab-pill').removeClass('active');
                $('.filter-tab-pill[data-filter="all"]').addClass('active');
                self.renderIncidentsGrid();
            });

            // 10. Modal Form Submit: Create New Incident (Submit Event with AJAX POST)
            $('#createIncidentForm').on('submit', function(e) {
                e.preventDefault();

                const newIncident = {
                    id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
                    title: $('#inputTitle').val().trim(),
                    service: $('#inputService').val().trim(),
                    priority: $('#inputPriority').val(),
                    status: $('#inputStatus').val(),
                    author: $('#inputAuthor').val().trim() || 'Yash Khadgi',
                    latencyMs: parseInt($('#inputLatency').val(), 10) || 120,
                    timestamp: new Date().toISOString(),
                    description: $('#inputDescription').val().trim()
                };

                // Form validation
                if (newIncident.title.length < 5) {
                    self.showToast('Validation Error', 'Title must be at least 5 characters.', 'warning');
                    return;
                }

                // Dispatch via AJAX POST
                self.postNewIncident(newIncident);

                // Reset and close modal with jQuery
                $('#createIncidentForm')[0].reset();
                $('#newIncidentModal').fadeOut(200);
            });

            // 11. Modal Show/Hide Controls (Click & Keyboard Escape Events)
            $('#btnOpenCreateModal').on('click', function() {
                $('#newIncidentModal').fadeIn(200);
                $('#inputTitle').trigger('focus');
            });

            $('.btn-close-modal, .modal-backdrop-close').on('click', function() {
                $('.app-modal-overlay').fadeOut(200);
            });

            // 12. Storage Inspector Modal Toggle
            $('#btnOpenStorageInspector').on('click', function() {
                self.renderStorageInspectorModal();
                $('#storageInspectorModal').fadeIn(200);
            });

            // 13. Telemetry Session Logs Drawer Toggle
            $('#btnToggleLogsDrawer').on('click', function() {
                self.renderSessionLogsDrawer();
                $('#sessionLogsDrawer').slideToggle(250);
            });

            $('#btnCloseLogsDrawer').on('click', function() {
                $('#sessionLogsDrawer').slideUp(250);
            });

            // 14. Clear All Storage Button
            $('#btnClearStorageBtn').on('click', function() {
                if (confirm('Purge all Web Storage caches (localStorage & sessionStorage) and reset to initial state?')) {
                    self.clearAllStorage();
                    self.renderIncidentsGrid();
                    self.renderTelemetryHUD();
                    self.renderStorageInspectorModal();
                    self.showToast('Storage Purged', 'localStorage and sessionStorage wiped and restored to default seed.', 'danger');
                }
            });

            // 15. Global Keyboard Shortcuts (Keydown Event)
            $(document).on('keydown', function(e) {
                // Escape key closes modals
                if (e.key === 'Escape') {
                    $('.app-modal-overlay').fadeOut(200);
                    $('#sessionLogsDrawer').slideUp(250);
                }

                // Cmd/Ctrl + K focuses search bar
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    $('#searchIncidentsInput').trigger('focus').select();
                }

                // Shift + N opens new incident modal
                if (e.shiftKey && (e.key === 'N' || e.key === 'n')) {
                    const isInputFocused = $('input:focus, textarea:focus').length > 0;
                    if (!isInputFocused) {
                        e.preventDefault();
                        $('#btnOpenCreateModal').trigger('click');
                    }
                }
            });

            // 16. Custom jQuery Document Event Listeners
            $(document).on('pulse:dataUpdated', function() {
                self.renderIncidentsGrid();
                self.renderTelemetryHUD();
            });

            $(document).on('pulse:sessionLogAdded', function(e, logEntry) {
                self.renderTelemetryHUD();
                // If logs drawer is currently visible, prepend row
                if ($('#sessionLogsDrawer').is(':visible')) {
                    self.renderSessionLogsDrawer();
                }
            });
        }

        // ====================================================================
        // INITIALIZATION
        // ====================================================================
        init() {
            this.initStorage();
            this.bindEvents();
            this.renderIncidentsGrid();
            this.renderTelemetryHUD();

            this.logSessionEvent('APP_INITIALIZED', 'PulseOps Dashboard mounted with jQuery 3.7.1 & Web Storage.');
            this.showToast('PulseOps Ready', 'jQuery DOM, Event Delegation, Web Storage & AJAX Engine Loaded.', 'info', 2800);
        }
    }

    // Mount when DOM is fully loaded via jQuery $(document).ready()
    $(document).ready(function() {
        const app = new PulseOpsEngine();
        app.init();
        window.pulseOpsApp = app; // Accessible in DevTools console for inspection
    });

})(jQuery);

