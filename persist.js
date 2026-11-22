/* 2026-11-22 · 本地存档与统计
   纯 localStorage，不联网、不采集个人信息；隐私模式或配额不足时静默降级。 */
(() => {
  const SAVE = 'guangyu.save.v1', STATS = 'guangyu.stats.v1';
  const safe = (fn, fallback) => { try { return fn(); } catch (e) { return fallback; } };
  const read = key => safe(() => JSON.parse(localStorage.getItem(key) || 'null'), null);
  const write = (key, value) => safe(() => { localStorage.setItem(key, JSON.stringify(value)); return true; }, false);

  window.PoolSave = {
    available: safe(() => { localStorage.setItem('__gy', '1'); localStorage.removeItem('__gy'); return true; }, false),
    load() {
      const snap = read(SAVE);
      if (!snap || snap.v !== 1 || !Array.isArray(snap.balls) || !snap.balls.length) return null;
      const age = Date.now() - (snap.savedAt || 0);
      return age >= 0 && age < 48 * 3600 * 1000 ? snap : null;
    },
    save(snap) {
      if (!snap) return false;
      snap.v = 1;
      snap.savedAt = Date.now();
      return write(SAVE, snap);
    },
    clear() { safe(() => localStorage.removeItem(SAVE)); },
    stats() { return read(STATS) || {}; },
    bumpStats(patch) {
      const s = read(STATS) || {};
      for (const key in patch) {
        const value = patch[key];
        if (typeof value === 'number') s[key] = (s[key] || 0) + value;
        else s[key] = value;
      }
      s.updatedAt = Date.now();
      write(STATS, s);
      return s;
    },
    exportAll() {
      return JSON.stringify({ save: read(SAVE), stats: read(STATS) }, null, 2);
    }
  };
})();
