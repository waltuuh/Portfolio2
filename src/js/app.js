/**
 * Portfolio Académique - Application principale
 * Version standalone (sans modules ES6) pour compatibilité maximale
 */

// ========================================
// DONNÉES DES COMPÉTENCES
// ========================================
let competencesData = null;

async function loadCompetencesData() {
    if (!competencesData) {
        try {
            const response = await fetch('./src/data/competences.json');
            const data = await response.json();
            competencesData = data.competences;
        } catch (error) {
            console.error('Erreur lors du chargement des compétences:', error);
            // Fallback: utiliser des données inline si le fetch échoue
            competencesData = [
                {
                    id: 1,
                    title: "Compétence 1 : Gérer (les données)",
                    color: "blue",
                    description: "Collecter (scraping), nettoyer, structurer et exploiter les données pour l'analyse.",
                    niveau: 85,
                    tags: ["Python", "Scrapy", "Pandas", "SQL"],
                    traces: [
                        {
                            title: "Scraping de données Web",
                            date: "2024–2025",
                            description: "Développement de spiders Scrapy en Python pour extraire automatiquement des informations, gestion des pipelines et export en JSON/CSV.",
                            tags: ["Python", "Scrapy", "JSON", "CSV"]
                        },
                        {
                            title: "Nettoyage & préparation",
                            date: "2024–2025",
                            description: "Scripts de nettoyage (pandas) : dédoublonnage, normalisation des formats, contrôle de qualité et préparation à l'analyse.",
                            tags: ["Pandas", "Data Cleaning", "Qualité des données"]
                        },
                        {
                            title: "Stockage & requêtes",
                            date: "2024–2025",
                            description: "Structuration des données et chargement dans une base SQL pour requêtes et agrégations.",
                            tags: ["SQL", "Modélisation", "Indexation"]
                        }
                    ],
                    preuves: [
                        "✅ Collecte automatisée par spiders Scrapy",
                        "✅ Données nettoyées et normalisées (pandas)",
                        "✅ Jeux de données structurés (JSON/CSV/SQL) prêts à l'analyse"
                    ],
                    reflexion: "Gérer les données m'a appris à être rigoureux : un scraping fiable et un nettoyage soigné conditionnent la qualité des analyses."
                },
                {
                    id: 2,
                    title: "Compétence 2 : Conduire (un projet)",
                    color: "mint",
                    description: "Piloter un projet en Agile : sprints, suivi de l'avancement, gestion des livrables et du code sur GitHub.",
                    niveau: 80,
                    tags: ["Scrum", "Git & GitHub", "Issues/PRs", "Planning"],
                    traces: [
                        {
                            title: "Planification Scrum hebdomadaire",
                            date: "2024–2025",
                            description: "Backlog, sprints, daily/weekly, revues d'avancement et adaptation du planning.",
                            tags: ["Scrum", "Backlog", "Sprints"]
                        },
                        {
                            title: "Suivi GitHub (issues/PR)",
                            date: "2024–2025",
                            description: "Organisation par issues, revues de code via pull requests et historique clair des décisions.",
                            tags: ["Git", "GitHub", "Code Review"]
                        },
                        {
                            title: "Livrables & jalons",
                            date: "2025",
                            description: "Orchestration des livrables (poster, vidéo, rapport) et respect des échéances.",
                            tags: ["Gestion des livrables", "Roadmap", "Qualité"]
                        }
                    ],
                    preuves: [
                        "✅ Sprints planifiés et objectifs atteints",
                        "✅ Workflow Git propre (branches, PR, issues)",
                        "✅ Livrables remis à temps (poster, vidéo, rapport)"
                    ],
                    reflexion: "Conduire un projet m'a appris l'anticipation et l'adaptabilité : communiquer tôt, découper finement, et itérer pour livrer à l'heure."
                },
                {
                    id: 3,
                    title: "Compétence 3 : Collaborer (en équipe)",
                    color: "purple",
                    description: "Co-construire des livrables, communiquer clairement et se coordonner pour atteindre l'objectif commun.",
                    niveau: 90,
                    tags: ["Communication", "Poster & Vidéo", "Réunions", "Coordination"],
                    traces: [
                        {
                            title: "Poster de projet",
                            date: "2025",
                            description: "Conception collective d'un poster A1 : répartition des sections (contenu/design) et intégration des retours.",
                            tags: ["Design", "Rédaction", "Mise en page"]
                        },
                        {
                            title: "Vidéo de présentation (~3 min)",
                            date: "2025",
                            description: "Écriture du script, tournage et montage en équipe pour présenter le projet de façon claire et engageante.",
                            tags: ["Storyboard", "Montage", "Communication"]
                        },
                        {
                            title: "Réunions & coordination",
                            date: "2024–2025",
                            description: "Réunions hebdomadaires (Discord/présentiel), comptes-rendus et plan d'actions pour une coordination fluide.",
                            tags: ["Réunions", "Compte-rendu", "Organisation"]
                        }
                    ],
                    preuves: [
                        "✅ Livrables collectifs (poster + vidéo) finalisés",
                        "✅ Communication régulière et feedbacks intégrés",
                        "✅ Répartition claire des rôles et entraide"
                    ],
                    reflexion: "La collaboration fonctionne quand chacun est écouté et responsabilisé : j'ai progressé en feedback, coordination et clarté des messages."
                }
            ];
        }
    }
    return competencesData;
}

// ========================================
// GESTION DES MODALS
// ========================================

async function showCompetenceDetail(competenceId) {
    const modal = document.getElementById('competenceDetail');
    const content = document.getElementById('competenceDetailContent');

    // Charge les données si nécessaire
    const competences = await loadCompetencesData();
    const data = competences.find(c => c.id === competenceId);

    if (!data) {
        console.error('Compétence non trouvée:', competenceId);
        return;
    }

    content.innerHTML = `
        <div class="space-y-8">
            <div>
                <h2 class="text-3xl font-display font-bold text-navy-900 mb-4">${data.title}</h2>
                <p class="text-lg text-gray-600">${data.description}</p>
            </div>

            <div class="border-b border-gray-200">
                <nav class="flex gap-8">
                    <button onclick="switchTab(event,'traces')" class="tab-btn active py-3 border-b-2 border-navy-600 text-navy-600 font-medium">
                        Traces
                    </button>
                    <button onclick="switchTab(event,'preuves')" class="tab-btn py-3 border-b-2 border-transparent text-gray-600 hover:text-navy-600 font-medium">
                        Preuves
                    </button>
                    <button onclick="switchTab(event,'analyse')" class="tab-btn py-3 border-b-2 border-transparent text-gray-600 hover:text-navy-600 font-medium">
                        Analyse Réflexive
                    </button>
                </nav>
            </div>

            <div id="tab-traces" class="tab-content">
                <h3 class="text-2xl font-bold text-navy-900 mb-6">Traces d'acquisition</h3>
                <div class="space-y-4">
                    ${data.traces.map(trace => `
                        <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h4 class="text-lg font-bold text-navy-900 mb-2">${trace.title}</h4>
                            <p class="text-sm text-gray-500 mb-3">${trace.date}</p>
                            <p class="text-gray-700 mb-4">${trace.description}</p>
                            <div class="flex flex-wrap gap-2">
                                ${trace.tags.map(tag => `
                                    <span class="px-3 py-1 bg-white text-gray-700 rounded-lg text-sm border border-gray-200">${tag}</span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div id="tab-preuves" class="tab-content hidden">
                <h3 class="text-2xl font-bold text-navy-900 mb-6">Preuves d'acquisition</h3>
                <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                    <ul class="space-y-3">
                        ${data.preuves.map(preuve => `
                            <li class="flex items-start">
                                <span class="text-lg mr-3">•</span>
                                <span class="text-gray-700">${preuve}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <div id="tab-analyse" class="tab-content hidden">
                <h3 class="text-2xl font-bold text-navy-900 mb-6">Analyse Réflexive</h3>
                <div class="prose prose-lg max-w-none">
                    <p class="text-gray-700 leading-relaxed">${data.reflexion}</p>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeCompetenceDetail() {
    document.getElementById('competenceDetail').classList.add('hidden');
}

function switchTab(e, tabName) {
    // Cache tous les contenus
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById('tab-' + tabName).classList.remove('hidden');

    // Update les styles des boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'border-navy-600', 'text-navy-600');
        btn.classList.add('border-transparent', 'text-gray-600');
    });
    e.target.classList.remove('border-transparent', 'text-gray-600');
    e.target.classList.add('active', 'border-navy-600', 'text-navy-600');
}

// ========================================
// NAVIGATION
// ========================================

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleScrollButton() {
    window.addEventListener('scroll', () => {
        const scrollBtn = document.getElementById('scrollTopBtn');
        if (scrollBtn) {
            scrollBtn.style.opacity = (window.pageYOffset > 300) ? '1' : '0';
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function togglePresentation() {
    const el = document.querySelector('main');
    if (!document.fullscreenElement) {
        el.requestFullscreen?.().catch(console.error);
    } else {
        document.exitFullscreen?.();
    }
}

// ========================================
// ANIMATIONS
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observer toutes les sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ========================================
// GESTION DU CLAVIER
// ========================================

function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCompetenceDetail();
        }
    });
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Portfolio chargé avec succès');

    // Initialise tous les modules
    initSmoothScroll();
    handleScrollButton();
    initScrollAnimations();
    initKeyboardControls();

    // Précharge les données des compétences
    loadCompetencesData().then(() => {
        console.log('✅ Données des compétences chargées');
    });
});
