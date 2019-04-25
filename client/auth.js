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
    scope: 'openid profile',
    redirectUri: window.location.href,
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
  },

  login: function() {
    localStorage.setItem('authorized', 'true');
    Auth.webAuth.authorize();
  },

  logout: function() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('authorized');
    document.location.reload();
  },

  parseLogin: function() {
    // check localstorage
    if(localStorage.getItem('authorized') == 'true') {
      if(localStorage.getItem('access_token')) {
        return true;
      } else {
        Auth.webAuth.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            window.location.hash = '';
            const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('expires_at', expiresAt);
            document.location.reload()
          }
        });
      }
    } else {
      return false;
    }
  },

  setProfile: function() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    Auth.webAuth.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        Client.playerData = profile;
        $("#welcome-username").text('Welcome ' + profile.nickname);
      }
    });
  }
}