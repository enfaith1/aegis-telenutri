// Shared helpers: storage, auth, nav. Demo only (no backend).
const DB = {
  get(k, d = []) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};
const Auth = {
  user() { return DB.get('tn_user', null); },
  login(name, role) { DB.set('tn_user', { name: name.trim(), role }); },
  logout() { localStorage.removeItem('tn_user'); location.href = 'index.html'; },
  require(role) {
    const u = this.user();
    if (!u || (role && u.role !== role)) { location.href = 'index.html'; return null; }
    return u;
  }
};
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function roomName() {
  const a = new Uint8Array(8); crypto.getRandomValues(a);
  return 'AegisTelenutri-' + Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
}
function renderNav() {
  const u = Auth.user();
  const home = u ? (u.role === 'consumer' ? 'consumer.html' : 'provider.html') : 'index.html';
  document.getElementById('nav').innerHTML =
    `<a class="brand" href="${home}" style="color:#fff;text-decoration:none">🛡️ Aegis <span>Telenutri</span></a>` +
    (u ? `<div class="right"><span>${esc(u.name)} (${u.role})</span><button class="btn ghost" onclick="Auth.logout()">Logout</button></div>` : '');
}
document.addEventListener('DOMContentLoaded', renderNav);

// Project credits footer (shown on every page)
document.addEventListener('DOMContentLoaded', () => {
  const f = document.createElement('footer');
  f.innerHTML = '<strong>Aegis Telenutri</strong> &middot; Nutrition Fundamentals Finals Project<br>' +
    'By: Bancruz, Liboon, Navales, &amp; Solis &middot; BSCS - 3';
  document.body.appendChild(f);
});
