// Storage Manager Template
// Handles localStorage operations with personalized keys

// Storage configuration - Template Generated
const STORAGE_CONFIG = {
    appId: '{{APP_ID}}',
    version: '{{APP_VERSION}}',
    keyPrefix: '{{STORAGE_KEY_PREFIX}}'
};

// Generate personalized storage keys
function getStorageKeys() {
    const prefix = `${STORAGE_CONFIG.keyPrefix}_${STORAGE_CONFIG.appId}_${STORAGE_CONFIG.version}`;
    return {
        e1rms: `${prefix}_e1rms`,
        bodyweight: `${prefix}_bodyweight`,
        bodyweightHistory: `${prefix}_bodyweight_history`,
        settings: `${prefix}_settings`,
        workoutHistory: `${prefix}_workout_history`,
        analytics: `${prefix}_analytics`,
        apiKey: `${prefix}_api_key`,
        dailyLog: (date) => `${prefix}_daily_log_${date}`
    };
}

// Save e1RMs to localStorage
function saveE1RMs() {
    try {
        const keys = getStorageKeys();
        localStorage.setItem(keys.e1rms, JSON.stringify(exercisesE1RM));
        return true;
    } catch (error) {
        console.error('Failed to save e1RMs:', error);
        return false;
    }
}

// Load e1RMs from localStorage
function loadE1RMs() {
    try {
        const keys = getStorageKeys();
        const saved = localStorage.getItem(keys.e1rms);
        if (saved) {
            exercisesE1RM = JSON.parse(saved);
        } else {
            // Initialize with default e1RMs if available
            exercisesE1RM = {{DEFAULT_E1RMS}} || {};
        }
        return true;
    } catch (error) {
        console.error('Failed to load e1RMs:', error);
        exercisesE1RM = {};
        return false;
    }
}

// Save bodyweight to localStorage
function saveBodyweight() {
    try {
        const keys = getStorageKeys();
        localStorage.setItem(keys.bodyweight, userBodyweight.toString());
        return true;
    } catch (error) {
        console.error('Failed to save bodyweight:', error);
        return false;
    }
}

// Load bodyweight from localStorage
function loadBodyweight() {
    try {
        const keys = getStorageKeys();
        const saved = localStorage.getItem(keys.bodyweight);
        if (saved && !isNaN(parseFloat(saved))) {
            userBodyweight = parseFloat(saved);
        } else {
            userBodyweight = {{DEFAULT_BODYWEIGHT}} || 0;
        }
        return true;
    } catch (error) {
        console.error('Failed to load bodyweight:', error);
        userBodyweight = {{DEFAULT_BODYWEIGHT}} || 0;
        return false;
    }
}

// Save bodyweight history
function saveBodyweightHistory() {
    try {
        const keys = getStorageKeys();
        localStorage.setItem(keys.bodyweightHistory, JSON.stringify(bodyweightHistory));
        return true;
    } catch (error) {
        console.error('Failed to save bodyweight history:', error);
        return false;
    }
}

// Load bodyweight history
function loadBodyweightHistory() {
    try {
        const keys = getStorageKeys();
        const saved = localStorage.getItem(keys.bodyweightHistory);
        if (saved) {
            bodyweightHistory = JSON.parse(saved);
        } else {
            bodyweightHistory = [];
        }
        return true;
    } catch (error) {
        console.error('Failed to load bodyweight history:', error);
        bodyweightHistory = [];
        return false;
    }
}

// Save workout history
function saveWorkoutHistory(workoutData) {
    try {
        const keys = getStorageKeys();
        let history = [];
        const saved = localStorage.getItem(keys.workoutHistory);
        if (saved) {
            history = JSON.parse(saved);
        }
        
        history.unshift(workoutData);
        
        // Keep only last 100 workouts
        if (history.length > 100) {
            history = history.slice(0, 100);
        }
        
        localStorage.setItem(keys.workoutHistory, JSON.stringify(history));
        return true;
    } catch (error) {
        console.error('Failed to save workout history:', error);
        return false;
    }
}

// Load workout history
function loadWorkoutHistory() {
    try {
        const keys = getStorageKeys();
        const saved = localStorage.getItem(keys.workoutHistory);
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    } catch (error) {
        console.error('Failed to load workout history:', error);
        return [];
    }
}

// Export all app data
function exportAppData() {
    try {
        const keys = getStorageKeys();
        const data = {
            appMetadata: {
                id: STORAGE_CONFIG.appId,
                version: STORAGE_CONFIG.version,
                exportDate: new Date().toISOString(),
                appName: '{{APP_TITLE}}'
            },
            e1rms: exercisesE1RM,
            bodyweight: userBodyweight,
            bodyweightHistory: bodyweightHistory,
            workoutHistory: loadWorkoutHistory(),
            settings: JSON.parse(localStorage.getItem(keys.settings) || '{}'),
            analytics: JSON.parse(localStorage.getItem(keys.analytics) || '{}')
        };
        
        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Failed to export data:', error);
        return null;
    }
}

// Import app data
function importAppData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        // Validate import data
        if (!data.appMetadata || !data.e1rms) {
            throw new Error('Invalid import data format');
        }
        
        // Import e1RMs
        if (data.e1rms) {
            exercisesE1RM = data.e1rms;
            saveE1RMs();
        }
        
        // Import bodyweight
        if (data.bodyweight) {
            userBodyweight = data.bodyweight;
            saveBodyweight();
        }
        
        // Import bodyweight history
        if (data.bodyweightHistory) {
            bodyweightHistory = data.bodyweightHistory;
            saveBodyweightHistory();
        }
        
        // Import workout history
        if (data.workoutHistory) {
            const keys = getStorageKeys();
            localStorage.setItem(keys.workoutHistory, JSON.stringify(data.workoutHistory));
        }
        
        // Import settings
        if (data.settings) {
            const keys = getStorageKeys();
            localStorage.setItem(keys.settings, JSON.stringify(data.settings));
        }
        
        return true;
    } catch (error) {
        console.error('Failed to import data:', error);
        return false;
    }
}

// Clear all app data
function clearAllData() {
    try {
        const keys = getStorageKeys();
        Object.values(keys).forEach(key => {
            if (typeof key === 'string') {
                localStorage.removeItem(key);
            }
        });
        
        // Reset global variables
        exercisesE1RM = {};
        userBodyweight = {{DEFAULT_BODYWEIGHT}} || 0;
        bodyweightHistory = [];
        e1RMChangeStatus = {};
        
        return true;
    } catch (error) {
        console.error('Failed to clear data:', error);
        return false;
    }
}