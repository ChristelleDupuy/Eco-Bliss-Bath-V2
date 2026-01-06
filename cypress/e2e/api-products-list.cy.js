describe('API Produits - liste complète', () => {
    const API_BASE_URL = 'http://localhost:8081';
  
    it('GET /products doit renvoyer une liste de produits valides', () => {
      cy.request(`${API_BASE_URL}/products`).then((response) => {
        // Statut HTTP OK
        expect(response.status).to.eq(200);
  
        // Le corps doit être un tableau
        const products = response.body;
        expect(products).to.be.an('array');
        expect(products.length).to.be.greaterThan(0);
  
        // Vérifier la structure d'un produit
        const product = products[0];
        expect(product).to.be.an('object');
  
        expect(product).to.have.property('id');
        expect(product).to.have.property('name');
        expect(product).to.have.property('price');
      });
    });
  });
  