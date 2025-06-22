# **Component Refactor Implementation Plan**

## **Overview**

This plan breaks down the monolithic `4-weeks.html` file (~55k tokens) into manageable components over 6 phases. Each phase is designed to be completed in 15-45 minutes with clear testing and rollback strategies.

---

## **Phase 1: Setup & CSS Extraction (30 minutes)**

### **Step 1.1: Create file structure**

```bash
mkdir css js components
touch css/theme.css css/components.css css/mobile.css
touch js/utils.js js/state.js js/charts.js
```

### **Step 1.2: Extract CSS (15 minutes)**

- Move `:root` variables to `css/theme.css`
- Move component styles to `css/components.css`
- Move `@media` queries to `css/mobile.css`
- Update HTML to link new CSS files

### **Step 1.3: Test CSS extraction**

- Open app, verify all styling works
- Test mobile responsiveness

---

## **Phase 2: JavaScript Utilities (45 minutes)**

### **Step 2.1: Extract calculation functions to `js/utils.js`**

```javascript
// Move these functions:
- calculateEpleyE1RM()
- getEffectiveReps()
- showError()
- showSuccess()
- All RPE_TO_RIR constants
```

### **Step 2.2: Extract data management to `js/state.js`**

```javascript
// Move these functions:
- loadData()
- saveData()
- All localStorage operations
- Data validation functions
```

### **Step 2.3: Update HTML script section**

- Add script tags for new JS files
- Replace moved functions with imports
- Test all functionality works

---

## **Phase 3: Chart Components (30 minutes)**

### **Step 3.1: Create `js/charts.js`**

```javascript
// Move all Chart.js related functions:
- updateVolumeAnalytics()
- updateStrengthChart()
- updateTrainingLoadAnalytics()
- updateFrequencyChart()
- All chart configuration objects
```

### **Step 3.2: Test charts**

- Navigate to Analytics tab
- Verify all charts render
- Test time range changes

---

## **Phase 4: Modal Components (20 minutes)**

### **Step 4.1: Create `components/modals.js`**

```javascript
// Move modal functions:
- showModal()
- closeModal()
- submitAccessorySetLog()
- All modal-related DOM manipulation
```

### **Step 4.2: Test modals**

- Test accessory set logging
- Test export modal
- Verify modal close functionality

---

## **Phase 5: Navigation System (25 minutes)**

### **Step 5.1: Create `components/navigation.js`**

```javascript
// Move tab functions:
- showTab()
- Tab switching logic
- Active tab state management
```

### **Step 5.2: Test navigation**

- Click all tabs
- Verify content switches
- Test mobile navigation

---

## **Phase 6: Rest Timer Component (15 minutes)**

### **Step 6.1: Create `components/rest-timer.js`**

```javascript
// Move timer functions:
- startRestTimer()
- pauseRestTimer()
- stopRestTimer()
- updateTimerDisplay()
```

### **Step 6.2: Test timer**

- Start timer with different presets
- Test pause/resume
- Test stop functionality

---

## **Implementation Checklist**

### **Before Each Phase:**

- [ ] Create git branch: `git checkout -b phase-N-description`
- [ ] Commit current state: `git commit -am "Pre-phase N checkpoint"`

### **After Each Phase:**

- [ ] Test in browser (open `4-weeks.html`)
- [ ] Test core functionality (log a workout set)
- [ ] Test analytics (view charts)
- [ ] If working: `git commit -am "Complete phase N"`
- [ ] If broken: `git reset --hard HEAD~1`

### **File Structure After Completion:**

```
4-weeks.html (reduced from ~55k to ~25k tokens)
css/
├── theme.css (CSS variables)
├── components.css (component styles)  
└── mobile.css (responsive styles)
js/
├── utils.js (calculations, validation)
├── state.js (data management)
└── charts.js (Chart.js components)
components/
├── modals.js (modal functionality)
├── navigation.js (tab system)
└── rest-timer.js (timer component)
```

### **Testing Strategy:**

Each phase has a **5-minute test**:

1. Open app in browser
2. Click through all tabs
3. Log one workout set
4. View analytics charts  
5. Test one modal

### **Rollback Plan:**

- Each phase is a git commit
- If phase fails: `git reset --hard HEAD~1`
- Continue from previous working state

### **Time Estimate: 2.5 hours total**

- Phase 1: 30 min (CSS)
- Phase 2: 45 min (Core JS)  
- Phase 3: 30 min (Charts)
- Phase 4: 20 min (Modals)
- Phase 5: 25 min (Navigation)
- Phase 6: 15 min (Timer)
- Testing: 5 min per phase

---

## **Benefits After Completion**

1. **Maintainability**: Each component can be modified independently
2. **Readability**: Main HTML file reduced by ~50%
3. **Debugging**: Easier to locate and fix issues
4. **Testing**: Individual components can be tested in isolation
5. **Performance**: Better browser caching of separate files
6. **Collaboration**: Multiple developers can work on different components

---

## **Next Steps After Refactor**

1. **Add module bundling** (optional): Consider Webpack/Vite for production
2. **Component frameworks**: Easy migration path to React/Vue if desired
3. **Testing framework**: Add unit tests for individual components
4. **Documentation**: Auto-generate component documentation
5. **Performance monitoring**: Add metrics for component load times

