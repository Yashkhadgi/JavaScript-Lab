/**
 * Practical 3: EduPulse SaaS - Academic Grade Assessment Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const studentNameInput = document.getElementById('student-name');
    const studentRollInput = document.getElementById('student-roll');
    const subjectNameInput = document.getElementById('subject-name');
    const subjectMarksInput = document.getElementById('subject-marks');
    const btnAddSubject = document.getElementById('btn-add-subject');

    const coursesContainer = document.getElementById('courses-container');
    const emptyState = document.getElementById('empty-state');
    const subjectCountChip = document.getElementById('subject-count-chip');

    // Metrics outputs
    const avgPctNum = document.getElementById('avg-pct-num');
    const statusPill = document.getElementById('status-pill');
    const scoreBarFill = document.getElementById('score-bar-fill');

    const gradeRankLetter = document.getElementById('grade-rank-letter');
    const rankBadge = document.getElementById('rank-badge');
    const totalMarksStr = document.getElementById('total-marks-str');

    let courses = [];

    btnAddSubject.addEventListener('click', addCourse);

    [subjectNameInput, subjectMarksInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addCourse();
        });
    });

    function addCourse() {
        const name = subjectNameInput.value.trim();
        const marksVal = subjectMarksInput.value.trim();

        if (name === "" || marksVal === "") return;

        const marks = parseFloat(marksVal);
        if (isNaN(marks) || marks < 0 || marks > 100) return;

        courses.push({
            id: Date.now(),
            name: name,
            marks: marks
        });

        subjectNameInput.value = "";
        subjectMarksInput.value = "";
        subjectNameInput.focus();

        renderCourses();
        evaluateAnalytics();
    }

    function renderCourses() {
        coursesContainer.innerHTML = "";

        if (courses.length === 0) {
            coursesContainer.appendChild(emptyState);
            subjectCountChip.textContent = "0 Subjects";
            return;
        }

        subjectCountChip.textContent = `${courses.length} Subject${courses.length > 1 ? 's' : ''}`;

        courses.forEach(c => {
            const tile = document.createElement('div');
            tile.className = 'course-tile';

            tile.innerHTML = `
                <div class="course-info">
                    <h4>${c.name}</h4>
                    <p>Score: ${c.marks} / 100</p>
                </div>
                <button class="btn-del-course" data-id="${c.id}" title="Delete Course">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;

            tile.querySelector('.btn-del-course').addEventListener('click', () => {
                deleteCourse(c.id);
            });

            coursesContainer.appendChild(tile);
        });
    }

    function deleteCourse(id) {
        courses = courses.filter(c => c.id !== id);
        renderCourses();
        evaluateAnalytics();
    }

    function evaluateAnalytics() {
        if (courses.length === 0) {
            avgPctNum.textContent = "0%";
            statusPill.className = "pill-status";
            statusPill.textContent = "Awaiting Marks";
            scoreBarFill.style.width = "0%";

            gradeRankLetter.textContent = "--";
            rankBadge.textContent = "NO RANK";
            totalMarksStr.textContent = "0 / 0 Total Marks";
            return;
        }

        const totalObtained = courses.reduce((sum, c) => sum + c.marks, 0);
        const maxPossible = courses.length * 100;
        const avgPercentage = Math.round((totalObtained / maxPossible) * 100);

        // Update score metric
        avgPctNum.textContent = `${avgPercentage}%`;
        scoreBarFill.style.width = `${avgPercentage}%`;

        // Check pass/fail (Avg >= 40 & no subject < 35)
        const hasFailedSubject = courses.some(c => c.marks < 35);
        const isPassed = (avgPercentage >= 40) && !hasFailedSubject;

        if (isPassed) {
            statusPill.className = "pill-status pass";
            statusPill.textContent = "PASSED";
        } else {
            statusPill.className = "pill-status fail";
            statusPill.textContent = "FAILED";
        }

        // Rank Grade Assignment
        let grade = "F";
        let rankText = "UNSATISFACTORY";

        if (avgPercentage >= 90) { grade = "A+"; rankText = "EXCELLENCE"; }
        else if (avgPercentage >= 75) { grade = "A"; rankText = "DISTINCTION"; }
        else if (avgPercentage >= 60) { grade = "B"; rankText = "FIRST CLASS"; }
        else if (avgPercentage >= 50) { grade = "C"; rankText = "PASS CLASS"; }

        gradeRankLetter.textContent = grade;
        rankBadge.textContent = rankText;
        totalMarksStr.textContent = `${totalObtained} / ${maxPossible} Total Marks`;
    }
});
