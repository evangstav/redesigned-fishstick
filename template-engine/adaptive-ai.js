/**
 * Adaptive AI Engine - Real-time program adaptation based on performance data
 * Implements evidence-based autoregulation and progressive adaptation
 */

class AdaptiveAI {
    constructor(trainingType = 'strength') {
        this.trainingType = trainingType;
        this.adaptationRules = this.loadAdaptationRules();
        this.performanceHistory = [];
    }

    /**
     * Load adaptation rules based on evidence-based protocols
     */
    loadAdaptationRules() {
        return {
            strength: {
                deloadTriggers: {
                    rpeThreshold: 9.5,
                    consecutiveSessions: 3,
                    volumeDropThreshold: 0.15
                },
                intensificationTriggers: {
                    rpeThreshold: 7.0,
                    consecutiveSessions: 2,
                    strengthIncrease: 0.05
                },
                adaptationFactors: {
                    rpeAdjustment: 0.1,
                    volumeAdjustment: 0.1,
                    intensityAdjustment: 0.05
                }
            },
            hypertrophy: {
                deloadTriggers: {
                    rpeThreshold: 9.0,
                    consecutiveSessions: 4,
                    volumeDropThreshold: 0.20
                },
                intensificationTriggers: {
                    rpeThreshold: 7.5,
                    consecutiveSessions: 3,
                    volumeIncrease: 0.10
                },
                adaptationFactors: {
                    rpeAdjustment: 0.15,
                    volumeAdjustment: 0.15,
                    intensityAdjustment: 0.075
                }
            },
            endurance: {
                deloadTriggers: {
                    rpeThreshold: 8.5,
                    consecutiveSessions: 5,
                    performanceDropThreshold: 0.10
                },
                intensificationTriggers: {
                    rpeThreshold: 6.5,
                    consecutiveSessions: 4,
                    aerobicIncrease: 0.08
                },
                adaptationFactors: {
                    rpeAdjustment: 0.2,
                    volumeAdjustment: 0.12,
                    intensityAdjustment: 0.1
                }
            }
        };
    }

    /**
     * Analyze performance trends and determine adaptation needs
     * @param {Array} performanceData - Recent workout performance data
     * @returns {Object} Adaptation recommendations
     */
    analyzePerformanceTrends(performanceData) {
        if (!performanceData || performanceData.length < 3) {
            return { adaptationNeeded: false, reason: 'Insufficient data' };
        }

        const recentSessions = performanceData.slice(-5);
        const analysis = {
            avgRPE: this.calculateAverageRPE(recentSessions),
            rpetrend: this.calculateRPETrend(recentSessions),
            volumeTrend: this.calculateVolumeTrend(recentSessions),
            strengthTrend: this.calculateStrengthTrend(recentSessions),
            fatigueMarkers: this.detectFatigueMarkers(recentSessions)
        };

        return this.determineAdaptation(analysis);
    }

    /**
     * Calculate average RPE across recent sessions
     */
    calculateAverageRPE(sessions) {
        const rpeValues = sessions.flatMap(session => 
            session.exercises.map(ex => ex.avgRPE || 0)
        ).filter(rpe => rpe > 0);

        return rpeValues.length > 0 ? 
            rpeValues.reduce((sum, rpe) => sum + rpe, 0) / rpeValues.length : 0;
    }

    /**
     * Calculate RPE trend (increasing/decreasing)
     */
    calculateRPETrend(sessions) {
        if (sessions.length < 3) return 0;
        
        const rpeBySession = sessions.map(session => {
            const rpeValues = session.exercises.map(ex => ex.avgRPE || 0).filter(rpe => rpe > 0);
            return rpeValues.length > 0 ? rpeValues.reduce((sum, rpe) => sum + rpe, 0) / rpeValues.length : 0;
        });

        // Simple linear trend calculation
        const n = rpeBySession.length;
        const xMean = (n - 1) / 2;
        const yMean = rpeBySession.reduce((sum, y) => sum + y, 0) / n;
        
        let numerator = 0, denominator = 0;
        for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (rpeBySession[i] - yMean);
            denominator += (i - xMean) * (i - xMean);
        }

        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Calculate volume trend
     */
    calculateVolumeTrend(sessions) {
        if (sessions.length < 3) return 0;

        const volumeBySession = sessions.map(session => 
            session.exercises.reduce((total, ex) => total + (ex.totalVolume || 0), 0)
        );

        const n = volumeBySession.length;
        const xMean = (n - 1) / 2;
        const yMean = volumeBySession.reduce((sum, y) => sum + y, 0) / n;
        
        let numerator = 0, denominator = 0;
        for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (volumeBySession[i] - yMean);
            denominator += (i - xMean) * (i - xMean);
        }

        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Calculate strength trend (for strength training)
     */
    calculateStrengthTrend(sessions) {
        if (this.trainingType !== 'strength' || sessions.length < 3) return 0;

        const strengthMarkers = sessions.map(session => {
            const mainLifts = session.exercises.filter(ex => ex.isMainLift);
            if (mainLifts.length === 0) return 0;
            
            return mainLifts.reduce((sum, ex) => sum + (ex.estimated1RM || 0), 0) / mainLifts.length;
        });

        const n = strengthMarkers.length;
        const xMean = (n - 1) / 2;
        const yMean = strengthMarkers.reduce((sum, y) => sum + y, 0) / n;
        
        let numerator = 0, denominator = 0;
        for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (strengthMarkers[i] - yMean);
            denominator += (i - xMean) * (i - xMean);
        }

        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Detect fatigue markers
     */
    detectFatigueMarkers(sessions) {
        const rules = this.adaptationRules[this.trainingType];
        const recentAvgRPE = this.calculateAverageRPE(sessions);
        
        return {
            highRPE: recentAvgRPE > rules.deloadTriggers.rpeThreshold,
            consecutiveHighRPE: this.countConsecutiveHighRPE(sessions),
            volumeDrop: this.detectVolumeDrop(sessions),
            performanceDrop: this.detectPerformanceDrop(sessions)
        };
    }

    /**
     * Count consecutive sessions with high RPE
     */
    countConsecutiveHighRPE(sessions) {
        const rules = this.adaptationRules[this.trainingType];
        let count = 0;
        
        for (let i = sessions.length - 1; i >= 0; i--) {
            const sessionRPE = this.calculateAverageRPE([sessions[i]]);
            if (sessionRPE > rules.deloadTriggers.rpeThreshold) {
                count++;
            } else {
                break;
            }
        }
        
        return count;
    }

    /**
     * Detect significant volume drop
     */
    detectVolumeDrop(sessions) {
        if (sessions.length < 4) return false;
        
        const recentVolume = sessions.slice(-2).reduce((sum, session) => 
            sum + session.exercises.reduce((total, ex) => total + (ex.totalVolume || 0), 0), 0) / 2;
        
        const baselineVolume = sessions.slice(0, -2).reduce((sum, session) => 
            sum + session.exercises.reduce((total, ex) => total + (ex.totalVolume || 0), 0), 0) / (sessions.length - 2);
        
        const dropPercentage = (baselineVolume - recentVolume) / baselineVolume;
        return dropPercentage > this.adaptationRules[this.trainingType].deloadTriggers.volumeDropThreshold;
    }

    /**
     * Detect performance drop
     */
    detectPerformanceDrop(sessions) {
        if (sessions.length < 4) return false;
        
        const recentPerformance = sessions.slice(-2);
        const baselinePerformance = sessions.slice(0, -2);
        
        // Implementation depends on training type
        switch (this.trainingType) {
            case 'strength':
                return this.detectStrengthDrop(recentPerformance, baselinePerformance);
            case 'hypertrophy':
                return this.detectVolumeDrop(sessions);
            case 'endurance':
                return this.detectEnduranceDrop(recentPerformance, baselinePerformance);
            default:
                return false;
        }
    }

    /**
     * Determine adaptation strategy based on analysis
     */
    determineAdaptation(analysis) {
        const rules = this.adaptationRules[this.trainingType];
        
        // Check for deload needs
        if (analysis.fatigueMarkers.highRPE && analysis.fatigueMarkers.consecutiveHighRPE >= rules.deloadTriggers.consecutiveSessions) {
            return {
                adaptationNeeded: true,
                type: 'deload',
                severity: this.calculateDeloadSeverity(analysis),
                recommendations: this.generateDeloadRecommendations(analysis)
            };
        }

        // Check for intensification opportunities
        if (analysis.avgRPE < rules.intensificationTriggers.rpeThreshold && 
            analysis.strengthTrend > 0) {
            return {
                adaptationNeeded: true,
                type: 'intensification',
                magnitude: this.calculateIntensificationMagnitude(analysis),
                recommendations: this.generateIntensificationRecommendations(analysis)
            };
        }

        // Check for program modifications
        if (Math.abs(analysis.rpetrend) > 0.1 || Math.abs(analysis.volumeTrend) > 100) {
            return {
                adaptationNeeded: true,
                type: 'modification',
                adjustments: this.generateProgramModifications(analysis),
                recommendations: this.generateModificationRecommendations(analysis)
            };
        }

        return {
            adaptationNeeded: false,
            reason: 'Performance within normal parameters',
            analysis: analysis
        };
    }

    /**
     * Generate deload recommendations
     */
    generateDeloadRecommendations(analysis) {
        const rules = this.adaptationRules[this.trainingType];
        
        return {
            volumeReduction: 0.4, // 40% volume reduction
            intensityMaintenance: 0.85, // Maintain 85% of normal intensity
            duration: '1 week',
            focus: 'recovery and movement quality',
            modifications: [
                'Reduce sets by 40%',
                'Maintain intensity at 85%',
                'Add mobility work',
                'Prioritize sleep and nutrition'
            ]
        };
    }

    /**
     * Generate intensification recommendations
     */
    generateIntensificationRecommendations(analysis) {
        return {
            volumeIncrease: 0.15, // 15% volume increase
            intensityIncrease: 0.05, // 5% intensity increase
            duration: '2-3 weeks',
            focus: 'progressive overload',
            modifications: [
                'Add 1-2 sets to main exercises',
                'Increase intensity by 5%',
                'Monitor RPE closely',
                'Ensure adequate recovery'
            ]
        };
    }

    /**
     * Generate program modifications
     */
    generateProgramModifications(analysis) {
        const adjustments = {};
        
        if (analysis.rpeSlot > 0.1) { // RPE increasing
            adjustments.volume = -0.1; // Reduce volume by 10%
            adjustments.intensity = -0.05; // Reduce intensity by 5%
        } else if (analysis.rpeSlot < -0.1) { // RPE decreasing
            adjustments.volume = 0.1; // Increase volume by 10%
            adjustments.intensity = 0.025; // Increase intensity by 2.5%
        }
        
        return adjustments;
    }

    /**
     * Apply adaptations to workout program
     * @param {Object} program - Current workout program
     * @param {Object} adaptations - Adaptation recommendations
     * @returns {Object} Modified program
     */
    applyAdaptations(program, adaptations) {
        if (!adaptations.adaptationNeeded) return program;

        const modifiedProgram = JSON.parse(JSON.stringify(program)); // Deep copy

        switch (adaptations.type) {
            case 'deload':
                this.applyDeload(modifiedProgram, adaptations.recommendations);
                break;
            case 'intensification':
                this.applyIntensification(modifiedProgram, adaptations.recommendations);
                break;
            case 'modification':
                this.applyModifications(modifiedProgram, adaptations.adjustments);
                break;
        }

        modifiedProgram.lastAdaptation = {
            date: new Date().toISOString(),
            type: adaptations.type,
            reason: adaptations.reason || 'Performance-based adaptation'
        };

        return modifiedProgram;
    }

    /**
     * Apply deload modifications
     */
    applyDeload(program, recommendations) {
        program.workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                // Reduce sets
                exercise.sets = Math.max(1, Math.floor(exercise.sets * (1 - recommendations.volumeReduction)));
                
                // Maintain intensity but reduce overall load
                if (exercise.weight) {
                    exercise.weight = Math.floor(exercise.weight * recommendations.intensityMaintenance);
                }
                
                // Add recovery focus note
                exercise.notes = (exercise.notes || '') + ' [DELOAD WEEK - Focus on form and recovery]';
            });
        });
    }

    /**
     * Apply intensification modifications
     */
    applyIntensification(program, recommendations) {
        program.workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                // Increase sets for main exercises
                if (exercise.isMainLift) {
                    exercise.sets = Math.floor(exercise.sets * (1 + recommendations.volumeIncrease));
                }
                
                // Increase intensity
                if (exercise.weight) {
                    exercise.weight = Math.floor(exercise.weight * (1 + recommendations.intensityIncrease));
                }
                
                exercise.notes = (exercise.notes || '') + ' [INTENSIFICATION - Monitor RPE closely]';
            });
        });
    }

    /**
     * Apply general modifications
     */
    applyModifications(program, adjustments) {
        program.workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                if (adjustments.volume !== undefined) {
                    exercise.sets = Math.max(1, Math.floor(exercise.sets * (1 + adjustments.volume)));
                }
                
                if (adjustments.intensity !== undefined && exercise.weight) {
                    exercise.weight = Math.floor(exercise.weight * (1 + adjustments.intensity));
                }
            });
        });
    }

    /**
     * Calculate deload severity based on fatigue markers
     */
    calculateDeloadSeverity(analysis) {
        let severity = 'moderate';
        
        if (analysis.fatigueMarkers.consecutiveHighRPE >= 5) severity = 'severe';
        else if (analysis.fatigueMarkers.volumeDrop && analysis.fatigueMarkers.performanceDrop) severity = 'significant';
        
        return severity;
    }

    /**
     * Calculate intensification magnitude
     */
    calculateIntensificationMagnitude(analysis) {
        if (analysis.strengthTrend > 0.1) return 'aggressive';
        if (analysis.strengthTrend > 0.05) return 'moderate';
        return 'conservative';
    }
}

module.exports = AdaptiveAI;