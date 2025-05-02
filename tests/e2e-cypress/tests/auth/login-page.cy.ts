
describe('Auth Page', () => {
  it('renders login card when mode is login', () => {
    cy.visit('/auth?mode=login'); 
    cy.get('[data-testid="login-card"]').should('be.visible'); 
  });
  
  it ('renders signup card when mode is signup', () => {
    cy.visit('/auth?mode=signup'); 
    cy.get('[data-testid="signup-card"]').should('be.visible'); 
  });
  
});
  