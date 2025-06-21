# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fitness tracking application with analytics features. The application tracks a personalized 4-week strength and conditioning program, including:

- Workout logging with RPE (Rating of Perceived Exertion)
- Automatic e1RM (estimated 1 rep max) calculations using the Epley formula
- Progressive overload tracking
- Bodyweight history with Chart.js visualization
- Weekly attendance summaries
- Analytics dashboard with volume tracking, strength progression, training load, and frequency analysis
- Smart Workout Recommendations via Claude API integration
- **Desktop-optimized workflow** with keyboard shortcuts and bulk editing
- **Dark mode support** with system preference detection
- **Enhanced data export** with comprehensive analytics

## Technical Architecture

### **Current State: Deployed Web Application**

- **Single HTML File**: All functionality contained in `4-weeks.html`
- **Cloud Deployment**: 
  - **Frontend**: GitHub Pages hosting the HTML app
  - **Backend**: None (direct calls to the Claude API)
- **Client-Side JavaScript**: All logic implemented in vanilla JavaScript
- **Chart.js Integration**: Advanced analytics with interactive charts
- **localStorage Persistence**: All data stored locally in the browser

### **Live Application**

- **Production URL**: https://evangstav.github.io/redesigned-fishstick/4-weeks.html

### **Key Files & Structure**

```
├── 4-weeks.html                  # Main application file (deployed to GitHub Pages)
├── CLAUDE.md                     # This documentation file
├── API-SETUP.md                  # API configuration and deployment guide
└── improvement-plan.md           # Feature roadmap and completed improvements
```

## Key Components

### **Analytics Dashboard**

- **Volume Tracking**: Charts and metrics for muscle group volume over time
- **Strength Progression**: e1RM tracking and progression visualization
- **Training Load Analysis**: RPE-based stress monitoring with rolling averages
- **Frequency Analysis**: Training frequency per muscle group with balance scoring
- **Performance Metrics**: Comprehensive training quality assessment

### **Data Management**

- **localStorage Persistence**: All data stored in browser's localStorage
- **Versioned storage keys**: Prevents conflicts between different versions
- **Export/Import**: JSON backup and restore functionality
- **Error handling**: Graceful degradation when localStorage fails

### **e1RM System**

- **Epley Formula**: Standard 1RM estimation based on weight and reps
- **RPE Adjustments**: More accurate estimates using effective reps from RPE
- **Automatic Updates**: e1RM recalculated after each completed set
- **Progress Tracking**: Historical e1RM data for strength progression analysis

## Development Workflow

### **Getting Started**

### **Getting Started**

```bash
# Open 4-weeks.html in your browser
```

### **Development Scripts**

- No build steps required

### **Development Process**

- **HTML/CSS/JavaScript**: Edit `4-weeks.html` directly
- **Local Development**: Open `4-weeks.html` in browser, refresh to see changes
- **API Testing**: Use browser developer tools to monitor network requests
- **Deployment**: Changes auto-deploy via GitHub Pages when pushed to main branch

### **Code Style & Patterns**

- **Vanilla JavaScript**: No build step or frameworks required
- **ES6+ Features**: Modern JavaScript features supported in browsers
- **Material Design**: CSS custom properties for consistent theming
- **Modular Functions**: Well-organized JavaScript functions within the HTML file
- **Error Handling**: Comprehensive error handling throughout the application

## Smart Recommendations System

### **Enhanced AI Features (Latest Updates)**

- **Program Structure Following**: AI follows proper workout sequence (Squat → Bench → Deadlift → Pull)
- **Detailed Performance Analysis**: Set-by-set RPE, weight, and volume tracking
- **User Input Validation**: Requires actual user state instead of using defaults
- **Context-aware recommendations**: Considers muscle group frequency, recovery needs
- **Auto-progression suggestions**: Weight increases based on RPE patterns
- **Equipment limitations**: Smart exercise substitutions
- **Enhanced prompting**: Comprehensive workout history and performance data sent to Claude API

### **Program Structure Logic**

The AI now intelligently follows the 4-week program structure:
1. **Squat Day** → **Bench Day** → **Deadlift Day** → **Pull Day** → (Cardio/Recovery as needed)
2. **Recent Workout Analysis**: Considers last 3 workouts to determine proper sequence
3. **Override Conditions**: Can deviate for recovery, equipment limitations, or fatigue
4. **Fallback Intelligence**: Built-in logic mirrors AI recommendations when API unavailable

### **API Integration**

- **Claude API**: Uses Claude 3 Haiku model via direct API calls
- **Enhanced Context**: Sends detailed recent workout performance, not just summaries
- **Set-by-Set Analysis**: Individual set performance (weight × reps @ RPE) for last 3 workouts
- **Program Guidance**: AI receives recommended next workout with reasoning
- **Fallback system**: Built-in recommendation logic when API unavailable
- **Error handling**: Graceful degradation with informative error messages
- **Response parsing**: Extracts workout type, reasoning, modifications, and progression

## Data Persistence

### **Storage Strategy**

- **Versioned keys**: All localStorage keys include version identifier
- **JSON storage**: All data stored as JSON in localStorage
- **Migration support**: Backward compatibility with existing data
- **Error recovery**: Graceful handling of corrupted or missing data

### **Export/Import**

- **Enhanced CSV Export**: Detailed analytics with volume, training load, workout type categorization
- **JSON format**: Complete backup of all application data
- **Validation**: Import validation with error reporting
- **Backup creation**: Manual backup and restore functionality

## Desktop Workflow Features

### **Keyboard Shortcuts System**

- **Tab Navigation**: Seamless progression through Weight → Reps → RPE fields
- **Enter Submission**: Log sets directly from input fields
- **Global Shortcuts**:
  - `1`, `2`, `3` = Navigate to Guide, Analytics, Settings tabs
  - `4-7` = Navigate to workout day tabs
  - `Ctrl+S` = Save all data
  - `Ctrl+Z/Y` = Undo/Redo actions
  - `T` = Toggle rest timer
  - `R` = Start 90-second rest timer
- **Auto-focus Management**: Automatic progression between related input fields

### **Bulk Set Editing**

- **Multi-select Interface**: Select multiple sets with checkboxes
- **Bulk Value Updates**: Apply changes to all selected sets simultaneously
- **Relative Changes**: Add/subtract values from existing data (+5 lbs, +1 rep)
- **Bulk Logging**: Log all selected sets with one action
- **Visual Feedback**: Clear highlighting of selected sets

### **Dark Mode Support**

- **Complete Theme System**: Comprehensive dark mode with optimized colors
- **System Preference Detection**: Automatic theme based on OS preference
- **localStorage Persistence**: Theme choice saved across sessions
- **Smooth Transitions**: Animated theme switching with CSS transitions
- **Mobile Responsive**: Optimized toggle button for all screen sizes

### **Undo/Redo System**

- **20-level History**: Track major data changes with detailed history
- **Smart State Saving**: Automatic state capture before important actions
- **Keyboard Integration**: Ctrl+Z/Y shortcuts for quick undo/redo
- **Action Descriptions**: Clear labeling of what each undo operation reverses
- **UI Synchronization**: Automatic refresh of all UI components after undo/redo

## Common Development Tasks

### **Adding New Features**

1. **Edit HTML**: Modify the UI structure in `4-weeks.html`
2. **Add JavaScript**: Implement new functions in the script section
3. **Update CSS**: Add styling for new components
4. **Test functionality**: Use browser developer tools for debugging
5. **Update this documentation**

### **Debugging**

- **Browser DevTools**: Use console, network, and application tabs
- **localStorage inspection**: View stored data in Application tab
- **Console logging**: Add console.log statements for debugging
- **Network monitoring**: Check API requests to the Claude API

### **Deployment**

**Current Production Setup:**
- **Frontend**: GitHub Pages automatically deploys `4-weeks.html` from main branch
- **Deployment URL**: https://evangstav.github.io/redesigned-fishstick/4-weeks.html

**For New Deployments:**
- **Static hosting**: Serve `4-weeks.html` from any web server

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

