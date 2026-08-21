document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && closeMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
            mobileMenu.classList.remove('translate-x-0');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
                mobileMenu.classList.remove('translate-x-0');
            });
        });
    }

    // Scroll to top functionality
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ScrollSpy Navigation
    const sections = document.querySelectorAll('section[id], header[id], div[id="contacto"]');
    const navLinks = document.querySelectorAll('nav div.hidden.md\\:flex a[href^="#"]');
    
    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('text-primary', 'border-b-2', 'border-primary', 'pb-1');
                        if (!link.classList.contains('text-on-surface-variant')) {
                            link.classList.add('text-on-surface-variant');
                        }
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('text-primary', 'border-b-2', 'border-primary', 'pb-1');
                            link.classList.remove('text-on-surface-variant');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
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
                    b.classList.add('text-on-surface-variant', 'border-outline', 'hover:text-tertiary');
                });
                // Añadir estado activo al botón clickeado
                btn.classList.add('bg-tertiary', 'text-on-primary', 'border-tertiary');
                btn.classList.remove('text-on-surface-variant', 'border-outline', 'hover:text-tertiary');

                // Actualizar valor oculto para envío del form
                eventTypeInput.value = btn.getAttribute('data-value');
            });
        });
    }
    
    // Space Tabs functionality
    const spaceTabs = document.querySelectorAll('.space-tab-btn');
    const spaceContents = document.querySelectorAll('.space-content');
    const spaceImages = document.querySelectorAll('.space-img');

    if (spaceTabs.length > 0) {
        spaceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-target');
                
                // Update tabs (pill style)
                spaceTabs.forEach(t => {
                    t.classList.remove('active', 'bg-primary', 'text-on-primary');
                    t.classList.add('bg-transparent', 'text-on-surface-variant', 'hover:bg-surface-variant', 'hover:text-on-background');
                });
                tab.classList.add('active', 'bg-primary', 'text-on-primary');
                tab.classList.remove('bg-transparent', 'text-on-surface-variant', 'hover:bg-surface-variant', 'hover:text-on-background');
                
                // Update contents (fluid transition)
                spaceContents.forEach(c => {
                    c.classList.remove('opacity-100', 'translate-x-0', 'z-10');
                    c.classList.add('opacity-0', 'translate-x-8', 'z-0', 'pointer-events-none');
                });
                const targetContent = document.getElementById(target);
                targetContent.classList.remove('opacity-0', 'translate-x-8', 'pointer-events-none');
                targetContent.classList.add('opacity-100', 'translate-x-0', 'z-10');
                
                // Update images (slower cross-fade)
                spaceImages.forEach(img => {
                    img.classList.remove('opacity-100');
                    img.classList.add('opacity-0', 'pointer-events-none'); 
                });
                const targetImg = document.getElementById('img-' + target);
                targetImg.classList.remove('pointer-events-none', 'opacity-0');
                targetImg.classList.add('opacity-100');
            });
        });
    }

    // Gallery Slider functionality
    const gallerySlider = document.getElementById('gallery-slider');
    const galScrollbar = document.getElementById('gal-scrollbar');

    if (gallerySlider && galScrollbar) {
        // Sync scrollbar value to gallery scroll position
        gallerySlider.addEventListener('scroll', () => {
            const maxScrollLeft = gallerySlider.scrollWidth - gallerySlider.clientWidth;
            if (maxScrollLeft > 0) {
                const scrollPercent = (gallerySlider.scrollLeft / maxScrollLeft) * 100;
                galScrollbar.value = scrollPercent;
            }
        });

        // Sync gallery scroll position to scrollbar value
        galScrollbar.addEventListener('input', () => {
            const maxScrollLeft = gallerySlider.scrollWidth - gallerySlider.clientWidth;
            const scrollLeft = (galScrollbar.value / 100) * maxScrollLeft;
            gallerySlider.scrollLeft = scrollLeft;
        });
    }

    // Fetch CMS Content
    fetch('data/content.json')
        .then(response => response.json())
        .then(data => {
            // Hero
            if (data.hero) {
                if (data.hero.title) document.getElementById('cms-hero-title').textContent = data.hero.title;
                if (data.hero.subtitle) document.getElementById('cms-hero-subtitle').textContent = data.hero.subtitle;
                if (data.hero.image) {
                    document.getElementById('cms-hero-image').style.backgroundImage = `url(${data.hero.image})`;
                    document.getElementById('cms-hero-image').textContent = '';
                }
            }
            
            // Space
            if (data.space) {
                if (data.space.title) document.getElementById('cms-space-title').textContent = data.space.title;
                if (data.space.text) document.getElementById('cms-space-text').textContent = data.space.text;
                // Currently only Olimpo image has an ID in the original JS: cms-space-image.
                // Assuming `cms-space-image` maps to Olimpo or the main space.
                const spaceImgEl = document.getElementById('cms-space-image') || document.getElementById('img-espacio-1');
                if (spaceImgEl && data.space.image_olimpo) {
                    spaceImgEl.style.backgroundImage = `url(${data.space.image_olimpo})`;
                    spaceImgEl.textContent = '';
                }
                const space2ImgEl = document.getElementById('img-espacio-2');
                if (space2ImgEl && data.space.image_apolo) {
                    space2ImgEl.style.backgroundImage = `url(${data.space.image_apolo})`;
                    space2ImgEl.textContent = '';
                }
                const space3ImgEl = document.getElementById('img-espacio-3');
                if (space3ImgEl && data.space.image_dionisio) {
                    space3ImgEl.style.backgroundImage = `url(${data.space.image_dionisio})`;
                    space3ImgEl.textContent = '';
                }
            }
            
            // Servicios
            if (data.services) {
                if (data.services.image_gastronomia) {
                    const el = document.getElementById('cms-service1-image');
                    if(el) { el.style.backgroundImage = `url(${data.services.image_gastronomia})`; el.textContent = ''; }
                }
                if (data.services.image_ambientacion) {
                    const el = document.getElementById('cms-service2-image');
                    if(el) { el.style.backgroundImage = `url(${data.services.image_ambientacion})`; el.textContent = ''; }
                }
                if (data.services.image_wedding) {
                    const el = document.getElementById('cms-service3-image');
                    if(el) { el.style.backgroundImage = `url(${data.services.image_wedding})`; el.textContent = ''; }
                }
            }
            
            // Gallery
            if (data.gallery && Array.isArray(data.gallery)) {
                data.gallery.forEach((item, index) => {
                    const i = index + 1;
                    const galleryEl = document.getElementById(`cms-gallery${i}-image`);
                    if (galleryEl && item.image) {
                        galleryEl.style.backgroundImage = `url(${item.image})`;
                        galleryEl.textContent = '';
                    }
                });
            // Sello
            if (data.sello) {
                if (data.sello.title) document.getElementById('cms-sello-title').textContent = data.sello.title;
                if (data.sello.subtitle) document.getElementById('cms-sello-subtitle').textContent = data.sello.subtitle;
                if (data.sello.paragraph1) document.getElementById('cms-sello-paragraph1').textContent = data.sello.paragraph1;
                if (data.sello.paragraph2) document.getElementById('cms-sello-paragraph2').textContent = data.sello.paragraph2;
                if (data.sello.paragraph3) document.getElementById('cms-sello-paragraph3').textContent = data.sello.paragraph3;
                if (data.sello.paragraph4) document.getElementById('cms-sello-paragraph4').textContent = data.sello.paragraph4;
                if (data.sello.founder_title) document.getElementById('cms-sello-founder-title').textContent = data.sello.founder_title;
                if (data.sello.slogan) document.getElementById('cms-sello-slogan').textContent = data.sello.slogan;
                if (data.sello.image_caption) document.getElementById('cms-sello-image-caption').textContent = data.sello.image_caption;
                if (data.sello.image) {
                    const imgEl = document.getElementById('cms-sello-image');
                    if (imgEl) imgEl.src = data.sello.image;
                }
            }
        })
        .catch(error => console.error('Error loading CMS content:', error));

    // WhatsApp Send
    const whatsappBtn = document.getElementById('whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const name = document.getElementById('name')?.value || 'No especificado';
            const email = document.getElementById('email')?.value || 'No especificado';
            const phone = document.getElementById('phone')?.value || 'No especificado';
            const date = document.getElementById('date')?.value || 'No especificada';
            const details = document.getElementById('details')?.value || 'Ninguno';
            const eventType = document.getElementById('event_type')?.value || 'No especificado';
            
            const message = `Hola, me gustaría cotizar un evento:\n\n*Tipo:* ${eventType}\n*Nombre:* ${name}\n*Email:* ${email}\n*Teléfono:* ${phone}\n*Fecha:* ${date}\n*Detalles:* ${details}`;
            
            const whatsappUrl = `https://wa.me/56978600627?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
});
