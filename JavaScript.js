let timer;
let currentStep = 0;
let isExercise = true;
let isTimerActive = false;
const beep = new Audio('Beep.mp3');
let wakeLock = null;
let timeLeft;
const timerCanvas = document.getElementById('timerCanvas');
const timerText = document.getElementById('timerText');
// Canvas
const ctx = timerCanvas.getContext('2d');


async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
        }
    } catch (err) {
        console.error(`Failed to acquire wake lock: ${err.message}`);
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release().then(() => {
            wakeLock = null;
        });
    }
}

function startTimer() {
    const exerciseDuration = parseInt(document.getElementById('exerciseDuration').value) || 0;
    const restDuration = parseInt(document.getElementById('restDuration').value) || 0;
    const steps = parseInt(document.getElementById('steps').value) || 0;

    if (exerciseDuration <= 0 || restDuration <= 0 || steps <= 0) {
        alert('Please Enter Valid Duration / Steps.');
        return;
    }

    clearInterval(timer);
    currentStep = 0;
    isExercise = true;
    isTimerActive = true;

    requestWakeLock();

    document.getElementById('startButton').innerText = 'Restart';
    document.getElementById('stopButton').disabled = false;
    document.getElementById('stepCounter').innerText = `Step: 1 / ${steps}`;

    nextStep(exerciseDuration, restDuration, steps);
}

function nextStep(exerciseDuration, restDuration, steps) {
    if (currentStep >= steps) {
        timerText.innerText = 'Workout Complete!';
        document.getElementById('startButton').innerText = 'Start';
        isTimerActive = false;
        document.getElementById('stopButton').disabled = true;
        releaseWakeLock();
        return;
    }

    timeLeft = isExercise ? exerciseDuration : restDuration;
    const type = isExercise ? 'Exercise' : 'Rest';
    timerText.innerText = `${timeLeft}s`;
    animateTimer(timeLeft);

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (isExercise) {
                isExercise = false;
            } else {
                currentStep++;
                isExercise = true;
                if (currentStep < steps) {
                    document.getElementById('stepCounter').innerText = `Step: ${currentStep + 1} / ${steps}`;
                }
            }
            nextStep(exerciseDuration, restDuration, steps);
        } else {
            timeLeft -= 1;
            timerText.innerText = `${timeLeft}s`;
            animateTimer(timeLeft, isExercise ? exerciseDuration : restDuration);

            if (isExercise && timeLeft <= 5 && timeLeft > 0) {
                beep.play();
            }
        }
    }, 1000);
}

function animateTimer(timeLeft, duration) {
    ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);
    let radius = timerCanvas.width / 2 - 10;
    let centerX = timerCanvas.width / 2;
    let centerY = timerCanvas.height / 2;
    let startAngle = -Math.PI / 2;
    let endAngle = startAngle + (2 * Math.PI * (timeLeft / duration));
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = isExercise ? '#FFFFFF' : '#40FF40';
    ctx.stroke();
}

function clearFields(){
    stopTimer();
    document.getElementById('exerciseDuration').value = '';
    document.getElementById('restDuration').value = '';
    document.getElementById('steps').value = '';
    timerText.innerText = 'READY?';
    document.getElementById('stepCounter').innerText = 'Step: 0';
    ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);
}

function stopTimer() {
    clearInterval(timer);
    timerText.innerText = 'Timer Stopped';
    document.getElementById('startButton').innerText = 'Start';
    currentStep = 0;
    isTimerActive = false;
    document.getElementById('stepCounter').innerText = `Step: 0`;
    document.getElementById('stopButton').disabled = true;
    releaseWakeLock();
    ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);
}

function setPredefinedTimer(duration, restDuration, steps) {
    document.getElementById('exerciseDuration').value = duration;
    document.getElementById('restDuration').value = restDuration;
    document.getElementById('steps').value = steps;
}
