// Global variables
let salesData = null;
let revenueChart, categoryChart, ordersChart, growthChart;

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('../../data/datasets/sales-data.json');
        salesData = await response.json();
        initializeDashboard();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Erreur lors du chargement des données');
    }
});

// Initialize dashboard
function initializeDashboard() {
    updateKPIs();
    createRevenueChart();
    createCategoryChart();
    createOrdersChart();
    createGrowthChart();
    populateDataTable();
}

// Update KPI cards
function updateKPIs() {
    // Calculate total revenue from monthly trends
    const totalRevenue = salesData.monthlyTrends.reduce((sum, month) => sum + month.revenue, 0);
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);

    // Calculate total orders from sales data
    const totalOrders = salesData.sales.reduce((sum, day) => sum + day.orders, 0);
    document.getElementById('totalOrders').textContent = formatNumber(totalOrders);

    // Calculate average order value
    const avgOrderValue = totalRevenue / totalOrders;
    document.getElementById('avgOrderValue').textContent = formatCurrency(avgOrderValue);

    // Calculate total unique customers
    const totalCustomers = salesData.sales.reduce((sum, day) => sum + day.customers, 0);
    document.getElementById('totalCustomers').textContent = formatNumber(totalCustomers);
}

// Create revenue trend chart
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');

    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.monthlyTrends.map(m => m.month),
            datasets: [{
                label: 'Chiffre d\'affaires (€)',
                data: salesData.monthlyTrends.map(m => m.revenue),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'CA: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Create category breakdown chart
function createCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');

    const categories = Object.keys(salesData.categoryBreakdown);
    const percentages = Object.values(salesData.categoryBreakdown);

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: percentages,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderColor: '#fff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create orders chart
function createOrdersChart() {
    const ctx = document.getElementById('ordersChart').getContext('2d');

    // Aggregate orders by month
    const monthlyOrders = salesData.monthlyTrends.map((month, index) => {
        // Calculate approximate orders based on revenue and avg order value
        const avgOrderValue = 180; // approximate
        return Math.round(month.revenue / avgOrderValue);
    });

    ordersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: salesData.monthlyTrends.map(m => m.month),
            datasets: [{
                label: 'Nombre de commandes',
                data: monthlyOrders,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Create growth rate chart
function createGrowthChart() {
    const ctx = document.getElementById('growthChart').getContext('2d');

    growthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: salesData.monthlyTrends.map(m => m.month),
            datasets: [{
                label: 'Croissance (%)',
                data: salesData.monthlyTrends.map(m => m.growth),
                backgroundColor: salesData.monthlyTrends.map(m =>
                    m.growth >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'
                ),
                borderColor: salesData.monthlyTrends.map(m =>
                    m.growth >= 0 ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'
                ),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Croissance: ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
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

// Populate data table
function populateDataTable() {
    const tbody = document.getElementById('dataTableBody');

    // Show first 10 records
    salesData.sales.slice(0, 10).forEach(row => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-100 hover:bg-gray-50 transition-colors';
        tr.innerHTML = `
            <td class="py-3 px-4">${formatDate(row.date)}</td>
            <td class="py-3 px-4 text-right font-semibold">${formatCurrency(row.revenue)}</td>
            <td class="py-3 px-4 text-right">${row.orders}</td>
            <td class="py-3 px-4 text-right">${row.customers}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(row.avgOrderValue)}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">${row.category}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Export data to CSV
function exportData() {
    if (!salesData) return;

    // Create CSV content
    let csv = 'Date,Revenue,Orders,Customers,AvgOrderValue,Category\n';
    salesData.sales.forEach(row => {
        csv += `${row.date},${row.revenue},${row.orders},${row.customers},${row.avgOrderValue},${row.category}\n`;
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales-data-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Utility functions
function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat('fr-FR').format(value);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Period change handler
document.addEventListener('DOMContentLoaded', () => {
    const periodSelect = document.getElementById('revenuePeriod');
    if (periodSelect) {
        periodSelect.addEventListener('change', (e) => {
            // In a real app, this would reload the chart with different data
            console.log('Period changed to:', e.target.value);
        });
    }
});
