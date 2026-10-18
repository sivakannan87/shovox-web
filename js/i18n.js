// i18n.js — Language engine for Shovox International
(function () {
  const LANGS = ['en', 'ta', 'hi', 'ar', 'kn'];
  const RTL_LANGS = ['ar'];
  let currentLang = localStorage.getItem('shovox-lang') || 'en';
  let translations = {};

  async function loadTranslations(lang) {
    try {
      let res = await fetch(`locales/${lang}.json`);
      if (!res.ok) res = await fetch(`/locales/${lang}.json`);
      if (!res.ok) throw new Error('Not found');
      translations = await res.json();
    } catch (e) {
      if (lang !== 'en') {
        try {
          let res = await fetch('locales/en.json');
          if (!res.ok) res = await fetch('/locales/en.json');
          translations = await res.json();
        } catch (err) {
          console.warn('Could not load fallback en.json', err);
        }
      }
    }
  }

  function applyTranslations() {
    // Apply dir for RTL
    const isRTL = RTL_LANGS.includes(currentLang);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);

    // Apply translations to elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedKey(translations, key);
      if (val) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Apply translations to placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = getNestedKey(translations, key);
      if (val) el.placeholder = val;
    });

    // Apply title
    const titleKey = document.documentElement.getAttribute('data-page-title-key');
    if (titleKey) {
      const val = getNestedKey(translations, titleKey);
      if (val) document.title = val + ' | SHOVOX INTERNATIONAL LLP';
    }

    // Update lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  function getNestedKey(obj, keyPath) {
    return keyPath.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : null), obj);
  }

  async function setLanguage(lang) {
    if (!LANGS.includes(lang)) lang = 'en';
    currentLang = lang;
    localStorage.setItem('shovox-lang', lang);
    await loadTranslations(lang);
    applyTranslations();
  }

  async function init() {
    // Check URL parameters for language (?lang=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && LANGS.includes(urlLang)) {
        currentLang = urlLang;
        localStorage.setItem('shovox-lang', currentLang);
      }
    } catch (e) {
      // Ignore if URLSearchParams unsupported
    }

    await loadTranslations(currentLang);
    applyTranslations();

    // Attach language button events
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.ShovoxI18n = { setLanguage, getCurrentLang: () => currentLang };
})();
