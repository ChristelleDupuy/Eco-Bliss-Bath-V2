describe('API Produits - limite', () => {
    const API_BASE_URL = 'http://localhost:8081';
  
    it('GET /products/random ne renvoie pas plus de 20 produits', () => {
      cy.request(`${API_BASE_URL}/products/random`).then((response) => {
        expect(response.status).to.eq(200);
  
        const products = response.body;
  
        expect(products).to.be.an('array');
  
        expect(products.length).to.be.at.most(20);
      });
    });
  });
  