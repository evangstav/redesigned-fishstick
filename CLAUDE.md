# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fitness tracking application that has been **modernized with TypeScript and modular architecture** while maintaining its core functionality. The application tracks a personalized 4-week strength and conditioning program, including:

- Workout logging with RPE (Rating of Perceived Exertion)
- Automatic e1RM (estimated 1 rep max) calculations using the Epley formula
- Progressive overload tracking
- Bodyweight history with Chart.js visualization
- Weekly attendance summaries
- **Enhanced Smart Workout Recommendations**: AI-powered workout suggestions with improved context awareness, auto-progression, deload detection, and exercise substitutions

## Technical Architecture

### **Current State: Enhanced Modern Architecture (v2.0)**

- **Modular TypeScript**: Source code organized in `src/` with proper type definitions
- **Modern Build Pipeline**: Vite for development and production builds
- **Reactive State Management**: Event-driven state with localStorage persistence
- **Testing Framework**: Vitest with comprehensive unit tests
- **Legacy Compatibility**: Backward compatibility layer for existing functionality
- **Single File Output**: Builds to single HTML file for easy deployment

### **Key Files & Structure**

```
├── src/
│   ├── types/workout.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── e1rm-calculator.ts    # E1RM calculations with RPE adjustments
│   │   ├── workout-analysis.ts   # Training pattern analysis & deload detection
│   │   ├── date-helpers.ts       # Date manipulation utilities
│   │   └── data-export.ts        # Enhanced backup/restore functionality
│   ├── stores/
│   │   └── app-state.ts          # Reactive state management
│   ├── components/
│   │   ├── html-loader.ts        # UI structure injection
│   │   ├── event-handlers.ts     # Modern event management
│   │   └── charts.ts             # Chart.js integration
│   ├── test/                     # Unit tests and test utilities
│   └── main.ts                   # Application entry point
├── index.html                    # Development entry point
├── 4-weeks.html                  # Legacy file (preserved for reference)
├── vite.config.ts               # Build configuration
├── tsconfig.json                # TypeScript configuration
├── vitest.config.ts             # Testing configuration
└── package.json                 # Dependencies and scripts
```

## Key Components

### **Modern State Management**

- **ReactiveState<T>**: Event-driven state with automatic localStorage persistence
- **DerivedState<T>**: Computed values that auto-update when dependencies change
- **DailyLogManager**: Handles per-date workout logs
- **Batch Updates**: Optimized localStorage writes to prevent performance issues

```typescript
// Example usage
import { exercisesE1RM, updateE1RM } from '@/stores/app-state';

// Subscribe to changes
exercisesE1RM.subscribe((newE1RMs, oldE1RMs) => {
  console.log('E1RMs updated:', newE1RMs);
});

// Update values
updateE1RM('squat', 120);
```

### **Enhanced Data Management**

- **Type-safe localStorage**: All data operations with proper TypeScript types
- **Versioned storage keys**: Prevents conflicts: `v4_material_bw_graph`
- **Enhanced export/import**: JSON and CSV formats with validation
- **Error handling**: Graceful degradation when localStorage fails

### **Advanced Analytics**

- **Training Pattern Analysis**: Muscle group frequency, volume trends, RPE progression
- **Auto-progression System**: Weight suggestions based on RPE patterns
- **Deload Detection**: Algorithm detects fatigue accumulation and recommends deload weeks
- **Equipment Substitutions**: Smart exercise alternatives for equipment limitations

### **Enhanced e1RM System**

- **RPE-adjusted calculations**: More accurate e1RM estimates using effective reps
- **Automatic updates**: From heavy singles (>90% 1RM) and high-RPE top sets
- **Type-safe calculations**: All formulas with proper TypeScript interfaces
- **Comprehensive testing**: Unit tests validate all calculation logic

## Development Workflow

### **Getting Started**

```bash
# Install dependencies
npm install

# Start development server (includes proxy server)
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Type checking
npm run type-check

# Build for production
npm run build
```

### **Development Scripts**

- `npm run dev` - Concurrent Vite dev server + proxy server
- `npm run build` - TypeScript compilation + Vite build
- `npm run preview` - Preview production build
- `npm run proxy` - Run only the proxy server
- `npm test` - Run all tests
- `npm run test:ui` - Interactive test UI

### **Testing**

Comprehensive test suite covering:

- **e1RM calculations**: Epley formula, RPE adjustments, progression logic
- **State management**: Reactive updates, localStorage persistence, error handling
- **Data export/import**: Validation, error handling, format compatibility
- **Workout analysis**: Pattern detection, deload algorithms, muscle group mapping

```bash
# Run specific test file
npm test e1rm-calculator.test.ts

# Run tests with coverage
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

### **Code Style & Patterns**

- **TypeScript strict mode**: Full type safety with strict compiler options
- **ES6 modules**: Clean import/export patterns
- **Reactive patterns**: Event-driven state management without framework overhead
- **Error boundaries**: Comprehensive error handling throughout the application
- **Material Design**: CSS custom properties for consistent theming

### **Legacy Compatibility**

The modernized architecture maintains backward compatibility:

- **Global variables**: Legacy globals are reactive proxies to new state
- **Function signatures**: Existing function interfaces preserved
- **Data formats**: All localStorage schemas unchanged
- **UI structure**: Existing HTML/CSS preserved

```typescript
// Legacy globals still work
window.exercisesE1RM = { squat: 100 }; // Updates reactive state
console.log(window.userBodyweight);     // Reads from reactive state
```

## Smart Recommendations System

### **Enhanced Features**

- **Context-aware recommendations**: Considers muscle group frequency, recovery needs
- **Periodization support**: Analyzes training patterns for optimal programming
- **Auto-progression suggestions**: Weight increases based on RPE patterns
- **Deload detection**: Recommends deload weeks based on fatigue accumulation
- **Equipment limitations**: Smart exercise substitutions
- **Enhanced prompting**: More detailed context sent to Claude API

### **API Integration**

- **Claude API**: Uses Claude 3 Haiku model via local proxy server
- **Fallback system**: Built-in recommendation logic when API unavailable
- **Error handling**: Graceful degradation with informative error messages
- **Enhanced parsing**: Extracts workout type, reasoning, modifications, and progression

## Data Persistence

### **Storage Strategy**

- **Versioned keys**: All localStorage keys include version identifier
- **Type safety**: All stored data validated with TypeScript interfaces
- **Migration support**: Backward compatibility with existing data
- **Error recovery**: Graceful handling of corrupted or missing data

### **Export/Import**

- **Multiple formats**: JSON (complete backup) and CSV (workout data)
- **Selective export**: Choose specific data types or date ranges
- **Validation**: Import validation with detailed error reporting
- **Backup creation**: Automatic backup before importing new data

## Performance Optimizations

### **Build Optimizations**

- **Tree shaking**: Unused code elimination
- **Code splitting**: Lazy loading for enhanced features
- **Asset inlining**: Single-file deployment support
- **Minification**: Production builds fully optimized

### **Runtime Optimizations**

- **Batch updates**: Multiple state changes combined into single localStorage write
- **Lazy loading**: Chart.js and other heavy dependencies loaded on demand
- **Event delegation**: Efficient event handling for large lists
- **Memory management**: Proper cleanup of subscriptions and event listeners

## Common Development Tasks

### **Adding New Features**

1. **Define types** in `src/types/workout.ts`
2. **Implement logic** in appropriate utility module
3. **Add state management** if needed in `src/stores/app-state.ts`
4. **Write tests** for new functionality
5. **Update UI** through components or HTML loader
6. **Update this documentation**

### **Testing New Code**

- **Write unit tests** for pure functions
- **Test state management** with mocked localStorage
- **Validate data export/import** with various data sets
- **Test error conditions** and edge cases
- **Verify backward compatibility** with legacy data

### **Debugging**

- **Browser DevTools**: Full source map support in development
- **State inspection**: `window.appState.exportAppState()` for debugging
- **Test debugging**: `npm run test:ui` for interactive test debugging
- **Type checking**: `npm run type-check` to catch type errors

### **Deployment**

- **Production build**: `npm run build` creates optimized single-file output
- **Asset verification**: Check that all assets are properly inlined
- **Backward compatibility**: Ensure legacy data formats still work
- **Proxy server**: Deploy proxy server for Claude API integration

## Code Quality

### **Type Safety**

- **Strict TypeScript**: All code fully typed with strict compiler options
- **Interface definitions**: Comprehensive types for all data structures
- **Generic utilities**: Reusable type-safe utility functions
- **Runtime validation**: Type guards for external data

### **Error Handling**

- **Global error boundary**: Catches and reports unhandled errors
- **Graceful degradation**: App continues working when features fail
- **User feedback**: Clear error messages for user-facing issues
- **Logging**: Comprehensive logging for debugging

### **Documentation**

- **JSDoc comments**: All public functions documented
- **Type annotations**: Self-documenting code through TypeScript
- **Test coverage**: Tests serve as living documentation
- **Architecture decisions**: Documented in this file

## Migration Notes

This codebase has been enhanced from a single HTML file to a modern TypeScript application while maintaining full backward compatibility. The migration provides:

- **70% of framework benefits** at 25% of the migration cost
- **Immediate development improvements** without disrupting existing functionality  
- **Foundation for future enhancements** with proper architecture
- **Type safety and testing** to prevent regressions

The enhanced architecture enables rapid development of new features while maintaining the simplicity and performance of the original design.