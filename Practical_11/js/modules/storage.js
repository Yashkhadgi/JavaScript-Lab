// storage.js - ES6 Module for timetable persistence and default university schedule

export const STORAGE_KEY = 'chronosync_schedule_v2';
export const PREFS_KEY = 'chronosync_user_prefs_v2';

export const DEFAULT_SCHEDULE = [
    // MONDAY
    {
        id: 'mon-1',
        day: 'Monday',
        title: 'Full Stack Web Development (ES6 & React)',
        code: 'CS-401',
        instructor: 'Dr. Yashvardhan Patil',
        room: 'Lab 402 - Silicon Block',
        category: 'Lab',
        startTime: '09:00',
        endTime: '10:45',
        color: '#00f2fe',
        notes: 'Building dynamic SPA architectures, ES6 Modules & React state lifecycle.'
    },
    {
        id: 'mon-2',
        day: 'Monday',
        title: 'Advanced Computer Networks',
        code: 'CS-403',
        instructor: 'Prof. Ananya Sen',
        room: 'Hall 201 - Ramanujan Wing',
        category: 'Lecture',
        startTime: '11:00',
        endTime: '12:30',
        color: '#a855f7',
        notes: 'TCP/IP socket communication, HTTP/3, and modern congestion control.'
    },
    {
        id: 'mon-3',
        day: 'Monday',
        title: 'Midday Academic Recess & Refreshment',
        code: 'REC-01',
        instructor: 'Campus Dining Commons',
        room: 'Student Union Cafeteria',
        category: 'Break',
        startTime: '12:30',
        endTime: '13:30',
        color: '#10b981',
        notes: 'Lunch recess and student collaborative networking.'
    },
    {
        id: 'mon-4',
        day: 'Monday',
        title: 'Cloud Infrastructure & DevOps Pipelines',
        code: 'CS-407',
        instructor: 'Prof. Rajesh Kulkarni',
        room: 'Cloud Computing Lab 1',
        category: 'Lecture',
        startTime: '13:30',
        endTime: '15:15',
        color: '#f59e0b',
        notes: 'Docker containerization, Kubernetes clusters & CI/CD workflow automation.'
    },
    {
        id: 'mon-5',
        day: 'Monday',
        title: 'Capstone Project Technical Mentorship',
        code: 'PRJ-409',
        instructor: 'Dr. Sunita Sharma',
        room: 'Project Innovation Cell 3',
        category: 'Tutorial',
        startTime: '15:30',
        endTime: '17:00',
        color: '#38bdf8',
        notes: 'Sprint reviews, code auditing, and architectural milestones.'
    },

    // TUESDAY
    {
        id: 'tue-1',
        day: 'Tuesday',
        title: 'Database Management & Query Optimization',
        code: 'CS-402',
        instructor: 'Dr. Vivek Deshmukh',
        room: 'Hall 305 - Turing Hall',
        category: 'Lecture',
        startTime: '09:15',
        endTime: '10:45',
        color: '#ec4899',
        notes: 'B-Tree indexing, ACID transactions, and Postgres query execution plans.'
    },
    {
        id: 'tue-2',
        day: 'Tuesday',
        title: 'Database Practical Lab & ACID Engine',
        code: 'CS-402L',
        instructor: 'Prof. Meera Joshi',
        room: 'DBMS Lab 308',
        category: 'Lab',
        startTime: '11:00',
        endTime: '13:00',
        color: '#ec4899',
        notes: 'Hands-on stored procedures, triggers, and JSONB document queries.'
    },
    {
        id: 'tue-3',
        day: 'Tuesday',
        title: 'Midday Academic Recess',
        code: 'REC-01',
        instructor: 'Campus Dining Commons',
        room: 'Student Union Cafeteria',
        category: 'Break',
        startTime: '13:00',
        endTime: '14:00',
        color: '#10b981',
        notes: 'Lunch recess.'
    },
    {
        id: 'tue-4',
        day: 'Tuesday',
        title: 'Machine Learning & Predictive Systems',
        code: 'CS-405',
        instructor: 'Dr. Rohan Verma',
        room: 'Data Science Lab 2',
        category: 'Lecture',
        startTime: '14:00',
        endTime: '16:00',
        color: '#6366f1',
        notes: 'Gradient descent, neural network backprop, and feature embeddings.'
    },

    // WEDNESDAY
    {
        id: 'wed-1',
        day: 'Wednesday',
        title: 'Operating Systems & Kernel Architecture',
        code: 'CS-404',
        instructor: 'Dr. S. Kulkarni',
        room: 'Hall 104 - Hopper Room',
        category: 'Lecture',
        startTime: '09:00',
        endTime: '10:30',
        color: '#06b6d4',
        notes: 'Process scheduling, virtual memory paging, and multi-threaded locks.'
    },
    {
        id: 'wed-2',
        day: 'Wednesday',
        title: 'Full Stack Web Development (ES6 & React)',
        code: 'CS-401',
        instructor: 'Dr. Yashvardhan Patil',
        room: 'Lab 402 - Silicon Block',
        category: 'Lecture',
        startTime: '10:45',
        endTime: '12:15',
        color: '#00f2fe',
        notes: 'Asynchronous JavaScript, Promises, and Web Worker thread concurrency.'
    },
    {
        id: 'wed-3',
        day: 'Wednesday',
        title: 'Midday Academic Recess',
        code: 'REC-01',
        instructor: 'Campus Dining Commons',
        room: 'Student Union Cafeteria',
        category: 'Break',
        startTime: '12:15',
        endTime: '13:15',
        color: '#10b981',
        notes: 'Lunch recess.'
    },
    {
        id: 'wed-4',
        day: 'Wednesday',
        title: 'Cybersecurity Principles & Cryptography',
        code: 'CS-408',
        instructor: 'Prof. Vikram Malhotra',
        room: 'Cyber Defense Lab',
        category: 'Lecture',
        startTime: '13:30',
        endTime: '15:15',
        color: '#f43f5e',
        notes: 'RSA public-key cryptography, JWT tokens, and OAuth2 protocol flow.'
    },
    {
        id: 'wed-5',
        day: 'Wednesday',
        title: 'Open Source Software Engineering Lab',
        code: 'CS-411',
        instructor: 'Prof. Meera Joshi',
        room: 'OSS Incubator Lab',
        category: 'Lab',
        startTime: '15:30',
        endTime: '17:15',
        color: '#8b5cf6',
        notes: 'Git flow branching, Pull Request reviews, and automated linting checks.'
    },

    // THURSDAY
    {
        id: 'thu-1',
        day: 'Thursday',
        title: 'Advanced Computer Networks Lab',
        code: 'CS-403L',
        instructor: 'Prof. Ananya Sen',
        room: 'Cisco Networking Lab 4',
        category: 'Lab',
        startTime: '09:00',
        endTime: '11:00',
        color: '#a855f7',
        notes: 'Wireshark packet sniffing, subnetting, and router topology routing.'
    },
    {
        id: 'thu-2',
        day: 'Thursday',
        title: 'Microservices Architecture & API Gateways',
        code: 'CS-412',
        instructor: 'Prof. Rajesh Kulkarni',
        room: 'Hall 201 - Ramanujan Wing',
        category: 'Lecture',
        startTime: '11:15',
        endTime: '12:45',
        color: '#f59e0b',
        notes: 'gRPC protocols, event brokers, and Redis distributed caching.'
    },
    {
        id: 'thu-3',
        day: 'Thursday',
        title: 'Midday Academic Recess',
        code: 'REC-01',
        instructor: 'Campus Dining Commons',
        room: 'Student Union Cafeteria',
        category: 'Break',
        startTime: '12:45',
        endTime: '13:45',
        color: '#10b981',
        notes: 'Lunch recess.'
    },
    {
        id: 'thu-4',
        day: 'Thursday',
        title: 'Software Quality Assurance & Automation',
        code: 'CS-410',
        instructor: 'Prof. N. Deshmukh',
        room: 'Software Testing Lab',
        category: 'Lecture',
        startTime: '14:00',
        endTime: '15:45',
        color: '#10b981',
        notes: 'Unit testing with Jest, Cypress E2E flows, and regression test suites.'
    },

    // FRIDAY
    {
        id: 'fri-1',
        day: 'Friday',
        title: 'Machine Learning Deep Dive Lab',
        code: 'CS-405L',
        instructor: 'Dr. Rohan Verma',
        room: 'GPU AI Supercomputing Lab',
        category: 'Lab',
        startTime: '09:15',
        endTime: '11:30',
        color: '#6366f1',
        notes: 'PyTorch model training, hyperparameter tuning, and TensorBoard logs.'
    },
    {
        id: 'fri-2',
        day: 'Friday',
        title: 'Technical Writing, Ethics & IPR in Computing',
        code: 'HUM-301',
        instructor: 'Dr. Arundhati Roy',
        room: 'Auditorium West',
        category: 'Seminar',
        startTime: '11:45',
        endTime: '13:00',
        color: '#14b8a6',
        notes: 'IEEE paper structuring, research ethics, and software patent law.'
    },
    {
        id: 'fri-3',
        day: 'Friday',
        title: 'Midday Academic Recess',
        code: 'REC-01',
        instructor: 'Campus Dining Commons',
        room: 'Student Union Cafeteria',
        category: 'Break',
        startTime: '13:00',
        endTime: '14:00',
        color: '#10b981',
        notes: 'Lunch recess.'
    },
    {
        id: 'fri-4',
        day: 'Friday',
        title: 'Competitive Programming & Algorithm Sprints',
        code: 'CS-414',
        instructor: 'Prof. Siddharth Jain',
        room: 'Competitive Coding Arena',
        category: 'Tutorial',
        startTime: '14:00',
        endTime: '16:00',
        color: '#ec4899',
        notes: 'Dynamic programming, graph algorithms (Dijkstra, Bellman-Ford).'
    },

    // SATURDAY
    {
        id: 'sat-1',
        day: 'Saturday',
        title: 'Industry Guest Masterclass & Tech Colloquium',
        code: 'IND-499',
        instructor: 'Distinguished Tech Leaders',
        room: 'Main Tech Amphitheater',
        category: 'Seminar',
        startTime: '10:00',
        endTime: '12:30',
        color: '#f97316',
        notes: 'Real-world system design, production incident postmortems & Q&A.'
    },
    {
        id: 'sat-2',
        day: 'Saturday',
        title: 'Weekend Hackathon / Code Incubator',
        code: 'HACK-01',
        instructor: 'Student Tech Council',
        room: 'Makerspace Lab 101',
        category: 'Lab',
        startTime: '13:30',
        endTime: '17:00',
        color: '#8b5cf6',
        notes: 'Prototype acceleration sprints, design feedback, and peer code reviews.'
    }
];

/**
 * Loads schedule from localStorage or populates default
 * @returns {Array} Array of class objects
 */
export function loadSchedule() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('ChronoSync: Failed to load from localStorage. Falling back to default timetable.', e);
    }
    saveSchedule(DEFAULT_SCHEDULE);
    return DEFAULT_SCHEDULE;
}

/**
 * Saves schedule array to localStorage
 * @param {Array} schedule 
 */
export function saveSchedule(schedule) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    } catch (e) {
        console.error('ChronoSync: Error saving schedule to localStorage', e);
    }
}

/**
 * Resets schedule to default college timetable
 * @returns {Array}
 */
export function resetSchedule() {
    saveSchedule(DEFAULT_SCHEDULE);
    return [...DEFAULT_SCHEDULE];
}

/**
 * Loads user preferences
 * @returns {Object}
 */
export function loadPreferences() {
    try {
        const prefs = localStorage.getItem(PREFS_KEY);
        return prefs ? JSON.parse(prefs) : { soundEnabled: true, simulatedSpeed: 1 };
    } catch (e) {
        return { soundEnabled: true, simulatedSpeed: 1 };
    }
}

/**
 * Saves user preferences
 * @param {Object} prefs 
 */
export function savePreferences(prefs) {
    try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
        console.error('ChronoSync: Error saving preferences', e);
    }
}

