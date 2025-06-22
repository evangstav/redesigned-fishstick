// Theme Management Component
// Handles dark mode toggle and system preference detection

// Initialize theme on page load
function initializeTheme() {
	// Check for saved theme preference or default to system preference
	const savedTheme = localStorage.getItem("theme");
	const systemPrefersDark = window.matchMedia(
		"(prefers-color-scheme: dark)",
	).matches;

	// Determine initial theme
	let initialTheme;
	if (savedTheme) {
		initialTheme = savedTheme;
	} else {
		initialTheme = systemPrefersDark ? "dark" : "light";
	}

	// Apply the initial theme
	applyTheme(initialTheme);

	// Listen for system theme changes (only if no manual preference is saved)
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", (e) => {
			// Only auto-switch if user hasn't manually set a preference
			if (!localStorage.getItem("theme")) {
				applyTheme(e.matches ? "dark" : "light");
			}
		});
}

// Toggle between light and dark themes
function toggleTheme() {
	const currentTheme =
		document.documentElement.getAttribute("data-theme") || "light";
	const newTheme = currentTheme === "light" ? "dark" : "light";

	// Apply new theme
	applyTheme(newTheme);

	// Save preference to localStorage
	localStorage.setItem("theme", newTheme);
}

// Apply the specified theme
function applyTheme(theme) {
	// Set theme attribute on document element
	document.documentElement.setAttribute("data-theme", theme);

	// Update theme toggle button
	const themeToggle = document.getElementById("themeToggle");
	const themeIcon = document.querySelector(".theme-icon");

	if (themeToggle && themeIcon) {
		if (theme === "dark") {
			themeIcon.textContent = "☀";
			themeToggle.title = "Switch to light mode";
		} else {
			themeIcon.textContent = "🌙";
			themeToggle.title = "Switch to dark mode";
		}
	}

	// Update mobile browser theme color
	updateThemeColors(theme);
}

// Update meta theme-color for mobile browsers
function updateThemeColors(theme) {
	const themeColorMeta = document.querySelector('meta[name="theme-color"]');
	if (themeColorMeta) {
		// Update theme color based on current theme
		if (theme === "dark") {
			themeColorMeta.setAttribute("content", "#121212"); // Dark theme background
		} else {
			themeColorMeta.setAttribute("content", "#0D7377"); // Light theme primary color
		}
	}
}

// Export functions for external access if needed
window.ThemeManager = {
	initializeTheme,
	toggleTheme,
	applyTheme,
	updateThemeColors,
};
