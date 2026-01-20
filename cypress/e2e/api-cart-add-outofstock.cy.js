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
            plainPassword: { first: password, second: password },
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
  
    function getProducts() {
      return cy.request(`${API_BASE_URL}/products`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an("array").and.not.be.empty;
        return res.body;
      });
    }
  
    function getOutOfStockProduct() {
      return getProducts().then((products) => {
        const oos = products.find((p) => Number(p.availableStock) <= 0);
        expect(oos, "Produit hors stock (<= 0)").to.exist;
        return oos;
      });
    }
  
    function getLimitedStockProduct() {
      return getProducts().then((products) => {
        const limited = products.find(
          (p) => Number(p.availableStock) > 0 && Number(p.availableStock) < 10
        );
        expect(limited, "Produit avec stock limité (1..9)").to.exist;
        return limited;
      });
    }
  
    function getCurrentCart(token) {
      return cy.request({
        method: "GET",
        url: `${API_BASE_URL}/orders`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      });
    }
  
    function addToCart(token, productId, quantity) {
      return cy.request({
        method: "PUT",
        url: `${API_BASE_URL}/orders/add`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { product: productId, quantity },
        failOnStatusCode: false,
      });
    }
  
    function findLineByProductId(order, productId) {
      const lines = order?.orderLines || [];
      return lines.find((l) => l?.product?.id === productId);
    }
  
    it("Produit hors stock : le panier ne doit pas contenir le produit après tentative d'ajout", () => {
      registerAndLogin().then((token) => {
        getOutOfStockProduct().then((product) => {
          getCurrentCart(token).then((before) => {
            expect([200, 404]).to.include(before.status);
  
            const beforeOrder = before.status === 200 ? before.body : null;
            const beforeLine = beforeOrder ? findLineByProductId(beforeOrder, product.id) : null;
            const beforeQty = beforeLine?.quantity ?? 0;
  
            addToCart(token, product.id, 1).then((addRes) => {
              expect(addRes.status).to.eq(200);
  
              getCurrentCart(token).then((after) => {
                expect(after.status).to.eq(200);
  
                const afterLine = findLineByProductId(after.body, product.id);
                const afterQty = afterLine?.quantity ?? 0;
  
                expect(
                  afterQty,
                  `BUG si > ${beforeQty} : produit hors stock ajouté (productId=${product.id}, stock=${product.availableStock})`
                ).to.eq(beforeQty);
              });
            });
          });
        });
      });
    });
  
    it("Quantité > stock : la quantité en panier ne doit pas dépasser le stock disponible", () => {
      registerAndLogin().then((token) => {
        getLimitedStockProduct().then((product) => {
          const stock = Number(product.availableStock);
          const requested = stock + 1;
  
          addToCart(token, product.id, requested).then((addRes) => {
            expect(addRes.status).to.eq(200);

            getCurrentCart(token).then((after) => {
              expect(after.status).to.eq(200);
  
              const afterLine = findLineByProductId(after.body, product.id);
              const afterQty = afterLine?.quantity ?? 0;
  
              expect(
                afterQty,
                `BUG si > ${stock} : quantité en panier dépasse le stock (productId=${product.id})`
              ).to.be.at.most(stock);
            });
          });
        });
      });
    });
  });
  