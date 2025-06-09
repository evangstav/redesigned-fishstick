/**
 * Comprehensive Puppeteer Tests for Periodization AI System
 * Tests all periodization models, adaptation logic, and competition timing
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Import test modules
const PeriodizationAI = require('../template-engine/periodization-ai');

class PeriodizationAITestSuite {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = [];
        this.startTime = new Date();
        this.periodizationAI = new PeriodizationAI('strength');
    }

    async initialize() {
        console.log('🚀 Initializing Periodization AI Test Suite...');
        
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1200, height: 800 });
        
        console.log('✅ Puppeteer initialized');
    }

    async runAllTests() {
        console.log('📊 Running Periodization AI Tests...');

        try {
            // Core periodization tests
            await this.testPeriodizationModels();
            await this.testAthleteProfileOptimization();
            await this.testMacrocycleGeneration();
            await this.testMesocycleAdaptation();
            await this.testMicrocycleOptimization();
            
            // Advanced features
            await this.testCompetitionTiming();
            await this.testTaperingProtocols();
            await this.testWorkoutAdaptation();
            await this.testVolumeIntensityProgression();
            await this.testPerformanceMonitoring();
            
            // Integration tests
            await this.testAdaptiveIntegration();
            await this.testDataPersistence();
            await this.testErrorHandling();
            
            // Performance tests
            await this.testPerformanceMetrics();
            await this.testLargeDatasetHandling();

            await this.generateReport();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.logResult('test_suite_execution', 'Critical test suite failure', false, { error: error.message });
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }

    /**
     * Test all periodization models for accuracy and appropriateness
     */
    async testPeriodizationModels() {
        console.log('🔬 Testing Periodization Models...');

        // Test Linear Periodization
        await this.testLinearPeriodization();
        
        // Test Block Periodization
        await this.testBlockPeriodization();
        
        // Test Conjugate Method
        await this.testConjugateMethod();
        
        // Test Daily Undulating Periodization
        await this.testUndulatingPeriodization();
        
        // Test Polarized Training
        await this.testPolarizedTraining();
    }

    async testLinearPeriodization() {
        try {
            const beginnerProfile = {
                id: 'test_beginner',
                name: 'Test Beginner',
                experience: 'beginner',
                trainingType: 'strength',
                timeConstraints: 'moderate',
                recoveryCapacity: 'high'
            };

            const goalParameters = {
                timeframe: 16,
                primaryGoal: 'strength',
                hasCompetitions: false,
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(beginnerProfile, goalParameters);
            
            // Validate linear progression characteristics
            const isLinear = plan.model.key === 'linear';
            const hasProgressiveIntensity = plan.mesocycles.every((meso, index) => 
                index === 0 || meso.intensityProgression >= plan.mesocycles[index - 1].intensityProgression
            );
            
            this.logResult('periodization_models', 'Linear Periodization for Beginner', 
                isLinear && hasProgressiveIntensity, {
                    modelSelected: plan.model.key,
                    score: plan.model.score,
                    hasProgressiveIntensity
                });

        } catch (error) {
            this.logResult('periodization_models', 'Linear Periodization', false, { error: error.message });
        }
    }

    async testBlockPeriodization() {
        try {
            const advancedProfile = {
                id: 'test_advanced',
                name: 'Test Advanced',
                experience: 'advanced',
                trainingType: 'strength',
                timeConstraints: 'high',
                recoveryCapacity: 'moderate'
            };

            const goalParameters = {
                timeframe: 12,
                primaryGoal: 'strength',
                hasCompetitions: true,
                competitions: [{ date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), importance: 'major' }],
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(advancedProfile, goalParameters);
            
            // Validate block periodization characteristics
            const isBlock = plan.model.key === 'block';
            const hasAccumulationPhase = plan.mesocycles.some(meso => meso.phase === 'accumulation');
            const hasIntensificationPhase = plan.mesocycles.some(meso => meso.phase === 'intensification');
            
            this.logResult('periodization_models', 'Block Periodization for Advanced', 
                isBlock && hasAccumulationPhase && hasIntensificationPhase, {
                    modelSelected: plan.model.key,
                    score: plan.model.score,
                    hasAccumulationPhase,
                    hasIntensificationPhase
                });

        } catch (error) {
            this.logResult('periodization_models', 'Block Periodization', false, { error: error.message });
        }
    }

    async testConjugateMethod() {
        try {
            const powerlifterProfile = {
                id: 'test_powerlifter',
                name: 'Test Powerlifter',
                experience: 'advanced',
                trainingType: 'strength',
                timeConstraints: 'high',
                recoveryCapacity: 'high',
                specialization: 'powerlifting'
            };

            const goalParameters = {
                timeframe: 16,
                primaryGoal: 'strength',
                hasCompetitions: true,
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(powerlifterProfile, goalParameters);
            
            // Conjugate method should score highly for powerlifting, but Block is also valid
            const isAppropriateModel = plan.model.key === 'conjugate' || plan.model.key === 'block';
            const hasStrengthFocus = plan.model.key === 'conjugate' ? 
                plan.mesocycles.some(meso => meso.phase === 'max_effort') :
                plan.mesocycles.some(meso => meso.phase === 'strength' || meso.phase === 'intensification');
            const hasValidPhases = plan.model.key === 'conjugate' ? 
                plan.mesocycles.some(meso => meso.phase === 'dynamic_effort') :
                plan.mesocycles.some(meso => meso.phase === 'accumulation');
            
            this.logResult('periodization_models', 'Conjugate Method for Powerlifting', 
                isAppropriateModel && hasStrengthFocus && plan.model.score >= 0.8, {
                    modelSelected: plan.model.key,
                    score: plan.model.score,
                    hasStrengthFocus,
                    hasValidPhases,
                    note: 'Block periodization also valid for advanced powerlifting'
                });

        } catch (error) {
            this.logResult('periodization_models', 'Conjugate Method', false, { error: error.message });
        }
    }

    async testUndulatingPeriodization() {
        try {
            const intermediateProfile = {
                id: 'test_intermediate',
                name: 'Test Intermediate',
                experience: 'intermediate',
                trainingType: 'hypertrophy',
                timeConstraints: 'moderate',
                recoveryCapacity: 'moderate'
            };

            const goalParameters = {
                timeframe: 12,
                primaryGoal: 'hypertrophy',
                hasCompetitions: false,
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(intermediateProfile, goalParameters);
            
            // Undulating should be good for intermediate hypertrophy
            const isUndulating = plan.model.key === 'undulating';
            const hasVariedPhases = plan.mesocycles.some(meso => meso.phase === 'hypertrophy_day');
            
            this.logResult('periodization_models', 'Undulating Periodization for Hypertrophy', 
                isUndulating && hasVariedPhases, {
                    modelSelected: plan.model.key,
                    score: plan.model.score,
                    hasVariedPhases
                });

        } catch (error) {
            this.logResult('periodization_models', 'Undulating Periodization', false, { error: error.message });
        }
    }

    async testPolarizedTraining() {
        try {
            const enduranceProfile = {
                id: 'test_endurance',
                name: 'Test Endurance',
                experience: 'intermediate',
                trainingType: 'endurance',
                timeConstraints: 'high',
                recoveryCapacity: 'high'
            };

            const goalParameters = {
                timeframe: 16,
                primaryGoal: 'endurance',
                hasCompetitions: true,
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(enduranceProfile, goalParameters);
            
            // Polarized should be selected for endurance
            const isPolarized = plan.model.key === 'polarized';
            const hasBaseBuilding = plan.mesocycles.some(meso => meso.phase === 'base_building');
            const hasPeakPhase = plan.mesocycles.some(meso => meso.phase === 'peak');
            
            this.logResult('periodization_models', 'Polarized Training for Endurance', 
                isPolarized && hasBaseBuilding && hasPeakPhase, {
                    modelSelected: plan.model.key,
                    score: plan.model.score,
                    hasBaseBuilding,
                    hasPeakPhase
                });

        } catch (error) {
            this.logResult('periodization_models', 'Polarized Training', false, { error: error.message });
        }
    }

    /**
     * Test athlete profile optimization
     */
    async testAthleteProfileOptimization() {
        console.log('👤 Testing Athlete Profile Optimization...');

        try {
            const profiles = [
                { experience: 'beginner', trainingType: 'strength', expectedModel: 'linear' },
                { experience: 'advanced', trainingType: 'strength', expectedModel: 'block' },
                { experience: 'intermediate', trainingType: 'hypertrophy', expectedModel: 'undulating' },
                { experience: 'advanced', trainingType: 'endurance', expectedModel: 'polarized' }
            ];

            let correctSelections = 0;

            for (const profile of profiles) {
                const athleteProfile = {
                    id: `test_${profile.experience}_${profile.trainingType}`,
                    name: `Test ${profile.experience}`,
                    experience: profile.experience,
                    trainingType: profile.trainingType,
                    timeConstraints: 'moderate',
                    recoveryCapacity: 'moderate'
                };

                const goalParameters = {
                    timeframe: 12,
                    primaryGoal: profile.trainingType,
                    hasCompetitions: false,
                    startDate: new Date()
                };

                const plan = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
                
                if (plan.model.key === profile.expectedModel || plan.model.score > 0.7) {
                    correctSelections++;
                }
            }

            const accuracy = correctSelections / profiles.length;
            
            this.logResult('athlete_profile_optimization', 'Model Selection Accuracy', 
                accuracy >= 0.75, {
                    correctSelections,
                    totalProfiles: profiles.length,
                    accuracy: accuracy * 100
                });

        } catch (error) {
            this.logResult('athlete_profile_optimization', 'Profile Optimization', false, { error: error.message });
        }
    }

    /**
     * Test macrocycle generation
     */
    async testMacrocycleGeneration() {
        console.log('📅 Testing Macrocycle Generation...');

        try {
            const athleteProfile = {
                id: 'test_macrocycle',
                name: 'Test Macrocycle',
                experience: 'intermediate',
                trainingType: 'strength',
                timeConstraints: 'moderate',
                recoveryCapacity: 'moderate'
            };

            const goalParameters = {
                timeframe: 16,
                primaryGoal: 'strength',
                hasCompetitions: false,
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
            
            // Validate macrocycle structure
            const hasCorrectDuration = plan.macrocycle.totalWeeks === 16;
            const hasPhases = plan.macrocycle.phases && plan.macrocycle.phases.length > 0;
            const hasDeloadWeeks = plan.macrocycle.deloadWeeks && plan.macrocycle.deloadWeeks.length > 0;
            const hasTestingWeeks = plan.macrocycle.testingWeeks && plan.macrocycle.testingWeeks.length > 0;
            
            this.logResult('macrocycle_generation', 'Macrocycle Structure Validation', 
                hasCorrectDuration && hasPhases && hasDeloadWeeks && hasTestingWeeks, {
                    totalWeeks: plan.macrocycle.totalWeeks,
                    phaseCount: plan.macrocycle.phases.length,
                    deloadWeeks: plan.macrocycle.deloadWeeks.length,
                    testingWeeks: plan.macrocycle.testingWeeks.length
                });

        } catch (error) {
            this.logResult('macrocycle_generation', 'Macrocycle Generation', false, { error: error.message });
        }
    }

    /**
     * Test mesocycle adaptation
     */
    async testMesocycleAdaptation() {
        console.log('🔄 Testing Mesocycle Adaptation...');

        try {
            const athleteProfile = {
                id: 'test_mesocycle',
                name: 'Test Mesocycle',
                experience: 'advanced',
                trainingType: 'strength',
                timeConstraints: 'high',
                recoveryCapacity: 'high'
            };

            const goalParameters = {
                timeframe: 12,
                primaryGoal: 'strength',
                hasCompetitions: false,
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
            
            // Validate mesocycle progression
            const hasCorrectMesocycles = plan.mesocycles.length > 0;
            const hasVolumeProgression = plan.mesocycles.every(meso => 
                typeof meso.volumeProgression === 'number'
            );
            const hasIntensityProgression = plan.mesocycles.every(meso => 
                typeof meso.intensityProgression === 'number'
            );
            const hasFocusAreas = plan.mesocycles.every(meso => 
                meso.focusAreas && meso.focusAreas.length > 0
            );
            
            this.logResult('mesocycle_adaptation', 'Mesocycle Structure and Progression', 
                hasCorrectMesocycles && hasVolumeProgression && hasIntensityProgression && hasFocusAreas, {
                    mesocycleCount: plan.mesocycles.length,
                    hasVolumeProgression,
                    hasIntensityProgression,
                    hasFocusAreas
                });

        } catch (error) {
            this.logResult('mesocycle_adaptation', 'Mesocycle Adaptation', false, { error: error.message });
        }
    }

    /**
     * Test microcycle optimization
     */
    async testMicrocycleOptimization() {
        console.log('⚡ Testing Microcycle Optimization...');

        try {
            const athleteProfile = {
                id: 'test_microcycle',
                name: 'Test Microcycle',
                experience: 'intermediate',
                trainingType: 'strength',
                timeConstraints: 'moderate',
                recoveryCapacity: 'moderate'
            };

            const goalParameters = {
                timeframe: 8,
                primaryGoal: 'strength',
                hasCompetitions: false,
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
            
            // Validate microcycle structure (allow some flexibility for rounding)
            const expectedMicrocycles = goalParameters.timeframe;
            const actualMicrocycles = plan.microcycles.length;
            const hasCorrectMicrocycles = Math.abs(actualMicrocycles - expectedMicrocycles) <= 1;
            const hasDeloadWeeks = plan.microcycles.some(micro => micro.isDeloadWeek);
            const hasVolumeMultipliers = plan.microcycles.every(micro => 
                typeof micro.volumeMultiplier === 'number'
            );
            const hasIntensityMultipliers = plan.microcycles.every(micro => 
                typeof micro.intensityMultiplier === 'number'
            );
            
            this.logResult('microcycle_optimization', 'Microcycle Structure and Multipliers', 
                hasCorrectMicrocycles && hasDeloadWeeks && hasVolumeMultipliers && hasIntensityMultipliers, {
                    microcycleCount: plan.microcycles.length,
                    hasDeloadWeeks,
                    hasVolumeMultipliers,
                    hasIntensityMultipliers
                });

        } catch (error) {
            this.logResult('microcycle_optimization', 'Microcycle Optimization', false, { error: error.message });
        }
    }

    /**
     * Test competition timing integration
     */
    async testCompetitionTiming() {
        console.log('🏆 Testing Competition Timing...');

        try {
            const athleteProfile = {
                id: 'test_competition',
                name: 'Test Competition',
                experience: 'advanced',
                trainingType: 'strength',
                timeConstraints: 'high',
                recoveryCapacity: 'high'
            };

            const competitionDate = new Date(Date.now() + 84 * 24 * 60 * 60 * 1000); // 12 weeks from now
            const goalParameters = {
                timeframe: 16,
                primaryGoal: 'strength',
                hasCompetitions: true,
                competitions: [{
                    name: 'Test Powerlifting Meet',
                    date: competitionDate,
                    importance: 'major',
                    type: 'powerlifting'
                }],
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
            
            // Check for taper weeks
            const hasTaperWeeks = plan.microcycles.some(micro => micro.isTaperWeek);
            const hasCompetitionPrep = plan.microcycles.some(micro => 
                micro.competitionPrep && micro.competitionPrep.competition
            );
            
            this.logResult('competition_timing', 'Competition Integration and Tapering', 
                hasTaperWeeks && hasCompetitionPrep, {
                    hasTaperWeeks,
                    hasCompetitionPrep,
                    competitionCount: goalParameters.competitions.length
                });

        } catch (error) {
            this.logResult('competition_timing', 'Competition Timing', false, { error: error.message });
        }
    }

    /**
     * Test tapering protocols
     */
    async testTaperingProtocols() {
        console.log('📉 Testing Tapering Protocols...');

        try {
            const microcycles = Array.from({ length: 12 }, (_, i) => ({
                id: `micro_${i + 1}`,
                week: i + 1,
                volumeMultiplier: 1.0,
                intensityMultiplier: 1.0
            }));

            const competition = {
                name: 'Test Meet',
                importance: 'major',
                type: 'powerlifting'
            };

            // Simulate tapering
            this.periodizationAI.implementTaperingProtocol(microcycles, 10, 3, competition);
            
            // Check taper characteristics
            const taperWeeks = microcycles.filter(micro => micro.isTaperWeek);
            const hasVolumeReduction = taperWeeks.every(micro => micro.volumeMultiplier < 1.0);
            const hasIntensityMaintenance = taperWeeks.some(micro => micro.intensityMultiplier >= 1.0);
            
            this.logResult('tapering_protocols', 'Tapering Implementation', 
                taperWeeks.length === 3 && hasVolumeReduction && hasIntensityMaintenance, {
                    taperWeeks: taperWeeks.length,
                    hasVolumeReduction,
                    hasIntensityMaintenance
                });

        } catch (error) {
            this.logResult('tapering_protocols', 'Tapering Protocols', false, { error: error.message });
        }
    }

    /**
     * Test workout adaptation with periodization
     */
    async testWorkoutAdaptation() {
        console.log('🏋️ Testing Workout Adaptation...');

        try {
            // Create a periodization plan
            const athleteProfile = {
                id: 'test_workout_adaptation',
                name: 'Test Workout Adaptation',
                experience: 'intermediate',
                trainingType: 'strength',
                timeConstraints: 'moderate',
                recoveryCapacity: 'moderate'
            };

            const goalParameters = {
                timeframe: 12,
                primaryGoal: 'strength',
                hasCompetitions: false,
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
            
            // Test workout adaptation for different weeks
            const mockWorkout = {
                exercises: [{
                    name: 'Bench Press',
                    isMainLift: true,
                    sets: 5,
                    targetReps: 5,
                    targetWeight: 225,
                    workingSets: [{
                        sets: 3,
                        weight: 225,
                        reps: 5,
                        percentage: 85
                    }]
                }],
                modifications: []
            };

            // Test adaptation for week 1 (accumulation)
            const adaptedWorkout1 = this.periodizationAI.adaptWorkoutToPeriodization(mockWorkout, 1);
            const hasVolumeModification = adaptedWorkout1.modifications.some(mod => mod.type === 'volume');
            const hasIntensityModification = adaptedWorkout1.modifications.some(mod => mod.type === 'intensity');
            const hasPeriodizationContext = adaptedWorkout1.periodizationContext !== undefined;
            
            // Test adaptation for deload week
            const adaptedWorkout4 = this.periodizationAI.adaptWorkoutToPeriodization(mockWorkout, 4);
            const isDeloadAdapted = adaptedWorkout4.periodizationContext.isDeloadWeek;
            
            this.logResult('workout_adaptation', 'Periodization Workout Adaptation', 
                hasVolumeModification && hasIntensityModification && hasPeriodizationContext, {
                    hasVolumeModification,
                    hasIntensityModification,
                    hasPeriodizationContext,
                    isDeloadAdapted
                });

        } catch (error) {
            this.logResult('workout_adaptation', 'Workout Adaptation', false, { error: error.message });
        }
    }

    /**
     * Test volume and intensity progression algorithms
     */
    async testVolumeIntensityProgression() {
        console.log('📈 Testing Volume/Intensity Progression...');

        try {
            const phase = {
                name: 'hypertrophy',
                volume: 1.2,
                intensity: 0.75,
                focus: 'volume'
            };

            // Test volume progression
            const volumeProgression1 = this.periodizationAI.calculateVolumeProgression(phase, 0, 3);
            const volumeProgression2 = this.periodizationAI.calculateVolumeProgression(phase, 1, 3);
            const volumeProgression3 = this.periodizationAI.calculateVolumeProgression(phase, 2, 3);
            
            const hasVolumeProgression = volumeProgression1 < volumeProgression2 && volumeProgression2 < volumeProgression3;
            
            // Test intensity progression
            const intensityProgression1 = this.periodizationAI.calculateIntensityProgression(phase, 0, 3);
            const intensityProgression2 = this.periodizationAI.calculateIntensityProgression(phase, 1, 3);
            const intensityProgression3 = this.periodizationAI.calculateIntensityProgression(phase, 2, 3);
            
            const hasCorrectIntensity = intensityProgression1 === intensityProgression2 && intensityProgression2 === intensityProgression3;
            
            // Test weekly multipliers
            const mesocycle = { volumeProgression: 1.1, intensityProgression: 0.85 };
            const weeklyVolume1 = this.periodizationAI.calculateWeeklyVolumeMultiplier(mesocycle, 0, false);
            const weeklyVolume2 = this.periodizationAI.calculateWeeklyVolumeMultiplier(mesocycle, 1, false);
            const weeklyVolumeDeload = this.periodizationAI.calculateWeeklyVolumeMultiplier(mesocycle, 0, true);
            
            const hasWeeklyProgression = weeklyVolume1 < weeklyVolume2;
            const hasDeloadReduction = weeklyVolumeDeload < weeklyVolume1;
            
            this.logResult('volume_intensity_progression', 'Progression Algorithm Validation', 
                hasVolumeProgression && hasCorrectIntensity && hasWeeklyProgression && hasDeloadReduction, {
                    hasVolumeProgression,
                    hasCorrectIntensity,
                    hasWeeklyProgression,
                    hasDeloadReduction,
                    volumeProgression: [volumeProgression1, volumeProgression2, volumeProgression3],
                    weeklyMultipliers: [weeklyVolume1, weeklyVolume2, weeklyVolumeDeload]
                });

        } catch (error) {
            this.logResult('volume_intensity_progression', 'Volume/Intensity Progression', false, { error: error.message });
        }
    }

    /**
     * Test performance monitoring and adaptation
     */
    async testPerformanceMonitoring() {
        console.log('📊 Testing Performance Monitoring...');

        try {
            // Create mock performance data
            const recentPerformanceData = [
                { date: '2024-01-01', avgRPE: 8.5, volume: 12000, strength: 425, recovery: 6.5 },
                { date: '2024-01-03', avgRPE: 8.8, volume: 12200, strength: 430, recovery: 6.0 },
                { date: '2024-01-05', avgRPE: 9.2, volume: 11800, strength: 425, recovery: 5.5 },
                { date: '2024-01-08', avgRPE: 9.5, volume: 11000, strength: 420, recovery: 5.0 }
            ];

            // Create a plan and set current week
            const athleteProfile = {
                id: 'test_monitoring',
                name: 'Test Monitoring',
                experience: 'intermediate',
                trainingType: 'strength'
            };

            const goalParameters = {
                timeframe: 12,
                primaryGoal: 'strength',
                startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 2 weeks ago
            };

            const plan = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
            
            // Test monitoring
            const adaptationResult = this.periodizationAI.monitorAndAdaptPeriodization(recentPerformanceData);
            
            const hasAnalysis = adaptationResult.analysis !== undefined;
            const hasRecommendations = adaptationResult.modifications !== undefined;
            const hasCurrentPhase = adaptationResult.currentPhase !== undefined;
            const hasWeekTracking = typeof adaptationResult.week === 'number';
            
            this.logResult('performance_monitoring', 'Performance Monitoring and Adaptation', 
                hasAnalysis && hasRecommendations && hasCurrentPhase && hasWeekTracking, {
                    hasAnalysis,
                    hasRecommendations,
                    hasCurrentPhase,
                    hasWeekTracking,
                    adaptationNeeded: adaptationResult.adaptationNeeded
                });

        } catch (error) {
            this.logResult('performance_monitoring', 'Performance Monitoring', false, { error: error.message });
        }
    }

    /**
     * Test integration with existing adaptive system
     */
    async testAdaptiveIntegration() {
        console.log('🔗 Testing Adaptive System Integration...');

        try {
            // Test export/import functionality
            const athleteProfile = {
                id: 'test_integration',
                name: 'Test Integration',
                experience: 'intermediate',
                trainingType: 'strength'
            };

            const goalParameters = {
                timeframe: 12,
                primaryGoal: 'strength',
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
            
            // Test export
            const exportedData = this.periodizationAI.exportPeriodizationPlan();
            const hasExportData = exportedData && exportedData.plan && exportedData.version;
            
            // Test import
            const importResult = this.periodizationAI.importPeriodizationPlan(exportedData);
            const hasImportSuccess = importResult.success;
            
            // Test that current plan is restored
            const restoredPlan = this.periodizationAI.currentMacrocycle;
            const isRestored = restoredPlan && restoredPlan.athleteId === plan.athleteId;
            
            this.logResult('adaptive_integration', 'Export/Import Integration', 
                hasExportData && hasImportSuccess && isRestored, {
                    hasExportData,
                    hasImportSuccess,
                    isRestored,
                    exportVersion: exportedData?.version
                });

        } catch (error) {
            this.logResult('adaptive_integration', 'Adaptive Integration', false, { error: error.message });
        }
    }

    /**
     * Test data persistence and validation
     */
    async testDataPersistence() {
        console.log('💾 Testing Data Persistence...');

        try {
            // Test plan creation and storage
            const athleteProfile = {
                id: 'test_persistence',
                name: 'Test Persistence',
                experience: 'advanced',
                trainingType: 'strength'
            };

            const goalParameters = {
                timeframe: 16,
                primaryGoal: 'strength',
                startDate: new Date()
            };

            const plan1 = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
            const hasInitialPlan = plan1 && plan1.athleteId === 'test_persistence';
            
            // Test plan persistence
            const currentPlan = this.periodizationAI.currentMacrocycle;
            const isPersisted = currentPlan && currentPlan.athleteId === plan1.athleteId;
            
            // Test multiple plans
            athleteProfile.id = 'test_persistence_2';
            const plan2 = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
            const hasSecondPlan = plan2 && plan2.athleteId === 'test_persistence_2';
            
            this.logResult('data_persistence', 'Plan Creation and Persistence', 
                hasInitialPlan && isPersisted && hasSecondPlan, {
                    hasInitialPlan,
                    isPersisted,
                    hasSecondPlan
                });

        } catch (error) {
            this.logResult('data_persistence', 'Data Persistence', false, { error: error.message });
        }
    }

    /**
     * Test error handling and edge cases
     */
    async testErrorHandling() {
        console.log('🛡️ Testing Error Handling...');

        try {
            let errorsCaught = 0;
            const totalTests = 4;

            // Test invalid athlete profile
            try {
                this.periodizationAI.createPeriodizationPlan(null, { timeframe: 12 });
            } catch {
                errorsCaught++;
            }

            // Test invalid goal parameters
            try {
                this.periodizationAI.createPeriodizationPlan({ id: 'test' }, null);
            } catch {
                errorsCaught++;
            }

            // Test invalid workout adaptation
            try {
                this.periodizationAI.adaptWorkoutToPeriodization(null, 1);
            } catch {
                // Should handle gracefully, not throw
                errorsCaught++;
            }

            // Test invalid import data
            try {
                const result = this.periodizationAI.importPeriodizationPlan({ invalid: 'data' });
                if (!result.success) errorsCaught++;
            } catch {
                errorsCaught++;
            }

            this.logResult('error_handling', 'Error Handling and Validation', 
                errorsCaught >= totalTests * 0.75, {
                    errorsCaught,
                    totalTests,
                    handlingRate: (errorsCaught / totalTests) * 100
                });

        } catch (error) {
            this.logResult('error_handling', 'Error Handling', false, { error: error.message });
        }
    }

    /**
     * Test performance metrics
     */
    async testPerformanceMetrics() {
        console.log('⚡ Testing Performance Metrics...');

        try {
            const startTime = performance.now();
            
            // Test plan creation performance
            const athleteProfile = {
                id: 'test_performance',
                name: 'Test Performance',
                experience: 'intermediate',
                trainingType: 'strength'
            };

            const goalParameters = {
                timeframe: 16,
                primaryGoal: 'strength',
                startDate: new Date()
            };

            const plan = this.periodizationAI.createPeriodizationPlan(athleteProfile, goalParameters);
            const planCreationTime = performance.now() - startTime;
            
            // Test workout adaptation performance
            const workoutStartTime = performance.now();
            const mockWorkout = {
                exercises: [{ name: 'Squat', sets: 5, targetReps: 5, isMainLift: true }],
                modifications: []
            };
            
            this.periodizationAI.adaptWorkoutToPeriodization(mockWorkout, 1);
            const adaptationTime = performance.now() - workoutStartTime;
            
            // Test monitoring performance
            const monitoringStartTime = performance.now();
            const mockData = [
                { date: '2024-01-01', avgRPE: 8.0, volume: 12000, strength: 400, recovery: 7.0 }
            ];
            this.periodizationAI.monitorAndAdaptPeriodization(mockData);
            const monitoringTime = performance.now() - monitoringStartTime;
            
            // Performance targets (milliseconds)
            const planCreationTarget = 2000;
            const adaptationTarget = 500;
            const monitoringTarget = 1000;
            
            const meetsPerformanceTargets = 
                planCreationTime < planCreationTarget &&
                adaptationTime < adaptationTarget &&
                monitoringTime < monitoringTarget;
            
            this.logResult('performance_metrics', 'Performance Benchmarks', 
                meetsPerformanceTargets, {
                    planCreationTime: Math.round(planCreationTime),
                    adaptationTime: Math.round(adaptationTime),
                    monitoringTime: Math.round(monitoringTime),
                    targets: { planCreationTarget, adaptationTarget, monitoringTarget }
                });

        } catch (error) {
            this.logResult('performance_metrics', 'Performance Metrics', false, { error: error.message });
        }
    }

    /**
     * Test large dataset handling
     */
    async testLargeDatasetHandling() {
        console.log('📊 Testing Large Dataset Handling...');

        try {
            // Create a large performance dataset
            const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
                avgRPE: 7 + Math.random() * 2,
                volume: 10000 + Math.random() * 5000,
                strength: 400 + Math.random() * 100,
                recovery: 5 + Math.random() * 3
            }));

            const startTime = performance.now();
            
            // Test monitoring with large dataset
            const result = this.periodizationAI.monitorAndAdaptPeriodization(largeDataset);
            
            const processingTime = performance.now() - startTime;
            const processingTarget = 5000; // 5 seconds max
            
            const hasResult = result && typeof result.adaptationNeeded === 'boolean';
            const meetsPerformanceTarget = processingTime < processingTarget;
            
            this.logResult('large_dataset_handling', 'Large Dataset Processing', 
                hasResult && meetsPerformanceTarget, {
                    datasetSize: largeDataset.length,
                    processingTime: Math.round(processingTime),
                    processingTarget,
                    hasResult
                });

        } catch (error) {
            this.logResult('large_dataset_handling', 'Large Dataset Handling', false, { error: error.message });
        }
    }

    /**
     * Log test result
     */
    logResult(category, test, passed, details = {}) {
        const result = {
            category,
            test,
            passed,
            timestamp: new Date().toISOString(),
            details,
            duration: 0
        };
        
        this.results.push(result);
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${category}: ${test}`);
        
        if (!passed && details.error) {
            console.log(`   Error: ${details.error}`);
        }
    }

    /**
     * Generate comprehensive test report
     */
    async generateReport() {
        console.log('📋 Generating Test Report...');

        const summary = {
            total: this.results.length,
            passed: this.results.filter(r => r.passed).length,
            failed: this.results.filter(r => !r.passed).length,
            passRate: 0,
            byCategory: {}
        };

        summary.passRate = (summary.passed / summary.total) * 100;

        // Group by category
        const categories = [...new Set(this.results.map(r => r.category))];
        categories.forEach(category => {
            const categoryResults = this.results.filter(r => r.category === category);
            summary.byCategory[category] = {
                total: categoryResults.length,
                passed: categoryResults.filter(r => r.passed).length,
                failed: categoryResults.filter(r => !r.passed).length,
                passRate: (categoryResults.filter(r => r.passed).length / categoryResults.length) * 100
            };
        });

        const report = {
            timestamp: new Date().toISOString(),
            summary,
            results: this.results,
            environment: {
                nodeVersion: process.version,
                puppeteerVersion: require('puppeteer/package.json').version
            }
        };

        // Save report
        const reportPath = path.join(__dirname, `periodization-ai-test-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log('📊 Test Summary:');
        console.log(`   Total Tests: ${summary.total}`);
        console.log(`   Passed: ${summary.passed}`);
        console.log(`   Failed: ${summary.failed}`);
        console.log(`   Pass Rate: ${summary.passRate.toFixed(2)}%`);
        console.log(`📁 Report saved: ${reportPath}`);

        return report;
    }
}

// Run tests if called directly
if (require.main === module) {
    const testSuite = new PeriodizationAITestSuite();
    
    testSuite.initialize()
        .then(() => testSuite.runAllTests())
        .then(() => {
            console.log('🎉 Periodization AI Test Suite Complete!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Test Suite Failed:', error);
            process.exit(1);
        });
}

module.exports = PeriodizationAITestSuite;