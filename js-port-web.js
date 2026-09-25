/* =============================================================
   Kervein Kyle P. Santos — Portfolio
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- GitHub contribution calendar ---------- */
  const contributionGrid = document.querySelector('.contribution-grid');
  if (contributionGrid) {
    const contributionLevels = {
      '51-1': 'level-1',
      '51-3': 'level-3',
      '51-4': 'level-3',
      '52-3': 'level-3',
      '52-4': 'level-3'
    };

    contributionGrid.replaceChildren();
    for (let week = 1; week <= 52; week++) {
      for (let day = 0; day < 7; day++) {
        const cell = document.createElement('span');
        const level = contributionLevels[`${week}-${day}`];
        if (level) cell.className = level;
        contributionGrid.appendChild(cell);
      }
    }
  }

  /* ---------- Sticky header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const setActiveLink = () => {
    let current = sections[0]?.id;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) current = section.id;
    });

    navAnchors.forEach(a => {
      a.classList.toggle('active-link', a.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Typing effect in hero terminal ---------- */
  const typedEl = document.getElementById('typedRole');
  const roles = ['"Web Developer"', '"Front-End Developer"', '"Back-End Developer"'];

  if (typedEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const TYPE_SPEED = 65;
    const DELETE_SPEED = 35;
    const HOLD_TIME = 1400;

    const tick = () => {
      const currentRole = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = currentRole.slice(0, charIndex);
        if (charIndex === currentRole.length) {
          deleting = true;
          setTimeout(tick, HOLD_TIME);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        typedEl.textContent = currentRole.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    };
    tick();
  }

  /* ---------- Contact form submission ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (form && note) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      note.textContent = '';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        const result = await response.json();

        if (!response.ok || (result.success !== 'true' && result.success !== true)) {
          throw new Error(result.message || 'The message could not be sent.');
        }

        note.textContent = 'Message sent successfully. Thank you for reaching out!';
        form.reset();
      } catch (error) {
        note.textContent = `${error.message} Please try again or email santoskerveinkyle@gmail.com directly.`;
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    });
  }

});