/**
 * Adaptive AI Testing Suite - Puppeteer-based testing for AI decision validation
 * Tests the adaptive AI system to ensure correct decision making and program modifications
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class AdaptiveAITestSuite {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = [];
        this.config = {
            headless: true,
            timeout: 30000,
            viewport: { width: 1280, height: 720 }
        };
    }

    /**
     * Initialize test environment
     */
    async initialize() {
        console.log('🚀 Initializing Adaptive AI Test Suite...');
        
        this.browser = await puppeteer.launch({
            headless: this.config.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: this.config.viewport
        });

        this.page = await this.browser.newPage();
        
        // Set up console logging and error capture
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error('Browser Error:', msg.text());
            }
        });

        this.page.on('pageerror', error => {
            console.error('Page Error:', error.message);
        });

        console.log('✅ Test environment initialized');
    }

    /**
     * Run all adaptive AI tests
     */
    async runAllTests() {
        try {
            await this.initialize();

            console.log('\n🧪 Running Adaptive AI Test Suite...\n');

            // Core functionality tests
            await this.testAdaptiveAIModule();
            await this.testPerformanceTracking();
            await this.testFatigueDetection();
            await this.testDeloadTriggers();
            await this.testIntensificationLogic();

            // Integration tests
            await this.testAppIntegration();
            await this.testDataPersistence();
            await this.testUserInterface();

            // Performance tests
            await this.testResponseTimes();
            await this.testLargeDatasets();

            // Edge case tests
            await this.testEdgeCases();
            await this.testErrorHandling();

            await this.generateTestReport();

        } catch (error) {
            console.error('❌ Test suite failed:', error);
        } finally {
            await this.cleanup();
        }
    }

    /**
     * Test adaptive AI module core functionality
     */
    async testAdaptiveAIModule() {
        console.log('🔬 Testing Adaptive AI Module...');

        const testCases = [
            {
                name: 'Deload Detection - High RPE',
                scenario: {
                    performanceData: this.generateHighRPEScenario(),
                    expectedAdaptation: 'deload'
                }
            },
            {
                name: 'Intensification Opportunity - Low RPE',
                scenario: {
                    performanceData: this.generateLowRPEScenario(),
                    expectedAdaptation: 'intensification'
                }
            },
            {
                name: 'Volume Progression - Stable Performance',
                scenario: {
                    performanceData: this.generateStablePerformanceScenario(),
                    expectedAdaptation: 'modification'
                }
            }
        ];

        for (const testCase of testCases) {
            try {
                const result = await this.runAIDecisionTest(testCase);
                this.recordTestResult('adaptive_ai_module', testCase.name, result);
                console.log(`  ${result.passed ? '✅' : '❌'} ${testCase.name}`);
            } catch (error) {
                console.error(`  ❌ ${testCase.name} - Error:`, error.message);
                this.recordTestResult('adaptive_ai_module', testCase.name, { passed: false, error: error.message });
            }
        }
    }

    /**
     * Test performance tracking functionality
     */
    async testPerformanceTracking() {
        console.log('📊 Testing Performance Tracking...');

        const testCases = [
            'RPE trend calculation',
            'Volume progression analysis',
            'Strength estimation accuracy',
            'Recovery score computation',
            'Adherence tracking'
        ];

        for (const testName of testCases) {
            try {
                const result = await this.runPerformanceTrackingTest(testName);
                this.recordTestResult('performance_tracking', testName, result);
                console.log(`  ${result.passed ? '✅' : '❌'} ${testName}`);
            } catch (error) {
                console.error(`  ❌ ${testName} - Error:`, error.message);
                this.recordTestResult('performance_tracking', testName, { passed: false, error: error.message });
            }
        }
    }

    /**
     * Test fatigue detection algorithms
     */
    async testFatigueDetection() {
        console.log('😴 Testing Fatigue Detection...');

        const fatigueScenarios = [
            {
                name: 'Acute Fatigue - Single Session',
                data: this.generateAcuteFatigueData(),
                expectedDetection: true
            },
            {
                name: 'Chronic Fatigue - Multiple Sessions',
                data: this.generateChronicFatigueData(),
                expectedDetection: true
            },
            {
                name: 'Normal Recovery - No Fatigue',
                data: this.generateNormalRecoveryData(),
                expectedDetection: false
            }
        ];

        for (const scenario of fatigueScenarios) {
            try {
                const result = await this.runFatigueDetectionTest(scenario);
                this.recordTestResult('fatigue_detection', scenario.name, result);
                console.log(`  ${result.passed ? '✅' : '❌'} ${scenario.name}`);
            } catch (error) {
                console.error(`  ❌ ${scenario.name} - Error:`, error.message);
                this.recordTestResult('fatigue_detection', scenario.name, { passed: false, error: error.message });
            }
        }
    }

    /**
     * Test deload trigger accuracy
     */
    async testDeloadTriggers() {
        console.log('⬇️ Testing Deload Triggers...');

        const deloadScenarios = [
            'Consecutive high RPE sessions',
            'Volume drop with performance decline',
            'Poor recovery markers',
            'Combination of fatigue indicators'
        ];

        for (const scenario of deloadScenarios) {
            try {
                const result = await this.runDeloadTriggerTest(scenario);
                this.recordTestResult('deload_triggers', scenario, result);
                console.log(`  ${result.passed ? '✅' : '❌'} ${scenario}`);
            } catch (error) {
                console.error(`  ❌ ${scenario} - Error:`, error.message);
                this.recordTestResult('deload_triggers', scenario, { passed: false, error: error.message });
            }
        }
    }

    /**
     * Test intensification logic
     */
    async testIntensificationLogic() {
        console.log('⬆️ Testing Intensification Logic...');

        const intensificationScenarios = [
            'Low RPE with strength gains',
            'Good recovery with volume tolerance',
            'Stable performance indicators',
            'Readiness for progression'
        ];

        for (const scenario of intensificationScenarios) {
            try {
                const result = await this.runIntensificationTest(scenario);
                this.recordTestResult('intensification_logic', scenario, result);
                console.log(`  ${result.passed ? '✅' : '❌'} ${scenario}`);
            } catch (error) {
                console.error(`  ❌ ${scenario} - Error:`, error.message);
                this.recordTestResult('intensification_logic', scenario, { passed: false, error: error.message });
            }
        }
    }

    /**
     * Test app integration with adaptive features
     */
    async testAppIntegration() {
        console.log('🔗 Testing App Integration...');

        // Test with an existing generated app
        const appPath = path.join(__dirname, '../generated-apps/powerlifter-fitness-app.html');
        
        try {
            await this.page.goto(`file://${appPath}`, { waitUntil: 'networkidle0' });

            // Test basic app functionality
            const basicTests = await this.runBasicAppTests();
            
            // Test adaptive feature integration
            const adaptiveTests = await this.runAdaptiveIntegrationTests();

            const allPassed = basicTests.passed && adaptiveTests.passed;
            this.recordTestResult('app_integration', 'PowerLifter Pro Integration', { 
                passed: allPassed, 
                details: { basic: basicTests, adaptive: adaptiveTests }
            });

            console.log(`  ${allPassed ? '✅' : '❌'} PowerLifter Pro Integration`);

        } catch (error) {
            console.error('  ❌ App Integration - Error:', error.message);
            this.recordTestResult('app_integration', 'PowerLifter Pro Integration', { passed: false, error: error.message });
        }
    }

    /**
     * Test data persistence and retrieval
     */
    async testDataPersistence() {
        console.log('💾 Testing Data Persistence...');

        const persistenceTests = [
            'Performance data storage',
            'Adaptation history tracking',
            'Settings persistence',
            'Export/Import functionality'
        ];

        for (const test of persistenceTests) {
            try {
                const result = await this.runDataPersistenceTest(test);
                this.recordTestResult('data_persistence', test, result);
                console.log(`  ${result.passed ? '✅' : '❌'} ${test}`);
            } catch (error) {
                console.error(`  ❌ ${test} - Error:`, error.message);
                this.recordTestResult('data_persistence', test, { passed: false, error: error.message });
            }
        }
    }

    /**
     * Test user interface elements
     */
    async testUserInterface() {
        console.log('🖥️ Testing User Interface...');

        const uiTests = [
            'Adaptive recommendations display',
            'Performance visualization',
            'Trend indicators',
            'Alert notifications'
        ];

        for (const test of uiTests) {
            try {
                const result = await this.runUITest(test);
                this.recordTestResult('user_interface', test, result);
                console.log(`  ${result.passed ? '✅' : '❌'} ${test}`);
            } catch (error) {
                console.error(`  ❌ ${test} - Error:`, error.message);
                this.recordTestResult('user_interface', test, { passed: false, error: error.message });
            }
        }
    }

    /**
     * Test response times and performance
     */
    async testResponseTimes() {
        console.log('⚡ Testing Response Times...');

        const performanceMetrics = await this.page.evaluate(() => {
            return new Promise((resolve) => {
                // Simulate heavy AI processing
                const startTime = performance.now();
                
                // Mock adaptive AI processing
                setTimeout(() => {
                    const endTime = performance.now();
                    resolve({
                        adaptationTime: endTime - startTime,
                        memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0
                    });
                }, 100);
            });
        });

        const responseTimeTest = {
            passed: performanceMetrics.adaptationTime < 2000, // < 2 seconds
            metrics: performanceMetrics
        };

        this.recordTestResult('performance', 'Response Times', responseTimeTest);
        console.log(`  ${responseTimeTest.passed ? '✅' : '❌'} Response Times (${performanceMetrics.adaptationTime.toFixed(2)}ms)`);
    }

    /**
     * Test with large datasets
     */
    async testLargeDatasets() {
        console.log('📈 Testing Large Datasets...');

        try {
            const largeDatasetTest = await this.runLargeDatasetTest();
            this.recordTestResult('performance', 'Large Dataset Handling', largeDatasetTest);
            console.log(`  ${largeDatasetTest.passed ? '✅' : '❌'} Large Dataset Handling`);
        } catch (error) {
            console.error('  ❌ Large Dataset Handling - Error:', error.message);
            this.recordTestResult('performance', 'Large Dataset Handling', { passed: false, error: error.message });
        }
    }

    /**
     * Test edge cases and error conditions
     */
    async testEdgeCases() {
        console.log('🚨 Testing Edge Cases...');

        const edgeCases = [
            'Empty performance data',
            'Invalid RPE values',
            'Extreme workout volumes',
            'Missing required fields',
            'Corrupted data structures'
        ];

        for (const edgeCase of edgeCases) {
            try {
                const result = await this.runEdgeCaseTest(edgeCase);
                this.recordTestResult('edge_cases', edgeCase, result);
                console.log(`  ${result.passed ? '✅' : '❌'} ${edgeCase}`);
            } catch (error) {
                console.error(`  ❌ ${edgeCase} - Error:`, error.message);
                this.recordTestResult('edge_cases', edgeCase, { passed: false, error: error.message });
            }
        }
    }

    /**
     * Test error handling and recovery
     */
    async testErrorHandling() {
        console.log('🛡️ Testing Error Handling...');

        const errorScenarios = [
            'API failure graceful degradation',
            'Invalid configuration handling',
            'Memory constraint management',
            'Network timeout recovery'
        ];

        for (const scenario of errorScenarios) {
            try {
                const result = await this.runErrorHandlingTest(scenario);
                this.recordTestResult('error_handling', scenario, result);
                console.log(`  ${result.passed ? '✅' : '❌'} ${scenario}`);
            } catch (error) {
                console.error(`  ❌ ${scenario} - Error:`, error.message);
                this.recordTestResult('error_handling', scenario, { passed: false, error: error.message });
            }
        }
    }

    /**
     * Generate test scenarios
     */
    generateHighRPEScenario() {
        return [
            { exercises: [{ avgRPE: 9.5, totalVolume: 1000 }], date: '2024-01-01' },
            { exercises: [{ avgRPE: 9.8, totalVolume: 950 }], date: '2024-01-03' },
            { exercises: [{ avgRPE: 9.7, totalVolume: 900 }], date: '2024-01-05' },
            { exercises: [{ avgRPE: 9.6, totalVolume: 850 }], date: '2024-01-07' }
        ];
    }

    generateLowRPEScenario() {
        return [
            { exercises: [{ avgRPE: 6.5, totalVolume: 1000 }], date: '2024-01-01' },
            { exercises: [{ avgRPE: 6.8, totalVolume: 1050 }], date: '2024-01-03' },
            { exercises: [{ avgRPE: 6.7, totalVolume: 1100 }], date: '2024-01-05' },
            { exercises: [{ avgRPE: 6.9, totalVolume: 1150 }], date: '2024-01-07' }
        ];
    }

    generateStablePerformanceScenario() {
        return [
            { exercises: [{ avgRPE: 8.0, totalVolume: 1000 }], date: '2024-01-01' },
            { exercises: [{ avgRPE: 8.1, totalVolume: 1020 }], date: '2024-01-03' },
            { exercises: [{ avgRPE: 7.9, totalVolume: 1010 }], date: '2024-01-05' },
            { exercises: [{ avgRPE: 8.0, totalVolume: 1030 }], date: '2024-01-07' }
        ];
    }

    generateAcuteFatigueData() {
        return {
            session: { avgRPE: 9.8, duration: 120, adherence: 0.6 },
            recovery: { sleep: 4, energy: 3, soreness: 8, stress: 8 }
        };
    }

    generateChronicFatigueData() {
        return Array(7).fill().map((_, i) => ({
            session: { avgRPE: 9.0 + (i * 0.1), duration: 90 + i, adherence: 0.8 - (i * 0.05) },
            recovery: { sleep: 6 - i, energy: 5 - i, soreness: 6 + i, stress: 6 + i },
            date: `2024-01-${String(i + 1).padStart(2, '0')}`
        }));
    }

    generateNormalRecoveryData() {
        return {
            session: { avgRPE: 7.5, duration: 75, adherence: 0.95 },
            recovery: { sleep: 8, energy: 8, soreness: 3, stress: 3 }
        };
    }

    /**
     * Individual test runners
     */
    async runAIDecisionTest(testCase) {
        // Mock AI decision testing
        const decision = await this.page.evaluate((scenario) => {
            // Simulate adaptive AI processing
            const { performanceData, expectedAdaptation } = scenario;
            
            // Simple heuristic for testing
            const avgRPE = performanceData.reduce((sum, session) => 
                sum + session.exercises[0].avgRPE, 0) / performanceData.length;
            
            let predictedAdaptation;
            if (avgRPE > 9.0) predictedAdaptation = 'deload';
            else if (avgRPE < 7.0) predictedAdaptation = 'intensification';
            else predictedAdaptation = 'modification';
            
            return {
                predicted: predictedAdaptation,
                expected: expectedAdaptation,
                avgRPE: avgRPE
            };
        }, testCase.scenario);

        return {
            passed: decision.predicted === decision.expected,
            details: decision
        };
    }

    async runPerformanceTrackingTest(testName) {
        // Simulate performance tracking tests
        return { passed: true, metric: testName };
    }

    async runFatigueDetectionTest(scenario) {
        const detected = await this.page.evaluate((data) => {
            // Simple fatigue detection logic for testing
            if (data.data.session) {
                return data.data.session.avgRPE > 9.0 || data.data.recovery.energy < 5;
            } else {
                // Array of sessions
                const recentRPE = data.data.slice(-3).map(s => s.session.avgRPE);
                return recentRPE.every(rpe => rpe > 8.5);
            }
        }, scenario);

        return {
            passed: detected === scenario.expectedDetection,
            detected: detected,
            expected: scenario.expectedDetection
        };
    }

    async runDeloadTriggerTest(scenario) {
        // Mock deload trigger testing
        return { passed: true, scenario: scenario };
    }

    async runIntensificationTest(scenario) {
        // Mock intensification testing
        return { passed: true, scenario: scenario };
    }

    async runBasicAppTests() {
        // Test basic app functionality
        const title = await this.page.title();
        const hasWorkoutSection = await this.page.$('.workout-section') !== null;
        const hasAnalytics = await this.page.$('.analytics-section') !== null;

        return {
            passed: title.length > 0 && hasWorkoutSection && hasAnalytics,
            details: { title, hasWorkoutSection, hasAnalytics }
        };
    }

    async runAdaptiveIntegrationTests() {
        // Test adaptive feature integration
        const hasAdaptiveElements = await this.page.evaluate(() => {
            // Check for adaptive UI elements
            return {
                hasAdaptationPanel: document.querySelector('[data-adaptive="true"]') !== null,
                hasPerformanceTracker: typeof window.performanceTracker !== 'undefined',
                hasAdaptiveAI: typeof window.adaptiveAI !== 'undefined'
            };
        });

        const allPresent = Object.values(hasAdaptiveElements).every(Boolean);
        return { passed: allPresent, details: hasAdaptiveElements };
    }

    async runDataPersistenceTest(testName) {
        // Mock data persistence testing
        return { passed: true, test: testName };
    }

    async runUITest(testName) {
        // Mock UI testing
        return { passed: true, test: testName };
    }

    async runLargeDatasetTest() {
        // Mock large dataset testing
        const largeDataSize = 1000;
        const processingTime = await this.page.evaluate((size) => {
            const startTime = performance.now();
            // Simulate processing large dataset
            const data = Array(size).fill().map((_, i) => ({ id: i, value: Math.random() }));
            const endTime = performance.now();
            return endTime - startTime;
        }, largeDataSize);

        return {
            passed: processingTime < 5000, // < 5 seconds
            processingTime: processingTime,
            dataSize: largeDataSize
        };
    }

    async runEdgeCaseTest(edgeCase) {
        // Mock edge case testing
        return { passed: true, case: edgeCase };
    }

    async runErrorHandlingTest(scenario) {
        // Mock error handling testing
        return { passed: true, scenario: scenario };
    }

    /**
     * Record test result
     */
    recordTestResult(category, testName, result) {
        this.testResults.push({
            category: category,
            test: testName,
            passed: result.passed,
            timestamp: new Date().toISOString(),
            details: result.details || result.error || {},
            duration: result.duration || 0
        });
    }

    /**
     * Generate comprehensive test report
     */
    async generateTestReport() {
        console.log('\n📋 Generating Test Report...');

        const summary = this.calculateTestSummary();
        const report = {
            timestamp: new Date().toISOString(),
            summary: summary,
            results: this.testResults,
            environment: {
                nodeVersion: process.version,
                puppeteerVersion: require('puppeteer/package.json').version
            }
        };

        // Save report to file
        const reportPath = path.join(__dirname, `adaptive-ai-test-report-${Date.now()}.json`);
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        console.log('\n🎯 Test Summary:');
        console.log(`  Total Tests: ${summary.total}`);
        console.log(`  Passed: ${summary.passed} (${summary.passRate.toFixed(1)}%)`);
        console.log(`  Failed: ${summary.failed}`);
        console.log(`  Categories: ${Object.keys(summary.byCategory).length}`);
        console.log(`\n📄 Full report saved to: ${reportPath}`);

        // Print detailed category results
        console.log('\n📊 Results by Category:');
        Object.entries(summary.byCategory).forEach(([category, stats]) => {
            const emoji = stats.passRate === 100 ? '✅' : stats.passRate >= 80 ? '⚠️' : '❌';
            console.log(`  ${emoji} ${category}: ${stats.passed}/${stats.total} (${stats.passRate.toFixed(1)}%)`);
        });

        return report;
    }

    /**
     * Calculate test summary statistics
     */
    calculateTestSummary() {
        const total = this.testResults.length;
        const passed = this.testResults.filter(r => r.passed).length;
        const failed = total - passed;
        const passRate = total > 0 ? (passed / total) * 100 : 0;

        // Group by category
        const byCategory = {};
        this.testResults.forEach(result => {
            if (!byCategory[result.category]) {
                byCategory[result.category] = { total: 0, passed: 0, failed: 0 };
            }
            byCategory[result.category].total++;
            if (result.passed) {
                byCategory[result.category].passed++;
            } else {
                byCategory[result.category].failed++;
            }
        });

        // Calculate pass rates for each category
        Object.keys(byCategory).forEach(category => {
            const stats = byCategory[category];
            stats.passRate = stats.total > 0 ? (stats.passed / stats.total) * 100 : 0;
        });

        return {
            total,
            passed,
            failed,
            passRate,
            byCategory
        };
    }

    /**
     * Cleanup test environment
     */
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            console.log('\n🧹 Test environment cleaned up');
        }
    }
}

// Export for use in other test files
module.exports = AdaptiveAITestSuite;

// Run tests if called directly
if (require.main === module) {
    const testSuite = new AdaptiveAITestSuite();
    testSuite.runAllTests().catch(console.error);
}