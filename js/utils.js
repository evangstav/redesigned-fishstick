// RPE to Reps In Reserve mapping
const RPE_TO_RIR = { 10: 0, 9.5: 0.5, 9: 1, 8.5: 1.5, 8: 2, 7.5: 2.5, 7: 3, 6.5: 3.5, 6: 4 };

// Calculate estimated 1RM using the Epley formula
function calculateEpleyE1RM(weight, reps) {
    if (reps === 0 || weight === 0) return 0; 
    if (reps === 1) return weight; 
    return weight * (1 + (reps / 30));
}

// Calculates effective reps based on actual reps and RPE (using RIR)
function getEffectiveReps(actualReps, actualRPE) {
    let effectiveReps = parseFloat(actualReps);
    if (RPE_TO_RIR.hasOwnProperty(actualRPE)) {
        effectiveReps += RPE_TO_RIR[actualRPE];
    } else if (actualRPE < 6) { 
        effectiveReps += (10 - actualRPE);
    }
    return effectiveReps;
}

// Enhanced error handling with user feedback
function showError(message, details = '') {
    console.error('App Error:', message, details);
    const alertMessage = `Error: ${message}${details ? '\n\nDetails: ' + details : ''}`;
    alert(alertMessage);
}

// Success message handler
function showSuccess(message) {
    console.log('Success:', message);
    // Could be enhanced with a toast notification system
}