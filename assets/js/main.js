// AYINI India — main.js
document.addEventListener('DOMContentLoaded', () => {

  /* Loader */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hide'), 350);
  });

  /* Sticky header shrink */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    const toTop = document.querySelector('.float-btn.totop');
    if (toTop) {
      if (window.scrollY > 500) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  const navToggle = document.querySelector('.nav-toggle');
  const navDesktop = document.querySelector('.nav-desktop');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navDesktop.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navDesktop.classList.contains('open'));
    });
    navDesktop.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navDesktop.classList.remove('open')));
  }

  /* Back to top */
  const toTopBtn = document.querySelector('.float-btn.totop');
  if (toTopBtn) toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* Stagger index for children */
  document.querySelectorAll('.reveal-stagger').forEach(group => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', i));
  });

  /* Compliance thread trigger */
  document.querySelectorAll('.thread-wrap').forEach(el => io.observe(el));
  const threadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
  }, { threshold: 0.25 });
  document.querySelectorAll('.thread-wrap').forEach(el => threadObserver.observe(el));

  /* Animated counters */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  /* Button ripple */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* Visitor counter — demo mode via localStorage, backend-ready */
  try {
    const todayKey = 'ayini_visits_' + new Date().toISOString().slice(0, 10);
    const totalKey = 'ayini_total_visits';
    const sessionKey = 'ayini_session_counted';

    if (!sessionStorage.getItem(sessionKey)) {
      const today = parseInt(localStorage.getItem(todayKey) || '0', 10) + 1;
      const total = parseInt(localStorage.getItem(totalKey) || '0', 10) + 1;
      localStorage.setItem(todayKey, today);
      localStorage.setItem(totalKey, total);
      sessionStorage.setItem(sessionKey, '1');
    }

    const todayEl = document.getElementById('visitor-today');
    const totalEl = document.getElementById('visitor-total');
    if (todayEl) todayEl.textContent = localStorage.getItem(todayKey) || '1';
    if (totalEl) totalEl.textContent = localStorage.getItem(totalKey) || '1';

    // NOTE (backend-ready): replace the localStorage demo above with a fetch()
    // call to your analytics endpoint, e.g.:
    // fetch('/api/visitors').then(r => r.json()).then(data => { ... });
  } catch (e) { /* storage unavailable — fail silently */ }

  /* Current year in footer */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
