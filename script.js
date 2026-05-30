/* ============================================================
   HERBAL TEAS – Premium Organic Tea Brand
   script.js | Complete Production JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   1. PRELOADER
   ============================================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    // Slight delay for a polished feel
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 900);
  });
})();


/* ============================================================
   2. AOS (Animate on Scroll) Initialisation
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      delay: 0,
    });
  }
});


/* ============================================================
   3. STICKY NAVBAR – scroll behaviour + active link tracking
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  if (!navbar) return;

  // Toggle scrolled class
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      const top    = sec.offsetTop - 100;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load
})();


/* ============================================================
   4. HAMBURGER MENU (mobile)
   ============================================================ */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();


/* ============================================================
   5. SMOOTH SCROLL for anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h') || '76');
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   6. COUNTER ANIMATION (Stats strip)
   ============================================================ */
(function initCounters() {
  const counters  = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value >= 1000
        ? value.toLocaleString('en-IN')
        : value.toString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target >= 1000
        ? target.toLocaleString('en-IN')
        : target.toString();
    }

    requestAnimationFrame(step);
  }

  // Use Intersection Observer so counters only run when visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();


/* ============================================================
   7. TESTIMONIALS SLIDER
   ============================================================ */
(function initTestimonialsSlider() {
  const slider   = document.getElementById('testimonialsSlider');
  const dotsWrap = document.getElementById('sliderDots');
  if (!slider || !dotsWrap) return;

  const cards       = slider.querySelectorAll('.testimonial-card');
  const total       = cards.length;
  let   current     = 0;
  let   autoTimer   = null;
  let   isAnimating = false;

  // Determine cards visible at once based on viewport
  function getVisible() {
    if (window.innerWidth > 900) return 3;
    if (window.innerWidth > 600) return 2;
    return 1;
  }

  let visible = getVisible();
  let maxIndex = Math.max(total - visible, 0);

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const dotCount = maxIndex + 1;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    if (isAnimating) return;
    isAnimating = true;
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0].offsetWidth + 28; // 28 = gap (1.8rem ≈ 28.8px)
    slider.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
    setTimeout(() => { isAnimating = false; }, 650);
  }

  // Exposed globally for inline onclick
  window.slideTestimonials = function (dir) {
    goTo(current + dir);
    resetAuto();
  };

  function autoSlide() {
    goTo(current < maxIndex ? current + 1 : 0);
  }

  function startAuto() { autoTimer = setInterval(autoSlide, 4800); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  // Swipe / touch support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      window.slideTestimonials(diff > 0 ? 1 : -1);
    }
  }, { passive: true });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    visible  = getVisible();
    maxIndex = Math.max(total - visible, 0);
    current  = Math.min(current, maxIndex);
    buildDots();
    updateDots();
    slider.style.transform = `translateX(-${current * (cards[0].offsetWidth + 28)}px)`;
  });

  // Init
  buildDots();
  startAuto();
})();


/* ============================================================
   8. ADD TO CART – product button feedback
   ============================================================ */
const cartToast = document.getElementById('cartToast');
let   toastTimer = null;

window.addToCart = function (btn) {
  // Button feedback
  const original = btn.innerHTML;
  btn.innerHTML  = '<i class="fas fa-check"></i> Added!';
  btn.classList.add('added');
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = original;
    btn.classList.remove('added');
    btn.disabled  = false;
  }, 2000);

  // Toast notification
  if (!cartToast) return;
  clearTimeout(toastTimer);
  cartToast.classList.add('show');
  toastTimer = setTimeout(() => {
    cartToast.classList.remove('show');
  }, 2800);
};


/* ============================================================
   9. NEWSLETTER FORM
   ============================================================ */
window.handleNewsletter = function (e) {
  e.preventDefault();
  const form  = e.target;
  const input = form.querySelector('input[type="email"]');
  const btn   = form.querySelector('button[type="submit"]');

  if (!input || !btn) return;

  const email = input.value.trim();
  if (!isValidEmail(email)) {
    shakeEl(input);
    return;
  }

  // Simulate API call
  btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Subscribing…';
  btn.disabled   = true;

  setTimeout(() => {
    btn.innerHTML   = '<i class="fas fa-check"></i> Subscribed!';
    input.value     = '';
    btn.style.background = 'linear-gradient(135deg,#c9a84c,#e8c97a)';
    btn.style.color      = '#1a3c2e';

    setTimeout(() => {
      btn.innerHTML       = 'Subscribe <i class="fas fa-paper-plane"></i>';
      btn.style.background = '';
      btn.style.color      = '';
      btn.disabled        = false;
    }, 3500);
  }, 1200);
};


/* ============================================================
   10. CONTACT FORM
   ============================================================ */
window.handleContact = function (e) {
  e.preventDefault();
  const form    = e.target;
  const name    = form.querySelector('#contact-name');
  const email   = form.querySelector('#contact-email');
  const message = form.querySelector('#contact-message');
  const btn     = form.querySelector('button[type="submit"]');

  if (!name || !email || !message || !btn) return;

  let valid = true;

  if (name.value.trim().length < 2) { shakeEl(name); valid = false; }
  if (!isValidEmail(email.value.trim())) { shakeEl(email); valid = false; }
  if (message.value.trim().length < 10) { shakeEl(message); valid = false; }

  if (!valid) return;

  // Simulate send
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled  = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#2d6a4f,#52b788)';
    form.reset();

    setTimeout(() => {
      btn.innerHTML       = originalText;
      btn.style.background = '';
      btn.disabled        = false;
    }, 3500);
  }, 1500);
};


/* ============================================================
   11. BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   12. PARALLAX effect on hero section
   ============================================================ */
(function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Only on non-touch devices (performance)
  const mq = window.matchMedia('(pointer: fine)');
  if (!mq.matches) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.25}px)`;
    }
  }, { passive: true });
})();


/* ============================================================
   13. COLLECTION CARD keyboard accessibility
   ============================================================ */
(function initCardKeyboard() {
  document.querySelectorAll('.collection-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('.overlay-btn');
        if (link) link.click();
      }
    });
  });
})();


/* ============================================================
   14. LAZY IMAGE REVEAL with IntersectionObserver
   ============================================================ */
(function initImageReveal() {
  const imgEls = document.querySelectorAll(
    '.collection-img, .product-img, .why-img, .about-img'
  );

  if (!('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'scale(1)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  imgEls.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'scale(1.04)';
    el.style.transition = 'opacity .8s ease, transform .8s ease';
    io.observe(el);
  });
})();


/* ============================================================
   15. MARQUEE PAUSE on hover
   ============================================================ */
(function initMarqueePause() {
  const marquee = document.querySelector('.marquee-inner');
  if (!marquee) return;
  marquee.addEventListener('mouseenter', () => {
    marquee.style.animationPlayState = 'paused';
  });
  marquee.addEventListener('mouseleave', () => {
    marquee.style.animationPlayState = 'running';
  });
})();


/* ============================================================
   16. PRODUCT CARD WISHLIST toggle
   ============================================================ */
(function initWishlist() {
  document.querySelectorAll('.quick-btn[aria-label="Add to wishlist"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const icon  = this.querySelector('i');
      const loved = icon.classList.toggle('fa-solid');
      if (loved) {
        icon.classList.remove('fa-regular');
        icon.style.color = '#ef4444';
      } else {
        icon.style.color = '';
      }
    });
  });
})();


/* ============================================================
   UTILITIES
   ============================================================ */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeEl(el) {
  el.style.animation = 'none';
  el.style.borderColor = '#ef4444';
  el.style.boxShadow   = '0 0 0 3px rgba(239,68,68,.2)';

  // Use a CSS keyframe-style shake via JS
  let start = null;
  const shakeAmounts = [0, -6, 6, -5, 5, -3, 3, 0];
  const duration     = 400;

  function animShake(timestamp) {
    if (!start) start = timestamp;
    const elapsed  = timestamp - start;
    const progress = elapsed / duration;
    const index    = Math.min(Math.floor(progress * shakeAmounts.length), shakeAmounts.length - 1);
    el.style.transform = `translateX(${shakeAmounts[index]}px)`;
    if (progress < 1) requestAnimationFrame(animShake);
    else {
      el.style.transform = '';
      setTimeout(() => {
        el.style.borderColor = '';
        el.style.boxShadow   = '';
      }, 1200);
    }
  }
  requestAnimationFrame(animShake);
}