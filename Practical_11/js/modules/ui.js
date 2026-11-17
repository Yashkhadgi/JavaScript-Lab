// ui.js - ES6 Module for DOM rendering, SVG countdown rings, timetable cards, and UI animations
import { formatMinutesToTime, formatSecondsBreakdown } from './schedule.js';

/**
 * Updates the master digital header clock
 * @param {Date} date 
 */
export function updateClockDisplay(date) {
    const timeEl = document.getElementById('liveClockTime');
    const ampmEl = document.getElementById('liveClockAmPm');
    const dateEl = document.getElementById('liveClockDate');
    const dayPillEl = document.getElementById('liveClockDayPill');

    if (!timeEl || !dateEl) return;

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    let displayHours = hours % 12;
    if (displayHours === 0) displayHours = 12;
    const formattedHours = String(displayHours).padStart(2, '0');

    timeEl.textContent = `${formattedHours}:${minutes}:${seconds}`;
    if (ampmEl) ampmEl.textContent = ampm;

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    dateEl.textContent = fullDate;
    if (dayPillEl) dayPillEl.textContent = dayName;
}

/**
 * Updates the hero countdown card with either the currently active class or the next upcoming class
 */
export function updateHeroBanner({ activeClass, activeStatus, nextClass, nextStatus, currentDayName, currentMinutes, currentSeconds }) {
    const heroCard = document.getElementById('heroTrackerCard');
    const statusPill = document.getElementById('heroStatusPill');
    const heroTitle = document.getElementById('heroCourseTitle');
    const heroInstructor = document.getElementById('heroInstructor');
    const heroRoom = document.getElementById('heroRoom');
    const heroCategory = document.getElementById('heroCategory');
    const heroTimerDigits = document.getElementById('heroTimerDigits');
    const heroTimerLabel = document.getElementById('heroTimerLabel');
    const progressFill = document.getElementById('heroProgressFill');
    const progressPctText = document.getElementById('heroProgressPct');
    const nextPreviewBlock = document.getElementById('heroNextPreview');

    if (!heroCard) return;

    if (activeClass && activeStatus) {
        // Active class is in session!
        heroCard.classList.remove('status-idle', 'status-break');
        heroCard.classList.add('status-active');

        const breakdown = formatSecondsBreakdown(activeStatus.remainingSecs);
        
        statusPill.className = 'status-tag tag-live';
        statusPill.innerHTML = `<span class="live-pulse"></span> IN SESSION NOW`;

        heroTitle.textContent = activeClass.title;
        heroInstructor.textContent = activeClass.instructor;
        heroRoom.textContent = activeClass.room;
        heroCategory.textContent = `${activeClass.category} • ${activeClass.code}`;
        heroCategory.style.borderColor = activeClass.color;

        heroTimerDigits.textContent = breakdown.digitalFormatted;
        heroTimerLabel.textContent = 'Time Remaining In This Session';

        const pct = Math.min(100, Math.max(0, activeStatus.progressPct));
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressPctText) progressPctText.textContent = `${pct}% Elapsed`;

        // Render preview of next class
        if (nextClass) {
            nextPreviewBlock.style.display = 'flex';
            const nextStart = formatMinutesToTime(timeStringToMin(nextClass.startTime));
            nextPreviewBlock.innerHTML = `
                <span class="preview-label">NEXT UP:</span>
                <span class="preview-title">${nextClass.title}</span>
                <span class="preview-time">at ${nextStart} (${nextClass.room})</span>
            `;
        } else {
            nextPreviewBlock.style.display = 'flex';
            nextPreviewBlock.innerHTML = `
                <span class="preview-label">UP NEXT:</span>
                <span class="preview-title">Academic Schedule Concludes for Today</span>
            `;
        }
    } else if (nextClass && nextStatus) {
        // No active class, but there is an upcoming class today
        heroCard.classList.remove('status-active', 'status-break');
        heroCard.classList.add('status-idle');

        const breakdown = formatSecondsBreakdown(nextStatus.secondsToStart);

        statusPill.className = 'status-tag tag-upcoming';
        statusPill.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> NEXT SCHEDULED EVENT`;

        heroTitle.textContent = nextClass.title;
        heroInstructor.textContent = nextClass.instructor;
        heroRoom.textContent = nextClass.room;
        heroCategory.textContent = `${nextClass.category} • ${nextClass.code}`;
        heroCategory.style.borderColor = nextClass.color;

        heroTimerDigits.textContent = breakdown.digitalFormatted;
        heroTimerLabel.textContent = `Starts at ${formatMinutesToTime(timeStringToMin(nextClass.startTime))}`;

        if (progressFill) progressFill.style.width = '0%';
        if (progressPctText) progressPctText.textContent = 'Awaiting Start';

        nextPreviewBlock.style.display = 'none';
    } else {
        // No classes remaining today or holiday
        heroCard.classList.remove('status-active', 'status-break');
        heroCard.classList.add('status-idle');

        statusPill.className = 'status-tag tag-concluded';
        statusPill.innerHTML = `<i class="fa-solid fa-moon"></i> DAY CONCLUDED`;

        heroTitle.textContent = 'All Lectures Finished For Today';
        heroInstructor.textContent = 'Self-Study & Capstone Work Time';
        heroRoom.textContent = 'Digital Campus / Library Open';
        heroCategory.textContent = 'Off-Hours';
        heroCategory.style.borderColor = '#64748b';

        heroTimerDigits.textContent = '00:00:00';
        heroTimerLabel.textContent = `Check back for tomorrow's timetable`;

        if (progressFill) progressFill.style.width = '100%';
        if (progressPctText) progressPctText.textContent = 'Completed';

        nextPreviewBlock.style.display = 'none';
    }
}

function timeStringToMin(str) {
    if (!str) return 0;
    const parts = str.split(':');
    return (parseInt(parts[0], 10) * 60) + (parseInt(parts[1], 10) || 0);
}

/**
 * Renders the full timetable cards into the grid
 */
export function renderScheduleGrid(scheduleList, currentDayName, currentMinutes, { onEdit, onDelete }) {
    const container = document.getElementById('scheduleGridContainer');
    const countBadge = document.getElementById('scheduleItemsCount');

    if (!container) return;

    if (countBadge) {
        countBadge.textContent = `${scheduleList.length} Sessions`;
    }

    if (scheduleList.length === 0) {
        container.innerHTML = `
            <div class="empty-state-box">
                <i class="fa-regular fa-calendar-xmark empty-icon"></i>
                <h3>No Sessions Scheduled</h3>
                <p>No class sessions match your selected day or status filter.</p>
                <button id="emptyResetFilterBtn" class="btn btn-outline-cyan">Clear Filters</button>
            </div>
        `;
        return;
    }

    container.innerHTML = scheduleList.map(item => {
        const isToday = item.day.toLowerCase() === currentDayName.toLowerCase();
        const startMin = timeStringToMin(item.startTime);
        const endMin = timeStringToMin(item.endTime);
        const durationMin = endMin - startMin;

        let statusClass = 'card-inactive';
        let statusBadge = `<span class="badge badge-subtle">${item.day}</span>`;
        let progressMeter = '';

        if (isToday) {
            if (currentMinutes < startMin) {
                const diffMin = startMin - currentMinutes;
                statusClass = 'card-upcoming';
                statusBadge = `<span class="badge badge-upcoming"><i class="fa-regular fa-clock"></i> Starts in ${diffMin}m</span>`;
            } else if (currentMinutes >= startMin && currentMinutes < endMin) {
                const elapsedMin = currentMinutes - startMin;
                const pct = Math.round((elapsedMin / durationMin) * 100);
                statusClass = 'card-live';
                statusBadge = `<span class="badge badge-live"><span class="live-dot"></span> LIVE NOW (${pct}%)</span>`;
                progressMeter = `
                    <div class="card-progress-track">
                        <div class="card-progress-bar" style="width: ${pct}%; background: ${item.color};"></div>
                    </div>
                `;
            } else {
                statusClass = 'card-completed';
                statusBadge = `<span class="badge badge-completed"><i class="fa-solid fa-check"></i> Completed</span>`;
            }
        }

        const categoryIcons = {
            'Lecture': 'fa-chalkboard-user',
            'Lab': 'fa-laptop-code',
            'Tutorial': 'fa-user-group',
            'Break': 'fa-mug-hot',
            'Seminar': 'fa-microphone'
        };
        const icon = categoryIcons[item.category] || 'fa-book-open';

        return `
            <article class="schedule-card ${statusClass}" data-id="${item.id}" style="--accent-color: ${item.color}">
                <div class="card-accent-bar" style="background: ${item.color}"></div>
                <div class="card-header">
                    <div class="category-chip" style="color: ${item.color}; border-color: ${item.color}44; background: ${item.color}15">
                        <i class="fa-solid ${icon}"></i>
                        <span>${item.category}</span>
                        <span class="code-tag">${item.code}</span>
                    </div>
                    <div class="status-zone">
                        ${statusBadge}
                    </div>
                </div>

                <div class="card-body">
                    <h3 class="course-name">${escapeHTML(item.title)}</h3>
                    <div class="meta-row">
                        <span class="meta-item"><i class="fa-solid fa-user-tie"></i> ${escapeHTML(item.instructor)}</span>
                        <span class="meta-item"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(item.room)}</span>
                    </div>
                    ${item.notes ? `<p class="course-notes">${escapeHTML(item.notes)}</p>` : ''}
                </div>

                ${progressMeter}

                <div class="card-footer">
                    <div class="time-slot">
                        <i class="fa-regular fa-clock"></i>
                        <span class="time-text">${formatMinutesToTime(startMin)} &ndash; ${formatMinutesToTime(endMin)}</span>
                        <span class="duration-pill">${durationMin} mins</span>
                    </div>
                    <div class="action-buttons">
                        <button class="btn-icon edit-class-btn" data-id="${item.id}" title="Edit Class">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon delete-class-btn" data-id="${item.id}" title="Delete Class">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Attach listeners
    container.querySelectorAll('.edit-class-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (typeof onEdit === 'function') onEdit(id);
        });
    });

    container.querySelectorAll('.delete-class-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (typeof onDelete === 'function') onDelete(id);
        });
    });
}

/**
 * Updates Study Sprint Countdown UI
 */
export function updateSprintUI({ remainingSeconds, totalSeconds, progressPct }, state) {
    const timeDisplay = document.getElementById('sprintTimeDigits');
    const progressBar = document.getElementById('sprintProgressBar');
    const startBtn = document.getElementById('sprintStartBtn');
    const pauseBtn = document.getElementById('sprintPauseBtn');
    const statusTag = document.getElementById('sprintStateTag');

    if (!timeDisplay) return;

    const breakdown = formatSecondsBreakdown(remainingSeconds);
    timeDisplay.textContent = breakdown.formatted;

    if (progressBar) {
        progressBar.style.width = `${progressPct}%`;
    }

    if (statusTag) {
        if (state === 'running') {
            statusTag.textContent = 'RUNNING';
            statusTag.className = 'pill-state state-running';
        } else if (state === 'paused') {
            statusTag.textContent = 'PAUSED';
            statusTag.className = 'pill-state state-paused';
        } else if (state === 'completed') {
            statusTag.textContent = 'COMPLETED!';
            statusTag.className = 'pill-state state-completed';
        } else {
            statusTag.textContent = 'READY';
            statusTag.className = 'pill-state state-idle';
        }
    }

    if (startBtn && pauseBtn) {
        if (state === 'running') {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-flex';
        } else {
            startBtn.style.display = 'inline-flex';
            pauseBtn.style.display = 'none';
        }
    }
}

/**
 * Updates live telemetry numbers
 */
export function updateTelemetryUI(stats) {
    const intCount = document.getElementById('telemetryIntervalCount');
    const toCount = document.getElementById('telemetryTimeoutCount');
    const drift = document.getElementById('telemetryDrift');
    const ticks = document.getElementById('telemetryTicks');

    if (intCount) intCount.textContent = stats.activeIntervalsCount;
    if (toCount) toCount.textContent = stats.activeTimeoutsCount;
    if (drift) drift.textContent = `${stats.driftMs >= 0 ? '+' : ''}${stats.driftMs}ms`;
    if (ticks) ticks.textContent = stats.tickCount.toLocaleString();
}

/**
 * Shows smooth floating toast notification using setTimeout for auto-dismissal
 */
export function showToast(title, message, type = 'info', duration = 3800) {
    const toastArea = document.getElementById('toastNotificationArea');
    if (!toastArea) return;

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;

    const icons = {
        success: 'fa-circle-check',
        info: 'fa-circle-info',
        warning: 'fa-triangle-exclamation',
        danger: 'fa-circle-xmark'
    };

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid ${icons[type] || 'fa-bell'}"></i>
        </div>
        <div class="toast-content">
            <h4 class="toast-title">${escapeHTML(title)}</h4>
            <p class="toast-desc">${escapeHTML(message)}</p>
        </div>
        <button class="toast-close-btn">&times;</button>
    `;

    toastArea.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
        toast.classList.add('toast-visible');
    });

    const closeToast = () => {
        toast.classList.remove('toast-visible');
        toast.classList.add('toast-fadeout');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    };

    toast.querySelector('.toast-close-btn').addEventListener('click', closeToast);

    // Native setTimeout to self-dismiss
    setTimeout(closeToast, duration);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

