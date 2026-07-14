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
let plannerData = {};

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

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
let timeRemaining = WORK_DURATION;
let timerInterval = null;
let isBreak = false;

// Daily Goals
const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");
const goalsList = document.getElementById("goalsList");
const goalsProgress = document.getElementById("goalsProgress");
let goals = [];

// Weather Widget
const weatherIcon = document.getElementById("weatherIcon");
const weatherTemp = document.getElementById("weatherTemp");
const weatherLocation = document.getElementById("weatherLocation");

// Date and Time
const currentTime = document.getElementById("currentTime");
const currentDate = document.getElementById("currentDate");

// Dynamic Background
const dynamicBg = document.getElementById("dynamicBg");

// Theme Switcher
const themeToggleBtn = document.getElementById("themeToggleBtn");
const htmlRoot = document.documentElement;

// Navigations
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

backButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let parent = e.target.closest(".feature-section");
    parent.classList.remove("active");
    dashboardView.style.display = "grid";
  });
});

// TodoList
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  let stored = localStorage.getItem("todos");
  todos = stored ? JSON.parse(stored) : [];
  renderTodo();
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

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let taskText = todoInput.value.trim();
  if (taskText === "") return;

  todos.push({
    id: Date.now(),
    text: taskText,
    completed: false,
    important: false,
  });

  saveTodos();
  renderTodo();
  todoInput.value = "";
});

todoList.addEventListener("click", (e) => {
  let btn = e.target.closest("button");
  if (!btn) return;

  let liEle = btn.closest("li");
  let id = Number(liEle.dataset.id);
  let todo = todos.find((t) => t.id === id);
  if (!todo) return;

  if (btn.classList.contains("important-btn")) {
    todo.important = !todo.important;
  } else if (btn.classList.contains("complete-btn")) {
    todo.completed = !todo.completed;
  } else if (btn.classList.contains("delete-btn")) {
    todos = todos.filter((t) => t.id !== id);
  }

  saveTodos();
  renderTodo();
});

// Daily Planner
function savePlanner() {
  localStorage.setItem("plannerData", JSON.stringify(plannerData));
}

function loadPlanner() {
  let stored = localStorage.getItem("plannerData");
  plannerData = stored ? JSON.parse(stored) : {};

  plannerInputs.forEach((input) => {
    let hour = input.closest(".planner-slot").dataset.hour;
    if (plannerData[hour]) {
      input.value = plannerData[hour];
    }
  });

  highlightCurrentHour();
}

plannerInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    let hour = e.target.closest(".planner-slot").dataset.hour;
    plannerData[hour] = e.target.value;
    savePlanner();
  });
});

function highlightCurrentHour() {
  let nowHour = new Date().getHours();
  document.querySelectorAll(".planner-slot").forEach((slot) => {
    slot.classList.toggle(
      "current-hour",
      Number(slot.dataset.hour) === nowHour,
    );
  });
}

// Motivation Quote
async function fetchQuote() {
  quoteLoader.classList.remove("hidden");
  quoteText.textContent = "";
  quoteAuthor.textContent = "";

  try {
    let response = await fetch("https://dummyjson.com/quotes/random");
    if (!response.ok) throw new Error("Network response failed");

    let data = await response.json();
    quoteText.textContent = data.quote;
    quoteAuthor.textContent = "- " + data.author;
  } catch (error) {
    quoteText.textContent =
      "Could not fetch a quote right now. Try again in a moment.";
    quoteAuthor.textContent = "";
  } finally {
    quoteLoader.classList.add("hidden");
  }
}

newQuoteBtn.addEventListener("click", fetchQuote);

// Promodoro Timer
function formatTime(totalSeconds) {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timeRemaining);
}

function tick() {
  if (timeRemaining > 0) {
    timeRemaining--;
    updateTimerDisplay();
  } else {
    clearInterval(timerInterval);
    timerInterval = null;

    isBreak = !isBreak;
    timeRemaining = isBreak ? BREAK_DURATION : WORK_DURATION;
    sessionLabel.textContent = isBreak ? "Break Session" : "Work Session";
    updateTimerDisplay();

    alert(
      isBreak
        ? "Work session done. Time for a break."
        : "Break over. Back to work.",
    );
  }
}

startBtn.addEventListener("click", () => {
  if (timerInterval) return; // prevent multiple intervals
  timerInterval = setInterval(tick, 1000);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  isBreak = false;
  timeRemaining = WORK_DURATION;
  sessionLabel.textContent = "Work Session";
  updateTimerDisplay();
});

// Daily Goals
function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
}

function loadGoals() {
  let stored = localStorage.getItem("goals");
  goals = stored ? JSON.parse(stored) : [];
  renderGoals();
}

function updateGoalsProgress() {
  let completedCount = goals.filter((g) => g.completed).length;
  goalsProgress.textContent = `${completedCount} of ${goals.length} completed`;
}

function renderGoals() {
  goalsList.innerHTML = "";

  goals.forEach((goal) => {
    let li = document.createElement("li");
    li.dataset.id = goal.id;
    if (goal.completed) li.classList.add("completed");

    li.innerHTML = `
      <span class="item-text">${goal.text}</span>
      <div class="item-actions">
          <button class="complete-btn"><i class="ri-checkbox-circle-line"></i></button>
          <button class="delete-btn"><i class="ri-delete-bin-line"></i></button>
      </div>
    `;

    goalsList.appendChild(li);
  });

  updateGoalsProgress();
}

goalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let goalText = goalInput.value.trim();
  if (goalText === "") return;

  goals.push({ id: Date.now(), text: goalText, completed: false });

  saveGoals();
  renderGoals();
  goalInput.value = "";
});

goalsList.addEventListener("click", (e) => {
  let btn = e.target.closest("button");
  if (!btn) return;

  let liEle = btn.closest("li");
  let id = Number(liEle.dataset.id);
  let goal = goals.find((g) => g.id === id);
  if (!goal) return;

  if (btn.classList.contains("complete-btn")) {
    goal.completed = !goal.completed;
  } else if (btn.classList.contains("delete-btn")) {
    goals = goals.filter((g) => g.id !== id);
  }

  saveGoals();
  renderGoals();
});

// Date and Time
function updateDateTime() {
  let now = new Date();

  let timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  currentTime.textContent = timeStr;
  currentDate.textContent = dateStr;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// Dynamic Background
function updateDynamicBackground() {
  let hour = new Date().getHours();
  let timeClass = "";

  if (hour >= 5 && hour < 12) {
    timeClass = "time-morning";
  } else if (hour >= 12 && hour < 17) {
    timeClass = "time-afternoon";
  } else if (hour >= 17 && hour < 21) {
    timeClass = "time-evening";
  } else {
    timeClass = "time-night";
  }

  dynamicBg.classList.remove(
    "time-morning",
    "time-afternoon",
    "time-evening",
    "time-night",
  );
  dynamicBg.classList.add(timeClass);
}

updateDynamicBackground();
setInterval(updateDynamicBackground, 60 * 1000);

// Theme Switcher
function applyTheme(theme) {
  htmlRoot.setAttribute("data-theme", theme);
  themeToggleBtn.innerHTML =
    theme === "light"
      ? '<i class="ri-sun-line"></i>'
      : '<i class="ri-moon-line"></i>';
}

function loadTheme() {
  let savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);
}

themeToggleBtn.addEventListener("click", () => {
  let current =
    htmlRoot.getAttribute("data-theme") === "light" ? "light" : "dark";
  let next = current === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

// Weather Widget
async function fetchWeather(lat, lon, label) {
  try {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    let response = await fetch(url);
    if (!response.ok) throw new Error("Weather fetch failed");

    let data = await response.json();
    let temp = Math.round(data.current_weather.temperature);

    weatherTemp.textContent = `${temp}°C`;
    weatherLocation.textContent = label;
    weatherIcon.className = "ri-sun-line";
  } catch (error) {
    weatherTemp.textContent = "--°";
    weatherLocation.textContent = "Unavailable";
  }
}

function initWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(
          position.coords.latitude,
          position.coords.longitude,
          "Your location",
        );
      },
      () => {
        // fallback city if user denies location access - Karachi
        fetchWeather(24.8607, 67.0011, "Karachi");
      },
    );
  } else {
    fetchWeather(24.8607, 67.0011, "Karachi");
  }
}

// Initialization
loadTheme();
loadTodos();
loadPlanner();
loadGoals();
initWeather();
updateTimerDisplay();
fetchQuote();
