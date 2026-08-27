export default function handler(req, res) {
  const { host } = req.headers;
  
  // En Vercel a veces host viene con puerto en localhost, en producción es el dominio
  const redirectUri = `https://${host}/api/callback`;
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;

  if (!clientId) {
    return res.status(500).send('Falta configurar OAUTH_GITHUB_CLIENT_ID en Vercel.');
  }

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;

  res.redirect(url);
}
