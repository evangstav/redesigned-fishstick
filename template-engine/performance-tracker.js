/**
 * Performance Tracker - Comprehensive performance analysis and trend monitoring
 * Tracks RPE, volume, strength progression, and recovery markers
 */

class PerformanceTracker {
    constructor() {
        this.performanceHistory = [];
        this.metrics = {
            rpe: [],
            volume: [],
            strength: [],
            recovery: [],
            adherence: []
        };
        this.benchmarks = this.initializeBenchmarks();
    }

    /**
     * Initialize performance benchmarks
     */
    initializeBenchmarks() {
        return {
            rpe: {
                optimal: { min: 7.0, max: 8.5 },
                warning: { min: 8.5, max: 9.5 },
                critical: { min: 9.5, max: 10.0 }
            },
            volumeProgression: {
                weekly: { min: 0.02, max: 0.10 }, // 2-10% weekly increase
                monthly: { min: 0.10, max: 0.30 } // 10-30% monthly increase
            },
            strengthProgression: {
                beginner: { weekly: 0.025, monthly: 0.10 }, // 2.5% weekly, 10% monthly
                intermediate: { weekly: 0.01, monthly: 0.05 }, // 1% weekly, 5% monthly
                advanced: { weekly: 0.005, monthly: 0.02 } // 0.5% weekly, 2% monthly
            },
            adherence: {
                excellent: 0.95,
                good: 0.85,
                acceptable: 0.75,
                poor: 0.60
            }
        };
    }

    /**
     * Record workout performance data
     * @param {Object} workoutData - Complete workout session data
     */
    recordWorkout(workoutData) {
        const sessionData = {
            date: workoutData.date || new Date().toISOString(),
            sessionId: workoutData.sessionId || this.generateSessionId(),
            duration: workoutData.duration || 0,
            exercises: this.processExerciseData(workoutData.exercises || []),
            subjective: {
                energyLevel: workoutData.energyLevel || 5,
                motivation: workoutData.motivation || 5,
                sleepQuality: workoutData.sleepQuality || 5,
                stress: workoutData.stress || 5,
                soreness: workoutData.soreness || 5
            },
            environmental: {
                location: workoutData.location || 'gym',
                equipment: workoutData.equipment || 'full',
                timeOfDay: workoutData.timeOfDay || 'morning'
            }
        };

        // Calculate session metrics
        sessionData.metrics = this.calculateSessionMetrics(sessionData);
        
        // Store session
        this.performanceHistory.push(sessionData);
        
        // Update running metrics
        this.updateMetrics(sessionData);
        
        // Trigger analysis if enough data
        if (this.performanceHistory.length >= 3) {
            return this.analyzePerformance();
        }

        return { status: 'recorded', dataPoints: this.performanceHistory.length };
    }

    /**
     * Process exercise data for analysis
     */
    processExerciseData(exercises) {
        return exercises.map(exercise => {
            const processedExercise = {
                name: exercise.name,
                category: exercise.category || 'unknown',
                isMainLift: exercise.isMainLift || false,
                sets: [],
                totalVolume: 0,
                avgRPE: 0,
                maxWeight: 0,
                estimated1RM: 0
            };

            // Process individual sets
            exercise.sets.forEach(set => {
                const processedSet = {
                    weight: set.weight || 0,
                    reps: set.reps || 0,
                    rpe: set.rpe || 0,
                    volume: (set.weight || 0) * (set.reps || 0),
                    completed: set.completed !== false
                };

                // Calculate estimated 1RM using Epley formula with RPE adjustment
                if (processedSet.weight > 0 && processedSet.reps > 0 && processedSet.rpe > 0) {
                    processedSet.estimated1RM = this.calculateEstimated1RM(
                        processedSet.weight, 
                        processedSet.reps, 
                        processedSet.rpe
                    );
                }

                processedExercise.sets.push(processedSet);
            });

            // Calculate exercise-level metrics
            const completedSets = processedExercise.sets.filter(set => set.completed);
            
            if (completedSets.length > 0) {
                processedExercise.totalVolume = completedSets.reduce((sum, set) => sum + set.volume, 0);
                processedExercise.avgRPE = completedSets.reduce((sum, set) => sum + set.rpe, 0) / completedSets.length;
                processedExercise.maxWeight = Math.max(...completedSets.map(set => set.weight));
                processedExercise.estimated1RM = Math.max(...completedSets.map(set => set.estimated1RM || 0));
            }

            return processedExercise;
        });
    }

    /**
     * Calculate estimated 1RM using Epley formula with RPE adjustments
     */
    calculateEstimated1RM(weight, reps, rpe) {
        if (weight <= 0 || reps <= 0 || rpe <= 0) return 0;

        // Base Epley formula: 1RM = weight * (1 + reps/30)
        let estimated1RM = weight * (1 + reps / 30);

        // RPE adjustments based on Helms et al. RPE-based load adjustments
        const rpeAdjustments = {
            10: 1.00,  // RPE 10 = true max
            9.5: 1.025, // ~2.5% more in tank
            9: 1.05,   // ~5% more in tank
            8.5: 1.075, // ~7.5% more in tank
            8: 1.10,   // ~10% more in tank
            7.5: 1.125, // ~12.5% more in tank
            7: 1.15,   // ~15% more in tank
            6.5: 1.175, // ~17.5% more in tank
            6: 1.20    // ~20% more in tank
        };

        const adjustment = rpeAdjustments[rpe] || 1.0;
        return Math.round(estimated1RM * adjustment);
    }

    /**
     * Calculate session-level metrics
     */
    calculateSessionMetrics(sessionData) {
        const exercises = sessionData.exercises;
        
        return {
            totalVolume: exercises.reduce((sum, ex) => sum + ex.totalVolume, 0),
            avgRPE: this.calculateWeightedAverageRPE(exercises),
            totalSets: exercises.reduce((sum, ex) => sum + ex.sets.length, 0),
            mainLiftVolume: exercises.filter(ex => ex.isMainLift).reduce((sum, ex) => sum + ex.totalVolume, 0),
            maxEstimated1RM: Math.max(...exercises.map(ex => ex.estimated1RM)),
            workoutDensity: sessionData.duration > 0 ? 
                exercises.reduce((sum, ex) => sum + ex.sets.length, 0) / (sessionData.duration / 60) : 0,
            adherenceScore: this.calculateAdherenceScore(exercises),
            intensityScore: this.calculateIntensityScore(exercises)
        };
    }

    /**
     * Calculate weighted average RPE across all exercises
     */
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

    /**
     * Calculate adherence score based on completed vs planned sets
     */
    calculateAdherenceScore(exercises) {
        let plannedSets = 0;
        let completedSets = 0;

        exercises.forEach(exercise => {
            plannedSets += exercise.sets.length;
            completedSets += exercise.sets.filter(set => set.completed).length;
        });

        return plannedSets > 0 ? completedSets / plannedSets : 0;
    }

    /**
     * Calculate intensity score based on RPE distribution
     */
    calculateIntensityScore(exercises) {
        const allRPEs = exercises.flatMap(ex => 
            ex.sets.filter(set => set.completed && set.rpe > 0).map(set => set.rpe)
        );

        if (allRPEs.length === 0) return 0;

        const avgRPE = allRPEs.reduce((sum, rpe) => sum + rpe, 0) / allRPEs.length;
        
        // Normalize to 0-100 scale (RPE 6-10 -> 0-100)
        return Math.max(0, Math.min(100, (avgRPE - 6) * 25));
    }

    /**
     * Update running performance metrics
     */
    updateMetrics(sessionData) {
        const metrics = sessionData.metrics;
        
        this.metrics.rpe.push({
            date: sessionData.date,
            value: metrics.avgRPE,
            trend: this.calculateTrend(this.metrics.rpe, metrics.avgRPE)
        });

        this.metrics.volume.push({
            date: sessionData.date,
            value: metrics.totalVolume,
            trend: this.calculateTrend(this.metrics.volume, metrics.totalVolume)
        });

        this.metrics.strength.push({
            date: sessionData.date,
            value: metrics.maxEstimated1RM,
            trend: this.calculateTrend(this.metrics.strength, metrics.maxEstimated1RM)
        });

        this.metrics.recovery.push({
            date: sessionData.date,
            value: this.calculateRecoveryScore(sessionData.subjective),
            trend: this.calculateTrend(this.metrics.recovery, this.calculateRecoveryScore(sessionData.subjective))
        });

        this.metrics.adherence.push({
            date: sessionData.date,
            value: metrics.adherenceScore,
            trend: this.calculateTrend(this.metrics.adherence, metrics.adherenceScore)
        });

        // Keep only last 50 data points for performance
        Object.keys(this.metrics).forEach(key => {
            if (this.metrics[key].length > 50) {
                this.metrics[key] = this.metrics[key].slice(-50);
            }
        });
    }

    /**
     * Calculate trend for metric
     */
    calculateTrend(metricHistory, newValue) {
        if (metricHistory.length < 2) return 'stable';
        
        const recentValues = metricHistory.slice(-5).map(m => m.value);
        recentValues.push(newValue);
        
        const trend = this.calculateLinearTrend(recentValues);
        
        if (trend > 0.05) return 'increasing';
        if (trend < -0.05) return 'decreasing';
        return 'stable';
    }

    /**
     * Calculate linear trend coefficient
     */
    calculateLinearTrend(values) {
        const n = values.length;
        if (n < 2) return 0;

        const xMean = (n - 1) / 2;
        const yMean = values.reduce((sum, y) => sum + y, 0) / n;
        
        let numerator = 0, denominator = 0;
        for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (values[i] - yMean);
            denominator += (i - xMean) * (i - xMean);
        }

        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Calculate recovery score from subjective measures
     */
    calculateRecoveryScore(subjective) {
        const weights = {
            energyLevel: 0.25,
            sleepQuality: 0.30,
            stress: 0.15, // inverse relationship
            soreness: 0.15, // inverse relationship
            motivation: 0.15
        };

        let score = 0;
        score += subjective.energyLevel * weights.energyLevel;
        score += subjective.sleepQuality * weights.sleepQuality;
        score += (10 - subjective.stress) * weights.stress; // invert stress
        score += (10 - subjective.soreness) * weights.soreness; // invert soreness
        score += subjective.motivation * weights.motivation;

        return Math.round(score * 10) / 10; // Round to 1 decimal
    }

    /**
     * Comprehensive performance analysis
     */
    analyzePerformance() {
        const recentSessions = this.performanceHistory.slice(-10);
        
        return {
            overview: this.generateOverview(recentSessions),
            trends: this.analyzeTrends(),
            recommendations: this.generateRecommendations(),
            alerts: this.checkAlerts(),
            predictions: this.generatePredictions()
        };
    }

    /**
     * Generate performance overview
     */
    generateOverview(sessions) {
        if (sessions.length === 0) return {};

        const latest = sessions[sessions.length - 1];
        const avgMetrics = this.calculateAverageMetrics(sessions);

        return {
            sessionsAnalyzed: sessions.length,
            latestSession: {
                date: latest.date,
                volume: latest.metrics.totalVolume,
                avgRPE: latest.metrics.avgRPE,
                estimated1RM: latest.metrics.maxEstimated1RM
            },
            averages: avgMetrics,
            consistency: this.calculateConsistency(sessions),
            overallTrend: this.calculateOverallTrend(sessions)
        };
    }

    /**
     * Calculate average metrics across sessions
     */
    calculateAverageMetrics(sessions) {
        if (sessions.length === 0) return {};

        const totals = sessions.reduce((acc, session) => {
            acc.volume += session.metrics.totalVolume;
            acc.rpe += session.metrics.avgRPE;
            acc.adherence += session.metrics.adherenceScore;
            acc.recovery += this.calculateRecoveryScore(session.subjective);
            return acc;
        }, { volume: 0, rpe: 0, adherence: 0, recovery: 0 });

        const count = sessions.length;
        return {
            avgVolume: Math.round(totals.volume / count),
            avgRPE: Math.round((totals.rpe / count) * 10) / 10,
            avgAdherence: Math.round((totals.adherence / count) * 100),
            avgRecovery: Math.round((totals.recovery / count) * 10) / 10
        };
    }

    /**
     * Analyze performance trends
     */
    analyzeTrends() {
        return {
            rpe: this.getTrendSummary(this.metrics.rpe),
            volume: this.getTrendSummary(this.metrics.volume),
            strength: this.getTrendSummary(this.metrics.strength),
            recovery: this.getTrendSummary(this.metrics.recovery),
            adherence: this.getTrendSummary(this.metrics.adherence)
        };
    }

    /**
     * Get trend summary for a metric
     */
    getTrendSummary(metricData) {
        if (metricData.length < 3) {
            return { trend: 'insufficient_data', confidence: 'low' };
        }

        const recent = metricData.slice(-7); // Last 7 data points
        const values = recent.map(d => d.value);
        const trend = this.calculateLinearTrend(values);
        
        return {
            trend: recent[recent.length - 1].trend,
            slope: trend,
            confidence: recent.length >= 5 ? 'high' : 'medium',
            current: values[values.length - 1],
            change: values.length >= 2 ? 
                ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1) + '%' : 'N/A'
        };
    }

    /**
     * Generate performance-based recommendations
     */
    generateRecommendations() {
        const recommendations = [];
        const trends = this.analyzeTrends();

        // RPE recommendations
        if (trends.rpe.trend === 'increasing' && trends.rpe.current > 8.5) {
            recommendations.push({
                type: 'warning',
                category: 'fatigue',
                message: 'RPE trending high - consider deload or recovery focus',
                priority: 'high'
            });
        }

        // Volume recommendations
        if (trends.volume.trend === 'decreasing') {
            recommendations.push({
                type: 'suggestion',
                category: 'volume',
                message: 'Volume declining - assess recovery and motivation',
                priority: 'medium'
            });
        }

        // Recovery recommendations
        if (trends.recovery.trend === 'decreasing' && trends.recovery.current < 6) {
            recommendations.push({
                type: 'alert',
                category: 'recovery',
                message: 'Poor recovery markers - prioritize sleep and stress management',
                priority: 'high'
            });
        }

        // Adherence recommendations
        if (trends.adherence.current < 0.80) {
            recommendations.push({
                type: 'suggestion',
                category: 'adherence',
                message: 'Low workout adherence - review program difficulty and life stressors',
                priority: 'medium'
            });
        }

        return recommendations;
    }

    /**
     * Check for performance alerts
     */
    checkAlerts() {
        const alerts = [];
        const latest = this.performanceHistory[this.performanceHistory.length - 1];
        
        if (!latest) return alerts;

        // High RPE alert
        if (latest.metrics.avgRPE > 9.0) {
            alerts.push({
                type: 'fatigue_warning',
                severity: 'high',
                message: 'Very high RPE detected - immediate attention needed'
            });
        }

        // Low adherence alert
        if (latest.metrics.adherenceScore < 0.60) {
            alerts.push({
                type: 'adherence_warning',
                severity: 'medium',
                message: 'Low workout completion - review program difficulty'
            });
        }

        // Poor recovery alert
        const recoveryScore = this.calculateRecoveryScore(latest.subjective);
        if (recoveryScore < 4.0) {
            alerts.push({
                type: 'recovery_warning',
                severity: 'high',
                message: 'Poor recovery markers - prioritize rest and stress management'
            });
        }

        return alerts;
    }

    /**
     * Generate performance predictions
     */
    generatePredictions() {
        if (this.performanceHistory.length < 5) {
            return { available: false, reason: 'Insufficient data for predictions' };
        }

        const strengthTrend = this.getTrendSummary(this.metrics.strength);
        const volumeTrend = this.getTrendSummary(this.metrics.volume);

        return {
            available: true,
            strength: {
                nextWeek: this.predictNextValue(this.metrics.strength, 7),
                nextMonth: this.predictNextValue(this.metrics.strength, 30),
                confidence: strengthTrend.confidence
            },
            volume: {
                nextWeek: this.predictNextValue(this.metrics.volume, 7),
                nextMonth: this.predictNextValue(this.metrics.volume, 30),
                confidence: volumeTrend.confidence
            }
        };
    }

    /**
     * Predict next value based on trend
     */
    predictNextValue(metricData, daysAhead) {
        if (metricData.length < 3) return null;

        const recent = metricData.slice(-10);
        const values = recent.map(d => d.value);
        const trend = this.calculateLinearTrend(values);
        
        const current = values[values.length - 1];
        const predicted = current + (trend * daysAhead / 7); // Assume weekly trend

        return Math.round(predicted);
    }

    /**
     * Calculate consistency score
     */
    calculateConsistency(sessions) {
        if (sessions.length < 3) return null;

        const metrics = ['totalVolume', 'avgRPE', 'adherenceScore'];
        let consistencyScore = 0;

        metrics.forEach(metric => {
            const values = sessions.map(s => s.metrics[metric]);
            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
            const cv = variance / (mean * mean); // Coefficient of variation
            
            consistencyScore += Math.max(0, 1 - cv); // Lower CV = higher consistency
        });

        return Math.round((consistencyScore / metrics.length) * 100);
    }

    /**
     * Calculate overall performance trend
     */
    calculateOverallTrend(sessions) {
        if (sessions.length < 5) return 'insufficient_data';

        const trends = this.analyzeTrends();
        let positiveIndicators = 0;
        let negativeIndicators = 0;

        // Analyze each trend
        if (trends.strength.trend === 'increasing') positiveIndicators++;
        else if (trends.strength.trend === 'decreasing') negativeIndicators++;

        if (trends.volume.trend === 'increasing') positiveIndicators++;
        else if (trends.volume.trend === 'decreasing') negativeIndicators++;

        if (trends.recovery.trend === 'increasing') positiveIndicators++;
        else if (trends.recovery.trend === 'decreasing') negativeIndicators++;

        if (trends.adherence.trend === 'increasing') positiveIndicators++;
        else if (trends.adherence.trend === 'decreasing') negativeIndicators++;

        // RPE is inverse - decreasing is good
        if (trends.rpe.trend === 'decreasing') positiveIndicators++;
        else if (trends.rpe.trend === 'increasing') negativeIndicators++;

        if (positiveIndicators > negativeIndicators + 1) return 'positive';
        if (negativeIndicators > positiveIndicators + 1) return 'negative';
        return 'stable';
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Export performance data
     */
    exportData() {
        return {
            performanceHistory: this.performanceHistory,
            metrics: this.metrics,
            benchmarks: this.benchmarks,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    /**
     * Import performance data
     */
    importData(data) {
        try {
            if (data.performanceHistory) this.performanceHistory = data.performanceHistory;
            if (data.metrics) this.metrics = data.metrics;
            if (data.benchmarks) this.benchmarks = data.benchmarks;
            
            return { success: true, imported: this.performanceHistory.length + ' sessions' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = PerformanceTracker;