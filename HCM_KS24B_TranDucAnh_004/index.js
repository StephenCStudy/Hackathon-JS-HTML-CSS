let tasks = [];
//lấy dữ liệu từ locallocal
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}
// lưu diwx liệu lên locallocal
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// render dữ liệuliệu
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.deadline}</td>
            <td>${task.person}</td>
            <td>${task.status}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="editTask(${index})">Sửa</button>
                <button class="btn btn-danger btn-sm" style="margin-left:10px;" onclick="deleteTask(${index})">Xóa</button>
            </td>
        `;
        taskList.appendChild(row);
    });
}
// kiểm tra các giá trị nhập vào
function validateInputs(name, deadline, person, status) {
    let valid = true;

    document.getElementById('nameError').style.display = name ? 'none' : 'block';
    document.getElementById('dateError').style.display = deadline ? 'none' : 'block';
    document.getElementById('personError').style.display = person ? 'none' : 'block';
    document.getElementById('statusError').style.display = status ? 'none' : 'block';

    if (!name || !deadline || !person || !status) valid = false;

    return valid;
}

// thêm vào mảng nếu đúng dữ liệu nhập vào
function handleTaskForm(event) {
    event.preventDefault();

    const name = document.getElementById('nameToDo').value;
    const deadline = document.getElementById('dateToDo').value;
    const person = document.getElementById('personInCharge').value;
    const status = document.getElementById('statusToDo').value;

    if (!validateInputs(name, deadline, person, status)) return;

    const taskIndex = document.getElementById('taskForm').dataset.index;

    if (taskIndex) {
        tasks[taskIndex] = { name, deadline, person, status };
        delete document.getElementById('taskForm').dataset.index; 
    } else {
        tasks.push({ name, deadline, person, status });
    }

    saveTasks(); 
    renderTasks();
    document.getElementById('taskForm').reset();
}

// nút sửa dữ liệu - sài modalmodal
function editTask(index) {
    currentEditIndex = index; 
    const task = tasks[index];

    document.getElementById('editNameToDo').value = task.name;
    document.getElementById('editDateToDo').value = task.deadline;
    document.getElementById('editPersonInCharge').value = task.person;
    document.getElementById('editStatusToDo').value = task.status;

    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}
// nút lưu dữ liệu sau sửa
function saveChanges() {
    if (currentEditIndex !== null) {
        const name = document.getElementById('editNameToDo').value;
        const deadline = document.getElementById('editDateToDo').value;
        const person = document.getElementById('editPersonInCharge').value;
        const status = document.getElementById('editStatusToDo').value;

        if (!name || !deadline || !person || !status) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        tasks[currentEditIndex] = { name, deadline, person, status };
        saveTasks(); 

        renderTasks();
        const editModalElement = document.getElementById('editModal');
        const editModal = bootstrap.Modal.getInstance(editModalElement);
        editModal.hide();
    }
}
// nút xóa dữ liệuliệu
function deleteTask(index) {
    if (confirm('Bạn có chắc muốn xóa công việc này không?')) {
        tasks.splice(index, 1);
        saveTasks(); 
        renderTasks();
    }
}
// thẻ tìm kiếm - hiển thị lại kết quả
function searchTasks(event) {
    if (event.key === 'Enter') {
        const searchTerm = document.getElementById('searchTask').value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchTerm));
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        filteredTasks.forEach((task, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.name}</td>
                <td>${task.deadline}</td>
                <td>${task.person}</td>
                <td>${task.status}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="editTask(${index})">Sửa</button>
                    <button class="btn btn-danger btn-sm" style="margin-left:10px; onclick="deleteTask(${index})">Xóa</button>
                </td>
            `;
            taskList.appendChild(row);
        });
    }
}

document.getElementById('taskForm').addEventListener('submit', handleTaskForm);
document.getElementById('searchTask').addEventListener('keydown', searchTasks);

loadTasks();