describe('Fonctionnel - Connexion utilisateur', () => {
    const FRONT_BASE_URL = 'http://localhost:4200';
    const API_BASE_URL = 'http://localhost:8081';
  
    function createTestUser() {
      const unique = Date.now();
      return {
        email: `cypress-ui-${unique}@ecoblissbath.test`,
        firstname: 'Cypress',
        lastname: 'UI',
        plainPassword: 'password',
      };
    }
  
    function registerUser(user) {
      return cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/register`,
        failOnStatusCode: false,
        body: user,
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => {
        
        expect([200, 201]).to.include(res.status);
        return user;
      });
    }
  
    it('Un utilisateur peut se connecter via l’UI (login) et ne reste pas sur la page /login', () => {
      const user = createTestUser();
  
      // 1) On crée un user valide côté API
      registerUser(user);
  
      // 2) On se connecte via l’UI
      cy.visit(`${FRONT_BASE_URL}/#/login`);
  
      cy.intercept('POST', `${API_BASE_URL}/login`).as('loginRequest');
  
      cy.get('input').then(($inputs) => {
        
        cy.wrap($inputs.eq(0)).clear({ force: true }).type(user.email, { force: true });
        cy.wrap($inputs.eq(1)).clear({ force: true }).type(user.plainPassword, { force: true });
      });
  
      cy.contains('button', /se connecter|connexion|login/i).click({ force: true });
  
      // 3) Assert API login OK
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('token');
      });
  
      // 4) Assert navigation (on ne doit plus être sur #/login)
      cy.location('hash', { timeout: 10000 }).should('not.include', '/login');
    });
  });
  