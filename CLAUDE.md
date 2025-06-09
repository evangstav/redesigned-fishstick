# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **agentic fitness app generation system** that creates personalized workout applications using evidence-based training protocols. The system uses Claude API to generate scientifically-backed training programs tailored to individual athlete profiles.

### **Core Features**

- **Agentic Program Generation**: AI-powered workout program creation based on athlete profiles
- **Evidence-Based Protocols**: Training programs follow scientific principles from how-to-train.md
- **Template Engine**: Modular system for generating complete HTML fitness applications
- **Multiple Training Focuses**: Strength, hypertrophy, endurance, and general fitness specializations
- **Smart Analytics**: Advanced progress tracking with Chart.js visualizations
- **Claude API Integration**: Smart workout recommendations and program adaptation

## Technical Architecture

### **Current State: Agentic Generation System**

- **Template Engine**: Modular system for generating personalized fitness apps
- **Evidence-Based AI**: Claude API integration with scientific training protocols
- **Multi-App Generation**: Creates specialized apps for different training goals
- **Cloud Deployment Ready**: Proxy server infrastructure for API integration
- **Standalone Apps**: Each generated app is a complete, self-contained HTML application

### **Key Files & Structure**

```
├── template-engine/              # Core generation system
│   ├── agentic-generator.js      # AI-powered program generation
│   ├── generator.js              # Base template engine
│   └── validation.js             # Template validation
├── templates/                    # Template system
│   ├── base-template.html        # Main HTML template
│   ├── components/               # Reusable UI components
│   ├── scripts/                  # JavaScript modules
│   └── styles/                   # CSS styling system
├── configs/                      # Configuration files
│   ├── exercise-database.json    # Exercise library
│   ├── program-templates.json    # Program structures
│   └── ui-themes.json           # Visual themes
├── examples/
│   └── generate-examples.js      # Example generation script
├── generated-apps/               # Generated fitness applications
├── how-to-train.md              # Evidence-based training protocols
├── proxy-server.js              # Claude API proxy server
└── package.json                 # Dependencies
```

## Key Components

### **Agentic Program Generation**

- **Evidence-Based Analysis**: Uses scientific protocols from how-to-train.md
- **Athlete Profile Processing**: Analyzes goals, experience, time constraints, equipment
- **Dynamic Program Creation**: Generates unique workout structures for each athlete type
- **Protocol Differentiation**: 
  - Strength: ≥85% 1RM, 1-5 reps, 2-3 sets, 2-5min rest
  - Hypertrophy: 60-80% 1RM, 6-12 reps, 3-6 sets, 1-2min rest
  - Endurance: 80/20 intensity distribution, HIIT protocols, Zone training
  - General Fitness: Action plan checklist (≥10 sets/muscle/week, 150min moderate cardio)

### **Template Engine System**

- **Modular Components**: Reusable HTML, CSS, and JavaScript modules
- **Theme System**: Multiple visual themes for different training focuses
- **Configuration-Driven**: JSON-based configuration for easy customization
- **Validation**: Built-in validation for generated applications
- **Standalone Output**: Each app is a complete, self-contained HTML file

### **Generated Applications**

- **Complete Fitness Apps**: Full-featured workout tracking applications
- **Analytics Dashboard**: Volume tracking, strength progression, training load analysis
- **Smart Recommendations**: Claude API integration for workout suggestions
- **Data Management**: localStorage persistence, export/import functionality
- **e1RM System**: Automatic 1RM calculations using Epley formula with RPE adjustments

## Development Workflow

### **Getting Started**

```bash
# Install dependencies
npm install

# Generate example fitness apps
node examples/generate-examples.js

# Start proxy server for API integration
npm start
```

### **Development Scripts**

- `npm start` - Start the Claude API proxy server
- `node examples/generate-examples.js` - Generate all example fitness apps

### **Development Process**

#### **Template Engine Development**
- **Core Engine**: Modify `template-engine/generator.js` for base functionality
- **Agentic System**: Update `template-engine/agentic-generator.js` for AI-powered generation
- **Templates**: Edit files in `templates/` directory for UI/styling changes
- **Configurations**: Modify JSON files in `configs/` for exercises, themes, programs

#### **Evidence-Based Protocols**
- **Training Science**: Update `how-to-train.md` with new research
- **Protocol Implementation**: Modify `agentic-generator.js` to apply new protocols
- **Validation**: Test generated apps to ensure scientific accuracy

#### **Testing & Validation**
- **Generate Examples**: Run generation script to test current system
- **Browser Testing**: Open generated apps in browser to validate functionality
- **Protocol Verification**: Ensure apps follow evidence-based guidelines

### **Code Style & Patterns**

- **Modular Architecture**: Separation of concerns across template engine components
- **Evidence-Based Design**: All training protocols must reference scientific sources
- **Configuration-Driven**: Use JSON configs for easy modification without code changes
- **Vanilla JavaScript**: No build step required, all apps are standalone HTML files
- **Material Design**: Consistent theming system across all generated applications

## Agentic Generation System

### **Evidence-Based Protocol Integration**

- **Scientific Foundation**: All protocols derived from peer-reviewed research in how-to-train.md
- **Training Specificity**: Programs automatically adapt to athlete goals using evidence-based parameters
- **Protocol Validation**: Generated programs follow established training science principles
- **Automatic Differentiation**: System creates genuinely different programs, not just cosmetic variations

### **Current Implementation Status**

✅ **Completed Features:**
- **Template Engine**: Modular system for generating complete fitness applications
- **Agentic Generation**: AI-powered program creation using Claude API
- **Evidence-Based Protocols**: Scientific training principles integrated into generation logic
- **Multi-App Support**: Specialized apps for strength, hypertrophy, endurance, general fitness
- **Theme System**: Visual differentiation for different training focuses

### **AI Integration**

- **Claude API**: Haiku model integration via Railway proxy server
- **Evidence-Based Prompting**: System sends scientific protocols as context
- **Dynamic Program Structure**: AI generates workout plans following evidence-based guidelines
- **Fallback System**: Static generation when API unavailable
- **Error Handling**: Graceful degradation with informative error messages

## Data Persistence

### **Storage Strategy**

- **Versioned keys**: All localStorage keys include version identifier
- **JSON storage**: All data stored as JSON in localStorage
- **Migration support**: Backward compatibility with existing data
- **Error recovery**: Graceful handling of corrupted or missing data

### **Export/Import**

- **JSON format**: Complete backup of all application data
- **Validation**: Import validation with error reporting
- **Backup creation**: Manual backup and restore functionality

## Common Development Tasks

### **Adding New Features**

1. **Template Engine**: Modify components in `templates/` directory
2. **Agentic Logic**: Update `template-engine/agentic-generator.js` for new AI behaviors
3. **Evidence-Based Protocols**: Update `how-to-train.md` and corresponding implementation
4. **Configuration**: Add new options to JSON files in `configs/` directory
5. **Testing**: Generate examples and validate with Puppeteer
6. **Update documentation**: Keep CLAUDE.md current with changes

### **Debugging**

- **Generation Scripts**: Run `node examples/generate-examples.js` to test system
- **Browser DevTools**: Open generated apps and use console/network tabs
- **Template Validation**: Check generated HTML structure and component integration
- **Evidence Verification**: Ensure generated programs follow scientific protocols
- **Agentic Testing**: Verify AI-generated content matches expected patterns

### **Deployment Options**

**For Generated Apps:**
- **Static Hosting**: Serve generated HTML files from any web server
- **GitHub Pages**: Deploy generated apps to GitHub Pages for hosting
- **Local Testing**: Open generated HTML files directly in browser

**For Development System:**
- **API Server**: Deploy `proxy-server.js` on Railway, Render, or Heroku
- **Template Engine**: Can be run locally or as build step in CI/CD
- **Configuration**: Update API endpoints in generated apps as needed

## Code Quality

### **Error Handling**

- **Global error boundary**: Catches and reports unhandled errors
- **Graceful degradation**: App continues working when features fail
- **User feedback**: Clear error messages for user-facing issues
- **Logging**: Console logging for debugging

### **Documentation**

- **Function comments**: Key functions documented with comments
- **Code organization**: Related functions grouped together
- **Architecture decisions**: Documented in this file

## Next Development Stages

### **Phase 1: Advanced Agentic Features** 🚀
- **Real-time Claude API Integration**: Direct API calls from generated apps
- **Dynamic Program Adaptation**: AI adjusts programs based on user progress
- **Advanced Exercise Database**: Expand exercise library with video demonstrations
- **Periodization Intelligence**: Long-term training cycle planning

### **Phase 2: Enhanced User Experience** 🎯
- **Interactive Workout Builder**: GUI for creating custom athlete profiles
- **Social Features**: Sharing and comparing workout programs
- **Mobile App Integration**: Progressive Web App (PWA) features
- **Offline Functionality**: Enhanced offline capabilities with service workers

### **Phase 3: Professional Features** 💼
- **Coach Dashboard**: Multi-client management system
- **Team Programs**: Group training program generation
- **Performance Analytics**: Advanced statistical analysis and reporting
- **Integration APIs**: Connect with fitness wearables and tracking devices

### **Phase 4: Enterprise Scaling** 🏢
- **White Label Solution**: Branded fitness app generation for gyms/trainers
- **API Service**: Agentic generation as a service for third-party integration
- **Advanced AI Models**: Integration with newer, more capable AI models
- **Global Deployment**: Multi-language support and regional adaptations

### **Development Guidance**

- **Evidence-Based Development**: All new features must reference scientific sources
- **Puppeteer Testing**: Always use Puppeteer to validate generated app functionality
- **Modular Design**: Maintain separation of concerns in template engine architecture
- **Documentation First**: Update CLAUDE.md before implementing major changes