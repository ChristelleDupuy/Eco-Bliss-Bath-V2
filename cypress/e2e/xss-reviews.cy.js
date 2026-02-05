describe('Sécurité - Injection HTML/XSS sur espace commentaire (Reviews)', () => {
  const FRONT_BASE_URL = 'http://localhost:4200';
  const API_BASE_URL = 'http://localhost:8081';

  const findInBody = ($body, selectors) => {
    for (const sel of selectors) {
      const $el = $body.find(sel);
      if ($el.length) return $el.first();
    }
    return null;
  };

  const ensureReviewFormVisible = () => {
    const commentSelectors = [
      '#comment',
      'input#comment',
      'textarea#comment',
      'input[formcontrolname="comment"]',
      'textarea[formcontrolname="comment"]',
      'input[name="comment"]',
      'textarea[name="comment"]',
    ];

    cy.get('body', { timeout: 15000 }).then(($body) => {
      const $comment = findInBody($body, commentSelectors);

      if ($comment) return;

      const $openBtn = $body
        .find('button, a')
        .filter((_, el) =>
          /ajouter|donner|laisser|écrire|ecrire|créer|creer|nouvel/i.test(
            (el.innerText || '').toLowerCase()
          )
        )
        .first();

      if ($openBtn.length) {
        cy.wrap($openBtn).click({ force: true });
      }
    });

    cy.get(
      '#comment, input#comment, textarea#comment, input[formcontrolname="comment"], textarea[formcontrolname="comment"], input[name="comment"], textarea[name="comment"]',
      { timeout: 15000 }
    ).should('exist');
  };

  it('Doit détecter une faille si le HTML injecté est interprété', () => {
    const email = `xss-${Date.now()}@test.com`;
    const password = 'Password123!';
    const title = `Test XSS ${Date.now()}`;
    const payload = `<img src=x onerror="window.__xssExecuted=true">`;

    cy.request({
      method: 'POST',
      url: `${API_BASE_URL}/register`,
      body: {
        email,
        firstname: 'Xss',
        lastname: 'Tester',
        plainPassword: { first: password, second: password },
      },
      failOnStatusCode: false,
    }).its('status').should('be.oneOf', [200, 201]);

    cy.visit(`${FRONT_BASE_URL}/#/login`);

    cy.get('input#username', { timeout: 15000 })
      .should('be.visible')
      .clear({ force: true })
      .type(email, { force: true });

    cy.get('input#password', { timeout: 15000 })
      .should('be.visible')
      .clear({ force: true })
      .type(password, { force: true });

    cy.contains('button', /se connecter|login/i, { timeout: 15000 }).click({ force: true });
    cy.url({ timeout: 15000 }).should('not.include', '/login');

    cy.visit(`${FRONT_BASE_URL}/#/reviews`);
    cy.get('body', { timeout: 15000 }).should('be.visible');

    cy.window().then((win) => {
      win.__xssExecuted = false;
    });

    ensureReviewFormVisible();

    cy.get('body').then(($body) => {
      const titleSelectors = [
        '#title',
        'input#title',
        'input[formcontrolname="title"]',
        'input[name="title"]',
      ];

      const commentSelectors = [
        '#comment',
        'input#comment',
        'textarea#comment',
        'input[formcontrolname="comment"]',
        'textarea[formcontrolname="comment"]',
        'input[name="comment"]',
        'textarea[name="comment"]',
      ];

      const $title = findInBody($body, titleSelectors);
      const $comment = findInBody($body, commentSelectors);

      if ($title) cy.wrap($title).clear({ force: true }).type(title, { force: true });
      expect($comment, 'champ commentaire introuvable').to.not.equal(null);
      cy.wrap($comment).clear({ force: true }).type(payload, { force: true });
    });

    cy.contains('button', /publier|envoyer|valider/i, { timeout: 15000 }).click({ force: true });

    cy.wait(800);

    cy.window().its('__xssExecuted').should('eq', false);
    cy.get('img[src="x"]', { timeout: 5000 }).should('not.exist');
  });
});