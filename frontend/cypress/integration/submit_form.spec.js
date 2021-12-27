describe('checkout form', () => {
  it('adds item to cart and submits checkout form', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Learn more!').click();
    cy.contains('Reserve').click();
    cy.get('[name=name]').type('name');
    cy.get('[name=email_address]').type('email@localhost')
    cy.get('[name=street_address]').type('123 Address St.');
    cy.get('[name=city]').type('City');
    cy.contains('Place order').click();
    cy.get('li.error').should('have.length', 0);
    cy.contains('Thanks for buying').should('exist');
  });
})
