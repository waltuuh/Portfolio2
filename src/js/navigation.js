/**
 * Navigation et menu mobile
 */

/**
 * Affiche/masque le menu mobile
 */
export function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

/**
 * Gestion du scroll vers le haut
 */
export function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Affiche/masque le bouton scroll to top
 */
export function handleScrollButton() {
    window.addEventListener('scroll', () => {
        const scrollBtn = document.getElementById('scrollTopBtn');
        if (scrollBtn) {
            scrollBtn.style.opacity = (window.pageYOffset > 300) ? '1' : '0';
        }
    });
}

/**
 * Gestion du smooth scrolling pour les ancres
 */
export function initSmoothScroll() {
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

/**
 * Mode présentation (plein écran)
 */
export function togglePresentation() {
    const el = document.querySelector('main');
    if (!document.fullscreenElement) {
        el.requestFullscreen?.().catch(console.error);
    } else {
        document.exitFullscreen?.();
    }
}

/**
 * Initialise toute la navigation
 */
export function initNavigation() {
    initSmoothScroll();
    handleScrollButton();

    // Expose les fonctions au contexte global pour les onclick dans le HTML
    window.toggleMobileMenu = toggleMobileMenu;
    window.scrollToTop = scrollToTop;
    window.togglePresentation = togglePresentation;
}
