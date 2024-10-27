let timer;
let currentStep = 0;
let isExercise = true;
let isTimerActive = false; // To track if the timer is running
const beep = new Audio('Beep.mp3'); // Load the beep sound

function startTimer() {
    const exerciseDuration = parseInt(document.getElementById('exerciseDuration').value) || 0;
    const restDuration = parseInt(document.getElementById('restDuration').value) || 0;
    const steps = parseInt(document.getElementById('steps').value) || 0;

    if (exerciseDuration <= 0 || restDuration <= 0 || steps <= 0) {
        alert('Please enter valid durations and steps.');
        return;
    }

    // Reset the timer, step, and mode if Restart is clicked
    clearInterval(timer);
    currentStep = 0;
    isExercise = true;
    isTimerActive = true;

    // Change button text to "Restart" if the timer is active
    document.getElementById('startButton').innerText = 'Restart';

    // Enable the Stop button when the timer starts
    document.getElementById('stopButton').disabled = false;

    document.getElementById('timerDisplay').innerText = 'Starting...';
    document.getElementById('stepCounter').innerText = `Step: 1 / ${steps}`;

    // Start the first step after a short delay
    setTimeout(() => nextStep(exerciseDuration, restDuration, steps), 1000);
}

function nextStep(exerciseDuration, restDuration, steps) {
    if (currentStep >= steps) {
        document.getElementById('timerDisplay').innerText = 'Workout Complete!';
        document.getElementById('startButton').innerText = 'Start'; // Change back to Start after completion
        isTimerActive = false;

        // Disable the Stop button when the workout is complete
        document.getElementById('stopButton').disabled = true;
        return;
    }

    const duration = isExercise ? exerciseDuration : restDuration;
    const type = isExercise ? 'Exercise' : 'Rest';
    document.getElementById('timerDisplay').innerText = `${type} for ${duration}s`;

    let timeLeft = duration;
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);

            // Smooth transition delay (1 second) between exercise and rest
            setTimeout(() => {
                if (isExercise) {
                    // End of the exercise period, switch to rest
                    isExercise = false;
                    document.getElementById('timerDisplay').innerText = "Rest starting...";
                } else {
                    // End of the rest period, increment step and switch to exercise
                    currentStep++;
                    isExercise = true;
                    document.getElementById('timerDisplay').innerText = "Exercise starting...";
                    if (currentStep < steps) {
                        document.getElementById('stepCounter').innerText = `Step: ${currentStep + 1} / ${steps}`;
                    }
                }

                // Start the next step after a brief delay for transition
                setTimeout(() => nextStep(exerciseDuration, restDuration, steps), 1000);
            }, 1000); // 1-second smooth transition delay
        } else {
            timeLeft--;
            document.getElementById('timerDisplay').innerText = `${type} for ${timeLeft}s`;

            // Play the beep sound during the last 5 seconds of the exercise period
            if (isExercise && timeLeft <= 5 && timeLeft > 0) {
                beep.play();
            }
        }
    }, 1000);
}

function clearFields() {
    // reload the page
    location.reload();
}

// Stop the timer
function stopTimer() {
    clearInterval(timer);
    document.getElementById('timerDisplay').innerText = 'Timer Stopped';
    document.getElementById('startButton').innerText = 'Start'; // Reset the button to "Start"
    currentStep = 0;
    isTimerActive = false;
    document.getElementById('stepCounter').innerText = `Step: 0`;

    // Disable the Stop button when the timer is stopped
    document.getElementById('stopButton').disabled = true;
}
