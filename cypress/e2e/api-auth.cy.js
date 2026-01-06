describe('API Auth - Eco Bliss Bath', () => {
    const API_BASE_URL = 'http://localhost:8081';
  
    it('permet de s’inscrire, de se connecter et de récupérer le profil /me', () => {
      const email = `cypress-user+${Date.now()}@ecoblissbath.test`;
      const password = 'password';
  
      const newUser = {
        email,
        firstname: 'Cypress',
        lastname: 'Tester',
        plainPassword: {
          first: password,
          second: password,
        },
      };
  
      // 1) Inscription
      cy.request('POST', `${API_BASE_URL}/register`, newUser).then((registerResponse) => {
        expect([200, 201]).to.include(registerResponse.status);
  
        const user = registerResponse.body;
        expect(user).to.be.an('object');
        expect(user).to.have.property('id');
        expect(user).to.have.property('email', email);
  
        // 2) Connexion avec l'utilisateur qu’on vient de créer
        cy.request('POST', `${API_BASE_URL}/login`, {
          username: email,
          password,
        }).then((loginResponse) => {
          expect(loginResponse.status).to.eq(200);
          expect(loginResponse.body).to.have.property('token');
  
          const token = loginResponse.body.token;
  
          // 3) Récupération du profil /me avec ce token
          cy.request({
            method: 'GET',
            url: `${API_BASE_URL}/me`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((meResponse) => {
            expect(meResponse.status).to.eq(200);
  
            const me = meResponse.body;
            expect(me).to.be.an('object');
            expect(me).to.have.property('email', email);
          });
        });
      });
    });
  });
  