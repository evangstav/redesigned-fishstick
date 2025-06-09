/**
 * Adaptive Functions - Client-side adaptive AI integration for fitness apps
 * Provides real-time performance tracking and program adaptation recommendations
 */

class AdaptiveFitnessSystem {
    constructor(trainingType = 'strength') {
        this.trainingType = trainingType;
        this.performanceTracker = null;
        this.adaptiveAI = null;
        this.adaptationHistory = [];
        this.currentRecommendations = [];
        this.isInitialized = false;
        
        this.config = {
            trackingInterval: 24 * 60 * 60 * 1000, // 24 hours
            analysisWindow: 7, // days
            adaptationThreshold: 0.75, // confidence threshold
            storageKey: `adaptive_system_${trainingType}_v1`
        };

        this.init();
    }

    /**
     * Initialize adaptive system
     */
    async init() {
        try {
            console.log('🤖 Initializing Adaptive Fitness System...');
            
            // Load stored data
            await this.loadStoredData();
            
            // Initialize performance tracking
            this.initializePerformanceTracking();
            
            // Initialize AI adaptation engine
            this.initializeAdaptiveAI();
            
            // Set up automatic analysis
            this.setupAutomaticAnalysis();
            
            // Initialize UI components
            this.initializeUI();
            
            this.isInitialized = true;
            console.log('✅ Adaptive system initialized');
            
            // Perform initial analysis if data exists
            if (this.hasPerformanceData()) {
                await this.performAnalysis();
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize adaptive system:', error);
            this.showError('Failed to initialize adaptive features');
        }
    }

    /**
     * Initialize performance tracking
     */
    initializePerformanceTracking() {
        this.performanceTracker = {
            sessions: JSON.parse(localStorage.getItem(`${this.config.storageKey}_sessions`) || '[]'),
            metrics: JSON.parse(localStorage.getItem(`${this.config.storageKey}_metrics`) || '{}'),
            trends: JSON.parse(localStorage.getItem(`${this.config.storageKey}_trends`) || '{}')
        };
    }

    /**
     * Initialize adaptive AI engine
     */
    initializeAdaptiveAI() {
        this.adaptiveAI = {
            rules: this.loadAdaptationRules(),
            history: JSON.parse(localStorage.getItem(`${this.config.storageKey}_adaptations`) || '[]'),
            lastAnalysis: localStorage.getItem(`${this.config.storageKey}_last_analysis`)
        };
    }

    /**
     * Load adaptation rules for training type
     */
    loadAdaptationRules() {
        // Simplified adaptation rules for client-side use
        const rules = {
            strength: {
                deload: { rpeThreshold: 9.5, consecutiveSessions: 3, volumeDropThreshold: 0.15 },
                intensification: { rpeThreshold: 7.0, consecutiveSessions: 2, strengthIncrease: 0.05 },
                progression: { rpeTarget: [7.5, 8.5], volumeIncrease: 0.1 }
            },
            hypertrophy: {
                deload: { rpeThreshold: 9.0, consecutiveSessions: 4, volumeDropThreshold: 0.20 },
                intensification: { rpeThreshold: 7.5, consecutiveSessions: 3, volumeIncrease: 0.10 },
                progression: { rpeTarget: [7.0, 8.5], volumeIncrease: 0.15 }
            },
            endurance: {
                deload: { rpeThreshold: 8.5, consecutiveSessions: 5, performanceDropThreshold: 0.10 },
                intensification: { rpeThreshold: 6.5, consecutiveSessions: 4, aerobicIncrease: 0.08 },
                progression: { rpeTarget: [6.0, 8.0], volumeIncrease: 0.12 }
            },
            general: {
                deload: { rpeThreshold: 8.0, consecutiveSessions: 4, adherenceDropThreshold: 0.25 },
                intensification: { rpeThreshold: 7.0, consecutiveSessions: 3, progressionRate: 0.08 },
                progression: { rpeTarget: [6.5, 8.0], volumeIncrease: 0.10 }
            }
        };

        return rules[this.trainingType] || rules.general;
    }

    /**
     * Record workout session for adaptive analysis
     */
    async recordWorkoutSession(workoutData) {
        try {
            console.log('📊 Recording workout session for adaptive analysis...');
            
            // Process and store session data
            const sessionData = this.processSessionData(workoutData);
            this.performanceTracker.sessions.push(sessionData);
            
            // Update metrics
            this.updateMetrics(sessionData);
            
            // Save to storage
            this.savePerformanceData();
            
            // Check if analysis is needed
            if (this.shouldPerformAnalysis()) {
                await this.performAnalysis();
            }
            
            // Update UI
            this.updatePerformanceDisplay();
            
            console.log('✅ Session recorded and analyzed');
            
        } catch (error) {
            console.error('❌ Failed to record session:', error);
            this.showError('Failed to record workout session');
        }
    }

    /**
     * Process raw workout data into structured format
     */
    processSessionData(workoutData) {
        const sessionData = {
            date: workoutData.date || new Date().toISOString(),
            sessionId: this.generateSessionId(),
            exercises: this.processExercises(workoutData.exercises || []),
            duration: workoutData.duration || 0,
            subjective: this.processSubjectiveData(workoutData.subjective || {}),
            notes: workoutData.notes || ''
        };

        // Calculate session-level metrics
        sessionData.metrics = this.calculateSessionMetrics(sessionData);
        
        return sessionData;
    }

    /**
     * Process individual exercises
     */
    processExercises(exercises) {
        return exercises.map(exercise => {
            const processedExercise = {
                name: exercise.name,
                category: exercise.category || 'unknown',
                isMainLift: exercise.isMainLift || false,
                sets: exercise.sets.map(set => this.processSet(set)),
                notes: exercise.notes || ''
            };

            // Calculate exercise metrics
            processedExercise.metrics = this.calculateExerciseMetrics(processedExercise);
            
            return processedExercise;
        });
    }

    /**
     * Process individual set data
     */
    processSet(set) {
        const processedSet = {
            weight: parseFloat(set.weight) || 0,
            reps: parseInt(set.reps) || 0,
            rpe: parseFloat(set.rpe) || 0,
            completed: set.completed !== false,
            restTime: parseInt(set.restTime) || 0,
            notes: set.notes || ''
        };

        // Calculate derived metrics
        processedSet.volume = processedSet.weight * processedSet.reps;
        processedSet.estimated1RM = this.calculateEstimated1RM(
            processedSet.weight, 
            processedSet.reps, 
            processedSet.rpe
        );

        return processedSet;
    }

    /**
     * Process subjective wellness data
     */
    processSubjectiveData(subjective) {
        return {
            energyLevel: parseInt(subjective.energyLevel) || 5,
            motivation: parseInt(subjective.motivation) || 5,
            sleepQuality: parseInt(subjective.sleepQuality) || 5,
            stress: parseInt(subjective.stress) || 5,
            soreness: parseInt(subjective.soreness) || 5,
            mood: parseInt(subjective.mood) || 5
        };
    }

    /**
     * Calculate exercise-level metrics
     */
    calculateExerciseMetrics(exercise) {
        const completedSets = exercise.sets.filter(set => set.completed);
        
        if (completedSets.length === 0) {
            return { totalVolume: 0, avgRPE: 0, maxWeight: 0, estimated1RM: 0 };
        }

        return {
            totalVolume: completedSets.reduce((sum, set) => sum + set.volume, 0),
            avgRPE: completedSets.reduce((sum, set) => sum + set.rpe, 0) / completedSets.length,
            maxWeight: Math.max(...completedSets.map(set => set.weight)),
            estimated1RM: Math.max(...completedSets.map(set => set.estimated1RM || 0)),
            setCount: exercise.sets.length,
            completedSets: completedSets.length,
            adherenceRate: completedSets.length / exercise.sets.length
        };
    }

    /**
     * Calculate session-level metrics
     */
    calculateSessionMetrics(session) {
        const exercises = session.exercises;
        
        return {
            totalVolume: exercises.reduce((sum, ex) => sum + (ex.metrics.totalVolume || 0), 0),
            avgRPE: this.calculateWeightedAverageRPE(exercises),
            totalSets: exercises.reduce((sum, ex) => sum + (ex.metrics.setCount || 0), 0),
            completedSets: exercises.reduce((sum, ex) => sum + (ex.metrics.completedSets || 0), 0),
            adherenceScore: this.calculateSessionAdherence(exercises),
            maxEstimated1RM: Math.max(...exercises.map(ex => ex.metrics.estimated1RM || 0)),
            recoveryScore: this.calculateRecoveryScore(session.subjective)
        };
    }

    /**
     * Calculate weighted average RPE
     */
    calculateWeightedAverageRPE(exercises) {
        let totalWeight = 0;
        let weightedRPESum = 0;

        exercises.forEach(exercise => {
            const metrics = exercise.metrics;
            if (metrics.avgRPE > 0 && metrics.totalVolume > 0) {
                totalWeight += metrics.totalVolume;
                weightedRPESum += metrics.avgRPE * metrics.totalVolume;
            }
        });

        return totalWeight > 0 ? weightedRPESum / totalWeight : 0;
    }

    /**
     * Calculate session adherence score
     */
    calculateSessionAdherence(exercises) {
        if (exercises.length === 0) return 0;
        
        const adherenceRates = exercises.map(ex => ex.metrics.adherenceRate || 0);
        return adherenceRates.reduce((sum, rate) => sum + rate, 0) / adherenceRates.length;
    }

    /**
     * Calculate recovery score from subjective measures
     */
    calculateRecoveryScore(subjective) {
        const weights = {
            energyLevel: 0.25,
            sleepQuality: 0.30,
            stress: 0.15,
            soreness: 0.15,
            motivation: 0.15
        };

        let score = 0;
        score += subjective.energyLevel * weights.energyLevel;
        score += subjective.sleepQuality * weights.sleepQuality;
        score += (10 - subjective.stress) * weights.stress; // Invert stress
        score += (10 - subjective.soreness) * weights.soreness; // Invert soreness
        score += subjective.motivation * weights.motivation;

        return Math.round(score * 10) / 10;
    }

    /**
     * Calculate estimated 1RM using Epley formula with RPE adjustments
     */
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

    /**
     * Update running performance metrics
     */
    updateMetrics(sessionData) {
        if (!this.performanceTracker.metrics.rpe) {
            this.performanceTracker.metrics = {
                rpe: [],
                volume: [],
                strength: [],
                recovery: [],
                adherence: []
            };
        }

        const metrics = sessionData.metrics;
        const date = sessionData.date;

        this.performanceTracker.metrics.rpe.push({
            date: date,
            value: metrics.avgRPE,
            trend: this.calculateTrend(this.performanceTracker.metrics.rpe, metrics.avgRPE)
        });

        this.performanceTracker.metrics.volume.push({
            date: date,
            value: metrics.totalVolume,
            trend: this.calculateTrend(this.performanceTracker.metrics.volume, metrics.totalVolume)
        });

        this.performanceTracker.metrics.strength.push({
            date: date,
            value: metrics.maxEstimated1RM,
            trend: this.calculateTrend(this.performanceTracker.metrics.strength, metrics.maxEstimated1RM)
        });

        this.performanceTracker.metrics.recovery.push({
            date: date,
            value: metrics.recoveryScore,
            trend: this.calculateTrend(this.performanceTracker.metrics.recovery, metrics.recoveryScore)
        });

        this.performanceTracker.metrics.adherence.push({
            date: date,
            value: metrics.adherenceScore,
            trend: this.calculateTrend(this.performanceTracker.metrics.adherence, metrics.adherenceScore)
        });

        // Keep only last 50 data points for performance
        Object.keys(this.performanceTracker.metrics).forEach(key => {
            if (this.performanceTracker.metrics[key].length > 50) {
                this.performanceTracker.metrics[key] = this.performanceTracker.metrics[key].slice(-50);
            }
        });
    }

    /**
     * Calculate trend for a metric
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
     * Check if analysis should be performed
     */
    shouldPerformAnalysis() {
        const lastAnalysis = this.adaptiveAI.lastAnalysis;
        if (!lastAnalysis) return true;
        
        const daysSinceAnalysis = (Date.now() - new Date(lastAnalysis).getTime()) / (24 * 60 * 60 * 1000);
        return daysSinceAnalysis >= 1 || this.performanceTracker.sessions.length % 3 === 0;
    }

    /**
     * Perform adaptive analysis and generate recommendations
     */
    async performAnalysis() {
        try {
            console.log('🔍 Performing adaptive analysis...');
            
            const recentSessions = this.performanceTracker.sessions.slice(-10);
            if (recentSessions.length < 3) {
                console.log('Insufficient data for analysis');
                return;
            }

            // Analyze performance trends
            const analysis = this.analyzePerformanceTrends(recentSessions);
            
            // Generate adaptation recommendations
            const adaptations = this.generateAdaptationRecommendations(analysis);
            
            // Update recommendations
            this.currentRecommendations = adaptations.recommendations || [];
            
            // Store analysis results
            this.adaptiveAI.lastAnalysis = new Date().toISOString();
            this.adaptiveAI.history.push({
                date: new Date().toISOString(),
                analysis: analysis,
                adaptations: adaptations
            });

            // Save to storage
            this.saveAdaptiveData();
            
            // Update UI
            this.updateAdaptiveUI();
            
            console.log('✅ Analysis complete:', adaptations);
            
        } catch (error) {
            console.error('❌ Analysis failed:', error);
            this.showError('Failed to perform adaptive analysis');
        }
    }

    /**
     * Analyze performance trends
     */
    analyzePerformanceTrends(sessions) {
        const analysis = {
            sessionCount: sessions.length,
            timespan: this.calculateTimespan(sessions),
            trends: {},
            flags: [],
            summary: {}
        };

        // Calculate trend analysis for each metric
        const metrics = ['avgRPE', 'totalVolume', 'maxEstimated1RM', 'adherenceScore', 'recoveryScore'];
        
        metrics.forEach(metric => {
            const values = sessions.map(s => s.metrics[metric] || 0);
            analysis.trends[metric] = {
                current: values[values.length - 1],
                average: values.reduce((sum, val) => sum + val, 0) / values.length,
                trend: this.calculateLinearTrend(values),
                change: values.length >= 2 ? ((values[values.length - 1] - values[0]) / values[0] * 100) : 0
            };
        });

        // Detect performance flags
        analysis.flags = this.detectPerformanceFlags(analysis.trends);
        
        // Generate summary
        analysis.summary = this.generateAnalysisSummary(analysis);

        return analysis;
    }

    /**
     * Detect performance flags
     */
    detectPerformanceFlags(trends) {
        const flags = [];
        const rules = this.adaptiveAI.rules;

        // High RPE flag
        if (trends.avgRPE.current > rules.deload.rpeThreshold) {
            flags.push({
                type: 'high_rpe',
                severity: 'high',
                message: 'RPE consistently high - consider deload',
                value: trends.avgRPE.current
            });
        }

        // Volume decline flag
        if (trends.totalVolume.trend < -0.1) {
            flags.push({
                type: 'volume_decline',
                severity: 'medium',
                message: 'Training volume declining',
                value: trends.totalVolume.change
            });
        }

        // Poor recovery flag
        if (trends.recoveryScore.current < 5.0) {
            flags.push({
                type: 'poor_recovery',
                severity: 'high',
                message: 'Recovery markers below optimal',
                value: trends.recoveryScore.current
            });
        }

        // Low adherence flag
        if (trends.adherenceScore.current < 0.80) {
            flags.push({
                type: 'low_adherence',
                severity: 'medium',
                message: 'Workout completion rate low',
                value: trends.adherenceScore.current
            });
        }

        // Strength progress flag
        if (trends.maxEstimated1RM.trend > 0.05) {
            flags.push({
                type: 'strength_progress',
                severity: 'positive',
                message: 'Strength gains detected',
                value: trends.maxEstimated1RM.change
            });
        }

        return flags;
    }

    /**
     * Generate adaptation recommendations
     */
    generateAdaptationRecommendations(analysis) {
        const recommendations = [];
        const rules = this.adaptiveAI.rules;
        const trends = analysis.trends;
        const flags = analysis.flags;

        // High-priority flags (deload indicators)
        const highSeverityFlags = flags.filter(f => f.severity === 'high');
        if (highSeverityFlags.length > 0) {
            recommendations.push({
                type: 'deload',
                priority: 'high',
                title: 'Deload Week Recommended',
                description: 'Multiple fatigue indicators detected. Consider reducing volume and intensity.',
                actions: [
                    'Reduce training volume by 40%',
                    'Maintain intensity at 85% of normal',
                    'Focus on mobility and recovery',
                    'Prioritize sleep and stress management'
                ],
                duration: '1 week',
                confidence: 0.85
            });
        }

        // Positive progress indicators (intensification opportunities)
        const positiveFlags = flags.filter(f => f.severity === 'positive');
        if (positiveFlags.length > 0 && trends.avgRPE.current < rules.intensification.rpeThreshold) {
            recommendations.push({
                type: 'intensification',
                priority: 'medium',
                title: 'Intensification Opportunity',
                description: 'Good recovery and progress detected. Consider increasing training stress.',
                actions: [
                    'Increase training volume by 10-15%',
                    'Add intensity techniques',
                    'Monitor RPE closely',
                    'Ensure adequate recovery between sessions'
                ],
                duration: '2-3 weeks',
                confidence: 0.75
            });
        }

        // General optimization recommendations
        if (trends.adherenceScore.current < 0.85) {
            recommendations.push({
                type: 'adherence',
                priority: 'medium',
                title: 'Improve Workout Adherence',
                description: 'Workout completion rate could be improved.',
                actions: [
                    'Review program difficulty',
                    'Consider time constraints',
                    'Adjust exercise selection',
                    'Evaluate motivation factors'
                ],
                duration: 'ongoing',
                confidence: 0.70
            });
        }

        if (trends.recoveryScore.current < 6.0) {
            recommendations.push({
                type: 'recovery',
                priority: 'medium',
                title: 'Focus on Recovery',
                description: 'Recovery markers below optimal range.',
                actions: [
                    'Prioritize 7-9 hours of sleep',
                    'Manage stress levels',
                    'Consider nutrition timing',
                    'Add active recovery sessions'
                ],
                duration: 'ongoing',
                confidence: 0.80
            });
        }

        return {
            analysisDate: new Date().toISOString(),
            recommendations: recommendations,
            flagCount: flags.length,
            overallAssessment: this.generateOverallAssessment(analysis, recommendations)
        };
    }

    /**
     * Generate overall assessment
     */
    generateOverallAssessment(analysis, recommendations) {
        const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
        
        if (highPriorityRecs.length > 0) {
            return {
                status: 'needs_attention',
                message: 'Fatigue indicators detected - consider program adjustments',
                recommendation: 'Focus on recovery and load management'
            };
        } else if (recommendations.length > 2) {
            return {
                status: 'optimization_opportunity',
                message: 'Several areas for program optimization identified',
                recommendation: 'Implement suggested improvements gradually'
            };
        } else {
            return {
                status: 'on_track',
                message: 'Training progressing well with minor optimization opportunities',
                recommendation: 'Continue current approach with minor adjustments'
            };
        }
    }

    /**
     * Initialize UI components for adaptive features
     */
    initializeUI() {
        this.createAdaptiveUI();
        this.setupEventListeners();
    }

    /**
     * Create adaptive UI elements
     */
    createAdaptiveUI() {
        // Create adaptive panel
        const adaptivePanel = document.createElement('div');
        adaptivePanel.id = 'adaptive-panel';
        adaptivePanel.className = 'adaptive-panel';
        adaptivePanel.innerHTML = `
            <div class="adaptive-header">
                <h3>🤖 Adaptive Insights</h3>
                <button id="adaptive-toggle" class="adaptive-toggle">▼</button>
            </div>
            <div id="adaptive-content" class="adaptive-content">
                <div id="performance-trends" class="performance-trends">
                    <h4>Performance Trends</h4>
                    <div id="trends-display"></div>
                </div>
                <div id="recommendations" class="recommendations">
                    <h4>Recommendations</h4>
                    <div id="recommendations-display"></div>
                </div>
                <div id="adaptive-controls" class="adaptive-controls">
                    <button id="force-analysis" class="btn btn-secondary">Analyze Now</button>
                    <button id="export-data" class="btn btn-secondary">Export Data</button>
                </div>
            </div>
        `;

        // Insert into existing analytics section or create new section
        const analyticsSection = document.querySelector('.analytics-section') || 
                                document.querySelector('#analytics');
        
        if (analyticsSection) {
            analyticsSection.appendChild(adaptivePanel);
        } else {
            // Create new section if analytics doesn't exist
            const newSection = document.createElement('div');
            newSection.className = 'analytics-section';
            newSection.appendChild(adaptivePanel);
            document.body.appendChild(newSection);
        }
    }

    /**
     * Set up event listeners for adaptive UI
     */
    setupEventListeners() {
        // Toggle adaptive panel
        const toggleButton = document.getElementById('adaptive-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                const content = document.getElementById('adaptive-content');
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                toggleButton.textContent = isHidden ? '▼' : '▶';
            });
        }

        // Force analysis button
        const forceAnalysisButton = document.getElementById('force-analysis');
        if (forceAnalysisButton) {
            forceAnalysisButton.addEventListener('click', () => {
                this.performAnalysis();
            });
        }

        // Export data button
        const exportButton = document.getElementById('export-data');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportAdaptiveData();
            });
        }
    }

    /**
     * Update adaptive UI with latest data
     */
    updateAdaptiveUI() {
        this.updateTrendsDisplay();
        this.updateRecommendationsDisplay();
    }

    /**
     * Update trends display
     */
    updateTrendsDisplay() {
        const trendsDisplay = document.getElementById('trends-display');
        if (!trendsDisplay || this.performanceTracker.metrics.rpe.length === 0) return;

        const latestMetrics = {
            rpe: this.performanceTracker.metrics.rpe.slice(-1)[0],
            volume: this.performanceTracker.metrics.volume.slice(-1)[0],
            strength: this.performanceTracker.metrics.strength.slice(-1)[0],
            recovery: this.performanceTracker.metrics.recovery.slice(-1)[0]
        };

        const trendsHTML = Object.entries(latestMetrics).map(([metric, data]) => {
            const trendIcon = data.trend === 'increasing' ? '📈' : 
                             data.trend === 'decreasing' ? '📉' : '➡️';
            return `
                <div class="trend-item">
                    <span class="trend-label">${metric.toUpperCase()}:</span>
                    <span class="trend-value">${data.value.toFixed(1)}</span>
                    <span class="trend-icon">${trendIcon}</span>
                </div>
            `;
        }).join('');

        trendsDisplay.innerHTML = trendsHTML;
    }

    /**
     * Update recommendations display
     */
    updateRecommendationsDisplay() {
        const recommendationsDisplay = document.getElementById('recommendations-display');
        if (!recommendationsDisplay) return;

        if (this.currentRecommendations.length === 0) {
            recommendationsDisplay.innerHTML = '<p>No recommendations at this time. Keep training consistently!</p>';
            return;
        }

        const recommendationsHTML = this.currentRecommendations.map(rec => `
            <div class="recommendation ${rec.priority}">
                <div class="recommendation-header">
                    <span class="recommendation-title">${rec.title}</span>
                    <span class="recommendation-priority">${rec.priority.toUpperCase()}</span>
                </div>
                <div class="recommendation-description">${rec.description}</div>
                <div class="recommendation-actions">
                    <ul>
                        ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
                <div class="recommendation-meta">
                    <span>Duration: ${rec.duration}</span>
                    <span>Confidence: ${(rec.confidence * 100).toFixed(0)}%</span>
                </div>
            </div>
        `).join('');

        recommendationsDisplay.innerHTML = recommendationsHTML;
    }

    /**
     * Show error message to user
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'adaptive-error';
        errorDiv.textContent = `⚠️ ${message}`;
        errorDiv.style.cssText = `
            background: #ffebee;
            color: #c62828;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            border-left: 4px solid #c62828;
        `;

        const adaptivePanel = document.getElementById('adaptive-panel');
        if (adaptivePanel) {
            adaptivePanel.insertBefore(errorDiv, adaptivePanel.firstChild);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }

    /**
     * Data persistence methods
     */
    savePerformanceData() {
        localStorage.setItem(`${this.config.storageKey}_sessions`, JSON.stringify(this.performanceTracker.sessions));
        localStorage.setItem(`${this.config.storageKey}_metrics`, JSON.stringify(this.performanceTracker.metrics));
    }

    saveAdaptiveData() {
        localStorage.setItem(`${this.config.storageKey}_adaptations`, JSON.stringify(this.adaptiveAI.history));
        localStorage.setItem(`${this.config.storageKey}_last_analysis`, this.adaptiveAI.lastAnalysis);
    }

    async loadStoredData() {
        // Data is loaded in initialize methods
        console.log('📥 Loading stored adaptive data...');
    }

    hasPerformanceData() {
        return this.performanceTracker.sessions.length > 0;
    }

    exportAdaptiveData() {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            trainingType: this.trainingType,
            performanceData: this.performanceTracker,
            adaptiveHistory: this.adaptiveAI.history,
            currentRecommendations: this.currentRecommendations
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `adaptive-data-${this.trainingType}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Utility methods
     */
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    calculateTimespan(sessions) {
        if (sessions.length < 2) return 0;
        const firstDate = new Date(sessions[0].date);
        const lastDate = new Date(sessions[sessions.length - 1].date);
        return (lastDate - firstDate) / (24 * 60 * 60 * 1000); // Days
    }

    generateAnalysisSummary(analysis) {
        return {
            timespan: `${analysis.timespan.toFixed(1)} days`,
            sessionCount: analysis.sessionCount,
            flagCount: analysis.flags.length,
            overallTrend: this.determineOverallTrend(analysis.trends)
        };
    }

    determineOverallTrend(trends) {
        const trendScores = Object.values(trends).map(t => t.trend);
        const avgTrend = trendScores.reduce((sum, t) => sum + t, 0) / trendScores.length;
        
        if (avgTrend > 0.05) return 'improving';
        if (avgTrend < -0.05) return 'declining';
        return 'stable';
    }

    setupAutomaticAnalysis() {
        // Set up periodic analysis (daily check)
        setInterval(() => {
            if (this.shouldPerformAnalysis()) {
                this.performAnalysis();
            }
        }, this.config.trackingInterval);
    }
}

// Make available globally for integration with existing fitness apps
window.AdaptiveFitnessSystem = AdaptiveFitnessSystem;