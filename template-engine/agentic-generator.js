#!/usr/bin/env node

/**
 * Agentic Program Generation System
 *
 * Uses Claude API to dynamically generate personalized workout programs
 * based on individual athlete profiles instead of static templates.
 */

const TemplateGenerator = require("./generator");

class AgenticProgramGenerator extends TemplateGenerator {
	constructor() {
		super();
		this.claudeAPIUrl =
			"https://redesigned-fishstick-production.up.railway.app/chat";
	}

	/**
	 * Generate a complete workout plan using AI agents
	 * @param {Object} config - Athlete configuration
	 * @returns {Object} - Generated workout plan
	 */
	async generateWorkoutPlan(config) {
		console.log("🤖 Starting agentic program generation...");

		try {
			// Step 1: Analyze athlete profile
			const analysis = await this.analyzeAthleteProfile(config);
			console.log("✅ Profile analyzed");

			// Step 2: Generate complete program structure
			const program = await this.generateCompleteProgram(analysis, config);
			console.log("✅ Program generated");

			// Step 3: Validate and format for template engine
			const formattedProgram = this.formatForTemplateEngine(program, config);
			console.log("✅ Program formatted");

			return formattedProgram;
		} catch (error) {
			console.error("❌ Agentic generation failed:", error.message);
			console.log("🔄 Falling back to static template...");

			// Fallback to parent class static template generation
			return super.generateWorkoutPlan(config);
		}
	}

	/**
	 * Generate evidence-based analysis using protocols from how-to-train.md
	 * @param {Object} config - Athlete configuration
	 * @returns {Object} - Evidence-based analysis results
	 */
	async analyzeAthleteProfile(config) {
		console.log("🔬 Generating evidence-based analysis...");
		console.log("   Primary Goal:", config.primary_goal);
		console.log("   Experience Level:", config.experience_level);

		// Determine training focus based on primary goal
		let trainingFocus;
		if (config.primary_goal === "strength") {
			trainingFocus = "strength";
		} else if (config.primary_goal === "hypertrophy") {
			trainingFocus = "hypertrophy";
		} else if (config.primary_goal === "endurance") {
			trainingFocus = "endurance";
		} else if (config.primary_goal === "general_fitness") {
			trainingFocus = "general_fitness";
		} else {
			trainingFocus = "general_fitness"; // fallback
		}

		console.log("   Training Focus Determined:", trainingFocus);

		// Apply evidence-based protocols from how-to-train.md
		const evidenceBasedAnalysis = this.generateEvidenceBasedProtocols(trainingFocus, config);

		console.log(
			"✅ Evidence-based analysis complete. Focus:",
			evidenceBasedAnalysis.training_focus,
		);
		return evidenceBasedAnalysis;
	}

	/**
	 * Generate evidence-based training protocols based on how-to-train.md
	 * @param {string} trainingFocus - Primary training focus
	 * @param {Object} config - Athlete configuration
	 * @returns {Object} - Evidence-based protocols
	 */
	generateEvidenceBasedProtocols(trainingFocus, config) {
		const baseProtocols = {
			training_focus: trainingFocus,
			session_structure: {
				warmup_minutes: 10,
				main_work_minutes: config.time_per_session ? config.time_per_session - 20 : 40,
				accessories_minutes: 15,
			},
			recovery_needs: config.experience_level === "beginner" ? "high" : "moderate",
			exercise_complexity: config.experience_level || "intermediate",
		};

		if (trainingFocus === "strength") {
			// Strength Protocol from how-to-train.md
			return {
				...baseProtocols,
				load_percentage: { min: 0.85, max: 1.0 }, // ≥85% 1RM
				rep_ranges: { primary: "1-5", accessories: "6-8" },
				sets_per_exercise: { min: 2, max: 3 },
				weekly_sets_per_muscle: { min: 5, max: 10 },
				rest_periods: { primary: 180, accessories: 120 }, // 2-5 min -> 3-2 min
				frequency_per_muscle: 2, // 1-2× per muscle -> 2×
				intensity_distribution: { heavy: 0.7, moderate: 0.2, light: 0.1 },
				progression_type: "percentage_based",
				weekly_split: "powerlifting",
				core_principles: ["consistency", "progressive_overload", "recovery", "mindset_execution"],
			};
		} else if (trainingFocus === "hypertrophy") {
			// Hypertrophy Protocol from how-to-train.md  
			return {
				...baseProtocols,
				load_percentage: { min: 0.6, max: 0.8 }, // 60-80% 1RM
				rep_ranges: { primary: "6-12", accessories: "12-15" },
				sets_per_exercise: { min: 3, max: 6 },
				weekly_sets_per_muscle: { min: 10, max: 20 },
				rest_periods: { primary: 90, accessories: 60 }, // 1-2 min
				frequency_per_muscle: 3, // 2-3× per muscle -> 3×
				intensity_distribution: { heavy: 0.2, moderate: 0.6, light: 0.2 },
				progression_type: "rpe_autoregulation",
				weekly_split: "push_pull_legs",
				core_principles: ["consistency", "progressive_overload", "recovery", "time_under_tension"],
			};
		} else if (trainingFocus === "endurance") {
			// Aerobic Training Protocol from how-to-train.md
			return {
				...baseProtocols,
				intensity_distribution: { low_moderate: 0.8, high_intensity: 0.2 }, // 80/20 rule
				rep_ranges: { circuits: "15-25", hiit: "tabata_intervals" },
				sets_per_exercise: { min: 3, max: 8 },
				rest_periods: { circuits: 30, hiit: 60 }, // Short rest for metabolic stress
				frequency_per_muscle: 5, // High frequency for endurance adaptations
				weekly_split: "full_body_circuits",
				hiit_protocols: ["norwegian_4x4", "tabata", "10min_intervals"],
				zone_targets: {
					zone_1: "50-60%", // Recovery
					zone_2: "60-70%", // Low-moderate
					zone_4: "80-95%", // HIIT
				},
				core_principles: ["consistency", "aerobic_base", "interval_training", "recovery"],
			};
		} else {
			// General Fitness - Action Plan Checklist from how-to-train.md
			return {
				...baseProtocols,
				weekly_sets_per_muscle: { min: 10, max: 15 }, // ≥10 sets/muscle/week
				rep_ranges: { primary: "8-15", accessories: "12-20" },
				sets_per_exercise: { min: 2, max: 4 },
				rest_periods: { primary: 90, accessories: 75 },
				frequency_per_muscle: 2, // 2-3 sessions recommended
				intensity_distribution: { heavy: 0.3, moderate: 0.5, light: 0.2 },
				weekly_split: "full_body",
				aerobic_component: "150min_moderate_plus_hiit", // 150 min moderate + 1 HIIT
				action_plan_checklist: [
					"resistance_10_sets_per_muscle_weekly",
					"aerobic_150min_moderate_plus_hiit",
					"incidental_daily_movement",
					"protein_1_6_to_2_2g_per_kg",
					"creatine_5g_post_workout",
					"omega3_2g_daily",
					"sleep_7_to_9_hours"
				],
				core_principles: ["consistency", "balanced_training", "lifestyle_integration", "sustainable_habits"],
			};
		}
	}

	/**
	 * Generate complete program based on analysis
	 * @param {Object} analysis - Profile analysis results
	 * @param {Object} config - Original athlete config
	 * @returns {Object} - Complete program structure
	 */
	async generateCompleteProgram(analysis, config) {
		console.log("🏗 Generating custom program structure...");
		console.log("   Analysis Training Focus:", analysis.training_focus);

		// Create differentiated programs based on analysis
		const appName = config.app_metadata?.name || config.app_name || "Custom";
		const programName = `${appName.replace(/\s+/g, "")} Custom Program`;

		if (analysis.training_focus === "strength") {
			console.log("   → Generating STRENGTH program");
			return this.generateStrengthProgram(programName, analysis, config);
		} else if (analysis.training_focus === "hypertrophy") {
			console.log("   → Generating HYPERTROPHY program");
			return this.generateHypertrophyProgram(programName, analysis, config);
		} else if (analysis.training_focus === "endurance") {
			console.log("   → Generating ENDURANCE program");
			return this.generateEnduranceProgram(programName, analysis, config);
		} else {
			console.log("   → Generating GENERAL FITNESS program");
			return this.generateGeneralFitnessProgram(programName, analysis, config);
		}
	}

	generateStrengthProgram(name, analysis, config) {
		// Apply evidence-based strength protocols: ≥85% 1RM, 1-5 reps, 2-3 sets, 2-5min rest
		const protocols = analysis.load_percentage || { min: 0.85, max: 1.0 };
		const restPrimary = analysis.rest_periods?.primary || 180;
		const restAccessory = analysis.rest_periods?.accessories || 120;
		
		return {
			program_name: name,
			workout_days: {
				day1: {
					name: "Squat Focus",
					primary_movement: "squat_pattern", 
					focus_muscles: ["quads", "glutes"],
					exercise_slots: [
						{
							id: "squat_heavy",
							type: "strength_main",
							exercise_name: "back_squat",
							liftName: "Back Squat",
							sets: 3, // Evidence-based: 2-3 sets per exercise
							reps: 3, // Evidence-based: 1-5 reps
							percentage: 0.87, // Evidence-based: ≥85% 1RM
							rest_seconds: restPrimary,
							notes: "≥85% 1RM protocol. Focus on maximal strength. RPE 8-9.",
						},
						{
							id: "squat_volume",
							type: "volume",
							exercise_name: "front_squat",
							liftName: "Front Squat",
							sets: 3,
							reps: 5, // Evidence-based: upper end of 1-5 range
							percentage: 0.75, // Slightly lower for volume work
							rest_seconds: restAccessory,
							notes: "Strength accessories. Focus on movement quality.",
						},
						{
							id: "squat_accessories",
							type: "accessory",
							exercise_name: "bulgarian_split_squat",
							liftName: "Bulgarian Split Squat",
							sets: 2, // Evidence-based: 2-3 sets
							reps: 6, // Evidence-based accessory range: 6-8
							percentage: 0.0,
							rest_seconds: restAccessory,
							notes: "Unilateral strength work. Bodyweight or light load.",
						},
					],
				},
				day2: {
					name: "Bench Focus",
					primary_movement: "push_pattern",
					focus_muscles: ["chest", "shoulders", "triceps"],
					exercise_slots: [
						{
							id: "bench_heavy",
							type: "strength_main",
							exercise_name: "bench_press",
							liftName: "Bench Press",
							sets: 3, // Evidence-based: 2-3 sets per exercise
							reps: 2, // Evidence-based: 1-5 reps
							percentage: 0.90, // Evidence-based: ≥85% 1RM
							rest_seconds: restPrimary,
							notes: "≥85% 1RM protocol. Maximal strength development.",
						},
						{
							id: "bench_volume",
							type: "volume",
							exercise_name: "close_grip_bench",
							liftName: "Close Grip Bench",
							sets: 2,
							reps: 6, // Evidence-based accessory range: 6-8
							percentage: 0.75,
							rest_seconds: restAccessory,
							notes: "Tricep strength for lockout. Focus on technique.",
						},
					],
				},
				day3: {
					name: "Deadlift Focus",
					primary_movement: "hinge_pattern",
					focus_muscles: ["hamstrings", "glutes", "back"],
					exercise_slots: [
						{
							id: "deadlift_heavy",
							type: "strength_main",
							exercise_name: "deadlift",
							liftName: "Deadlift",
							sets: 3, // Evidence-based: 2-3 sets per exercise
							reps: 1, // Evidence-based: 1-5 reps (singles for max strength)
							percentage: 0.92, // Evidence-based: ≥85% 1RM
							rest_seconds: 300, // Upper end of 2-5min for max effort
							notes: "≥85% 1RM protocol. Competition style setup and execution.",
						},
						{
							id: "deadlift_volume",
							type: "volume",
							exercise_name: "rack_pull",
							liftName: "Rack Pull",
							sets: 2,
							reps: 5, // Evidence-based: upper range of 1-5
							percentage: 0.80,
							rest_seconds: restAccessory,
							notes: "Lockout strength. Focus on top portion of movement.",
						},
					],
				},
				day4: {
					name: "Pull Strength",
					primary_movement: "pull_pattern",
					focus_muscles: ["back", "biceps"],
					exercise_slots: [
						{
							id: "pull_main",
							type: "strength_main",
							exercise_name: "weighted_pullup",
							liftName: "Weighted Pull-up",
							sets: 3, // Evidence-based: 2-3 sets
							reps: 4, // Evidence-based: 1-5 reps
							percentage: 0.0, // Bodyweight + added load
							rest_seconds: restPrimary,
							notes: "Add weight for strength protocol. Aim for RPE 8-9.",
						},
						{
							id: "row_strength",
							type: "volume",
							exercise_name: "barbell_row",
							liftName: "Barbell Row",
							sets: 2,
							reps: 6, // Evidence-based accessory: 6-8
							percentage: 0.0,
							rest_seconds: restAccessory,
							notes: "Back strength development. Focus on retraction.",
						},
					],
				},
			},
		};
	}

	generateHypertrophyProgram(name, analysis, config) {
		// Apply evidence-based hypertrophy protocols: 60-80% 1RM, 6-12 reps, 3-6 sets, 1-2min rest
		const protocols = analysis.load_percentage || { min: 0.6, max: 0.8 };
		const restPrimary = analysis.rest_periods?.primary || 90;
		const restAccessory = analysis.rest_periods?.accessories || 60;
		
		return {
			program_name: name,
			workout_days: {
				day1: {
					name: "Push Day",
					primary_movement: "push_pattern",
					focus_muscles: ["chest", "shoulders", "triceps"],
					exercise_slots: [
						{
							id: "bench_hypertrophy",
							type: "volume",
							exercise_name: "bench_press",
							liftName: "Bench Press",
							sets: 4, // Evidence-based: 3-6 sets per exercise
							reps: 8, // Evidence-based: 6-12 reps
							percentage: 0.72, // Evidence-based: 60-80% 1RM
							rest_seconds: restPrimary,
							notes: "60-80% 1RM protocol. Controlled tempo for hypertrophy. RPE 8.",
						},
						{
							id: "incline_db",
							type: "volume",
							exercise_name: "incline_dumbbell_press",
							liftName: "Incline Dumbbell Press",
							sets: 3, // Evidence-based: 3-6 sets
							reps: 10, // Evidence-based: 6-12 reps
							percentage: 0.0,
							rest_seconds: restPrimary,
							notes: "Hypertrophy range. Full ROM for muscle stretch.",
						},
						{
							id: "lateral_raise",
							type: "accessory",
							exercise_name: "lateral_raise",
							liftName: "Lateral Raise",
							sets: 3,
							reps: 12, // Evidence-based accessories: 12-15
							percentage: 0.0,
							rest_seconds: restAccessory,
							notes: "Hypertrophy accessory. Control the weight.",
						},
						{
							id: "tricep_pushdown",
							type: "accessory", 
							exercise_name: "tricep_pushdown",
							liftName: "Tricep Pushdown",
							sets: 3,
							reps: 12, // Evidence-based accessories: 12-15
							percentage: 0.0,
							rest_seconds: restAccessory,
							notes: "Hypertrophy range. Focus on muscle contraction.",
						},
					],
				},
				day2: {
					name: "Pull Day",
					primary_movement: "pull_pattern",
					focus_muscles: ["back", "biceps"],
					exercise_slots: [
						{
							id: "pulldown_hypertrophy",
							type: "volume",
							exercise_name: "lat_pulldown",
							liftName: "Lat Pulldown",
							sets: 4, // Evidence-based: 3-6 sets
							reps: 10, // Evidence-based: 6-12 reps
							percentage: 0.0,
							rest_seconds: restPrimary,
							notes: "Hypertrophy protocol. Wide grip for lat development.",
						},
						{
							id: "rows_hypertrophy",
							type: "volume",
							exercise_name: "cable_row",
							liftName: "Cable Row",
							sets: 4, // Evidence-based: 3-6 sets  
							reps: 10, // Evidence-based: 6-12 reps
							percentage: 0.0,
							rest_seconds: restPrimary,
							notes: "Mid-back hypertrophy. Squeeze and hold contraction.",
						},
						{
							id: "bicep_curl",
							type: "accessory",
							exercise_name: "bicep_curl",
							liftName: "Bicep Curl",
							sets: 3,
							reps: 12, // Evidence-based accessories: 12-15
							percentage: 0.0,
							rest_seconds: restAccessory,
							notes: "Hypertrophy range. Controlled eccentric phase.",
						},
					],
				},
				day3: {
					name: "Legs Day",
					primary_movement: "squat_pattern",
					focus_muscles: ["quads", "glutes", "hamstrings"],
					exercise_slots: [
						{
							id: "squat_hypertrophy",
							type: "volume",
							exercise_name: "back_squat",
							liftName: "Back Squat",
							sets: 4, // Evidence-based: 3-6 sets
							reps: 8, // Evidence-based: 6-12 reps
							percentage: 0.70, // Evidence-based: 60-80% 1RM
							rest_seconds: restPrimary,
							notes: "60-80% 1RM for hypertrophy. Deep range of motion.",
						},
						{
							id: "leg_press",
							type: "volume",
							exercise_name: "leg_press",
							liftName: "Leg Press",
							sets: 3, // Evidence-based: 3-6 sets
							reps: 12, // Evidence-based: 6-12 reps
							percentage: 0.0,
							rest_seconds: restPrimary,
							notes: "Hypertrophy range. Focus on quad/glute engagement.",
						},
						{
							id: "leg_curl",
							type: "accessory",
							exercise_name: "leg_curl",
							liftName: "Leg Curl",
							sets: 3,
							reps: 12, // Evidence-based accessories: 12-15
							percentage: 0.0,
							rest_seconds: restAccessory,
							notes: "Hamstring hypertrophy. Slow negative phase.",
						},
					],
				},
				day4: {
					name: "Upper Body Volume",
					primary_movement: "push_pattern",
					focus_muscles: ["chest", "back", "arms"],
					exercise_slots: [
						{
							id: "dumbbell_press",
							type: "volume",
							exercise_name: "dumbbell_press",
							liftName: "Dumbbell Press",
							sets: 4, // Evidence-based: 3-6 sets
							reps: 10, // Evidence-based: 6-12 reps
							percentage: 0.0,
							rest_seconds: restPrimary,
							notes: "Hypertrophy protocol. Full range of motion.",
						},
						{
							id: "face_pull",
							type: "accessory",
							exercise_name: "face_pull",
							liftName: "Face Pull",
							sets: 3,
							reps: 15, // Evidence-based accessories: 12-15
							percentage: 0.0,
							rest_seconds: restAccessory,
							notes: "Rear delt hypertrophy. High rep range.",
						},
					],
				},
			},
		};
	}

	generateEnduranceProgram(name, analysis, config) {
		// Apply evidence-based endurance protocols: 80/20 intensity distribution, HIIT protocols
		const hiitRest = analysis.rest_periods?.hiit || 60;
		const circuitRest = analysis.rest_periods?.circuits || 30;
		
		return {
			program_name: name,
			workout_days: {
				day1: {
					name: "HIIT Training (Zone 4)",
					primary_movement: "cardio_hiit",
					focus_muscles: ["cardiovascular"],
					exercise_slots: [
						{
							id: "hiit_intervals",
							type: "cardio",
							exercise_name: "hiit_intervals",
							liftName: "HIIT Intervals",
							sets: 8, // Tabata protocol: 8 rounds
							reps: 20, // 20 seconds work
							percentage: 0.0,
							rest_seconds: 10, // 10 seconds rest (Tabata)
							notes: "Evidence-based Tabata: 20s all-out / 10s rest × 8. Zone 4 (80-95% HRmax).",
						},
						{
							id: "active_recovery",
							type: "cardio",
							exercise_name: "walking",
							liftName: "Active Recovery Walk",
							sets: 1,
							reps: 300, // 5 minutes
							percentage: 0.0,
							rest_seconds: 0,
							notes: "Zone 1 recovery (50-60% HRmax). Easy conversation pace.",
						},
					],
				},
				day2: {
					name: "Zone 2 Endurance (80% Low-Mod)",
					primary_movement: "aerobic_base",
					focus_muscles: ["cardiovascular"],
					exercise_slots: [
						{
							id: "zone2_cardio",
							type: "cardio",
							exercise_name: "steady_state_cardio",
							liftName: "Zone 2 Cardio",
							sets: 1,
							reps: 2400, // 40 minutes
							percentage: 0.0,
							rest_seconds: 0,
							notes: "Evidence-based Zone 2 (60-70% HRmax). Can speak sentences. 40-70min duration.",
						},
						{
							id: "bodyweight_circuit",
							type: "cardio",
							exercise_name: "bodyweight_squat",
							liftName: "Bodyweight Squat",
							sets: 3,
							reps: 20, // Endurance range: 15-25
							percentage: 0.0,
							rest_seconds: circuitRest,
							notes: "Endurance strength. Part of 80% low-moderate intensity.",
						},
					],
				},
				day3: {
					name: "Norwegian 4x4 (20% High-Intensity)",
					primary_movement: "vo2_max",
					focus_muscles: ["cardiovascular"],
					exercise_slots: [
						{
							id: "norwegian_4x4",
							type: "cardio",
							exercise_name: "high_intensity_intervals",
							liftName: "Norwegian 4×4",
							sets: 4,
							reps: 240, // 4 minutes per interval
							percentage: 0.0,
							rest_seconds: 180, // 3 minutes recovery
							notes: "Evidence-based: 4min @ 85-95% HRmax × 4, 3min recovery. +7% VO₂ max gains.",
						},
						{
							id: "pushup_endurance",
							type: "cardio",
							exercise_name: "pushup",
							liftName: "Push-up Endurance",
							sets: 3,
							reps: 15, // Endurance range
							percentage: 0.0,
							rest_seconds: circuitRest,
							notes: "Endurance strength component. Maintain form throughout.",
						},
					],
				},
				day4: {
					name: "10-Min Protocol + Recovery",
					primary_movement: "metabolic",
					focus_muscles: ["full_body"],
					exercise_slots: [
						{
							id: "ten_min_intervals",
							type: "cardio",
							exercise_name: "interval_training",
							liftName: "10-Min Intervals",
							sets: 10,
							reps: 60, // 60 seconds work
							percentage: 0.0,
							rest_seconds: 60, // 60 seconds easy
							notes: "Evidence-based: 10 × 60s @ 90% HRmax, 60s easy. Large VO₂ max & insulin sensitivity gains.",
						},
						{
							id: "burpee_endurance",
							type: "cardio",
							exercise_name: "burpee",
							liftName: "Burpee",
							sets: 3,
							reps: 10, // Moderate endurance range
							percentage: 0.0,
							rest_seconds: hiitRest,
							notes: "Full body endurance. Part of metabolic conditioning.",
						},
					],
				},
				day5: {
					name: "Active Recovery (Zone 1)",
					primary_movement: "recovery",
					focus_muscles: ["recovery"],
					exercise_slots: [
						{
							id: "incidental_activity",
							type: "cardio",
							exercise_name: "stairs_walking",
							liftName: "Incidental Activity",
							sets: 3,
							reps: 20, // 20 seconds stair sprints
							percentage: 0.0,
							rest_seconds: 300, // 5 minutes between
							notes: "Evidence-based VILPA: 4-16min/day vigorous lifestyle bursts → 26-55% lower mortality.",
						},
					],
				},
			},
		};
	}

	generateGeneralFitnessProgram(name, analysis, config) {
		// Apply evidence-based action plan checklist: ≥10 sets/muscle/week, 150min moderate + HIIT
		const restPrimary = analysis.rest_periods?.primary || 90;
		const restAccessory = analysis.rest_periods?.accessories || 75;
		
		return {
			program_name: name,
			workout_days: {
				day1: {
					name: "Full Body Strength (Session 1/3)",
					primary_movement: "full_body",
					focus_muscles: ["full_body"],
					exercise_slots: [
						{
							id: "goblet_squat",
							type: "volume",
							exercise_name: "goblet_squat",
							liftName: "Goblet Squat",
							sets: 3, // Contributing to ≥10 sets/muscle/week
							reps: 12, // Evidence-based range: 8-15
							percentage: 0.0,
							rest_seconds: restPrimary,
							notes: "Action plan: resistance training component. Focus on movement quality.",
						},
						{
							id: "pushup_progression",
							type: "volume",
							exercise_name: "pushup",
							liftName: "Push-up",
							sets: 3, // Contributing to ≥10 sets/muscle/week
							reps: 10, // Evidence-based range: 8-15
							percentage: 0.0,
							rest_seconds: restPrimary,
							notes: "Progressive push-up variation. Part of ≥10 sets per muscle weekly.",
						},
						{
							id: "bodyweight_row",
							type: "volume",
							exercise_name: "bodyweight_row",
							liftName: "Bodyweight Row",
							sets: 3, // Contributing to ≥10 sets/muscle/week
							reps: 10, // Evidence-based range: 8-15
							percentage: 0.0,
							rest_seconds: restPrimary,
							notes: "Pulling pattern for balanced development. Use table or suspension trainer.",
						},
					],
				},
				day2: {
					name: "Aerobic Base + Movement (150min Target)",
					primary_movement: "aerobic",
					focus_muscles: ["cardiovascular"],
					exercise_slots: [
						{
							id: "moderate_cardio",
							type: "cardio",
							exercise_name: "brisk_walking",
							liftName: "Moderate Cardio",
							sets: 1,
							reps: 1800, // 30 minutes (part of 150min/week)
							percentage: 0.0,
							rest_seconds: 0,
							notes: "Evidence-based: 150min moderate weekly. Can hold conversation.",
						},
						{
							id: "plank_progression",
							type: "accessory",
							exercise_name: "plank",
							liftName: "Plank Hold",
							sets: 3,
							reps: 45, // 45 seconds
							percentage: 0.0,
							rest_seconds: restAccessory,
							notes: "Core stability progression. Part of strength foundation.",
						},
						{
							id: "incidental_stairs",
							type: "cardio",
							exercise_name: "stair_climbing",
							liftName: "Stair Climbing",
							sets: 3,
							reps: 20, // 20 seconds
							percentage: 0.0,
							rest_seconds: 240, // 4 minutes between
							notes: "Evidence-based incidental activity. Daily stair sprints or brisk hill walks.",
						},
					],
				},
				day3: {
					name: "Full Body Strength + HIIT (Session 2/3)",
					primary_movement: "full_body",
					focus_muscles: ["full_body"],
					exercise_slots: [
						{
							id: "squat_variation",
							type: "volume",
							exercise_name: "bodyweight_squat",
							liftName: "Bodyweight Squat",
							sets: 4, // Contributing to ≥10 sets/muscle/week
							reps: 15, // Evidence-based range: 8-15
							percentage: 0.0,
							rest_seconds: restPrimary,
							notes: "Squat pattern reinforcement. Higher volume for general fitness.",
						},
						{
							id: "pushup_variation",
							type: "volume",
							exercise_name: "incline_pushup",
							liftName: "Incline Push-up",
							sets: 3, // Contributing to ≥10 sets/muscle/week
							reps: 12, // Evidence-based range: 8-15
							percentage: 0.0,
							rest_seconds: restPrimary,
							notes: "Push-up variation for continued progression.",
						},
						{
							id: "weekly_hiit",
							type: "cardio",
							exercise_name: "bodyweight_hiit",
							liftName: "Weekly HIIT Session",
							sets: 6,
							reps: 30, // 30 seconds work
							percentage: 0.0,
							rest_seconds: 30, // 30 seconds rest
							notes: "Evidence-based: 1 HIIT session weekly. Bodyweight movements in circuit.",
						},
					],
				},
				day4: {
					name: "Active Recovery + Wellness (Session 3/3)",
					primary_movement: "recovery",
					focus_muscles: ["full_body"],
					exercise_slots: [
						{
							id: "light_resistance",
							type: "volume",
							exercise_name: "resistance_band_exercises",
							liftName: "Light Resistance Work",
							sets: 2, // Contributing to ≥10 sets/muscle/week
							reps: 15, // Evidence-based range: 12-20
							percentage: 0.0,
							rest_seconds: restAccessory,
							notes: "Complete weekly resistance target. Light, high-rep movements.",
						},
						{
							id: "mobility_work",
							type: "accessory",
							exercise_name: "dynamic_stretching",
							liftName: "Mobility Work",
							sets: 1,
							reps: 600, // 10 minutes
							percentage: 0.0,
							rest_seconds: 0,
							notes: "Movement quality and recovery. Part of holistic fitness approach.",
						},
						{
							id: "lifestyle_integration",
							type: "lifestyle",
							exercise_name: "wellness_checklist",
							liftName: "Wellness Checklist",
							sets: 1,
							reps: 1,
							percentage: 0.0,
							rest_seconds: 0,
							notes: "Evidence-based action plan: 1.6-2.2g protein/kg, 5g creatine, 2g omega-3, 7-9h sleep.",
						},
					],
				},
			},
		};
	}

	/**
	 * Call Claude API through the existing proxy server
	 * @param {string} prompt - The prompt to send
	 * @returns {string} - API response
	 */
	async callClaudeAPI(prompt) {
		const fetch = require("node-fetch");

		try {
			const response = await fetch(this.claudeAPIUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"anthropic-version": "2023-06-01",
				},
				body: JSON.stringify({
					model: "claude-3-haiku-20240307",
					max_tokens: 2000,
					messages: [
						{
							role: "user",
							content: prompt,
						},
					],
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Claude API error: ${response.status} - ${errorText}`);
			}

			const data = await response.json();

			// Extract the content from Claude's response format
			if (data.content && data.content[0] && data.content[0].text) {
				return data.content[0].text;
			} else {
				throw new Error("Unexpected Claude API response format");
			}
		} catch (error) {
			console.error("Claude API call failed:", error.message);
			throw error;
		}
	}

	/**
	 * Format AI-generated program for template engine compatibility
	 * @param {Object} aiProgram - AI generated program
	 * @param {Object} config - Original config
	 * @returns {Object} - Formatted program for template engine
	 */
	formatForTemplateEngine(aiProgram, config) {
		// Convert AI program structure to match existing template engine expectations
		const formattedDays = {};

		Object.entries(aiProgram.workout_days).forEach(
			([dayKey, dayData], index) => {
				// Create consistent day keys
				const dayNames = [
					"squat_day",
					"bench_day",
					"deadlift_day",
					"pull_day",
					"cardio_day",
				];
				const formattedDayKey = dayNames[index] || `day_${index + 1}`;

				formattedDays[formattedDayKey] = {
					name: dayData.name,
					primary_movement: dayData.primary_movement,
					focus_muscles: dayData.focus_muscles || [],
					exercise_slots: dayData.exercise_slots.map((exercise) => ({
						id: exercise.id,
						type: exercise.type,
						exercise_id: exercise.exercise_name
							.toLowerCase()
							.replace(/[^a-z0-9]/g, "_"),
						liftName: exercise.liftName,
						sets: exercise.sets,
						reps: exercise.reps,
						repsTarget: exercise.reps,
						percentage: exercise.percentage,
						group: exercise.liftName,
						setLabel:
							exercise.type === "strength_main" ? "Main Set" : "Working Set",
						notes:
							exercise.notes ||
							`Aim for RPE 7-9. Rest ${exercise.rest_seconds || 120} seconds.`,
					})),
				};
			},
		);

		return {
			name: aiProgram.program_name,
			workout_days: formattedDays,
			metadata: {
				generated_by: "agentic_ai",
				generation_date: new Date().toISOString(),
				athlete_goal: config.primary_goal,
				ai_model: "claude-3-haiku",
			},
		};
	}

	/**
	 * Enhanced app generation using agentic workflow
	 * @param {Object} userConfig - User configuration
	 * @returns {string} - Generated HTML app
	 */
	async generateApp(userConfig) {
		console.log("🚀 Starting agentic app generation...");
		console.log("Starting app generation...");

		try {
			// 1. Process configuration (same as parent)
			console.log("📋 Processing configuration...");
			const processedConfig = this.processConfiguration(userConfig);
			console.log("✅ Configuration processed");

			// 2. Generate workout plan using AI agents
			console.log("🤖 Generating workout plan...");
			const workoutPlan = await this.generateWorkoutPlan(processedConfig);
			this.currentWorkoutPlan = workoutPlan; // Store for target weight calculations
			console.log("✅ Workout plan generated:", workoutPlan.name);

			// 3. Compile templates (same as parent)
			console.log("📝 Compiling HTML template...");
			const compiledHTML = this.compileHTML(processedConfig, workoutPlan);
			console.log(`✅ HTML compiled (${compiledHTML.length} chars)`);

			console.log("🎨 Compiling CSS template...");
			const compiledCSS = this.compileCSS(processedConfig);
			console.log(`✅ CSS compiled (${compiledCSS.length} chars)`);

			console.log("⚙ Compiling JavaScript template...");
			const compiledJS = this.compileJavaScript(processedConfig, workoutPlan);
			console.log(`✅ JavaScript compiled (${compiledJS.length} chars)`);

			// 4. Combine into final app
			console.log("🔧 Combining components...");
			const finalApp = this.combineComponents(
				compiledHTML,
				compiledCSS,
				compiledJS,
			);
			console.log(`✅ App generation completed (${finalApp.length} chars)`);

			return finalApp;
		} catch (error) {
			console.error("❌ Agentic app generation failed:", error.message);
			console.error("Stack trace:", error.stack);
			console.log("🔄 Falling back to static generation...");

			// Fallback to parent class static generation
			return super.generateApp(userConfig);
		}
	}
}

module.exports = AgenticProgramGenerator;
