/* =============================================================
   Kervein Kyle P. Santos — Portfolio
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- GitHub contribution calendar ---------- */
  const contributionGrid = document.querySelector('.contribution-grid');
  const contributionMonths = document.querySelector('.github-months');
  if (contributionGrid && contributionMonths) {
    const githubContributionsUrl = 'https://github-contributions-api.jogruber.de/v4/kervein?y=last';

    const renderContributions = (contributions) => {
      const weeks = [];
      for (let index = 0; index < contributions.length; index += 7) {
        weeks.push(contributions.slice(index, index + 7));
      }

      contributionGrid.style.gridTemplateColumns = `repeat(${weeks.length}, minmax(4px, 1fr))`;
      contributionGrid.replaceChildren();
      weeks.flat().forEach((contribution) => {
        const cell = document.createElement('span');
        const countLabel = `${contribution.count} contribution${contribution.count === 1 ? '' : 's'}`;
        const dateLabel = new Date(`${contribution.date}T00:00:00`).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        if (contribution.level > 0) cell.className = `level-${contribution.level}`;
        cell.title = `${countLabel} on ${dateLabel}`;
        cell.setAttribute('aria-label', `${countLabel} on ${dateLabel}`);
        contributionGrid.appendChild(cell);
      });

      contributionMonths.replaceChildren();
      contributionMonths.style.gridTemplateColumns = `repeat(${weeks.length}, minmax(4px, 1fr))`;
      const seenMonths = new Set();
      weeks.forEach((week, weekIndex) => {
        const firstDayOfMonth = week.find((contribution) => contribution.date.slice(-2) === '01');
        if (!firstDayOfMonth) return;

        const monthKey = firstDayOfMonth.date.slice(0, 7);
        if (seenMonths.has(monthKey)) return;
        seenMonths.add(monthKey);

        const label = document.createElement('span');
        label.textContent = new Date(`${firstDayOfMonth.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short' });
        label.style.gridColumn = weekIndex + 1;
        contributionMonths.appendChild(label);
      });
    };

    fetch(githubContributionsUrl, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('GitHub contributions could not be loaded.');
        return response.json();
      })
      .then((data) => renderContributions(data.contributions || []))
      .catch(() => {
        contributionGrid.replaceChildren();
        contributionMonths.replaceChildren();
      });
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