# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page fitness tracking application built as a pure HTML file with embedded JavaScript. The application tracks a personalized 4-week strength and conditioning program, including:

- Workout logging with RPE (Rating of Perceived Exertion)
- Automatic e1RM (estimated 1 rep max) calculations using the Epley formula
- Progressive overload tracking
- Bodyweight history with Chart.js visualization
- Weekly attendance summaries
- **Smart Workout Recommendations**: AI-powered workout suggestions using Claude API based on user's current state and training history

## Technical Architecture

- **Single HTML File**: `4-weeks.html` contains the entire application (HTML, CSS, JavaScript)
- **No Build Process**: Direct browser loading, no compilation required
- **Local Storage**: All data persisted in browser localStorage with versioned keys
- **Material Design**: CSS uses Material Design color palette and elevation shadows
- **Chart.js**: Bodyweight tracking visualization

## Key Components

### Data Management
- `loadData()` and `saveData()` handle localStorage persistence
- Versioned storage keys prevent data conflicts: `v4_material_bw_graph`
- Daily logs stored per date: `personalizedPlanDailyLog_{version}_{date}`
- Claude API key stored securely: `personalizedPlanClaudeApiKey_{version}`

### Exercise Types
- **strength_single_heavy**: Activation and main sets that update e1RM
- **strength_volume**: Multiple sets for muscle building
- **accessory**: Multi-set exercises with modal logging
- **hiit/cardio/mobility**: Mark-as-completed activities

### e1RM System
- Automatic updates from heavy singles (>90% 1RM) and top sets
- Epley formula: `weight * (1 + (reps / 30))`
- RPE-adjusted effective reps for accurate calculations
- Bodyweight exercises add user bodyweight to logged added weight

### Smart Recommendations System
- **UI Components**: Energy/stress sliders, soreness input, time available, specific goals
- **History Analysis**: `getRecentWorkoutHistory()` analyzes last 14 days of training
- **Claude API Integration**: Uses Claude 3 Haiku model for workout recommendations
- **Contextual Prompting**: Sends user state, workout history, and available workout types to AI
- **Recommendation Parsing**: Extracts workout type, reasoning, and modifications from AI response
- **Seamless Integration**: "Start This Workout" button navigates directly to recommended workout

## Common Development Tasks

### Testing
No automated tests exist. Manual testing involves:
- Loading the HTML file in browser
- Testing localStorage persistence across browser sessions
- Verifying e1RM calculations with various RPE/rep combinations
- Checking bodyweight exercise calculations
- Testing Smart Recommendations feature:
  - API key configuration and storage
  - Slider functionality and value updates
  - Claude API integration with valid responses
  - Recommendation parsing and display
  - Navigation to recommended workouts

### Code Style
- Inline JavaScript within `<script>` tags
- CSS uses CSS custom properties (CSS variables) for theming
- Material Design naming conventions for colors
- Camel case for JavaScript variables and functions