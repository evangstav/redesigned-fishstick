// Chart.js Components for 4-Week Program App

// Global Chart Instance Variables
let bodyweightChartInstance = null;
let volumeChartInstance = null;
let strengthChartInstance = null;
let trainingLoadChartInstance = null;
let frequencyChartInstance = null;

// Chart color palette
const CHART_COLORS = [
    '#673AB7', '#4CAF50', '#f44336', '#FF9800', '#2196F3', 
    '#9C27B0', '#795548', '#607D8B', '#E91E63', '#009688'
];

// Renders the bodyweight chart
function renderBodyweightChart() {
    const ctx = document.getElementById('bodyweightChart');
    if (!ctx) return; // If tab not visible or element not found

    if (bodyweightChartInstance) {
        bodyweightChartInstance.destroy(); // Destroy previous instance to avoid conflicts
    }
    if (bodyweightHistory.length === 0) {
         ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height); // Clear canvas
         // Optionally display a message like "No bodyweight data logged yet."
        return;
    }

    const labels = bodyweightHistory.map(entry => entry.date);
    const data = bodyweightHistory.map(entry => entry.weight);
    const root = getComputedStyle(document.documentElement);
    const lineColour = root.getPropertyValue('--md-purple-500').trim() || '#673AB7';
    const bgColour   = root.getPropertyValue('--md-purple-100').trim() || '#D1C4E9';

    bodyweightChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bodyweight (kg/lbs)',
                data: data,
                borderColor: 'var(--md-purple-500)',
                backgroundColor: 'var(--md-purple-100)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Weight (kg/lbs)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Bodyweight Progress'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update volume analytics
function updateVolumeAnalytics() {
    const daysBack = parseInt(document.getElementById('volumeTimeRange').value);
    const { muscleGroupVolumes, dailyVolumes } = calculateVolumeData(daysBack);
    
    // Update chart
    updateVolumeChart(dailyVolumes);
    
    // Update metrics
    updateVolumeMetrics(muscleGroupVolumes, daysBack);
}

// Update volume chart
function updateVolumeChart(dailyVolumes) {
    const ctx = document.getElementById('volumeChart').getContext('2d');
    
    if (volumeChartInstance) {
        volumeChartInstance.destroy();
    }
    
    // Get all muscle groups
    const allMuscleGroups = new Set();
    dailyVolumes.forEach(day => {
        Object.keys(day.volumes).forEach(group => allMuscleGroups.add(group));
    });
    
    const muscleGroupsArray = Array.from(allMuscleGroups).sort();
    const colors = CHART_COLORS;
    
    const datasets = muscleGroupsArray.map((group, index) => ({
        label: group,
        data: dailyVolumes.map(day => day.volumes[group] || 0),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        fill: false,
        tension: 0.1
    }));
    
    volumeChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dailyVolumes.map(day => new Date(day.date).toLocaleDateString()),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Volume (kg × reps)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Training Volume by Muscle Group'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Strength progression chart implementation
function updateStrengthChart() {
    const exerciseName = document.getElementById('strengthExercise').value;
    const daysBack = parseInt(document.getElementById('strengthTimeRange').value);
    
    const strengthData = getStrengthProgressionData(exerciseName, daysBack);
    updateStrengthChartDisplay(strengthData, exerciseName);
    updateStrengthMetrics(strengthData, exerciseName);
}

// Update the strength chart display
function updateStrengthChartDisplay(strengthData, exerciseName) {
    const ctx = document.getElementById('strengthChart').getContext('2d');
    
    if (strengthChartInstance) {
        strengthChartInstance.destroy();
    }
    
    if (strengthData.length === 0) {
        // Show "no data" message
        ctx.fillStyle = '#666';
        ctx.font = '16px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('No data available for this exercise and time period', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    strengthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: strengthData.map(entry => new Date(entry.date).toLocaleDateString()),
            datasets: [{
                label: 'e1RM (kg)',
                data: strengthData.map(entry => entry.e1RM),
                borderColor: '#673AB7',
                backgroundColor: '#673AB720',
                fill: false,
                tension: 0.1,
                pointBackgroundColor: '#673AB7',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'e1RM (kg)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${exerciseName} Strength Progression`
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const dataPoint = strengthData[context.dataIndex];
                            if (dataPoint.bestSet) {
                                return `Best set: ${dataPoint.bestSet.weight}kg × ${dataPoint.bestSet.reps} @ RPE ${dataPoint.bestSet.rpe}`;
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });
}

// Training load analytics implementation
function updateTrainingLoadAnalytics() {
    const daysBack = parseInt(document.getElementById('loadTimeRange').value);
    const trainingLoadData = calculateTrainingLoadData(daysBack);
    
    updateTrainingLoadChart(trainingLoadData);
    updateTrainingLoadMetrics(trainingLoadData, daysBack);
}

// Update training load chart
function updateTrainingLoadChart(trainingLoadData) {
    const ctx = document.getElementById('trainingLoadChart').getContext('2d');
    
    if (trainingLoadChartInstance) {
        trainingLoadChartInstance.destroy();
    }
    
    const dailyLoads = trainingLoadData.dailyLoads;
    
    if (dailyLoads.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('No training load data available', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    // Calculate 7-day rolling average
    const rollingAverage = [];
    for (let i = 0; i < dailyLoads.length; i++) {
        const start = Math.max(0, i - 6);
        const window = dailyLoads.slice(start, i + 1);
        const avgLoad = window.reduce((sum, day) => sum + day.load, 0) / window.length;
        rollingAverage.push(avgLoad);
    }
    
    trainingLoadChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dailyLoads.map(day => new Date(day.date).toLocaleDateString()),
            datasets: [{
                label: 'Daily Training Load',
                data: dailyLoads.map(day => day.load),
                backgroundColor: dailyLoads.map(day => {
                    // Color coding based on load intensity
                    if (day.load === 0) return '#e0e0e0';
                    if (day.load < 5000) return '#4CAF50';
                    if (day.load < 10000) return '#FF9800';
                    return '#f44336';
                }),
                borderWidth: 1
            }, {
                label: '7-Day Rolling Average',
                data: rollingAverage,
                type: 'line',
                borderColor: '#673AB7',
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.1,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Training Load (Volume × RPE)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Training Load & Stress Monitoring'
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            if (context.dataset.label === 'Daily Training Load') {
                                const dayData = dailyLoads[context.dataIndex];
                                return `Sets: ${dayData.sets}`;
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });
}

// Update frequency chart
function updateFrequencyChart(frequencyData) {
    const ctx = document.getElementById('frequencyChart').getContext('2d');
    
    if (frequencyChartInstance) {
        frequencyChartInstance.destroy();
    }
    
    const { muscleGroupStats } = frequencyData;
    const muscleGroups = Object.keys(muscleGroupStats)
        .filter(group => muscleGroupStats[group].totalDays > 0)
        .sort((a, b) => muscleGroupStats[b].avgPerWeek - muscleGroupStats[a].avgPerWeek);
    
    if (muscleGroups.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('No training frequency data available', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const frequencies = muscleGroups.map(group => muscleGroupStats[group].avgPerWeek);
    const maxFrequencies = muscleGroups.map(group => muscleGroupStats[group].maxPerWeek);
    
    frequencyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: muscleGroups,
            datasets: [{
                label: 'Average Frequency (days/week)',
                data: frequencies,
                backgroundColor: frequencies.map(freq => {
                    // Color coding based on frequency
                    if (freq >= 3) return '#4CAF50'; // Optimal (3+ times per week)
                    if (freq >= 2) return '#FF9800'; // Good (2+ times per week)
                    if (freq >= 1) return '#f44336'; // Suboptimal (1+ times per week)
                    return '#e0e0e0'; // Very low
                }),
                borderWidth: 1
            }, {
                label: 'Peak Frequency (max days/week)',
                data: maxFrequencies,
                backgroundColor: 'rgba(103, 58, 183, 0.3)',
                borderColor: '#673AB7',
                borderWidth: 2,
                type: 'line',
                fill: false,
                tension: 0.1,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 7,
                    title: {
                        display: true,
                        text: 'Days per Week'
                    },
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Muscle Groups'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Training Frequency by Muscle Group'
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const group = context.label;
                            const stats = muscleGroupStats[group];
                            if (context.dataset.label.includes('Average')) {
                                return `Total sessions: ${stats.totalDays}`;
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });
}