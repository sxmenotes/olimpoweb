export default async function handler(req, res) {
  const { host } = req.headers;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${protocol}://${host}/api/callback`;
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;

  // 1. Manejo de inicio de sesión directo con GitHub (para desarrolladores)
  if (req.method === 'GET' && req.query.direct === 'github') {
    if (!clientId) {
      return res.status(500).send('Falta configurar OAUTH_GITHUB_CLIENT_ID en Vercel para acceso GitHub directo.');
    }
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;
    return res.redirect(url);
  }

  // 2. Procesamiento de login con Usuario y Contraseña (POST)
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const { username, password } = body || {};

    const validUser = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD;
    const token = process.env.GITHUB_PAT || process.env.ADMIN_GITHUB_TOKEN;

    if (!validPassword) {
      return res.status(500).json({
        success: false,
        error: 'Configuración pendiente: Falta definir ADMIN_PASSWORD en las variables de entorno de Vercel.'
      });
    }

    if (!token) {
      return res.status(500).json({
        success: false,
        error: 'Configuración pendiente: Falta definir GITHUB_PAT (Token de GitHub) en las variables de entorno de Vercel.'
      });
    }

    if (username === validUser && password === validPassword) {
      return res.status(200).json({
        success: true,
        token: token
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Usuario o contraseña incorrectos.'
      });
    }
  }

  // 3. Renderizado de interfaz visual de Login de Olimpo (GET)
  const hasGitHubOAuth = Boolean(clientId);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acceso Administrador | Olimpo Centro de Eventos</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    body {
      background-color: #f8f7f2;
      background-image: radial-gradient(#e4e1d3 1px, transparent 1px);
      background-size: 24px 24px;
      color: #1c1d1a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2ded0;
      box-shadow: 0 20px 40px -15px rgba(44, 49, 21, 0.08), 0 0 1px 1px rgba(44, 49, 21, 0.04);
      border-radius: 20px;
      width: 100%;
      max-width: 420px;
      padding: 40px 32px;
      text-align: center;
      position: relative;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 40px;
      right: 40px;
      height: 4px;
      background: linear-gradient(90deg, transparent, #4a5022, #b59b58, transparent);
      border-radius: 0 0 4px 4px;
    }
    .logo-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background-color: #f2efe4;
      border: 1px solid #ded7c2;
      border-radius: 50%;
      margin-bottom: 16px;
      color: #4a5022;
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 700;
    }
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 700;
      color: #1f2211;
      margin-bottom: 6px;
      letter-spacing: -0.02em;
    }
    p.subtitle {
      font-size: 13px;
      color: #6d7256;
      margin-bottom: 28px;
    }
    .form-group {
      text-align: left;
      margin-bottom: 18px;
    }
    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #4a5022;
      margin-bottom: 6px;
    }
    input {
      width: 100%;
      padding: 13px 16px;
      border: 1px solid #dcd7c6;
      border-radius: 10px;
      font-size: 14px;
      background: #faf9f5;
      color: #1f2211;
      transition: all 0.2s ease;
      outline: none;
    }
    input:focus {
      background: #ffffff;
      border-color: #4a5022;
      box-shadow: 0 0 0 3px rgba(74, 80, 34, 0.12);
    }
    .btn-submit {
      width: 100%;
      padding: 14px;
      background-color: #4a5022;
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-submit:hover {
      background-color: #3b4019;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(74, 80, 34, 0.2);
    }
    .btn-submit:active {
      transform: translateY(0);
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .divider {
      display: flex;
      align-items: center;
      margin: 24px 0 18px;
      color: #9d9987;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e6e2d5;
    }
    .divider span {
      padding: 0 12px;
    }
    .btn-github {
      width: 100%;
      padding: 11px;
      background: #ffffff;
      border: 1px solid #dcd7c6;
      border-radius: 10px;
      color: #333;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.2s ease;
    }
    .btn-github:hover {
      background: #f7f6f2;
      border-color: #beb8a3;
    }
    .btn-github svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
    .error-box {
      background: #fdf2f2;
      border: 1px solid #f8b4b4;
      color: #9b1c1c;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 16px;
      display: none;
      text-align: left;
    }
    .success-box {
      background: #f3faf7;
      border: 1px solid #a4e1ca;
      color: #0d6844;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 16px;
      display: none;
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 0.8s linear infinite;
      display: none;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-badge">Ω</div>
    <h1>Olimpo Eventos</h1>
    <p class="subtitle">Panel de Administración de Contenidos</p>

    <div id="error-box" class="error-box"></div>
    <div id="success-box" class="success-box">✓ Acceso verificado. Conectando al CMS...</div>

    <form id="login-form">
      <div class="form-group">
        <label for="username">Usuario o Correo</label>
        <input type="text" id="username" name="username" placeholder="Ingresa tu usuario" required autocomplete="username" autofocus>
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" name="password" placeholder="••••••••" required autocomplete="current-password">
      </div>

      <button type="submit" id="btn-submit" class="btn-submit">
        <span id="btn-text">Iniciar Sesión</span>
        <div id="spinner" class="spinner"></div>
      </button>
    </form>

    ${hasGitHubOAuth ? `
      <div class="divider"><span>o continuar con</span></div>
      <a href="/api/auth?direct=github" class="btn-github">
        <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        Acceso Desarrollador (GitHub)
      </a>
    ` : ''}
  </div>

  <script>
    const form = document.getElementById('login-form');
    const errorBox = document.getElementById('error-box');
    const successBox = document.getElementById('success-box');
    const btnSubmit = document.getElementById('btn-submit');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('spinner');

    function notifyDecapCMS(token) {
      if (!window.opener) {
        errorBox.textContent = 'No se detectó la ventana del panel. Por favor vuelve a abrir el /admin/.';
        errorBox.style.display = 'block';
        return;
      }

      const receiveMessage = (message) => {
        if (message.data === "authorizing:github") {
          window.opener.postMessage(
            'authorization:github:success:{"token":"' + token + '","provider":"github"}',
            message.origin
          );
          window.removeEventListener("message", receiveMessage, false);
          setTimeout(() => window.close(), 400);
        }
      };

      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");

      // Fallback directo
      try {
        window.opener.postMessage(
          'authorization:github:success:{"token":"' + token + '","provider":"github"}',
          "*"
        );
        setTimeout(() => window.close(), 600);
      } catch (e) {}
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBox.style.display = 'none';
      btnSubmit.disabled = true;
      btnText.textContent = 'Verificando...';
      spinner.style.display = 'block';

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Error al iniciar sesión.');
        }

        form.style.display = 'none';
        successBox.style.display = 'block';
        notifyDecapCMS(data.token);

      } catch (err) {
        errorBox.textContent = err.message;
        errorBox.style.display = 'block';
        btnSubmit.disabled = false;
        btnText.textContent = 'Iniciar Sesión';
        spinner.style.display = 'none';
      }
    });
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
