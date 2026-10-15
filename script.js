/**
 * NEEL AGRAWAL — THE DIGITAL WORKSHOP JAVASCRIPT ENGINE
 * Signature Interactive Node-and-Connection Canvas, Category Filter,
 * Case Study Modal Quick-View, Accessible Mobile Drawer, and Telemetry.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC COPYRIGHT YEAR
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // 2. MOBILE DRAWER NAVIGATION
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (navToggle && mobileDrawer) {
    const toggleDrawer = (isOpen) => {
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.classList.toggle('open', isOpen);
      mobileDrawer.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.contains('open');
      toggleDrawer(!isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleDrawer(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleDrawer(false);
        navToggle.focus();
      }
    });
  }

  // 3. STICKY NAVBAR SCROLL ELEVATION
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // 4. ACTIVE SECTION INTERSECTION OBSERVER
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
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
  }, { rootMargin: '-25% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  // 5. SIGNATURE INTERACTION: INTERCONNECTED SYSTEMS CANVAS
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    // Resize handling
    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }, { passive: true });

    // Node particles
    const particleCount = window.innerWidth < 768 ? 22 : 44;
    const particles = [];
    const maxDistance = 140;

    const mouse = { x: -9999, y: -9999, radius: 160 };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1.5;
        this.isAccent = Math.random() > 0.8; // 20% accent lime nodes
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle mouse influence
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isAccent ? '#CEFF1A' : '#111216';
        ctx.globalAlpha = this.isAccent ? 0.9 : 0.45;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let isVisible = true;
    const canvasObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    canvasObserver.observe(canvas);

    function animate() {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
              const alpha = (1 - dist / maxDistance) * 0.22;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = '#111216';
              ctx.globalAlpha = alpha;
              ctx.lineWidth = 1;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        }

        // Draw and update particles
        particles.forEach(p => {
          p.update();
          p.draw();
        });
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // 6. PROJECT CATEGORY FILTER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // 7. PROJECT QUICK-VIEW MODAL DATA & HANDLER
  const projectData = {
    'truthlence': {
      title: 'Truthlence: Real-Time AI Deepfake Detection & Trust',
      badge: 'Spotlight Project // Active Prototyping',
      role: 'Lead AI Vision Pipeline Architect',
      stack: 'Python, OpenCV, TensorFlow, NumPy, MediaPipe',
      pitch: 'An AI-powered video integrity platform engineered to expose facial manipulation, synthetic lip-sync anomalies, and generative artifacts in digital video streams.',
      problem: 'Generative deepfakes undermine digital identity verification and media trust. Current verification tools are heavy cloud black boxes unsuitable for rapid verification.',
      solution: 'Truthlence uses spatial landmark tracking, MediaPipe 468-point facial mesh analysis, and FFT spectral anomaly detection to compute confidence heatmaps in real-time.',
      status: 'In active research and prototyping during 2026. Core video extraction and benchmark scripts validated offline.',
      caseStudyUrl: 'projects/truthlence.html',
      githubUrl: 'https://github.com/buildwithneel'
    },
    'garuda-ai': {
      title: 'Garuda AI: Insider Threat Detection Platform',
      badge: '🏆 Top 20 Team // FinSpark \'26 National Hackathon',
      role: 'Data Pipeline & Anomaly Scoring Logic (Team Collaboration)',
      stack: 'Python, Pandas, NumPy, Scikit-Learn, Security Logs',
      pitch: 'A machine learning-driven security platform designed to identify malicious internal activity, unauthorized privilege escalation, and abnormal data exfiltration.',
      problem: 'Authorized users with verified credentials can silently compromise sensitive corporate data without triggering traditional perimeter firewall rules.',
      solution: 'Implements UEBA (User and Entity Behavior Analytics) using Isolation Forest and statistical deviation models to flag high-entropy behavior without inundating analysts with false alarms.',
      status: 'Conceived and prototyped at FinSpark \'26, earning our team selection into the Top 20 teams nationwide. Source code maintained on GitHub.',
      caseStudyUrl: 'projects/garuda-ai.html',
      githubUrl: 'https://github.com/buildwithneel/insider-threat-detection'
    },
    'anvesha': {
      title: 'Anvesha: Autonomous Railway CCTV Computer Vision',
      badge: 'Smart India Hackathon (SIH) Institute Selection',
      role: 'Computer Vision Pipeline & Density Logic',
      stack: 'Python, OpenCV, Computer Vision, NumPy, RTSP Feeds',
      pitch: 'An intelligent surveillance engine designed to run over existing railway station CCTV networks, detecting hazardous crowd surge densities and platform bottlenecks.',
      problem: 'Railway platform surges and stampede hazards occur abruptly during train delays. Human control-room operators cannot continuously track dozens of screens simultaneously.',
      solution: 'Ingests RTSP video streams, performs perspective transformation to calibrate metric meters-squared coordinates, and triggers automatic alert thresholds when crowd density exceeds safe parameters.',
      status: 'Developed as a solution for an internal institute-level SIH problem statement at CHARUSAT. Verified proof-of-concept prototype.',
      caseStudyUrl: 'projects/anvesha.html',
      githubUrl: 'https://github.com/buildwithneel/ANVESHA'
    },
    'saarthi-ai': {
      title: 'Saarthi AI: Accessible Student Guidance & Counselling',
      badge: 'Hackathon Concept Prototype',
      role: 'Concept Design & Prompt Guardrails',
      stack: 'Python, Natural Language Processing, Web APIs',
      pitch: 'An AI-assisted student companion platform designed to offer confidential, stigma-free academic and emotional guidance with automatic crisis helplines.',
      problem: 'College students face overwhelming academic isolation and anxiety but avoid seeking campus counselling due to social stigma or scheduling friction.',
      solution: 'Built empathetic conversational coaching with strict trigger-word guardrails that automatically surfaces emergency helpline contacts when acute crisis signals appear.',
      status: 'Early-stage hackathon concept prototype exploring ethical AI in mental wellness.',
      caseStudyUrl: 'projects/saarthi-ai.html',
      githubUrl: 'https://github.com/buildwithneel/saarthiai'
    },
    'ghost-chat': {
      title: 'Ghost Chat: Zero-Identity Ephemeral Web Chat',
      badge: 'Privacy Experiment // Web Systems',
      role: 'Full-Stack Prototype Developer',
      stack: 'JavaScript, WebSockets, HTML5, CSS3',
      pitch: 'An experimental communication architecture built around zero user identifiers, peer-room ephemeral states, and memory-only storage.',
      problem: 'Everyday communication apps harvest phone numbers, sync contact books, and leave permanent server-side trails for even temporary ad-hoc chats.',
      solution: 'Rooms are formed through disposable session keys; messages exist only in RAM during the active session and vanish completely upon tab closure.',
      status: 'Experimental sandbox project exploring zero-trace web communication.',
      caseStudyUrl: 'projects/ghost-chat.html',
      githubUrl: 'https://github.com/buildwithneel/Ghostchat'
    },
    'gps-timer': {
      title: 'GPS-Based Context Timer',
      badge: '⚡ Currently Building',
      role: 'Lead Developer',
      stack: 'Python, Geolocation APIs, Automation',
      pitch: 'A location-aware timing system that triggers context-sensitive actions and reminders based on GPS geographic coordinates.',
      problem: 'Standard timers operate purely on clock ticks, ignoring the user’s physical environment and transit status.',
      solution: 'Combines coordinate geofencing with time triggers to automate contextual routines when arriving or departing designated zones.',
      status: 'Active ongoing development exploring context-aware automation.',
      caseStudyUrl: '#projects',
      githubUrl: 'https://github.com/buildwithneel'
    },
    'cloud-workspace': {
      title: 'Cloud Coding Workspace',
      badge: '⚡ Currently Building',
      role: 'System Architect',
      stack: 'Cloud Sandbox, Containerization, Web IDE',
      pitch: 'A lightweight browser-based coding environment allowing instant programming experiments without local toolchain installation.',
      problem: 'Setting up programming runtimes creates high friction for beginners and lightweight device users.',
      solution: 'Provides ephemeral containerized runtimes accessible via any modern browser with instant code execution.',
      status: 'Early architectural design and prototyping.',
      caseStudyUrl: '#projects',
      githubUrl: 'https://github.com/buildwithneel'
    }
  };

  const modalOverlay = document.getElementById('quick-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalBadge = document.getElementById('modal-badge');
  const modalRole = document.getElementById('modal-role');
  const modalStack = document.getElementById('modal-stack');
  const modalProblem = document.getElementById('modal-problem');
  const modalSolution = document.getElementById('modal-solution');
  const modalStatus = document.getElementById('modal-status');
  const modalCsLink = document.getElementById('modal-cs-link');
  const modalGhLink = document.getElementById('modal-gh-link');

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-project');
      const data = projectData[key];
      if (!data || !modalOverlay) return;

      modalTitle.textContent = data.title;
      modalBadge.textContent = data.badge;
      modalRole.textContent = data.role;
      modalStack.textContent = data.stack;
      modalProblem.textContent = data.problem;
      modalSolution.textContent = data.solution;
      modalStatus.textContent = data.status;

      if (modalCsLink) {
        modalCsLink.href = data.caseStudyUrl;
        modalCsLink.style.display = data.caseStudyUrl.startsWith('projects/') ? 'inline-flex' : 'none';
      }

      if (modalGhLink) {
        modalGhLink.href = data.githubUrl;
      }

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (modalClose) modalClose.focus();
    });
  });

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // 8. COPY EMAIL TO CLIPBOARD WITH TOAST FEEDBACK
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyToast = document.getElementById('copy-toast');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'neelag0804@gmail.com';

      navigator.clipboard.writeText(email).then(() => {
        showToast('Copied: ' + email);
      }).catch(() => {
        showToast('Email: ' + email);
      });
    });
  }

  function showToast(message) {
    if (!copyToast) return;
    copyToast.textContent = message;
    copyToast.classList.add('show');
    setTimeout(() => {
      copyToast.classList.remove('show');
    }, 3200);
  }

  // 9. VERIFIED CONTACT FORM DISPATCHER
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const honeypot = document.getElementById('hp-field');
      if (honeypot && honeypot.value !== '') {
        // Spam bot caught
        return;
      }

      const senderName = document.getElementById('sender-name').value.trim();
      const senderEmail = document.getElementById('sender-email').value.trim();
      const messageBody = document.getElementById('sender-message').value.trim();

      if (!senderName || !senderEmail || !messageBody) {
        if (formFeedback) {
          formFeedback.textContent = 'Please fill out all required fields.';
          formFeedback.style.color = '#FF7070';
        }
        return;
      }

      // Generate pre-filled mailto dispatch for guaranteed delivery
      const mailSubject = encodeURIComponent(`Portfolio Inquiry from ${senderName}`);
      const mailBody = encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${messageBody}`);
      const mailtoUrl = `mailto:neelag0804@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      if (formFeedback) {
        formFeedback.textContent = 'Opening your email client to dispatch message...';
        formFeedback.style.color = '#CEFF1A';
      }

      // Open mail client
      window.location.href = mailtoUrl;

      setTimeout(() => {
        if (formFeedback) {
          formFeedback.textContent = 'Thank you! If your email client did not launch, reach out directly at neelag0804@gmail.com';
        }
        contactForm.reset();
      }, 2000);
    });
  }
});
