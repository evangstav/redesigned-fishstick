// Rest Timer Component
// Global variables for timer state
let restTimerInterval = null;
let restTimerSeconds = 0;
let restTimerTotalSeconds = 0;
let restTimerPaused = false;

// Format seconds into MM:SS format
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update the timer display with color coding
function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    if (restTimerSeconds <= 0) {
        display.textContent = '0:00';
        display.style.color = 'var(--md-red-500)';
        if (restTimerInterval) {
            clearInterval(restTimerInterval);
            restTimerInterval = null;
            
            // Timer finished - play notification and show alert
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Rest Timer Complete!', {
                    body: 'Time to start your next set',
                    icon: '/favicon.ico'
                });
            }
            
            // Visual/audio notification
            alert('Rest time complete! Ready for your next set?');
            
            // Reset timer state
            restTimerSeconds = 0;
            restTimerPaused = false;
            document.getElementById('startTimerBtn').textContent = 'Start';
        }
    } else {
        display.textContent = formatTime(restTimerSeconds);
        // Color coding: green > 60s, yellow 30-60s, red < 30s
        if (restTimerSeconds > 60) {
            display.style.color = 'var(--md-green-500)';
        } else if (restTimerSeconds > 30) {
            display.style.color = 'orange';
        } else {
            display.style.color = 'var(--md-red-500)';
        }
    }
}

// Start the rest timer with optional preset time
function startRestTimer(seconds = null) {
    // Request notification permission on first use
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    if (seconds !== null) {
        // Starting with preset time
        restTimerSeconds = seconds;
        restTimerTotalSeconds = seconds;
    } else if (restTimerSeconds <= 0) {
        // Starting fresh with default time
        restTimerSeconds = 120; // Default 2 minutes
        restTimerTotalSeconds = 120;
    }
    // If seconds is null and restTimerSeconds > 0, we're resuming

    if (restTimerInterval) {
        clearInterval(restTimerInterval);
    }

    restTimerInterval = setInterval(() => {
        if (!restTimerPaused) {
            restTimerSeconds--;
            updateTimerDisplay();
        }
    }, 1000);

    restTimerPaused = false;
    document.getElementById('startTimerBtn').textContent = 'Resume';
    showRestTimer();
    updateTimerDisplay();
}

// Pause or resume the timer
function pauseRestTimer() {
    restTimerPaused = !restTimerPaused;
    document.getElementById('pauseTimerBtn').textContent = restTimerPaused ? 'Resume' : 'Pause';
}

// Stop and reset the timer
function stopRestTimer() {
    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
    }
    restTimerSeconds = 0;
    restTimerPaused = false;
    document.getElementById('startTimerBtn').textContent = 'Start';
    document.getElementById('pauseTimerBtn').textContent = 'Pause';
    updateTimerDisplay();
}

// Start timer with custom minutes input
function startCustomTimer() {
    const minutes = parseInt(document.getElementById('customTimerMinutes').value);
    if (minutes && minutes > 0) {
        startRestTimer(minutes * 60);
        document.getElementById('customTimerMinutes').value = '';
    }
}

// Show the timer interface
function showRestTimer() {
    document.getElementById('restTimer').classList.add('active');
    document.getElementById('toggleTimerBtn').textContent = 'Hide';
}

// Hide the timer interface
function hideRestTimer() {
    document.getElementById('restTimer').classList.remove('active');
    document.getElementById('toggleTimerBtn').textContent = 'Show';
}

// Toggle timer visibility
function toggleRestTimer() {
    const timer = document.getElementById('restTimer');
    if (timer.classList.contains('active')) {
        hideRestTimer();
    } else {
        showRestTimer();
    }
}