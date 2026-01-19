describe('API Products - Eco Bliss Bath (product detail)', () => {
    const API_BASE_URL = 'http://localhost:8081';
  
    it('GET /products/{id} doit renvoyer un produit cohérent (id existant)', () => {
      cy.request(`${API_BASE_URL}/products`).then((listRes) => {
        expect(listRes.status).to.eq(200);
        expect(listRes.body).to.be.an('array').and.not.be.empty;
  
        const product = listRes.body[0];
        expect(product).to.have.property('id');
  
        cy.request(`${API_BASE_URL}/products/${product.id}`).then((detailRes) => {
          expect(detailRes.status).to.eq(200);
          expect(detailRes.body).to.be.an('object');
          expect(detailRes.body).to.have.property('id', product.id);
          expect(detailRes.body).to.have.property('name');
          expect(detailRes.body).to.have.property('price');
        });
      });
    });
  });
  