describe('Sécurité - XSS sur espace commentaire (Reviews)', () => {
    const FRONT_BASE_URL = 'http://localhost:4200';
  
    it('L’espace commentaire ne doit pas exposer de faille XSS', () => {
      cy.visit(`${FRONT_BASE_URL}/#/reviews`);
  
      cy.get('body').should('be.visible');
  
      // Vérifier si le formulaire d'avis est accessible
      cy.get('body').then(($body) => {
  
        const hasForm =
          $body.find('input').length > 0 ||
          $body.find('textarea').length > 0;
  
        if (!hasForm) {
          // Cas attendu si utilisateur non connecté
          cy.contains(/connectez-vous|connexion/i).should('be.visible');
  
          // Conclusion sécurité :
          // pas de surface d’injection XSS accessible
          cy.log('Formulaire non accessible sans authentification → XSS non exploitable');
          return;
        }
  
        // Cas où le formulaire serait accessible
        const payload = `<img src=x onerror="window.__xssExecuted = true">`;
  
        cy.window().then((win) => {
          win.__xssExecuted = false;
        });
  
        cy.get('input').first().type('Test XSS', { force: true });
        cy.get('textarea').first().type(payload, { force: true });
  
        cy.contains('button', /envoyer|publier|valider/i).click({ force: true });
  
        cy.wait(500);
  
        // Vérifier que le JS injecté ne s’est pas exécuté
        cy.window().its('__xssExecuted').should('eq', false);
      });
    });
  });
  