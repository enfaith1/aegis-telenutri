Auth.require('provider');
let selected = null;

function patients() {
  const names = new Set([...DB.get('tn_meals'), ...DB.get('tn_appts')].map(x => x.patient));
  return [...names];
}
function render() {
  document.getElementById('patients').innerHTML = patients().map(p =>
    `<div class="item"><a href="#" data-p="${esc(p)}">${esc(p)}</a></div>`).join('') || '<p class="muted">No patients yet.</p>';
  document.querySelectorAll('[data-p]').forEach(a => a.onclick = e => { e.preventDefault(); selected = a.dataset.p; render(); });

  if (selected) {
    document.getElementById('ptitle').textContent = 'Chart: ' + selected;
    document.getElementById('pmeals').innerHTML = '<b>Meal log</b>' + (DB.get('tn_meals').filter(m => m.patient === selected).reverse().map(m =>
      `<div class="item">${esc(m.type)}: ${esc(m.food)} <span class="tag">${m.cal} kcal</span></div>`).join('') || '<p class="muted">No meals.</p>');
    document.getElementById('pnotes').innerHTML = '<b>Previous notes</b>' + (DB.get('tn_notes').filter(n => n.patient === selected).reverse().map(n =>
      `<div class="item">${esc(n.text)}<div class="muted">${n.when}</div></div>`).join('') || '<p class="muted">None.</p>');
  }
  document.getElementById('appts').innerHTML = DB.get('tn_appts').map(a =>
    `<div class="item"><b>${esc(a.patient)}</b> - ${a.date} ${a.time} (${esc(a.dietitian)})<br>
     <a class="btn accent" href="session.html?room=${a.room}">Start Session</a></div>`).join('') || '<p class="muted">No sessions booked.</p>';
}

document.getElementById('saveNote').onclick = () => {
  const text = document.getElementById('note').value.trim();
  if (!selected) return alert('Select a patient first');
  if (!text) return;
  const notes = DB.get('tn_notes');
  notes.push({ patient: selected, text, when: new Date().toLocaleString() });
  DB.set('tn_notes', notes);
  document.getElementById('note').value = '';
  render();
};
render();
