class TemplateValidator {
  constructor() {
    this.requiredElements = [
      'nav',
      '.tab-content',
      '.section',
      'header h1'
    ];
    
    this.requiredFunctions = [
      'calculateE1RM',
      'showTab',
      'saveE1RMs',
      'loadE1RMs',
      'init'
    ];
    
    this.requiredFeatures = [
      'USER_WORKOUT_PLAN',
      'RPE_TO_RIR',
      'exercisesE1RM'
    ];
  }
  
  validateGeneratedApp(appHTML) {
    console.log('🔍 Starting comprehensive validation...\n');
    
    const validationResults = {
      html_structure: this.validateHTMLStructure(appHTML),
      css_validity: this.validateCSS(appHTML),
      javascript_functionality: this.validateJavaScript(appHTML),
      feature_completeness: this.validateFeatures(appHTML),
      personalization: this.validatePersonalization(appHTML),
      performance: this.validatePerformance(appHTML)
    };
    
    const overallValid = Object.values(validationResults).every(result => result.valid);
    
    return {
      valid: overallValid,
      results: validationResults,
      summary: this.generateValidationSummary(validationResults)
    };
  }
  
  validateHTMLStructure(appHTML) {
    console.log('📄 Validating HTML structure...');
    
    const issues = [];
    const successes = [];
    
    // Check for valid HTML structure
    if (!appHTML.includes('<!DOCTYPE html>')) {
      issues.push('Missing DOCTYPE declaration');
    } else {
      successes.push('Valid DOCTYPE found');
    }
    
    if (!appHTML.includes('<html') || !appHTML.includes('</html>')) {
      issues.push('Invalid HTML root structure');
    } else {
      successes.push('Valid HTML root structure');
    }
    
    // Check for required elements
    this.requiredElements.forEach(selector => {
      const elementCheck = this.checkElementPresence(appHTML, selector);
      if (!elementCheck.found) {
        issues.push(`Missing required element: ${selector}`);
      } else {
        successes.push(`Found required element: ${selector}`);
      }
    });
    
    // Check for viewport meta tag
    if (!appHTML.includes('name="viewport"')) {
      issues.push('Missing viewport meta tag for mobile responsiveness');
    } else {
      successes.push('Viewport meta tag present');
    }
    
    // Check for external dependencies
    if (!appHTML.includes('chart.js')) {
      issues.push('Missing Chart.js dependency');
    } else {
      successes.push('Chart.js dependency included');
    }
    
    console.log(`  ✅ ${successes.length} HTML checks passed`);
    if (issues.length > 0) {
      console.log(`  ❌ ${issues.length} HTML issues found`);
    }
    
    return {
      valid: issues.length === 0,
      issues: issues,
      successes: successes,
      score: successes.length / (successes.length + issues.length)
    };
  }
  
  validateCSS(appHTML) {
    console.log('🎨 Validating CSS...');
    
    const issues = [];
    const successes = [];
    
    // Extract CSS from HTML
    const cssMatch = appHTML.match(/<style>(.*?)<\/style>/s);
    if (!cssMatch) {
      issues.push('No CSS found in generated app');
      return { valid: false, issues, successes, score: 0 };
    }
    
    const css = cssMatch[1];
    
    // Check for CSS variables
    if (!css.includes(':root')) {
      issues.push('Missing CSS variables declaration');
    } else {
      successes.push('CSS variables present');
    }
    
    // Check for Material Design colors
    if (!css.includes('--md-purple') || !css.includes('--md-grey')) {
      issues.push('Missing Material Design color system');
    } else {
      successes.push('Material Design color system present');
    }
    
    // Check for responsive design
    if (!css.includes('Mobile-first') && !css.includes('@media')) {
      issues.push('No responsive design patterns found');
    } else {
      successes.push('Responsive design patterns found');
    }
    
    // Check for elevation system
    if (!css.includes('--md-elevation')) {
      issues.push('Missing Material Design elevation system');
    } else {
      successes.push('Material Design elevation system present');
    }
    
    console.log(`  ✅ ${successes.length} CSS checks passed`);
    if (issues.length > 0) {
      console.log(`  ❌ ${issues.length} CSS issues found`);
    }
    
    return {
      valid: issues.length === 0,
      issues: issues,
      successes: successes,
      score: successes.length / (successes.length + issues.length)
    };
  }
  
  validateJavaScript(appHTML) {
    console.log('⚙️  Validating JavaScript functionality...');
    
    const issues = [];
    const successes = [];
    
    // Extract JavaScript from HTML
    const jsMatch = appHTML.match(/<script>(.*?)<\/script>/s);
    if (!jsMatch) {
      issues.push('No JavaScript found in generated app');
      return { valid: false, issues, successes, score: 0 };
    }
    
    const js = jsMatch[1];
    
    // Check for required functions
    this.requiredFunctions.forEach(funcName => {
      if (!js.includes(`function ${funcName}`) && !js.includes(`${funcName} =`)) {
        issues.push(`Missing required function: ${funcName}`);
      } else {
        successes.push(`Found required function: ${funcName}`);
      }
    });
    
    // Check for workout plan structure
    if (!js.includes('USER_WORKOUT_PLAN')) {
      issues.push('Missing workout plan structure');
    } else {
      successes.push('Workout plan structure present');
    }
    
    // Check for storage system
    if (!js.includes('localStorage')) {
      issues.push('Missing data persistence system');
    } else {
      successes.push('Data persistence system present');
    }
    
    // Check for e1RM calculation
    if (!js.includes('calculateE1RM')) {
      issues.push('Missing e1RM calculation system');
    } else {
      successes.push('e1RM calculation system present');
    }
    
    console.log(`  ✅ ${successes.length} JavaScript checks passed`);
    if (issues.length > 0) {
      console.log(`  ❌ ${issues.length} JavaScript issues found`);
    }
    
    return {
      valid: issues.length === 0,
      issues: issues,
      successes: successes,
      score: successes.length / (successes.length + issues.length)
    };
  }
  
  validateFeatures(appHTML) {
    console.log('🎯 Validating feature completeness...');
    
    const issues = [];
    const successes = [];
    
    // Check for workout logging capability
    if (!appHTML.includes('Log Set') && !appHTML.includes('logSet')) {
      issues.push('Missing workout logging functionality');
    } else {
      successes.push('Workout logging functionality present');
    }
    
    // Check for e1RM tracking
    if (!appHTML.includes('e1RM') && !appHTML.includes('1RM')) {
      issues.push('Missing e1RM tracking');
    } else {
      successes.push('e1RM tracking present');
    }
    
    // Check for RPE system
    if (!appHTML.includes('RPE')) {
      issues.push('Missing RPE (Rating of Perceived Exertion) system');
    } else {
      successes.push('RPE system present');
    }
    
    // Check for analytics capability
    if (!appHTML.includes('Chart') && !appHTML.includes('canvas')) {
      issues.push('Missing analytics/charting capability');
    } else {
      successes.push('Analytics capability present');
    }
    
    console.log(`  ✅ ${successes.length} feature checks passed`);
    if (issues.length > 0) {
      console.log(`  ❌ ${issues.length} feature issues found`);
    }
    
    return {
      valid: issues.length === 0,
      issues: issues,
      successes: successes,
      score: successes.length / (successes.length + issues.length)
    };
  }
  
  validatePersonalization(appHTML) {
    console.log('👤 Validating personalization...');
    
    const issues = [];
    const successes = [];
    
    // Check for personalized app title
    if (appHTML.includes('My Training Plan') || appHTML.includes('Personalized Strength Plan Tracker')) {
      issues.push('App title not personalized - still using default');
    } else {
      successes.push('App title is personalized');
    }
    
    // Check for personalized storage keys
    if (!appHTML.includes('personalizedPlan') && !appHTML.includes('STORAGE_KEY_PREFIX')) {
      issues.push('Missing personalized storage system');
    } else {
      successes.push('Personalized storage system present');
    }
    
    // Check for template configuration injection
    if (!appHTML.includes('TEMPLATE_CONFIG')) {
      issues.push('Missing template configuration injection');
    } else {
      successes.push('Template configuration properly injected');
    }
    
    console.log(`  ✅ ${successes.length} personalization checks passed`);
    if (issues.length > 0) {
      console.log(`  ❌ ${issues.length} personalization issues found`);
    }
    
    return {
      valid: issues.length === 0,
      issues: issues,
      successes: successes,
      score: successes.length / (successes.length + issues.length)
    };
  }
  
  validatePerformance(appHTML) {
    console.log('⚡ Validating performance...');
    
    const issues = [];
    const successes = [];
    
    // Check app size
    const sizeKB = appHTML.length / 1024;
    if (sizeKB > 200) {
      issues.push(`App size too large: ${Math.round(sizeKB)}KB (should be < 200KB)`);
    } else {
      successes.push(`App size acceptable: ${Math.round(sizeKB)}KB`);
    }
    
    // Check for external dependencies
    const externalDeps = (appHTML.match(/https?:\/\//g) || []).length;
    if (externalDeps > 5) {
      issues.push(`Too many external dependencies: ${externalDeps}`);
    } else {
      successes.push(`External dependencies reasonable: ${externalDeps}`);
    }
    
    // Check for minification opportunities
    if (appHTML.includes('    ') && appHTML.length > 30000) {
      issues.push('Code not minified - could be optimized for production');
    } else {
      successes.push('Code appears optimized');
    }
    
    console.log(`  ✅ ${successes.length} performance checks passed`);
    if (issues.length > 0) {
      console.log(`  ❌ ${issues.length} performance issues found`);
    }
    
    return {
      valid: issues.length === 0,
      issues: issues,
      successes: successes,
      score: successes.length / (successes.length + issues.length)
    };
  }
  
  checkElementPresence(html, selector) {
    // Simple check for element presence
    // In a full implementation, this would use a proper HTML parser
    if (selector.startsWith('.')) {
      const className = selector.substring(1);
      // Check for class name in various patterns
      const patterns = [
        `class="${className}"`,
        `class='${className}'`,
        `class="${className} `,
        `class='${className} `,
        ` ${className}"`,
        ` ${className}'`,
        ` ${className} `
      ];
      return {
        found: patterns.some(pattern => html.includes(pattern))
      };
    } else if (selector.includes(' ')) {
      // Handle nested selectors like "header h1"
      const parts = selector.split(' ');
      return {
        found: parts.every(part => html.includes(`<${part}`))
      };
    } else {
      return {
        found: html.includes(`<${selector}`)
      };
    }
  }
  
  generateValidationSummary(results) {
    const totalChecks = Object.values(results).reduce((sum, result) => {
      return sum + result.successes.length + result.issues.length;
    }, 0);
    
    const passedChecks = Object.values(results).reduce((sum, result) => {
      return sum + result.successes.length;
    }, 0);
    
    const overallScore = Math.round((passedChecks / totalChecks) * 100);
    
    return {
      totalChecks,
      passedChecks,
      failedChecks: totalChecks - passedChecks,
      overallScore,
      grade: this.getGrade(overallScore)
    };
  }
  
  getGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 65) return 'D+';
    if (score >= 60) return 'D';
    return 'F';
  }
}

module.exports = TemplateValidator;