document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-password').forEach(btn => btn.addEventListener('click', () => { const input = document.getElementById(btn.dataset.target); if (input) { input.type = input.type === 'password' ? 'text' : 'password'; btn.textContent = input.type === 'password' ? 'Show' : 'Hide'; } }));
  const form = document.getElementById('signupForm'); if (!form) return;
  form.addEventListener('submit', e => { e.preventDefault(); const name = document.getElementById('fullName').value.trim(), email = document.getElementById('email').value.trim().toLowerCase(), phone = document.getElementById('phone').value.trim(), pass = document.getElementById('password').value, confirm = document.getElementById('confirmPassword').value, msg = document.getElementById('formMessage');
    if (!/^\d{10}$/.test(phone)) { msg.textContent = 'Please enter a valid 10-digit phone number.'; msg.style.color = '#ff8495'; return; }
    if (pass.length < 6) { msg.textContent = 'Password must contain at least 6 characters.'; msg.style.color = '#ff8495'; return; }
    if (pass !== confirm) { msg.textContent = 'Passwords do not match.'; msg.style.color = '#ff8495'; return; }
    const users = readStore(SHOP_KEYS.users, []); if (users.some(u => u.email === email)) { msg.textContent = 'An account with this email already exists.'; msg.style.color = '#ff8495'; return; }
    users.push({name,email,phone,password:pass}); writeStore(SHOP_KEYS.users, users); msg.textContent = 'Account created successfully! You can now log in.'; msg.style.color = '#4ed9a0'; form.reset();
  });
});
