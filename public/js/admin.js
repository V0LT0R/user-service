const $ = (sel) => document.querySelector(sel);

const auth = {
  get token() { return localStorage.getItem('token'); },
  get user()  { try { return JSON.parse(localStorage.getItem('user')||'null'); } catch { return null; } },
  saveUser(u){ localStorage.setItem('user', JSON.stringify(u)); },
  logout()   { localStorage.removeItem('token'); localStorage.removeItem('user'); }
};

function guardAdmin() {
  const u = auth.user;
  const t = auth.token;
  if (!u || !t) {
    alert('Нужно войти заново');
    location.href = '/';
    return;
  }
  if (u.role !== 'ADMIN') {
    alert('Требуются права администратора');
    location.href = '/';
  }
}

async function api(path, { method='GET', body=null } = {}) {
  const headers = { 'Content-Type':'application/json' };
  if (auth.token) headers['Authorization'] = 'Bearer ' + auth.token;
  const res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : null });

  if (!res.ok) {
    let msg = `Ошибка ${res.status}`;
    try { const j = await res.json(); msg = j.error || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Опционально: подтянем актуальные данные о себе (могли менять в БД)
// NB: если вы сделали себя админом после логина, JWT всё равно останется USER.
// Для доступа к /api/users всё равно нужно перелогиниться.
async function refreshSelf() {
  try {
    const u = auth.user;
    if (!u) return;
    const me = await api(`/api/users/${u.id}`);
    auth.saveUser(me);
  } catch (_) {}
}

const state = { page: 1, perPage: 10, onlyActive: false, total: 0 };

async function loadUsers() {
  $('#adminMsg').textContent = 'Загрузка...';
  const q = new URLSearchParams({
    page: String(state.page),
    perPage: String(state.perPage),
    ...(state.onlyActive ? { isActive: 'true' } : {})
  });
  try {
    const data = await api(`/api/users?${q.toString()}`);
    state.total = data.total;
    renderTable(data.data);
    renderPager();
    $('#adminMsg').textContent = '';
  } catch (e) {
    $('#adminMsg').textContent = e.message; // покажем Unauthorized/Forbidden и т.д.
  }
}

function renderTable(rows) {
  const tbody = $('#usersTable tbody');
  tbody.innerHTML = '';
  for (const u of rows) {
    const tr = document.createElement('tr');
    const badge = u.isActive ? '<span class="badge green">Активен</span>' :
                               '<span class="badge red">Заблокирован</span>';
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.fullName}</td>
      <td>${new Date(u.birthDate).toLocaleDateString()}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${badge}</td>
      <td>${u.isActive ? `<button data-id="${u.id}" class="danger small">Блокировать</button>` : ''}</td>
    `;
    tbody.appendChild(tr);
  }
  tbody.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      if (!confirm('Заблокировать пользователя?')) return;
      try {
        await api(`/api/users/${id}/block`, { method:'PATCH' });
        await loadUsers();
      } catch (err) {
        alert(err.message);
      }
    });
  });
}

function renderPager() {
  const totalPages = Math.max(1, Math.ceil(state.total / state.perPage));
  $('#pageInfo').textContent = `${state.page} / ${totalPages}`;
  $('#prevBtn').disabled = state.page <= 1;
  $('#nextBtn').disabled = state.page >= totalPages;
}

$('#prevBtn').addEventListener('click', () => { state.page = Math.max(1, state.page - 1); loadUsers(); });
$('#nextBtn').addEventListener('click', () => { state.page += 1; loadUsers(); });
$('#perPage').addEventListener('change', (e) => { state.perPage = Number(e.target.value); state.page = 1; loadUsers(); });
$('#onlyActive').addEventListener('change', (e) => { state.onlyActive = e.target.checked; state.page = 1; loadUsers(); });
$('#logoutBtn').addEventListener('click', () => { auth.logout(); location.href = '/'; });

document.addEventListener('DOMContentLoaded', async () => {
  guardAdmin();
  await refreshSelf();
  state.perPage = Number($('#perPage').value);
  loadUsers();
});
