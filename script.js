document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                if (navMenu && navToggle && navMenu.classList.contains('is-open')) {
                    navMenu.classList.remove('is-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('header');

    if (navToggle && navMenu && header) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll'); // Optional: prevent scrolling when menu is open
        });

        // Close nav menu on click outside
        document.addEventListener('click', (event) => {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target) && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Sticky header with shadow on scroll
    function handleScroll() {
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call on load to set initial state

    // Dynamic counter for hero stats
    const animateNumbers = () => {
        document.querySelectorAll('.stat-number').forEach(span => {
            const target = parseInt(span.getAttribute('data-target'));
            let current = 0;
            const duration = 1500; // milliseconds
            const increment = target / (duration / 10); // Adjust 10ms for smoother animation

            const updateCounter = () => {
                if (current < target) {
                    current = Math.min(current + increment, target);
                    span.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    span.textContent = target; // Ensure it ends on exact target
                }
            };
            updateCounter();
        });
    };

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('hero-stats')) {
                    animateNumbers();
                }
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to elements that should animate
    document.querySelectorAll('.hero-stats, .section, .service-card, .dest-card, .tour-card, .testimonial-card, .gallery-item').forEach(el => {
        if (!el.classList.contains('hero-stats')) { // Hero stats handled separately for number animation
            el.classList.add('fade-up');
        }
        observer.observe(el);
    });

    // Contact Form Validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let isValid = true;
            const formStatus = contactForm.querySelector('.form-status');
            const submitBtn = contactForm.querySelector('.btn-submit');

            formStatus.textContent = '';
            formStatus.classList.remove('success', 'error-msg');

            // Simple validation for required fields
            ['name', 'email', 'message'].forEach(fieldName => {
                const input = contactForm.querySelector(`[name="${fieldName}"]`);
                const errorDiv = input.nextElementSibling; // Assuming error div is right after input
                if (!input.value.trim()) {
                    input.classList.add('error');
                    errorDiv.textContent = `${input.previousElementSibling.textContent.replace(' *', '')} tidak boleh kosong.`;
                    isValid = false;
                } else {
                    input.classList.remove('error');
                    errorDiv.textContent = '';
                }
            });

            // Email format validation
            const emailInput = contactForm.querySelector('[name="email"]');
            const emailErrorDiv = emailInput.nextElementSibling;
            if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                emailInput.classList.add('error');
                emailErrorDiv.textContent = 'Format email tidak valid.';
                isValid = false;
            }

            if (!isValid) {
                formStatus.classList.add('error-msg');
                formStatus.textContent = 'Mohon periksa kembali input Anda.';
                // Focus on the first invalid field
                contactForm.querySelector('.form-group .error')?.closest('.form-group').querySelector('input, textarea, select').focus();
                return;
            }

            submitBtn.classList.add('is-loading');
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const success = Math.random() > 0.1; // 90% success rate

            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');

            if (success) {
                formStatus.classList.add('success');
                formStatus.textContent = 'Pesan Anda berhasil terkirim! Kami akan segera menghubungi Anda.';
                contactForm.reset();
            } else {
                formStatus.classList.add('error-msg');
                formStatus.textContent = 'Terjadi kesalahan saat mengirim pesan. Mohon coba lagi.';
            }
        });
    }
});
