// Bulk Edit Component
// Handles bulk editing of workout sets with multi-select interface

// Initialize bulk edit functionality
function initializeBulkEdit() {
	// Prevent duplicate event listeners
	if (window.bulkEditInitialized) return;
	window.bulkEditInitialized = true;

	// Add bulk edit controls to DOM if they don't exist
	if (!document.getElementById("bulkEditControls")) {
		const workoutArea = document.getElementById("workoutDisplayArea");
		if (workoutArea) {
			// Insert after the workout controls
			const workoutControls = workoutArea.querySelector(".workout-controls");
			if (workoutControls) {
				workoutControls.insertAdjacentHTML(
					"afterend",
					generateBulkEditControlsHTML(),
				);
			} else {
				workoutArea.insertAdjacentHTML(
					"afterbegin",
					generateBulkEditControlsHTML(),
				);
			}
		}
	}

	// Add bulk edit modal to DOM if it doesn't exist
	if (!document.getElementById("bulkEditModal")) {
		document.body.insertAdjacentHTML("beforeend", generateBulkEditModalHTML());
	}

	// Initialize event listeners
	setupBulkEditEventListeners();
}

// Set up event listeners for bulk edit functionality
function setupBulkEditEventListeners() {
	// Enable bulk edit button
	const enableBtn = document.getElementById("enableBulkEdit");
	if (enableBtn) {
		enableBtn.onclick = showBulkEditControls;
	}

	// Cancel bulk edit button
	const cancelBtn = document.getElementById("cancelBulkEdit");
	if (cancelBtn) {
		cancelBtn.onclick = hideBulkEditControls;
	}

	// Select all checkbox
	const selectAllBtn = document.getElementById("selectAllSets");
	if (selectAllBtn) {
		selectAllBtn.onclick = toggleSelectAll;
	}

	// Bulk edit button
	const bulkEditBtn = document.getElementById("bulkEditBtn");
	if (bulkEditBtn) {
		bulkEditBtn.onclick = showBulkEditModal;
	}

	// Modal close and apply buttons
	const closeBtn = document.getElementById("closeBulkEditModal");
	if (closeBtn) {
		closeBtn.onclick = closeBulkEditModal;
	}

	const applyBtn = document.getElementById("applyBulkEdit");
	if (applyBtn) {
		applyBtn.onclick = applyBulkEdit;
	}

	const logAllBtn = document.getElementById("bulkLogAllSets");
	if (logAllBtn) {
		logAllBtn.onclick = bulkLogAllSets;
	}
}

// Show bulk edit controls and add checkboxes to all sets
function showBulkEditControls() {
	// Create controls if they don't exist
	if (!document.getElementById("bulkEditControls")) {
		const workoutArea = document.getElementById("workoutDisplayArea");
		if (workoutArea) {
			const workoutControls = workoutArea.querySelector(".workout-controls");
			if (workoutControls) {
				workoutControls.insertAdjacentHTML(
					"afterend",
					generateBulkEditControlsHTML(),
				);
			}
		}
		// Set up event listeners after creating controls
		setupBulkEditEventListeners();
	}

	const controls = document.getElementById("bulkEditControls");
	if (controls) {
		controls.style.display = "flex";
	}

	// Add checkboxes to all set entries (workout exercises)
	const setRows = document.querySelectorAll(".exercise-item, .inline-inputs");
	setRows.forEach((setRow, index) => {
		if (!setRow.querySelector(".set-checkbox")) {
			const checkboxHTML = generateSetCheckboxHTML(index);
			setRow.insertAdjacentHTML("afterbegin", checkboxHTML);
		}
	});

	// Initialize checkbox event listeners
	document.querySelectorAll(".set-checkbox input").forEach((checkbox) => {
		checkbox.onchange = updateSelectedCount;
	});

	updateSelectedCount();
}

// Hide bulk edit controls and remove checkboxes
function hideBulkEditControls() {
	const controls = document.getElementById("bulkEditControls");
	if (controls) {
		controls.style.display = "none";
	}

	// Remove all checkboxes and highlighting
	document.querySelectorAll(".set-checkbox").forEach((checkbox) => {
		checkbox.remove();
	});

	// Remove highlighting from all sets
	document
		.querySelectorAll(".exercise-item, .inline-inputs")
		.forEach((setRow) => {
			setRow.classList.remove("selected-for-bulk-edit");
		});

	clearBulkEditSelections();
}

// Toggle select all sets
function toggleSelectAll() {
	const selectAllCheckbox = document.getElementById("selectAllSets");
	const isSelected = selectAllCheckbox.checked;

	document.querySelectorAll(".set-checkbox input").forEach((checkbox) => {
		checkbox.checked = isSelected;
		const setRow = checkbox.closest(".exercise-item, .inline-inputs");
		if (setRow) {
			if (isSelected) {
				setRow.classList.add("selected-for-bulk-edit");
			} else {
				setRow.classList.remove("selected-for-bulk-edit");
			}
		}
	});

	updateSelectedCount();
}

// Update selected count and manage button states
function updateSelectedCount() {
	const selectedCheckboxes = document.querySelectorAll(
		".set-checkbox input:checked",
	);
	const count = selectedCheckboxes.length;

	const countDisplay = document.getElementById("selectedCount");
	if (countDisplay) {
		countDisplay.textContent = `${count} set${count !== 1 ? "s" : ""} selected`;
	}

	// Update select all checkbox state
	const selectAllCheckbox = document.getElementById("selectAllSets");
	const totalCheckboxes = document.querySelectorAll(
		".set-checkbox input",
	).length;

	if (selectAllCheckbox) {
		selectAllCheckbox.checked = count === totalCheckboxes && count > 0;
		selectAllCheckbox.indeterminate = count > 0 && count < totalCheckboxes;
	}

	// Enable/disable bulk edit button
	const bulkEditBtn = document.getElementById("bulkEditBtn");
	if (bulkEditBtn) {
		bulkEditBtn.disabled = count === 0;
	}

	// Apply highlighting to selected sets
	selectedCheckboxes.forEach((checkbox) => {
		const setRow = checkbox.closest(".exercise-item, .inline-inputs");
		if (setRow) {
			setRow.classList.add("selected-for-bulk-edit");
		}
	});

	// Remove highlighting from unselected sets
	document
		.querySelectorAll(".set-checkbox input:not(:checked)")
		.forEach((checkbox) => {
			const setRow = checkbox.closest(".exercise-item, .inline-inputs");
			if (setRow) {
				setRow.classList.remove("selected-for-bulk-edit");
			}
		});
}

// Show bulk edit modal with selected sets information
function showBulkEditModal() {
	const modal = document.getElementById("bulkEditModal");
	if (!modal) return;

	const selectedSets = getSelectedSets();
	if (selectedSets.length === 0) {
		showError("No sets selected for bulk editing");
		return;
	}

	// Update modal content with selected sets info
	const selectedSetsDiv = modal.querySelector("#selectedSetsInfo");
	if (selectedSetsDiv) {
		selectedSetsDiv.innerHTML = `
            <h4>Selected Sets (${selectedSets.length})</h4>
            <div class="selected-sets-list">
                ${selectedSets
									.map(
										(set, index) => `
                    <div class="selected-set-item">
                        <strong>${set.exercise || "Unknown Exercise"}</strong>: 
                        ${set.weight || "?"}${set.unit || "lbs"} × ${set.reps || "?"} @ RPE ${set.rpe || "?"}
                    </div>
                `,
									)
									.join("")}
            </div>
        `;
	}

	// Clear previous values
	document.getElementById("bulkWeight").value = "";
	document.getElementById("bulkReps").value = "";
	document.getElementById("bulkRPE").value = "";
	document.getElementById("bulkApplyRelative").checked = false;

	modal.style.display = "block";
}

// Close bulk edit modal
function closeBulkEditModal() {
	const modal = document.getElementById("bulkEditModal");
	if (modal) {
		modal.style.display = "none";
	}
}

// Apply bulk changes to selected sets
function applyBulkEdit() {
	const weightInput = document.getElementById("bulkWeight");
	const repsInput = document.getElementById("bulkReps");
	const rpeInput = document.getElementById("bulkRPE");
	const isRelative = document.getElementById("bulkApplyRelative").checked;

	const weight = parseFloat(weightInput.value);
	const reps = parseInt(repsInput.value);
	const rpe = parseFloat(rpeInput.value);

	if (isNaN(weight) && isNaN(reps) && isNaN(rpe)) {
		showError("Please enter at least one value to apply");
		return;
	}

	const selectedSets = getSelectedSets();
	let appliedCount = 0;

	selectedSets.forEach((setInfo) => {
		const setRow = setInfo.element;
		const weightField = setRow.querySelector(
			'input[placeholder*="Weight"], input[id*="weight"]',
		);
		const repsField = setRow.querySelector(
			'input[placeholder*="Reps"], input[id*="reps"]',
		);
		const rpeField = setRow.querySelector(
			'input[placeholder*="RPE"], input[id*="rpe"]',
		);

		// Apply weight changes
		if (!isNaN(weight) && weightField) {
			if (isRelative) {
				const currentWeight = parseFloat(weightField.value) || 0;
				weightField.value = Math.max(0, currentWeight + weight);
			} else {
				weightField.value = weight;
			}
		}

		// Apply reps changes
		if (!isNaN(reps) && repsField) {
			if (isRelative) {
				const currentReps = parseInt(repsField.value) || 0;
				repsField.value = Math.max(1, currentReps + reps);
			} else {
				repsField.value = reps;
			}
		}

		// Apply RPE changes
		if (!isNaN(rpe) && rpeField) {
			if (isRelative) {
				const currentRPE = parseFloat(rpeField.value) || 6;
				rpeField.value = Math.max(6, Math.min(10, currentRPE + rpe));
			} else {
				rpeField.value = Math.max(6, Math.min(10, rpe));
			}
		}

		appliedCount++;
	});

	closeBulkEditModal();
	showSuccess(
		`Bulk changes applied to ${appliedCount} set${appliedCount !== 1 ? "s" : ""}`,
	);
}

// Log all selected sets
function bulkLogAllSets() {
	const selectedSets = getSelectedSets();
	if (selectedSets.length === 0) {
		showError("No sets selected for logging");
		return;
	}

	let loggedCount = 0;
	let errorCount = 0;

	selectedSets.forEach((setInfo) => {
		const setRow = setInfo.element;
		const logButton = setRow.querySelector(
			'button[onclick*="logSet"], .log-btn, button[title*="Log"]',
		);

		if (logButton) {
			try {
				logButton.click();
				loggedCount++;
			} catch (error) {
				console.error("Error logging set:", error);
				errorCount++;
			}
		} else {
			errorCount++;
		}
	});

	if (loggedCount > 0) {
		showSuccess(
			`Successfully logged ${loggedCount} set${loggedCount !== 1 ? "s" : ""}`,
		);

		// Auto-hide bulk edit controls after successful bulk logging
		setTimeout(() => {
			hideBulkEditControls();
		}, 1500);
	}

	if (errorCount > 0) {
		showError(`Failed to log ${errorCount} set${errorCount !== 1 ? "s" : ""}`);
	}
}

// Get information about currently selected sets
function getSelectedSets() {
	const selectedCheckboxes = document.querySelectorAll(
		".set-checkbox input:checked",
	);
	return Array.from(selectedCheckboxes).map((checkbox) => {
		const setRow = checkbox.closest(".exercise-item, .inline-inputs");
		const weightField = setRow.querySelector(
			'input[placeholder*="Weight"], input[id*="weight"]',
		);
		const repsField = setRow.querySelector(
			'input[placeholder*="Reps"], input[id*="reps"]',
		);
		const rpeField = setRow.querySelector(
			'input[placeholder*="RPE"], input[id*="rpe"]',
		);

		return {
			element: setRow,
			exercise:
				setRow.querySelector(".exercise-name, .set-title")?.textContent ||
				"Unknown Exercise",
			weight: weightField?.value,
			reps: repsField?.value,
			rpe: rpeField?.value,
			unit: "lbs", // Default unit, could be made dynamic
		};
	});
}

// Clear all bulk edit selections
function clearBulkEditSelections() {
	document.querySelectorAll(".set-checkbox input").forEach((checkbox) => {
		checkbox.checked = false;
	});
	updateSelectedCount();
}

// Generate HTML for bulk edit controls toolbar
function generateBulkEditControlsHTML() {
	return `
        <div id="bulkEditControls" class="bulk-edit-controls" style="display: none;">
            <div class="bulk-edit-toolbar">
                <label class="bulk-edit-checkbox">
                    <input type="checkbox" id="selectAllSets">
                    <span>Select All</span>
                </label>
                <span id="selectedCount">0 sets selected</span>
                <button id="bulkEditBtn" disabled>Edit Selected</button>
                <button id="cancelBulkEdit" class="secondary">Cancel</button>
            </div>
        </div>
    `;
}

// Generate HTML for bulk edit modal
function generateBulkEditModalHTML() {
	return `
        <div id="bulkEditModal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Bulk Edit Sets</h3>
                    <button id="closeBulkEditModal" class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="selectedSetsInfo"></div>
                    
                    <div class="bulk-edit-form">
                        <h4>Apply Changes</h4>
                        <div class="form-row">
                            <label>Weight:</label>
                            <input type="number" id="bulkWeight" step="0.5" placeholder="Enter weight">
                        </div>
                        <div class="form-row">
                            <label>Reps:</label>
                            <input type="number" id="bulkReps" step="1" placeholder="Enter reps">
                        </div>
                        <div class="form-row">
                            <label>RPE:</label>
                            <input type="number" id="bulkRPE" step="0.5" min="6" max="10" placeholder="Enter RPE">
                        </div>
                        <div class="form-row">
                            <label class="bulk-edit-checkbox">
                                <input type="checkbox" id="bulkApplyRelative">
                                <span>Apply as relative changes (+/-)</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="applyBulkEdit" class="primary">Apply Changes</button>
                    <button id="bulkLogAllSets" class="accent">Log All Selected Sets</button>
                    <button id="closeBulkEditModal" class="secondary">Cancel</button>
                </div>
            </div>
        </div>
    `;
}

// Generate HTML for individual set checkbox
function generateSetCheckboxHTML(index) {
	return `
        <label class="set-checkbox">
            <input type="checkbox" data-set-index="${index}">
        </label>
    `;
}

// Export functions for external access
window.BulkEdit = {
	initializeBulkEdit,
	showBulkEditControls,
	hideBulkEditControls,
	toggleSelectAll,
	updateSelectedCount,
	showBulkEditModal,
	closeBulkEditModal,
	applyBulkEdit,
	bulkLogAllSets,
	getSelectedSets,
	clearBulkEditSelections,
};
