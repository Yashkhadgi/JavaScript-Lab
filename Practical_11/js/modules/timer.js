// timer.js - ES6 Module for timer lifecycle, setInterval, setTimeout, countdown logic & telemetry

/**
 * Global Telemetry Tracker for Academic Practical Assessment
 * Tracks invocation of native window timers (setInterval, setTimeout)
 */
export const TimerTelemetry = {
    intervalsCreated: 0,
    timeoutsCreated: 0,
    activeIntervals: new Set(),
    activeTimeouts: new Set(),
    lastTickTime: null,
    driftMs: 0,
    tickCount: 0,

    logInterval(id, label = 'unnamed') {
        this.intervalsCreated++;
        this.activeIntervals.add(id);
        return id;
    },

    unlogInterval(id) {
        if (id) {
            clearInterval(id);
            this.activeIntervals.delete(id);
        }
    },

    logTimeout(id, label = 'unnamed') {
        this.timeoutsCreated++;
        this.activeTimeouts.add(id);
        return id;
    },

    unlogTimeout(id) {
        if (id) {
            clearTimeout(id);
            this.activeTimeouts.delete(id);
        }
    },

    getStats() {
        return {
            totalIntervals: this.intervalsCreated,
            totalTimeouts: this.timeoutsCreated,
            activeIntervalsCount: this.activeIntervals.size,
            activeTimeoutsCount: this.activeTimeouts.size,
            driftMs: Math.round(this.driftMs * 100) / 100,
            tickCount: this.tickCount
        };
    }
};

/**
 * Master Clock Engine: runs on a 1000ms setInterval loop
 * Measures drift compared to actual wall-clock time
 */
export class MasterClock {
    constructor(onTickCallback) {
        this.onTick = onTickCallback;
        this.intervalId = null;
        this.expectedNextTick = null;
        this.isRunning = false;
        this.simulatedTimeOffsetMs = 0; // for manual time travel / test simulation
        this.timeSpeedMultiplier = 1;   // 1x, 5x, 10x, 60x for demo testing
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.expectedNextTick = Date.now() + 1000;

        // Native setInterval implementation
        this.intervalId = setInterval(() => {
            const now = Date.now();
            TimerTelemetry.driftMs = now - this.expectedNextTick;
            TimerTelemetry.lastTickTime = now;
            TimerTelemetry.tickCount++;

            this.expectedNextTick = now + (1000 / this.timeSpeedMultiplier);

            // Calculate current effective date/time
            const effectiveDate = new Date(now + this.simulatedTimeOffsetMs);
            if (typeof this.onTick === 'function') {
                this.onTick(effectiveDate, TimerTelemetry.getStats());
            }
        }, 1000 / this.timeSpeedMultiplier);

        TimerTelemetry.logInterval(this.intervalId, 'MasterClock');
    }

    stop() {
        if (this.intervalId) {
            TimerTelemetry.unlogInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }

    setSpeed(multiplier = 1) {
        const wasRunning = this.isRunning;
        this.stop();
        this.timeSpeedMultiplier = Math.max(1, multiplier);
        if (wasRunning) {
            this.start();
        }
    }

    setSimulatedOffset(offsetMs) {
        this.simulatedTimeOffsetMs = offsetMs;
    }

    resetToRealTime() {
        this.simulatedTimeOffsetMs = 0;
        this.setSpeed(1);
    }
}

/**
 * Countdown Timer Class (e.g. for Focus Sprints, Pomodoro, Exam Countdown)
 * Utilizes both setInterval for 1s ticks and setTimeout for delayed completions
 */
export class SprintCountdown {
    constructor({ onTick, onComplete, onStatusChange }) {
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.onStatusChange = onStatusChange;

        this.totalSeconds = 25 * 60;
        this.remainingSeconds = 25 * 60;
        this.intervalId = null;
        this.timeoutId = null;
        this.state = 'idle'; // 'idle' | 'running' | 'paused' | 'completed'
    }

    setDuration(seconds) {
        this.reset();
        this.totalSeconds = Math.max(1, seconds);
        this.remainingSeconds = this.totalSeconds;
        this._notifyTick();
    }

    start() {
        if (this.state === 'running') return;
        this.state = 'running';
        this._notifyStatus();

        if (this.remainingSeconds <= 0) {
            this.remainingSeconds = this.totalSeconds;
        }

        // Run interval for countdown ticks
        this.intervalId = setInterval(() => {
            if (this.remainingSeconds > 0) {
                this.remainingSeconds--;
                this._notifyTick();
            }

            if (this.remainingSeconds <= 0) {
                this.complete();
            }
        }, 1000);

        TimerTelemetry.logInterval(this.intervalId, 'SprintCountdown');
    }

    pause() {
        if (this.state !== 'running') return;
        if (this.intervalId) {
            TimerTelemetry.unlogInterval(this.intervalId);
            this.intervalId = null;
        }
        this.state = 'paused';
        this._notifyStatus();
    }

    resume() {
        if (this.state === 'paused') {
            this.start();
        }
    }

    reset() {
        if (this.intervalId) {
            TimerTelemetry.unlogInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.timeoutId) {
            TimerTelemetry.unlogTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.remainingSeconds = this.totalSeconds;
        this.state = 'idle';
        this._notifyStatus();
        this._notifyTick();
    }

    complete() {
        this.pause();
        this.state = 'completed';
        this._notifyStatus();

        if (typeof this.onComplete === 'function') {
            this.onComplete();
        }

        // Use setTimeout to trigger an automatic post-completion celebratory pulse reset
        this.timeoutId = setTimeout(() => {
            if (this.state === 'completed') {
                this.reset();
            }
        }, 4000);
        TimerTelemetry.logTimeout(this.timeoutId, 'SprintAutoReset');
    }

    getProgressPct() {
        if (this.totalSeconds <= 0) return 0;
        const elapsed = this.totalSeconds - this.remainingSeconds;
        return Math.min(100, Math.max(0, (elapsed / this.totalSeconds) * 100));
    }

    _notifyTick() {
        if (typeof this.onTick === 'function') {
            this.onTick({
                remainingSeconds: this.remainingSeconds,
                totalSeconds: this.totalSeconds,
                progressPct: this.getProgressPct()
            });
        }
    }

    _notifyStatus() {
        if (typeof this.onStatusChange === 'function') {
            this.onStatusChange(this.state);
        }
    }
}

/**
 * Scheduled Alert helper using setTimeout
 * Fires a callback after specified milliseconds, tracking the timeout handle
 * @param {number} delayMs 
 * @param {Function} callback 
 * @returns {number} timeout ID
 */
export function scheduleDelayedAlert(delayMs, callback) {
    const id = setTimeout(() => {
        TimerTelemetry.activeTimeouts.delete(id);
        callback();
    }, delayMs);

    return TimerTelemetry.logTimeout(id, 'ScheduledAlert');
}

/**
 * Cancels a scheduled timeout
 * @param {number} timeoutId 
 */
export function cancelDelayedAlert(timeoutId) {
    TimerTelemetry.unlogTimeout(timeoutId);
}

