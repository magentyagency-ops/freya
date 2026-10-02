// Gestion de l'accès sécurisé par code à 4 chiffres (4726)
(function () {
  const PASSCODE = '4726';
  const STORAGE_KEY = 'fsp_access_pass';

  function initGate() {
    const gate = document.getElementById('site-gate');
    if (!gate) return;

    // Vérifie si déjà authentifié
    try {
      if (localStorage.getItem(STORAGE_KEY) === PASSCODE || sessionStorage.getItem(STORAGE_KEY) === PASSCODE) {
        document.documentElement.classList.remove('is-locked');
        document.documentElement.classList.add('is-unlocked');
        gate.style.display = 'none';
        return;
      }
    } catch (e) {}

    // Verrouille la page
    document.documentElement.classList.add('is-locked');
    document.documentElement.classList.remove('is-unlocked');
    gate.style.display = 'flex';

    const form = document.getElementById('gate-form');
    const input = document.getElementById('gate-input');
    const card = gate.querySelector('.site-gate__card');
    const slots = gate.querySelectorAll('.site-gate__slot');
    const errorEl = document.getElementById('gate-error');
    const pinWrap = gate.querySelector('.site-gate__pin-wrap');

    if (!input || !slots.length) return;

    function updateSlots(val) {
      slots.forEach((slot, i) => {
        if (i < val.length) {
          slot.classList.add('is-filled');
          slot.classList.remove('is-focused');
        } else if (i === val.length) {
          slot.classList.add('is-focused');
          slot.classList.remove('is-filled');
        } else {
          slot.classList.remove('is-filled', 'is-focused');
        }
      });
    }

    function showError(msg) {
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.add('is-visible');
      }
      if (card) {
        card.classList.remove('shake');
        void card.offsetWidth; // Force reflow
        card.classList.add('shake');
      }
      setTimeout(() => {
        input.value = '';
        updateSlots('');
        if (card) card.classList.remove('shake');
        input.focus();
      }, 550);
    }

    function unlock() {
      try {
        localStorage.setItem(STORAGE_KEY, PASSCODE);
        sessionStorage.setItem(STORAGE_KEY, PASSCODE);
      } catch (e) {}

      if (card) card.classList.add('is-success');
      if (errorEl) errorEl.classList.remove('is-visible');

      setTimeout(() => {
        gate.classList.add('is-leaving');
        document.documentElement.classList.remove('is-locked');
        document.documentElement.classList.add('is-unlocked');

        setTimeout(() => {
          gate.style.display = 'none';
        }, 450);
      }, 350);
    }

    function checkCode(val) {
      if (val === PASSCODE) {
        unlock();
      } else {
        showError('Code incorrect. Veuillez réessayer.');
      }
    }

    input.addEventListener('input', () => {
      const clean = input.value.replace(/\D/g, '').slice(0, 4);
      input.value = clean;
      updateSlots(clean);
      if (errorEl) errorEl.classList.remove('is-visible');

      if (clean.length === 4) {
        checkCode(clean);
      }
    });

    input.addEventListener('focus', () => {
      updateSlots(input.value);
    });

    input.addEventListener('blur', () => {
      slots.forEach((s) => s.classList.remove('is-focused'));
    });

    if (pinWrap) {
      pinWrap.addEventListener('click', () => {
        input.focus();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = input.value.replace(/\D/g, '');
        if (val.length < 4) {
          showError('Veuillez saisir les 4 chiffres.');
          return;
        }
        checkCode(val);
      });
    }

    // Auto-focus initial
    setTimeout(() => {
      input.focus();
      updateSlots(input.value);
    }, 100);
  }

  // Initialisation rapide dès chargement du DOM ou immédiat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGate);
  } else {
    initGate();
  }

  // Utile pour tester le reverrouillage : window.__fspLock()
  window.__fspLock = function () {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    location.reload();
  };
})();
