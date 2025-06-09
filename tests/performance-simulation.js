/**
 * Performance Simulation - Generate realistic performance data for testing adaptive AI
 * Creates various athlete scenarios and performance patterns for comprehensive testing
 */

class PerformanceSimulation {
    constructor() {
        this.athleteProfiles = this.initializeAthleteProfiles();
        this.exerciseDatabase = this.initializeExerciseDatabase();
        this.environmentalFactors = this.initializeEnvironmentalFactors();
    }

    /**
     * Initialize different athlete profiles for simulation
     */
    initializeAthleteProfiles() {
        return {
            beginner_strength: {
                experience: 'beginner',
                focus: 'strength',
                baseStats: { squat: 80, bench: 60, deadlift: 100 },
                progressionRate: { strength: 0.025, volume: 0.10 },
                fatigueResistance: 0.6,
                recoveryRate: 0.8,
                consistencyFactor: 0.75,
                rpeCalibration: 1.2, // Tends to underestimate RPE
                motivationVariability: 0.3
            },
            intermediate_hypertrophy: {
                experience: 'intermediate',
                focus: 'hypertrophy',
                baseStats: { squat: 120, bench: 90, deadlift: 140 },
                progressionRate: { strength: 0.01, volume: 0.05 },
                fatigueResistance: 0.8,
                recoveryRate: 1.0,
                consistencyFactor: 0.85,
                rpeCalibration: 1.0,
                motivationVariability: 0.2
            },
            advanced_powerlifter: {
                experience: 'advanced',
                focus: 'strength',
                baseStats: { squat: 200, bench: 150, deadlift: 240 },
                progressionRate: { strength: 0.005, volume: 0.025 },
                fatigueResistance: 0.9,
                recoveryRate: 0.7,
                consistencyFactor: 0.95,
                rpeCalibration: 0.9, // Tends to overestimate RPE
                motivationVariability: 0.1
            },
            endurance_athlete: {
                experience: 'intermediate',
                focus: 'endurance',
                baseStats: { vo2max: 55, threshold: 300, distance: 42.2 },
                progressionRate: { aerobic: 0.03, volume: 0.08 },
                fatigueResistance: 0.85,
                recoveryRate: 1.1,
                consistencyFactor: 0.9,
                rpeCalibration: 1.1,
                motivationVariability: 0.15
            },
            general_fitness: {
                experience: 'beginner',
                focus: 'general',
                baseStats: { strength: 70, cardio: 40, flexibility: 60 },
                progressionRate: { overall: 0.06, adherence: 0.75 },
                fatigueResistance: 0.7,
                recoveryRate: 0.9,
                consistencyFactor: 0.65,
                rpeCalibration: 1.3,
                motivationVariability: 0.4
            }
        };
    }

    /**
     * Initialize exercise database for simulation
     */
    initializeExerciseDatabase() {
        return {
            strength: {
                main_lifts: [
                    { name: 'Squat', category: 'main', muscle_groups: ['legs', 'core'], difficulty: 0.9 },
                    { name: 'Bench Press', category: 'main', muscle_groups: ['chest', 'shoulders', 'triceps'], difficulty: 0.8 },
                    { name: 'Deadlift', category: 'main', muscle_groups: ['back', 'legs', 'core'], difficulty: 1.0 }
                ],
                accessories: [
                    { name: 'Overhead Press', category: 'accessory', muscle_groups: ['shoulders', 'triceps'], difficulty: 0.7 },
                    { name: 'Rows', category: 'accessory', muscle_groups: ['back', 'biceps'], difficulty: 0.6 },
                    { name: 'Pull-ups', category: 'accessory', muscle_groups: ['back', 'biceps'], difficulty: 0.8 }
                ]
            },
            hypertrophy: {
                primary: [
                    { name: 'Incline DB Press', category: 'primary', muscle_groups: ['chest', 'shoulders'], difficulty: 0.7 },
                    { name: 'Romanian Deadlift', category: 'primary', muscle_groups: ['hamstrings', 'glutes'], difficulty: 0.8 },
                    { name: 'Bulgarian Split Squat', category: 'primary', muscle_groups: ['legs'], difficulty: 0.9 }
                ],
                isolation: [
                    { name: 'Lateral Raises', category: 'isolation', muscle_groups: ['shoulders'], difficulty: 0.4 },
                    { name: 'Bicep Curls', category: 'isolation', muscle_groups: ['biceps'], difficulty: 0.3 },
                    { name: 'Tricep Extensions', category: 'isolation', muscle_groups: ['triceps'], difficulty: 0.4 }
                ]
            },
            endurance: {
                aerobic: [
                    { name: 'Easy Run', category: 'aerobic', intensity: 0.65, difficulty: 0.3 },
                    { name: 'Tempo Run', category: 'aerobic', intensity: 0.85, difficulty: 0.7 },
                    { name: 'Long Run', category: 'aerobic', intensity: 0.70, difficulty: 0.6 }
                ],
                anaerobic: [
                    { name: 'VO2 Max Intervals', category: 'anaerobic', intensity: 0.95, difficulty: 0.9 },
                    { name: 'Threshold Intervals', category: 'anaerobic', intensity: 0.88, difficulty: 0.8 },
                    { name: 'Neuromuscular Power', category: 'anaerobic', intensity: 1.0, difficulty: 1.0 }
                ]
            }
        };
    }

    /**
     * Initialize environmental factors that affect performance
     */
    initializeEnvironmentalFactors() {
        return {
            sleep_patterns: {
                excellent: { hours: [8, 9], quality: [8, 10], consistency: 0.9 },
                good: { hours: [7, 8], quality: [6, 8], consistency: 0.8 },
                fair: { hours: [6, 7], quality: [5, 7], consistency: 0.6 },
                poor: { hours: [4, 6], quality: [3, 5], consistency: 0.4 }
            },
            stress_levels: {
                low: { work: [1, 3], personal: [1, 2], training_impact: 0.1 },
                moderate: { work: [3, 6], personal: [2, 4], training_impact: 0.25 },
                high: { work: [6, 8], personal: [4, 7], training_impact: 0.4 },
                very_high: { work: [8, 10], personal: [7, 10], training_impact: 0.6 }
            },
            nutrition_quality: {
                excellent: { calories: 1.0, protein: 1.2, recovery_bonus: 0.15 },
                good: { calories: 0.95, protein: 1.0, recovery_bonus: 0.05 },
                fair: { calories: 0.9, protein: 0.8, recovery_bonus: -0.05 },
                poor: { calories: 0.8, protein: 0.6, recovery_bonus: -0.15 }
            }
        };
    }

    /**
     * Generate complete performance scenario for testing
     * @param {string} profileType - Type of athlete profile
     * @param {number} weeks - Number of weeks to simulate
     * @param {Object} options - Additional simulation options
     */
    generatePerformanceScenario(profileType, weeks = 12, options = {}) {
        const profile = this.athleteProfiles[profileType];
        if (!profile) {
            throw new Error(`Unknown athlete profile: ${profileType}`);
        }

        const scenario = {
            profile: profile,
            timeline: weeks,
            sessions: [],
            adaptations: [],
            environmentalChanges: [],
            options: options
        };

        // Generate weekly progression
        for (let week = 1; week <= weeks; week++) {
            const weeklyData = this.generateWeeklyData(profile, week, scenario);
            scenario.sessions.push(...weeklyData.sessions);
            
            if (weeklyData.adaptation) {
                scenario.adaptations.push(weeklyData.adaptation);
            }
        }

        return scenario;
    }

    /**
     * Generate weekly training data
     */
    generateWeeklyData(profile, week, scenario) {
        const weekData = {
            week: week,
            sessions: [],
            adaptation: null
        };

        // Determine training frequency based on profile
        const frequency = this.getTrainingFrequency(profile);
        
        // Generate environmental context for the week
        const environment = this.generateWeeklyEnvironment(week, scenario);

        // Generate each training session
        for (let session = 1; session <= frequency; session++) {
            const sessionData = this.generateTrainingSession(profile, week, session, environment);
            weekData.sessions.push(sessionData);
        }

        // Check for adaptation triggers
        const adaptationCheck = this.checkAdaptationTriggers(profile, weekData.sessions, scenario);
        if (adaptationCheck.needed) {
            weekData.adaptation = adaptationCheck;
        }

        return weekData;
    }

    /**
     * Generate individual training session
     */
    generateTrainingSession(profile, week, sessionNumber, environment) {
        const session = {
            date: this.generateSessionDate(week, sessionNumber),
            week: week,
            sessionNumber: sessionNumber,
            exercises: [],
            subjective: this.generateSubjectiveData(profile, environment),
            environmental: environment,
            metrics: {}
        };

        // Select exercises based on profile focus
        const exercises = this.selectExercises(profile);
        
        // Generate performance for each exercise
        exercises.forEach(exercise => {
            const exerciseData = this.generateExercisePerformance(
                profile, exercise, week, environment, session.subjective
            );
            session.exercises.push(exerciseData);
        });

        // Calculate session metrics
        session.metrics = this.calculateSessionMetrics(session);

        return session;
    }

    /**
     * Generate exercise performance data
     */
    generateExercisePerformance(profile, exercise, week, environment, subjective) {
        const baseProgression = this.calculateBaseProgression(profile, exercise, week);
        const environmentalModifier = this.calculateEnvironmentalModifier(environment, subjective);
        const variabilityFactor = this.generateVariability(profile);

        const exerciseData = {
            name: exercise.name,
            category: exercise.category,
            isMainLift: exercise.category === 'main',
            sets: [],
            totalVolume: 0,
            avgRPE: 0,
            maxWeight: 0,
            estimated1RM: 0
        };

        // Generate sets based on exercise type
        const setCount = this.getSetCount(profile, exercise);
        const repRange = this.getRepRange(profile, exercise);
        
        for (let set = 1; set <= setCount; set++) {
            const setData = this.generateSetData(
                profile, exercise, set, baseProgression, 
                environmentalModifier, variabilityFactor, repRange
            );
            exerciseData.sets.push(setData);
        }

        // Calculate exercise-level metrics
        this.calculateExerciseMetrics(exerciseData);

        return exerciseData;
    }

    /**
     * Generate individual set data
     */
    generateSetData(profile, exercise, setNumber, progression, envModifier, variability, repRange) {
        // Calculate base weight and reps
        const baseWeight = this.calculateBaseWeight(profile, exercise, progression);
        const targetReps = this.generateTargetReps(repRange);
        
        // Apply modifiers
        const actualWeight = Math.round(baseWeight * envModifier * variability.weight);
        const actualReps = Math.max(1, Math.round(targetReps * variability.reps));
        
        // Calculate RPE based on fatigue accumulation
        const fatigueMultiplier = 1 + (setNumber - 1) * 0.1; // Fatigue increases with sets
        const baseRPE = this.calculateBaseRPE(profile, exercise, setNumber);
        const actualRPE = Math.min(10, Math.max(1, 
            baseRPE * fatigueMultiplier * envModifier * profile.rpeCalibration
        ));

        // Determine completion based on RPE and motivation
        const completed = this.determineSetCompletion(actualRPE, profile, envModifier);

        return {
            weight: actualWeight,
            reps: completed ? actualReps : Math.max(1, actualReps - Math.floor(Math.random() * 3)),
            rpe: Math.round(actualRPE * 2) / 2, // Round to nearest 0.5
            volume: actualWeight * actualReps,
            completed: completed,
            estimated1RM: this.calculateEstimated1RM(actualWeight, actualReps, actualRPE)
        };
    }

    /**
     * Generate subjective wellness data
     */
    generateSubjectiveData(profile, environment) {
        const sleepScore = this.generateSleepScore(environment.sleep);
        const stressScore = this.generateStressScore(environment.stress);
        const nutritionScore = this.generateNutritionScore(environment.nutrition);
        
        // Generate correlated subjective measures
        const energyLevel = this.correlateMeasure(sleepScore, 0.7) * (1 - stressScore * 0.3);
        const motivation = this.correlateMeasure(energyLevel, 0.6) * profile.consistencyFactor;
        const soreness = this.generateSoreness(profile, environment);

        return {
            energyLevel: Math.max(1, Math.min(10, Math.round(energyLevel * 10))),
            motivation: Math.max(1, Math.min(10, Math.round(motivation * 10))),
            sleepQuality: Math.max(1, Math.min(10, Math.round(sleepScore * 10))),
            stress: Math.max(1, Math.min(10, Math.round(stressScore * 10))),
            soreness: Math.max(1, Math.min(10, Math.round(soreness * 10)))
        };
    }

    /**
     * Generate fatigue progression scenarios
     */
    generateFatigueProgression(profileType, scenario = 'acute') {
        const profile = this.athleteProfiles[profileType];
        const sessions = [];

        switch (scenario) {
            case 'acute':
                return this.generateAcuteFatigueScenario(profile);
            case 'chronic':
                return this.generateChronicFatigueScenario(profile);
            case 'overreaching':
                return this.generateOverreachingScenario(profile);
            case 'recovery':
                return this.generateRecoveryScenario(profile);
            default:
                throw new Error(`Unknown fatigue scenario: ${scenario}`);
        }
    }

    /**
     * Generate acute fatigue scenario (single bad session)
     */
    generateAcuteFatigueScenario(profile) {
        const sessions = [];
        
        // Normal baseline sessions
        for (let i = 0; i < 3; i++) {
            sessions.push(this.generateNormalSession(profile, i + 1));
        }

        // Acute fatigue session
        const fatigueSession = this.generateNormalSession(profile, 4);
        fatigueSession.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
                set.rpe = Math.min(10, set.rpe + 1.5); // Significantly higher RPE
                set.completed = set.rpe < 9.5; // More incomplete sets
                if (!set.completed) {
                    set.reps = Math.max(1, set.reps - 2);
                    set.volume = set.weight * set.reps;
                }
            });
            this.calculateExerciseMetrics(exercise);
        });
        
        fatigueSession.subjective = {
            energyLevel: 3,
            motivation: 4,
            sleepQuality: 4,
            stress: 8,
            soreness: 7
        };

        sessions.push(fatigueSession);

        return sessions;
    }

    /**
     * Generate chronic fatigue scenario (progressive decline)
     */
    generateChronicFatigueScenario(profile) {
        const sessions = [];
        
        for (let week = 1; week <= 4; week++) {
            const frequency = this.getTrainingFrequency(profile);
            
            for (let session = 1; session <= frequency; session++) {
                const sessionData = this.generateNormalSession(profile, (week - 1) * frequency + session);
                
                // Progressive fatigue accumulation
                const fatigueAccumulation = (week - 1) * 0.3;
                
                sessionData.exercises.forEach(exercise => {
                    exercise.sets.forEach(set => {
                        set.rpe = Math.min(10, set.rpe + fatigueAccumulation);
                        set.weight = Math.round(set.weight * (1 - fatigueAccumulation * 0.1));
                        set.volume = set.weight * set.reps;
                    });
                    this.calculateExerciseMetrics(exercise);
                });

                // Declining subjective scores
                sessionData.subjective = {
                    energyLevel: Math.max(1, 8 - week),
                    motivation: Math.max(1, 8 - week),
                    sleepQuality: Math.max(1, 7 - week),
                    stress: Math.min(10, 3 + week),
                    soreness: Math.min(10, 3 + week)
                };

                sessions.push(sessionData);
            }
        }

        return sessions;
    }

    /**
     * Generate overreaching scenario (planned intensification)
     */
    generateOverreachingScenario(profile) {
        const sessions = [];
        
        // 2 weeks of intensified training
        for (let week = 1; week <= 2; week++) {
            const frequency = this.getTrainingFrequency(profile) + 1; // Extra session
            
            for (let session = 1; session <= frequency; session++) {
                const sessionData = this.generateNormalSession(profile, (week - 1) * frequency + session);
                
                // Intensification: higher volume and intensity
                sessionData.exercises.forEach(exercise => {
                    // Add extra sets
                    const extraSets = Math.floor(exercise.sets.length * 0.5);
                    for (let i = 0; i < extraSets; i++) {
                        const lastSet = exercise.sets[exercise.sets.length - 1];
                        const extraSet = { ...lastSet };
                        extraSet.rpe = Math.min(10, lastSet.rpe + 0.5);
                        exercise.sets.push(extraSet);
                    }
                    
                    this.calculateExerciseMetrics(exercise);
                });

                // Progressive fatigue in subjective measures
                sessionData.subjective = {
                    energyLevel: Math.max(1, 7 - session),
                    motivation: Math.max(1, 8 - session * 0.5),
                    sleepQuality: Math.max(1, 6 - session * 0.3),
                    stress: Math.min(10, 4 + session * 0.5),
                    soreness: Math.min(10, 4 + session * 0.4)
                };

                sessions.push(sessionData);
            }
        }

        return sessions;
    }

    /**
     * Generate recovery scenario (deload week)
     */
    generateRecoveryScenario(profile) {
        const sessions = [];
        const frequency = Math.max(2, this.getTrainingFrequency(profile) - 1); // Reduced frequency
        
        for (let session = 1; session <= frequency; session++) {
            const sessionData = this.generateNormalSession(profile, session);
            
            // Deload modifications: reduced volume and intensity
            sessionData.exercises.forEach(exercise => {
                // Reduce sets by 40%
                const reducedSetCount = Math.max(1, Math.floor(exercise.sets.length * 0.6));
                exercise.sets = exercise.sets.slice(0, reducedSetCount);
                
                // Reduce intensity by 15%
                exercise.sets.forEach(set => {
                    set.weight = Math.round(set.weight * 0.85);
                    set.rpe = Math.max(1, set.rpe - 1.5);
                    set.volume = set.weight * set.reps;
                });
                
                this.calculateExerciseMetrics(exercise);
            });

            // Improving subjective measures
            sessionData.subjective = {
                energyLevel: Math.min(10, 6 + session),
                motivation: Math.min(10, 7 + session * 0.5),
                sleepQuality: Math.min(10, 7 + session * 0.5),
                stress: Math.max(1, 5 - session * 0.5),
                soreness: Math.max(1, 4 - session * 0.3)
            };

            sessions.push(sessionData);
        }

        return sessions;
    }

    /**
     * Helper methods for calculations
     */
    calculateBaseProgression(profile, exercise, week) {
        const weeklyRate = profile.progressionRate.strength || profile.progressionRate.overall || 0.01;
        return 1 + (weeklyRate * (week - 1));
    }

    calculateEnvironmentalModifier(environment, subjective) {
        const sleepFactor = environment.sleep.quality || 0.8;
        const stressFactor = 1 - (environment.stress.training_impact || 0.2);
        const nutritionFactor = environment.nutrition.recovery_bonus || 0;
        
        return sleepFactor * stressFactor * (1 + nutritionFactor);
    }

    generateVariability(profile) {
        const motivationVariance = profile.motivationVariability || 0.2;
        return {
            weight: 0.95 + Math.random() * 0.1, // 95-105% of planned
            reps: 0.9 + Math.random() * 0.2, // 90-110% of planned
            motivation: 1 - motivationVariance + Math.random() * motivationVariance * 2
        };
    }

    calculateBaseWeight(profile, exercise, progression) {
        const baseStat = profile.baseStats[exercise.name.toLowerCase()] || 
                        profile.baseStats.squat || 
                        profile.baseStats.strength || 
                        100;
        return baseStat * progression;
    }

    generateTargetReps(repRange) {
        return repRange.min + Math.floor(Math.random() * (repRange.max - repRange.min + 1));
    }

    calculateBaseRPE(profile, exercise, setNumber) {
        const baseDifficulty = exercise.difficulty || 0.7;
        const setFatigue = (setNumber - 1) * 0.3;
        return 6 + baseDifficulty * 2 + setFatigue;
    }

    determineSetCompletion(rpe, profile, envModifier) {
        const completionThreshold = 9.5;
        const motivationFactor = profile.consistencyFactor * envModifier;
        return rpe < completionThreshold || (Math.random() < motivationFactor);
    }

    calculateEstimated1RM(weight, reps, rpe) {
        if (weight <= 0 || reps <= 0 || rpe <= 0) return 0;
        
        const base1RM = weight * (1 + reps / 30);
        const rpeAdjustments = {
            10: 1.00, 9.5: 1.025, 9: 1.05, 8.5: 1.075, 8: 1.10,
            7.5: 1.125, 7: 1.15, 6.5: 1.175, 6: 1.20
        };
        
        const adjustment = rpeAdjustments[rpe] || 1.0;
        return Math.round(base1RM * adjustment);
    }

    calculateExerciseMetrics(exercise) {
        const completedSets = exercise.sets.filter(set => set.completed);
        
        if (completedSets.length > 0) {
            exercise.totalVolume = completedSets.reduce((sum, set) => sum + set.volume, 0);
            exercise.avgRPE = completedSets.reduce((sum, set) => sum + set.rpe, 0) / completedSets.length;
            exercise.maxWeight = Math.max(...completedSets.map(set => set.weight));
            exercise.estimated1RM = Math.max(...completedSets.map(set => set.estimated1RM || 0));
        }
    }

    calculateSessionMetrics(session) {
        const exercises = session.exercises;
        
        return {
            totalVolume: exercises.reduce((sum, ex) => sum + ex.totalVolume, 0),
            avgRPE: this.calculateWeightedAverageRPE(exercises),
            totalSets: exercises.reduce((sum, ex) => sum + ex.sets.length, 0),
            completedSets: exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0),
            adherenceScore: this.calculateAdherenceScore(exercises),
            maxEstimated1RM: Math.max(...exercises.map(ex => ex.estimated1RM))
        };
    }

    calculateWeightedAverageRPE(exercises) {
        let totalWeight = 0;
        let weightedRPESum = 0;

        exercises.forEach(exercise => {
            if (exercise.avgRPE > 0 && exercise.totalVolume > 0) {
                totalWeight += exercise.totalVolume;
                weightedRPESum += exercise.avgRPE * exercise.totalVolume;
            }
        });

        return totalWeight > 0 ? weightedRPESum / totalWeight : 0;
    }

    calculateAdherenceScore(exercises) {
        let plannedSets = 0;
        let completedSets = 0;

        exercises.forEach(exercise => {
            plannedSets += exercise.sets.length;
            completedSets += exercise.sets.filter(set => set.completed).length;
        });

        return plannedSets > 0 ? completedSets / plannedSets : 0;
    }

    // Additional helper methods...
    getTrainingFrequency(profile) {
        const frequencies = {
            strength: 4,
            hypertrophy: 5,
            endurance: 6,
            general: 3
        };
        return frequencies[profile.focus] || 4;
    }

    getSetCount(profile, exercise) {
        const setCounts = {
            main: [3, 5],
            primary: [3, 4],
            accessory: [2, 4],
            isolation: [2, 3]
        };
        const range = setCounts[exercise.category] || [3, 4];
        return range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));
    }

    getRepRange(profile, exercise) {
        const repRanges = {
            strength: { main: {min: 1, max: 5}, accessory: {min: 3, max: 8} },
            hypertrophy: { primary: {min: 6, max: 12}, isolation: {min: 8, max: 15} },
            endurance: { aerobic: {min: 1, max: 1}, anaerobic: {min: 1, max: 1} },
            general: { main: {min: 5, max: 10}, accessory: {min: 8, max: 12} }
        };
        
        const ranges = repRanges[profile.focus] || repRanges.general;
        return ranges[exercise.category] || ranges.main || {min: 5, max: 10};
    }

    selectExercises(profile) {
        const exerciseDb = this.exerciseDatabase[profile.focus] || this.exerciseDatabase.strength;
        const exercises = [];
        
        // Select exercises based on focus
        Object.keys(exerciseDb).forEach(category => {
            const categoryExercises = exerciseDb[category];
            const count = category === 'main' || category === 'primary' ? 
                Math.min(categoryExercises.length, 2) : 
                Math.min(categoryExercises.length, 1);
            
            for (let i = 0; i < count; i++) {
                if (categoryExercises[i]) {
                    exercises.push(categoryExercises[i]);
                }
            }
        });

        return exercises;
    }

    generateWeeklyEnvironment(week, scenario) {
        // Simulate environmental changes over time
        const stressCycle = Math.sin(week * 0.5) * 0.3 + 0.5; // Cyclical stress
        const sleepConsistency = 0.8 + Math.random() * 0.2; // Random sleep variation
        
        return {
            sleep: {
                hours: 7 + Math.random() * 2,
                quality: sleepConsistency,
                consistency: 0.8
            },
            stress: {
                work: stressCycle * 6 + 2,
                personal: Math.random() * 4 + 1,
                training_impact: stressCycle * 0.3
            },
            nutrition: {
                calories: 0.9 + Math.random() * 0.2,
                protein: 0.8 + Math.random() * 0.4,
                recovery_bonus: (Math.random() - 0.5) * 0.2
            }
        };
    }

    generateSessionDate(week, session) {
        const baseDate = new Date('2024-01-01');
        const daysFromStart = (week - 1) * 7 + (session - 1) * 2; // Every other day
        baseDate.setDate(baseDate.getDate() + daysFromStart);
        return baseDate.toISOString().split('T')[0];
    }

    generateNormalSession(profile, sessionNumber) {
        const environment = this.generateWeeklyEnvironment(1, {});
        const subjective = this.generateSubjectiveData(profile, environment);
        
        return {
            date: this.generateSessionDate(1, sessionNumber),
            week: 1,
            sessionNumber: sessionNumber,
            exercises: [],
            subjective: subjective,
            environmental: environment,
            metrics: {}
        };
    }

    checkAdaptationTriggers(profile, sessions, scenario) {
        // Simple adaptation trigger logic for simulation
        const avgRPE = sessions.reduce((sum, s) => sum + (s.metrics.avgRPE || 0), 0) / sessions.length;
        
        if (avgRPE > 9.0) {
            return { needed: true, type: 'deload', reason: 'High RPE detected' };
        } else if (avgRPE < 7.0) {
            return { needed: true, type: 'intensification', reason: 'Low RPE opportunity' };
        }
        
        return { needed: false };
    }

    // Utility methods for subjective data generation
    generateSleepScore(sleepEnv) {
        return (sleepEnv.hours / 9) * (sleepEnv.quality / 10) * sleepEnv.consistency;
    }

    generateStressScore(stressEnv) {
        return (stressEnv.work + stressEnv.personal) / 20; // Normalize to 0-1
    }

    generateNutritionScore(nutritionEnv) {
        return (nutritionEnv.calories + nutritionEnv.protein) / 2;
    }

    correlateMeasure(baseMeasure, correlation) {
        const randomComponent = Math.random();
        return baseMeasure * correlation + randomComponent * (1 - correlation);
    }

    generateSoreness(profile, environment) {
        const baseSoreness = 0.3 + Math.random() * 0.4;
        const recoveryModifier = environment.nutrition.recovery_bonus || 0;
        return Math.max(0.1, Math.min(1.0, baseSoreness - recoveryModifier));
    }
}

module.exports = PerformanceSimulation;

// Example usage and testing
if (require.main === module) {
    const simulator = new PerformanceSimulation();
    
    console.log('🎯 Performance Simulation Examples:');
    
    // Generate different scenarios
    const scenarios = [
        { profile: 'beginner_strength', weeks: 4, name: 'Beginner Strength Progression' },
        { profile: 'advanced_powerlifter', weeks: 2, name: 'Advanced Powerlifter Intensification' },
        { profile: 'endurance_athlete', weeks: 3, name: 'Endurance Base Building' }
    ];
    
    scenarios.forEach(scenario => {
        console.log(`\n📊 ${scenario.name}:`);
        const data = simulator.generatePerformanceScenario(scenario.profile, scenario.weeks);
        console.log(`  Sessions generated: ${data.sessions.length}`);
        console.log(`  Adaptations triggered: ${data.adaptations.length}`);
        console.log(`  Profile: ${data.profile.experience} ${data.profile.focus}`);
    });
    
    // Generate fatigue scenarios
    console.log('\n😴 Fatigue Scenarios:');
    const fatigueTypes = ['acute', 'chronic', 'overreaching', 'recovery'];
    fatigueTypes.forEach(type => {
        const data = simulator.generateFatigueProgression('intermediate_hypertrophy', type);
        console.log(`  ${type}: ${data.length} sessions generated`);
    });
}