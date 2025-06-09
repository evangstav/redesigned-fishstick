#!/usr/bin/env node

const AgenticProgramGenerator = require('../template-engine/agentic-generator');
const fs = require('fs').promises;
const path = require('path');

async function generateExamples() {
  console.log('🤖 Generating AI-Powered Fitness Apps...\n');
  
  const examples = [
    {
      name: 'powerlifter',
      config: {
        app_name: 'PowerLifter Pro',
        primary_goal: 'strength',
        experience_level: 'advanced',
        default_bodyweight: 200,
        sessions_per_week: 4,
        time_per_session: 90,
        age_range: '25-35',
        equipment_access: ['barbell', 'squat_rack', 'bench', 'platform', 'competition_plates'],
        limitations: 'none',
        competition_prep: true,
        features: {
          ai_recommendations: true,
          bodyweight_tracking: false,
          rpe_logging: true,
          analytics_enabled: true
        }
      }
    },
    {
      name: 'bodybuilder',
      config: {
        app_name: 'Muscle Builder Deluxe',
        primary_goal: 'hypertrophy',
        experience_level: 'intermediate',
        default_bodyweight: 175,
        sessions_per_week: 5,
        time_per_session: 75,
        age_range: '22-30',
        equipment_access: ['dumbbells', 'cables', 'machines', 'barbell', 'isolation_equipment'],
        limitations: 'none',
        contest_prep: false,
        features: {
          ai_recommendations: true,
          bodyweight_tracking: true,
          rpe_logging: true,
          analytics_enabled: true
        }
      }
    },
    {
      name: 'endurance-athlete',
      config: {
        app_name: 'Endurance Training Hub',
        primary_goal: 'endurance',
        experience_level: 'intermediate',
        default_bodyweight: 150,
        sessions_per_week: 3,
        time_per_session: 45,
        age_range: '28-40',
        equipment_access: ['bodyweight', 'light_dumbbells', 'resistance_bands'],
        limitations: 'time_constrained',
        sport_specific: 'running_cycling',
        features: {
          ai_recommendations: true,
          bodyweight_tracking: true,
          rpe_logging: true,
          analytics_enabled: true
        }
      }
    },
    {
      name: 'beginner',
      config: {
        app_name: 'Beginner Fitness Journey',
        primary_goal: 'general_fitness',
        experience_level: 'beginner',
        default_bodyweight: 140,
        sessions_per_week: 3,
        time_per_session: 45,
        age_range: '18-25',
        equipment_access: ['bodyweight', 'dumbbells', 'basic_equipment'],
        limitations: 'new_to_exercise',
        learning_focus: true,
        features: {
          ai_recommendations: true,
          bodyweight_tracking: true,
          rpe_logging: false,
          analytics_enabled: false
        }
      }
    }
  ];
  
  try {
    const generator = new AgenticProgramGenerator();
    await generator.initialize();
    
    await fs.mkdir(path.join(__dirname, '../generated-apps'), { recursive: true });
    
    for (const example of examples) {
      console.log(`⚙️  Generating ${example.config.app_name}...`);
      
      const generatedApp = await generator.generateApp(example.config);
      const fileName = `${example.name}-fitness-app.html`;
      const outputPath = path.join(__dirname, '../generated-apps', fileName);
      
      await fs.writeFile(outputPath, generatedApp);
      
      console.log(`✅ ${example.config.app_name} (${Math.round(generatedApp.length / 1024)}KB)`);
      console.log(`   Goal: ${example.config.primary_goal}`);
      console.log(`   Features: ${Object.entries(example.config.features).filter(([k,v]) => v).map(([k,v]) => k).join(', ')}`);
      console.log(`   File: ${fileName}\n`);
    }
    
    console.log('🎉 All AI-powered apps generated successfully!');
    console.log('📁 Location: generated-apps/');
    console.log('\n🤖 Each app has a unique AI-generated program:');
    console.log('   💪 PowerLifter Pro - Strength-focused competition prep');
    console.log('   🏆 Muscle Builder Deluxe - Hypertrophy volume training');
    console.log('   🏃 Endurance Training Hub - Cardio-integrated conditioning');
    console.log('   🎯 Beginner Fitness Journey - Learning-focused progression');
    console.log('\n🌐 To test the agentic generation:');
    console.log('   open generated-apps/powerlifter-fitness-app.html');
    console.log('   open generated-apps/bodybuilder-fitness-app.html');
    
  } catch (error) {
    console.error('❌ Error generating examples:', error.message);
    process.exit(1);
  }
}

generateExamples();