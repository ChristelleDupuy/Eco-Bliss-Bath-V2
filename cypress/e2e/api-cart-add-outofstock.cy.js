describe("API Cart - Eco Bliss Bath (out of stock)", () => {
    const API_BASE_URL = "http://localhost:8081";
  
    function registerAndLogin() {
      const uniq = Date.now();
      const email = `qa+cart_outofstock_${uniq}@ecoblissbath.test`;
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
  
    function getOutOfStockProductId() {
      return cy
        .request(`${API_BASE_URL}/products`)
        .then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.be.an("array").and.not.be.empty;
  
          const oos = res.body.find((p) => p.availableStock === 0);
  
          expect(oos, "Produit avec stock = 0").to.exist;
          return oos.id;
        });
    }
  
    it("Ajouter un produit hors stock dans le panier doit échouer (4xx)", () => {
      registerAndLogin().then((token) => {
        getOutOfStockProductId().then((productId) => {
          cy.request({
            method: "PUT",
            url: `${API_BASE_URL}/orders/add`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: { product: productId, quantity: 1 },
            failOnStatusCode: false,
          }).then((res) => {
            expect(res.status, `Status reçu: ${res.status}`).to.be.gte(400).and.lt(500);
  
            if (res.body && typeof res.body === "object") {
              console.log("Réponse out-of-stock:", res.body);
            }
          });
        });
      });
    });
  });
  