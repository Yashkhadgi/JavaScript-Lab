/**
 * Practical 3: Neumorphic Grade Evaluation Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const studentNameInput = document.getElementById('student-name');
    const studentRollInput = document.getElementById('student-roll');
    const subjectNameInput = document.getElementById('subject-name');
    const subjectMarksInput = document.getElementById('subject-marks');
    const btnAddSubject = document.getElementById('btn-add-subject');

    const subjectsContainer = document.getElementById('subjects-container');
    const emptyState = document.getElementById('empty-state');
    const subjectCountBadge = document.getElementById('subject-count');

    // Evaluation outputs
    const scoreRingProgress = document.getElementById('score-ring-progress');
    const avgPctText = document.getElementById('avg-pct-text');
    const totalScoreVal = document.getElementById('total-score-val');
    const gradeRankVal = document.getElementById('grade-rank-val');
    const resultStamp = document.getElementById('result-stamp');

    let subjects = [];

    // -------------------------------------------------------------
    // ADD SUBJECT
    // -------------------------------------------------------------
    btnAddSubject.addEventListener('click', addSubject);
    
    [subjectNameInput, subjectMarksInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addSubject();
        });
    });

    function addSubject() {
        const name = subjectNameInput.value.trim();
        const marksVal = subjectMarksInput.value.trim();

        if (name === "" || marksVal === "") return;

        const marks = parseFloat(marksVal);
        if (isNaN(marks) || marks < 0 || marks > 100) return;

        // Push data item
        const subjectObj = {
            id: Date.now(),
            name: name,
            marks: marks
        };

        subjects.push(subjectObj);

        // Reset inputs
        subjectNameInput.value = "";
        subjectMarksInput.value = "";
        subjectNameInput.focus();

        renderSubjects();
        evaluateScores();
    }

    // -------------------------------------------------------------
    // RENDER SUBJECT CARDS
    // -------------------------------------------------------------
    function renderSubjects() {
        subjectsContainer.innerHTML = "";

        if (subjects.length === 0) {
            subjectsContainer.appendChild(emptyState);
            subjectCountBadge.textContent = "0 Subjects";
            return;
        }

        subjectCountBadge.textContent = `${subjects.length} Subject${subjects.length > 1 ? 's' : ''}`;

        subjects.forEach(sub => {
            const card = document.createElement('div');
            card.className = 'neu-subject-card';

            card.innerHTML = `
                <div class="subject-info">
                    <h4>${sub.name}</h4>
                    <p>Score: ${sub.marks} / 100</p>
                </div>
                <button class="btn-del-subject" data-id="${sub.id}" title="Remove Subject">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;

            card.querySelector('.btn-del-subject').addEventListener('click', () => {
                deleteSubject(sub.id);
            });

            subjectsContainer.appendChild(card);
        });
    }

    function deleteSubject(id) {
        subjects = subjects.filter(sub => sub.id !== id);
        renderSubjects();
        evaluateScores();
    }

    // -------------------------------------------------------------
    // EVALUATE SCORE & UPDATE RADIAL RING / STAMP
    // -------------------------------------------------------------
    function evaluateScores() {
        const circumference = 326.72; // 2 * PI * r (r=52)

        if (subjects.length === 0) {
            avgPctText.textContent = "0%";
            totalScoreVal.textContent = "0 / 0";
            gradeRankVal.textContent = "--";
            scoreRingProgress.style.strokeDashoffset = circumference;
            resultStamp.className = "rubber-stamp stamp-pending";
            resultStamp.textContent = "PENDING";
            return;
        }

        const totalMarksObtained = subjects.reduce((sum, sub) => sum + sub.marks, 0);
        const maxMarksPossible = subjects.length * 100;
        const avgPercentage = Math.round((totalMarksObtained / maxMarksPossible) * 100);

        // Update Text
        avgPctText.textContent = `${avgPercentage}%`;
        totalScoreVal.textContent = `${totalMarksObtained} / ${maxMarksPossible}`;

        // Update Ring Offset
        const offset = circumference - (circumference * avgPercentage / 100);
        scoreRingProgress.style.strokeDashoffset = offset;

        // Calculate Grade Rank
        let grade = "F";
        if (avgPercentage >= 90) grade = "A+";
        else if (avgPercentage >= 75) grade = "A";
        else if (avgPercentage >= 60) grade = "B";
        else if (avgPercentage >= 50) grade = "C";

        gradeRankVal.textContent = grade;

        // Pass/Fail check (average >= 40% and no single subject < 35)
        const hasFailedSubject = subjects.some(sub => sub.marks < 35);
        const isPassed = (avgPercentage >= 40) && !hasFailedSubject;

        if (isPassed) {
            resultStamp.className = "rubber-stamp stamp-pass";
            resultStamp.textContent = "PASSED";
        } else {
            resultStamp.className = "rubber-stamp stamp-fail";
            resultStamp.textContent = "FAILED";
        }
    }
});
