// Modal Component Functions
// Extracted from 4-weeks.html for better organization

// Open accessory log modal with prefilled data
function openAccessoryLogModal(itemId, liftName, setIndex) {
    document.getElementById('modalTitle').textContent = `Log Set ${setIndex} for ${liftName}`;
    document.getElementById('modalExerciseName').value = liftName; 
    document.getElementById('modalSetIndex').value = setIndex;     
    document.getElementById('accessoryLogModal').setAttribute('data-item-id', itemId); 

    const weightLabel = document.getElementById('modalWeightLabel');
    if (BODYWEIGHT_ASSISTED_EXERCISES.includes(liftName)) {
        weightLabel.textContent = "Added Weight:";
    } else {
        weightLabel.textContent = "Weight:";
    }

    const existingLog = dailyLog[itemId]?.[`set${setIndex}`];
    let prefillWeight = "";
    if (existingLog) {
        prefillWeight = BODYWEIGHT_ASSISTED_EXERCISES.includes(liftName) ? 
                        (existingLog.actualAddedWeight !== null ? existingLog.actualAddedWeight : '') : 
                        (existingLog.actualWeight !== null ? existingLog.actualWeight : '');
    }

    document.getElementById('modalWeight').value = prefillWeight;
    document.getElementById('modalReps').value = existingLog?.actualReps || '';
    document.getElementById('modalRPE').value = existingLog?.actualRPE || '';
    
    document.getElementById('accessoryLogModal').style.display = 'block';
}

// Close accessory log modal
function closeModal() {
    document.getElementById('accessoryLogModal').style.display = 'none';
}

// Submit accessory set log from modal
function submitAccessorySetLog() {
    const itemId = document.getElementById('accessoryLogModal').getAttribute('data-item-id');
    const liftName = document.getElementById('modalExerciseName').value;
    const setIndex = parseInt(document.getElementById('modalSetIndex').value);
    
    const addedWeightInput = parseFloat(document.getElementById('modalWeight').value); // Value from modal is added weight or total weight
    const reps = parseInt(document.getElementById('modalReps').value);
    const rpe = parseFloat(document.getElementById('modalRPE').value);

    if (isNaN(addedWeightInput) || isNaN(reps) || isNaN(rpe) || reps < 0) {
        alert('Please enter valid (added) weight, reps, and RPE.');
        return;
    }
    if (BODYWEIGHT_ASSISTED_EXERCISES.includes(liftName) && addedWeightInput < 0) {
        alert('Added weight for bodyweight exercises cannot be negative. Use 0 for bodyweight only.');
        return;
    }

    let totalWeightLifted = addedWeightInput;
    let actualLoggedWeight = addedWeightInput;
    let actualLoggedAddedWeight = null;

    if (BODYWEIGHT_ASSISTED_EXERCISES.includes(liftName)) {
         if (userBodyweight <= 0) {
            alert("Please set your bodyweight in the 'Settings & e1RMs' tab to accurately log this exercise.");
            return;
        }
        totalWeightLifted = userBodyweight + addedWeightInput;
        actualLoggedAddedWeight = addedWeightInput;
        actualLoggedWeight = totalWeightLifted; // Store total for consistency in e1RM calc
    }


    if (!dailyLog[itemId]) dailyLog[itemId] = { completed: false };
    if (!dailyLog[itemId][`set${setIndex}`]) dailyLog[itemId][`set${setIndex}`] = {};

    dailyLog[itemId][`set${setIndex}`] = { 
        completed: true, 
        actualWeight: actualLoggedWeight, // Store total weight for consistency
        actualAddedWeight: actualLoggedAddedWeight, // Store added weight for display/editing
        actualReps: reps, 
        actualRPE: rpe 
    };

    const planItem = USER_WORKOUT_PLAN[currentSelectedDayKey].find(it => it.id === itemId);
    let allSetsDone = true;
    if (planItem && planItem.sets) {
        for (let i = 1; i <= planItem.sets; i++) {
            if (!dailyLog[itemId]?.[`set${i}`]?.completed) {
                allSetsDone = false;
                break;
            }
        }
    }
     if(allSetsDone) dailyLog[itemId].completed = true;

    if (CORE_LIFTS_IN_PLAN.includes(liftName)) {
        const e1RMAtSetStart = exercisesE1RM[liftName] || 0;
        const effectiveReps = getEffectiveReps(reps, rpe);
        const e1RMCalcFromSet = calculateEpleyE1RM(totalWeightLifted, effectiveReps);
        if (e1RMCalcFromSet > 0 && e1RMCalcFromSet > e1RMAtSetStart) { 
            exercisesE1RM[liftName] = e1RMCalcFromSet;
            e1RMChangeStatus[liftName] = "increased";
            dailyLog[itemId][`set${setIndex}`].newGroupE1RM = e1RMCalcFromSet;
        } 
    }
    
    saveData();
    renderE1RMTable();
    displayWorkoutForDay(currentSelectedDayKey);
    closeModal();
    alert(`${liftName} Set ${setIndex} logged.`);
    
    // Auto-start rest timer for accessory sets
    startRestTimer(90); // 1.5 minutes for accessory sets
}

// Selective Export Modal Functions
function showSelectiveExportModal() {
    const modal = document.getElementById('selectiveExportModal');
    modal.style.display = 'block';
    
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    document.getElementById('exportStartDate').value = thirtyDaysAgo.toISOString().split('T')[0];
    document.getElementById('exportEndDate').value = today.toISOString().split('T')[0];
    
    // Populate exercise checkboxes
    populateExerciseCheckboxes();
}

function closeSelectiveExportModal() {
    document.getElementById('selectiveExportModal').style.display = 'none';
}

// Initialize modal event listeners
function initializeModalEventListeners() {
    // Close modal when clicking outside
    window.onclick = function(event) { 
        const modal = document.getElementById('accessoryLogModal');
        if (event.target == modal) {
            closeModal();
        }
    }
}