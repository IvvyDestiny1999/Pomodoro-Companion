let pomodoroTimer;
let logs = [];

function startPomodoro() {
    clearInterval(pomodoroTimer);
    let time = 25 * 60; // 25 min
    pomodoroTimer = setInterval(() => {
        time--;
        if (time <= 0) {
            clearInterval(pomodoroTimer);
            speak('Pomodoro complete! Time for a break.');
            saveLog('Pomodoro complete');
        }
    }, 1000);
    speak('Pomodoro started! Focus now.');
}

function stopPomodoro() {
    clearInterval(pomodoroTimer);
    speak('Pomodoro stopped.');
    saveLog('Pomodoro stopped');
}

function toggleLogs() {
    const logsDiv = document.getElementById('logs');
    if (logsDiv.style.display === 'none') {
        logsDiv.style.display = 'block';
        logsDiv.innerHTML = logs.map(l => `<p>${l}</p>`).join('');
    } else {
        logsDiv.style.display = 'none';
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.voice = speechSynthesis.getVoices().find(v => v.name.includes('Female')) || null;
        speechSynthesis.speak(utter);
    }
}

function saveLog(message) {
    logs.push(message);
    fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, date: new Date() })
    });
}