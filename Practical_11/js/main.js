// main.js - ES6 Module Entry Point coordinating Timers, Modules, and Responsive Layout
import { loadSchedule, saveSchedule, resetSchedule, loadPreferences, savePreferences } from './modules/storage.js';
import { 
    DAYS_OF_WEEK, 
    timeStringToMinutes, 
    formatMinutesToTime, 
    resolveActiveAndNextEvents, 
    filterAndSortSchedule, 
    validateClass 
} from './modules/schedule.js';
import { MasterClock, SprintCountdown, scheduleDelayedAlert, TimerTelemetry } from './modules/timer.js';
import { SoundEngine } from './modules/audio.js';
import { 
    updateClockDisplay, 
    updateHeroBanner, 
    renderScheduleGrid, 
    updateSprintUI, 
    updateTelemetryUI, 
    showToast 
} from './modules/ui.js';

class ChronoSyncApp {
    constructor() {
        this.schedule = loadSchedule();
        this.prefs = loadPreferences();
        SoundEngine.setMuted(!this.prefs.soundEnabled);

        this.selectedDayFilter = 'all'; // 'all' or day name
        this.selectedStatusFilter = 'all';
        this.lastActiveId = null;
        this.editingClassId = null;
        this.isSimulating = false;
        this.simulatedBaseDate = null;
        this.simulatedStartTimeMs = null;

        // Initialize Sprint Countdown
        this.sprint = new SprintCountdown({
            onTick: (data) => updateSprintUI(data, this.sprint.state),
            onComplete: () => {
                SoundEngine.playCompleteFanfare();
                showToast('Sprint Accomplished! 🎉', 'You completed your focus countdown session.', 'success', 5000);
            },
            onStatusChange: (state) => updateSprintUI({
                remainingSeconds: this.sprint.remainingSeconds,
                totalSeconds: this.sprint.totalSeconds,
                progressPct: this.sprint.getProgressPct()
            }, state)
        });

        // Initialize Master Clock
        this.clock = new MasterClock((currentDate, telemetryStats) => {
            this.handleClockTick(currentDate, telemetryStats);
        });
    }

    init() {
        // Auto-select today's day for the active tab filter on first load
        const todayName = DAYS_OF_WEEK[new Date().getDay()];
        this.selectedDayFilter = todayName;

        this.initDOM();
        this.clock.start();
        this.refreshTimetable();

        // Initial sprint UI update
        updateSprintUI({
            remainingSeconds: this.sprint.remainingSeconds,
            totalSeconds: this.sprint.totalSeconds,
            progressPct: 0
        }, 'idle');

        // Welcome toast scheduled via setTimeout
        scheduleDelayedAlert(600, () => {
            showToast(
                'ChronoSync Engine Initialized',
                'ES6 Modules & dynamic setInterval/setTimeout timers running.',
                'info',
                3500
            );
        });
    }

    handleClockTick(currentDate, telemetryStats) {
        // 1. Update live clock display
        updateClockDisplay(currentDate);

        // 2. Resolve Day & Minutes
        const dayName = DAYS_OF_WEEK[currentDate.getDay()];
        const totalMinutes = (currentDate.getHours() * 60) + currentDate.getMinutes();
        const currentSeconds = currentDate.getSeconds();

        // 3. Resolve active & upcoming events
        const eventResolution = resolveActiveAndNextEvents(
            this.schedule, 
            dayName, 
            totalMinutes, 
            currentSeconds
        );

        // Check if an event just transitioned into 'LIVE'
        const currentActiveId = eventResolution.activeClass ? eventResolution.activeClass.id : null;
        if (currentActiveId && currentActiveId !== this.lastActiveId) {
            this.lastActiveId = currentActiveId;
            SoundEngine.playBell();
            showToast(
                'Class Session Commenced 🔔',
                `${eventResolution.activeClass.title} is now in session (${eventResolution.activeClass.room}).`,
                'success',
                4500
            );
        } else if (!currentActiveId) {
            this.lastActiveId = null;
        }

        // 4. Update Hero Banner
        updateHeroBanner({
            ...eventResolution,
            currentDayName: dayName,
            currentMinutes: totalMinutes,
            currentSeconds
        });

        // 5. Update Telemetry UI
        updateTelemetryUI(telemetryStats);

        // Refresh grid active bar updates every few seconds
        if (currentSeconds % 10 === 0) {
            this.refreshTimetable(false);
        }
    }

    refreshTimetable(rebuildDom = true) {
        const now = this.getEffectiveDate();
        const dayName = DAYS_OF_WEEK[now.getDay()];
        const currentMinutes = (now.getHours() * 60) + now.getMinutes();

        const filtered = filterAndSortSchedule(
            this.schedule,
            this.selectedDayFilter,
            this.selectedStatusFilter,
            dayName,
            currentMinutes
        );

        if (rebuildDom) {
            renderScheduleGrid(filtered, dayName, currentMinutes, {
                onEdit: (id) => this.openEditModal(id),
                onDelete: (id) => this.confirmDeleteClass(id)
            });

            // Re-attach empty state button if present
            const emptyBtn = document.getElementById('emptyResetFilterBtn');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', () => {
                    this.selectedDayFilter = 'all';
                    this.selectedStatusFilter = 'all';
                    this.updateFilterTabActiveState();
                    this.refreshTimetable();
                });
            }
        }
    }

    getEffectiveDate() {
        const now = Date.now();
        return new Date(now + this.clock.simulatedTimeOffsetMs);
    }

    initDOM() {
        this.setupDayTabs();
        this.setupStatusFilter();
        this.setupSprintControls();
        this.setupModalControls();
        this.setupSimulationControls();
        this.setupSoundToggle();
        this.setupResetSchedule();
    }

    setupDayTabs() {
        const tabsContainer = document.getElementById('dayTabsList');
        if (!tabsContainer) return;

        const todayName = DAYS_OF_WEEK[new Date().getDay()];

        tabsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.day-tab-btn');
            if (!btn) return;
            SoundEngine.playClick();

            const targetDay = btn.getAttribute('data-day');
            this.selectedDayFilter = targetDay;

            tabsContainer.querySelectorAll('.day-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            this.refreshTimetable();
        });

        // Highlight initial today tab
        this.updateFilterTabActiveState();
    }

    updateFilterTabActiveState() {
        const tabs = document.querySelectorAll('.day-tab-btn');
        tabs.forEach(tab => {
            if (tab.getAttribute('data-day') === this.selectedDayFilter) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        const statusSelect = document.getElementById('statusFilterSelect');
        if (statusSelect) {
            statusSelect.value = this.selectedStatusFilter;
        }
    }

    setupStatusFilter() {
        const statusSelect = document.getElementById('statusFilterSelect');
        if (!statusSelect) return;

        statusSelect.addEventListener('change', (e) => {
            SoundEngine.playClick();
            this.selectedStatusFilter = e.target.value;
            this.refreshTimetable();
        });
    }

    setupSprintControls() {
        const startBtn = document.getElementById('sprintStartBtn');
        const pauseBtn = document.getElementById('sprintPauseBtn');
        const resetBtn = document.getElementById('sprintResetBtn');
        const presetChips = document.querySelectorAll('.sprint-preset-chip');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                SoundEngine.playClick();
                this.sprint.start();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                SoundEngine.playClick();
                this.sprint.pause();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                SoundEngine.playClick();
                this.sprint.reset();
            });
        }

        presetChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                SoundEngine.playClick();
                presetChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const minutes = parseInt(chip.getAttribute('data-mins'), 10) || 25;
                this.sprint.setDuration(minutes * 60);
                showToast('Sprint Preset Configured', `Countdown set to ${minutes} minutes.`, 'info', 2000);
            });
        });
    }

    setupModalControls() {
        const modal = document.getElementById('classModal');
        const openAddBtn = document.getElementById('openAddClassModalBtn');
        const closeBtn = document.getElementById('closeModalBtn');
        const cancelBtn = document.getElementById('cancelModalBtn');
        const form = document.getElementById('classForm');
        const modalTitle = document.getElementById('modalTitle');

        if (!modal) return;

        const closeModal = () => {
            modal.classList.remove('modal-open');
            this.editingClassId = null;
            form.reset();
        };

        if (openAddBtn) {
            openAddBtn.addEventListener('click', () => {
                SoundEngine.playClick();
                this.editingClassId = null;
                form.reset();
                modalTitle.textContent = 'Add Academic Session';

                // Default day to selected filter or today
                const defaultDay = this.selectedDayFilter !== 'all' ? this.selectedDayFilter : DAYS_OF_WEEK[new Date().getDay()];
                document.getElementById('inputDay').value = defaultDay;
                document.getElementById('inputCategory').value = 'Lecture';
                document.getElementById('inputColor').value = '#00f2fe';

                modal.classList.add('modal-open');
            });
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                SoundEngine.playClick();

                const classData = {
                    id: this.editingClassId || `cls-${Date.now()}`,
                    title: document.getElementById('inputTitle').value.trim(),
                    code: document.getElementById('inputCode').value.trim().toUpperCase() || 'CS-GEN',
                    instructor: document.getElementById('inputInstructor').value.trim() || 'Staff Faculty',
                    room: document.getElementById('inputRoom').value.trim() || 'Main Campus',
                    category: document.getElementById('inputCategory').value,
                    day: document.getElementById('inputDay').value,
                    startTime: document.getElementById('inputStartTime').value,
                    endTime: document.getElementById('inputEndTime').value,
                    color: document.getElementById('inputColor').value || '#00f2fe',
                    notes: document.getElementById('inputNotes').value.trim()
                };

                const errorMsg = validateClass(classData);
                if (errorMsg) {
                    showToast('Validation Error', errorMsg, 'warning');
                    return;
                }

                if (this.editingClassId) {
                    const idx = this.schedule.findIndex(c => c.id === this.editingClassId);
                    if (idx !== -1) {
                        this.schedule[idx] = classData;
                        showToast('Session Updated', `"${classData.title}" details updated.`, 'success');
                    }
                } else {
                    this.schedule.push(classData);
                    showToast('Session Added', `"${classData.title}" added to ${classData.day}.`, 'success');
                }

                saveSchedule(this.schedule);
                closeModal();
                this.refreshTimetable();
            });
        }
    }

    openEditModal(id) {
        const item = this.schedule.find(c => c.id === id);
        if (!item) return;

        SoundEngine.playClick();
        this.editingClassId = id;

        document.getElementById('modalTitle').textContent = 'Edit Academic Session';
        document.getElementById('inputTitle').value = item.title;
        document.getElementById('inputCode').value = item.code;
        document.getElementById('inputInstructor').value = item.instructor;
        document.getElementById('inputRoom').value = item.room;
        document.getElementById('inputCategory').value = item.category;
        document.getElementById('inputDay').value = item.day;
        document.getElementById('inputStartTime').value = item.startTime;
        document.getElementById('inputEndTime').value = item.endTime;
        document.getElementById('inputColor').value = item.color || '#00f2fe';
        document.getElementById('inputNotes').value = item.notes || '';

        const modal = document.getElementById('classModal');
        if (modal) modal.classList.add('modal-open');
    }

    confirmDeleteClass(id) {
        const item = this.schedule.find(c => c.id === id);
        if (!item) return;

        if (confirm(`Are you sure you want to remove "${item.title}" from the timetable?`)) {
            SoundEngine.playClick();
            this.schedule = this.schedule.filter(c => c.id !== id);
            saveSchedule(this.schedule);
            showToast('Session Removed', `"${item.title}" was deleted.`, 'danger');
            this.refreshTimetable();
        }
    }

    setupSimulationControls() {
        const simToggleBtn = document.getElementById('toggleSimulationBtn');
        const simPanel = document.getElementById('simulationControlPanel');
        const simDaySelect = document.getElementById('simDaySelect');
        const simTimeInput = document.getElementById('simTimeInput');
        const applySimBtn = document.getElementById('applySimulationBtn');
        const resetSimBtn = document.getElementById('resetSimulationBtn');
        const speedSelect = document.getElementById('timerSpeedSelect');

        if (!simToggleBtn || !simPanel) return;

        simToggleBtn.addEventListener('click', () => {
            SoundEngine.playClick();
            const isOpen = simPanel.style.display === 'block';
            simPanel.style.display = isOpen ? 'none' : 'block';
            simToggleBtn.classList.toggle('active', !isOpen);
        });

        if (applySimBtn) {
            applySimBtn.addEventListener('click', () => {
                SoundEngine.playClick();
                const targetDay = simDaySelect.value;
                const targetTime = simTimeInput.value;

                if (!targetTime) {
                    showToast('Invalid Time', 'Please pick a valid simulated time.', 'warning');
                    return;
                }

                // Compute time offset so effective clock points to selected day & time
                const [targetHours, targetMinutes] = targetTime.split(':').map(Number);
                const targetDayIndex = DAYS_OF_WEEK.indexOf(targetDay);
                
                const now = new Date();
                const simulatedDate = new Date(now);

                // Adjust to the chosen day of current week
                const currentDayIndex = now.getDay();
                const dayDiff = targetDayIndex - currentDayIndex;
                simulatedDate.setDate(now.getDate() + dayDiff);
                simulatedDate.setHours(targetHours, targetMinutes, 0, 0);

                const offsetMs = simulatedDate.getTime() - Date.now();
                this.clock.setSimulatedOffset(offsetMs);
                this.selectedDayFilter = targetDay;
                this.updateFilterTabActiveState();
                this.refreshTimetable();

                showToast(
                    'Time Simulation Active ⏱️',
                    `Clock warped to ${targetDay} at ${formatMinutesToTime((targetHours * 60) + targetMinutes)}.`,
                    'info'
                );
            });
        }

        if (resetSimBtn) {
            resetSimBtn.addEventListener('click', () => {
                SoundEngine.playClick();
                this.clock.resetToRealTime();
                const todayName = DAYS_OF_WEEK[new Date().getDay()];
                this.selectedDayFilter = todayName;
                this.updateFilterTabActiveState();
                this.refreshTimetable();
                if (speedSelect) speedSelect.value = '1';

                showToast('Real-Time Restored', 'Clock synchronized to live system time.', 'success');
            });
        }

        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                const multiplier = parseInt(e.target.value, 10) || 1;
                this.clock.setSpeed(multiplier);
                showToast(
                    'Timer Interval Scaled',
                    `Heartbeat speed set to ${multiplier}x (${Math.round(1000 / multiplier)}ms per tick).`,
                    'info'
                );
            });
        }
    }

    setupSoundToggle() {
        const soundBtn = document.getElementById('soundToggleBtn');
        if (!soundBtn) return;

        const updateBtnIcon = () => {
            const isMuted = SoundEngine.isMuted();
            soundBtn.innerHTML = isMuted
                ? '<i class="fa-solid fa-volume-xmark"></i> Sound: Muted'
                : '<i class="fa-solid fa-volume-high"></i> Sound: Active';
            soundBtn.classList.toggle('muted', isMuted);
        };

        updateBtnIcon();

        soundBtn.addEventListener('click', () => {
            const newMuted = !SoundEngine.isMuted();
            SoundEngine.setMuted(newMuted);
            this.prefs.soundEnabled = !newMuted;
            savePreferences(this.prefs);
            updateBtnIcon();

            if (!newMuted) {
                SoundEngine.playClick();
                showToast('Audio Alerts Enabled', 'Bells and timer completion fanfares active.', 'info');
            } else {
                showToast('Audio Alerts Muted', 'Sound alerts disabled.', 'info');
            }
        });
    }

    setupResetSchedule() {
        const resetBtn = document.getElementById('resetScheduleBtn');
        if (!resetBtn) return;

        resetBtn.addEventListener('click', () => {
            SoundEngine.playClick();
            if (confirm('Reset academic timetable to default University syllabus schedule? Any custom classes will be replaced.')) {
                this.schedule = resetSchedule();
                this.refreshTimetable();
                showToast('Timetable Reset', 'Default university timetable restored.', 'info');
            }
        });
    }
}

// Bootstrap application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new ChronoSyncApp();
    app.init();
    window.chronoSyncApp = app; // Accessible for developer inspection
});

