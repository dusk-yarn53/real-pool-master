(() => {
  const root = document.getElementById('mobile-pool-preview');
  const surface = root?.querySelector('.mobile-game-surface');
  if (!root || !surface) return;
  const coarse = window.matchMedia?.('(pointer: coarse)');
  const orientation = window.screen?.orientation;
  const isPhone = () => !!coarse?.matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '') || navigator.maxTouchPoints > 0;
  function sync() {
    const phone = isPhone();
    const viewport = window.visualViewport;
    const width = Math.max(1, Math.min(root.clientWidth || Infinity, viewport?.width || window.innerWidth || 360));
    const height = Math.max(1, viewport?.height || window.innerHeight || 390);
    // Fit a landscape surface even when an in-app browser keeps a portrait viewport.
    // Orientation APIs never decide whether the game is visible or playable.
    // Phones are small in at least one dimension. A touchscreen laptop reports
    // maxTouchPoints and coarse pointers too, so size decides the layout; it
    // must not force the compact phone surface onto a desktop window.
    const compact = phone && Math.min(width, height) < 720;
    const sideways = compact && width < height;
    if (sideways !== root.classList.contains('is-landscape')) {
      for (const id of ['game', 'cueMeter', 'angleRuler', 'spinEditorBall']) document.getElementById(id)?.dispatchEvent(new Event('pointercancel'));
    }
    root.classList.remove('orientation-blocked');
    root.classList.toggle('phone-landscape', compact);
    root.classList.toggle('is-landscape', sideways);
    root.classList.toggle('is-compact', compact);
    surface.inert = false;
    surface.removeAttribute('aria-hidden');
    root.style.setProperty('--visible-height', `${height}px`);
    root.style.setProperty('--phone-height', `${height}px`);
    root.style.setProperty('--landscape-width', `${sideways ? height : width}px`);
    root.style.setProperty('--landscape-height', `${sideways ? width : height}px`);
    const chrome = (root.querySelector('.topbar')?.offsetHeight || 48) + (root.querySelector('.scorebar')?.offsetHeight || 28) + (root.querySelector('.status')?.offsetHeight || 22);
    root.style.setProperty('--landscape-table-width', `${Math.max(1, (sideways ? width : height) - chrome) * 1400 / 790}px`);
    root.style.setProperty('--preview-header-height', `${document.getElementById('previewTopbar')?.offsetHeight || 48}px`);
  }
  for (const name of ['resize', 'orientationchange']) window.addEventListener(name, sync);
  orientation?.addEventListener?.('change', sync);
  coarse?.addEventListener?.('change', sync);
  window.visualViewport?.addEventListener('resize', sync);
  if (typeof ResizeObserver !== 'undefined') {
    let previousWidth = -1;
    new ResizeObserver(() => { if (root.clientWidth !== previousWidth) { previousWidth = root.clientWidth; sync(); } }).observe(root);
  }
  sync();
})();
