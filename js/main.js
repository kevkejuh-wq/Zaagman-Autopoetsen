document.addEventListener('DOMContentLoaded', () => {
  // Keep nav active state consistent across pages and hash routes.
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;
  const navLinks = document.querySelectorAll('nav.site-nav a[href]');

  const clearActiveState = (link) => {
    link.classList.remove('text-blue-400', 'font-bold', 'border-b-2', 'border-blue-400', 'pb-1');
  };

  const setActiveState = (link) => {
    link.classList.add('text-blue-400', 'font-bold');
    if (!link.closest('#mobile-menu')) {
      link.classList.add('border-b-2', 'border-blue-400', 'pb-1');
    }
  };

  const isHashMatch = (href) => {
    if (!href.includes('#')) return false;
    const [pathPart, hashPart] = href.split('#');
    if (!hashPart) return false;
    const linkPath = pathPart || currentPath;
    return linkPath === currentPath && `#${hashPart}` === currentHash;
  };

  const isPathMatch = (href) => {
    if (!href || href.includes('#')) return false;
    return href === currentPath;
  };

  navLinks.forEach(clearActiveState);

  const hashMatches = Array.from(navLinks).filter((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return false;
    return isHashMatch(href);
  });

  if (hashMatches.length) {
    hashMatches.forEach(setActiveState);
  } else {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      if (isPathMatch(href)) setActiveState(link);
    });
  }

  // Mobile nav toggle
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const opening = menu.classList.contains('hidden');
      menu.classList.toggle('hidden');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = opening ? 'close' : 'menu';
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add('hidden');
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      }
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Nav background on scroll
  const nav = document.querySelector('nav.site-nav');
  if (nav) {
    const update = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
});
