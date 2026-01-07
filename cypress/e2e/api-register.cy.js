describe('API Register - Eco Bliss Bath', () => {
    const API_BASE_URL = 'http://localhost:8081';
  
    it('POST /register crée un nouvel utilisateur valide', () => {
      const email = `cypress-user-${Date.now()}@ecoblissbath.test`;
  
      const newUser = {
        email,
        firstname: 'Cypress',
        lastname: 'User',
        plainPassword: {
          first: 'password',
          second: 'password',
        },
      };
  
      cy.request('POST', `${API_BASE_URL}/register`, newUser).then((response) => {
        // 200 ou 201 selon la conf
        expect([200, 201]).to.include(response.status);
  
        const user = response.body;
  
        expect(user).to.be.an('object');
        expect(user).to.have.property('id');
        expect(user).to.have.property('email', email);
        expect(user).to.have.property('firstname', 'Cypress');
        expect(user).to.have.property('lastname', 'User');
      });
    });
  });
  