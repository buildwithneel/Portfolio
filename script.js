/**
 * NEEL AGRAWAL PERSONAL PORTFOLIO - JAVASCRIPT LOGIC
 * Features: Mobile Nav Drawer, Active Section Observer, Scroll Reveal, Dynamic Viewport Height
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentYearSpan = document.getElementById('current-year');

  // 1. Dynamic Viewport Unit Calculation for Mobile Browsers
  const updateDynamicViewport = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  updateDynamicViewport();
  window.addEventListener('resize', updateDynamicViewport);
  window.addEventListener('orientationchange', updateDynamicViewport);

  // 2. Update Footer Copyright Year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 3. Mobile Navigation Toggle & Scroll Lock
  if (navToggle && navMenu) {
    const closeMobileMenu = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    };

    const openMobileMenu = () => {
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.classList.add('open');
      navMenu.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scroll on mobile
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
        navToggle.focus();
      }
    });

    // Close menu on backdrop tap / outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  // 4. Navbar Scroll Shadow & Blur Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // 5. Scroll Active Section Observer
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -55% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // 6. Scroll Reveal Micro-Animations (Mobile Optimized)
  const revealElements = document.querySelectorAll('.about-card, .attribute-card, .education-card, .skill-category-card, .project-card, .achievement-card, .contact-card, .contact-info-card');

  // Apply initial fade style for reveal
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  // Respect user motion preferences
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
});
