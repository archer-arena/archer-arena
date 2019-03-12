var Auth = {
  idToken: '',
  accessToken: '',
  expiresAt: '',

  /* Usage:
     
  */
  webAuth: new auth0.WebAuth({
    domain: 'archer-arena.auth0.com',
    clientID: 'B6JBK9ctCtdXZg2diqe_Kd1OxoPdgqWq',
    responseType: 'token id_token',
    scope: 'openid',
    redirectUri: window.location.href
  })
}