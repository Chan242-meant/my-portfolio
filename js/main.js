/* ============================================
   Christian Portfolio - Main JavaScript
   All interactivity, animations, and utilities
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----- DOM References -----
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('overlay');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-links a');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-content img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-nav.prev');
  const lightboxNext = document.querySelector('.lightbox-nav.next');
  const lightboxCounter = document.querySelector('.lightbox-counter');
  const heroBg = document.querySelector('.hero-bg');
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');
  const contactForm = document.getElementById('contactForm');
  const scrollProgress = document.getElementById('scrollProgress');
  const preloader = document.getElementById('preloader');
  const statNumbers = document.querySelectorAll('.stat-number');
  const cards = document.querySelectorAll('.card, .project-card');
  const heroSection = document.querySelector('.hero');
  const heroTagline = document.querySelector('.hero-tagline');

  // ----- Parallax state -----
  let currentGalleryIndex = 0;
  let galleryImages = [];

  // ---------------------------------------------------------------
  // 0. PAGE PRELOADER
  // ---------------------------------------------------------------
  window.addEventListener('load', () => {
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 600);
      }, 400);
    }
  });

  // ---------------------------------------------------------------
  // 1. MOBILE MENU
  // ---------------------------------------------------------------
  function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    menuToggle.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu on nav link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  // Close menu on window resize past breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
      closeMenu();
    }
  });

  // ---------------------------------------------------------------
  // 2. ACTIVE NAV LINK
  // ---------------------------------------------------------------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // ---------------------------------------------------------------
  // 3. SMOOTH SCROLL for anchor links
  // ---------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------------------------------------------------------------
  // 4. SCROLL-TRIGGERED FADE-IN ANIMATIONS (Intersection Observer)
  // ---------------------------------------------------------------
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // Observe card children inside grids for staggered animation
  document.querySelectorAll('.card-grid, .projects-grid, .gallery-grid, .skills-grid, .stats-grid').forEach(grid => {
    const items = grid.children;
    Array.from(items).forEach((item, index) => {
      item.classList.add('fade-in');
      const delayClass = `stagger-${Math.min(index + 1, 6)}`;
      item.classList.add(delayClass);
      observer.observe(item);
    });
  });

  // ---------------------------------------------------------------
  // 5. BACK TO TOP
  // ---------------------------------------------------------------
  let lastScrollY = window.scrollY;

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
    lastScrollY = window.scrollY;
  }

  if (backToTop) {
    window.addEventListener('scroll', handleBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---------------------------------------------------------------
  // 6. SCROLL PROGRESS BAR
  // ---------------------------------------------------------------
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';
  }

  if (scrollProgress) {
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

  // ---------------------------------------------------------------
  // 7. PARALLAX
  // ---------------------------------------------------------------
  function handleParallax() {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    const section = heroBg.closest('.hero, .page-hero');
    if (!section) return;

    const heroRect = section.getBoundingClientRect();
    const isVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    if (isVisible) {
      const speed = 0.35;
      const yOffset = scrollY * speed;
      heroBg.style.transform = `translateY(${yOffset}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });
  handleParallax();

  // ---------------------------------------------------------------
  // 8. HERO FLOATING PARTICLES
  // ---------------------------------------------------------------
  function createParticles() {
    if (!heroSection) return;
    const particlesContainer = heroSection.querySelector('.hero-particles');
    if (!particlesContainer) return;

    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
      particle.style.animationDelay = (Math.random() * 5) + 's';
      particlesContainer.appendChild(particle);
    }
  }
  createParticles();

  // ---------------------------------------------------------------
  // 9. TYPING TEXT EFFECT
  // ---------------------------------------------------------------
  function typeText(element, text, speed = 40) {
    if (!element) return;
    element.textContent = '';
    const cursor = document.createElement('span');
    cursor.classList.add('typing-cursor');
    element.appendChild(cursor);

    let i = 0;
    function type() {
      if (i < text.length) {
        element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
        setTimeout(type, speed);
      } else {
        // Remove cursor after typing is done (with delay)
        setTimeout(() => {
          if (cursor.parentNode) cursor.remove();
        }, 2000);
      }
    }
    // Start typing after a short delay
    setTimeout(type, 800);
  }

  // Only apply typing effect on homepage hero
  if (heroTagline && heroSection) {
    const originalText = heroTagline.textContent.trim();
    // Use IntersectionObserver to trigger typing when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeText(heroTagline, originalText, 35);
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    heroObserver.observe(heroSection);
  }

  // ---------------------------------------------------------------
  // 10. ANIMATED STAT COUNTERS
  // ---------------------------------------------------------------
  function animateCounter(element, target, duration = 2000) {
    const isSuffix = target.match(/[^\d]/g);
    const suffix = isSuffix ? isSuffix.join('') : '';
    const numTarget = parseInt(target.replace(/[^\d]/g, ''), 10);
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(easeProgress * (numTarget - start) + start);
      element.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.textContent.trim();
          animateCounter(entry.target, target, 1800);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  // ---------------------------------------------------------------
  // 11. CARD TILT EFFECT
  // ---------------------------------------------------------------
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ---------------------------------------------------------------
  // 12. BUTTON RIPPLE EFFECT
  // ---------------------------------------------------------------
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--ripple-x', x + '%');
      btn.style.setProperty('--ripple-y', y + '%');
    });
  });

  // ---------------------------------------------------------------
  // 13. SCROLL HINT (Hero)
  // ---------------------------------------------------------------
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const nextSection = heroSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    // Hide scroll hint after scrolling
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollHint.style.opacity = '0';
        scrollHint.style.pointerEvents = 'none';
      } else {
        scrollHint.style.opacity = '1';
        scrollHint.style.pointerEvents = 'auto';
      }
    }, { passive: true });
  }

  // ---------------------------------------------------------------
  // 14. IMAGE LIGHTBOX GALLERY
  // ---------------------------------------------------------------
  function initGallery() {
    if (!galleryItems.length || !lightbox) return;

    galleryImages = Array.from(galleryItems).map(item => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || '';
      return {
        src: img ? img.getAttribute('data-full') || img.src : '',
        caption: caption
      };
    });

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  function openLightbox(index) {
    if (!lightbox || !galleryImages.length) return;
    currentGalleryIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    if (!galleryImages.length) return;
    currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  function updateLightboxImage() {
    if (!lightboxImg || !lightboxCounter) return;
    const item = galleryImages[currentGalleryIndex];
    if (item) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.caption || `Gallery image ${currentGalleryIndex + 1}`;
      lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
    }
  }

  // Lightbox event listeners
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
  }

  // ---------------------------------------------------------------
  // 15. CONTACT FORM
  // ---------------------------------------------------------------
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

          // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

            const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            showFormMessage('Thanks for reaching out! I\'ll get back to you soon.', 'success');
            contactForm.reset();
          } else {
            showFormMessage('Something went wrong. Please try again.', 'error');
          }
        })
        .catch(() => {
          showFormMessage('Something went wrong. Please try again.', 'error');
        })
        .finally(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
       
      setTimeout(() => {
        showFormMessage('Thanks for reaching out! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(msg, type) {
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = `form-message form-message--${type}`;
    el.textContent = msg;
    el.style.cssText = `
      padding: 0.85rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      animation: slide-in-msg 0.3s ease-out;
      ${type === 'success'
        ? 'background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #86efac;'
        : 'background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5;'
      }
    `;

    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(el, form);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, 5000);
  }

  // ---------------------------------------------------------------
  // 16. INITIALIZATION
  // ---------------------------------------------------------------
  initGallery();

  // Handle initial load for elements already in view
  setTimeout(() => {
    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, 100);
});

// Add slide-in animation keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in-msg {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(style);
/* ============================================
   Christian Portfolio - Main JavaScript
   All interactivity, animations, and utilities
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----- DOM References -----
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('overlay');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-links a');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-content img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-nav.prev');
  const lightboxNext = document.querySelector('.lightbox-nav.next');
  const lightboxCounter = document.querySelector('.lightbox-counter');
  const heroBg = document.querySelector('.hero-bg');
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');
  const contactForm = document.getElementById('contactForm');

  // ----- Parallax state -----
  let currentGalleryIndex = 0;
  let galleryImages = [];

  // ---------------------------------------------------------------
  // 1. MOBILE MENU
  // ---------------------------------------------------------------
  function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    menuToggle.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu on nav link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  // Close menu on window resize past breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
      closeMenu();
    }
  });

  // ---------------------------------------------------------------
  // 2. ACTIVE NAV LINK
  // ---------------------------------------------------------------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // ---------------------------------------------------------------
  // 3. SMOOTH SCROLL for anchor links
  // ---------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------------------------------------------------------------
  // 4. SCROLL-TRIGGERED FADE-IN ANIMATIONS (Intersection Observer)
  // ---------------------------------------------------------------
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // Observe card children inside grids for staggered animation
  document.querySelectorAll('.card-grid, .projects-grid, .gallery-grid, .skills-grid, .stats-grid').forEach(grid => {
    const items = grid.children;
    Array.from(items).forEach((item, index) => {
      item.classList.add('fade-in');
      const delayClass = `stagger-${Math.min(index + 1, 6)}`;
      item.classList.add(delayClass);
      observer.observe(item);
    });
  });

  // ---------------------------------------------------------------
  // 5. BACK TO TOP
  // ---------------------------------------------------------------
  let lastScrollY = window.scrollY;

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
    lastScrollY = window.scrollY;
  }

  if (backToTop) {
    window.addEventListener('scroll', handleBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---------------------------------------------------------------
  // 6. PARALLAX
  // ---------------------------------------------------------------
  function handleParallax() {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    const heroSection = heroBg.closest('.hero, .page-hero');
    if (!heroSection) return;

    const heroRect = heroSection.getBoundingClientRect();
    const isVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    if (isVisible) {
      const speed = 0.35;
      const yOffset = scrollY * speed;
      heroBg.style.transform = `translateY(${yOffset}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });
  // Initialize parallax on load
  handleParallax();

  // ---------------------------------------------------------------
  // 7. IMAGE LIGHTBOX GALLERY
  // ---------------------------------------------------------------
  function initGallery() {
    if (!galleryItems.length || !lightbox) return;

    galleryImages = Array.from(galleryItems).map(item => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || '';
      return {
        src: img ? img.getAttribute('data-full') || img.src : '',
        caption: caption
      };
    });

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  function openLightbox(index) {
    if (!lightbox || !galleryImages.length) return;
    currentGalleryIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    if (!galleryImages.length) return;
    currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  function updateLightboxImage() {
    if (!lightboxImg || !lightboxCounter) return;
    const item = galleryImages[currentGalleryIndex];
    if (item) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.caption || `Gallery image ${currentGalleryIndex + 1}`;
      lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
    }
  }

  // Lightbox event listeners
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
  }

  // ---------------------------------------------------------------
  // 8. CONTACT FORM
  // ---------------------------------------------------------------
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

           const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            showFormMessage('Thanks for reaching out! I\'ll get back to you soon.', 'success');
            contactForm.reset();
          } else {
            showFormMessage('Something went wrong. Please try again.', 'error');
          }
        })
        .catch(() => {
          showFormMessage('Something went wrong. Please try again.', 'error');
        })
        .finally(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(msg, type) {
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = `form-message form-message--${type}`;
    el.textContent = msg;
    el.style.cssText = `
      padding: 0.85rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      ${type === 'success'
        ? 'background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #86efac;'
        : 'background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5;'
      }
    `;

    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(el, form);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, 5000);
  }

  // ---------------------------------------------------------------
  // 9. INITIALIZATION
  // ---------------------------------------------------------------
  initGallery();

  // Handle initial load for elements already in view
  setTimeout(() => {
    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, 100);
});
