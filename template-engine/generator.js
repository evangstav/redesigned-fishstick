const fs = require("fs").promises;
const path = require("path");

class TemplateGenerator {
	constructor() {
		this.templates = {};
		this.configs = {};
		this.exerciseDatabase = null;
		this.programTemplates = null;
		this.uiThemes = null;
		this.basePath = path.join(__dirname, "..");
	}

	async initialize() {
		try {
			await this.loadTemplates();
			await this.loadConfigs();
			console.log("TemplateGenerator initialized successfully");
		} catch (error) {
			throw new Error(
				`Failed to initialize TemplateGenerator: ${error.message}`,
			);
		}
	}

	async loadTemplates() {
		const templateDir = path.join(this.basePath, "templates");

		// Load base HTML template
		this.templates.base = await fs.readFile(
			path.join(templateDir, "base-template.html"),
			"utf8",
		);

		// Load component templates
		this.templates.workoutTab = await fs.readFile(
			path.join(templateDir, "components", "workout-tab.html"),
			"utf8",
		);
		this.templates.exerciseItem = await fs.readFile(
			path.join(templateDir, "components", "exercise-item.html"),
			"utf8",
		);
		this.templates.analyticsSection = await fs.readFile(
			path.join(templateDir, "components", "analytics-section.html"),
			"utf8",
		);

		// Load CSS templates
		this.templates.baseCss = await fs.readFile(
			path.join(templateDir, "styles", "base.css"),
			"utf8",
		);
		this.templates.materialCss = await fs.readFile(
			path.join(templateDir, "styles", "material-design.css"),
			"utf8",
		);

		// Load JavaScript templates
		this.templates.coreFunctions = await fs.readFile(
			path.join(templateDir, "scripts", "core-functions.js"),
			"utf8",
		);
		this.templates.storageManager = await fs.readFile(
			path.join(templateDir, "scripts", "storage-manager.js"),
			"utf8",
		);
		this.templates.workoutFunctions = await fs.readFile(
			path.join(templateDir, "scripts", "workout-functions.js"),
			"utf8",
		);
		this.templates.analyticsFunctions = await fs.readFile(
			path.join(templateDir, "scripts", "analytics-functions.js"),
			"utf8",
		);
	}

	async loadConfigs() {
		const configDir = path.join(this.basePath, "configs");

		// Load exercise database (v2)
		const exerciseData = await fs.readFile(
			path.join(configDir, "exercise-database-v2.json"),
			"utf8",
		);
		this.exerciseDatabase = JSON.parse(exerciseData);

		// Load program templates
		const programData = await fs.readFile(
			path.join(configDir, "program-templates.json"),
			"utf8",
		);
		this.programTemplates = JSON.parse(programData);

		// Load UI themes
		const themeData = await fs.readFile(
			path.join(configDir, "ui-themes.json"),
			"utf8",
		);
		this.uiThemes = JSON.parse(themeData);
	}

	generateApp(userConfig) {
		try {
			console.log("Starting app generation...");

			// 1. Process configuration
			const processedConfig = this.processConfiguration(userConfig);
			console.log("Configuration processed");

			// 2. Generate workout plan
			const workoutPlan = this.generateWorkoutPlan(processedConfig);
			this.currentWorkoutPlan = workoutPlan; // Store for target weight calculations
			console.log("Workout plan generated");

			// 3. Compile templates
			const compiledHTML = this.compileHTML(processedConfig, workoutPlan);
			const compiledCSS = this.compileCSS(processedConfig);
			const compiledJS = this.compileJavaScript(processedConfig, workoutPlan);
			console.log("Templates compiled");

			// 4. Combine into final app
			const finalApp = this.combineComponents(
				compiledHTML,
				compiledCSS,
				compiledJS,
			);
			console.log("App generation completed");

			return finalApp;
		} catch (error) {
			throw new Error(`App generation failed: ${error.message}`);
		}
	}

	processConfiguration(userConfig) {
		// Set defaults and validate configuration
		const config = {
			app_metadata: {
				name: userConfig.app_name || "My Fitness Tracker",
				version: "1.0.0",
				generated_date: new Date().toISOString().split("T")[0],
				user_profile_hash: this.generateHash(userConfig),
			},
			branding: this.selectBranding(userConfig),
			features: {
				ai_recommendations: userConfig.features?.ai_recommendations ?? true,
				bodyweight_tracking: userConfig.features?.bodyweight_tracking ?? true,
				rpe_logging: userConfig.features?.rpe_logging ?? true,
				analytics_enabled: userConfig.features?.analytics_enabled ?? true,
			},
			program_type: userConfig.program_type || "4_day_strength",
			equipment_access: userConfig.equipment_access || [
				"barbell",
				"squat_rack",
				"bench",
			],
			default_bodyweight: userConfig.default_bodyweight || 70,
			default_tab: userConfig.default_tab || "guideTab",
			// Preserve athlete profile fields for agentic generation
			primary_goal: userConfig.primary_goal,
			experience_level: userConfig.experience_level,
			sessions_per_week: userConfig.sessions_per_week,
			time_per_session: userConfig.time_per_session,
			age_range: userConfig.age_range,
			limitations: userConfig.limitations,
		};

		return config;
	}

	selectBranding(userConfig) {
		const goalThemeMap = {
			strength: "strength",
			hypertrophy: "hypertrophy",
			endurance: "endurance",
		};

		const themeKey = goalThemeMap[userConfig.primary_goal] || "strength";
		const theme = this.uiThemes.themes[themeKey];

		return {
			theme_name: theme.name,
			primary_color: theme.primary_color,
			accent_color: theme.accent_color,
			light_color: theme.light_color,
			success_color: theme.success_color,
			success_dark: theme.success_dark,
			error_color: theme.error_color,
			error_dark: theme.error_dark,
			elevation_1: theme.elevation_1,
			elevation_2: theme.elevation_2,
			elevation_4: theme.elevation_4,
		};
	}

	generateWorkoutPlan(config) {
		const programTemplate =
			this.programTemplates.templates[config.program_type];

		if (!programTemplate) {
			throw new Error(`Program template '${config.program_type}' not found`);
		}

		// For now, return the template as-is
		// In a full implementation, this would filter exercises by equipment,
		// customize based on user preferences, etc.
		return programTemplate;
	}

	compileHTML(config, workoutPlan) {
		let html = this.templates.base;

		// Replace template variables
		html = html.replace(/\{\{APP_TITLE\}\}/g, config.app_metadata.name);
		html = html.replace(
			/\{\{APP_TITLE_SHORT\}\}/g,
			config.app_metadata.name.substring(0, 20),
		);
		html = html.replace(/\{\{APP_HEADER_TITLE\}\}/g, config.app_metadata.name);
		html = html.replace(
			/\{\{PRIMARY_COLOR\}\}/g,
			config.branding.primary_color,
		);

		// Generate navigation
		const navigation = this.generateNavigation(config);
		html = html.replace(/\{\{NAVIGATION_COMPONENT\}\}/g, navigation);

		// Generate tab content sections
		const tabContent = this.generateTabContent(config, workoutPlan);
		html = html.replace(/\{\{TAB_CONTENT_SECTIONS\}\}/g, tabContent);

		// PWA manifest placeholder
		html = html.replace(
			/\{\{PWA_MANIFEST_BASE64\}\}/g,
			"eyJuYW1lIjoi..." /* simplified */,
		);

		return html;
	}

	compileCSS(config) {
		let css = this.templates.materialCss;

		// Replace color variables
		css = css.replace(/\{\{PRIMARY_COLOR\}\}/g, config.branding.primary_color);
		css = css.replace(/\{\{ACCENT_COLOR\}\}/g, config.branding.accent_color);
		css = css.replace(/\{\{LIGHT_COLOR\}\}/g, config.branding.light_color);
		css = css.replace(/\{\{SUCCESS_COLOR\}\}/g, config.branding.success_color);
		css = css.replace(/\{\{SUCCESS_DARK\}\}/g, config.branding.success_dark);
		css = css.replace(/\{\{ERROR_COLOR\}\}/g, config.branding.error_color);
		css = css.replace(/\{\{ERROR_DARK\}\}/g, config.branding.error_dark);
		css = css.replace(/\{\{ELEVATION_1\}\}/g, config.branding.elevation_1);
		css = css.replace(/\{\{ELEVATION_2\}\}/g, config.branding.elevation_2);
		css = css.replace(/\{\{ELEVATION_4\}\}/g, config.branding.elevation_4);

		// Process conditional CSS
		css = this.processConditionalCSS(css, config);

		// Include base CSS
		css = css.replace(/\{\{BASE_CSS_CONTENT\}\}/g, this.templates.baseCss);

		return css;
	}

	processConditionalJS(js, config) {
		// Process conditional JavaScript compilation
		js = js.replace(
			/\{\{#if ANALYTICS_ENABLED\}\}(.*?)\{\{else\}\}(.*?)\{\{\/if\}\}/gs,
			config.features.analytics_enabled ? "$1" : "$2",
		);
		js = js.replace(
			/\{\{#if ANALYTICS_ENABLED\}\}(.*?)\{\{\/if\}\}/gs,
			config.features.analytics_enabled ? "$1" : "",
		);

		// Replace color variables in JS
		js = js.replace(/\{\{PRIMARY_COLOR\}\}/g, config.branding.primary_color);
		js = js.replace(/\{\{SUCCESS_COLOR\}\}/g, config.branding.success_color);
		js = js.replace(/\{\{ERROR_COLOR\}\}/g, config.branding.error_color);
		js = js.replace(/\{\{ACCENT_COLOR\}\}/g, config.branding.accent_color);

		return js;
	}

	compileJavaScript(config, workoutPlan) {
		let js =
			this.templates.coreFunctions +
			"\n\n" +
			this.templates.storageManager +
			"\n\n" +
			this.templates.workoutFunctions;

		// Add analytics functions if enabled
		if (config.features.analytics_enabled) {
			let analyticsFunctions = this.templates.analyticsFunctions;
			// Process analytics conditional compilation
			analyticsFunctions = this.processConditionalJS(
				analyticsFunctions,
				config,
			);
			js += "\n\n" + analyticsFunctions;
		}

		// Generate configuration injection
		const configInjection = `
      // Template Configuration
      const TEMPLATE_CONFIG = ${JSON.stringify(config, null, 2)};
      const GENERATED_WORKOUT_PLAN = ${JSON.stringify(workoutPlan.workout_days, null, 2)};
    `;

		// Replace template variables
		js = js.replace(/\/\/ \{\{TEMPLATE_CONFIG_INJECTION\}\}/g, configInjection);
		js = js.replace(
			/\{\{CORE_LIFTS_LIST\}\}/g,
			JSON.stringify(this.getCoreLifts(workoutPlan)),
		);
		js = js.replace(
			/\{\{BODYWEIGHT_EXERCISES_LIST\}\}/g,
			JSON.stringify(this.getBodyweightExercises(workoutPlan)),
		);
		js = js.replace(
			/\{\{GENERATED_WORKOUT_PLAN\}\}/g,
			JSON.stringify(workoutPlan.workout_days),
		);
		js = js.replace(/\{\{DEFAULT_BODYWEIGHT\}\}/g, config.default_bodyweight);
		js = js.replace(/\{\{DEFAULT_TAB\}\}/g, config.default_tab);
		js = js.replace(/\{\{APP_ID\}\}/g, config.app_metadata.user_profile_hash);
		js = js.replace(/\{\{APP_VERSION\}\}/g, config.app_metadata.version);
		js = js.replace(/\{\{STORAGE_KEY_PREFIX\}\}/g, "personalizedPlan");
		js = js.replace(/\{\{APP_TITLE\}\}/g, config.app_metadata.name);
		js = js.replace(/\{\{DEFAULT_E1RMS\}\}/g, JSON.stringify({}));

		return js;
	}

	generateNavigation(config) {
		const navItems = [{ id: "guideTab", label: "Guide" }];

		if (config.features.ai_recommendations) {
			navItems.push({
				id: "smartRecommendationsTab",
				label: "Smart Recommendations",
			});
		}

		// Add workout day navigation
		const workoutDays = [
			{ id: "squatdayTab", label: "Squat Day" },
			{ id: "benchdayTab", label: "Bench Day" },
			{ id: "deadliftdayTab", label: "Deadlift Day" },
			{ id: "pulldayTab", label: "Pull Day" },
			{ id: "cardiodayTab", label: "Cardio Day" },
			{ id: "mobilitydayTab", label: "Mobility Day" },
			{ id: "restdayTab", label: "Rest Day" },
		];

		navItems.push(...workoutDays);

		if (config.features.analytics_enabled) {
			navItems.push({ id: "analyticsTab", label: "Analytics" });
		}

		navItems.push({ id: "e1rmTab", label: "Settings & e1RMs" });

		return navItems
			.map(
				(item) =>
					`<button data-tab="${item.id}" onclick="showTab('${item.id}')">${item.label}</button>`,
			)
			.join("\n            ");
	}

	generateTabContent(config, workoutPlan) {
		let tabContent = "";

		// Guide Tab
		tabContent += this.generateGuideTab(config);

		// Smart Recommendations Tab (if enabled)
		if (config.features.ai_recommendations) {
			tabContent += this.generateSmartRecommendationsTab(config);
		}

		// Workout Day Tabs
		const workoutDays = [
			"Squat Day",
			"Bench Day",
			"Deadlift Day",
			"Pull Day",
			"Cardio Day",
			"Mobility Day",
			"Rest Day",
		];
		workoutDays.forEach((dayName) => {
			if (workoutPlan.workout_days[dayName.toLowerCase().replace(" ", "_")]) {
				tabContent += this.generateWorkoutDayTab(
					dayName,
					workoutPlan.workout_days[dayName.toLowerCase().replace(" ", "_")],
				);
			}
		});

		// Analytics Tab (if enabled)
		if (config.features.analytics_enabled) {
			tabContent += this.generateAnalyticsTab(config);
		}

		// Settings & e1RMs Tab
		tabContent += this.generateSettingsTab(config);

		return tabContent;
	}

	generateGuideTab(config) {
		return `
      <div id="guideTab" class="tab-content section">
        <h2>Program Guide</h2>
        <p>Welcome to your ${config.app_metadata.name}! This guide will help you understand how to use the app and follow the program effectively.</p>
        
        <h4>Core Principles:</h4>
        <ul>
          <li><strong>Consistency is Key:</strong> Adherence to the plan over time will yield the best results.</li>
          <li><strong>Progressive Overload:</strong> The app calculates target weights based on your e1RM and adjusts automatically.</li>
          <li><strong>RPE (Rating of Perceived Exertion):</strong> Scale of 1-10 for honest effort tracking.</li>
          <li><strong>e1RM (Estimated 1 Rep Max):</strong> Updated automatically after logging heavy sets.</li>
        </ul>
        
        <h4>How to Use This App:</h4>
        <ol>
          <li><strong>Set Initial e1RMs & Bodyweight:</strong> Go to "Settings & e1RMs" tab first.</li>
          <li><strong>Choose Your Workout:</strong> Click any workout type in the navigation.</li>
          <li><strong>Perform & Log:</strong> Enter weight, reps, and RPE for each set.</li>
          <li><strong>Track Progress:</strong> View analytics and e1RM updates.</li>
        </ol>
      </div>
    `;
	}

	generateSmartRecommendationsTab(config) {
		return `
      <div id="smartRecommendationsTab" class="tab-content section" style="display: none;">
        <h2>Smart Workout Recommendations</h2>
        <p>Get AI-powered workout suggestions based on your current state and training history.</p>
        
        <div class="section">
          <h3>How are you feeling today?</h3>
          <div class="inline-inputs">
            <label>Energy Level (1-10):</label>
            <input type="number" id="energyLevel" min="1" max="10" value="7">
            <label>Stress Level (1-10):</label>
            <input type="number" id="stressLevel" min="1" max="10" value="5">
            <label>Time Available (minutes):</label>
            <input type="number" id="timeAvailable" min="15" max="180" value="60">
          </div>
          <button class="action-button" onclick="getSmartRecommendation()">Get Recommendation</button>
        </div>
        
        <div id="recommendationResult" class="section" style="display: none;">
          <h3>Recommended Workout</h3>
          <div id="recommendationContent"></div>
        </div>
      </div>
    `;
	}

	generateWorkoutDayTab(dayName, dayData) {
		const dayId =
			dayName.toLowerCase().replace(" ", "").replace(" ", "") + "Tab";
		let exerciseComponents = "";

		if (dayData && dayData.exercise_slots) {
			exerciseComponents = dayData.exercise_slots
				.map((exercise) => {
					return this.generateExerciseComponent(exercise);
				})
				.join("\n");
		}

		return `
      <div id="${dayId}" class="tab-content section" style="display: none;">
        <h2>${dayName}</h2>
        <div class="workout-content">
          ${exerciseComponents}
        </div>
        
        <div class="section" style="margin-top: 20px;">
          <h3>Today's Log</h3>
          <div id="dailyWorkoutLogContainer">
            <p style="color: var(--md-grey-700); font-style: italic;">Complete exercises above to see your log entries here.</p>
          </div>
        </div>
      </div>
    `;
	}

	generateExerciseComponent(exercise) {
		const isStrength = exercise.type === "strength_single_heavy";
		const isVolume = exercise.type === "strength_volume";
		const isAccessory = exercise.type === "accessory";
		const isCardio = exercise.type === "hiit" || exercise.type === "cardio";
		const isMobility = exercise.type === "mobility";

		let component = `
      <div class="exercise-item" data-exercise-id="${exercise.id}">
        <h3>${exercise.liftName || exercise.name}</h3>
    `;

		if (exercise.notes) {
			component += `<div class="exercise-notes">${exercise.notes}</div>`;
		}

		if (isStrength) {
			const targetWeight = `{{TARGET_WEIGHT_${exercise.id.toUpperCase()}}}`;
			component += `
        <div class="exercise-details">${exercise.setLabel || "Heavy Set"} - ${exercise.sets} set × ${exercise.repsTarget} reps @ ${exercise.percentage * 100}% (Target: ${targetWeight}lbs)</div>
        <div class="inline-inputs">
          <label>Weight:</label>
          <input type="number" id="${exercise.id}_weight" step="2.5" placeholder="${targetWeight}">
          <label>Reps:</label>
          <input type="number" id="${exercise.id}_reps" value="${exercise.repsTarget}">
          <label>RPE:</label>
          <input type="number" id="${exercise.id}_rpe" min="6" max="10" step="0.5" placeholder="8">
        </div>
        <button class="action-button log-set-button" onclick="logHeavyStrengthSet('${exercise.id}', '${exercise.group || exercise.liftName}')">
          Log Set
        </button>
      `;
		} else if (isVolume) {
			const targetWeight = `{{TARGET_WEIGHT_${exercise.id.toUpperCase()}}}`;
			component += `
        <div class="exercise-details">${exercise.sets} sets × ${exercise.reps} reps @ ${exercise.percentage * 100}% (Target: ${targetWeight}lbs each set)</div>
      `;
			for (let i = 1; i <= exercise.sets; i++) {
				component += `
          <div class="set-item">
            <span class="set-label">Set ${i}:</span>
            <div class="inline-inputs">
              <label>Weight:</label>
              <input type="number" id="${exercise.id}_weight_${i}" step="2.5" placeholder="${targetWeight}">
              <label>Reps:</label>
              <input type="number" id="${exercise.id}_reps_${i}" value="${exercise.reps}">
              <label>RPE:</label>
              <input type="number" id="${exercise.id}_rpe_${i}" min="6" max="10" step="0.5" placeholder="8">
            </div>
            <button class="action-button log-set-button" onclick="logGenericSet('${exercise.id}', '${exercise.group || exercise.liftName}', ${i})">
              Log Set ${i}
            </button>
          </div>
        `;
			}
		} else if (isAccessory) {
			component += `
        <div class="exercise-details">${exercise.sets} sets × ${exercise.reps || exercise.repsRange} reps</div>
      `;
			for (let i = 1; i <= exercise.sets; i++) {
				component += `
          <div class="set-item" style="margin-bottom: 8px;">
            <button class="action-button" onclick="openAccessoryLogModal('${exercise.id}', '${exercise.liftName}', ${i})">
              Log Set ${i}
            </button>
          </div>
        `;
			}
		} else if (isCardio) {
			component += `
        <div class="exercise-details">${exercise.duration || exercise.details}</div>
        <button class="action-button" onclick="markCardioCompleted('${exercise.id}', '${exercise.name}')">
          Mark Completed
        </button>
      `;
		} else if (isMobility) {
			component += `
        <button class="action-button" onclick="markMobilityCompleted('${exercise.id}', '${exercise.name}')">
          Mark Completed
        </button>
      `;
		}

		component += `</div>`;
		return component;
	}

	generateAnalyticsTab(config) {
		let analyticsContent = this.templates.analyticsSection;

		// Process conditional rendering
		analyticsContent = analyticsContent.replace(
			/\{\{#if BODYWEIGHT_TRACKING\}\}(.*?)\{\{\/if\}\}/gs,
			config.features.bodyweight_tracking ? "$1" : "",
		);

		return analyticsContent;
	}

	generateSettingsTab(config) {
		return `
      <div id="e1rmTab" class="tab-content section" style="display: none;">
        <h2>Settings & e1RMs</h2>
        <p>Configure your bodyweight and estimated 1-rep maxes for accurate target weight calculations.</p>
        
        <div class="section">
          <h3>Current Bodyweight</h3>
          <div class="bodyweight-input-container">
            <label for="bodyweightInput">Bodyweight (lbs):</label>
            <input type="number" id="bodyweightInput" value="${config.default_bodyweight}" step="0.1">
            <button class="action-button" onclick="updateBodyweight()">Update Bodyweight</button>
          </div>
        </div>
        
        <div class="section">
          <h3>e1RM Management</h3>
          <div class="e1rm-manage-section">
            <table>
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Current e1RM (lbs)</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody id="e1rmTableBody">
                <!-- Populated by JavaScript -->
              </tbody>
            </table>
            <button class="action-button" style="margin-top: 16px;" onclick="saveAllE1RMs()">Save All e1RMs</button>
          </div>
        </div>
        
        <div class="section">
          <h3>Data Management</h3>
          <button class="action-button" onclick="exportData()">Export Data</button>
          <button class="action-button" onclick="importData()">Import Data</button>
          <button class="danger-button" onclick="clearAllData()">Clear All Data</button>
        </div>
      </div>
    `;
	}

	processConditionalCSS(css, config) {
		// Simple conditional CSS processing
		// Replace {{#if FEATURE}} blocks
		css = css.replace(
			/\{\{#if BODYWEIGHT_TRACKING\}\}(.*?)\{\{else\}\}(.*?)\{\{\/if\}\}/gs,
			config.features.bodyweight_tracking ? "$1" : "$2",
		);

		css = css.replace(
			/\{\{#if AI_RECOMMENDATIONS\}\}(.*?)\{\{else\}\}(.*?)\{\{\/if\}\}/gs,
			config.features.ai_recommendations ? "$1" : "$2",
		);

		css = css.replace(
			/\{\{#if ANALYTICS_ENABLED\}\}(.*?)\{\{else\}\}(.*?)\{\{\/if\}\}/gs,
			config.features.analytics_enabled ? "$1" : "$2",
		);

		return css;
	}

	combineComponents(html, css, js) {
		let finalApp = html;
		finalApp = finalApp.replace(/\{\{COMPILED_CSS\}\}/g, css);
		finalApp = finalApp.replace(/\{\{COMPILED_JAVASCRIPT\}\}/g, js);

		// Replace TARGET_WEIGHT template variables with calculated values
		finalApp = this.replaceTargetWeights(finalApp);

		// Basic optimization - remove comments and excess whitespace
		finalApp = this.optimizeCode(finalApp);

		return finalApp;
	}

	replaceTargetWeights(html) {
		// Default e1RM values for target weight calculations
		const defaultE1RMs = {
			"Back-squat": 225,
			"Bench Press": 185,
			Deadlift: 275,
			OHP: 115,
			"Weighted Pull-up": 25,
			Dips: 45,
		};

		// Calculate target weight function
		const calculateTargetWeight = (liftName, percentage) => {
			const e1rm = defaultE1RMs[liftName] || 135;
			const targetWeight = e1rm * percentage;
			return Math.round(targetWeight / 2.5) * 2.5;
		};

		// Find all TARGET_WEIGHT template variables and replace them
		const targetWeightRegex = /\{\{TARGET_WEIGHT_([^}]+)\}\}/g;

		return html.replace(targetWeightRegex, (match, exerciseId) => {
			// Extract exercise info from the workout plan stored in this.currentWorkoutPlan
			if (this.currentWorkoutPlan && this.currentWorkoutPlan.workout_days) {
				for (const dayKey of Object.keys(
					this.currentWorkoutPlan.workout_days,
				)) {
					const day = this.currentWorkoutPlan.workout_days[dayKey];
					const exercise = day.exercise_slots?.find(
						(slot) => slot.id.toUpperCase().replace(/_/g, "_") === exerciseId,
					);

					if (exercise && exercise.liftName && exercise.percentage) {
						const targetWeight = calculateTargetWeight(
							exercise.liftName,
							exercise.percentage,
						);
						return targetWeight.toString();
					}
				}
			}

			// Fallback if exercise not found
			return "135";
		});
	}

	optimizeCode(code) {
		// Remove HTML comments
		code = code.replace(/<!--[\s\S]*?-->/g, "");

		// Remove JavaScript single line comments but preserve URLs
		code = code.replace(/([^:])\/\/.*$/gm, "$1");

		// Remove JavaScript multi-line comments
		code = code.replace(/\/\*[\s\S]*?\*\//g, "");

		// Remove CSS comments
		code = code.replace(/\/\*[\s\S]*?\*\//g, "");

		// Compress whitespace (but preserve line breaks for readability)
		code = code.replace(/[ \t]+/g, " ");
		code = code.replace(/\n\s+/g, "\n");
		code = code.replace(/\n{3,}/g, "\n\n");

		return code.trim();
	}

	getCoreLifts(workoutPlan) {
		const coreLifts = new Set();
		Object.values(workoutPlan.workout_days).forEach((day) => {
			day.exercise_slots?.forEach((exercise) => {
				if (exercise.liftName && exercise.type?.includes("strength")) {
					coreLifts.add(exercise.liftName);
				}
			});
		});
		return Array.from(coreLifts);
	}

	getBodyweightExercises(workoutPlan) {
		const bodyweightExercises = new Set();
		Object.values(workoutPlan.workout_days).forEach((day) => {
			day.exercise_slots?.forEach((exercise) => {
				if (
					exercise.liftName &&
					(exercise.liftName.includes("Pull-up") ||
						exercise.liftName.includes("Dips"))
				) {
					bodyweightExercises.add(exercise.liftName);
				}
			});
		});
		return Array.from(bodyweightExercises);
	}

	generateHash(obj) {
		// Simple hash function for demo purposes
		const str = JSON.stringify(obj);
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return Math.abs(hash).toString(36);
	}
}

module.exports = TemplateGenerator;
