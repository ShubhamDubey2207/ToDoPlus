document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const taskPriority = document.getElementById("taskPriority");
    const filterAll = document.getElementById("filterAll");
    const filterCompleted = document.getElementById("filterCompleted");
    const filterPending = document.getElementById("filterPending");
    const footerStats = document.getElementById("footerStats");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updateFooterStats();
    };

    const updateFooterStats = () => {
        const total = tasks.length;
        const completed = tasks.filter((task) => task.completed).length;
        footerStats.textContent = `© 2024 To-Do App | Total Tasks: ${total} | Completed: ${completed}`;
    };

    const renderTasks = (filter = "All") => {
        taskList.innerHTML = "";
        tasks
            .filter((task) => {
                if (filter === "Completed") return task.completed;
                if (filter === "Pending") return !task.completed;
                return true;
            })
            .forEach((task, index) => {
                const li = document.createElement("li");
                li.classList.add("list-group-item");
                li.innerHTML = `
                    <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" class="form-check-input me-2">
                    <span class="${task.completed ? "text-decoration-line-through" : ""}">${task.text} (${task.priority})</span>
                    <button class="delete-btn btn btn-danger btn-sm" data-index="${index}">&times;</button>
                `;
                taskList.appendChild(li);
            });
    };

    const addTask = () => {
        const taskValue = taskInput.value.trim();
        if (taskValue) {
            tasks.push({ text: taskValue, priority: taskPriority.value, completed: false });
            taskInput.value = "";
            saveTasks();
            renderTasks();
        } else {
            alert("Please enter a task!");
        }
    };

    addTaskBtn.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });

    taskList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.dataset.index;
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        } else if (e.target.type === "checkbox") {
            const index = e.target.dataset.index;
            tasks[index].completed = e.target.checked;
            saveTasks();
            renderTasks();
        }
    });

    [filterAll, filterCompleted, filterPending].forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.id.replace("filter", "");
            renderTasks(filter);
        });
    });

    renderTasks();
    updateFooterStats();
});
