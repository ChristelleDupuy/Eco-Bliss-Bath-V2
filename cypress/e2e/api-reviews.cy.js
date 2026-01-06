describe('API Reviews - Eco Bliss Bath', () => {
    const API_BASE_URL = 'http://localhost:8081';
  
    // Petit helper pour créer un user + récupérer un token
    const createUserAndLogin = () => {
      const email = `cypress-reviewer+${Date.now()}@ecoblissbath.test`;
      const password = 'password';
  
      const newUser = {
        email,
        firstname: 'Cypress',
        lastname: 'Reviewer',
        plainPassword: {
          first: password,
          second: password,
        },
      };
  
      // On retourne une "promise Cypress" qui nous donnera { email, token }
      return cy
        .request('POST', `${API_BASE_URL}/register`, newUser)
        .then(() => {
          return cy
            .request('POST', `${API_BASE_URL}/login`, {
              username: email,
              password,
            })
            .then((loginResponse) => {
              expect(loginResponse.status).to.eq(200);
              expect(loginResponse.body).to.have.property('token');
  
              return {
                email,
                token: loginResponse.body.token,
              };
            });
        });
    };
  
    it("GET /reviews renvoie une liste d'avis valides", () => {
      cy.request(`${API_BASE_URL}/reviews`).then((response) => {
        // Statut OK
        expect(response.status).to.eq(200);
  
        // Corps = tableau
        const reviews = response.body;
        expect(reviews).to.be.an('array');
        expect(reviews.length).to.be.greaterThan(0);
  
        // Vérifie un avis
        const review = reviews[0];
  
        expect(review).to.be.an('object');
  
        // Champs obligatoires
        expect(review).to.have.property('title');
        expect(review).to.have.property('comment');
  
        // Rating (si présent)
        if (review.rating !== undefined && review.rating !== null) {
          expect(review.rating).to.be.within(1, 5);
        }
      });
    });
  
    it('POST /reviews permet de créer un avis valide', () => {
      createUserAndLogin().then(({ token }) => {
        const newReview = {
          title: 'Avis créé par Cypress',
          comment: 'Très bon produit, je recommande.',
          rating: 4,
        };
  
        cy.request({
          method: 'POST',
          url: `${API_BASE_URL}/reviews`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: newReview,
        }).then((response) => {
          expect([200, 201]).to.include(response.status);
  
          const created = response.body;
  
          expect(created).to.be.an('object');
          expect(created).to.have.property('id');
          expect(created).to.have.property('title', newReview.title);
          expect(created).to.have.property('comment', newReview.comment);
  
          if (created.rating !== undefined && created.rating !== null) {
            expect(created.rating).to.be.within(1, 5);
          }
        });
      });
    });
  });
  