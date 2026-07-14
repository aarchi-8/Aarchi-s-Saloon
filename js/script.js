document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-loading');
  const mouseGlow = document.querySelector('.mouse-glow');
  const heroSlides = document.querySelectorAll('[data-hero-slideshow] .hero-slide');
  const counterElements = document.querySelectorAll('[data-counter]');
  const bookingWidget = document.getElementById('bookingWidget');
  const bookingToggle = document.querySelector('.booking-widget-toggle');

  const initAos = () => {
    if (window.AOS) {
      AOS.init({
        duration: 900,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
      });
    }
  };

  const setupHeroSlideshow = () => {
    if (!heroSlides.length) return;
    let currentIndex = 0;

    setInterval(() => {
      heroSlides[currentIndex].classList.remove('is-active');
      currentIndex = (currentIndex + 1) % heroSlides.length;
      heroSlides[currentIndex].classList.add('is-active');
    }, 4500);
  };

  const animateCounter = (element) => {
    const target = parseFloat(element.dataset.count || '0');
    const suffix = element.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = target >= 10 ? Math.round(target * progress) : (target * progress).toFixed(target % 1 === 0 ? 0 : 1);
      element.textContent = `${value}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const setupCounters = () => {
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counterElements.forEach((element) => observer.observe(element));
  };

  const setupBookingWidget = () => {
    if (!bookingWidget || !bookingToggle) return;
    bookingWidget.classList.add('is-collapsed');
    bookingToggle.setAttribute('aria-expanded', 'false');
    bookingToggle.addEventListener('click', () => {
      const isExpanded = bookingWidget.classList.toggle('is-expanded');
      bookingWidget.classList.toggle('is-collapsed', !isExpanded);
      bookingToggle.setAttribute('aria-expanded', String(isExpanded));
    });
  };

  const setupMouseGlow = () => {
    if (!mouseGlow) return;
    window.addEventListener('mousemove', (event) => {
      mouseGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    });
  };

  const setupParallax = () => {
    const parallaxTargets = document.querySelectorAll('.hero-float');
    if (!parallaxTargets.length) return;

    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.06;
      parallaxTargets.forEach((target, index) => {
        const multiplier = index % 2 === 0 ? 1 : -1;
        target.style.transform = `translateY(${offset * multiplier}px)`;
      });
    }, { passive: true });
  };

  const updateActiveNav = () => {
    const sections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...document.querySelectorAll('.navbar .nav-link')];
    let currentId = 'home';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 160 && rect.bottom >= 160) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
    });
  };

  const setupPortfolioFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    const highlights = document.querySelectorAll('.portfolio-item.portfolio-highlight');

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        items.forEach((item) => {
          item.classList.remove('active-filter');
          
          if (filter === 'all') {
            // Show highlights only when "All" is selected
            if (item.classList.contains('portfolio-highlight')) {
              item.classList.add('active-filter');
            }
          } else {
            // Show all items matching the filter
            if (item.dataset.category === filter) {
              item.classList.add('active-filter');
            }
          }
        });
      });
    });

    // Initialize with highlights visible
    highlights.forEach((item) => {
      item.classList.add('active-filter');
    });
  };

  const setupLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeButton = document.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('[data-lightbox]');

    const close = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        lightboxImage.src = trigger.dataset.lightbox;
        lightboxImage.alt = trigger.dataset.title || 'Portfolio preview';
        lightboxCaption.textContent = trigger.dataset.title || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    closeButton.addEventListener('click', close);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  };

  const setupBeforeAfter = () => {
    document.querySelectorAll('[data-before-after]').forEach((card) => {
      const range = card.querySelector('.before-after-range');
      const afterLayer = card.querySelector('[data-after-layer]');

      const sync = () => {
        afterLayer.style.clipPath = `inset(0 ${100 - range.value}% 0 0)`;
        card.style.setProperty('--position', `${range.value}%`);
      };

      range.addEventListener('input', sync);
      sync();
    });
  };

  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const collapse = document.querySelector('.navbar-collapse.show');
        if (collapse && window.bootstrap) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
          bsCollapse.hide();
        }
      });
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('load', () => {
    document.body.classList.remove('is-loading');
    initAos();
    updateActiveNav();
  });

  setupHeroSlideshow();
  setupCounters();
  setupBookingWidget();
  setupMouseGlow();
  setupParallax();
  setupPortfolioFilters();
  setupLightbox();
  setupBeforeAfter();
  setupSmoothScroll();
  updateActiveNav();
});
