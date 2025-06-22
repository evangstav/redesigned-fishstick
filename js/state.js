// Application version key for localStorage
const APP_VERSION_KEY = "v4_material_bw_graph";

// Load data from localStorage with error handling
function loadData() {
	try {
		const storedE1RMs = localStorage.getItem(
			`personalizedPlanE1RMs_${APP_VERSION_KEY}`,
		);
		if (storedE1RMs) {
			exercisesE1RM = JSON.parse(storedE1RMs);
			// Validate loaded data
			if (typeof exercisesE1RM !== "object" || exercisesE1RM === null) {
				throw new Error("Invalid e1RM data format");
			}
		} else {
			CORE_LIFTS_IN_PLAN.forEach((lift) => (exercisesE1RM[lift] = 0));
		}
	} catch (error) {
		showError("Failed to load e1RM data", error.message);
		CORE_LIFTS_IN_PLAN.forEach((lift) => (exercisesE1RM[lift] = 0));
	}

	try {
		const storedChangeStatus = localStorage.getItem(
			`personalizedPlanE1RMChangeStatus_${APP_VERSION_KEY}`,
		);
		if (storedChangeStatus) {
			e1RMChangeStatus = JSON.parse(storedChangeStatus);
		} else {
			e1RMChangeStatus = {};
		}
	} catch (error) {
		showError("Failed to load e1RM change status", error.message);
		e1RMChangeStatus = {};
	}

	try {
		const storedBodyweight = localStorage.getItem(
			`personalizedPlanBodyweight_${APP_VERSION_KEY}`,
		);
		if (storedBodyweight) {
			userBodyweight = parseFloat(storedBodyweight);
			if (isNaN(userBodyweight) || userBodyweight <= 0) {
				throw new Error("Invalid bodyweight value");
			}
			document.getElementById("currentBodyweight").value = userBodyweight;
		}
	} catch (error) {
		showError("Failed to load bodyweight", error.message);
		userBodyweight = 0;
	}

	try {
		const storedBwHistory = localStorage.getItem(
			`personalizedPlanBwHistory_${APP_VERSION_KEY}`,
		);
		if (storedBwHistory) {
			bodyweightHistory = JSON.parse(storedBwHistory);
			if (!Array.isArray(bodyweightHistory)) {
				throw new Error("Invalid bodyweight history format");
			}
		} else {
			bodyweightHistory = [];
		}
	} catch (error) {
		showError("Failed to load bodyweight history", error.message);
		bodyweightHistory = [];
	}

	try {
		const storedDailyLog = localStorage.getItem(
			`personalizedPlanDailyLog_${APP_VERSION_KEY}_${selectedLogDateKey}`,
		);
		if (storedDailyLog) {
			dailyLog = JSON.parse(storedDailyLog);
			if (typeof dailyLog !== "object" || dailyLog === null) {
				throw new Error("Invalid daily log format");
			}
		} else {
			dailyLog = {};
		}
	} catch (error) {
		showError("Failed to load daily log", error.message);
		dailyLog = {};
	}
}

// Save data to localStorage with error handling
function saveData() {
	try {
		localStorage.setItem(
			`personalizedPlanE1RMs_${APP_VERSION_KEY}`,
			JSON.stringify(exercisesE1RM),
		);
		localStorage.setItem(
			`personalizedPlanE1RMChangeStatus_${APP_VERSION_KEY}`,
			JSON.stringify(e1RMChangeStatus),
		);
		localStorage.setItem(
			`personalizedPlanBodyweight_${APP_VERSION_KEY}`,
			userBodyweight.toString(),
		);
		localStorage.setItem(
			`personalizedPlanBwHistory_${APP_VERSION_KEY}`,
			JSON.stringify(bodyweightHistory),
		);
		localStorage.setItem(
			`personalizedPlanDailyLog_${APP_VERSION_KEY}_${selectedLogDateKey}`,
			JSON.stringify(dailyLog),
		);
	} catch (error) {
		showError(
			"Failed to save data",
			error.message + ". Your data may not be preserved.",
		);
	}
}

// Data validation function
function validateDataIntegrity() {
	try {
		const issues = [];

		// Check e1RM data integrity
		Object.entries(exercisesE1RM).forEach(([exercise, value]) => {
			if (typeof value !== "number" || value <= 0 || value > 1000) {
				issues.push(`Invalid e1RM value for ${exercise}: ${value}`);
			}
		});

		// Check bodyweight data
		if (
			typeof userBodyweight !== "number" ||
			userBodyweight <= 0 ||
			userBodyweight > 1000
		) {
			issues.push(`Invalid current bodyweight: ${userBodyweight}`);
		}

		bodyweightHistory.forEach((entry, index) => {
			if (!entry.date || !entry.weight || typeof entry.weight !== "number") {
				issues.push(`Invalid bodyweight history entry at index ${index}`);
			}
		});

		// Check daily logs structure
		let logCount = 0;
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (
				key &&
				key.startsWith(`personalizedPlanDailyLog_${APP_VERSION_KEY}_`)
			) {
				logCount++;
				try {
					const logData = JSON.parse(localStorage.getItem(key));
					if (typeof logData !== "object") {
						issues.push(`Invalid log data structure for ${key}`);
					}
				} catch (e) {
					issues.push(`Corrupted log data for ${key}`);
				}
			}
		}

		const statusDiv = document.getElementById("dataManagementStatus");
		if (issues.length === 0) {
			statusDiv.textContent = `Data validation passed! Found ${logCount} workout logs, ${Object.keys(exercisesE1RM).length} exercises, ${bodyweightHistory.length} bodyweight entries.`;
			statusDiv.style.color = "var(--md-green-500)";
		} else {
			statusDiv.textContent = `Data validation found ${issues.length} issues. Check console for details.`;
			statusDiv.style.color = "var(--md-orange-500)";
			console.warn("Data integrity issues:", issues);
		}
	} catch (error) {
		console.error("Data validation error:", error);
		const statusDiv = document.getElementById("dataManagementStatus");
		statusDiv.textContent =
			"Data validation failed. Check console for details.";
		statusDiv.style.color = "var(--md-red-500)";
	}
}
