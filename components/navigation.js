/**
 * Navigation Component
 * Handles tab switching and active state management for the fitness tracker app
 */

// Navigation state variables
let currentSelectedDayKey = null;
let currentActiveTab = "guideTab";

/**
 * General function to show a tab and hide others
 * @param {string} tabId - The ID of the tab to show
 */
function showTab(tabId) {
	currentActiveTab = tabId;
	document.querySelectorAll(".tab-content").forEach((tab) => {
		tab.classList.remove("active");
	});
	document.getElementById(tabId).classList.add("active");

	document.querySelectorAll("#mainNav button").forEach((btn) => {
		btn.classList.remove("active");
	});

	const activeNavButton = document.querySelector(
		`#mainNav button[data-tab='${tabId}']:not([data-day-key])`,
	);
	if (activeNavButton) {
		activeNavButton.classList.add("active");
	} else if (tabId === "workoutDayTab" && currentSelectedDayKey) {
		const activeDayButton = document.querySelector(
			`#mainNav button[data-day-key="${currentSelectedDayKey}"]`,
		);
		if (activeDayButton) activeDayButton.classList.add("active");
	}

	if (tabId === "analyticsTab") {
		// If switching to analytics tab, initialize analytics and bodyweight tracking
		initializeAnalytics();
		renderBodyweightChart();
		updateAttendanceSummary();
	}
}

/**
 * Displays the workout for the selected workout type
 * @param {string} workoutKey - The workout key from USER_WORKOUT_PLAN
 */
function displayWorkoutForDay(workoutKey) {
	currentSelectedDayKey = workoutKey;
	showTab("workoutDayTab");

	// Call the main workout rendering function
	// (This function should exist in the main HTML file)
	if (typeof renderWorkoutDay === "function") {
		renderWorkoutDay(workoutKey);
	} else {
		console.error("renderWorkoutDay function not found");
	}
}

/**
 * Initialize dynamic navigation buttons for workout days
 * This function should be called after the main navigation is set up
 */
function initializeWorkoutNavigation() {
	const nav = document.getElementById("mainNav");
	const analyticsButton = document.querySelector(
		'button[data-tab="analyticsTab"]',
	);

	if (!nav || !analyticsButton) {
		console.error("Navigation elements not found");
		return;
	}

	// Create dynamic workout day buttons
	Object.keys(USER_WORKOUT_PLAN).forEach((workoutKey) => {
		const button = document.createElement("button");
		button.textContent = workoutKey;
		button.setAttribute("data-day-key", workoutKey);
		button.setAttribute("data-tab", "workoutDayTab");
		button.onclick = () => displayWorkoutForDay(workoutKey);
		nav.insertBefore(button, analyticsButton); // Insert workout buttons before analytics button
	});
}

/**
 * Get the current active tab
 * @returns {string} The current active tab ID
 */
function getCurrentActiveTab() {
	return currentActiveTab;
}

/**
 * Get the current selected workout day key
 * @returns {string|null} The current selected workout day key
 */
function getCurrentSelectedDayKey() {
	return currentSelectedDayKey;
}

/**
 * Set the current selected workout day key
 * @param {string|null} dayKey - The workout day key to set
 */
function setCurrentSelectedDayKey(dayKey) {
	currentSelectedDayKey = dayKey;
}

/**
 * Initialize the navigation system
 * Sets the default tab and any necessary event listeners
 */
function initializeNavigation() {
	// Show the default tab
	showTab("guideTab");

	// Initialize workout navigation after USER_WORKOUT_PLAN is available
	if (typeof USER_WORKOUT_PLAN !== "undefined") {
		initializeWorkoutNavigation();
	}
}
