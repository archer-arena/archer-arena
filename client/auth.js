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
    const response = await fetch('http://localhost:4200/api/register', {
      method: 'POST',
      body: {username: username, password: password, email: email}, // string or object
      headers:{
        'Content-Type': 'application/json'
      }
    });
    const myJson = await response.json(); 
    console.log(myJson);
  }
}