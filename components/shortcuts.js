// Keyboard Shortcuts Component
// Handles global keyboard shortcuts and input navigation

// Initialize all keyboard shortcuts
function initializeKeyboardShortcuts() {
	// Main keydown event listener
	document.addEventListener("keydown", function (event) {
		handleInputFieldKeydown(event);
	});

	// Set up auto-focus for workout inputs
	setupAutoFocusForWorkoutInputs();
}

// Handle keyboard events for input fields
function handleInputFieldKeydown(event) {
	const target = event.target;
	const isInputField = target.matches(
		'input[type="number"], input[type="text"], input[type="date"], select, textarea',
	);

	// Handle Ctrl/Cmd shortcuts (work everywhere)
	if (event.ctrlKey || event.metaKey) {
		handleCtrlShortcuts(event);
		return;
	}

	// Handle Escape key
	if (event.key === "Escape") {
		if (isInputField) {
			target.value = "";
			target.blur();
		} else {
			// Close any open modals
			closeModal();
		}
		event.preventDefault();
		return;
	}

	// If we're in an input field, handle input-specific shortcuts
	if (isInputField) {
		if (event.key === "Tab") {
			navigateToNextInput(target, event.shiftKey);
			event.preventDefault();
			return;
		}

		if (event.key === "Enter") {
			// Check if we're in a modal
			const modal = target.closest('[id*="Modal"]');
			if (modal) {
				handleModalEnter(target, modal);
				event.preventDefault();
				return;
			}

			// Check if we're in a workout set group
			const setGroup = target.closest(".inline-inputs");
			if (setGroup) {
				handleSetGroupEnter(target, setGroup);
				event.preventDefault();
				return;
			}

			// Default Enter behavior - move to next input
			navigateToNextInput(target, false);
			event.preventDefault();
			return;
		}
	} else {
		// Handle global shortcuts (only when not in input fields)
		handleGlobalShortcuts(event);
	}
}

// Handle Ctrl/Cmd shortcuts
function handleCtrlShortcuts(event) {
	const key = event.key.toLowerCase();

	switch (key) {
		case "s":
			event.preventDefault();
			if (typeof saveAllSettingsAndE1RMs === "function") {
				saveAllSettingsAndE1RMs();
				if (typeof showSuccess === "function") {
					showSuccess("All data saved!");
				}
			} else {
				console.warn("Save function not available");
			}
			break;

		case "e":
			event.preventDefault();
			if (typeof exportData === "function") {
				exportData();
			} else {
				console.warn("Export function not available");
			}
			break;

		case "z":
			event.preventDefault();
			if (typeof performUndo === "function") {
				performUndo();
			} else {
				console.warn("Undo function not available");
			}
			break;

		case "y":
			event.preventDefault();
			if (typeof performRedo === "function") {
				performRedo();
			} else {
				console.warn("Redo function not available");
			}
			break;
	}
}

// Handle global shortcuts (when not in input fields)
function handleGlobalShortcuts(event) {
	const key = event.key.toLowerCase();

	// Tab navigation shortcuts
	if (key >= "1" && key <= "3") {
		const tabMap = {
			1: "guideTab",
			2: "analyticsTab",
			3: "e1rmTab",
		};
		showTab(tabMap[key]);
		event.preventDefault();
		return;
	}

	// Workout day navigation
	if (key >= "4" && key <= "7") {
		const dayIndex = parseInt(key) - 4;
		if (USER_WORKOUT_PLAN && USER_WORKOUT_PLAN[dayIndex]) {
			displayWorkoutForDay(dayIndex);
		}
		event.preventDefault();
		return;
	}

	// Timer shortcuts
	switch (key) {
		case "t":
			toggleRestTimer();
			event.preventDefault();
			break;

		case "r":
			startRestTimer(90); // 90 second timer
			event.preventDefault();
			break;
	}
}

// Navigate to next/previous input field
function navigateToNextInput(currentInput, reverse = false) {
	const form = currentInput.closest("form, .section, .tab-content");
	if (!form) return;

	const inputs = Array.from(
		form.querySelectorAll(
			'input[type="number"], input[type="text"], input[type="date"], select, textarea',
		),
	);
	const currentIndex = inputs.indexOf(currentInput);

	if (currentIndex === -1) return;

	let nextIndex;
	if (reverse) {
		nextIndex = currentIndex > 0 ? currentIndex - 1 : inputs.length - 1;
	} else {
		nextIndex = currentIndex < inputs.length - 1 ? currentIndex + 1 : 0;
	}

	const nextInput = inputs[nextIndex];
	if (nextInput) {
		nextInput.focus();
		nextInput.select();
	}
}

// Handle Enter key in modals
function handleModalEnter(input, modal) {
	// Check if this is an accessory set modal
	if (modal.id === "accessorySetModal") {
		const weightInput = modal.querySelector("#accessorySetWeight");
		const repsInput = modal.querySelector("#accessorySetReps");
		const rpeInput = modal.querySelector("#accessorySetRPE");

		if (input === weightInput && repsInput) {
			repsInput.focus();
			repsInput.select();
		} else if (input === repsInput && rpeInput) {
			rpeInput.focus();
			rpeInput.select();
		} else if (input === rpeInput) {
			// All fields filled, submit
			submitAccessorySetLog();
		}
		return;
	}

	// Default modal behavior - find submit button
	const submitButton = modal.querySelector(
		'button[type="submit"], .submit-btn, [onclick*="submit"]',
	);
	if (submitButton) {
		submitButton.click();
	}
}

// Handle Enter key in workout set groups
function handleSetGroupEnter(input, setGroup) {
	const weightInput = setGroup.querySelector(
		'input[placeholder*="Weight"], input[id*="weight"]',
	);
	const repsInput = setGroup.querySelector(
		'input[placeholder*="Reps"], input[id*="reps"]',
	);
	const rpeInput = setGroup.querySelector(
		'input[placeholder*="RPE"], input[id*="rpe"]',
	);

	if (input === weightInput && repsInput) {
		repsInput.focus();
		repsInput.select();
	} else if (input === repsInput && rpeInput) {
		rpeInput.focus();
		rpeInput.select();
	} else if (input === rpeInput) {
		// Check if all fields have reasonable values
		const weight = parseFloat(weightInput?.value);
		const reps = parseInt(repsInput?.value);
		const rpe = parseFloat(rpeInput?.value);

		if (weight > 0 && reps > 0 && rpe >= 1 && rpe <= 10) {
			// Find and click the log button for this set
			const logButton = setGroup.querySelector(
				'button[onclick*="logSet"], .log-btn',
			);
			if (logButton) {
				logButton.click();
				return;
			}
		}

		// If no log button found or invalid values, navigate to next input
		navigateToNextInput(input, false);
	}
}

// Set up auto-focus for workout inputs
function setupAutoFocusForWorkoutInputs() {
	// Add focus management to all workout input fields
	document.addEventListener("input", function (event) {
		const target = event.target;

		// Only apply to number inputs in workout contexts
		if (target.type !== "number") return;

		const value = parseFloat(target.value);
		if (isNaN(value) || value <= 0) return;

		// Check if this looks like a reasonable weight/reps/RPE value
		const isWeightField =
			target.placeholder?.includes("Weight") || target.id?.includes("weight");
		const isRepsField =
			target.placeholder?.includes("Reps") || target.id?.includes("reps");
		const isRPEField =
			target.placeholder?.includes("RPE") || target.id?.includes("rpe");

		let shouldAdvance = false;

		if (isWeightField && value >= 10) {
			// Reasonable weight entered
			shouldAdvance = true;
		} else if (isRepsField && value >= 1 && value <= 50) {
			// Reasonable reps
			shouldAdvance = true;
		} else if (isRPEField && value >= 1 && value <= 10) {
			// Valid RPE
			shouldAdvance = true;
		}

		if (shouldAdvance) {
			// Small delay to let the user see their input
			setTimeout(() => {
				navigateToNextInput(target, false);
			}, 100);
		}
	});
}

// Export functions for external access
window.KeyboardShortcuts = {
	initializeKeyboardShortcuts,
	handleInputFieldKeydown,
	handleCtrlShortcuts,
	handleGlobalShortcuts,
	navigateToNextInput,
	setupAutoFocusForWorkoutInputs,
};
