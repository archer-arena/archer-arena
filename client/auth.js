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
  }),

  register: async(username, password, email) => {
    return fetch('http://localhost:4200/api/register', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: username, password: password, email: email}) // string or object
    }).then(response => {
      console.log(response);
    });
  }
}