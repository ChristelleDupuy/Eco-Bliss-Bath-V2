describe('Fonctionnel - Panier / Commande (orders)', () => {
    const FRONT_BASE_URL = 'http://localhost:4200';
    const API_BASE_URL = 'http://localhost:8081';
  
    function createTestUser() {
      const unique = Date.now();
      return {
        email: `cypress-cart-${unique}@ecoblissbath.test`,
        firstname: 'Cypress',
        lastname: 'Cart',
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
  
    function loginUI(user) {
      cy.visit(`${FRONT_BASE_URL}/#/login`);
      cy.intercept('POST', `${API_BASE_URL}/login`).as('loginRequest');
  
      cy.get('input').then(($inputs) => {
        cy.wrap($inputs.eq(0)).clear({ force: true }).type(user.email, { force: true });
        cy.wrap($inputs.eq(1)).clear({ force: true }).type(user.plainPassword, { force: true });
      });
  
      cy.contains('button', /se connecter|connexion|login/i).click({ force: true });
  
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('token');
      });
  
      cy.location('hash', { timeout: 10000 }).should('not.include', '/login');
    }
  
    it("Après connexion, l'utilisateur peut accéder à /orders (panier en cours)", () => {
      const user = createTestUser();
  
      // 1) user valide
      registerUser(user);
  
      // 2) login UI OK
      loginUI(user);
  
      // 3) accès au panier / orders
      cy.visit(`${FRONT_BASE_URL}/#/orders`);
  
      cy.location('hash', { timeout: 10000 }).should('include', '/orders');
  
      cy.get('body').should('be.visible');
      cy.contains(/error|exception|stack trace/i).should('not.exist');
  
      cy.contains(/commande|orders|panier|cart/i, { matchCase: false }).should('exist');
    });
  });
  