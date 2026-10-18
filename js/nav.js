// nav.js — Shared navigation for Shovox International
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Scrolled class on navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
      });
      // Initial check in case page starts scrolled
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }

    // Mobile hamburger
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileClose = document.querySelector('.mobile-nav-close');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      });
    }
    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
    // Close mobile nav on link click
    if (mobileNav) {
      mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Mark active nav link
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const linkPath = href.replace(/\/+$/, '') || '/';
      if (currentPath.endsWith(linkPath) && linkPath !== '/' && linkPath !== '#') {
        a.classList.add('active');
      } else if ((currentPath === '/' || currentPath.endsWith('index.html')) && href === 'index.html') {
        a.classList.add('active');
      }
    });
  });
})();
