describe("API Cart - Eco Bliss Bath (in stock)", () => {
    const API_BASE_URL = "http://localhost:8081";
  
    function registerAndLogin() {
      const uniq = Date.now();
      const email = `qa+cart_instock_${uniq}@ecoblissbath.test`;
      const password = "Password123!";
  
      return cy
        .request({
          method: "POST",
          url: `${API_BASE_URL}/register`,
          headers: { "Content-Type": "application/json" },
          body: {
            email,
            firstname: "QA",
            lastname: "Test",
            plainPassword: {
              first: password,
              second: password,
            },
          },
          failOnStatusCode: false,
        })
        .then((reg) => {
          expect([200, 201]).to.include(reg.status);
  
          return cy.request({
            method: "POST",
            url: `${API_BASE_URL}/login`,
            headers: { "Content-Type": "application/json" },
            body: { username: email, password },
          });
        })
        .then((loginRes) => {
          expect(loginRes.status).to.eq(200);
          expect(loginRes.body).to.have.property("token");
          return loginRes.body.token;
        });
    }
  
    function getInStockProductId() {
      return cy
        .request(`${API_BASE_URL}/products`)
        .then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.be.an("array").and.not.be.empty;
  
          const inStock = res.body.find(
            (p) => typeof p.availableStock === "number" && p.availableStock > 0
          );
  
          expect(inStock, "Produit avec stock > 0").to.exist;
          return inStock.id;
        });
    }
  
    it("Ajouter un produit en stock dans le panier doit réussir (200) et contenir la ligne", () => {
      registerAndLogin().then((token) => {
        getInStockProductId().then((productId) => {
          cy.request({
            method: "PUT",
            url: `${API_BASE_URL}/orders/add`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: { product: productId, quantity: 1 },
          }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property("orderLines");
            expect(res.body.orderLines).to.be.an("array");
  
            const line = res.body.orderLines.find(
              (l) => l.product && l.product.id === productId
            );
            expect(line, "Ligne panier pour le produit ajouté").to.exist;
            expect(line).to.have.property("quantity");
            expect(line.quantity).to.be.greaterThan(0);
          });
        });
      });
    });
  });