/**
 * Exercise AI - Intelligent exercise selection and substitution system
 * Provides dynamic exercise recommendations based on individual responses and constraints
 */

const fs = require('fs');
const path = require('path');

class ExerciseAI {
    constructor() {
        this.exerciseDatabase = this.loadExerciseDatabase();
        this.userProfile = null;
        this.sessionHistory = [];
        this.exerciseResponses = new Map(); // Track individual exercise responses
        this.substituionHistory = [];
        this.config = {
            responseTrackingWindow: 12, // weeks
            adaptationThreshold: 0.15, // 15% improvement to consider "good response"
            plateauThreshold: 3, // weeks without improvement to consider plateau
            varietyRotationWeeks: 6 // weeks before suggesting variety
        };
    }

    /**
     * Load exercise database
     */
    loadExerciseDatabase() {
        try {
            const dbPath = path.join(__dirname, '../configs/exercise-database-v2.json');
            const dbContent = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(dbContent);
        } catch (error) {
            console.error('Failed to load exercise database:', error);
            return this.getFallbackDatabase();
        }
    }

    /**
     * Initialize user profile for exercise selection
     * @param {Object} profile - User profile including goals, constraints, and preferences
     */
    initializeUserProfile(profile) {
        this.userProfile = {
            trainingGoal: profile.trainingGoal || 'general',
            experience: profile.experience || 'beginner',
            availableEquipment: profile.availableEquipment || ['bodyweight'],
            injuries: profile.injuries || [],
            preferences: profile.preferences || {},
            anthropometry: profile.anthropometry || {},
            constraints: profile.constraints || {}
        };
        
        console.log('🎯 Exercise AI initialized for:', this.userProfile.trainingGoal, 'training');
    }

    /**
     * Select optimal exercises for a workout session
     * @param {Object} sessionRequirements - Requirements for the session
     * @returns {Array} Array of selected exercises with alternatives
     */
    selectExercisesForSession(sessionRequirements) {
        const {
            trainingType,
            targetMuscleGroups,
            movementPatterns,
            sessionDuration,
            energyLevel,
            equipmentAccess = this.userProfile.availableEquipment
        } = sessionRequirements;

        console.log('🔍 Selecting exercises for session:', sessionRequirements);

        const selectedExercises = [];
        const constraints = this.buildConstraintMatrix();

        // Prioritize exercises based on session requirements
        const exercisePool = this.buildExercisePool(trainingType, targetMuscleGroups);
        
        // Score and rank exercises
        const scoredExercises = this.scoreExercises(exercisePool, constraints, sessionRequirements);
        
        // Select primary exercises
        const primaryExercises = this.selectPrimaryExercises(scoredExercises, sessionRequirements);
        
        // For each primary exercise, provide alternatives and progressions
        primaryExercises.forEach(exercise => {
            const enhancedExercise = this.enhanceExerciseWithOptions(exercise, constraints);
            selectedExercises.push(enhancedExercise);
        });

        // Apply intelligent ordering
        const orderedExercises = this.optimizeExerciseOrder(selectedExercises);

        console.log(`✅ Selected ${orderedExercises.length} exercises with alternatives`);
        return orderedExercises;
    }

    /**
     * Build constraint matrix based on user profile
     */
    buildConstraintMatrix() {
        return {
            injuries: this.userProfile.injuries,
            equipment: this.userProfile.availableEquipment,
            experience: this.userProfile.experience,
            anthropometry: this.userProfile.anthropometry,
            preferences: this.userProfile.preferences,
            contraindications: this.identifyContraindications()
        };
    }

    /**
     * Build exercise pool based on training type and target muscle groups
     */
    buildExercisePool(trainingType, targetMuscleGroups) {
        const category = this.exerciseDatabase.categories[trainingType] || 
                        this.exerciseDatabase.categories.general_fitness;
        
        let exercisePool = [];
        
        // Collect exercises from all subcategories
        Object.values(category).forEach(subcategory => {
            if (Array.isArray(subcategory)) {
                exercisePool = exercisePool.concat(subcategory);
            }
        });

        // Filter by target muscle groups if specified
        if (targetMuscleGroups && targetMuscleGroups.length > 0) {
            exercisePool = exercisePool.filter(exercise => {
                const exerciseMuscles = [
                    ...(exercise.primary_muscles || []),
                    ...(exercise.secondary_muscles || [])
                ];
                return targetMuscleGroups.some(target => 
                    exerciseMuscles.includes(target)
                );
            });
        }

        return exercisePool;
    }

    /**
     * Score exercises based on multiple criteria
     */
    scoreExercises(exercisePool, constraints, sessionRequirements) {
        return exercisePool.map(exercise => {
            const score = this.calculateExerciseScore(exercise, constraints, sessionRequirements);
            return {
                ...exercise,
                aiScore: score,
                reasoning: this.generateSelectionReasoning(exercise, score, constraints)
            };
        }).sort((a, b) => b.aiScore - a.aiScore);
    }

    /**
     * Calculate comprehensive exercise score
     */
    calculateExerciseScore(exercise, constraints, sessionRequirements) {
        let score = 0;
        const criteria = this.exerciseDatabase.ai_selection_criteria;

        // Safety score (injury considerations)
        const safetyScore = this.calculateSafetyScore(exercise, constraints.injuries);
        score += safetyScore * criteria.priority_factors.find(f => f.factor === 'injury_safety').weight;

        // Equipment availability score
        const equipmentScore = this.calculateEquipmentScore(exercise, constraints.equipment);
        score += equipmentScore * criteria.priority_factors.find(f => f.factor === 'equipment_availability').weight;

        // Movement pattern match score
        const movementScore = this.calculateMovementScore(exercise, sessionRequirements);
        score += movementScore * criteria.priority_factors.find(f => f.factor === 'movement_pattern_match').weight;

        // Experience appropriateness score
        const experienceScore = this.calculateExperienceScore(exercise, constraints.experience);
        score += experienceScore * criteria.priority_factors.find(f => f.factor === 'experience_appropriateness').weight;

        // Training goal alignment score
        const goalScore = this.calculateGoalScore(exercise, sessionRequirements);
        score += goalScore * criteria.priority_factors.find(f => f.factor === 'training_goal_alignment').weight;

        // Individual response bonus (if we have historical data)
        const responseBonus = this.calculateResponseBonus(exercise);
        score += responseBonus * 0.1; // 10% bonus for exercises with good individual response

        return Math.max(0, Math.min(1, score)); // Normalize to 0-1 range
    }

    /**
     * Calculate safety score based on injury considerations
     */
    calculateSafetyScore(exercise, injuries) {
        if (injuries.length === 0) return 1.0;

        const substitutionRules = this.exerciseDatabase.substitution_rules.by_injury;
        
        for (const injury of injuries) {
            const injuryRules = substitutionRules[injury];
            if (injuryRules) {
                // Check if exercise should be avoided
                const shouldAvoid = injuryRules.avoid.some(pattern => 
                    exercise.movement_pattern?.includes(pattern) ||
                    exercise.name.toLowerCase().includes(pattern.toLowerCase())
                );
                
                if (shouldAvoid) return 0.1; // Very low score for potentially harmful exercises
                
                // Check if exercise is preferred for this injury
                const isPreferred = injuryRules.prefer.some(pattern =>
                    exercise.movement_pattern?.includes(pattern) ||
                    exercise.name.toLowerCase().includes(pattern.toLowerCase())
                );
                
                if (isPreferred) return 1.0; // Full score for injury-appropriate exercises
            }
        }

        return 0.8; // Neutral score if no specific rules apply
    }

    /**
     * Calculate equipment availability score
     */
    calculateEquipmentScore(exercise, availableEquipment) {
        const requiredEquipment = exercise.equipment || [];
        
        if (requiredEquipment.length === 0) return 1.0; // Bodyweight exercises always available
        
        const hasAllEquipment = requiredEquipment.every(item => 
            availableEquipment.includes(item) || 
            availableEquipment.includes('commercial_gym') // Full gym access
        );
        
        if (hasAllEquipment) return 1.0;
        
        // Check for alternative equipment
        const hasAlternatives = exercise.alternatives?.some(altId => {
            const alternative = this.findExerciseById(altId);
            return alternative && this.calculateEquipmentScore(alternative, availableEquipment) > 0.5;
        });
        
        return hasAlternatives ? 0.6 : 0.2;
    }

    /**
     * Calculate movement pattern match score
     */
    calculateMovementScore(exercise, sessionRequirements) {
        const requiredPatterns = sessionRequirements.movementPatterns || [];
        const requiredMuscles = sessionRequirements.targetMuscleGroups || [];
        
        let score = 0.5; // Base score
        
        // Movement pattern match
        if (requiredPatterns.length > 0) {
            const hasRequiredPattern = requiredPatterns.includes(exercise.movement_pattern);
            score += hasRequiredPattern ? 0.3 : 0;
        }
        
        // Muscle group match
        if (requiredMuscles.length > 0) {
            const exerciseMuscles = [
                ...(exercise.primary_muscles || []),
                ...(exercise.secondary_muscles || [])
            ];
            const muscleMatch = requiredMuscles.filter(muscle => 
                exerciseMuscles.includes(muscle)
            ).length / requiredMuscles.length;
            score += muscleMatch * 0.2;
        }
        
        return Math.min(1.0, score);
    }

    /**
     * Calculate experience appropriateness score
     */
    calculateExperienceScore(exercise, experienceLevel) {
        const difficultyMap = {
            beginner: { min: 0, max: 0.5 },
            intermediate: { min: 0.3, max: 0.8 },
            advanced: { min: 0.5, max: 1.0 }
        };
        
        const levelRanges = difficultyMap[experienceLevel] || difficultyMap.beginner;
        const exerciseDifficulty = exercise.difficulty || 0.5;
        
        if (exerciseDifficulty >= levelRanges.min && exerciseDifficulty <= levelRanges.max) {
            return 1.0; // Perfect difficulty match
        } else if (exerciseDifficulty < levelRanges.min) {
            return 0.7; // Too easy but safe
        } else {
            return 0.3; // Too difficult, potentially unsafe
        }
    }

    /**
     * Calculate training goal alignment score
     */
    calculateGoalScore(exercise, sessionRequirements) {
        const trainingType = sessionRequirements.trainingType;
        
        // Base score based on exercise category alignment
        let score = 0.5;
        
        if (trainingType === 'strength' && exercise.compound) {
            score += 0.3;
        } else if (trainingType === 'hypertrophy' && exercise.hypertrophy_notes) {
            score += 0.3;
        } else if (trainingType === 'endurance' && exercise.primary_energy_system) {
            score += 0.3;
        } else if (trainingType === 'general' && exercise.difficulty <= 0.6) {
            score += 0.2;
        }
        
        // Bonus for specific session energy considerations
        if (sessionRequirements.energyLevel === 'low' && exercise.difficulty <= 0.4) {
            score += 0.2;
        } else if (sessionRequirements.energyLevel === 'high' && exercise.difficulty >= 0.7) {
            score += 0.1;
        }
        
        return Math.min(1.0, score);
    }

    /**
     * Calculate individual response bonus based on historical performance
     */
    calculateResponseBonus(exercise) {
        const exerciseId = exercise.id;
        if (!this.exerciseResponses.has(exerciseId)) return 0;
        
        const response = this.exerciseResponses.get(exerciseId);
        const improvementRate = response.progressionRate || 0;
        const adherenceRate = response.adherenceRate || 0.5;
        const userRating = response.userRating || 0.5;
        
        // Combine metrics for overall response score
        const responseScore = (improvementRate * 0.4) + (adherenceRate * 0.3) + (userRating * 0.3);
        
        return Math.max(-0.2, Math.min(0.3, responseScore - 0.5)); // -20% to +30% adjustment
    }

    /**
     * Select primary exercises from scored list
     */
    selectPrimaryExercises(scoredExercises, sessionRequirements) {
        const targetCount = sessionRequirements.exerciseCount || 4;
        const selected = [];
        const usedMovementPatterns = new Set();
        const usedMuscleGroups = new Set();

        for (const exercise of scoredExercises) {
            if (selected.length >= targetCount) break;
            
            // Avoid too much overlap in movement patterns
            const movementPattern = exercise.movement_pattern;
            const primaryMuscles = exercise.primary_muscles || [];
            
            // Check for excessive overlap
            const hasMovementOverlap = movementPattern && usedMovementPatterns.has(movementPattern);
            const hasMuscleOverlap = primaryMuscles.some(muscle => usedMuscleGroups.has(muscle));
            
            // Allow some overlap for advanced users or specific requirements
            const overlapThreshold = this.userProfile.experience === 'advanced' ? 0.7 : 0.5;
            
            if (!hasMovementOverlap || selected.length < 2 || exercise.aiScore > overlapThreshold) {
                selected.push(exercise);
                if (movementPattern) usedMovementPatterns.add(movementPattern);
                primaryMuscles.forEach(muscle => usedMuscleGroups.add(muscle));
            }
        }

        return selected;
    }

    /**
     * Enhance exercise with alternatives and progressions
     */
    enhanceExerciseWithOptions(exercise, constraints) {
        const enhanced = { ...exercise };
        
        // Find suitable alternatives
        enhanced.smartAlternatives = this.findSmartAlternatives(exercise, constraints);
        
        // Find appropriate progressions/regressions
        enhanced.adaptiveOptions = this.findAdaptiveOptions(exercise, constraints);
        
        // Add specific recommendations
        enhanced.aiRecommendations = this.generateExerciseRecommendations(exercise, constraints);
        
        return enhanced;
    }

    /**
     * Find smart alternatives for an exercise
     */
    findSmartAlternatives(exercise, constraints) {
        const alternatives = [];
        
        // Get alternatives from exercise definition
        const definedAlternatives = exercise.alternatives || [];
        
        for (const altId of definedAlternatives) {
            const alternative = this.findExerciseById(altId);
            if (alternative) {
                const score = this.calculateExerciseScore(alternative, constraints, {
                    trainingType: this.userProfile.trainingGoal,
                    targetMuscleGroups: exercise.primary_muscles
                });
                
                if (score > 0.4) { // Only include viable alternatives
                    alternatives.push({
                        ...alternative,
                        aiScore: score,
                        alternativeReason: this.generateAlternativeReason(exercise, alternative)
                    });
                }
            }
        }

        // Find movement pattern alternatives
        const patternAlternatives = this.findMovementPatternAlternatives(exercise, constraints);
        alternatives.push(...patternAlternatives);

        // Sort by score and return top alternatives
        return alternatives
            .sort((a, b) => b.aiScore - a.aiScore)
            .slice(0, 3); // Top 3 alternatives
    }

    /**
     * Find movement pattern alternatives
     */
    findMovementPatternAlternatives(exercise, constraints) {
        const movementPattern = exercise.movement_pattern;
        const intelligentMatching = this.exerciseDatabase.intelligent_matching;
        
        if (!movementPattern || !intelligentMatching.movement_patterns[movementPattern]) {
            return [];
        }

        const patternGroup = intelligentMatching.movement_patterns[movementPattern];
        const alternatives = [];

        // Check each category of alternatives
        ['variations', 'alternatives', 'bodyweight'].forEach(category => {
            if (patternGroup[category]) {
                patternGroup[category].forEach(altName => {
                    const alternative = this.findExerciseByName(altName);
                    if (alternative && alternative.id !== exercise.id) {
                        const score = this.calculateExerciseScore(alternative, constraints, {
                            trainingType: this.userProfile.trainingGoal,
                            targetMuscleGroups: exercise.primary_muscles
                        });
                        
                        if (score > 0.3) {
                            alternatives.push({
                                ...alternative,
                                aiScore: score,
                                alternativeReason: `${category} for ${movementPattern} pattern`
                            });
                        }
                    }
                });
            }
        });

        return alternatives;
    }

    /**
     * Find adaptive options (progressions/regressions)
     */
    findAdaptiveOptions(exercise, constraints) {
        const adaptiveOptions = {
            progressions: [],
            regressions: [],
            modifications: []
        };

        // Find progressions
        if (exercise.progressions) {
            exercise.progressions.forEach(progId => {
                const progression = this.findExerciseById(progId) || this.findExerciseByName(progId);
                if (progression) {
                    adaptiveOptions.progressions.push({
                        ...progression,
                        adaptiveReason: 'Increased difficulty for progression'
                    });
                }
            });
        }

        // Find regressions
        if (exercise.regressions) {
            exercise.regressions.forEach(regId => {
                const regression = this.findExerciseById(regId) || this.findExerciseByName(regId);
                if (regression) {
                    adaptiveOptions.regressions.push({
                        ...regression,
                        adaptiveReason: 'Reduced difficulty for safety/skill building'
                    });
                }
            });
        }

        // Find injury-specific modifications
        if (constraints.injuries.length > 0) {
            const injuryMods = this.findInjuryModifications(exercise, constraints.injuries);
            adaptiveOptions.modifications.push(...injuryMods);
        }

        return adaptiveOptions;
    }

    /**
     * Find injury-specific modifications
     */
    findInjuryModifications(exercise, injuries) {
        const modifications = [];
        const substitutionMatrix = exercise.substitution_matrix || {};

        injuries.forEach(injury => {
            const injuryKey = `injury_${injury}`;
            if (substitutionMatrix[injuryKey]) {
                substitutionMatrix[injuryKey].forEach(modName => {
                    const modification = this.findExerciseByName(modName);
                    if (modification) {
                        modifications.push({
                            ...modification,
                            adaptiveReason: `Modified for ${injury} injury`
                        });
                    }
                });
            }
        });

        return modifications;
    }

    /**
     * Generate exercise-specific recommendations
     */
    generateExerciseRecommendations(exercise, constraints) {
        const recommendations = [];

        // Training-specific recommendations
        if (exercise.hypertrophy_notes) {
            recommendations.push({
                type: 'technique',
                message: exercise.hypertrophy_notes.mind_muscle || 'Focus on mind-muscle connection'
            });
        }

        if (exercise.endurance_notes) {
            recommendations.push({
                type: 'intensity',
                message: `Target ${exercise.endurance_notes.rpe_target?.join('-') || '6-8'} RPE`
            });
        }

        // Biomechanical recommendations
        if (exercise.biomechanical_notes && constraints.anthropometry) {
            Object.entries(exercise.biomechanical_notes).forEach(([factor, note]) => {
                if (constraints.anthropometry[factor]) {
                    recommendations.push({
                        type: 'biomechanical',
                        message: note
                    });
                }
            });
        }

        // Experience-based recommendations
        if (constraints.experience === 'beginner') {
            recommendations.push({
                type: 'beginner',
                message: 'Focus on learning proper form before increasing intensity'
            });
        }

        return recommendations;
    }

    /**
     * Optimize exercise order within a session
     */
    optimizeExerciseOrder(exercises) {
        return exercises.sort((a, b) => {
            // Compound movements first
            if (a.compound && !b.compound) return -1;
            if (!a.compound && b.compound) return 1;
            
            // Higher difficulty first (when both compound or both isolation)
            if (a.compound === b.compound) {
                return (b.difficulty || 0.5) - (a.difficulty || 0.5);
            }
            
            return 0;
        });
    }

    /**
     * Track exercise response for adaptive learning
     * @param {string} exerciseId - Exercise identifier
     * @param {Object} performanceData - Performance metrics for the exercise
     */
    trackExerciseResponse(exerciseId, performanceData) {
        const {
            progressionRate, // How fast user progressed (weekly % improvement)
            adherenceRate,   // How often user completed exercise as planned
            userRating,      // User's subjective rating (1-10)
            injuryRate,      // Any injury incidents (0-1)
            motivationImpact // Impact on motivation (positive/negative)
        } = performanceData;

        if (!this.exerciseResponses.has(exerciseId)) {
            this.exerciseResponses.set(exerciseId, {
                progressionRate: 0,
                adherenceRate: 0,
                userRating: 5,
                injuryRate: 0,
                motivationImpact: 0,
                sessionCount: 0,
                lastUpdated: new Date()
            });
        }

        const current = this.exerciseResponses.get(exerciseId);
        const sessionCount = current.sessionCount + 1;
        
        // Update with exponential moving average (more weight to recent data)
        const alpha = 0.3; // Learning rate
        
        this.exerciseResponses.set(exerciseId, {
            progressionRate: current.progressionRate * (1 - alpha) + (progressionRate || 0) * alpha,
            adherenceRate: current.adherenceRate * (1 - alpha) + (adherenceRate || 0) * alpha,
            userRating: current.userRating * (1 - alpha) + (userRating || 5) * alpha,
            injuryRate: current.injuryRate * (1 - alpha) + (injuryRate || 0) * alpha,
            motivationImpact: current.motivationImpact * (1 - alpha) + (motivationImpact || 0) * alpha,
            sessionCount: sessionCount,
            lastUpdated: new Date()
        });

        console.log(`📊 Updated response data for ${exerciseId}:`, this.exerciseResponses.get(exerciseId));
    }

    /**
     * Suggest exercise substitutions based on plateau or issues
     * @param {string} exerciseId - Exercise that needs substitution
     * @param {string} reason - Reason for substitution
     * @returns {Array} Array of suggested substitutions
     */
    suggestSubstitutions(exerciseId, reason) {
        const exercise = this.findExerciseById(exerciseId);
        if (!exercise) return [];

        const constraints = this.buildConstraintMatrix();
        let substitutions = [];

        switch (reason) {
            case 'plateau':
                substitutions = this.handlePlateauSubstitution(exercise, constraints);
                break;
            case 'injury':
                substitutions = this.handleInjurySubstitution(exercise, constraints);
                break;
            case 'equipment':
                substitutions = this.handleEquipmentSubstitution(exercise, constraints);
                break;
            case 'motivation':
                substitutions = this.handleMotivationSubstitution(exercise, constraints);
                break;
            default:
                substitutions = this.findSmartAlternatives(exercise, constraints);
        }

        // Log substitution for learning
        this.substituionHistory.push({
            date: new Date(),
            originalExercise: exerciseId,
            reason: reason,
            substitutions: substitutions.map(s => s.id)
        });

        return substitutions;
    }

    /**
     * Handle plateau-specific substitutions
     */
    handlePlateauSubstitution(exercise, constraints) {
        // Look for variations that provide novel stimulus
        const alternatives = this.findSmartAlternatives(exercise, constraints);
        
        // Prioritize variations and progressions
        return alternatives.filter(alt => 
            alt.alternativeReason?.includes('variation') ||
            alt.alternativeReason?.includes('progression')
        ).slice(0, 3);
    }

    /**
     * Handle injury-specific substitutions
     */
    handleInjurySubstitution(exercise, constraints) {
        return this.findAdaptiveOptions(exercise, constraints).modifications
            .concat(this.findAdaptiveOptions(exercise, constraints).regressions)
            .slice(0, 3);
    }

    /**
     * Handle equipment-limited substitutions
     */
    handleEquipmentSubstitution(exercise, constraints) {
        const alternatives = this.findSmartAlternatives(exercise, constraints);
        
        // Prioritize bodyweight and available equipment alternatives
        return alternatives
            .filter(alt => this.calculateEquipmentScore(alt, constraints.equipment) > 0.8)
            .slice(0, 3);
    }

    /**
     * Handle motivation-focused substitutions
     */
    handleMotivationSubstitution(exercise, constraints) {
        const alternatives = this.findSmartAlternatives(exercise, constraints);
        
        // Look for more engaging or novel exercises
        return alternatives
            .filter(alt => alt.difficulty !== exercise.difficulty || alt.movement_pattern !== exercise.movement_pattern)
            .slice(0, 3);
    }

    /**
     * Utility methods
     */
    findExerciseById(id) {
        for (const category of Object.values(this.exerciseDatabase.categories)) {
            for (const subcategory of Object.values(category)) {
                if (Array.isArray(subcategory)) {
                    const exercise = subcategory.find(ex => ex.id === id);
                    if (exercise) return exercise;
                }
            }
        }
        return null;
    }

    findExerciseByName(name) {
        for (const category of Object.values(this.exerciseDatabase.categories)) {
            for (const subcategory of Object.values(category)) {
                if (Array.isArray(subcategory)) {
                    const exercise = subcategory.find(ex => 
                        ex.name.toLowerCase() === name.toLowerCase() ||
                        ex.name.toLowerCase().includes(name.toLowerCase())
                    );
                    if (exercise) return exercise;
                }
            }
        }
        return null;
    }

    identifyContraindications() {
        // Build list of exercise contraindications based on user profile
        const contraindications = [];
        
        if (this.userProfile.injuries) {
            this.userProfile.injuries.forEach(injury => {
                const rules = this.exerciseDatabase.substitution_rules.by_injury[injury];
                if (rules && rules.avoid) {
                    contraindications.push(...rules.avoid);
                }
            });
        }

        return contraindications;
    }

    generateSelectionReasoning(exercise, score, constraints) {
        const reasons = [];
        
        if (score > 0.8) reasons.push('Excellent match for your profile');
        else if (score > 0.6) reasons.push('Good option for your goals');
        else if (score > 0.4) reasons.push('Suitable with some limitations');
        else reasons.push('Available but not optimal');

        if (constraints.injuries.length > 0) {
            reasons.push('Injury considerations applied');
        }

        if (this.exerciseResponses.has(exercise.id)) {
            const response = this.exerciseResponses.get(exercise.id);
            if (response.userRating > 7) reasons.push('You respond well to this exercise');
            if (response.progressionRate > 0.1) reasons.push('Good progression history');
        }

        return reasons.join('; ');
    }

    generateAlternativeReason(original, alternative) {
        if (alternative.equipment !== original.equipment) {
            return 'Equipment substitution';
        }
        if (alternative.difficulty !== original.difficulty) {
            return alternative.difficulty > original.difficulty ? 'Progression option' : 'Regression option';
        }
        if (alternative.movement_pattern === original.movement_pattern) {
            return 'Same movement pattern variation';
        }
        return 'Functional alternative';
    }

    getFallbackDatabase() {
        // Minimal fallback database for when file loading fails
        return {
            categories: {
                general_fitness: {
                    functional_movements: [
                        {
                            id: 'bodyweight_squat',
                            name: 'Bodyweight Squat',
                            primary_muscles: ['quadriceps', 'glutes'],
                            equipment: [],
                            difficulty: 0.3,
                            movement_pattern: 'squat',
                            compound: true
                        },
                        {
                            id: 'pushup',
                            name: 'Push-up',
                            primary_muscles: ['chest', 'triceps'],
                            equipment: [],
                            difficulty: 0.5,
                            movement_pattern: 'horizontal_push',
                            compound: true
                        }
                    ]
                }
            },
            substitution_rules: { by_injury: {}, by_equipment: {} },
            intelligent_matching: { movement_patterns: {}, muscle_groups: {} },
            ai_selection_criteria: {
                priority_factors: [
                    { factor: 'injury_safety', weight: 0.30 },
                    { factor: 'equipment_availability', weight: 0.25 },
                    { factor: 'movement_pattern_match', weight: 0.20 },
                    { factor: 'experience_appropriateness', weight: 0.15 },
                    { factor: 'training_goal_alignment', weight: 0.10 }
                ]
            }
        };
    }
}

module.exports = ExerciseAI;