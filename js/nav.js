// nav.js — Shared navigation for Shovox International
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.querySelector('.navbar');
    if (navbar) {
      var onScroll = function () { navbar.classList.toggle('scrolled', window.scrollY > 10); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Mobile menu
    var hamburger = document.querySelector('.hamburger');
    var mobileNav = document.querySelector('.mobile-nav');
    var mobileClose = document.querySelector('.mobile-nav-close');
    function setMobile(open) {
      if (!mobileNav) return;
      mobileNav.classList.toggle('open', open);
      mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (hamburger) hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open && mobileClose) mobileClose.focus();
      if (!open && hamburger) hamburger.focus();
    }
    if (hamburger) hamburger.addEventListener('click', function () { setMobile(true); });
    if (mobileClose) mobileClose.addEventListener('click', function () { setMobile(false); });
    if (mobileNav) mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileNav.classList.remove('open'); document.body.style.overflow = ''; });
    });

    // Divisions dropdown + language menu (click/tap support, Escape to close)
    var toggles = [];
    document.querySelectorAll('.has-dropdown, .lang-menu').forEach(function (wrap) {
      var btn = wrap.querySelector('.nav-drop-btn, .lang-toggle');
      if (!btn) return;
      toggles.push({ wrap: wrap, btn: btn });
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = !wrap.classList.contains('open');
        closeAll();
        wrap.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    function closeAll() {
      toggles.forEach(function (t) { t.wrap.classList.remove('open'); t.btn.setAttribute('aria-expanded', 'false'); });
    }
    document.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeAll(); if (mobileNav && mobileNav.classList.contains('open')) setMobile(false); }
    });
    document.querySelectorAll('.lang-list .lang-btn').forEach(function (b) { b.addEventListener('click', closeAll); });

    // Active link
    var page = (window.location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
    document.querySelectorAll('.nav-links a, .mobile-nav-links a, .dropdown-menu a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0].replace(/\.html$/, '');
      if (href && href === page) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
        var dd = a.closest('.has-dropdown');
        if (dd) dd.querySelector('.nav-drop-btn').classList.add('active');
      }
    });

    // Footer year
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  });
})();
