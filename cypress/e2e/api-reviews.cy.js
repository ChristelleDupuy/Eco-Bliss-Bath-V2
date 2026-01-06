describe('API Reviews - Eco Bliss Bath', () => {
    const API_BASE_URL = 'http://localhost:8081';
  
    it('GET /reviews renvoie une liste d\'avis valides', () => {
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
  });
  