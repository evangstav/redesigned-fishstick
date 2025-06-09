// Template Configuration Injection Point
// {{TEMPLATE_CONFIG_INJECTION}}

// RPE to Reps In Reserve mapping
const RPE_TO_RIR = { 10: 0, 9.5: 0.5, 9: 1, 8.5: 1.5, 8: 2, 7.5: 2.5, 7: 3, 6.5: 3.5, 6: 4 };

// Core lifts for which e1RM will be tracked - Template Variable
const CORE_LIFTS_IN_PLAN = {{CORE_LIFTS_LIST}};
const BODYWEIGHT_ASSISTED_EXERCISES = {{BODYWEIGHT_EXERCISES_LIST}};

// The user's workout plan structure - Template Generated
const USER_WORKOUT_PLAN = {{GENERATED_WORKOUT_PLAN}};

// Global state variables
let exercisesE1RM = {}; 
let e1RMChangeStatus = {}; 
let userBodyweight = {{DEFAULT_BODYWEIGHT}}; 
let bodyweightHistory = []; // Array of {date: "YYYY-MM-DD", weight: number}

// Versioned localStorage keys - Generated from storage manager

// Calculate e1RM using Epley formula: weight * (1 + reps/30)
function calculateE1RM(weight, reps, rpe = null) {
    if (!weight || !reps || weight <= 0 || reps <= 0) return 0;
    
    let effectiveReps = reps;
    if (rpe && RPE_TO_RIR[rpe] !== undefined) {
        effectiveReps = reps + RPE_TO_RIR[rpe];
    }
    
    return Math.round(weight * (1 + effectiveReps / 30) * 10) / 10;
}

// Get current e1RM for a lift
function getCurrentE1RM(liftName) {
    return exercisesE1RM[liftName] || 0;
}

// Update e1RM for a lift
function updateE1RM(liftName, newE1RM, source = 'manual') {
    const currentE1RM = exercisesE1RM[liftName] || 0;
    const change = newE1RM - currentE1RM;
    
    exercisesE1RM[liftName] = newE1RM;
    e1RMChangeStatus[liftName] = {
        previous: currentE1RM,
        current: newE1RM,
        change: change,
        source: source,
        timestamp: new Date().toISOString()
    };
    
    saveE1RMs();
    return change;
}

// Calculate target weight based on percentage of e1RM
function calculateTargetWeight(liftName, percentage) {
    const e1rm = getCurrentE1RM(liftName);
    if (!e1rm) return 0;
    
    const targetWeight = e1rm * percentage;
    // Round to nearest 2.5lb increment
    return Math.round(targetWeight / 2.5) * 2.5;
}

// Show/hide tabs
function showTab(tabId) {
    // Hide all tab content
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked nav button
    const activeButton = document.querySelector(`nav button[data-tab="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Update workout tabs if showing a workout day
    if (tabId.includes('Day')) {
        updateWorkoutTab(tabId);
    }
}

// Error handling
function showError(title, message) {
    console.error(`${title}: ${message}`);
    // Template: Error display logic can be customized
    alert(`Error: ${title}\n${message}`);
}

// Success feedback
function showSuccess(message) {
    console.log(`Success: ${message}`);
    // Template: Success display logic can be customized
}

// Initialize app
function init() {
    try {
        loadE1RMs();
        loadBodyweight();
        loadBodyweightHistory();
        
        // Set up e1RM management table
        if (typeof renderE1RMTable === 'function') {
            renderE1RMTable();
        }
        
        // Initialize features based on configuration
        if (TEMPLATE_CONFIG.features.analytics_enabled && typeof initializeAnalytics === 'function') {
            initializeAnalytics();
        }
        
        if (TEMPLATE_CONFIG.features.ai_recommendations && typeof initializeAIRecommendations === 'function') {
            initializeAIRecommendations();
        }
        
        // Show default tab
        showTab('{{DEFAULT_TAB}}');
        
    } catch (error) {
        showError('Initialization failed', error.message);
    }
}

// Render e1RM management table
function renderE1RMTable() {
    const tbody = document.getElementById('e1rmTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = ''; 
    CORE_LIFTS_IN_PLAN.forEach(liftName => {
        const row = tbody.insertRow();
        row.insertCell().textContent = liftName;
        
        const currentE1RMCell = row.insertCell();
        const currentE1RM = exercisesE1RM[liftName] || 0;
        currentE1RMCell.textContent = currentE1RM.toFixed(1);
        
        if (e1RMChangeStatus[liftName]) {
            const indicatorSpan = document.createElement('span');
            indicatorSpan.classList.add('e1rm-change-indicator');
            if (e1RMChangeStatus[liftName].change > 0) {
                indicatorSpan.textContent = ' ↑';
                indicatorSpan.classList.add('increased');
            } else if (e1RMChangeStatus[liftName].change < 0) {
                indicatorSpan.textContent = ' ↓';
                indicatorSpan.classList.add('decreased');
            }
            currentE1RMCell.appendChild(indicatorSpan);
        }
        
        const inputCell = row.insertCell();
        const input = document.createElement('input');
        input.type = 'number';
        input.step = '2.5';
        input.value = currentE1RM;
        input.id = `e1rm_${liftName.replace(/[^a-zA-Z0-9]/g, '_')}`;
        inputCell.appendChild(input);
    });
}

// Template placeholder for additional functions
{{ADDITIONAL_CORE_FUNCTIONS}}