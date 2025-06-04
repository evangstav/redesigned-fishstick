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

## Technical Architecture

### **Current State: Simple HTML Application**

- **Single HTML File**: All functionality contained in `4-weeks.html`
- **Proxy Server**: `proxy-server.js` handles Claude API requests
- **Client-Side JavaScript**: All logic implemented in vanilla JavaScript
- **Chart.js Integration**: Advanced analytics with interactive charts
- **localStorage Persistence**: All data stored locally in the browser

### **Key Files & Structure**

```
├── 4-weeks.html                  # Main application file
├── proxy-server.js               # Claude API proxy server
├── package.json                  # Dependencies for proxy server
└── CLAUDE.md                     # This documentation file
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

```bash
# Install dependencies for proxy server
npm install

# Start proxy server
npm start
# or
npm run proxy

# Open 4-weeks.html in your browser
```

### **Development Scripts**

- `npm start` - Start the proxy server
- `npm run proxy` - Start the proxy server (alias)

### **Development Process**

- **HTML/CSS/JavaScript**: Edit `4-weeks.html` directly
- **Proxy Server**: Modify `proxy-server.js` for API integration changes
- **Live Development**: Open `4-weeks.html` in browser, refresh to see changes
- **API Testing**: Use browser developer tools to monitor network requests

### **Code Style & Patterns**

- **Vanilla JavaScript**: No build step or frameworks required
- **ES6+ Features**: Modern JavaScript features supported in browsers
- **Material Design**: CSS custom properties for consistent theming
- **Modular Functions**: Well-organized JavaScript functions within the HTML file
- **Error Handling**: Comprehensive error handling throughout the application

## Smart Recommendations System

### **Features**

- **Context-aware recommendations**: Considers muscle group frequency, recovery needs
- **Auto-progression suggestions**: Weight increases based on RPE patterns
- **Equipment limitations**: Smart exercise substitutions
- **Enhanced prompting**: Detailed context sent to Claude API

### **API Integration**

- **Claude API**: Uses Claude 3 Haiku model via local proxy server
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

- **JSON format**: Complete backup of all application data
- **Validation**: Import validation with error reporting
- **Backup creation**: Manual backup and restore functionality

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
- **Network monitoring**: Check API requests to proxy server

### **Deployment**

- **Static hosting**: Serve `4-weeks.html` from any web server
- **Proxy server**: Deploy `proxy-server.js` on Node.js hosting
- **CORS setup**: Ensure proxy server allows requests from your domain

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