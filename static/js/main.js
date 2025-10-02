// Minimal Pomodoro timer skeleton for frontend
let timerEl, startBtn, stopBtn, resetBtn;
let seconds = 25*60;
let interval = null;

function formatTime(s){
    let m = Math.floor(s/60).toString().padStart(2,'0');
    let sec = (s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
}

document.addEventListener('DOMContentLoaded', ()=>{
    timerEl = document.getElementById('timer');
    startBtn = document.getElementById('start');
    stopBtn = document.getElementById('stop');
    resetBtn = document.getElementById('reset');
    timerEl && (timerEl.textContent = formatTime(seconds));

    startBtn && startBtn.addEventListener('click', ()=>{
        if(interval) return;
        interval = setInterval(()=>{
            seconds--;
            timerEl.textContent = formatTime(seconds);
            if(seconds<=0){
                clearInterval(interval);
                interval = null;
                seconds = 25*60;
                // simple TTS
                if(window.speechSynthesis){
                    let u = new SpeechSynthesisUtterance('Pomodoro completed!');
                    window.speechSynthesis.speak(u);
                }
            }
        }, 1000);
    });

    stopBtn && stopBtn.addEventListener('click', ()=>{
        if(interval) clearInterval(interval);
        interval = null;
    });

    resetBtn && resetBtn.addEventListener('click', ()=>{
        if(interval) clearInterval(interval);
        interval = null;
        seconds = 25*60;
        timerEl.textContent = formatTime(seconds);
    });

    // Task form submit (dashboard)
    const tf = document.getElementById('task-form');
    if(tf){
        tf.addEventListener('submit', async (e)=>{
            e.preventDefault();
            const title = tf.title.value.trim();
            if(!title) return;
            await fetch('/api/tasks', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({title})
            });
            window.location.reload();
        });
    }
});