/* 2026-11-22 · 本地存档与统计
   纯 localStorage，不联网、不采集个人信息；隐私模式或配额不足时静默降级。
   2026-11-22 更新：最多保留 4 个不同模式/难度的存档，读取最新的一个。 */
(() => {
  const SAVE = 'guangyu.save.v2', STATS = 'guangyu.stats.v1', LEGACY = 'guangyu.save.v1';
  const safe = (fn, fallback) => { try { return fn(); } catch (e) { return fallback; } };
  const read = key => safe(() => JSON.parse(localStorage.getItem(key) || 'null'), null);
  const write = (key, value) => safe(() => { localStorage.setItem(key, JSON.stringify(value)); return true; }, false);

  function normalizeSnap(snap) {
    if (!snap || !Array.isArray(snap.balls) || !snap.balls.length) return null;
    if (!snap.balls.some(b => b && b.n === 0)) return null;
    return snap;
  }

  function listSaves() {
    let record = read(SAVE);
    if (!record) {
      const legacy = read(LEGACY);
      if (legacy && normalizeSnap(legacy)) record = { slots: [{ ...legacy, slot: 'default' }] };
    }
    return record && Array.isArray(record.slots) ? record.slots.filter(normalizeSnap) : [];
  }

  window.PoolSave = {
    available: safe(() => { localStorage.setItem('__gy', '1'); localStorage.removeItem('__gy'); return true; }, false),
    load() {
      const slots = listSaves();
      if (!slots.length) return null;
      const newest = slots.slice().sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))[0];
      const age = Date.now() - (newest.savedAt || 0);
      return age >= 0 && age < 48 * 3600 * 1000 ? newest : null;
    },
    save(snap) {
      const clean = normalizeSnap(snap);
      if (!clean) return false;
      clean.savedAt = Date.now();
      clean.v = 2;
      const slots = listSaves().filter(s => s.slot !== clean.slot);
      slots.unshift(clean);
      return write(SAVE, { slots: slots.slice(0, 4), updatedAt: clean.savedAt });
    },
    clear() { safe(() => { localStorage.removeItem(SAVE); localStorage.removeItem(LEGACY); }); },
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
      return JSON.stringify({ saves: listSaves(), stats: read(STATS) }, null, 2);
    }
  };
})();
