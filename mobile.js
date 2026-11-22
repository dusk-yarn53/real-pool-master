(() => {
  const root = document.getElementById('mobile-pool-preview');
  const button = document.getElementById('fullBtn');
  const feedback = document.getElementById('fullscreenFeedback');
  const welcomeButton=document.getElementById('welcomeFullscreen'),welcomeFeedback=document.getElementById('welcomeFullStatus');
  let busy = false;
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isWeChat = /MicroMessenger/i.test(ua);
  const nativeFullscreen = !!(root.requestFullscreen || root.webkitRequestFullscreen);
  function fallbackHint() {
    if (isWeChat) return '微信内不支持网页全屏：点右上角「…」→「在浏览器打开」，或在浏览器里添加到主屏幕。';
    if (isIOS) return 'iOS 浏览器不支持网页全屏：点分享「添加到主屏幕」，从主屏幕打开即可全屏。';
    return '当前浏览器不支持全屏，已按可见区域适配。';
  }
  let hintEl = document.querySelector('.fullscreen-hint');
  function showFallbackHint(text) {
    if (!hintEl) {
      hintEl = document.createElement('div');
      hintEl.className = 'fullscreen-hint';
      document.body.appendChild(hintEl);
    }
    hintEl.textContent = text;
    hintEl.classList.add('show');
    clearTimeout(showFallbackHint.timer);
    showFallbackHint.timer = setTimeout(() => hintEl.classList.remove('show'), 6000);
  }
  function active() {
    return document.fullscreenElement === root || document.webkitFullscreenElement === root || root.classList.contains('is-fitted');
  }
  function sync() {
    const entered = active();
    if(welcomeFeedback){welcomeFeedback.hidden=true;welcomeFeedback.textContent='';}
    root.classList.toggle('is-fullscreen', entered);
    button.textContent = entered ? '退出适屏' : (nativeFullscreen ? '全屏 ⛶' : '适屏 ⤢');
    button.setAttribute('aria-pressed', String(entered));
    button.setAttribute('aria-label', entered ? '退出全屏预览' : '全屏预览游戏');
    if(welcomeButton){welcomeButton.textContent=entered?'⛶ 退出全屏':'⛶ 全屏体验';welcomeButton.setAttribute('aria-pressed',String(entered));}
    if (entered) { feedback.hidden = true; feedback.textContent = ''; }
    window.dispatchEvent(new Event('resize'));
  }
  async function toggle() {
    if (busy) return;
    busy = true;
    window.PoolAudio?.unlock?.();
    if(!document.getElementById('startOverlay')?.classList.contains('hidden'))window.PoolAudio?.startIntro?.();
    button.disabled = true;
    if(welcomeButton)welcomeButton.disabled=true;
    feedback.hidden = true;
    try {
      if (active()) {
        if(root.classList.contains('is-fitted')){root.classList.remove('is-fitted');sync();return;}
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (!exit) throw new Error('Fullscreen unavailable');
        await exit.call(document);
      } else {
        if (!nativeFullscreen) throw new Error('Fullscreen unavailable');
        const enter = root.requestFullscreen || root.webkitRequestFullscreen;
        await enter.call(root);
      }
      sync();
    } catch {
      root.classList.add('is-fitted');sync();
      const message = fallbackHint();
      feedback.textContent = message;
      feedback.hidden = false;
      if(welcomeFeedback){welcomeFeedback.textContent=message;welcomeFeedback.hidden=false;}
      showFallbackHint(message);
    } finally {
      busy = false;
      button.disabled = false;
      if(welcomeButton)welcomeButton.disabled=false;
    }
  }
  welcomeButton?.addEventListener('click',toggle);
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  window.PoolPreviewFullscreen = { toggle };
  button.textContent = nativeFullscreen ? '全屏 ⛶' : '适屏 ⤢';
  if(welcomeButton)welcomeButton.textContent = nativeFullscreen ? '⛶ 全屏体验' : '⤢ 适屏体验';
  button.setAttribute('aria-pressed', 'false');
})();
