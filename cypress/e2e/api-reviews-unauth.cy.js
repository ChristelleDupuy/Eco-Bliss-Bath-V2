describe('API Reviews - Eco Bliss Bath (unauthorized)', () => {
    const API_BASE_URL = 'http://localhost:8081';
  
    it('POST /reviews sans être connecté doit retourner 403', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/reviews`,
        failOnStatusCode: false,
        headers: { 'Content-Type': 'application/json' },
        body: {
          title: 'Unauthorized review',
          comment: 'Should be forbidden',
          rating: 5,
        },
      }).then((res) => {
        expect([401, 403]).to.include(res.status);
      });
    });
  });
  