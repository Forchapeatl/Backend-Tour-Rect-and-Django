describe('filters items', () => {
  it('filters items by using search', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Difficulty Rating').should('exist');
    cy.contains('Learn more!').should('exist');

    cy.get('input[name=search]').type('hiking');
    cy.contains('Apply').click();
    cy.contains('Learn more!').should('exist');
  });
})
