// Variables

let filterVslue = "all";
// sekecting

const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todolist");
const formError = document.querySelector(".form--error");
const selectfFilter = document.querySelector(".filter-todos");
const message = document.querySelector(".Message__container");
const messageBack = document.querySelector(".back");
const formEdit = document.querySelector(".form__edit");
const inputEdit = document.querySelector(".form__edit input");
const formeEdit = document.querySelector(".form__edit form");
const group = document.querySelector(".grouping");

// Events
todoForm.addEventListener("submit", addNewTodo);
selectfFilter.addEventListener("change", (e) => {
  filterVslue = e.target.value;
  filterTodos();
});
document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  createTodos(todos);
});

messageBack.addEventListener("click", close);

// functions

function addNewTodo(e) {
  e.preventDefault();

  close();

  if (!todoInput.value) {
    formError.style.display = "block";
    todoForm.style.border = "2px solid var(--mainRed)";
    return;
  }

  formError.style.display = "none";
  todoForm.style.border = "1px solid var(--primaryColor)";
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
    grouping: group.value,
  };

  // todos.push(newTodo);
  saveTodo(newTodo);

  filterTodos();
  messages();
  setTimeout(close, 800);
}

function createTodos(todos) {
  let result = "";

  todos.forEach((todo) => {
    const groupIcons =
      todo.grouping === "work"
        ? `<i class="fa-solid fa-briefcase"></i> کار`
        : todo.grouping === "lesson"
        ? `<i class="fa-solid fa-book"></i> درس`
        : `<i class="fa-solid fa-house"></i> عمومی`;

    result += `<li class="todo">
    <span class="todo__group" >${groupIcons}</span> 
            <p class="todo__title ${todo.isCompleted && "completed"} "> ${
      todo.title
    }</p>
            <span class="todo__createdAt ${
              todo.isCompleted && "completed"
            }">${new Date(todo.createdAt).toLocaleDateString("fa-IR")}</span>
            <div>
              <button class="todo__check ${
                todo.isCompleted && "completed__button"
              }" data-todo-id=${
      todo.id
    }><i class=" fa-solid fa-circle-check"></i> </button>
              <button class="todo__remove" data-todo-id=${
                todo.id
              }><i class=" fa-solid fa-trash"></i> </button>
              <button class="todo__edit" data-todo-id=${
                todo.id
              } ><i class="fa-solid fa-file-pen"></i></button>
            </div>
          </li>`;
  });
  todoList.innerHTML = result;
  todoInput.value = "";

  const removeBtn = [...document.querySelectorAll(".todo__remove")];
  removeBtn.forEach((btn) => btn.addEventListener("click", removeTodo));
  const checkBtn = [...document.querySelectorAll(".todo__check")];
  checkBtn.forEach((btn) => btn.addEventListener("click", checkTodo));
  const buttonEdit = [...document.querySelectorAll(".todo__edit")];
  buttonEdit.forEach((btn) => btn.addEventListener("click", editTodo));
}

function filterTodos(e) {
  // const filter = e.target.value;
  const todos = getAllTodos();
  switch (filterVslue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((t) => t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((t) => !t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    default: {
      createTodos(todos);
    }
  }
}

function removeTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== todoId);
  saveAllTodo(todos);
  filterTodos();
}

function checkTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  saveAllTodo(todos);
  filterTodos();
}

function messages() {
  message.style.transform = " translateX(-50%) rotateY(0deg)";
  messageBack.style.display = "block";
  messageBack.style.opacity = "1";
}

function editTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  inputEdit.value = todo.title;
  formEdit.style.transform = " translateX(-50%) rotateY(0deg)";
  messageBack.style.display = "block";
  messageBack.style.opacity = "1";
  formeEdit.addEventListener("submit", (e) => {
    e.preventDefault();
    todo.title = inputEdit.value;
    saveAllTodo(todos);
    filterTodos();
    close();
  });
}

console.log(inputEdit.value);

function close() {
  message.style.transform = " translateX(-50%) rotateY(90deg)";
  messageBack.style.display = "none";
  messageBack.style.opacity = "0";
  formEdit.style.transform = " translateX(-50%) rotateY(90deg)";
}

// localStorage

function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveTodo(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function saveAllTodo(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
