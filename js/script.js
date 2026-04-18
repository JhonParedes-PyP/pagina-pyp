/* ============================================
   PRADA & PAREDES - Script Principal
   ============================================ */

(function () {
    'use strict';

    /* ===== NAVBAR: scroll effect ===== */
    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // run on load

    /* ===== NAVBAR: active link on scroll ===== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function updateActiveNavLink() {
        const scrollY = window.scrollY + 100;
        sections.forEach(function (section) {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });

    /* ===== HAMBURGER MENU ===== */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', function () {
        const isOpen = mobileMenu.classList.contains('open');
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.mobile-link').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    /* ===== SMOOTH SCROLL ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 78;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ===== SCROLL REVEAL ===== */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ===== CONTACT FORM ===== */
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const phone   = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !phone || !message) {
                showFormError('Por favor complete todos los campos requeridos (*).');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showFormError('Por favor ingrese un correo electrónico válido.');
                return;
            }

            // Simulate sending (replace with actual backend/service integration)
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            setTimeout(function () {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Consulta';
                formSuccess.style.display = 'flex';

                // Hide success message after 7 seconds
                setTimeout(function () {
                    formSuccess.style.display = 'none';
                }, 7000);
            }, 1600);
        });
    }

    function showFormError(msg) {
        const existing = form.querySelector('.form-error-msg');
        if (existing) existing.remove();

        const error = document.createElement('p');
        error.className = 'form-error-msg';
        error.style.cssText = 'color:#c0392b;font-size:0.87rem;margin-top:10px;padding:10px 14px;background:rgba(192,57,43,0.08);border:1px solid rgba(192,57,43,0.3);border-radius:8px;';
        error.textContent = msg;
        form.appendChild(error);

        setTimeout(function () {
            if (error.parentNode) error.remove();
        }, 5000);
    }

    /* ===== ANIMATED COUNTERS (Hero Stats) ===== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounter(el) {
        const text = el.textContent;
        const prefix = text.startsWith('+') ? '+' : '';
        const suffix = text.endsWith('%') ? '%' : '';
        const target = parseInt(text.replace(/[^0-9]/g, ''), 10);

        if (isNaN(target)) return;

        let current = 0;
        const duration = 1800;
        const steps = 50;
        const increment = target / steps;
        const interval = duration / steps;

        const timer = setInterval(function () {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = prefix + Math.floor(current) + suffix;
        }, interval);
    }

    if ('IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !countersStarted) {
                        countersStarted = true;
                        statNumbers.forEach(animateCounter);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) heroObserver.observe(heroStats);
    }

})();
