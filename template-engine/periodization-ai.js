/**
 * Periodization AI - Long-term training cycle planning and optimization
 * Implements evidence-based periodization models for macrocycle, mesocycle, and microcycle planning
 */

const fs = require('fs');
const path = require('path');

class PeriodizationAI {
    constructor(trainingType = 'strength') {
        this.trainingType = trainingType;
        this.periodizationModels = this.loadPeriodizationModels();
        this.currentMacrocycle = null;
        this.plannedPhases = [];
        this.adaptationHistory = [];
        this.competitionSchedule = [];
        
        this.config = {
            macrocycleLength: 16, // weeks
            mesocycleLength: 4,   // weeks
            microcycleLength: 1,  // week
            adaptationWindow: 3,  // weeks to assess adaptation
            deloadFrequency: 4    // every 4th week
        };
    }

    /**
     * Load evidence-based periodization models
     */
    loadPeriodizationModels() {
        return {
            linear: {
                name: 'Linear Periodization',
                description: 'Progressive increase in intensity with decreased volume',
                phases: [
                    { name: 'anatomical_adaptation', weeks: 4, volume: 1.0, intensity: 0.65 },
                    { name: 'hypertrophy', weeks: 4, volume: 1.2, intensity: 0.75 },
                    { name: 'strength', weeks: 4, volume: 0.8, intensity: 0.85 },
                    { name: 'power_peak', weeks: 4, volume: 0.6, intensity: 0.95 }
                ],
                research: 'Bompa & Haff (2009) - Classic model for strength sports',
                bestFor: ['powerlifting', 'weightlifting', 'track_field']
            },
            block: {
                name: 'Block Periodization',
                description: 'Sequential development of specific abilities',
                phases: [
                    { name: 'accumulation', weeks: 3, volume: 1.3, intensity: 0.70, focus: 'volume' },
                    { name: 'intensification', weeks: 2, volume: 0.9, intensity: 0.90, focus: 'intensity' },
                    { name: 'realization', weeks: 1, volume: 0.5, intensity: 0.95, focus: 'peak' },
                    { name: 'restoration', weeks: 1, volume: 0.4, intensity: 0.60, focus: 'recovery' }
                ],
                research: 'Issurin (2010) - Concentrated training loads',
                bestFor: ['powerlifting', 'strength_sports', 'advanced_athletes']
            },
            conjugate: {
                name: 'Conjugate Method',
                description: 'Concurrent training of multiple abilities',
                phases: [
                    { name: 'max_effort', weeks: 16, volume: 0.8, intensity: 0.90, focus: 'strength' },
                    { name: 'dynamic_effort', weeks: 16, volume: 1.0, intensity: 0.60, focus: 'speed' },
                    { name: 'repetition_effort', weeks: 16, volume: 1.2, intensity: 0.75, focus: 'hypertrophy' }
                ],
                research: 'Simmons (2007) - Westside Barbell methods',
                bestFor: ['powerlifting', 'strength_power_sports']
            },
            undulating: {
                name: 'Daily Undulating Periodization',
                description: 'Frequent variation in training variables',
                phases: [
                    { name: 'strength_day', weeks: 16, volume: 0.7, intensity: 0.85, focus: 'strength' },
                    { name: 'hypertrophy_day', weeks: 16, volume: 1.2, intensity: 0.70, focus: 'hypertrophy' },
                    { name: 'power_day', weeks: 16, volume: 0.6, intensity: 0.55, focus: 'power' }
                ],
                research: 'Rhea et al. (2002) - Superior to linear for strength',
                bestFor: ['bodybuilding', 'general_strength', 'intermediate_athletes']
            },
            polarized: {
                name: 'Polarized Training',
                description: '80/20 intensity distribution for endurance',
                phases: [
                    { name: 'base_building', weeks: 8, volume: 1.2, intensity: 0.65, focus: 'aerobic_base' },
                    { name: 'build', weeks: 4, volume: 1.0, intensity: 0.75, focus: 'threshold' },
                    { name: 'peak', weeks: 3, volume: 0.7, intensity: 0.85, focus: 'vo2max' },
                    { name: 'taper', weeks: 1, volume: 0.4, intensity: 0.60, focus: 'recovery' }
                ],
                research: 'Seiler (2010) - Elite endurance athlete analysis',
                bestFor: ['endurance_sports', 'cycling', 'running', 'triathlon']
            }
        };
    }

    /**
     * Create optimal periodization plan based on athlete profile and goals
     * @param {Object} athleteProfile - Comprehensive athlete information
     * @param {Object} goalParameters - Training goals and competition schedule
     * @returns {Object} Complete periodization plan
     */
    createPeriodizationPlan(athleteProfile, goalParameters) {
        console.log('🏗️ Creating periodization plan for:', athleteProfile.name);

        // Analyze athlete profile for optimal model selection
        const optimalModel = this.selectOptimalModel(athleteProfile, goalParameters);
        
        // Create macrocycle structure
        const macrocycle = this.buildMacrocycle(optimalModel, athleteProfile, goalParameters);
        
        // Generate mesocycles within macrocycle
        const mesocycles = this.generateMesocycles(macrocycle, athleteProfile);
        
        // Create detailed microcycle plans
        const microcycles = this.generateMicrocycles(mesocycles, athleteProfile);
        
        // Add competition timing and tapering
        if (goalParameters.competitions) {
            this.integrateCompetitionTiming(microcycles, goalParameters.competitions);
        }

        const plan = {
            athleteId: athleteProfile.id,
            model: optimalModel,
            macrocycle: macrocycle,
            mesocycles: mesocycles,
            microcycles: microcycles,
            totalWeeks: macrocycle.totalWeeks,
            startDate: goalParameters.startDate || new Date(),
            goals: goalParameters.goals,
            adaptationCheckpoints: this.createAdaptationCheckpoints(microcycles),
            contingencyPlans: this.createContingencyPlans(optimalModel)
        };

        this.currentMacrocycle = plan;
        return plan;
    }

    /**
     * Select optimal periodization model based on athlete profile
     */
    selectOptimalModel(athleteProfile, goalParameters) {
        const models = this.periodizationModels;
        let scores = {};

        // Score each model based on athlete characteristics
        Object.keys(models).forEach(modelKey => {
            const model = models[modelKey];
            scores[modelKey] = this.scoreModel(model, athleteProfile, goalParameters);
        });

        // Select highest scoring model
        const optimalModelKey = Object.keys(scores).reduce((a, b) => 
            scores[a] > scores[b] ? a : b
        );

        const selectedModel = models[optimalModelKey];
        selectedModel.key = optimalModelKey;
        selectedModel.score = scores[optimalModelKey];
        selectedModel.reasoning = this.generateModelReasoning(selectedModel, athleteProfile);

        console.log(`📊 Selected ${selectedModel.name} (score: ${selectedModel.score.toFixed(2)})`);
        
        return selectedModel;
    }

    /**
     * Score periodization model based on athlete fit
     */
    scoreModel(model, athlete, goals) {
        let score = 0.5; // Base score

        // Training type compatibility
        if (athlete.trainingType === 'strength' && model.bestFor.includes('powerlifting')) {
            score += 0.3;
        } else if (athlete.trainingType === 'hypertrophy' && model.bestFor.includes('bodybuilding')) {
            score += 0.3;
        } else if (athlete.trainingType === 'endurance' && model.bestFor.includes('endurance_sports')) {
            score += 0.3;
        }

        // Special boost for powerlifting + conjugate
        if (athlete.specialization === 'powerlifting' && model.key === 'conjugate') {
            score += 0.4;
        }

        // Experience level considerations
        if (athlete.experience === 'advanced' && model.bestFor.includes('advanced_athletes')) {
            score += 0.2;
        } else if (athlete.experience === 'intermediate' && model.bestFor.includes('intermediate_athletes')) {
            score += 0.2;
        } else if (athlete.experience === 'beginner' && model.name.includes('Linear')) {
            score += 0.2; // Linear is good for beginners
        }

        // Competition considerations
        if (goals.hasCompetitions && model.phases.some(p => p.focus === 'peak')) {
            score += 0.15;
        }

        // Time availability
        if (athlete.timeConstraints === 'limited' && model.name.includes('Conjugate')) {
            score -= 0.1; // Conjugate requires more time
        }

        // Recovery capacity
        if (athlete.recoveryCapacity === 'low' && model.name.includes('Block')) {
            score -= 0.1; // Block can be demanding
        }

        return Math.max(0, Math.min(1, score));
    }

    /**
     * Build macrocycle structure
     */
    buildMacrocycle(model, athlete, goals) {
        const totalWeeks = goals.timeframe || this.config.macrocycleLength;
        
        return {
            name: `${athlete.name} ${model.name} Macrocycle`,
            model: model.key,
            totalWeeks: totalWeeks,
            startDate: goals.startDate || new Date(),
            endDate: this.addWeeks(goals.startDate || new Date(), totalWeeks),
            primaryGoal: goals.primaryGoal,
            phases: this.adaptPhasesToTimeframe(model.phases, totalWeeks),
            deloadWeeks: this.calculateDeloadWeeks(totalWeeks),
            testingWeeks: this.calculateTestingWeeks(totalWeeks),
            adaptationStrategy: this.selectAdaptationStrategy(model, athlete)
        };
    }

    /**
     * Generate mesocycles within the macrocycle
     */
    generateMesocycles(macrocycle, athlete) {
        const mesocycles = [];
        let currentWeek = 0;

        macrocycle.phases.forEach((phase, phaseIndex) => {
            const mesocyclesInPhase = Math.ceil(phase.weeks / this.config.mesocycleLength);
            
            for (let i = 0; i < mesocyclesInPhase; i++) {
                const mesocycleWeeks = Math.min(
                    this.config.mesocycleLength, 
                    phase.weeks - (i * this.config.mesocycleLength)
                );

                const mesocycle = {
                    id: `meso_${phaseIndex + 1}_${i + 1}`,
                    name: `${phase.name} Mesocycle ${i + 1}`,
                    phase: phase.name,
                    startWeek: currentWeek + 1,
                    weeks: mesocycleWeeks,
                    endWeek: currentWeek + mesocycleWeeks,
                    volumeProgression: this.calculateVolumeProgression(phase, i, mesocyclesInPhase),
                    intensityProgression: this.calculateIntensityProgression(phase, i, mesocyclesInPhase),
                    focusAreas: this.determineFocusAreas(phase, athlete),
                    adaptationMarkers: this.createAdaptationMarkers(phase),
                    contingencies: this.createMesocycleContingencies(phase)
                };

                mesocycles.push(mesocycle);
                currentWeek += mesocycleWeeks;
            }
        });

        return mesocycles;
    }

    /**
     * Generate detailed microcycle plans
     */
    generateMicrocycles(mesocycles, athlete) {
        const microcycles = [];

        mesocycles.forEach(mesocycle => {
            for (let week = 0; week < mesocycle.weeks; week++) {
                const weekNumber = mesocycle.startWeek + week;
                const isDeloadWeek = this.isDeloadWeek(weekNumber);
                
                const microcycle = {
                    id: `micro_${weekNumber}`,
                    week: weekNumber,
                    mesocycle: mesocycle.id,
                    phase: mesocycle.phase,
                    isDeloadWeek: isDeloadWeek,
                    volumeMultiplier: this.calculateWeeklyVolumeMultiplier(mesocycle, week, isDeloadWeek),
                    intensityMultiplier: this.calculateWeeklyIntensityMultiplier(mesocycle, week, isDeloadWeek),
                    focusAreas: mesocycle.focusAreas,
                    sessionDistribution: this.planSessionDistribution(athlete, mesocycle.phase, isDeloadWeek),
                    adaptationTests: this.planAdaptationTests(weekNumber),
                    recoveryProtocols: this.planRecoveryProtocols(mesocycle.phase, isDeloadWeek),
                    progressionTargets: this.setProgressionTargets(mesocycle, week)
                };

                microcycles.push(microcycle);
            }
        });

        return microcycles;
    }

    /**
     * Integrate competition timing and tapering protocols
     */
    integrateCompetitionTiming(microcycles, competitions) {
        competitions.forEach(competition => {
            const competitionDate = new Date(competition.date);
            const competitionWeek = this.findWeekForDate(microcycles, competitionDate);
            
            if (competitionWeek) {
                // Implement tapering protocol
                const taperWeeks = competition.importance === 'major' ? 3 : 2;
                this.implementTaperingProtocol(microcycles, competitionWeek, taperWeeks, competition);
                
                // Plan peak timing
                this.planPeakTiming(microcycles, competitionWeek, competition);
                
                // Add competition recovery
                this.planCompetitionRecovery(microcycles, competitionWeek, competition);
            }
        });
    }

    /**
     * Implement tapering protocol for competition
     */
    implementTaperingProtocol(microcycles, competitionWeek, taperWeeks, competition) {
        for (let i = 1; i <= taperWeeks; i++) {
            const taperWeekIndex = competitionWeek - i;
            if (taperWeekIndex >= 0 && taperWeekIndex < microcycles.length) {
                const microcycle = microcycles[taperWeekIndex];
                
                // Progressive volume reduction
                const volumeReduction = (i / taperWeeks) * 0.6; // Up to 60% reduction
                microcycle.volumeMultiplier *= (1 - volumeReduction);
                
                // Maintain or slightly increase intensity
                microcycle.intensityMultiplier *= (1 + (i / taperWeeks) * 0.05);
                
                // Add taper-specific protocols
                microcycle.isTaperWeek = true;
                microcycle.taperWeek = i;
                microcycle.competitionPrep = {
                    competition: competition.name,
                    importance: competition.importance,
                    taperfocus: this.getTaperFocus(i, taperWeeks),
                    techniques: this.getTaperTechniques(i, competition.type)
                };
            }
        }
    }

    /**
     * Adapt workout based on periodization recommendations
     * @param {Object} currentWorkout - Current workout structure
     * @param {number} weekNumber - Current week in periodization
     * @returns {Object} Adapted workout with periodization modifications
     */
    adaptWorkoutToPeriodization(currentWorkout, weekNumber) {
        if (!this.currentMacrocycle) {
            return currentWorkout; // No periodization plan active
        }

        const currentMicrocycle = this.currentMacrocycle.microcycles.find(m => m.week === weekNumber);
        if (!currentMicrocycle) {
            return currentWorkout;
        }

        console.log(`🏗️ Adapting workout for Week ${weekNumber} (${currentMicrocycle.phase})`);

        const adaptedWorkout = JSON.parse(JSON.stringify(currentWorkout)); // Deep copy

        // Apply volume modifications
        this.applyVolumeModifications(adaptedWorkout, currentMicrocycle);
        
        // Apply intensity modifications
        this.applyIntensityModifications(adaptedWorkout, currentMicrocycle);
        
        // Apply phase-specific focus
        this.applyPhaseSpecificFocus(adaptedWorkout, currentMicrocycle);
        
        // Add periodization context
        adaptedWorkout.periodizationContext = {
            week: weekNumber,
            phase: currentMicrocycle.phase,
            mesocycle: currentMicrocycle.mesocycle,
            isDeloadWeek: currentMicrocycle.isDeloadWeek,
            isTaperWeek: currentMicrocycle.isTaperWeek || false,
            focusAreas: currentMicrocycle.focusAreas,
            volumeMultiplier: currentMicrocycle.volumeMultiplier,
            intensityMultiplier: currentMicrocycle.intensityMultiplier
        };

        return adaptedWorkout;
    }

    /**
     * Apply volume modifications based on periodization
     */
    applyVolumeModifications(workout, microcycle) {
        const volumeMultiplier = microcycle.volumeMultiplier;
        
        workout.exercises.forEach(exercise => {
            if (exercise.sets && typeof exercise.sets === 'number') {
                exercise.originalSets = exercise.sets;
                exercise.sets = Math.max(1, Math.round(exercise.sets * volumeMultiplier));
            }
            
            if (exercise.workingSets) {
                exercise.workingSets.forEach(set => {
                    if (set.sets) {
                        set.originalSets = set.sets;
                        set.sets = Math.max(1, Math.round(set.sets * volumeMultiplier));
                    }
                });
            }
        });

        // Add volume modification note
        workout.modifications = workout.modifications || [];
        workout.modifications.push({
            type: 'volume',
            multiplier: volumeMultiplier,
            reason: `${microcycle.phase} phase volume adjustment`,
            isDeload: microcycle.isDeloadWeek
        });
    }

    /**
     * Apply intensity modifications based on periodization
     */
    applyIntensityModifications(workout, microcycle) {
        const intensityMultiplier = microcycle.intensityMultiplier;
        
        workout.exercises.forEach(exercise => {
            if (exercise.targetWeight) {
                exercise.originalTargetWeight = exercise.targetWeight;
                exercise.targetWeight = Math.round(exercise.targetWeight * intensityMultiplier);
            }
            
            if (exercise.workingSets) {
                exercise.workingSets.forEach(set => {
                    if (set.weight) {
                        set.originalWeight = set.weight;
                        set.weight = Math.round(set.weight * intensityMultiplier);
                    }
                    if (set.percentage) {
                        set.originalPercentage = set.percentage;
                        set.percentage = Math.min(100, set.percentage * intensityMultiplier);
                    }
                });
            }
        });

        // Add intensity modification note
        workout.modifications = workout.modifications || [];
        workout.modifications.push({
            type: 'intensity',
            multiplier: intensityMultiplier,
            reason: `${microcycle.phase} phase intensity adjustment`,
            isTaper: microcycle.isTaperWeek || false
        });
    }

    /**
     * Apply phase-specific focus areas
     */
    applyPhaseSpecificFocus(workout, microcycle) {
        microcycle.focusAreas.forEach(focus => {
            switch (focus) {
                case 'strength':
                    this.applyStrengthFocus(workout);
                    break;
                case 'hypertrophy':
                    this.applyHypertrophyFocus(workout);
                    break;
                case 'power':
                    this.applyPowerFocus(workout);
                    break;
                case 'endurance':
                    this.applyEnduranceFocus(workout);
                    break;
                case 'recovery':
                    this.applyRecoveryFocus(workout);
                    break;
                case 'technique':
                    this.applyTechniqueFocus(workout);
                    break;
            }
        });
    }

    /**
     * Apply strength-specific modifications
     */
    applyStrengthFocus(workout) {
        workout.exercises.forEach(exercise => {
            if (exercise.isMainLift) {
                // Lower reps, higher intensity for main lifts
                if (exercise.targetReps && exercise.targetReps > 5) {
                    exercise.originalTargetReps = exercise.targetReps;
                    exercise.targetReps = Math.max(1, Math.min(5, exercise.targetReps - 2));
                }
                
                // Longer rest periods
                exercise.restPeriod = Math.max(exercise.restPeriod || 120, 180); // At least 3 minutes
            }
        });

        workout.phaseModifications = workout.phaseModifications || [];
        workout.phaseModifications.push({
            focus: 'strength',
            changes: ['Reduced reps for main lifts', 'Extended rest periods', 'Higher intensity focus']
        });
    }

    /**
     * Apply hypertrophy-specific modifications
     */
    applyHypertrophyFocus(workout) {
        workout.exercises.forEach(exercise => {
            // Moderate reps for hypertrophy
            if (exercise.targetReps && (exercise.targetReps < 6 || exercise.targetReps > 12)) {
                exercise.originalTargetReps = exercise.targetReps;
                exercise.targetReps = Math.max(6, Math.min(12, 8)); // Target 8 reps
            }
            
            // Moderate rest periods
            exercise.restPeriod = Math.min(exercise.restPeriod || 90, 120); // Max 2 minutes
        });

        workout.phaseModifications = workout.phaseModifications || [];
        workout.phaseModifications.push({
            focus: 'hypertrophy',
            changes: ['Optimized rep ranges (6-12)', 'Moderate rest periods', 'Volume emphasis']
        });
    }

    /**
     * Apply power-specific modifications
     */
    applyPowerFocus(workout) {
        workout.exercises.forEach(exercise => {
            if (exercise.isMainLift) {
                // Low reps, explosive intent
                if (exercise.targetReps && exercise.targetReps > 3) {
                    exercise.originalTargetReps = exercise.targetReps;
                    exercise.targetReps = Math.max(1, Math.min(3, exercise.targetReps));
                }
                
                // Longer rest for full recovery
                exercise.restPeriod = Math.max(exercise.restPeriod || 120, 240); // At least 4 minutes
                
                // Add explosive intent note
                exercise.notes = (exercise.notes || '') + ' [POWER PHASE: Explosive intent, full recovery]';
            }
        });

        workout.phaseModifications = workout.phaseModifications || [];
        workout.phaseModifications.push({
            focus: 'power',
            changes: ['Low reps with explosive intent', 'Extended rest periods', 'Power development emphasis']
        });
    }

    /**
     * Apply recovery-specific modifications
     */
    applyRecoveryFocus(workout) {
        workout.exercises.forEach(exercise => {
            // Reduce intensity
            if (exercise.targetWeight) {
                exercise.originalTargetWeight = exercise.targetWeight;
                exercise.targetWeight = Math.round(exercise.targetWeight * 0.8); // 80% of normal
            }
            
            // Add recovery notes
            exercise.notes = (exercise.notes || '') + ' [RECOVERY PHASE: Focus on movement quality]';
        });

        workout.phaseModifications = workout.phaseModifications || [];
        workout.phaseModifications.push({
            focus: 'recovery',
            changes: ['Reduced intensity (80%)', 'Movement quality emphasis', 'Active recovery focus']
        });
    }

    /**
     * Monitor adaptation and adjust periodization
     * @param {Array} recentPerformanceData - Recent performance data
     * @returns {Object} Adaptation recommendations
     */
    monitorAndAdaptPeriodization(recentPerformanceData) {
        if (!this.currentMacrocycle || !recentPerformanceData.length) {
            return { adaptationNeeded: false, reason: 'Insufficient data' };
        }

        const currentWeek = this.getCurrentWeek();
        const currentMicrocycle = this.currentMacrocycle.microcycles.find(m => m.week === currentWeek);
        
        if (!currentMicrocycle) {
            return { adaptationNeeded: false, reason: 'Week not found in plan' };
        }

        // Analyze adaptation to current phase
        const adaptationAnalysis = this.analyzePhaseAdaptation(recentPerformanceData, currentMicrocycle);
        
        // Check if periodization modifications are needed
        const modifications = this.assessPeriodizationModifications(adaptationAnalysis, currentMicrocycle);
        
        if (modifications.needed) {
            this.applyPeriodizationModifications(modifications);
            this.logAdaptation(currentWeek, modifications);
        }

        return {
            adaptationNeeded: modifications.needed,
            currentPhase: currentMicrocycle.phase,
            week: currentWeek,
            analysis: adaptationAnalysis,
            modifications: modifications.changes || [],
            nextCheckpoint: this.getNextAdaptationCheckpoint(currentWeek)
        };
    }

    /**
     * Utility methods for periodization calculations
     */
    calculateVolumeProgression(phase, mesocycleIndex, totalMesocycles) {
        const baseVolume = phase.volume;
        const progression = (mesocycleIndex + 1) / totalMesocycles;
        
        // Different progression patterns based on phase
        switch (phase.focus) {
            case 'volume':
                return baseVolume * (0.8 + progression * 0.4); // 80% to 120%
            case 'intensity':
                return baseVolume * (1.2 - progression * 0.4); // 120% to 80%
            case 'peak':
                return baseVolume * (0.8 - progression * 0.3); // 80% to 50%
            default:
                return baseVolume;
        }
    }

    calculateIntensityProgression(phase, mesocycleIndex, totalMesocycles) {
        const baseIntensity = phase.intensity;
        const progression = (mesocycleIndex + 1) / totalMesocycles;
        
        switch (phase.focus) {
            case 'volume':
                return baseIntensity; // Maintain intensity
            case 'intensity':
                return baseIntensity * (0.9 + progression * 0.15); // 90% to 105%
            case 'peak':
                return baseIntensity * (0.95 + progression * 0.05); // 95% to 100%
            default:
                return baseIntensity;
        }
    }

    calculateWeeklyVolumeMultiplier(mesocycle, weekInMeso, isDeloadWeek) {
        if (isDeloadWeek) {
            return 0.6; // 60% volume for deload
        }
        
        const baseMultiplier = mesocycle.volumeProgression;
        const weeklyVariation = 1 + (weekInMeso * 0.05); // Small weekly increase
        
        return Math.min(1.3, baseMultiplier * weeklyVariation); // Cap at 130%
    }

    calculateWeeklyIntensityMultiplier(mesocycle, weekInMeso, isDeloadWeek) {
        if (isDeloadWeek) {
            return 0.85; // 85% intensity for deload
        }
        
        const baseMultiplier = mesocycle.intensityProgression;
        const weeklyVariation = 1 + (weekInMeso * 0.02); // Small weekly increase
        
        return Math.min(1.05, baseMultiplier * weeklyVariation); // Cap at 105%
    }

    isDeloadWeek(weekNumber) {
        return weekNumber % this.config.deloadFrequency === 0;
    }

    addWeeks(date, weeks) {
        const result = new Date(date);
        result.setDate(result.getDate() + (weeks * 7));
        return result;
    }

    getCurrentWeek() {
        if (!this.currentMacrocycle) return 1;
        
        const startDate = new Date(this.currentMacrocycle.startDate);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.ceil(diffDays / 7);
    }

    /**
     * Helper methods for plan generation
     */
    adaptPhasesToTimeframe(phases, totalWeeks) {
        const totalPhaseWeeks = phases.reduce((sum, phase) => sum + phase.weeks, 0);
        const scaleFactor = totalWeeks / totalPhaseWeeks;
        
        return phases.map(phase => ({
            ...phase,
            weeks: Math.max(1, Math.round(phase.weeks * scaleFactor))
        }));
    }

    calculateDeloadWeeks(totalWeeks) {
        const deloadWeeks = [];
        for (let week = this.config.deloadFrequency; week <= totalWeeks; week += this.config.deloadFrequency) {
            deloadWeeks.push(week);
        }
        return deloadWeeks;
    }

    calculateTestingWeeks(totalWeeks) {
        const testingWeeks = [];
        // Add testing weeks at key intervals (every 4-6 weeks)
        for (let week = 4; week <= totalWeeks; week += 6) {
            testingWeeks.push(week);
        }
        // Always test at the end
        if (!testingWeeks.includes(totalWeeks)) {
            testingWeeks.push(totalWeeks);
        }
        return testingWeeks;
    }

    selectAdaptationStrategy(model, athlete) {
        const strategies = {
            linear: 'progressive_overload',
            block: 'concentrated_loading',
            conjugate: 'concurrent_development',
            undulating: 'daily_variation',
            polarized: 'intensity_distribution'
        };
        
        return {
            primary: strategies[model.key] || 'progressive_overload',
            considerations: this.getAdaptationConsiderations(athlete),
            monitoring: ['rpe', 'volume', 'strength', 'recovery']
        };
    }

    getAdaptationConsiderations(athlete) {
        const considerations = [];
        
        if (athlete.experience === 'beginner') {
            considerations.push('conservative_progression', 'form_emphasis');
        } else if (athlete.experience === 'advanced') {
            considerations.push('aggressive_progression', 'specialization');
        }
        
        if (athlete.recoveryCapacity === 'low') {
            considerations.push('extended_recovery', 'volume_limitation');
        }
        
        if (athlete.timeConstraints === 'limited') {
            considerations.push('time_efficient', 'compound_movements');
        }
        
        return considerations;
    }

    planSessionDistribution(athlete, phase, isDeloadWeek) {
        const baseSessions = {
            strength: { frequency: 4, focus: ['main_lifts', 'accessories'] },
            hypertrophy: { frequency: 5, focus: ['volume', 'isolation'] },
            endurance: { frequency: 6, focus: ['aerobic_base', 'intervals'] },
            general: { frequency: 3, focus: ['compound', 'conditioning'] }
        };
        
        const sessions = baseSessions[athlete.trainingType] || baseSessions.general;
        
        if (isDeloadWeek) {
            sessions.frequency = Math.max(2, Math.floor(sessions.frequency * 0.7));
        }
        
        return {
            ...sessions,
            phase,
            duration: this.getSessionDuration(athlete.timeConstraints),
            intensity: this.getPhaseIntensity(phase)
        };
    }

    getSessionDuration(timeConstraints) {
        const durations = {
            limited: 45,
            moderate: 60,
            high: 90
        };
        return durations[timeConstraints] || 60;
    }

    getPhaseIntensity(phase) {
        const intensities = {
            anatomical_adaptation: 'low',
            hypertrophy: 'moderate',
            strength: 'high',
            power_peak: 'very_high',
            accumulation: 'moderate',
            intensification: 'high',
            realization: 'very_high',
            restoration: 'low'
        };
        return intensities[phase] || 'moderate';
    }

    planAdaptationTests(weekNumber) {
        if (weekNumber % 4 === 0) {
            return ['strength_test', '1rm_estimation'];
        } else if (weekNumber % 2 === 0) {
            return ['volume_tolerance'];
        }
        return [];
    }

    planRecoveryProtocols(phase, isDeloadWeek) {
        const protocols = ['sleep_optimization', 'stress_management'];
        
        if (isDeloadWeek) {
            protocols.push('active_recovery', 'mobility_work');
        }
        
        if (phase === 'intensification' || phase === 'strength') {
            protocols.push('hrv_monitoring', 'recovery_modalities');
        }
        
        return protocols;
    }

    setProgressionTargets(mesocycle, weekInMeso) {
        const baseTargets = {
            volume: mesocycle.volumeProgression,
            intensity: mesocycle.intensityProgression,
            adherence: 0.9
        };
        
        // Adjust based on week in mesocycle
        const progressionFactor = (weekInMeso + 1) / 4; // Assuming 4-week mesocycles
        
        return {
            volume: baseTargets.volume * (0.9 + progressionFactor * 0.2),
            intensity: baseTargets.intensity * (0.95 + progressionFactor * 0.1),
            adherence: baseTargets.adherence,
            rpe: this.getTargetRPE(mesocycle.phase)
        };
    }

    getTargetRPE(phase) {
        const targetRPEs = {
            anatomical_adaptation: 6.5,
            hypertrophy: 7.5,
            strength: 8.5,
            power_peak: 8.0,
            accumulation: 7.0,
            intensification: 8.5,
            realization: 9.0,
            restoration: 6.0
        };
        return targetRPEs[phase] || 7.5;
    }

    findWeekForDate(microcycles, targetDate) {
        // Simple implementation - find the closest week
        const targetTime = targetDate.getTime();
        let closestWeek = null;
        let minDiff = Infinity;
        
        microcycles.forEach((micro, index) => {
            const weekTime = new Date().getTime() + (micro.week * 7 * 24 * 60 * 60 * 1000);
            const diff = Math.abs(targetTime - weekTime);
            
            if (diff < minDiff) {
                minDiff = diff;
                closestWeek = index;
            }
        });
        
        return closestWeek;
    }

    planPeakTiming(microcycles, competitionWeek, competition) {
        if (competitionWeek >= 0 && competitionWeek < microcycles.length) {
            const microcycle = microcycles[competitionWeek];
            microcycle.isCompetitionWeek = true;
            microcycle.competitionPrep = {
                competition: competition.name,
                type: competition.type,
                importance: competition.importance,
                peakingProtocol: this.getPeakingProtocol(competition.type)
            };
        }
    }

    planCompetitionRecovery(microcycles, competitionWeek, competition) {
        const recoveryWeek = competitionWeek + 1;
        if (recoveryWeek < microcycles.length) {
            const microcycle = microcycles[recoveryWeek];
            microcycle.isRecoveryWeek = true;
            microcycle.volumeMultiplier *= 0.5;
            microcycle.intensityMultiplier *= 0.7;
            microcycle.recoveryProtocols.push('post_competition_recovery');
        }
    }

    getTaperFocus(taperWeek, totalTaperWeeks) {
        const focuses = {
            1: 'volume_reduction',
            2: 'intensity_maintenance',
            3: 'technique_refinement'
        };
        return focuses[taperWeek] || 'preparation';
    }

    getTaperTechniques(taperWeek, competitionType) {
        const techniques = {
            powerlifting: ['opener_practice', 'timing_work', 'mental_preparation'],
            weightlifting: ['technique_refinement', 'speed_work', 'competition_simulation'],
            endurance: ['race_pace_work', 'strategy_practice', 'equipment_testing']
        };
        
        return techniques[competitionType] || techniques.powerlifting;
    }

    getPeakingProtocol(competitionType) {
        const protocols = {
            powerlifting: {
                duration: 1,
                focus: 'strength_expression',
                techniques: ['opener_confirmation', 'timing_practice']
            },
            weightlifting: {
                duration: 1,
                focus: 'technical_precision',
                techniques: ['competition_timing', 'movement_quality']
            },
            endurance: {
                duration: 3,
                focus: 'aerobic_power',
                techniques: ['race_simulation', 'pacing_strategy']
            }
        };
        
        return protocols[competitionType] || protocols.powerlifting;
    }

    determineFocusAreas(phase, athlete) {
        const focusAreas = [phase.focus];
        
        // Add secondary focus areas based on athlete profile
        if (athlete.weaknesses) {
            focusAreas.push(...athlete.weaknesses.filter(w => w !== phase.focus));
        }
        
        return focusAreas.slice(0, 3); // Max 3 focus areas
    }

    createAdaptationCheckpoints(microcycles) {
        return microcycles
            .filter((micro, index) => (index + 1) % this.config.adaptationWindow === 0)
            .map(micro => ({
                week: micro.week,
                phase: micro.phase,
                assessments: ['strength_test', 'volume_tolerance', 'recovery_markers'],
                adaptationCriteria: this.getAdaptationCriteria(micro.phase)
            }));
    }

    generateModelReasoning(model, athlete) {
        const reasons = [];
        
        if (model.bestFor.includes(athlete.trainingType)) {
            reasons.push(`Optimal for ${athlete.trainingType} training`);
        }
        
        if (athlete.experience === 'advanced' && model.bestFor.includes('advanced_athletes')) {
            reasons.push('Suitable for advanced training experience');
        }
        
        reasons.push(`Evidence-based: ${model.research}`);
        
        return reasons;
    }

    getAdaptationCriteria(phase) {
        const criteria = {
            volume: { minIncrease: 0.05, maxIncrease: 0.15 },
            strength: { minIncrease: 0.02, maxIncrease: 0.08 },
            recovery: { minScore: 6.0, targetScore: 8.0 }
        };
        
        switch (phase) {
            case 'hypertrophy':
                criteria.volume.minIncrease = 0.08;
                break;
            case 'strength':
                criteria.strength.minIncrease = 0.05;
                break;
            case 'power':
                criteria.recovery.minScore = 7.0;
                break;
        }
        
        return criteria;
    }

    /**
     * Additional analysis and monitoring methods
     */
    analyzePhaseAdaptation(recentPerformanceData, currentMicrocycle) {
        if (!recentPerformanceData || recentPerformanceData.length === 0) {
            return { status: 'insufficient_data', confidence: 0 };
        }

        const analysis = {
            phase: currentMicrocycle.phase,
            trends: this.analyzePerformanceTrends(recentPerformanceData),
            adaptation: this.assessAdaptationQuality(recentPerformanceData, currentMicrocycle),
            recommendations: []
        };

        // Generate specific recommendations based on trends
        if (analysis.trends.avgRPE && analysis.trends.avgRPE.slope > 0.2) {
            analysis.recommendations.push({
                type: 'deload',
                priority: 'high',
                reason: 'Increasing RPE trend indicates accumulating fatigue'
            });
        }

        if (analysis.trends.volume && analysis.trends.volume.slope < -0.1) {
            analysis.recommendations.push({
                type: 'volume_adjustment',
                priority: 'medium',
                reason: 'Declining volume tolerance'
            });
        }

        return analysis;
    }

    analyzePerformanceTrends(data) {
        const trends = {};
        const metrics = ['avgRPE', 'volume', 'strength', 'recovery'];

        metrics.forEach(metric => {
            const values = data.map(d => d[metric]).filter(v => v !== undefined);
            if (values.length >= 2) {
                trends[metric] = this.calculateTrend(values);
            }
        });

        return trends;
    }

    calculateTrend(values) {
        const n = values.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return {
            slope,
            intercept,
            direction: slope > 0.05 ? 'increasing' : slope < -0.05 ? 'decreasing' : 'stable',
            magnitude: Math.abs(slope)
        };
    }

    assessAdaptationQuality(data, microcycle) {
        const criteria = this.getAdaptationCriteria(microcycle.phase);
        const recent = data[data.length - 1];
        const baseline = data[0];

        const adaptationQuality = {
            volume: this.assessVolumeAdaptation(recent, baseline, criteria.volume),
            strength: this.assessStrengthAdaptation(recent, baseline, criteria.strength),
            recovery: this.assessRecoveryAdaptation(recent, criteria.recovery),
            overall: 'good'
        };

        // Calculate overall adaptation quality
        const scores = Object.values(adaptationQuality).filter(v => typeof v === 'number');
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        if (averageScore >= 0.8) {
            adaptationQuality.overall = 'excellent';
        } else if (averageScore >= 0.6) {
            adaptationQuality.overall = 'good';
        } else if (averageScore >= 0.4) {
            adaptationQuality.overall = 'fair';
        } else {
            adaptationQuality.overall = 'poor';
        }

        return adaptationQuality;
    }

    assessVolumeAdaptation(recent, baseline, criteria) {
        if (!recent.volume || !baseline.volume) return 0.5;
        
        const change = (recent.volume - baseline.volume) / baseline.volume;
        
        if (change >= criteria.minIncrease && change <= criteria.maxIncrease) {
            return 1.0;
        } else if (change > criteria.maxIncrease) {
            return 0.6; // Too much increase
        } else if (change < criteria.minIncrease) {
            return 0.4; // Insufficient increase
        }
        
        return 0.5;
    }

    assessStrengthAdaptation(recent, baseline, criteria) {
        if (!recent.strength || !baseline.strength) return 0.5;
        
        const change = (recent.strength - baseline.strength) / baseline.strength;
        
        if (change >= criteria.minIncrease) {
            return Math.min(1.0, change / criteria.maxIncrease);
        }
        
        return Math.max(0.0, change / criteria.minIncrease);
    }

    assessRecoveryAdaptation(recent, criteria) {
        if (!recent.recovery) return 0.5;
        
        if (recent.recovery >= criteria.targetScore) {
            return 1.0;
        } else if (recent.recovery >= criteria.minScore) {
            return (recent.recovery - criteria.minScore) / (criteria.targetScore - criteria.minScore);
        }
        
        return 0.0;
    }

    assessPeriodizationModifications(adaptationAnalysis, currentMicrocycle) {
        const modifications = {
            needed: false,
            changes: [],
            confidence: 0.8
        };

        // Check if deload is needed
        if (adaptationAnalysis.trends.avgRPE && adaptationAnalysis.trends.avgRPE.direction === 'increasing') {
            modifications.needed = true;
            modifications.changes.push({
                type: 'deload',
                description: 'Implement deload week due to increasing RPE trend',
                implementation: 'reduce_volume_40_percent'
            });
        }

        // Check if intensification opportunity exists
        if (adaptationAnalysis.trends.avgRPE && adaptationAnalysis.trends.avgRPE.direction === 'decreasing') {
            modifications.needed = true;
            modifications.changes.push({
                type: 'intensification',
                description: 'Opportunity for intensification due to decreasing RPE',
                implementation: 'increase_intensity_5_percent'
            });
        }

        // Check if volume adjustment is needed
        if (adaptationAnalysis.adaptation.volume < 0.5) {
            modifications.needed = true;
            modifications.changes.push({
                type: 'volume_adjustment',
                description: 'Adjust volume based on poor volume adaptation',
                implementation: 'modify_volume_progression'
            });
        }

        return modifications;
    }

    applyPeriodizationModifications(modifications) {
        if (!modifications.needed || !this.currentMacrocycle) {
            return;
        }

        modifications.changes.forEach(change => {
            switch (change.type) {
                case 'deload':
                    this.implementDeloadModification();
                    break;
                case 'intensification':
                    this.implementIntensificationModification();
                    break;
                case 'volume_adjustment':
                    this.implementVolumeAdjustment();
                    break;
            }
        });
    }

    implementDeloadModification() {
        const currentWeek = this.getCurrentWeek();
        const currentMicrocycle = this.currentMacrocycle.microcycles.find(m => m.week === currentWeek);
        
        if (currentMicrocycle) {
            currentMicrocycle.volumeMultiplier *= 0.6;
            currentMicrocycle.intensityMultiplier *= 0.85;
            currentMicrocycle.isEmergencyDeload = true;
        }
    }

    implementIntensificationModification() {
        const currentWeek = this.getCurrentWeek();
        const currentMicrocycle = this.currentMacrocycle.microcycles.find(m => m.week === currentWeek);
        
        if (currentMicrocycle) {
            currentMicrocycle.intensityMultiplier *= 1.05;
            currentMicrocycle.isIntensification = true;
        }
    }

    implementVolumeAdjustment() {
        const currentWeek = this.getCurrentWeek();
        const currentMicrocycle = this.currentMacrocycle.microcycles.find(m => m.week === currentWeek);
        
        if (currentMicrocycle) {
            currentMicrocycle.volumeMultiplier *= 0.9;
            currentMicrocycle.isVolumeAdjustment = true;
        }
    }

    logAdaptation(week, modifications) {
        const adaptationLog = {
            week,
            timestamp: new Date().toISOString(),
            modifications: modifications.changes,
            confidence: modifications.confidence
        };

        this.adaptationHistory.push(adaptationLog);
        console.log(`📝 Adaptation logged for week ${week}:`, modifications.changes.length, 'modifications');
    }

    getNextAdaptationCheckpoint(currentWeek) {
        const checkpointInterval = this.config.adaptationWindow;
        const nextCheckpoint = Math.ceil(currentWeek / checkpointInterval) * checkpointInterval;
        return nextCheckpoint;
    }

    createAdaptationMarkers(phase) {
        return {
            volumeToleranceTest: phase.focus === 'volume',
            strengthTest: phase.focus === 'strength' || phase.focus === 'intensity',
            recoveryAssessment: true,
            rpeAnalysis: true
        };
    }

    createMesocycleContingencies(phase) {
        return {
            highFatigue: 'reduce_volume_20_percent',
            lowRecovery: 'extend_rest_periods',
            plateauBreaker: 'modify_exercise_selection',
            injuryPrevention: 'deload_immediately'
        };
    }

    createContingencyPlans(model) {
        return {
            overreaching: {
                detection: 'rpe_above_9_for_3_sessions',
                action: 'immediate_deload',
                duration: '1_week'
            },
            plateau: {
                detection: 'no_progress_for_2_weeks',
                action: 'modify_training_stimulus',
                options: ['exercise_variation', 'intensity_modification', 'volume_adjustment']
            },
            injury: {
                detection: 'pain_or_dysfunction',
                action: 'immediate_modification',
                protocol: 'pain_free_alternatives'
            },
            competition_delay: {
                detection: 'competition_rescheduled',
                action: 'adjust_periodization',
                flexibility: 'extend_or_compress_phases'
            }
        };
    }

    /**
     * Export periodization plan
     */
    exportPeriodizationPlan() {
        if (!this.currentMacrocycle) {
            return null;
        }
        
        return {
            plan: this.currentMacrocycle,
            adaptationHistory: this.adaptationHistory,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    /**
     * Import periodization plan
     */
    importPeriodizationPlan(planData) {
        try {
            if (planData.plan) {
                this.currentMacrocycle = planData.plan;
            }
            if (planData.adaptationHistory) {
                this.adaptationHistory = planData.adaptationHistory;
            }
            
            return { success: true, imported: 'Periodization plan loaded' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = PeriodizationAI;