// forms.js — Form handling for SHOVOX INTERNATIONAL LLP
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.shovox-form').forEach(form => {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const successEl = form.querySelector('.form-success');
        const errorEl = form.querySelector('.form-error');

        // Hide previous messages
        if (successEl) successEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';

        // Basic validation
        let valid = true;
        form.querySelectorAll('[required]').forEach(field => {
          if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            valid = false;
          } else {
            field.style.borderColor = '';
          }
        });

        // Email validation
        const emailField = form.querySelector('[type="email"]');
        if (emailField && emailField.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emailField.value)) {
            emailField.style.borderColor = '#ef4444';
            valid = false;
          }
        }

        if (!valid) {
          if (errorEl) {
            errorEl.textContent = 'Please fill in all required fields correctly.';
            errorEl.style.display = 'block';
          }
          return;
        }

        // Submit state
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Sending Enquiry...';
        }

        try {
          const formData = new FormData(form);
          const action = form.getAttribute('action');

          // Send to Google Apps Script
          try {
            await fetch(action, {
              method: 'POST',
              body: formData,
              mode: 'no-cors'
            });
          } catch (fetchErr) {
            // Fallback for strict CORS environments
            const urlParams = new URLSearchParams(formData);
            await fetch(action, {
              method: 'POST',
              body: urlParams,
              mode: 'no-cors'
            });
          }

          if (successEl) {
            successEl.textContent = 'Thank you for your enquiry. We will contact you within 2–3 business days.';
            successEl.style.display = 'block';
          }
          form.reset();
        } catch (err) {
          if (errorEl) {
            errorEl.textContent = 'There was an error submitting your enquiry. Please email us directly at support@shovoxinternational.com';
            errorEl.style.display = 'block';
          }
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.textContent = btn.getAttribute('data-original-text') || 'Send Enquiry';
          }
        }
      });

      // Store original button text
      const btn = form.querySelector('[type="submit"]');
      if (btn) btn.setAttribute('data-original-text', btn.textContent);
    });
  });
})();
