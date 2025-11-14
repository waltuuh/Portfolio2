// Global variables
let mlData = null;
let performanceChart, featureChart, scatterChart;

// Model coefficients (trained offline)
const model = {
    intercept: -8500000,
    coefficients: {
        surface: 3500,
        chambres: 12000,
        distance_centre: -25000,
        annee_construction: 4200
    }
};

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('../../data/datasets/ml-housing-data.json');
        mlData = await response.json();
        initializeML();
        setupInputListeners();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Erreur lors du chargement des données ML');
    }
});

// Initialize ML visualizations
function initializeML() {
    updatePerformanceMetrics();
    createPerformanceChart();
    createFeatureImportanceChart();
    createScatterChart();
    populateTrainingTable();
}

// Setup input listeners
function setupInputListeners() {
    const inputs = ['surface', 'chambres', 'distance', 'annee'];

    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        const valueSpan = document.getElementById(inputId + 'Value');

        input.addEventListener('input', (e) => {
            valueSpan.textContent = e.target.value;
        });
    });
}

// Update performance metrics
function updatePerformanceMetrics() {
    document.getElementById('rSquared').textContent = mlData.model_performance.r_squared.toFixed(2);
    document.getElementById('mae').textContent = formatCurrency(mlData.model_performance.mean_absolute_error, 0);
    document.getElementById('rmse').textContent = formatCurrency(mlData.model_performance.root_mean_squared_error, 0);
    document.getElementById('accuracy').textContent = mlData.model_performance.accuracy;
}

// Create performance chart
function createPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mlData.training_data.slice(0, 20).map((_, i) => `Sample ${i + 1}`),
            datasets: [{
                label: 'Prix réel',
                data: mlData.training_data.slice(0, 20).map(d => d.prix),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.3,
                pointRadius: 4
            }, {
                label: 'Prix prédit',
                data: mlData.training_data.slice(0, 20).map(d => predictPrice(d.surface, d.chambres, d.distance_centre, d.annee_construction)),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                pointRadius: 4,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y, 0);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, 0);
                        }
                    }
                }
            }
        }
    });
}

// Create feature importance chart
function createFeatureImportanceChart() {
    const ctx = document.getElementById('featureImportanceChart').getContext('2d');

    const features = Object.keys(mlData.feature_importance);
    const importance = Object.values(mlData.feature_importance);

    const featureLabels = {
        'surface': 'Surface (m²)',
        'distance_centre': 'Distance du centre',
        'annee_construction': 'Année de construction',
        'chambres': 'Nombre de chambres'
    };

    featureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: features.map(f => featureLabels[f]),
            datasets: [{
                label: 'Importance',
                data: importance.map(v => v * 100),
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(249, 115, 22, 0.8)'
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(59, 130, 246)',
                    'rgb(139, 92, 246)',
                    'rgb(249, 115, 22)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Importance: ' + context.parsed.x.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 50,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create scatter chart
function createScatterChart() {
    const ctx = document.getElementById('scatterChart').getContext('2d');

    // Prepare scatter data
    const scatterData = mlData.training_data.map(d => ({
        x: d.prix,
        y: predictPrice(d.surface, d.chambres, d.distance_centre, d.annee_construction)
    }));

    scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Prédictions',
                data: scatterData,
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Ligne parfaite',
                data: [
                    { x: 100000, y: 100000 },
                    { x: 600000, y: 600000 }
                ],
                type: 'line',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 2,
                borderDash: [10, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Réel: ${formatCurrency(context.parsed.x, 0)}, Prédit: ${formatCurrency(context.parsed.y, 0)}`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Prix réel (€)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, 0);
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Prix prédit (€)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, 0);
                        }
                    }
                }
            }
        }
    });
}

// Populate training table
function populateTrainingTable() {
    const tbody = document.getElementById('trainingDataTable');

    mlData.training_data.slice(0, 10).forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-100 hover:bg-gray-50 transition-colors';
        tr.innerHTML = `
            <td class="py-3 px-4">${row.surface} m²</td>
            <td class="py-3 px-4">${row.chambres}</td>
            <td class="py-3 px-4">${row.distance_centre} km</td>
            <td class="py-3 px-4">${row.annee_construction}</td>
            <td class="py-3 px-4 text-right font-semibold">${formatCurrency(row.prix, 0)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Predict price using linear regression
function predictPrice(surface, chambres, distance, annee) {
    return model.intercept +
        (model.coefficients.surface * surface) +
        (model.coefficients.chambres * chambres) +
        (model.coefficients.distance_centre * distance) +
        (model.coefficients.annee_construction * annee);
}

// Predict button handler
function predict() {
    const surface = parseFloat(document.getElementById('surface').value);
    const chambres = parseInt(document.getElementById('chambres').value);
    const distance = parseFloat(document.getElementById('distance').value);
    const annee = parseInt(document.getElementById('annee').value);

    const predictedPrice = predictPrice(surface, chambres, distance, annee);

    // Display result
    const resultDiv = document.getElementById('predictionResult');
    const priceSpan = document.getElementById('predictedPrice');

    priceSpan.textContent = formatCurrency(predictedPrice, 0);
    resultDiv.classList.remove('hidden');

    // Smooth scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Utility functions
function formatCurrency(value, decimals = 2) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}
