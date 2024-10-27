let timer;
let currentStep = 0;
let isExercise = true;
let isTimerActive = false;
const beep = new Audio('Beep.mp3'); // Load the beep sound
let wakeLock = null; // To store the wake lock instance

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

    document.getElementById('timerDisplay').innerText = 'Starting...';
    document.getElementById('stepCounter').innerText = `Step: 1 / ${steps}`;

    nextStep(exerciseDuration, restDuration, steps); // Start immediately
}

function nextStep(exerciseDuration, restDuration, steps) {
    if (currentStep >= steps) {
        document.getElementById('timerDisplay').innerText = 'Workout Complete!';
        document.getElementById('startButton').innerText = 'Start';
        isTimerActive = false;
        document.getElementById('stopButton').disabled = true;
        releaseWakeLock();
        return;
    }

    const duration = isExercise ? exerciseDuration : restDuration;
    const type = isExercise ? 'Exercise' : 'Rest';
    document.getElementById('timerDisplay').innerText = `${type} for ${duration}s`;

    let timeLeft = duration;

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
            nextStep(exerciseDuration, restDuration, steps); // Continue immediately
        } else {
            timeLeft -= 1;
            document.getElementById('timerDisplay').innerText = `${type} for ${Math.ceil(timeLeft)}s`;

            // Play the beep sound during the last 5 seconds of the exercise period
            if (isExercise && timeLeft <= 5 && timeLeft > 0) {
                beep.play();
            }
        }
    }, 1000);
}

function clearFields(){
    document.getElementById('exerciseDuration').value = '';
    document.getElementById('restDuration').value = '';
    document.getElementById('steps').value = '';
    document.getElementById('timerDisplay').innerText = 'READY?';
    document.getElementById('stepCounter').innerText = 'Step: 0';
    alert('Fields Cleared!');
}

function stopTimer() {
    clearInterval(timer);
    document.getElementById('timerDisplay').innerText = 'Timer Stopped';
    document.getElementById('startButton').innerText = 'Start';
    currentStep = 0;
    isTimerActive = false;
    document.getElementById('stepCounter').innerText = `Step: 0`;
    document.getElementById('stopButton').disabled = true;
    releaseWakeLock();
}
