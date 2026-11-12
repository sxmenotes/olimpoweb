import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    // Native dialog keeps keyboard focus inside the promotion and supports Escape.
    const welcomePopup = document.getElementById('welcome-popup');
    const welcomePopupClose = document.getElementById('welcome-popup-close');
    const welcomePopupCta = document.getElementById('welcome-popup-cta');

    if (welcomePopup && welcomePopupClose && welcomePopupCta && typeof welcomePopup.showModal === 'function') {
        const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let entrance;
        let closing = false;

        const navEntry = performance.getEntriesByType?.('navigation')?.[0];
        const isReload = navEntry ? navEntry.type === 'reload' : false;
        let alreadySeen = false;
        try {
            alreadySeen = sessionStorage.getItem('olimpo_welcome_seen') === '1';
        } catch {
            alreadySeen = false;
        }

        // Asegurar estado limpio en recargas o restauraciones desde bfcache
        const resetPopupState = () => {
            if (welcomePopup.open) welcomePopup.close();
            document.documentElement.classList.remove('welcome-popup-open');
            welcomePopup.style.opacity = '';
            welcomePopup.style.transform = '';
        };

        window.addEventListener('pageshow', (event) => {
            if (event.persisted) resetPopupState();
        });

        const closeWelcomePopup = (afterClose) => {
            if (closing || !welcomePopup.open) return;
            closing = true;
            entrance?.kill();
            const finish = () => {
                resetPopupState();
                closing = false;
                if (typeof afterClose === 'function') afterClose();
            };
            if (gsap && !motionPreference.matches) {
                gsap.to(welcomePopup, {
                    opacity: 0, y: 10, scale: 0.985,
                    duration: 0.18, ease: 'power2.in', overwrite: 'auto', onComplete: finish
                });
            } else {
                finish();
            }
        };

        welcomePopupClose.addEventListener('click', () => closeWelcomePopup());
        welcomePopup.addEventListener('cancel', (event) => {
            event.preventDefault();
            closeWelcomePopup();
        });
        welcomePopup.addEventListener('close', () => {
            document.documentElement.classList.remove('welcome-popup-open');
        });
        welcomePopup.addEventListener('click', (event) => {
            const bounds = welcomePopup.getBoundingClientRect();
            if (event.target === welcomePopup && (
                event.clientX < bounds.left || event.clientX > bounds.right ||
                event.clientY < bounds.top || event.clientY > bounds.bottom
            )) {
                closeWelcomePopup();
            }
        });
        welcomePopupCta.addEventListener('click', (event) => {
            event.preventDefault();
            closeWelcomePopup(() => {
                const graduationButton = document.querySelector('.event-btn[data-value="graduacion"]');
                graduationButton?.click();
                graduationButton?.focus({ preventScroll: true });
                window.location.hash = 'contacto';
                document.getElementById('contacto')?.scrollIntoView({
                    behavior: motionPreference.matches ? 'instant' : 'smooth', block: 'start'
                });
            });
        });

        if (!isReload && !alreadySeen) {
            try {
                sessionStorage.setItem('olimpo_welcome_seen', '1');
            } catch {
                // Ignorar si sessionStorage no está disponible
            }
            resetPopupState();
            welcomePopup.showModal();
            document.documentElement.classList.add('welcome-popup-open');
            if (gsap && !motionPreference.matches) {
                entrance = gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } });
                entrance.fromTo(welcomePopup,
                    { opacity: 0, y: 18, scale: 0.98 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.38, force3D: true, clearProps: 'opacity,transform' }
                ).fromTo(welcomePopup.querySelectorAll('.welcome-popup-image, .welcome-popup-footer'),
                    { opacity: 0, y: 8 },
                    { opacity: 1, y: 0, duration: 0.32, stagger: 0.06, clearProps: 'opacity,transform' },
                    0.06
                );
            }
        } else {
            resetPopupState();
        }
    }

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

    // Smooth anchor navigation (sin scroll-behavior: smooth en html para evitar saltos al recargar)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
                block: 'start'
            });
            history.pushState(null, '', href);
        });
    });

    // Scroll to top functionality
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
            });
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
                    b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
                    b.classList.add('border-outline-variant/50', 'text-on-surface-variant');
                });
                // Añadir estado activo al botón clickeado
                btn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
                btn.classList.remove('border-outline-variant/50', 'text-on-surface-variant');

                // Actualizar valor oculto para envío del form
                eventTypeInput.value = btn.getAttribute('data-value');
            });
        });
    }
    
    // Space Tabs functionality (animado con GSAP sin conflicto de CSS transition)
    const spaceTabs = document.querySelectorAll('.space-tab-btn');
    const spaceContents = document.querySelectorAll('.space-content');
    const spaceImages = document.querySelectorAll('.space-img');

    if (spaceTabs.length > 0) {
        spaceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-target');
                const targetContent = document.getElementById(target);
                const targetImg = document.getElementById('img-' + target);
                if (!targetContent || targetContent.classList.contains('active')) return;

                spaceTabs.forEach(t => {
                    t.classList.remove('active', 'bg-primary', 'text-white', 'shadow-md');
                    t.classList.add('bg-transparent', 'text-on-surface-variant', 'hover:text-on-background');
                });
                tab.classList.add('active', 'bg-primary', 'text-white', 'shadow-md');
                tab.classList.remove('bg-transparent', 'text-on-surface-variant', 'hover:text-on-background');

                spaceContents.forEach(c => {
                    c.classList.remove('active', 'opacity-100', 'z-10');
                    c.classList.add('opacity-0', 'z-0', 'pointer-events-none');
                });
                targetContent.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
                targetContent.classList.add('active', 'opacity-100', 'z-10');

                spaceImages.forEach(img => {
                    img.classList.remove('opacity-100');
                    img.classList.add('opacity-0', 'pointer-events-none');
                });
                if (targetImg) {
                    targetImg.classList.remove('pointer-events-none', 'opacity-0');
                    targetImg.classList.add('opacity-100');
                }

                if (gsap && !prefersReducedMotion.matches) {
                    gsap.fromTo(targetContent,
                        { opacity: 0, x: 14 },
                        { opacity: 1, x: 0, duration: 0.36, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' }
                    );
                    if (targetImg) {
                        gsap.fromTo(targetImg,
                            { opacity: 0, scale: 1.03 },
                            { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto', clearProps: 'transform' }
                        );
                    }
                }
            });
        });
    }

    // ==========================================
    // GALERÍA EDITORIAL: EXPANSIÓN Y LIGHTBOX
    // ==========================================
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
    const toggleBtn = document.getElementById('gallery-toggle-btn');
    const toggleText = document.getElementById('gallery-toggle-text');
    const toggleIcon = document.getElementById('gallery-toggle-icon');
    const countLabel = document.getElementById('gallery-count-label');

    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxThumbs = document.getElementById('lightbox-thumbs');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let isExpanded = false;
    let currentLightboxIndex = 0;

    const renderGallery = () => {
        if (!galleryGrid || galleryCards.length === 0) return;

        const showLimit = isExpanded ? galleryCards.length : 10;

        const newlyShown = [];
        galleryCards.forEach((card, index) => {
            const shouldShow = index < showLimit;
            const wasHidden = card.classList.contains('hidden');
            if (shouldShow) {
                card.classList.remove('hidden', 'gallery-extra');
                if (wasHidden) newlyShown.push(card);
            } else {
                card.classList.add('hidden');
            }
        });

        if (newlyShown.length > 0 && gsap && !prefersReducedMotion.matches) {
            gsap.fromTo(newlyShown,
                { opacity: 0, y: 18, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.028,
                    ease: 'power3.out',
                    force3D: true,
                    overwrite: 'auto',
                    clearProps: 'opacity,transform'
                }
            );
        }

        const visibleCount = Math.min(showLimit, galleryCards.length);
        if (countLabel) {
            countLabel.textContent = `Mostrando ${visibleCount} de ${galleryCards.length} fotografías`;
        }

        if (toggleBtn && toggleText && toggleIcon) {
            if (galleryCards.length <= 10) {
                toggleBtn.classList.add('hidden');
            } else {
                toggleBtn.classList.remove('hidden');
                toggleText.textContent = isExpanded
                    ? 'Mostrar selección destacada'
                    : `Explorar galería completa (${galleryCards.length})`;
                toggleIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            renderGallery();
        });
    }

    const updateLightboxSlide = (index) => {
        if (galleryCards.length === 0 || !lightboxImg) return;
        const total = galleryCards.length;
        currentLightboxIndex = (index + total) % total;
        const card = galleryCards[currentLightboxIndex];
        const img = card.querySelector('img');

        lightboxImg.src = img ? img.src : '';
        if (gsap && !prefersReducedMotion.matches) {
            gsap.fromTo(lightboxImg,
                { opacity: 0, scale: 0.97 },
                { opacity: 1, scale: 1, duration: 0.32, ease: 'power2.out', clearProps: 'opacity,transform' }
            );
        }
        if (lightboxCounter) {
            const curr = String(currentLightboxIndex + 1).padStart(2, '0');
            const tot = String(total).padStart(2, '0');
            lightboxCounter.textContent = `${curr} / ${tot}`;
        }

        if (lightboxThumbs) {
            const thumbs = lightboxThumbs.querySelectorAll('.gallery-lightbox-thumb');
            thumbs.forEach((thumb, idx) => {
                const isActive = idx === currentLightboxIndex;
                thumb.classList.toggle('active', isActive);
                if (isActive) {
                    thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            });
        }
    };

    const buildLightboxThumbs = () => {
        if (!lightboxThumbs) return;
        lightboxThumbs.innerHTML = '';
        galleryCards.forEach((card, idx) => {
            const img = card.querySelector('img');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'gallery-lightbox-thumb';
            btn.setAttribute('aria-label', `Ver foto ${idx + 1}`);
            const thumbImg = document.createElement('img');
            thumbImg.src = img ? img.src : '';
            thumbImg.alt = '';
            btn.appendChild(thumbImg);
            btn.addEventListener('click', () => updateLightboxSlide(idx));
            lightboxThumbs.appendChild(btn);
        });
    };

    const openLightbox = (card) => {
        if (!lightbox || typeof lightbox.showModal !== 'function') return;
        const startIndex = Math.max(0, galleryCards.indexOf(card));
        buildLightboxThumbs();
        updateLightboxSlide(startIndex);
        lightbox.showModal();
        document.documentElement.classList.add('welcome-popup-open');
    };

    const closeLightbox = () => {
        if (!lightbox || !lightbox.open) return;
        lightbox.close();
        document.documentElement.classList.remove('welcome-popup-open');
    };

    galleryCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('click', () => openLightbox(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(card);
            }
        });
    });

    if (lightbox) {
        lightboxClose?.addEventListener('click', closeLightbox);
        lightboxPrev?.addEventListener('click', () => updateLightboxSlide(currentLightboxIndex - 1));
        lightboxNext?.addEventListener('click', () => updateLightboxSlide(currentLightboxIndex + 1));
        lightbox.addEventListener('close', () => {
            document.documentElement.classList.remove('welcome-popup-open');
        });
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox || event.target.classList.contains('gallery-lightbox-stage')) {
                closeLightbox();
            }
        });
        lightbox.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                updateLightboxSlide(currentLightboxIndex - 1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                updateLightboxSlide(currentLightboxIndex + 1);
            }
        });

        let touchStartX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(deltaX) > 45) {
                updateLightboxSlide(currentLightboxIndex + (deltaX < 0 ? 1 : -1));
            }
        }, { passive: true });
    }

    renderGallery();

    // Fetch CMS Content
    fetch('/data/content.json')
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
                        const imgSrc = item.image.startsWith('/') ? item.image : `/${item.image}`;
                        const imgEl = galleryEl.querySelector('img');
                        if (imgEl) {
                            imgEl.src = imgSrc;
                        } else {
                            galleryEl.style.backgroundImage = `url(${imgSrc})`;
                            galleryEl.textContent = '';
                        }
                    }
                });
            }
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

    // ==========================================
    // MOTOR GSAP 60FPS (PC & MÓVIL)
    // ==========================================
    const gsapInstance = gsap;
    const allowMotion = Boolean(gsapInstance) && !prefersReducedMotion.matches;

    if (allowMotion) {
        gsapInstance.defaults({ ease: 'power3.out', overwrite: 'auto' });

        // 1. Hero Entrance (solo si el usuario está al inicio de la página)
        const heroImg = document.getElementById('cms-hero-image');
        const heroTargets = Array.from(document.querySelectorAll('.hero-reveal'));
        if (window.scrollY < 160) {
            if (heroImg) {
                gsapInstance.set(heroImg, { scale: 1.04 });
                heroImg.classList.remove('hero-zoom');
                gsapInstance.to(heroImg, { scale: 1, duration: 1.05, ease: 'power2.out', force3D: true, clearProps: 'transform' });
            }
            if (heroTargets.length > 0) {
                gsapInstance.set(heroTargets, { opacity: 0, y: 18 });
                heroTargets.forEach(el => el.classList.remove('hero-reveal'));
                gsapInstance.to(heroTargets, {
                    opacity: 1,
                    y: 0,
                    duration: 0.58,
                    stagger: 0.08,
                    force3D: true,
                    clearProps: 'opacity,transform'
                });
            }
        } else {
            heroImg?.classList.remove('hero-zoom');
            heroTargets.forEach(el => el.classList.remove('hero-reveal'));
        }

        const viewportFold = window.innerHeight * 0.92;

        // 2. Tarjetas de Servicios en grupo (stagger rápido sin lag)
        const servicesGrid = document.getElementById('services-grid');
        const serviceCards = servicesGrid ? Array.from(servicesGrid.querySelectorAll('.service-card')) : [];
        if (servicesGrid && serviceCards.length > 0) {
            serviceCards.forEach(c => c.classList.remove('animate-on-scroll'));
            if (servicesGrid.getBoundingClientRect().top > viewportFold) {
                gsapInstance.set(serviceCards, { opacity: 0, y: 22 });
                const servicesObserver = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) return;
                        gsapInstance.to(serviceCards, {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            stagger: 0.075,
                            force3D: true,
                            clearProps: 'opacity,transform'
                        });
                        obs.unobserve(entry.target);
                    });
                }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });
                servicesObserver.observe(servicesGrid);
            }
        }

        // 3. Bloques individuales .animate-on-scroll
        const animatedElements = Array.from(document.querySelectorAll('.animate-on-scroll'));
        const elementsToObserve = [];

        animatedElements.forEach(el => {
            if (el.getBoundingClientRect().top > viewportFold) {
                const isFadeIn = el.classList.contains('fade-in');
                gsapInstance.set(el, { opacity: 0, y: isFadeIn ? 0 : 20, scale: isFadeIn ? 0.985 : 1 });
                elementsToObserve.push(el);
            }
        });

        if (elementsToObserve.length > 0) {
            const scrollObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const target = entry.target;
                    gsapInstance.to(target, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.52,
                        force3D: true,
                        clearProps: 'opacity,transform'
                    });
                    obs.unobserve(target);
                });
            }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

            elementsToObserve.forEach(el => scrollObserver.observe(el));
        }

        // 4. Mosaico de Galería (lote inicial sin parpadeo previo)
        if (galleryGrid) {
            const initialCards = galleryCards.filter(card => !card.classList.contains('hidden'));
            if (galleryGrid.getBoundingClientRect().top > viewportFold && initialCards.length > 0) {
                gsapInstance.set(initialCards, { opacity: 0, y: 20, scale: 0.985 });
                const galleryObserver = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) return;
                        gsapInstance.to(initialCards, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.46,
                            stagger: 0.032,
                            force3D: true,
                            clearProps: 'opacity,transform'
                        });
                        obs.unobserve(entry.target);
                    });
                }, { rootMargin: '0px 0px -30px 0px', threshold: 0.05 });
                galleryObserver.observe(galleryGrid);
            }
        }
    }


    if (!allowMotion) {
        document.querySelectorAll('.hero-reveal').forEach(el => el.classList.remove('hero-reveal'));
        document.getElementById('cms-hero-image')?.classList.remove('hero-zoom');
    }

});
