document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  /* ====================== SITE-WIDE SCROLL REVEAL ====================== */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const REVEAL_TARGETS = [
    { sel: '.section-label',          cls: 'reveal reveal-up' },
    { sel: '.section-title',          cls: 'reveal reveal-up' },
    { sel: '.section-description',    cls: 'reveal reveal-up' },
    { sel: '.philosophy-signature',   cls: 'reveal reveal-up' },
    { sel: '.content-line',           cls: 'reveal reveal-line', skipInside: '.hero' },
    { sel: '.always-with-you-content', cls: 'reveal reveal-up' },
    { sel: '.feature-item',           cls: 'reveal reveal-up',   stagger: 0.09 },
    { sel: '.step-item',              cls: 'reveal reveal-up',   stagger: 0.12 },
    { sel: '.service-card',           cls: 'reveal reveal-up',   stagger: 0.08 },
    { sel: '.breeds-carousel-wrapper',cls: 'reveal reveal-zoom' }, /* Updated for single slider */
    { sel: '.contact-intro',          cls: 'reveal reveal-up' },
    { sel: '.info-item',              cls: 'reveal reveal-left', stagger: 0.08 },
    { sel: '.contact-shield',         cls: 'reveal reveal-zoom' },
    { sel: '.contact-form-wrap',      cls: 'reveal reveal-right' },
    { sel: '.closing-logo',           cls: 'reveal reveal-up' },
    { sel: '.closing-statements p',   cls: 'reveal reveal-up', stagger: 0.15 },
    { sel: '.closing-divider',        cls: 'reveal reveal-up' },
    { sel: '.footer-brand',           cls: 'reveal reveal-up' },
    { sel: '.footer-col',             cls: 'reveal reveal-up', stagger: 0.1 },
    { sel: '.footer-bottom',          cls: 'reveal reveal-up' }
  ];

  const toReveal = [];

  REVEAL_TARGETS.forEach(({ sel, cls, stagger, skipInside }) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (skipInside && el.closest(skipInside)) return; 
      if (el.classList.contains('reveal')) return;      

      el.classList.add(...cls.split(' '));

      if (stagger) {
        const siblings = Array.from(el.parentElement.children).filter(c => c.matches(sel));
        const i = siblings.indexOf(el);
        el.style.setProperty('--reveal-delay', (i * stagger).toFixed(2) + 's');
      }

      toReveal.push(el);
    });
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    toReveal.forEach(el => observer.observe(el));
  } else {
    toReveal.forEach(el => el.classList.add('is-visible'));
  }

  // Smooth scroll for nav items
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      // Close mobile menu if open
      if (navLinks) navLinks.classList.remove('active');

      const top = targetElement.getBoundingClientRect().top + window.scrollY;

      if (window.smoothScrollTo) {
        window.smoothScrollTo(top);
      } else {
        window.scrollTo({ top, behavior: 'smooth' }); 
      }
    });
  });
  
  /* ====================== BREEDS SLIDER ====================== */
  const track = document.getElementById('breedsTrack');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  
  if (track && leftArrow && rightArrow) {
    let currentIndex = 0;
    const slides = track.querySelectorAll('.breed-slide');
    const totalSlides = slides.length;

    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    rightArrow.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    });

    leftArrow.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    });
    
    // Swipe support for mobile
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, {passive: true});
    
    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
    }, {passive: true});
    
    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (diffX > 50) {
        // Swipe left (next slide)
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
      } else if (diffX < -50) {
        // Swipe right (prev slide)
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
      }
    });
  }
});
