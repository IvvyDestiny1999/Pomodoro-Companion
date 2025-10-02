let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;

function updateDisplay() {
  const timerDisplay = document.getElementById("timer");
  timerDisplay.textContent = 
    `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timer);
          alert("Pomodoro concluído!");
          isRunning = false;
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      updateDisplay();
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timer);
  minutes = 25;
  seconds = 0;
  isRunning = false;
  updateDisplay();
}

updateDisplay();
