// Workout Logging Functions Template

// Log heavy strength set (1-5 reps with e1RM tracking)
function logHeavyStrengthSet(exerciseId, liftName) {
    const weightInput = document.getElementById(`${exerciseId}_weight`);
    const repsInput = document.getElementById(`${exerciseId}_reps`);
    const rpeInput = document.getElementById(`${exerciseId}_rpe`);
    
    const weight = parseFloat(weightInput.value);
    const reps = parseInt(repsInput.value);
    const rpe = parseFloat(rpeInput.value);
    
    if (!weight || !reps) {
        showError('Invalid Input', 'Please enter weight and reps');
        return;
    }
    
    // Calculate e1RM if this is a core lift
    if (CORE_LIFTS_IN_PLAN.includes(liftName)) {
        const calculatedE1RM = calculateE1RM(weight, reps, rpe);
        const currentE1RM = getCurrentE1RM(liftName);
        
        if (calculatedE1RM > currentE1RM) {
            updateE1RM(liftName, calculatedE1RM, 'workout');
            showSuccess(`New e1RM for ${liftName}: ${calculatedE1RM}lbs`);
        }
    }
    
    // Log the set
    const setData = {
        exerciseId,
        liftName,
        weight,
        reps,
        rpe,
        timestamp: new Date().toISOString(),
        type: 'strength'
    };
    
    logWorkoutSet(setData);
    
    // Clear inputs
    weightInput.value = '';
    repsInput.value = repsInput.defaultValue;
    rpeInput.value = '';
    
    showSuccess('Set logged successfully!');
}

// Log generic strength set (volume work)
function logGenericSet(exerciseId, liftName, setNumber) {
    const weightInput = document.getElementById(`${exerciseId}_weight_${setNumber}`);
    const repsInput = document.getElementById(`${exerciseId}_reps_${setNumber}`);
    const rpeInput = document.getElementById(`${exerciseId}_rpe_${setNumber}`);
    
    const weight = parseFloat(weightInput.value);
    const reps = parseInt(repsInput.value);
    const rpe = parseFloat(rpeInput.value);
    
    if (!weight || !reps) {
        showError('Invalid Input', 'Please enter weight and reps');
        return;
    }
    
    const setData = {
        exerciseId: `${exerciseId}_${setNumber}`,
        liftName,
        weight,
        reps,
        rpe,
        setNumber,
        timestamp: new Date().toISOString(),
        type: 'volume'
    };
    
    logWorkoutSet(setData);
    
    // Clear inputs
    weightInput.value = '';
    repsInput.value = repsInput.defaultValue;
    rpeInput.value = '';
    
    showSuccess(`Set ${setNumber} logged successfully!`);
}

// Open modal for accessory exercise logging
function openAccessoryLogModal(exerciseId, liftName, setNumber) {
    // Create a simple prompt for accessory logging
    const weight = prompt(`Enter weight for ${liftName} Set ${setNumber}:`);
    const reps = prompt(`Enter reps completed for ${liftName} Set ${setNumber}:`);
    const rpe = prompt(`Enter RPE (6-10) for ${liftName} Set ${setNumber}:`);
    
    if (weight && reps) {
        const setData = {
            exerciseId: `${exerciseId}_${setNumber}`,
            liftName,
            weight: parseFloat(weight),
            reps: parseInt(reps),
            rpe: rpe ? parseFloat(rpe) : null,
            setNumber,
            timestamp: new Date().toISOString(),
            type: 'accessory'
        };
        
        logWorkoutSet(setData);
        showSuccess(`${liftName} Set ${setNumber} logged!`);
    }
}

// Mark cardio as completed
function markCardioCompleted(exerciseId, exerciseName) {
    const setData = {
        exerciseId,
        exerciseName,
        timestamp: new Date().toISOString(),
        type: 'cardio',
        completed: true
    };
    
    logWorkoutSet(setData);
    showSuccess(`${exerciseName} marked as completed!`);
}

// Mark mobility as completed
function markMobilityCompleted(exerciseId, exerciseName) {
    const setData = {
        exerciseId,
        exerciseName,
        timestamp: new Date().toISOString(),
        type: 'mobility',
        completed: true
    };
    
    logWorkoutSet(setData);
    showSuccess(`${exerciseName} marked as completed!`);
}

// Core function to log workout sets
function logWorkoutSet(setData) {
    const today = new Date().toISOString().split('T')[0];
    const keys = getStorageKeys();
    const dailyLogKey = keys.dailyLog(today);
    
    // Get existing log for today
    let dailyLog = [];
    const existingLog = localStorage.getItem(dailyLogKey);
    if (existingLog) {
        dailyLog = JSON.parse(existingLog);
    }
    
    // Add new set
    dailyLog.push(setData);
    
    // Save updated log
    localStorage.setItem(dailyLogKey, JSON.stringify(dailyLog));
    
    // Update workout history
    saveWorkoutHistory({
        date: today,
        sets: dailyLog,
        workoutType: getCurrentWorkoutType()
    });
    
    // Update daily log display
    updateDailyLogDisplay();
}

// Get current workout type based on active tab
function getCurrentWorkoutType() {
    const activeTabs = document.querySelectorAll('.tab-content.active');
    if (activeTabs.length > 0) {
        const activeId = activeTabs[0].id;
        const workoutMap = {
            'squatdayTab': 'Squat Day',
            'benchdayTab': 'Bench Day', 
            'deadliftdayTab': 'Deadlift Day',
            'pulldayTab': 'Pull Day',
            'cardiodayTab': 'Cardio Day',
            'mobilitydayTab': 'Mobility Day',
            'restdayTab': 'Rest Day'
        };
        return workoutMap[activeId] || 'Unknown';
    }
    return 'Unknown';
}

// Update the daily log display
function updateDailyLogDisplay() {
    const container = document.getElementById('dailyWorkoutLogContainer');
    if (!container) return;
    
    const today = new Date().toISOString().split('T')[0];
    const keys = getStorageKeys();
    const dailyLogKey = keys.dailyLog(today);
    
    const existingLog = localStorage.getItem(dailyLogKey);
    if (!existingLog) {
        container.innerHTML = '<p style="color: var(--md-grey-700); font-style: italic;">Complete exercises above to see your log entries here.</p>';
        return;
    }
    
    const dailyLog = JSON.parse(existingLog);
    let logHtml = '<h4>Today\'s Completed Sets:</h4>';
    
    dailyLog.forEach((set, index) => {
        logHtml += `
            <div class="workout-log-entry">
                <strong>${set.liftName || set.exerciseName}</strong>
                ${set.weight ? `${set.weight}lbs × ${set.reps} reps` : 'Completed'}
                ${set.rpe ? ` @ RPE ${set.rpe}` : ''}
                <span class="completed-marker">✓</span>
            </div>
        `;
    });
    
    container.innerHTML = logHtml;
}

// Update bodyweight
function updateBodyweight() {
    const input = document.getElementById('bodyweightInput');
    const newWeight = parseFloat(input.value);
    
    if (!newWeight || newWeight <= 0) {
        showError('Invalid Weight', 'Please enter a valid bodyweight');
        return;
    }
    
    const oldWeight = userBodyweight;
    userBodyweight = newWeight;
    
    // Add to history if significantly different
    if (Math.abs(newWeight - oldWeight) > 0.1) {
        const today = new Date().toISOString().split('T')[0];
        bodyweightHistory.push({
            date: today,
            weight: newWeight
        });
        saveBodyweightHistory();
    }
    
    saveBodyweight();
    showSuccess(`Bodyweight updated to ${newWeight}lbs`);
}

// Export user data
function exportData() {
    const data = exportAppData();
    if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showSuccess('Data exported successfully!');
    }
}

// Import user data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonData = e.target.result;
            if (importAppData(jsonData)) {
                showSuccess('Data imported successfully!');
                location.reload(); // Refresh to show imported data
            } else {
                showError('Import Failed', 'Invalid data format');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Save all e1RMs from the settings table
function saveAllE1RMs() {
    const coreLifts = CORE_LIFTS_IN_PLAN;
    let updated = 0;
    
    coreLifts.forEach(lift => {
        const input = document.getElementById(`e1rm_${lift.replace(/[^a-zA-Z0-9]/g, '_')}`);
        if (input) {
            const newValue = parseFloat(input.value);
            if (newValue && newValue > 0) {
                const oldValue = exercisesE1RM[lift] || 0;
                if (Math.abs(newValue - oldValue) > 0.1) {
                    updateE1RM(lift, newValue, 'manual');
                    updated++;
                }
            }
        }
    });
    
    showSuccess(`Updated ${updated} e1RM values`);
}