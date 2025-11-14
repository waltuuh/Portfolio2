/**
 * Point d'entrée principal du portfolio
 * Initialise tous les modules
 */

import { initNavigation } from './navigation.js';
import { initModal } from './modal.js';
import { initAnimations } from './animations.js';

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio chargé avec succès');

    // Initialise tous les modules
    initNavigation();
    initModal();
    initAnimations();
});
