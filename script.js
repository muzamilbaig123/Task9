// Navigation Dashboard
const dashboardView = document.getElementById("dashboardView");
const featureCards = document.querySelectorAll(".feature-card");
const featureSections = document.querySelectorAll(".feature-section");
const backButtons = document.querySelectorAll(".back-btn");

// Todo List
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
let todos = [];

// Daily Planner
const plannerList = document.getElementById("plannerList");
const plannerInputs = document.querySelectorAll(".planner-input");

// Motivation Quote
const newQuoteBtn = document.getElementById("newQuoteBtn");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteLoader = document.getElementById("quoteLoader");

// Pomodoro Timer
const timerDisplay = document.getElementById("timerDisplay");
const sessionLabel = document.getElementById("sessionLabel");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// Daily Goals
const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");
const goalsList = document.getElementById("goalsList");
const goalsProgress = document.getElementById("goalsProgress");

// Weather Widget
const weatherIcon = document.getElementById("weatherIcon");
const weatherTemp = document.getElementById("weatherTemp");
const weatherLocation = document.getElementById("weatherLocation");

// Date and Time
const currentTime = document.getElementById("currentTime");
const currentDate = document.getElementById("currentDate");

// Dynamic BAckgound
const dynamicBg = document.getElementById("dynamicBg");

// Theme Switcher
const themeToggleBtn = document.getElementById("themeToggleBtn");
const htmlRoot = document.documentElement;

featureCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    let id = e.currentTarget.dataset.target;
    let show = document.getElementById(id);

    featureSections.forEach((section) => {
      section.classList.remove("active");
    });

    show.classList.add("active");
    dashboardView.style.display = "none";
  });
});

//back button
backButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let parent = e.target.closest(".feature-section");
    parent.classList.remove("active");
    dashboardView.style.display = "grid";
  });
});

// todo work
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let taskText = todoInput.value.trim();

  if (taskText === "") {
    return;
  }

  todos.push({ id: Date.now(), text: taskText, completed: false, important: false });

  saveTodos();
  renderTodo();
  todoInput.value = "";
});


function saveTodos () {
    localStorage.setItem("todos", JSON.stringify(todos))
} 

function renderTodo() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    let li = document.createElement("li");
    li.dataset.id = todo.id;

    if (todo.completed) li.classList.add("completed");
    if (todo.important) li.classList.add("important");

    li.innerHTML = `
      <span class="item-text">${todo.text}</span>
      <div class="item-actions">
          <button class="important-btn"><i class="ri-star-line"></i></button>
          <button class="complete-btn"><i class="ri-check-line"></i></button>
          <button class="delete-btn"><i class="ri-delete-bin-line"></i></button>
      </div>
    `;

    todoList.appendChild(li);
  });
}


// complete, important, delete
todoList.addEventListener("click", (e) => {
  let btn = e.target.closest("button");

  if (!btn) return;

  let liEle = btn.closest("li");

  let importantBtn = btn.classList.contains("important-btn");
  let completeBtn = btn.classList.contains("complete-btn");
  let deletetBtn = btn.classList.contains("delete-btn");

  if (importantBtn) {
    liEle.classList.toggle("important");
  } else if (completeBtn) {
    liEle.classList.toggle("completed");
  } else if (deletetBtn) {
    liEle.remove();
  }
});
