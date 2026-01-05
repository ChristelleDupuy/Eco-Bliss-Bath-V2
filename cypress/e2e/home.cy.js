describe('Eco Bliss Bath - accueil', () => {
  it('doit afficher la page', () => {
    cy.visit('http://localhost:4200/')
    cy.contains('Eco')
  })
})