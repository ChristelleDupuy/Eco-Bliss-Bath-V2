describe('API Produits - Eco Bliss Bath', () => {
    const API_BASE_URL = 'http://localhost:8081';
  
    it('GET /products/random doit renvoyer des produits valides', () => {
      cy.request(`${API_BASE_URL}/products/random`).then((response) => {
        // 1. Statut HTTP OK
        expect(response.status).to.eq(200);
  
        // 2. Le corps est un tableau de produits
        const products = response.body;
        expect(products).to.be.an('array');
        expect(products.length).to.be.greaterThan(0);
  
        // 3. Chaque produit du tableau a une structure correcte
        const product = products[0]; // on teste le premier pour commencer
        expect(product).to.be.an('object');
  
        // adapte ces propriétés si besoin après
        expect(product).to.have.property('id');
        expect(product).to.have.property('name');
        expect(product).to.have.property('price');
      });

    });
  });  