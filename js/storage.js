/* Speeka - LocalStorage & Analytics Helpers */

let store = {};
try {
  store = JSON.parse(localStorage.getItem('speeka_v1')) || {};
} catch (e) {}

store.days = store.days || {};
store.minutes = store.minutes || 2;

function save() {
  try {
    localStorage.setItem('speeka_v1', JSON.stringify(store));
  } catch (e) {}
}

const pad = n => String(n).padStart(2, '0');
const key = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

function formatDuration(m) {
  if (m < 1) return Math.round(m * 60) + 's';
  return (m % 1 === 0 ? m : m.toFixed(1)) + ' min';
}

function getStreakData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let cur = new Date(today);
  let streak = 0;

  let k = key(cur);
  if (store.days[k] && store.days[k].s > 0) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  } else {
    cur.setDate(cur.getDate() - 1);
    k = key(cur);
    if (store.days[k] && store.days[k].s > 0) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else {
      streak = 0;
    }
  }

  if (streak > 0) {
    while (true) {
      k = key(cur);
      if (store.days[k] && store.days[k].s > 0) {
        streak++;
        cur.setDate(cur.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const keys = Object.keys(store.days).filter(k => store.days[k].s > 0);
  return { streak, totalActiveDays: keys.length };
}
