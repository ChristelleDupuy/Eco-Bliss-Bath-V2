// cypress/e2e/api-auth.cy.js

describe('API Auth - Eco Bliss Bath', () => {
    const API_BASE_URL = 'http://localhost:8081';
  
    it('POST /login - utilisateur connu doit renvoyer 200', () => {
      cy.request('POST', `${API_BASE_URL}/login`, {
        email: 'test2@test.fr',
        password: 'testtest',
      }).then((response) => {
        // 1. Statut HTTP OK
        expect(response.status).to.eq(200);
  
        // 2. Le corps contient au moins des infos utilisateur ou un token
        expect(response.body).to.be.an('object');
      });
    });
  });
  