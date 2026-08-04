/**
 * Practical 3: Vercel / Linear-Style Academic Analytics Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const studentNameInput = document.getElementById('student-name');
    const studentRollInput = document.getElementById('student-roll');
    const subjectNameInput = document.getElementById('subject-name');
    const subjectMarksInput = document.getElementById('subject-marks');
    const btnAddSubject = document.getElementById('btn-add-subject');

    const coursesContainer = document.getElementById('courses-container');
    const emptyState = document.getElementById('empty-state');
    const subjectCountTag = document.getElementById('subject-count-tag');

    // Metrics outputs
    const topAvgPct = document.getElementById('top-avg-pct');
    const topStatusBadge = document.getElementById('top-status-badge');
    const topGradeRank = document.getElementById('top-grade-rank');
    const marksRatioStr = document.getElementById('marks-ratio-str');
    const progressFillBar = document.getElementById('progress-fill-bar');

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
            subjectCountTag.textContent = "0 Courses";
            return;
        }

        subjectCountTag.textContent = `${courses.length} Course${courses.length > 1 ? 's' : ''}`;

        courses.forEach(c => {
            const item = document.createElement('div');
            item.className = 'course-item';

            item.innerHTML = `
                <div class="course-details">
                    <h4>${c.name}</h4>
                    <p class="mono">Marks: ${c.marks} / 100</p>
                </div>
                <button class="btn-delete-course" data-id="${c.id}" title="Remove Course">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;

            item.querySelector('.btn-delete-course').addEventListener('click', () => {
                deleteCourse(c.id);
            });

            coursesContainer.appendChild(item);
        });
    }

    function deleteCourse(id) {
        courses = courses.filter(c => c.id !== id);
        renderCourses();
        evaluateAnalytics();
    }

    function evaluateAnalytics() {
        if (courses.length === 0) {
            topAvgPct.textContent = "0%";
            topStatusBadge.className = "badge-status status-neutral";
            topStatusBadge.textContent = "Awaiting Data";
            topGradeRank.textContent = "--";
            marksRatioStr.textContent = "0 / 0 Marks";
            progressFillBar.style.width = "0%";
            return;
        }

        const totalObtained = courses.reduce((sum, c) => sum + c.marks, 0);
        const maxPossible = courses.length * 100;
        const avgPercentage = Math.round((totalObtained / maxPossible) * 100);

        topAvgPct.textContent = `${avgPercentage}%`;
        marksRatioStr.textContent = `${totalObtained} / ${maxPossible} Marks`;
        progressFillBar.style.width = `${avgPercentage}%`;

        // Check pass/fail (Avg >= 40 & no subject < 35)
        const hasFailedSubject = courses.some(c => c.marks < 35);
        const isPassed = (avgPercentage >= 40) && !hasFailedSubject;

        if (isPassed) {
            topStatusBadge.className = "badge-status status-pass";
            topStatusBadge.textContent = "PASSED";
        } else {
            topStatusBadge.className = "badge-status status-fail";
            topStatusBadge.textContent = "FAILED";
        }

        let grade = "F";
        if (avgPercentage >= 90) grade = "A+";
        else if (avgPercentage >= 75) grade = "A";
        else if (avgPercentage >= 60) grade = "B";
        else if (avgPercentage >= 50) grade = "C";

        topGradeRank.textContent = grade;
    }
});
