/* Formulaires : validation, envoi vers un point de collecte (data-endpoint) ou e-mail pré-rempli. */
(() => {
  const F = window.FSP;
  const MAIL = 'contact@freyasportspartners.com';
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  async function send(form, payload, subject) {
    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(String(res.status));
      return 'sent';
    }
    const body = Object.entries(payload).map(([k, v]) => `${k} : ${v}`).join('\n');
    location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return 'mailto';
  }

  F.mod('forms', () => {
    // Inscription aux notes de recherche
    F.$$('[data-form="newsletter"]').forEach((form) => {
      const input = F.$('input[type="email"]', form);
      const msg = F.$('.news__msg', form);
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const v = input.value.trim();
        if (!isEmail(v)) {
          msg.textContent = 'Invalid email address';
          input.setAttribute('aria-invalid', 'true');
          input.focus();
          return;
        }
        input.removeAttribute('aria-invalid');
        try {
          const how = await send(form, { email: v, source: 'Research notes' }, 'Subscription — Research notes');
          msg.textContent = how === 'sent' ? 'Subscription confirmed. Thank you.' : 'Your email app is opening to confirm your subscription.';
          form.reset();
        } catch (err) {
          msg.textContent = 'Could not send — please try again later.';
        }
      });
    });

    // Formulaires complets (contact, candidature, demande d'accès)
    F.$$('form[data-form="contact"]').forEach((form) => {
      const status = F.$('[data-form-status]', form);
      const fields = F.$$('[name]', form);
      const check = (f) => {
        let ok = f.checkValidity();
        if (ok && f.type === 'email') ok = isEmail(f.value.trim());
        const wrap = f.closest('.field');
        if (wrap) wrap.classList.toggle('is-invalid', !ok);
        f.setAttribute('aria-invalid', String(!ok));
        return ok;
      };
      fields.forEach((f) => {
        f.addEventListener('blur', () => f.value && check(f));
        f.addEventListener('input', () => f.closest('.field')?.classList.contains('is-invalid') && check(f));
        const sync = () => f.closest('.field')?.classList.toggle('has-value', !!f.value);
        f.addEventListener('input', sync);
        f.addEventListener('change', sync);
        sync();
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bad = fields.filter((f) => !check(f));
        if (bad.length) {
          status.textContent = 'Please complete the highlighted fields.';
          status.dataset.state = 'error';
          bad[0].focus();
          return;
        }
        const payload = {};
        fields.forEach((f) => {
          if (f.type === 'radio') { if (f.checked) payload[f.dataset.label || f.name] = f.value; }
          else if (f.type === 'checkbox') payload[f.dataset.label || f.name] = f.checked ? 'oui' : 'non';
          else if (f.value) payload[f.dataset.label || f.name] = f.value.trim();
        });
        const subject = `${form.dataset.subject || 'Contact'} — ${payload['Organisation'] || payload['Name'] || 'website'}`;
        const btn = F.$('[type="submit"]', form);
        btn && btn.setAttribute('disabled', '');
        try {
          const how = await send(form, payload, subject);
          status.dataset.state = 'ok';
          status.textContent = how === 'sent' ? 'Message sent. We will reply within 48 business hours.' : 'Your email app is opening with the message pre-filled. Just press send.';
          if (how === 'sent') form.reset();
        } catch (err) {
          status.dataset.state = 'error';
          status.textContent = `Could not send. Email us directly: ${MAIL}`;
        } finally {
          btn && btn.removeAttribute('disabled');
        }
      });
    });

    // Portail : aucune donnée n'est transmise — le portail sécurisé est opéré séparément
    F.$$('[data-login]').forEach((form) => {
      const status = F.$('[data-login-status]', form);
      const pwd = F.$('input[type="password"]', form);
      const eye = F.$('[data-pwd-toggle]', form);
      eye && eye.addEventListener('click', () => {
        const show = pwd.type === 'password';
        pwd.type = show ? 'text' : 'password';
        eye.setAttribute('aria-pressed', String(show));
        eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = F.$('input[type="email"]', form);
        const okId = isEmail(id.value.trim());
        id.closest('.field').classList.toggle('is-invalid', !okId);
        pwd.closest('.field').classList.toggle('is-invalid', !pwd.value);
        if (!okId || !pwd.value) {
          status.dataset.state = 'error';
          status.textContent = 'Username or password missing.';
          return;
        }
        pwd.value = '';
        status.dataset.state = 'error';
        status.textContent = 'The secure portal cannot be accessed from this page. Your credentials are provided by the Investor Relations team.';
      });
    });

    // Copier dans le presse-papiers
    F.$$('[data-copy]').forEach((b) => {
      b.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(b.dataset.copy);
          F.toast(`Copied · ${b.dataset.copy.length > 24 ? 'text' : b.dataset.copy}`);
        } catch (e) {
          F.toast('Copy failed');
        }
      });
    });
  });
})();
