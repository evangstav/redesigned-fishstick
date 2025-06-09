// Analytics Functions Template

{{#if ANALYTICS_ENABLED}}
// Initialize analytics when app loads
function initializeAnalytics() {
    // Setup chart defaults
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = 'Roboto, sans-serif';
        Chart.defaults.color = '#616161';
    }
}

// Render bodyweight chart
function renderBodyweightChart() {
    const canvas = document.getElementById('bodyweightChart');
    if (!canvas || !bodyweightHistory.length) {
        return;
    }
    
    const timePeriod = parseInt(document.getElementById('bodyweightTimePeriod')?.value || 30);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timePeriod);
    
    const filteredData = bodyweightHistory.filter(entry => {
        return new Date(entry.date) >= cutoffDate;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredData.map(entry => entry.date),
            datasets: [{
                label: 'Bodyweight (lbs)',
                data: filteredData.map(entry => entry.weight),
                borderColor: '{{PRIMARY_COLOR}}',
                backgroundColor: '{{PRIMARY_COLOR}}20',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
    
    // Update metrics
    updateBodyweightMetrics(filteredData);
}

// Update bodyweight metrics
function updateBodyweightMetrics(data) {
    const container = document.getElementById('bodyweightMetrics');
    if (!container || !data.length) return;
    
    const latest = data[data.length - 1];
    const earliest = data[0];
    const change = latest.weight - earliest.weight;
    
    container.innerHTML = `
        <div class="metric-card">
            <h4>Current Weight</h4>
            <div class="metric-value">${latest.weight}</div>
            <div class="metric-unit">lbs</div>
        </div>
        <div class="metric-card">
            <h4>Change</h4>
            <div class="metric-value">${change > 0 ? '+' : ''}${change.toFixed(1)}</div>
            <div class="metric-unit">lbs</div>
            <div class="metric-trend ${change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'}">
                ${change > 0 ? '↗' : change < 0 ? '↘' : '→'} ${Math.abs(change).toFixed(1)}lbs
            </div>
        </div>
    `;
}

// Render volume chart
function renderVolumeChart() {
    const canvas = document.getElementById('volumeChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Get workout history for volume calculation
    const workoutHistory = loadWorkoutHistory();
    const timePeriod = parseInt(document.getElementById('volumeTimePeriod')?.value || 7);
    const volumeData = calculateVolumeData(workoutHistory, timePeriod);
    
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: volumeData.labels,
            datasets: [{
                label: 'Volume (lbs)',
                data: volumeData.values,
                backgroundColor: '{{SUCCESS_COLOR}}',
                borderColor: '{{SUCCESS_DARK}}',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    updateVolumeMetrics(volumeData);
}

// Calculate volume data from workout history
function calculateVolumeData(workoutHistory, days) {
    const labels = [];
    const values = [];
    
    // Generate last N days
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        labels.push(dateStr);
        
        // Calculate volume for this date
        const dayWorkout = workoutHistory.find(w => w.date === dateStr);
        let volume = 0;
        
        if (dayWorkout && dayWorkout.sets) {
            volume = dayWorkout.sets.reduce((total, set) => {
                if (set.weight && set.reps && set.type !== 'cardio' && set.type !== 'mobility') {
                    return total + (set.weight * set.reps);
                }
                return total;
            }, 0);
        }
        
        values.push(volume);
    }
    
    return { labels, values };
}

// Update volume metrics
function updateVolumeMetrics(volumeData) {
    const container = document.getElementById('volumeMetrics');
    if (!container) return;
    
    const totalVolume = volumeData.values.reduce((sum, val) => sum + val, 0);
    const avgVolume = totalVolume / volumeData.values.length;
    const maxVolume = Math.max(...volumeData.values);
    
    container.innerHTML = `
        <div class="metric-card">
            <h4>Total Volume</h4>
            <div class="metric-value">${Math.round(totalVolume).toLocaleString()}</div>
            <div class="metric-unit">lbs</div>
        </div>
        <div class="metric-card">
            <h4>Daily Average</h4>
            <div class="metric-value">${Math.round(avgVolume).toLocaleString()}</div>
            <div class="metric-unit">lbs/day</div>
        </div>
        <div class="metric-card">
            <h4>Peak Day</h4>
            <div class="metric-value">${Math.round(maxVolume).toLocaleString()}</div>
            <div class="metric-unit">lbs</div>
        </div>
    `;
}

// Render strength progression chart
function renderStrengthChart() {
    const canvas = document.getElementById('strengthChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const strengthData = calculateStrengthProgression();
    
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    if (!strengthData.datasets.length) {
        ctx.fillText('No strength data available', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    canvas.chart = new Chart(ctx, {
        type: 'line',
        data: strengthData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
    
    updateStrengthMetrics();
}

// Calculate strength progression data
function calculateStrengthProgression() {
    const coreLifts = CORE_LIFTS_IN_PLAN.slice(0, 4); // Limit to main lifts
    const colors = ['{{PRIMARY_COLOR}}', '{{SUCCESS_COLOR}}', '{{ERROR_COLOR}}', '#FF9800'];
    const datasets = [];
    
    coreLifts.forEach((lift, index) => {
        const history = getE1RMHistory(lift);
        if (history.length > 0) {
            datasets.push({
                label: lift,
                data: history.map(entry => ({
                    x: entry.date,
                    y: entry.e1rm
                })),
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                tension: 0.1
            });
        }
    });
    
    return {
        datasets: datasets
    };
}

// Get e1RM history for a specific lift (simplified)
function getE1RMHistory(liftName) {
    // In a real implementation, this would track e1RM changes over time
    // For now, return current e1RM as a single data point
    const currentE1RM = getCurrentE1RM(liftName);
    if (currentE1RM > 0) {
        return [{
            date: new Date().toISOString().split('T')[0],
            e1rm: currentE1RM
        }];
    }
    return [];
}

// Update strength metrics
function updateStrengthMetrics() {
    const container = document.getElementById('strengthMetrics');
    if (!container) return;
    
    const coreLifts = CORE_LIFTS_IN_PLAN.slice(0, 3);
    let metricsHtml = '';
    
    coreLifts.forEach(lift => {
        const e1rm = getCurrentE1RM(lift);
        metricsHtml += `
            <div class="metric-card">
                <h4>${lift}</h4>
                <div class="metric-value">${e1rm || 0}</div>
                <div class="metric-unit">lbs</div>
            </div>
        `;
    });
    
    container.innerHTML = metricsHtml;
}

// Render training load chart (placeholder)
function renderTrainingLoadChart() {
    const canvas = document.getElementById('trainingLoadChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Placeholder implementation
    canvas.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Training Load',
                data: [7, 8, 6, 9, 7, 5, 8],
                borderColor: '{{ERROR_COLOR}}',
                backgroundColor: '{{ERROR_COLOR}}20',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

// Render frequency chart (placeholder)
function renderFrequencyChart() {
    const canvas = document.getElementById('frequencyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Placeholder implementation
    canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'],
            datasets: [{
                label: 'Sessions/Week',
                data: [2, 2, 2, 1, 1],
                backgroundColor: '{{ACCENT_COLOR}}',
                borderColor: '{{PRIMARY_COLOR}}',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

{{else}}
// Analytics disabled - placeholder functions
function initializeAnalytics() {
    console.log('Analytics disabled in this configuration');
}

function renderBodyweightChart() {}
function renderVolumeChart() {}
function renderStrengthChart() {}
function renderTrainingLoadChart() {}
function renderFrequencyChart() {}
{{/if}}