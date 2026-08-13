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
    // Fetch CMS Content
    fetch('data/content.json')
        .then(response => response.json())
        .then(data => {
            if (data.hero_title) document.getElementById('cms-hero-title').textContent = data.hero_title;
            if (data.hero_subtitle) document.getElementById('cms-hero-subtitle').textContent = data.hero_subtitle;
            if (data.hero_image) {
                document.getElementById('cms-hero-image').style.backgroundImage = `url(${data.hero_image})`;
                document.getElementById('cms-hero-image').textContent = '';
            }
            
            if (data.space_title) document.getElementById('cms-space-title').textContent = data.space_title;
            if (data.space_text) document.getElementById('cms-space-text').textContent = data.space_text;
            if (data.space_image) {
                document.getElementById('cms-space-image').style.backgroundImage = `url(${data.space_image})`;
                document.getElementById('cms-space-image').textContent = '';
            }
        })
        .catch(error => console.error('Error loading CMS content:', error));
});
