/**
 * Practical 7: Apple Assessment Portal & DOM Traversal Engine (2-Row Layout)
 */

document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('task-input');
    const taskPrioritySelect = document.getElementById('task-priority-select');
    const btnAddTask = document.getElementById('btn-add-task');
    const todoListUl = document.getElementById('todo-list-ul');
    const emptyState = document.getElementById('todo-empty-state');

    const appleProgressFill = document.getElementById('apple-progress-fill');
    const pctValStr = document.getElementById('pct-val-str');
    const stepIndicator = document.getElementById('step-indicator');
    const taskCountBadge = document.getElementById('task-count-badge');
    const consoleDomPath = document.getElementById('console-dom-path');
    const tabs = document.querySelectorAll('.apple-tab');

    let currentFilter = 'all';

    function logTraversal(pathStr) {
        consoleDomPath.textContent = pathStr;
        consoleDomPath.style.opacity = '0.5';
        setTimeout(() => {
            consoleDomPath.style.opacity = '1';
        }, 100);
    }

    btnAddTask.addEventListener('click', createTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createTask();
    });

    function createTask() {
        const text = taskInput.value.trim();

        if (text === "") return;

        if (todoListUl.contains(emptyState)) {
            emptyState.remove();
        }

        const li = document.createElement('li');
        li.className = 'apple-task-item';

        li.innerHTML = `
            <div class="apple-task-left">
                <input type="checkbox" class="apple-checkbox" title="Mark Completed">
                <span class="task-text-lbl"></span>
            </div>
            <button class="btn-delete-task" title="Remove Task">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;

        li.querySelector('.task-text-lbl').textContent = text;
        todoListUl.appendChild(li);

        bindItemEvents(li);

        taskInput.value = "";
        taskInput.focus();

        updateProgress();
        applyFilter();

        logTraversal(`button#btn-add-task -> document.createElement('li') -> todoListUl.appendChild(li)`);
    }

    function bindItemEvents(itemRow) {
        const checkbox = itemRow.querySelector('.apple-checkbox');
        const deleteBtn = itemRow.querySelector('.btn-delete-task');

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                itemRow.classList.add('completed');
            } else {
                itemRow.classList.remove('completed');
            }

            updateProgress();
            applyFilter();
            logTraversal(`checkbox -> itemRow.classList.toggle('completed')`);
        });

        deleteBtn.addEventListener('click', function() {
            itemRow.remove();

            const items = todoListUl.querySelectorAll('.apple-task-item');
            if (items.length === 0) {
                todoListUl.appendChild(emptyState);
            }

            updateProgress();
            logTraversal(`button.btn-delete-task -> itemRow.remove()`);
        });
    }

    function updateProgress() {
        const items = todoListUl.querySelectorAll('.apple-task-item');
        const total = items.length;

        let completed = 0;
        items.forEach(item => {
            if (item.classList.contains('completed')) completed++;
        });

        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        appleProgressFill.style.width = `${pct}%`;
        pctValStr.textContent = `${pct}%`;

        stepIndicator.textContent = `Tasks • ${completed} of ${total} Completed`;
        taskCountBadge.textContent = `${total} Listed`;
    }

    function applyFilter() {
        const items = todoListUl.querySelectorAll('.apple-task-item');

        items.forEach(item => {
            const isCompleted = item.classList.contains('completed');

            let visible = false;
            switch(currentFilter) {
                case 'all': visible = true; break;
                case 'pending': visible = !isCompleted; break;
                case 'completed': visible = isCompleted; break;
            }

            item.style.display = visible ? "" : "none";
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            currentFilter = tab.getAttribute('data-filter');
            applyFilter();
        });
    });
});
