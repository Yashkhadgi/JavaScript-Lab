// schedule.js - ES6 Module for timetable logic, time transformations, and status resolution

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Converts a "HH:MM" time string into total minutes from midnight
 * @param {string} timeStr - e.g. "09:30" or "14:15"
 * @returns {number}
 */
export function timeStringToMinutes(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return (hours * 60) + minutes;
}

/**
 * Formats minutes from midnight into 12-hour or 24-hour display string
 * @param {number} totalMinutes 
 * @param {boolean} format12h 
 * @returns {string} e.g. "09:30 AM" or "02:15 PM"
 */
export function formatMinutesToTime(totalMinutes, format12h = true) {
    let hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const padMin = String(minutes).padStart(2, '0');

    if (!format12h) {
        return `${String(hours).padStart(2, '0')}:${padMin}`;
    }

    const ampm = hours >= 12 ? 'PM' : 'AM';
    let displayHours = hours % 12;
    if (displayHours === 0) displayHours = 12;
    return `${String(displayHours).padStart(2, '0')}:${padMin} ${ampm}`;
}

/**
 * Converts total seconds into broken down { hours, minutes, seconds, formatted }
 * @param {number} totalSecs 
 * @returns {Object}
 */
export function formatSecondsBreakdown(totalSecs) {
    const safeSecs = Math.max(0, Math.floor(totalSecs));
    const h = Math.floor(safeSecs / 3600);
    const m = Math.floor((safeSecs % 3600) / 60);
    const s = safeSecs % 60;

    const padH = String(h).padStart(2, '0');
    const padM = String(m).padStart(2, '0');
    const padS = String(s).padStart(2, '0');

    return {
        hours: h,
        minutes: m,
        seconds: s,
        formatted: h > 0 ? `${padH}h ${padM}m ${padS}s` : `${padM}m ${padS}s`,
        digitalFormatted: `${padH}:${padM}:${padS}`
    };
}

/**
 * Evaluates the live status of a single class item relative to a reference day & time
 * @param {Object} item 
 * @param {string} currentDayName 
 * @param {number} currentTotalMinutes 
 * @param {number} currentSecondOffset 
 * @returns {Object} { status: 'active' | 'upcoming' | 'completed' | 'idle', progressPct, remainingSecs, secondsToStart, durationSecs }
 */
export function evaluateClassStatus(item, currentDayName, currentTotalMinutes, currentSecondOffset = 0) {
    const isSameDay = item.day.toLowerCase() === currentDayName.toLowerCase();
    const startMin = timeStringToMinutes(item.startTime);
    const endMin = timeStringToMinutes(item.endTime);
    const durationMin = Math.max(1, endMin - startMin);
    const durationSec = durationMin * 60;

    if (!isSameDay) {
        return {
            status: 'other-day',
            progressPct: 0,
            remainingSecs: 0,
            secondsToStart: 0,
            durationSecs: durationSec
        };
    }

    const currentTotalSec = (currentTotalMinutes * 60) + currentSecondOffset;
    const startSec = startMin * 60;
    const endSec = endMin * 60;

    if (currentTotalSec < startSec) {
        const secsUntilStart = startSec - currentTotalSec;
        return {
            status: 'upcoming',
            progressPct: 0,
            remainingSecs: secsUntilStart,
            secondsToStart: secsUntilStart,
            durationSecs: durationSec
        };
    } else if (currentTotalSec >= startSec && currentTotalSec < endSec) {
        const elapsedSec = currentTotalSec - startSec;
        const remainingSec = endSec - currentTotalSec;
        const progressPct = Math.min(100, Math.max(0, (elapsedSec / durationSec) * 100));

        return {
            status: 'active',
            progressPct: Math.round(progressPct * 10) / 10,
            remainingSecs: remainingSec,
            secondsToStart: 0,
            durationSecs: durationSec
        };
    } else {
        return {
            status: 'completed',
            progressPct: 100,
            remainingSecs: 0,
            secondsToStart: 0,
            durationSecs: durationSec
        };
    }
}

/**
 * Finds the currently active class and the immediate next upcoming class for the day
 * @param {Array} schedule 
 * @param {string} dayName 
 * @param {number} currentMinutes 
 * @param {number} currentSecondOffset 
 * @returns {Object} { activeClass, nextClass, activeStatus, nextStatus }
 */
export function resolveActiveAndNextEvents(schedule, dayName, currentMinutes, currentSecondOffset = 0) {
    const todayClasses = schedule
        .filter(c => c.day.toLowerCase() === dayName.toLowerCase())
        .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

    let activeClass = null;
    let activeStatus = null;
    let nextClass = null;
    let nextStatus = null;

    for (const item of todayClasses) {
        const status = evaluateClassStatus(item, dayName, currentMinutes, currentSecondOffset);
        if (status.status === 'active' && !activeClass) {
            activeClass = item;
            activeStatus = status;
        } else if (status.status === 'upcoming') {
            if (!nextClass) {
                nextClass = item;
                nextStatus = status;
            }
        }
    }

    return { activeClass, activeStatus, nextClass, nextStatus, todayClassesCount: todayClasses.length };
}

/**
 * Filters and sorts schedule for display
 * @param {Array} schedule 
 * @param {string} selectedDay 'all' or day name
 * @param {string} statusFilter 'all', 'active', 'upcoming', 'completed'
 * @param {string} currentDayName 
 * @param {number} currentMinutes 
 * @returns {Array}
 */
export function filterAndSortSchedule(schedule, selectedDay, statusFilter, currentDayName, currentMinutes) {
    return schedule
        .filter(item => {
            // Day filter
            if (selectedDay !== 'all' && item.day.toLowerCase() !== selectedDay.toLowerCase()) {
                return false;
            }

            // Status filter
            if (statusFilter !== 'all') {
                const evalResult = evaluateClassStatus(item, currentDayName, currentMinutes);
                if (evalResult.status !== statusFilter) {
                    return false;
                }
            }

            return true;
        })
        .sort((a, b) => {
            // Sort by day of week order first, then start time
            const dayIndexA = DAYS_OF_WEEK.indexOf(a.day);
            const dayIndexB = DAYS_OF_WEEK.indexOf(b.day);
            if (dayIndexA !== dayIndexB) {
                return dayIndexA - dayIndexB;
            }
            return timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime);
        });
}

/**
 * Basic validation for adding or editing a class
 * @param {Object} classData 
 * @returns {string|null} error message or null if valid
 */
export function validateClass(classData) {
    if (!classData.title || classData.title.trim().length < 3) {
        return 'Please provide a valid Course Title (min 3 characters).';
    }
    if (!classData.startTime || !classData.endTime) {
        return 'Both Start Time and End Time are required.';
    }
    const startM = timeStringToMinutes(classData.startTime);
    const endM = timeStringToMinutes(classData.endTime);
    if (startM >= endM) {
        return 'End Time must be chronologically after Start Time.';
    }
    if (!classData.day || !DAYS_OF_WEEK.includes(classData.day)) {
        return 'Please select a valid day of the week.';
    }
    return null;
}

