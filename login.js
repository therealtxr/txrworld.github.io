const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close');
const emailInput = document.getElementById('emailInput');
const submitLogin = document.getElementById('submitLogin');
const loginError = document.getElementById('loginError');
const userDisplay = document.getElementById('userDisplay');

// Abrir modal
loginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
closeBtn.addEventListener('click', () => loginModal.style.display = 'none');

// Login simples
submitLogin.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) {
    loginError.style.display = 'block';
    return;
  }
  loginError.style.display = 'none';

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Falha no login');
    localStorage.setItem('userEmail', email);
    showUser(email);
    loginModal.style.display = 'none';
  } catch (e) {
    alert('Erro ao logar. Tente novamente.');
    console.error(e);
  }
});

// Mostrar usuário logado
function showUser(email) {
  userDisplay.innerHTML = `
    <div id="userAvatar">${email[0].toUpperCase()}</div>
    <button id="logoutBtn">Sair</button>
  `;
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('userEmail');
    location.reload();
  });
}

// Mantém usuário logado
const savedEmail = localStorage.getItem('userEmail');
if (savedEmail) showUser(savedEmail);

// Registrar download
const downloadButtons = document.querySelectorAll('.download-btn');
downloadButtons.forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      e.preventDefault();
      alert('Você precisa estar logado para baixar este arquivo.');
      return;
    }

    const fileName = btn.dataset.file; // data-file="nome_do_arquivo"
    try {
      await fetch('http://localhost:3000/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, file: fileName })
      });
    } catch (err) {
      console.error('Erro ao registrar download:', err);
    }
  });
});
