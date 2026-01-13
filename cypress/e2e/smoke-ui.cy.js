describe('Smoke UI - Eco Bliss Bath', () => {
    const FRONT_BASE_URL = 'http://localhost:4200';
    const API_BASE_URL = 'http://localhost:8081';
  
    // Helper pour routes Angular en hash (#)
    const visitHashRoute = (hashPath) => {
      // hashPath doit commencer par "/"
      cy.visit(`${FRONT_BASE_URL}/#${hashPath}`);
    };
  
    it('API répond (healthcheck)', () => {
      cy.request(`${API_BASE_URL}/api/health`)
        .its('status')
        .should('eq', 200);
    });
  
    it('La home se charge', () => {
      cy.visit(FRONT_BASE_URL);
  
      // App Angular chargée
      cy.document().its('readyState').should('eq', 'complete');
      cy.get('body').should('be.visible').and('not.be.empty');
  
      // Vérifie qu'on est bien sur le front
      cy.location('host').should('eq', 'localhost:4200');
    });
  
    it('La page Produits (catalogue) est accessible', () => {
      cy.visit(FRONT_BASE_URL);
  
      // Clique sur "Produits" si présent, sinon fallback sur la route hash
      cy.contains('a, button', /produits/i).then(($el) => {
        if ($el.length) cy.wrap($el.first()).click({ force: true });
        else visitHashRoute('/products');
      });
  
      cy.get('body').should('be.visible');
  
      // Smoke assertion "souple" : on veut juste confirmer que la page n'est pas vide
      // et qu'il y a des indices de produits.
      cy.contains(/produit|produits|€|eur|prix/i, { matchCase: false }).should('exist');
    });
  
    it('La page Connexion est accessible', () => {
      cy.visit(FRONT_BASE_URL);
  
      cy.contains('a, button', /connexion|login|se connecter/i).then(($el) => {
        if ($el.length) cy.wrap($el.first()).click({ force: true });
        else visitHashRoute('/login');
      });
  
      cy.get('body').should('be.visible');
  
      // Smoke : présence d'un formulaire de connexion
      cy.get('input').should('have.length.greaterThan', 0);
      cy.contains(/se connecter|connexion/i, { matchCase: false }).should('exist');
    });
  
    it('Le panier (orders) est accessible ou redirige vers login si non connecté', () => {
      // Le panier côté app = "orders"
      visitHashRoute('/orders');
  
      cy.get('body').should('be.visible');
  
      // On accepte 2 comportements valides :
      // - soit l'utilisateur est connecté => on reste sur /#/orders
      // - soit non connecté => redirection vers /#/login (comportement attendu)
      cy.location('hash').then((hash) => {
        const normalized = (hash || '').toLowerCase();
  
        const onOrders = normalized.includes('/orders');
        const onLogin = normalized.includes('/login');
  
        expect(onOrders || onLogin, `Hash should contain /orders or /login, got: ${hash}`).to.eq(true);
      });
  
      // Et on vérifie qu'on n'a pas d'erreur "brute" affichée (Angular crash)
      cy.contains(/error|exception|stack trace/i, { matchCase: false }).should('not.exist');
  
      // Si on est sur login, on confirme que la page login est bien affichée (smoke)
      cy.location('hash').then((hash) => {
        if ((hash || '').toLowerCase().includes('/login')) {
          cy.contains(/se connecter|connexion/i, { matchCase: false }).should('exist');
        }
      });
    });
  });
  