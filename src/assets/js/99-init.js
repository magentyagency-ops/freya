/* Démarrage : chaque module est isolé — une erreur n'empêche pas les autres de s'exécuter. */
(() => {
  const F = window.FSP;
  const start = () => {
    F.mods.forEach(([name, fn]) => {
      try {
        fn();
      } catch (err) {
        console.error(`[Freya] module « ${name} »`, err);
      }
    });
    F.root.classList.add('is-ready');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  // Retour arrière (bfcache) : on ne rejoue pas l'intro
  addEventListener('pageshow', (e) => {
    if (e.persisted) {
      F.root.classList.remove('is-intro', 'has-mega', 'has-menu');
      F.root.style.overflow = '';
    }
  });
})();
