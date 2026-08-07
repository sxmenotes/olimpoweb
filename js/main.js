document.addEventListener('DOMContentLoaded', () => {
    // Scroll to top functionality
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // Event Type Selection
    const eventButtons = document.querySelectorAll('.event-btn');
    const eventTypeInput = document.getElementById('event_type');

    if (eventButtons.length > 0 && eventTypeInput) {
        eventButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Quitar estado activo de todos
                eventButtons.forEach(b => {
                    b.classList.remove('bg-tertiary', 'text-on-primary', 'border-tertiary');
                    b.classList.add('text-on-surface-variant', 'border-outline-variant');
                });
                // Añadir estado activo al botón clickeado
                btn.classList.add('bg-tertiary', 'text-on-primary', 'border-tertiary');
                btn.classList.remove('text-on-surface-variant', 'border-outline-variant');

                // Actualizar valor oculto para envío del form
                eventTypeInput.value = btn.getAttribute('data-value');
            });
        });
    }
});
