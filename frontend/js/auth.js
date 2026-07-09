// auth.js - handles login and register forms

const API_BASE = '/api/auth';

// ---------------- REGISTER ----------------
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const msgEl = document.getElementById('formMsg');
        msgEl.textContent = '';
        msgEl.className = 'form-msg';

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const phone = document.getElementById('regPhone').value.trim();

        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone })
            });

            const data = await res.json();

            if (!res.ok) {
                msgEl.textContent = data.message || 'Registration failed.';
                msgEl.classList.add('error');
                return;
            }

            msgEl.textContent = 'Registered successfully! Redirecting to login...';
            msgEl.classList.add('success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1200);

        } catch (err) {
            msgEl.textContent = 'Could not connect to server. Is the backend running?';
            msgEl.classList.add('error');
        }
    });
}

// ---------------- LOGIN ----------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const msgEl = document.getElementById('formMsg');
        msgEl.textContent = '';
        msgEl.className = 'form-msg';

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                msgEl.textContent = data.message || 'Login failed.';
                msgEl.classList.add('error');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            msgEl.textContent = 'Login successful! Redirecting...';
            msgEl.classList.add('success');

            // if user was sent to login from checkout, send them back
            const redirectTo = sessionStorage.getItem('redirectAfterLogin') || 'index.html';
            sessionStorage.removeItem('redirectAfterLogin');

            setTimeout(() => {
                window.location.href = redirectTo;
            }, 800);

        } catch (err) {
            msgEl.textContent = 'Could not connect to server. Is the backend running?';
            msgEl.classList.add('error');
        }
    });
}
