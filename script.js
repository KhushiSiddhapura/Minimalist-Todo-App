const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const darkmode = document.querySelector(".dark-mode");
const lightmode = document.querySelector(".light-mode");
const mainDiv = document.querySelector("main");
const addTaskbtn = document.querySelector("#addTask");
const formDiv = document.querySelector(".form");
const closeForm = document.querySelector(".close-form");
const add = document.querySelector("button#add");
const form = document.querySelector("form");
const uiDiv = document.querySelector(".list");
let edit = false;
let editId = null;

let deleteId = null;
const deleteModal = document.querySelector("#deleteConfirmModal");
const confirmDeleteBtn = document.querySelector("#confirmDelete");
const cancelDeleteBtn = document.querySelector("#cancelDelete");

darkmode.addEventListener("click", () => {
  mainDiv.classList.add("dark");
  mainDiv.classList.remove("light");
  document.body.classList.add("dark");
  document.body.classList.remove("light");

  localStorage.setItem("theme", "dark");

  lightmode.style.display = "block";
  darkmode.style.display = "none";
});

lightmode.addEventListener("click", () => {
  mainDiv.classList.add("light");
  mainDiv.classList.remove("dark");
  document.body.classList.add("light");
  document.body.classList.remove("dark");

  localStorage.setItem("theme", "light");

  lightmode.style.display = "none";
  darkmode.style.display = "block";
});

const theme = localStorage.getItem("theme");

if (theme === "dark") {
  mainDiv.classList.add("dark");
  mainDiv.classList.remove("light");
  document.body.classList.add("dark");
  document.body.classList.remove("light");

  lightmode.style.display = "block";
  darkmode.style.display = "none";
} else {
  mainDiv.classList.add("light");
  mainDiv.classList.remove("dark");
  document.body.classList.add("light");
  document.body.classList.remove("dark");

  lightmode.style.display = "none";
  darkmode.style.display = "block";
}

addTaskbtn.addEventListener("click", () => {
  formDiv.style.display = "flex";
  uiDiv.style.display = "none";
});

closeForm.addEventListener("click", () => {
  formDiv.style.display = "none";
  uiDiv.style.display = "grid";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (edit) {
    tasks[editId].title = e.target[0].value;
    tasks[editId].description = e.target[1].value;
    tasks[editId].priority = e.target[2].value;
    edit = false;
    editId = null;
  } else {
    tasks.push({
      title: e.target[0].value,
      description: e.target[1].value,
      priority: e.target[2].value,
      completed: false,
    });
  }

  saveTasks();

  form.reset();
  formDiv.style.display = "none";
  uiDiv.style.display = "grid";
  ui();
});

function ui() {
  uiDiv.innerHTML = "";
  tasks.forEach((elem, id) => {
    uiDiv.innerHTML += `<div class="card">
            <div class="priority"><span class="${elem.priority}">${elem.priority}</span></div>
            <div class="task">
              <p class="title">${elem.title}</p>
              <p class="description">${elem.description}</p>
            </div>
            <div class="btns">
              <button class="edit"  onclick = "editTask('${id}')" ${elem.completed ? "disabled" : ""}>Edit</button>
              <button class="del"  onclick = "deleteTask('${id}')">Delete</button>
              <button class="complete" onclick="completed('${id}')" ${elem.completed ? "disabled" : ""}> ${elem.completed ? "Completed" : "Mark as Completed"} </button>
            </div>
          </div>`;
  });
}

function deleteTask(id) {
  deleteId = Number(id);
  deleteModal.classList.add("show");
}

cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.classList.remove("show");
  deleteId = null;
});

confirmDeleteBtn.addEventListener("click", () => {
  if (deleteId !== null) {
    tasks.splice(deleteId, 1);
    saveTasks();
    ui();
    deleteModal.classList.remove("show");
    deleteId = null;
  }
});

deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) {
    deleteModal.classList.remove("show");
    deleteId = null;
  }
});

function editTask(id) {
  edit = true;
  editId = Number(id);
  formDiv.style.display = "flex";
  uiDiv.style.display = "none";
  form.elements[0].value = tasks[editId].title;
  form.elements[1].value = tasks[editId].description;
  form.elements[2].value = tasks[editId].priority;
}

function completed(id) {
  tasks[id].completed = true;
  saveTasks();
  ui();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

ui();

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker registered successfully!', reg))
      .catch((err) => console.log('Service Worker registration failed:', err));
  });
}
