/**
 * Adaptive Periodization Integration
 * Integrates PeriodizationAI with existing adaptive systems for comprehensive training intelligence
 */

const AdaptiveAI = require('./adaptive-ai');
const PeriodizationAI = require('./periodization-ai');
const PerformanceTracker = require('./performance-tracker');
const ExerciseAI = require('./exercise-ai');

class AdaptivePeriodizationSystem {
    constructor(athleteProfile) {
        this.athleteProfile = athleteProfile;
        this.trainingType = athleteProfile.trainingType || 'strength';
        
        // Initialize all AI systems
        this.adaptiveAI = new AdaptiveAI(this.trainingType);
        this.periodizationAI = new PeriodizationAI(this.trainingType);
        this.performanceTracker = new PerformanceTracker();
        this.exerciseAI = new ExerciseAI();
        
        // Integration state
        this.currentPeriodizationPlan = null;
        this.integrationHistory = [];
        this.systemStatus = 'initializing';
        
        console.log('🏗️ Initializing Adaptive Periodization System for:', athleteProfile.name);
    }

    /**
     * Initialize the integrated system with athlete profile and goals
     */
    async initialize(goalParameters) {
        try {
            console.log('🚀 Setting up integrated adaptive periodization...');
            
            // Create periodization plan
            this.currentPeriodizationPlan = this.periodizationAI.createPeriodizationPlan(
                this.athleteProfile, 
                goalParameters
            );
            
            // Initialize adaptive AI with periodization context
            await this.adaptiveAI.initializeWithPeriodization(this.currentPeriodizationPlan);
            
            // Set up performance tracking for periodization
            this.performanceTracker.initializePeriodizationTracking(this.currentPeriodizationPlan);
            
            // Initialize exercise AI with periodization preferences
            this.exerciseAI.setPeriodizationContext(this.currentPeriodizationPlan);
            
            this.systemStatus = 'active';
            
            console.log('✅ Adaptive Periodization System initialized successfully');
            
            return {
                success: true,
                plan: this.currentPeriodizationPlan,
                status: this.systemStatus
            };
            
        } catch (error) {
            this.systemStatus = 'error';
            console.error('❌ Failed to initialize Adaptive Periodization System:', error);
            
            return {
                success: false,
                error: error.message,
                status: this.systemStatus
            };
        }
    }

    /**
     * Generate adaptive workout with periodization intelligence
     */
    async generateAdaptiveWorkout(currentWeek, workoutType = 'main') {
        if (!this.currentPeriodizationPlan) {
            throw new Error('Periodization plan not initialized');
        }
        
        console.log(`🏋️ Generating adaptive workout for Week ${currentWeek}...`);
        
        try {
            // Get base workout from exercise AI
            const baseWorkout = await this.exerciseAI.generateWorkout(
                this.athleteProfile,
                workoutType
            );
            
            // Apply periodization modifications
            const periodizedWorkout = this.periodizationAI.adaptWorkoutToPeriodization(
                baseWorkout,
                currentWeek
            );
            
            // Apply real-time adaptive modifications
            const recentPerformance = this.performanceTracker.getRecentPerformanceData(7); // Last 7 days
            const adaptiveWorkout = await this.adaptiveAI.adaptWorkout(
                periodizedWorkout,
                recentPerformance
            );
            
            // Add integration metadata
            adaptiveWorkout.integrationMetadata = {
                generatedAt: new Date().toISOString(),
                week: currentWeek,
                periodizationPhase: this.getCurrentPhase(currentWeek),
                adaptiveModifications: this.getAdaptiveModifications(adaptiveWorkout),
                systemStatus: this.systemStatus
            };
            
            console.log(`✅ Generated adaptive workout for ${adaptiveWorkout.integrationMetadata.periodizationPhase} phase`);
            
            return adaptiveWorkout;
            
        } catch (error) {
            console.error('❌ Failed to generate adaptive workout:', error);
            throw error;
        }
    }

    /**
     * Comprehensive analysis combining all AI systems
     */
    async analyzePerformanceAndAdapt(workoutData) {
        console.log('📊 Running comprehensive performance analysis...');
        
        try {
            // Record workout in all systems
            await this.recordWorkoutAcrossSystems(workoutData);
            
            // Get analysis from each system
            const [
                adaptiveAnalysis,
                periodizationAnalysis,
                performanceAnalysis,
                exerciseAnalysis
            ] = await Promise.all([
                this.adaptiveAI.analyzeWorkout(workoutData),
                this.analyzeWithPeriodization(workoutData),
                this.performanceTracker.analyzePerformance(workoutData),
                this.exerciseAI.analyzeExercisePerformance(workoutData)
            ]);
            
            // Integrate all analyses
            const integratedAnalysis = this.integrateAnalyses({
                adaptive: adaptiveAnalysis,
                periodization: periodizationAnalysis,
                performance: performanceAnalysis,
                exercise: exerciseAnalysis
            });
            
            // Generate unified recommendations
            const unifiedRecommendations = this.generateUnifiedRecommendations(integratedAnalysis);
            
            // Log integration event
            this.logIntegrationEvent('performance_analysis', {
                analysis: integratedAnalysis,
                recommendations: unifiedRecommendations
            });
            
            console.log('✅ Comprehensive analysis complete');
            
            return {
                success: true,
                integratedAnalysis,
                recommendations: unifiedRecommendations,
                systemStatus: this.systemStatus
            };
            
        } catch (error) {
            console.error('❌ Comprehensive analysis failed:', error);
            return {
                success: false,
                error: error.message,
                systemStatus: this.systemStatus
            };
        }
    }

    /**
     * Monitor all systems and adapt periodization as needed
     */
    async monitorAndAdaptSystems() {
        console.log('🔍 Monitoring integrated systems...');
        
        try {
            const currentWeek = this.periodizationAI.getCurrentWeek();
            const recentData = this.performanceTracker.getRecentPerformanceData(14); // Last 2 weeks
            
            // Check each system for adaptation needs
            const systemChecks = await Promise.all([
                this.adaptiveAI.checkAdaptationNeeds(recentData),
                this.periodizationAI.monitorAndAdaptPeriodization(recentData),
                this.performanceTracker.assessAdaptationReadiness(recentData),
                this.exerciseAI.evaluateExerciseEffectiveness(recentData)
            ]);
            
            // Determine if system-wide adaptations are needed
            const systemAdaptations = this.assessSystemWideAdaptations(systemChecks);
            
            // Apply adaptations if needed
            if (systemAdaptations.needed) {
                await this.applySystemAdaptations(systemAdaptations);
            }
            
            // Update system status
            this.updateSystemStatus(systemChecks, systemAdaptations);
            
            return {
                success: true,
                currentWeek,
                systemChecks,
                adaptations: systemAdaptations,
                status: this.systemStatus
            };
            
        } catch (error) {
            console.error('❌ System monitoring failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get current phase information
     */
    getCurrentPhase(week) {
        if (!this.currentPeriodizationPlan) return 'unknown';
        
        const microcycle = this.currentPeriodizationPlan.microcycles.find(m => m.week === week);
        return microcycle ? microcycle.phase : 'unknown';
    }

    /**
     * Record workout across all systems
     */
    async recordWorkoutAcrossSystems(workoutData) {
        const recordings = await Promise.allSettled([
            this.adaptiveAI.recordWorkoutSession(workoutData),
            this.performanceTracker.recordWorkout(workoutData),
            this.exerciseAI.recordExercisePerformance(workoutData)
        ]);
        
        // Log any recording failures
        recordings.forEach((result, index) => {
            const systems = ['adaptive', 'performance', 'exercise'];
            if (result.status === 'rejected') {
                console.warn(`⚠️ Failed to record in ${systems[index]} system:`, result.reason);
            }
        });
    }

    /**
     * Analyze workout with periodization context
     */
    async analyzeWithPeriodization(workoutData) {
        const currentWeek = Math.floor((new Date() - new Date(this.currentPeriodizationPlan.startDate)) / (7 * 24 * 60 * 60 * 1000)) + 1;
        const recentData = this.performanceTracker.getRecentPerformanceData(7);
        
        return this.periodizationAI.monitorAndAdaptPeriodization(recentData);
    }

    /**
     * Integrate analyses from all systems
     */
    integrateAnalyses({ adaptive, periodization, performance, exercise }) {
        return {
            timestamp: new Date().toISOString(),
            
            // Fatigue assessment
            fatigue: {
                adaptive: adaptive.fatigue || {},
                periodization: periodization.analysis?.trends?.avgRPE || {},
                performance: performance.trends?.rpe || {},
                integrated: this.calculateIntegratedFatigue({ adaptive, periodization, performance })
            },
            
            // Readiness assessment
            readiness: {
                adaptive: adaptive.readiness || {},
                performance: performance.readiness || {},
                integrated: this.calculateIntegratedReadiness({ adaptive, performance })
            },
            
            // Progression analysis
            progression: {
                periodization: periodization.analysis?.adaptation || {},
                performance: performance.progression || {},
                exercise: exercise.effectiveness || {},
                integrated: this.calculateIntegratedProgression({ periodization, performance, exercise })
            },
            
            // System confidence
            confidence: this.calculateSystemConfidence({ adaptive, periodization, performance, exercise })
        };
    }

    /**
     * Generate unified recommendations from all systems
     */
    generateUnifiedRecommendations(integratedAnalysis) {
        const recommendations = {
            priority: [],
            secondary: [],
            longTerm: []
        };
        
        // High-priority recommendations
        if (integratedAnalysis.fatigue.integrated.level === 'high') {
            recommendations.priority.push({
                type: 'deload',
                urgency: 'immediate',
                source: 'integrated_fatigue_analysis',
                description: 'Implement deload week due to high integrated fatigue levels',
                implementation: 'reduce_volume_40_percent_reduce_intensity_15_percent'
            });
        }
        
        if (integratedAnalysis.readiness.integrated.score < 0.6) {
            recommendations.priority.push({
                type: 'recovery_focus',
                urgency: 'high',
                source: 'integrated_readiness_analysis',
                description: 'Focus on recovery protocols due to low readiness scores',
                implementation: 'sleep_stress_nutrition_optimization'
            });
        }
        
        // Secondary recommendations
        if (integratedAnalysis.progression.integrated.efficiency < 0.7) {
            recommendations.secondary.push({
                type: 'program_modification',
                urgency: 'medium',
                source: 'integrated_progression_analysis',
                description: 'Modify training stimulus due to suboptimal progression',
                implementation: 'exercise_selection_volume_intensity_adjustment'
            });
        }
        
        // Long-term recommendations
        if (integratedAnalysis.confidence < 0.8) {
            recommendations.longTerm.push({
                type: 'data_quality_improvement',
                urgency: 'low',
                source: 'system_confidence_analysis',
                description: 'Improve data collection quality for better AI recommendations',
                implementation: 'enhanced_subjective_tracking_HRV_integration'
            });
        }
        
        return recommendations;
    }

    /**
     * Calculate integrated fatigue from multiple systems
     */
    calculateIntegratedFatigue({ adaptive, periodization, performance }) {
        const factors = [];
        
        if (adaptive.fatigue?.level) {
            factors.push(this.normalizeFatigueLevel(adaptive.fatigue.level));
        }
        
        if (periodization.analysis?.trends?.avgRPE?.direction) {
            factors.push(periodization.analysis.trends.avgRPE.direction === 'increasing' ? 0.8 : 0.4);
        }
        
        if (performance.trends?.rpe?.slope) {
            factors.push(Math.min(1.0, Math.max(0.0, performance.trends.rpe.slope * 2 + 0.5)));
        }
        
        const averageFatigue = factors.length > 0 ? factors.reduce((a, b) => a + b, 0) / factors.length : 0.5;
        
        return {
            level: averageFatigue > 0.8 ? 'high' : averageFatigue > 0.6 ? 'moderate' : 'low',
            score: averageFatigue,
            confidence: factors.length / 3, // Based on available data sources
            factors: factors.length
        };
    }

    /**
     * Calculate integrated readiness
     */
    calculateIntegratedReadiness({ adaptive, performance }) {
        const factors = [];
        
        if (adaptive.readiness?.score) {
            factors.push(adaptive.readiness.score);
        }
        
        if (performance.readiness?.score) {
            factors.push(performance.readiness.score);
        }
        
        const averageReadiness = factors.length > 0 ? factors.reduce((a, b) => a + b, 0) / factors.length : 0.7;
        
        return {
            score: averageReadiness,
            level: averageReadiness > 0.8 ? 'high' : averageReadiness > 0.6 ? 'moderate' : 'low',
            confidence: factors.length / 2,
            factors: factors.length
        };
    }

    /**
     * Calculate integrated progression
     */
    calculateIntegratedProgression({ periodization, performance, exercise }) {
        const factors = [];
        
        if (periodization.analysis?.adaptation?.overall) {
            factors.push(this.normalizeAdaptationQuality(periodization.analysis.adaptation.overall));
        }
        
        if (performance.progression?.efficiency) {
            factors.push(performance.progression.efficiency);
        }
        
        if (exercise.effectiveness?.overall) {
            factors.push(exercise.effectiveness.overall);
        }
        
        const averageProgression = factors.length > 0 ? factors.reduce((a, b) => a + b, 0) / factors.length : 0.7;
        
        return {
            efficiency: averageProgression,
            level: averageProgression > 0.8 ? 'excellent' : averageProgression > 0.6 ? 'good' : 'suboptimal',
            confidence: factors.length / 3,
            factors: factors.length
        };
    }

    /**
     * Calculate system confidence
     */
    calculateSystemConfidence({ adaptive, periodization, performance, exercise }) {
        const confidences = [];
        
        if (adaptive.confidence) confidences.push(adaptive.confidence);
        if (periodization.confidence) confidences.push(periodization.confidence);
        if (performance.confidence) confidences.push(performance.confidence);
        if (exercise.confidence) confidences.push(exercise.confidence);
        
        return confidences.length > 0 ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0.7;
    }

    /**
     * Utility methods
     */
    normalizeFatigueLevel(level) {
        const levels = { low: 0.2, moderate: 0.5, high: 0.8, very_high: 1.0 };
        return levels[level] || 0.5;
    }

    normalizeAdaptationQuality(quality) {
        const qualities = { poor: 0.2, fair: 0.4, good: 0.6, excellent: 0.8 };
        return qualities[quality] || 0.6;
    }

    getAdaptiveModifications(workout) {
        const modifications = [];
        
        if (workout.modifications) {
            modifications.push(...workout.modifications);
        }
        
        if (workout.periodizationContext) {
            modifications.push({
                type: 'periodization',
                phase: workout.periodizationContext.phase,
                week: workout.periodizationContext.week
            });
        }
        
        return modifications;
    }

    /**
     * System-wide adaptation assessment and application
     */
    assessSystemWideAdaptations(systemChecks) {
        const adaptations = {
            needed: false,
            changes: [],
            confidence: 0.8
        };
        
        // Check if multiple systems indicate adaptation needs
        const adaptationSignals = systemChecks.filter(check => check.adaptationNeeded).length;
        
        if (adaptationSignals >= 2) {
            adaptations.needed = true;
            adaptations.changes.push({
                type: 'system_wide_adjustment',
                reason: 'Multiple systems indicate adaptation needs',
                systems: systemChecks.filter(check => check.adaptationNeeded).length
            });
        }
        
        return adaptations;
    }

    async applySystemAdaptations(adaptations) {
        console.log('🔧 Applying system-wide adaptations...');
        
        for (const change of adaptations.changes) {
            switch (change.type) {
                case 'system_wide_adjustment':
                    await this.implementSystemWideAdjustment();
                    break;
            }
        }
    }

    async implementSystemWideAdjustment() {
        // Coordinate adaptation across all systems
        const currentWeek = this.periodizationAI.getCurrentWeek();
        
        // Trigger deload in periodization
        this.periodizationAI.implementDeloadModification();
        
        // Update adaptive AI sensitivity
        this.adaptiveAI.adjustSensitivity(1.2);
        
        // Reset exercise effectiveness tracking
        this.exerciseAI.resetEffectivenessTracking();
        
        console.log('✅ System-wide adjustment implemented');
    }

    updateSystemStatus(systemChecks, adaptations) {
        const failedSystems = systemChecks.filter(check => !check.success).length;
        
        if (failedSystems === 0) {
            this.systemStatus = adaptations.needed ? 'adapting' : 'active';
        } else if (failedSystems < systemChecks.length / 2) {
            this.systemStatus = 'degraded';
        } else {
            this.systemStatus = 'error';
        }
    }

    logIntegrationEvent(type, data) {
        const event = {
            timestamp: new Date().toISOString(),
            type,
            data,
            systemStatus: this.systemStatus
        };
        
        this.integrationHistory.push(event);
        
        // Keep only last 100 events
        if (this.integrationHistory.length > 100) {
            this.integrationHistory = this.integrationHistory.slice(-100);
        }
    }

    /**
     * Export integrated system data
     */
    exportIntegratedData() {
        return {
            version: '1.0',
            timestamp: new Date().toISOString(),
            athleteProfile: this.athleteProfile,
            periodizationPlan: this.currentPeriodizationPlan,
            integrationHistory: this.integrationHistory,
            systemStatus: this.systemStatus,
            adaptiveData: this.adaptiveAI.exportData(),
            performanceData: this.performanceTracker.exportData(),
            exerciseData: this.exerciseAI.exportData()
        };
    }

    /**
     * Import integrated system data
     */
    async importIntegratedData(data) {
        try {
            if (data.athleteProfile) {
                this.athleteProfile = data.athleteProfile;
            }
            
            if (data.periodizationPlan) {
                this.currentPeriodizationPlan = data.periodizationPlan;
                this.periodizationAI.importPeriodizationPlan({ plan: data.periodizationPlan });
            }
            
            if (data.integrationHistory) {
                this.integrationHistory = data.integrationHistory;
            }
            
            if (data.adaptiveData) {
                await this.adaptiveAI.importData(data.adaptiveData);
            }
            
            if (data.performanceData) {
                this.performanceTracker.importData(data.performanceData);
            }
            
            if (data.exerciseData) {
                this.exerciseAI.importData(data.exerciseData);
            }
            
            this.systemStatus = 'active';
            
            return { success: true, imported: 'Integrated system data loaded' };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = AdaptivePeriodizationSystem;