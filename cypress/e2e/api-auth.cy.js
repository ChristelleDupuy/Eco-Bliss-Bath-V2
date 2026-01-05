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
        const product = products[0];
        expect(product).to.be.an('object');
  
        // adapte ces propriétés si besoin après
        expect(product).to.have.property('id');
        expect(product).to.have.property('name');
        expect(product).to.have.property('price');
      });
    });

    it('GET /products/{id} doit renvoyer un produit cohérent', () => {
        // 1) On récupère un produit au hasard
        cy.request(`${API_BASE_URL}/products/random`).then((randomResponse) => {
          expect(randomResponse.status).to.eq(200);
    
          const products = randomResponse.body;
          expect(products).to.be.an('array').and.to.have.length.greaterThan(0);
    
          const productFromRandom = products[0];
          const id = productFromRandom.id;
    
          // 2) On appelle /products/{id} avec cet id
          cy.request(`${API_BASE_URL}/products/${id}`).then((response) => {
            // Statut OK
            expect(response.status).to.eq(200);
    
            // Corps correct
            const product = response.body;
            expect(product).to.be.an('object');
    
            // Même id que celui récupéré avant
            expect(product.id).to.eq(id);
    
            // Propriétés principales
            expect(product).to.have.property('name');
            expect(product).to.have.property('price');
          });
        });
      });
    });