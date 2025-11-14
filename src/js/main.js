/**
 * Point d'entrée principal du portfolio
 * Initialise tous les modules
 */

import { initNavigation } from './navigation.js';
import { initModal } from './modal.js';
import { initAnimations } from './animations.js';

/**
 * Fonction d'initialisation
 */
function init() {
    console.log('Portfolio chargé avec succès');

    // Initialise tous les modules
    initNavigation();
    initModal();
    initAnimations();
}

/**
 * Initialisation au chargement de la page
 * Vérifie si le DOM est déjà chargé ou attend l'événement
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // Le DOM est déjà chargé, on initialise immédiatement
    init();
}
