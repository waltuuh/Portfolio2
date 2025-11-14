/**
 * Gestion des animations et observers
 */

/**
 * Initialise l'Intersection Observer pour les animations au scroll
 */
export function initScrollAnimations() {
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

/**
 * Initialise toutes les animations
 */
export function initAnimations() {
    initScrollAnimations();
}
