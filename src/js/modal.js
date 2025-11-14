/**
 * Gestion des modals de compétences
 */

let competencesData = null;

/**
 * Charge les données des compétences depuis le fichier JSON
 */
async function loadCompetencesData() {
    if (!competencesData) {
        try {
            const response = await fetch('./src/data/competences.json');
            const data = await response.json();
            competencesData = data.competences;
        } catch (error) {
            console.error('Erreur lors du chargement des compétences:', error);
            competencesData = [];
        }
    }
    return competencesData;
}

/**
 * Affiche le détail d'une compétence dans un modal
 * @param {number} competenceId - L'ID de la compétence (1, 2, ou 3)
 */
export async function showCompetenceDetail(competenceId) {
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
                    <button onclick="window.switchTab(event,'traces')" class="tab-btn active py-3 border-b-2 border-navy-600 text-navy-600 font-medium">
                        Traces
                    </button>
                    <button onclick="window.switchTab(event,'preuves')" class="tab-btn py-3 border-b-2 border-transparent text-gray-600 hover:text-navy-600 font-medium">
                        Preuves
                    </button>
                    <button onclick="window.switchTab(event,'analyse')" class="tab-btn py-3 border-b-2 border-transparent text-gray-600 hover:text-navy-600 font-medium">
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

/**
 * Ferme le modal de détail de compétence
 */
export function closeCompetenceDetail() {
    document.getElementById('competenceDetail').classList.add('hidden');
}

/**
 * Change d'onglet dans le modal
 * @param {Event} e - L'événement click
 * @param {string} tabName - Le nom de l'onglet (traces, preuves, analyse)
 */
export function switchTab(e, tabName) {
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

/**
 * Gestion du clavier pour fermer le modal
 */
export function initModalKeyboard() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCompetenceDetail();
        }
    });
}

/**
 * Initialise le système de modals
 */
export function initModal() {
    initModalKeyboard();

    // Expose les fonctions au contexte global pour les onclick dans le HTML
    window.showCompetenceDetail = showCompetenceDetail;
    window.closeCompetenceDetail = closeCompetenceDetail;
    window.switchTab = switchTab;
}
