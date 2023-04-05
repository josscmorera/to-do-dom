let form = document.querySelector('#todo-form');
let input = document.querySelector('#todo-input');
let list = document.querySelector('#todo-list');
let clearButton = document.querySelector('#clear-button');
let complete = document.querySelector('#complete');
let clearCompleted = document.querySelector('#clear');


let tasks = [];


if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

form.addEventListener('submit', event => {
    event.preventDefault();
    let task = {
        id: Date.now(),
        text: input.value,
        status: 'new'
    };
    tasks.push(task);
    addTaskToDOM(task);
    saveTasksToLocalStorage();
    input.value = '';
});

list.addEventListener('change', event => {
    let taskId = Number(event.target.parentElement.getAttribute('data-task-id'));
    let taskIndex = tasks.findIndex(task => task.id === taskId);
    tasks[taskIndex].status = getStatusFromCheckbox(event.target);
    saveTasksToLocalStorage();
});

list.addEventListener('click', event => {
    if (event.target.classList.contains('delete')) {
        let taskId = Number(event.target.parentElement.getAttribute('data-task-id'));
        let taskIndex = tasks.findIndex(task => task.id === taskId);
        tasks.splice(taskIndex, 1);
        event.target.parentElement.remove();
        saveTasksToLocalStorage();
    }
});

clearButton.addEventListener('click', () => {
    tasks = [];
    list.innerHTML = '';
    localStorage.removeItem('tasks');
});

function addTaskToDOM(task) {
    let item = document.createElement('li');
    item.setAttribute('data-task-id', task.id);
    let status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = task.status === 'completed';
    status.className = 'status';
    let text = document.createElement('span');
    text.innerText = task.text;
    let statusText = document.createElement('span');
    statusText.innerText = getStatusText(task.status);
    statusText.className = 'status-text';
    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete';
    item.appendChild(status);
    item.appendChild(text);
    item.appendChild(statusText);
    item.appendChild(deleteButton);
    list.appendChild(item);
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getStatusFromCheckbox(checkbox) {
    if (checkbox.checked) {
        return 'completed';
    } else {
        let statusText = checkbox.nextElementSibling;
        if (statusText.innerText === 'new') {
            return 'in-progress';
        } else {
            return 'new';
        }
    }
}

function getStatusText(status) {
    switch (status) {
        case 'new':
            return 'new';
        case 'in-progress':
            return 'in progress';
        case 'completed':
            return 'completed';
        default:
            return '';
    }
} 

complete.addEventListener('click', () => {
    let selectedItems = document.querySelectorAll('#todo-list li input[type="checkbox"]:checked');
    selectedItems.forEach(selectedItem => {
        let item = selectedItem.parentElement;
        let taskId = Number(item.getAttribute('data-task-id'));
        let taskIndex = tasks.findIndex(task => task.id === taskId);
        tasks[taskIndex].status = 'completed';
        let statusText = item.querySelector('.status-text');
        statusText.innerText = getStatusText(tasks[taskIndex].status);
    });
    saveTasksToLocalStorage();
});

clearCompleted.addEventListener('click', () => {
    let completedTasks = tasks.filter(task => task.status === 'completed');
    completedTasks.forEach(completedTask => {
        let item = document.querySelector(`[data-task-id="${completedTask.id}"]`);
        tasks.splice(tasks.indexOf(completedTask), 1);
        item.remove();
    });
    saveTasksToLocalStorage();
});
