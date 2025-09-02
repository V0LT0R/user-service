const $ = (sel) => document.querySelector(sel);

const state = {
  get token() { return localStorage.getItem('token'); },
  set token(v) { v ? localStorage.setItem('token', v) : localStorage.removeItem('token'); },
  get user()  { try { return JSON.parse(localStorage.getItem('user')||'null'); } catch{ return null; } },
  set user(v) { v ? localStorage.setItem('user', JSON.stringify(v)) : localStorage.removeItem('user'); },
};

function setAuthUI() {
  const user = state.user;
  const isAuthed = !!state.token && !!user;
  $('#loginSection').classList.toggle('hidden', isAuthed);
  $('#registerSection').classList.toggle('hidden', isAuthed);
  $('#profileSection').classList.toggle('hidden', !isAuthed);
  $('#logoutBtn').classList.toggle('hidden', !isAuthed);
  $('#adminLink').classList.toggle('hidden', !(isAuthed && user.role === 'ADMIN'));

  if (isAuthed) {
    const prof = $('#profileData');
    prof.innerHTML = '';
    const rows = [
      ['ID', user.id],
      ['ФИО', user.fullName],
      ['Дата рождения', new Date(user.birthDate).toLocaleDateString()],
      ['Email', user.email],
      ['Роль', user.role],
      ['Статус', user.isActive ? 'Активен' : 'Заблокирован'],
      ['Создан', new Date(user.createdAt).toLocaleString()]
    ];
    for (const [k,v] of rows) {
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      prof.appendChild(dt); prof.appendChild(dd);
    }
    $('#blockMeBtn').disabled = !user.isActive;
    $('#profileMsg').textContent = '';
  } else {
    $('#registerMsg').textContent = '';
    $('#loginMsg').textContent = '';
  }
}

async function api(path, { method='GET', body=null, auth=true } = {}) {
  const headers = { 'Content-Type':'application/json' };
  if (auth && state.token) headers['Authorization'] = 'Bearer ' + state.token;
  const res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : null });
  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    let msg = 'Ошибка ' + res.status;
    try { const j = JSON.parse(text); msg = j.error || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Регистрация
$('#registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#registerMsg').textContent = 'Загрузка...';
  const f = e.target;
  try {
    const payload = {
      fullName: f.fullName.value.trim(),
      birthDate: f.birthDate.value,
      email: f.email.value.trim(),
      password: f.password.value
    };
    const { user, token } = await api('/api/auth/register', { method:'POST', body:payload, auth:false });
    state.token = token; state.user = user;
    $('#registerMsg').textContent = 'Готово! Вы вошли.';
    setAuthUI();
  } catch (err) {
    $('#registerMsg').textContent = err.message;
  }
});

// Логин
$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#loginMsg').textContent = 'Загрузка...';
  const f = e.target;
  try {
    const { user, token } = await api('/api/auth/login', {
      method:'POST',
      body: { email: f.email.value.trim(), password: f.password.value },
      auth:false
    });
    state.token = token; state.user = user;
    $('#loginMsg').textContent = 'Успешный вход.';
    setAuthUI();
  } catch (err) {
    $('#loginMsg').textContent = err.message;
  }
});

// Блокировать себя
$('#blockMeBtn').addEventListener('click', async () => {
  if (!state.user) return;
  if (!confirm('Вы уверены, что хотите заблокировать свой аккаунт?')) return;
  try {
    const user = await api(`/api/users/${state.user.id}/block`, { method:'PATCH' });
    state.user = user; // обновим локально
    $('#profileMsg').textContent = 'Аккаунт заблокирован.';
    setAuthUI();
  } catch (err) {
    $('#profileMsg').textContent = err.message;
  }
});

// Logout
$('#logoutBtn').addEventListener('click', () => {
  state.token = null; state.user = null; setAuthUI();
});

document.addEventListener('DOMContentLoaded', setAuthUI);
