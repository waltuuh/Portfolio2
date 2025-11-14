// Global variables
let scrapedData = null;
let priceChart, siteChart, categoryChart;

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('../../data/datasets/scraped-products.json');
        scrapedData = await response.json();
        initializeAnalyzer();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Erreur lors du chargement des données scrappées');
    }
});

// Initialize analyzer
function initializeAnalyzer() {
    updateStats();
    createPriceComparisonChart();
    createSiteAveragesChart();
    createCategoryDistributionChart();
    displayProducts();
    displayBestDeals();
}

// Update statistics
function updateStats() {
    document.getElementById('totalProducts').textContent = scrapedData.products.length;
    document.getElementById('totalSites').textContent = scrapedData.metadata.sites.length;
    document.getElementById('avgVariation').textContent = scrapedData.statistics.avgPriceVariation.toFixed(1) + '%';

    const scrapeDate = new Date(scrapedData.metadata.scrapedAt);
    const now = new Date();
    const diffMinutes = Math.floor((now - scrapeDate) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 1) {
        document.getElementById('lastScrape').textContent = diffMinutes + ' min';
    } else if (diffHours < 24) {
        document.getElementById('lastScrape').textContent = diffHours + 'h';
    } else {
        document.getElementById('lastScrape').textContent = Math.floor(diffHours / 24) + 'j';
    }
}

// Create price comparison chart
function createPriceComparisonChart() {
    const ctx = document.getElementById('priceComparisonChart').getContext('2d');

    // Prepare data for first 5 products
    const products = scrapedData.products.slice(0, 5);
    const sites = scrapedData.metadata.sites;

    const datasets = sites.map((site, index) => {
        const colors = [
            { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)' },
            { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgb(16, 185, 129)' },
            { bg: 'rgba(139, 92, 246, 0.8)', border: 'rgb(139, 92, 246)' },
            { bg: 'rgba(249, 115, 22, 0.8)', border: 'rgb(249, 115, 22)' }
        ];

        return {
            label: site,
            data: products.map(product => {
                const sitePrice = product.prices.find(p => p.site === site);
                return sitePrice ? sitePrice.price : null;
            }),
            backgroundColor: colors[index].bg,
            borderColor: colors[index].border,
            borderWidth: 2,
            borderRadius: 6
        };
    });

    priceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(p => p.name.substring(0, 20) + '...'),
            datasets: datasets
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
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
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

// Create site averages chart
function createSiteAveragesChart() {
    const ctx = document.getElementById('siteAveragesChart').getContext('2d');

    // Calculate average price per site
    const siteAverages = scrapedData.metadata.sites.map(site => {
        let totalPrice = 0;
        let count = 0;

        scrapedData.products.forEach(product => {
            const sitePrice = product.prices.find(p => p.site === site);
            if (sitePrice && sitePrice.inStock) {
                totalPrice += sitePrice.price;
                count++;
            }
        });

        return count > 0 ? totalPrice / count : 0;
    });

    siteChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: scrapedData.metadata.sites,
            datasets: [{
                data: siteAverages,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(249, 115, 22, 0.7)'
                ],
                borderColor: '#fff',
                borderWidth: 2
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
                            return context.label + ': ' + formatCurrency(context.parsed.r);
                        }
                    }
                }
            },
            scales: {
                r: {
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

// Create category distribution chart
function createCategoryDistributionChart() {
    const ctx = document.getElementById('categoryDistributionChart').getContext('2d');

    const categories = Object.keys(scrapedData.statistics.categoryDistribution);
    const percentages = Object.values(scrapedData.statistics.categoryDistribution);

    categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Distribution (%)',
                data: percentages,
                backgroundColor: 'rgba(139, 92, 246, 0.8)',
                borderColor: 'rgb(139, 92, 246)',
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
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
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

// Display products
function displayProducts() {
    const grid = document.getElementById('productsGrid');

    scrapedData.products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card glass rounded-2xl p-6 border border-gray-200';

        const bestPrice = product.prices.reduce((min, p) => p.price < min.price ? p : min);
        const worstPrice = product.prices.reduce((max, p) => p.price > max.price ? p : max);

        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-900 flex-1">${product.name}</h3>
                <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">${product.category}</span>
            </div>

            <div class="space-y-3 mb-4">
                ${product.prices.map(price => `
                    <div class="flex items-center justify-between p-3 rounded-lg ${price.price === bestPrice.price ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-gray-900">${price.site}</span>
                            ${price.price === bestPrice.price ? '<span class="text-xs text-green-600 font-bold">MEILLEUR PRIX</span>' : ''}
                            ${!price.inStock ? '<span class="text-xs text-red-600">Rupture</span>' : ''}
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-gray-900 ${price.price === bestPrice.price ? 'text-green-600 price-tag' : ''}">${formatCurrency(price.price)}</div>
                            <div class="text-xs text-gray-500">⭐ ${price.rating.toFixed(1)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div class="text-sm">
                    <span class="text-gray-600">Écart: </span>
                    <span class="font-bold text-red-600">${formatCurrency(worstPrice.price - bestPrice.price)}</span>
                </div>
                <div class="text-sm">
                    <span class="text-gray-600">Moy: </span>
                    <span class="font-bold text-gray-900">${formatCurrency(product.avgPrice)}</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Display best deals
function displayBestDeals() {
    const container = document.getElementById('bestDeals');

    scrapedData.statistics.bestDeals.forEach((deal, index) => {
        const product = scrapedData.products.find(p => p.id === deal.productId);

        const dealCard = document.createElement('div');
        dealCard.className = 'flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200';

        dealCard.innerHTML = `
            <div class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                ${index + 1}
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-gray-900">${product.name}</h4>
                <p class="text-sm text-gray-600">Meilleur prix chez <strong>${deal.site}</strong></p>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold text-green-600">${formatCurrency(deal.savings)}</div>
                <div class="text-xs text-gray-600">d'économie</div>
            </div>
        `;

        container.appendChild(dealCard);
    });
}

// Utility functions
function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}
