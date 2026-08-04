/**
 * Practical 7: Arcane Quest Engine - Gamified Bento Grid & DOM Traversal
 */

document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('task-input');
    const taskPrioritySelect = document.getElementById('task-priority-select');
    const taskDateSelect = document.getElementById('task-date-select');
    const addTaskBtn = document.getElementById('btn-add-task');
    const todoListUl = document.getElementById('todo-list-ul');
    const emptyState = document.getElementById('todo-empty-state');

    const xpValDisplay = document.getElementById('xp-val');
    const ringFillBento = document.getElementById('ring-fill-bento');
    const pctNumBento = document.getElementById('pct-num-bento');
    const questsRemainingStr = document.getElementById('quests-remaining-str');

    const filterButtons = document.querySelectorAll('.bento-filter-btn');
    const activeCategoryTitle = document.getElementById('active-category-title');
    const activeCountBadge = document.getElementById('active-count-badge');

    const consoleDomPath = document.getElementById('console-dom-path');

    const today = new Date().toISOString().split('T')[0];
    taskDateSelect.value = today;

    let currentFilter = 'all';
    let userXP = 350;

    function logTraversal(pathStr) {
        consoleDomPath.textContent = pathStr;
        consoleDomPath.style.opacity = '0.5';
        setTimeout(() => {
            consoleDomPath.style.opacity = '1';
        }, 100);
    }

    addTaskBtn.addEventListener('click', createQuest);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createQuest();
    });

    function createQuest() {
        const text = taskInput.value.trim();
        const priority = taskPrioritySelect.value;
        let dateVal = taskDateSelect.value;

        if (text === "") return;

        if (dateVal) {
            const d = new Date(dateVal);
            dateVal = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            dateVal = "No Date";
        }

        if (todoListUl.contains(emptyState)) {
            emptyState.remove();
        }

        const li = document.createElement('li');
        li.className = `todo-item priority-${priority}`;
        li.setAttribute('data-priority', priority);

        li.innerHTML = `
            <div class="todo-left">
                <input type="checkbox" class="todo-checkbox" title="Mark Quest Complete">
                <div class="todo-details">
                    <span class="todo-text"></span>
                    <div class="todo-meta">
                        <span class="meta-tag tag-${priority}">${priority}</span>
                        <span class="meta-date"><i class="fa-regular fa-calendar"></i> ${dateVal}</span>
                    </div>
                </div>
            </div>
            <div class="todo-actions">
                <button class="todo-btn btn-edit-item" title="Edit Quest">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="todo-btn btn-delete-item" title="Abandon Quest">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        li.querySelector('.todo-text').textContent = text;
        todoListUl.appendChild(li);

        bindItemEvents(li, priority);

        taskInput.value = "";
        taskInput.focus();

        syncBentoStats();
        applyFilterView();

        logTraversal(`button#btn-add-task -> document.createElement('li') -> todoListUl.appendChild(li)`);
    }

    function bindItemEvents(itemRow, priority) {
        const todoLeft = itemRow.children[0];
        const todoActions = itemRow.children[1];

        const checkbox = todoLeft.children[0];
        const editBtn = todoActions.children[0];
        const deleteBtn = todoActions.children[1];

        let xpReward = 100;
        if (priority === 'low') xpReward = 50;
        else if (priority === 'high') xpReward = 200;

        checkbox.addEventListener('change', function() {
            const row = this.parentElement.parentElement;
            if (this.checked) {
                row.classList.add('completed');
                userXP += xpReward;
            } else {
                row.classList.remove('completed');
                userXP = Math.max(0, userXP - xpReward);
            }

            xpValDisplay.textContent = `${userXP} XP`;
            syncBentoStats();
            applyFilterView();

            logTraversal(`checkbox -> this.parentElement.parentElement -> classList.toggle('completed')`);
        });

        deleteBtn.addEventListener('click', function() {
            const row = this.closest('.todo-item');
            row.remove();

            const items = todoListUl.querySelectorAll('.todo-item');
            if (items.length === 0) {
                todoListUl.appendChild(emptyState);
            }

            syncBentoStats();
            logTraversal(`button.btn-delete-item -> this.closest('.todo-item') -> .remove()`);
        });

        editBtn.addEventListener('click', function() {
            const row = this.closest('.todo-item');
            const detailsDiv = row.querySelector('.todo-details');
            const textSpan = detailsDiv.querySelector('.todo-text');

            const isEditing = row.classList.contains('editing');
            const icon = this.querySelector('i');

            if (isEditing) {
                const inputField = detailsDiv.querySelector('.todo-edit-input');
                const newText = inputField.value.trim();

                if (newText !== "") {
                    textSpan.textContent = newText;
                    inputField.remove();
                    textSpan.style.display = "";

                    row.classList.remove('editing');
                    icon.className = 'fa-solid fa-pen-to-square';
                    logTraversal(`button.btn-edit -> detailsDiv.querySelector('.todo-edit-input') -> inputField.remove()`);
                }
            } else {
                const currentText = textSpan.textContent;
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.className = 'todo-edit-input';
                inputField.value = currentText;

                detailsDiv.insertBefore(inputField, textSpan);
                textSpan.style.display = "none";
                inputField.focus();

                inputField.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') editBtn.click();
                });

                row.classList.add('editing');
                icon.className = 'fa-solid fa-floppy-disk';
                logTraversal(`button.btn-edit -> detailsDiv.insertBefore(inputField, textSpan)`);
            }
        });
    }

    function syncBentoStats() {
        const items = todoListUl.querySelectorAll('.todo-item');
        const total = items.length;

        let pending = 0;
        items.forEach(item => {
            if (!item.classList.contains('completed')) pending++;
        });

        const completed = total - pending;

        if (total === 0) {
            questsRemainingStr.textContent = "0 Quests Remaining";
        } else {
            questsRemainingStr.textContent = `${pending} Quest${pending !== 1 ? 's' : ''} Remaining`;
        }

        const circumference = 226.19; // 2 * PI * 36
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        const offset = circumference - (circumference * pct / 100);

        pctNumBento.textContent = `${pct}%`;
        ringFillBento.style.strokeDashoffset = offset;
    }

    function applyFilterView() {
        const items = todoListUl.querySelectorAll('.todo-item');
        let visibleCount = 0;

        items.forEach(item => {
            const isCompleted = item.classList.contains('completed');
            const priority = item.getAttribute('data-priority');

            let visible = false;
            switch(currentFilter) {
                case 'all': visible = true; break;
                case 'pending': visible = !isCompleted; break;
                case 'high': visible = (priority === 'high' && !isCompleted); break;
                case 'completed': visible = isCompleted; break;
            }

            if (visible) visibleCount++;
            item.style.display = visible ? "" : "none";
        });

        activeCountBadge.textContent = `${visibleCount} Listed`;
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentFilter = btn.getAttribute('data-filter');
            activeCategoryTitle.textContent = btn.textContent.trim();

            applyFilterView();
        });
    });
});
