# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **advanced agentic fitness app generation system** that creates adaptive, AI-powered workout applications using evidence-based training protocols. The system combines real-time performance analysis, intelligent program adaptation, and comprehensive fitness coaching to deliver personalized training experiences.

### **🚀 Current Status: Phase 1 Complete**

**Phase 1: Advanced Agentic Intelligence** - ✅ **COMPLETED**
- Real-time adaptive program modification based on performance data
- Evidence-based autoregulation using RPE feedback and recovery markers
- Intelligent exercise selection with 200+ exercise database
- Comprehensive testing suite with 97.4% pass rate
- Live demo: PowerLifter Pro Adaptive with AI coaching

### **Core Capabilities**

- **🤖 Adaptive AI Coaching**: Real-time program adjustments based on performance trends
- **📊 Performance Analysis**: Multi-metric tracking with predictive modeling
- **🧠 Exercise Intelligence**: Dynamic exercise selection with smart alternatives
- **🔬 Evidence-Based Protocols**: All algorithms implement peer-reviewed research
- **📱 Complete Applications**: Self-contained HTML apps with advanced analytics
- **🧪 Comprehensive Testing**: Automated validation with Puppeteer and simulation

## Technical Architecture

### **Current State: Adaptive Intelligence System**

- **🎯 Real-Time Adaptation**: Programs modify based on RPE trends, recovery, and performance
- **🧬 Evidence-Based AI**: All decisions rooted in scientific training protocols
- **🔄 Dynamic Generation**: Creates truly adaptive apps, not just static templates
- **🧪 Validated System**: 97.4% test pass rate with comprehensive simulation
- **📈 Performance Optimized**: <2s response times for all AI operations

### **File Structure & Architecture**

```
├── template-engine/              # 🤖 Adaptive AI Core System
│   ├── adaptive-ai.js            # Real-time program adaptation algorithms
│   ├── performance-tracker.js    # Multi-metric performance analysis engine
│   ├── exercise-ai.js            # Intelligent exercise selection system
│   ├── agentic-generator.js      # AI-powered program generation
│   ├── generator.js              # Base template engine
│   └── validation.js             # System validation and error handling
├── configs/                      # 📋 Evidence-Based Configuration
│   ├── adaptation-rules.json     # Training-specific adaptation protocols
│   ├── performance-metrics.json  # Comprehensive metric definitions
│   ├── exercise-database-v2.json # 200+ exercises with AI intelligence
│   ├── program-templates.json    # Base program structures
│   └── ui-themes.json           # Visual themes for training types
├── templates/                    # 🎨 Modular Template System
│   ├── base-template.html        # Main application template
│   ├── components/               # Reusable UI components
│   │   ├── analytics-section.html
│   │   ├── exercise-item.html
│   │   └── workout-tab.html
│   ├── scripts/                  # 🧠 Client-Side Intelligence
│   │   ├── adaptive-functions.js # Real-time adaptive features
│   │   ├── analytics-functions.js
│   │   ├── core-functions.js
│   │   ├── storage-manager.js
│   │   └── workout-functions.js
│   └── styles/                   # 🎨 Material Design System
│       ├── base.css
│       └── material-design.css
├── tests/                        # 🧪 Comprehensive Testing Suite
│   ├── adaptive-ai-tests.js      # Puppeteer-based AI validation
│   ├── performance-simulation.js # Realistic athlete scenario generation
│   └── test-reports/             # Automated test result tracking
├── generated-apps/               # 📱 Live Fitness Applications
│   ├── powerlifter-pro-adaptive.html # 🚀 AI-Enhanced Demo App
│   ├── powerlifter-fitness-app.html
│   ├── bodybuilder-fitness-app.html
│   ├── endurance-athlete-fitness-app.html
│   └── beginner-fitness-app.html
├── examples/
│   └── generate-examples.js      # Application generation examples
├── PHASE-1-IMPLEMENTATION-SUMMARY.md # 📊 Complete implementation documentation
├── NEXT-PHASE-PLAN.md           # 🗺️ Development roadmap
├── how-to-train.md              # 🔬 Evidence-based training protocols
├── proxy-server.js              # 🌐 Claude API proxy server
└── package.json                 # Dependencies and scripts
```

## Core Adaptive Intelligence Components

### **🤖 Adaptive AI Engine** (`template-engine/adaptive-ai.js`)

**Real-Time Program Adaptation:**
- **Fatigue Detection**: Multi-factor analysis using RPE, volume, recovery markers
- **Deload Triggers**: Evidence-based thresholds (RPE >9.5, consecutive sessions >3)
- **Intensification Detection**: Opportunity identification (RPE <7.0, strength gains >5%)
- **Program Modifications**: Automatic volume/intensity adjustments with safety limits

**Scientific Foundation:**
- Helms et al. (2018) - RPE-based autoregulation
- Mansfield et al. (2023) - Fatigue management protocols
- DeWeese et al. (2015) - Periodization models

### **📊 Performance Tracker** (`template-engine/performance-tracker.js`)

**Comprehensive Analysis:**
- **Multi-Metric Tracking**: RPE, volume, strength, recovery, adherence
- **Trend Analysis**: Linear regression with 95% confidence intervals
- **Predictive Modeling**: Performance forecasting with exponential smoothing
- **Individual Response**: Personalized adaptation based on user history

**Key Algorithms:**
- Estimated 1RM with RPE adjustments (Epley formula + evidence-based modifiers)
- Recovery score from multi-dimensional wellness data
- Fatigue index using weighted z-scores across metrics

### **🧠 Exercise Intelligence** (`template-engine/exercise-ai.js`)

**Dynamic Exercise Selection:**
- **Individual Response Tracking**: Learn which exercises work best for each user
- **Smart Substitutions**: Injury/equipment-based alternatives with scoring
- **Biomechanical Optimization**: Recommendations based on anthropometry
- **Plateau Detection**: Automatic exercise rotation when progress stalls

**AI Selection Criteria (Weighted):**
- Injury safety (30%) - Contraindication avoidance
- Equipment availability (25%) - Resource matching
- Movement pattern match (20%) - Training goal alignment
- Experience appropriateness (15%) - Skill level matching
- Training goal alignment (10%) - Objective optimization

### **📋 Evidence-Based Configuration System**

**Adaptation Rules** (`configs/adaptation-rules.json`):
- Training-type specific protocols (strength, hypertrophy, endurance, general)
- Experience level modifiers (beginner: 1.5x adaptation sensitivity)
- Age adjustments (35-45: 1.1x recovery time required)
- Life stress factors (high stress: 0.8x adaptation rate)

**Performance Metrics** (`configs/performance-metrics.json`):
- Primary metrics: RPE, volume, strength, recovery
- Secondary metrics: adherence, intensity distribution, movement quality
- Derived metrics: fatigue index, adaptation readiness, training efficiency
- Statistical methods: regression, exponential smoothing, change detection

## Development Workflow & Quality Standards

### **🚀 Getting Started**

```bash
# Install dependencies (includes Puppeteer for testing)
npm install

# Generate example fitness apps with adaptive features
node examples/generate-examples.js

# Run comprehensive test suite
node tests/adaptive-ai-tests.js

# Start proxy server for API integration
npm start
```

### **📋 Development Scripts**

- `npm start` - Start Claude API proxy server
- `npm test` - Run full test suite (when npm scripts added)
- `node examples/generate-examples.js` - Generate all example apps
- `node tests/adaptive-ai-tests.js` - Run Puppeteer-based AI validation
- `node tests/performance-simulation.js` - Generate realistic test scenarios

### **🧪 Quality Assurance Process**

#### **1. Mandatory Testing Requirements**

**Before ANY code changes:**
```bash
# 1. Run existing test suite - MUST maintain 95%+ pass rate
node tests/adaptive-ai-tests.js

# 2. Generate and validate examples
node examples/generate-examples.js

# 3. Browser compatibility check
# Open generated apps in Chrome, Firefox, Safari
```

**For new features:**
```bash
# 1. Write tests FIRST (Test-Driven Development)
# Add test cases to tests/adaptive-ai-tests.js

# 2. Implement feature

# 3. Validate with simulation
node tests/performance-simulation.js

# 4. Document in CLAUDE.md
```

#### **2. Puppeteer Testing Standards**

**Required test categories:**
- **Adaptive AI Module**: Algorithm correctness validation
- **Performance Tracking**: Metric calculation accuracy
- **Fatigue Detection**: Scenario-based validation
- **Exercise Intelligence**: Selection algorithm testing
- **Integration Testing**: End-to-end app functionality
- **Edge Cases**: Error handling and data validation

**Test quality requirements:**
- Minimum 95% pass rate required for commits
- All AI decisions must be testable and validated
- Realistic data simulation for comprehensive coverage
- Cross-browser compatibility verification

#### **3. Evidence-Based Development Standards**

**Scientific Rigor Requirements:**
- All adaptive algorithms MUST reference peer-reviewed research
- Training protocols must cite specific studies with year
- Algorithm parameters must be evidence-based (no arbitrary values)
- Validation against expert recommendations required

**Documentation Standards:**
- Update `how-to-train.md` when adding new protocols
- Reference sources in algorithm comments
- Maintain `PHASE-X-IMPLEMENTATION-SUMMARY.md` for major features

### **🔧 Development Process**

#### **Phase 1.2 Development (Current Priority)**

**Next Features to Implement:**
1. **Periodization AI** (`template-engine/periodization-ai.js`)
   - Long-term training cycle planning (12-16 week macrocycles)
   - Mesocycle adaptation based on progress markers
   - Competition peak planning with tapering protocols

2. **Real-Time Claude API Integration**
   - Direct API calls from generated apps
   - Natural language coaching recommendations
   - Advanced program optimization using LLM reasoning

3. **Enhanced Evidence Base Updates**
   - Update `how-to-train.md` with latest autoregulation research
   - Implement advanced recovery monitoring protocols
   - Add competition-specific training phases

#### **Code Modification Guidelines**

**For Adaptive AI Changes:**
1. **Read current implementation** in `template-engine/adaptive-ai.js`
2. **Review evidence base** in `how-to-train.md` for scientific foundation
3. **Check adaptation rules** in `configs/adaptation-rules.json`
4. **Write tests first** in `tests/adaptive-ai-tests.js`
5. **Implement with validation** ensuring backwards compatibility
6. **Document changes** in code comments with research citations

**For Template Engine Updates:**
1. **Maintain modular architecture** - components should be independent
2. **Preserve progressive enhancement** - apps must work without AI
3. **Follow Material Design** system in `templates/styles/`
4. **Test across training types** - strength, hypertrophy, endurance, general
5. **Validate generated output** with Puppeteer tests

### **🎨 Code Style & Architecture Standards**

#### **Adaptive Intelligence Principles**
- **Evidence-Based Logic**: All decisions backed by research
- **Individual Adaptation**: Systems must learn from user responses
- **Progressive Enhancement**: AI features enhance, never replace, core functionality
- **Graceful Degradation**: Apps work fully when AI unavailable
- **Real-Time Responsiveness**: <2s response time for all AI operations

#### **Code Organization Standards**
- **Modular Architecture**: Clear separation of concerns
- **Configuration-Driven**: Use JSON configs for algorithm parameters
- **Comprehensive Testing**: Every AI decision must be testable
- **Documentation Requirements**: Update CLAUDE.md for architecture changes
- **Error Handling**: Robust error recovery with user feedback

#### **Performance Requirements**
- **Response Times**: <2s for adaptive analysis, <500ms for exercise selection
- **Memory Usage**: Efficient algorithms for client-side processing
- **Battery Efficiency**: Optimize for mobile device usage
- **Cross-Platform**: Support Chrome, Firefox, Safari on desktop and mobile

## Adaptive Intelligence System Integration

### **🔬 Evidence-Based Protocol Implementation**

**Scientific Validation Process:**
1. **Literature Review**: Identify peer-reviewed research supporting feature
2. **Algorithm Design**: Translate research protocols into code
3. **Parameter Validation**: Ensure all values are evidence-based
4. **Expert Review**: Validate implementation against training science
5. **Real-World Testing**: Use performance simulation for validation

**Current Research Integration:**
- **Autoregulation**: RPE-based load adjustments (Helms et al., 2018)
- **Fatigue Management**: Multi-factorial fatigue detection (Mansfield et al., 2023)
- **Periodization**: Evidence-based programming models (DeWeese et al., 2015)
- **Recovery**: Comprehensive wellness monitoring (Kellmann et al., 2018)
- **Individual Variation**: Response heterogeneity accounting (Swinton et al., 2018)

### **🧬 AI Integration Architecture**

**Client-Side Intelligence** (`templates/scripts/adaptive-functions.js`):
- Real-time performance monitoring during workouts
- Instant RPE feedback with visual warnings (>9.5 RPE)
- Adaptive recommendation display
- Local data processing for privacy

**Server-Side AI** (Future Claude API integration):
- Advanced program optimization using LLM reasoning
- Natural language coaching recommendations
- Complex periodization planning
- Multi-athlete analysis and comparison

### **📊 Performance Monitoring Standards**

**Tracking Requirements:**
- **RPE**: 1-10 scale with 0.5 precision, real-time validation
- **Volume**: Automatic calculation (weight × reps × sets)
- **Strength**: Estimated 1RM with RPE adjustments
- **Recovery**: Multi-dimensional wellness scoring
- **Adherence**: Set completion and session consistency

**Analysis Standards:**
- **Trend Detection**: Linear regression with statistical significance
- **Prediction**: Exponential smoothing for performance forecasting
- **Alerting**: Automated threshold monitoring with severity levels
- **Adaptation**: Evidence-based program modification triggers

## Data Management & Security

### **🔐 Privacy & Security Standards**

**Data Protection:**
- **Local Storage**: All personal data stored client-side only
- **No Cloud Sync**: Performance data never transmitted without explicit consent
- **Export Control**: User-controlled data export in standard JSON format
- **Privacy by Design**: No tracking or analytics without user permission

**Data Quality Assurance:**
- **Validation**: Real-time input validation with acceptable ranges
- **Error Recovery**: Graceful handling of corrupted data
- **Versioning**: Storage schema versioning for backwards compatibility
- **Backup**: Manual backup and restore functionality

### **📱 Progressive Web App Standards**

**Offline Functionality:**
- **Core Features**: All basic functionality works offline
- **Data Persistence**: localStorage with automatic backup
- **Service Workers**: Caching for offline app availability (Phase 2)
- **Sync**: Background sync when connection restored (Phase 2)

## Testing & Validation Framework

### **🧪 Comprehensive Testing Strategy**

**Automated Testing Categories:**
1. **Unit Tests**: Individual algorithm validation
2. **Integration Tests**: End-to-end app functionality
3. **Performance Tests**: Response time and memory usage
4. **Simulation Tests**: Realistic athlete scenario validation
5. **Cross-Browser Tests**: Compatibility across platforms
6. **Edge Case Tests**: Error handling and data validation

**Quality Gates:**
- **95% Test Pass Rate**: Required for all commits
- **Performance Benchmarks**: <2s response time requirement
- **Scientific Accuracy**: Algorithm validation against research
- **User Experience**: Usability testing with real scenarios

### **📊 Performance Simulation Framework**

**Realistic Scenarios** (`tests/performance-simulation.js`):
- **Athlete Profiles**: Beginner, intermediate, advanced across training types
- **Fatigue Patterns**: Acute, chronic, overreaching, recovery scenarios
- **Individual Variation**: Response heterogeneity simulation
- **Environmental Factors**: Sleep, stress, nutrition impact modeling

**Validation Criteria:**
- **Algorithm Accuracy**: Decisions match expert recommendations (>90%)
- **Safety Validation**: No harmful recommendations generated
- **Progression Logic**: Appropriate advancement patterns
- **Recovery Monitoring**: Accurate fatigue detection and management

## Current Phase Status & Next Steps

### **✅ Phase 1: Advanced Agentic Intelligence (COMPLETE)**

**Achieved:**
- Real-time adaptive program modification ✅
- Evidence-based autoregulation algorithms ✅
- Intelligent exercise selection system ✅
- Comprehensive testing framework (97.4% pass rate) ✅
- Live demo application (PowerLifter Pro Adaptive) ✅

**Quality Metrics:**
- 97.4% test pass rate (38/39 tests)
- <2s response time for all AI operations
- 200+ exercises with intelligent alternatives
- Evidence-based protocols from 15+ studies

### **🚀 Phase 1.2: Enhanced Intelligence (IN PROGRESS)**

**Priority Development Tasks:**
1. **Periodization AI** - Long-term training cycle intelligence
2. **Real-Time Claude API** - Direct LLM integration for advanced reasoning
3. **Advanced Recovery Monitoring** - HRV and biomarker integration
4. **Competition Preparation** - Peak performance timing algorithms

**Development Standards for Phase 1.2:**
- Maintain 95%+ test pass rate
- All new features must include Puppeteer tests
- Evidence-based implementation required
- Real-world simulation validation
- Documentation updates mandatory

### **🎯 Development Priorities**

**Immediate Tasks (Next 2 weeks):**
1. **Implement Periodization AI** with long-term planning
2. **Enhance testing framework** for new features
3. **Update evidence base** with latest research
4. **Optimize performance** for mobile devices

**Quality Assurance:**
- Run full test suite before any commits
- Validate with performance simulation
- Ensure cross-browser compatibility
- Document all changes in CLAUDE.md

## Common Development Tasks

### **🔧 Adding New Adaptive Features**

**Step-by-Step Process:**
1. **Research Foundation**: Review `how-to-train.md` and current literature
2. **Test-Driven Development**: Write tests in `tests/adaptive-ai-tests.js` first
3. **Algorithm Implementation**: Code in appropriate module (adaptive-ai.js, etc.)
4. **Configuration Updates**: Add parameters to `configs/` JSON files
5. **Client Integration**: Update `templates/scripts/adaptive-functions.js`
6. **Validation**: Run full test suite and performance simulation
7. **Documentation**: Update CLAUDE.md and implementation summary

**Code Quality Checklist:**
- [ ] Evidence-based algorithm with research citations
- [ ] Comprehensive test coverage including edge cases
- [ ] Performance benchmarks met (<2s response time)
- [ ] Cross-browser compatibility verified
- [ ] Error handling and graceful degradation
- [ ] Documentation updated

### **🧪 Testing & Debugging Process**

**Before Code Changes:**
```bash
# 1. Baseline test
node tests/adaptive-ai-tests.js

# 2. Performance check
node tests/performance-simulation.js

# 3. Generate current examples
node examples/generate-examples.js
```

**After Code Changes:**
```bash
# 1. Full test suite
node tests/adaptive-ai-tests.js

# 2. Browser testing
# Open generated-apps/powerlifter-pro-adaptive.html
# Test adaptive features manually

# 3. Performance validation
# Check response times and accuracy

# 4. Documentation update
# Update CLAUDE.md with changes
```

**Debugging Tools:**
- **Browser DevTools**: Console, Network, Performance tabs
- **Puppeteer Debugging**: Headless browser automation
- **Performance Simulation**: Realistic scenario testing
- **Algorithm Validation**: Step-through debugging with test data

### **📈 Performance Optimization**

**Optimization Targets:**
- **AI Decision Making**: <2s for adaptive analysis
- **Exercise Selection**: <500ms for intelligent recommendations
- **Chart Rendering**: <300ms for analytics display
- **Data Processing**: <100ms for metric calculations

**Optimization Techniques:**
- **Efficient Algorithms**: O(n log n) maximum complexity
- **Caching**: Memoization for repeated calculations
- **Lazy Loading**: Progressive enhancement of features
- **Batch Processing**: Group operations for efficiency

### **🚀 Deployment Standards**

**Generated App Deployment:**
- **Static Hosting**: Apps work on any web server
- **GitHub Pages**: Direct deployment capability
- **Local Testing**: File:// protocol compatibility
- **Mobile Optimization**: Responsive design requirements

**Development System Deployment:**
- **Proxy Server**: Claude API integration via Railway/Render
- **Template Engine**: Local or CI/CD execution
- **Configuration Management**: Environment-specific configs
- **Error Monitoring**: Comprehensive logging and alerting

## Advanced Development Guidance

### **🧬 Adaptive Intelligence Best Practices**

**Algorithm Development:**
- **Start with Research**: Every feature must have scientific foundation
- **Test Early and Often**: TDD approach with comprehensive scenarios
- **Individual Adaptation**: Design for personalization from day one
- **Safety First**: Multiple validation layers for user protection
- **Performance Optimization**: Client-side efficiency requirements

**Data Science Standards:**
- **Statistical Rigor**: Confidence intervals and significance testing
- **Outlier Detection**: Robust algorithms for real-world data
- **Trend Analysis**: Multiple methodologies for validation
- **Prediction Accuracy**: Validation against known outcomes
- **Individual Variation**: Account for response heterogeneity

### **🎯 Feature Integration Guidelines**

**New Feature Checklist:**
- [ ] Evidence-based design with research citations
- [ ] Comprehensive test suite with 95%+ pass rate
- [ ] Performance benchmarks met
- [ ] Cross-platform compatibility
- [ ] Progressive enhancement implementation
- [ ] Error handling and recovery
- [ ] User documentation and help text
- [ ] Privacy and security considerations

**Quality Assurance Process:**
1. **Design Review**: Architecture and evidence validation
2. **Implementation**: Test-driven development approach
3. **Testing**: Comprehensive automated and manual validation
4. **Performance**: Benchmarking and optimization
5. **Integration**: End-to-end system testing
6. **Documentation**: Complete technical and user documentation

---

**🎯 Remember: This system represents the cutting edge of evidence-based, adaptive fitness technology. Every change should advance our mission of providing scientifically-backed, personalized training experiences.**

**📊 Current Status: Phase 1 Complete (97.4% test pass rate) - Ready for Phase 1.2 Enhanced Intelligence**