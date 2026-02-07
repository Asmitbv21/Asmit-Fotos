/**
 * Asmit Fotos — Interactions & smooth animations
 * Hero slider, gallery/testimonial carousels, theme toggle, scroll reveal, nav
 */

(function () {
  'use strict';

  // ---------- Hero Slider ----------
  // ---------- Hero Background Auto-Slider ----------
  const heroBgSlides = document.querySelectorAll('.hero-bg-slide');
  const HERO_AUTOPLAY_MS = 6000;
  let heroBgIndex = 0;

  function nextHeroBg() {
    if (!heroBgSlides.length) return;
    heroBgIndex = (heroBgIndex + 1) % heroBgSlides.length;
    heroBgSlides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === heroBgIndex);
    });
  }

  if (heroBgSlides.length > 1) {
    setInterval(nextHeroBg, HERO_AUTOPLAY_MS);
  }

  // ---------- Gallery (Featured Reels) Slider ----------
  const galleryViewport = document.querySelector('.gallery-viewport');
  const galleryTrack = document.querySelector('.gallery-track');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const galleryPrev = document.querySelector('.gallery-prev');
  const galleryNext = document.querySelector('.gallery-next');
  function updateGallerySlider(direction) {
    if (!galleryTrack) return;
    const scrollAmount = galleryTrack.offsetWidth * 0.8;
    galleryTrack.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }

  if (galleryPrev) galleryPrev.addEventListener('click', () => updateGallerySlider(-1));
  if (galleryNext) galleryNext.addEventListener('click', () => updateGallerySlider(1));

  // ---------- Testimonial Slider ----------
  const testimonialViewport = document.querySelector('.testimonial-viewport');
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialPrev = document.querySelector('.testimonial-prev');
  const testimonialNext = document.querySelector('.testimonial-next');
  function updateTestimonialSlider(direction) {
    if (!testimonialTrack) return;
    const scrollAmount = testimonialTrack.offsetWidth * 0.8;
    testimonialTrack.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }

  if (testimonialPrev) testimonialPrev.addEventListener('click', () => updateTestimonialSlider(-1));
  if (testimonialNext) testimonialNext.addEventListener('click', () => updateTestimonialSlider(1));

  // ---------- Theme Toggle ----------
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const html = document.documentElement;

  function getStoredTheme() {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch (_) {
      return 'dark';
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (_) { }
    themeToggles.forEach((toggle) => {
      toggle.setAttribute('aria-pressed', theme === 'dark');
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      const textEl = toggle.querySelector('.theme-toggle-text');
      if (textEl) {
        textEl.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
      }
    });
  }

  if (themeToggles.length) {
    const initial = getStoredTheme();
    setTheme(initial);
    themeToggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });
    });
  }

  // ---------- Mobile Nav Toggle ----------
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Multi-page nav: set active link from data-page ----------
  const navLinks = document.querySelectorAll('.site-nav a');
  const dataPage = document.body.getAttribute('data-page');
  if (dataPage) {
    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').replace(/^\//, '');
      const isHome = href === 'index.html' || href === '' || href === '/';
      link.classList.toggle('active', dataPage === 'home' ? isHome : href === dataPage + '.html');
    });
  }

  // ---------- Scroll Reveal (Intersection Observer) ----------
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // ---------- Header hide on scroll down, show on scroll up ----------
  // ---------- Lightbox ----------
  function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <button class="lightbox-toggle-info" aria-label="Toggle Image Details">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>
      <div class="lightbox-content">
        <img src="" alt="" class="lightbox-img">
        <div class="lightbox-info">
          <span class="lightbox-date"></span>
          <p class="lightbox-desc"></p>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxDate = lightbox.querySelector('.lightbox-date');
    const lightboxDesc = lightbox.querySelector('.lightbox-desc');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const toggleInfoBtn = lightbox.querySelector('.lightbox-toggle-info');
    const lightboxInfo = lightbox.querySelector('.lightbox-info');

    toggleInfoBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent closing lightbox on click
      lightbox.classList.toggle('info-visible');
    });

    function openLightbox(src, desc, date) {
      lightboxImg.src = src;
      lightbox.classList.add('is-open');
      lightboxDesc.textContent = desc || '';
      lightboxDate.textContent = date || '';

      // Hide info initially
      lightbox.classList.remove('info-visible');

      // Check if description exists to show button
      if (desc || date) {
        toggleInfoBtn.style.display = 'flex';
        // Auto-show info if requested, but user said "when user clicks"
      } else {
        toggleInfoBtn.style.display = 'none';
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    // Use delegation for ALL images in main content, excluding logos/icons
    document.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      // Ignore if not an image, or if it's a logo/icon/thumbnail inside special components
      if (!img) return;
      if (img.classList.contains('brand-logo')) return;
      if (img.hasAttribute('data-no-lightbox')) return;
      if (img.closest('.tool-card')) return; // Ignore tool logos
      if (img.closest('.hero-bg-slider')) return; // Ignore background slider

      e.stopPropagation();
      // Get metadata from parent or attributes
      const parent = img.closest('.gallery-item') || img.closest('.gallery-card') || img.closest('.service-modal-gallery');

      // Prioritize data attributes, fallback to alt text
      let desc = parent ? parent.getAttribute('data-desc') : img.getAttribute('data-desc');
      let date = parent ? parent.getAttribute('data-date') : img.getAttribute('data-date');

      // Fallback for non-gallery images (like Service details)
      if (!desc && img.alt) {
        desc = img.alt;
      }

      openLightbox(img.src, desc, date);
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target.closest('.lightbox-content')) return;
      closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }
  initLightbox();

  // ---------- Service Modal (Popup) ----------
  function initServiceModal() {
    // Create modal if not exists
    let modal = document.querySelector('.service-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'service-modal';
      modal.innerHTML = `
         <div class="service-modal-inner">
           <div class="service-modal-gallery">
             <!-- Images injected here -->
           </div>
           <div class="service-modal-content">
             <button class="service-close-btn" aria-label="Close modal">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 6L6 18M6 6l12 12"></path></svg>
             </button>
             <h2 class="service-modal-title"></h2>
             <p class="service-modal-desc"></p>
           </div>
         </div>
       `;
      document.body.appendChild(modal);
    }

    const titleEl = modal.querySelector('.service-modal-title');
    const descEl = modal.querySelector('.service-modal-desc');
    const galleryEl = modal.querySelector('.service-modal-gallery');
    const closeBtn = modal.querySelector('.service-close-btn');

    function openServiceModal(title, desc, images) {
      titleEl.textContent = title;
      descEl.innerHTML = desc; // Allow HTML in desc

      // Populate gallery
      galleryEl.innerHTML = images.map((src, i) =>
        `<img src="${src}" class="${i === 0 ? 'is-active' : ''}" alt="">`
      ).join('');

      // Start gallery loop if multiple images
      let activeIndex = 0;
      const imgs = galleryEl.querySelectorAll('img');
      if (imgs.length > 1) {
        // Clear previous interval if any (store on element)
        if (galleryEl.dataset.interval) clearInterval(galleryEl.dataset.interval);

        const interval = setInterval(() => {
          imgs[activeIndex].classList.remove('is-active');
          activeIndex = (activeIndex + 1) % imgs.length;
          imgs[activeIndex].classList.add('is-active');
        }, 3000);
        galleryEl.dataset.interval = interval;
      }

      modal.classList.add('is-open');
    }

    function closeServiceModal() {
      modal.classList.remove('is-open');
      if (galleryEl.dataset.interval) clearInterval(galleryEl.dataset.interval);
    }

    closeBtn.addEventListener('click', closeServiceModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeServiceModal();
    });

    // Attach to service cards
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        const shortDesc = card.querySelector('p').textContent;
        // Get specific details from hidden elements or attributes
        // For now, we'll use placeholder or look for a hidden detail div
        const detailImg = card.querySelector('.service-details img');
        const images = detailImg ? [detailImg.src] : ['assets/images/placeholder.png', 'assets/images/placeholder_dark.png'];

        // Enhanced description
        const fullDesc = `<p>${shortDesc}</p><p style="margin-top:1rem; opacity:0.8;">Contact us for a tailored package.</p>`;

        openServiceModal(title, fullDesc, images);
      });
    });
  }
  initServiceModal();

  // ---------- Before/After Comparison ----------
  // User provided logic for CSS variable based slider
  const compSliders = document.querySelectorAll('.compare-slider');
  compSliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
      const container = slider.closest('.compare-container');
      container.style.setProperty('--position', `${e.target.value}%`);
    });
  });

  // ---------- Smooth Image Loading ----------
  const images = document.querySelectorAll('img:not(.no-fade)');
  images.forEach(img => {
    // Start with opacity 0
    img.classList.add('lazy-load');

    const onImageLoaded = () => {
      img.classList.add('is-loaded');
    };

    if (img.complete) {
      // If cached, show immediately (slight delay for transition effect if desired, but 0 is better for UX)
      setTimeout(onImageLoaded, 50);
    } else {
      img.addEventListener('load', onImageLoaded);
      img.addEventListener('error', onImageLoaded);
    }
  });
  // ---------- Header hide/show logic ----------
  const siteHeader = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  const SCROLL_THRESHOLD = 80;

  function onScrollHeader() {
    const scrollY = window.scrollY;
    // Only trigger if scrolled past threshold
    if (scrollY > SCROLL_THRESHOLD) {
      siteHeader?.classList.add('scrolled');

      // If scrolling DOWN and past threshold -> Hide
      if (scrollY > lastScrollY) {
        siteHeader?.classList.add('hidden');
      }
      // If scrolling UP -> Show
      else {
        siteHeader?.classList.remove('hidden');
      }
    } else {
      // At top -> Show and remove background
      siteHeader?.classList.remove('scrolled', 'hidden');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', onScrollHeader, { passive: true });

  // ---------- Contact form ----------
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn?.textContent;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }
      // Simulate send — replace with real fetch to your backend
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
          btn.textContent = 'Sent! We’ll be in touch.';
        }
        this.reset();
      }, 1200);
    });
  }
})();
