/* ═══════════════════════════════════════════════════════════
   TECH TEAM INDIA — INTERACTIVITY
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────── THEME TOGGLE (persisted) ──────── */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  const savedTheme = localStorage.getItem('tti-theme');
  if (savedTheme === 'light') {
    root.classList.remove('dark');
  } else if (savedTheme === 'dark') {
    root.classList.add('dark');
  } else {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (prefersLight) root.classList.remove('dark');
  }

  themeToggle?.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('tti-theme', root.classList.contains('dark') ? 'dark' : 'light');
    refreshIcons();
  });

  /* ──────── NAVBAR SCROLL STATE ──────── */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 20);
    backToTop?.classList.toggle('show', y > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ──────── MOBILE MENU ──────── */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMenu = () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
  };

  const openMenu = () => {
    menuToggle?.setAttribute('aria-expanded', 'true');
    mobileMenu?.classList.add('open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* Close menu on resize to desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeMenu();
  });

  /* ──────── ACTIVE NAV LINK (scroll spy) ──────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((s) => spy.observe(s));

  /* ──────── SCROLL REVEAL ──────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 60);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  /* ──────── FAQ ACCORDION (one open at a time) ──────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ──────── CONTACT FORM (validation + mailto) ──────── */
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  const showToast = (msg, type = 'success') => {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.borderColor = type === 'error' ? 'var(--error)' : 'var(--border-accent)';
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 3600);
  };

  const setError = (field, msg) => {
    const wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.toggle('error', Boolean(msg));
    const errEl = wrap.querySelector('.field-error');
    if (errEl) errEl.textContent = msg || '';
  };

  const validate = () => {
    const name = form.name;
    const email = form.email;
    const message = form.message;
    let ok = true;

    if (!name.value.trim() || name.value.trim().length < 2) {
      setError(name, 'Please enter your name (2+ characters).');
      ok = false;
    } else setError(name, '');

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRx.test(email.value.trim())) {
      setError(email, 'Please enter a valid email address.');
      ok = false;
    } else setError(email, '');

    if (!message.value.trim() || message.value.trim().length < 10) {
      setError(message, 'Message must be at least 10 characters.');
      ok = false;
    } else setError(message, '');

    return ok;
  };

  /* Live-clear errors on input */
  form?.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.closest('.field')?.classList.contains('error')) {
        setError(input, '');
      }
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Website Inquiry — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n—\nSent from Tech Team India website`
    );

    window.location.href = `mailto:techteamindia26@gmail.com?subject=${subject}&body=${body}`;

    showToast('Opening your email client…');
    form.reset();
  });

  /* ──────── LUCIDE ICONS (refresh after theme change etc.) ──────── */
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /* Wait for lucide script + fonts before initializing */
  const init = () => {
    refreshIcons();
    /* Second pass in case of async font loading shifting layout */
    setTimeout(refreshIcons, 300);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', refreshIcons);
})();