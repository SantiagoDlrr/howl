
describe('Sign-up Page', () => {
    beforeEach(() => {
      cy.visit('/auth?mode=signup'); 
    });

    it ('renders signup card when mode is signup', () => {
      cy.get('[data-testid="signup-card"]').should('be.visible'); 
    });

    it('checks fields can be filled', () => {
        cy.fixture('auth/sign-up-users').then((users) => {
          const user = users.validUser;
          cy.get('[data-testid="signup-name"]').type(user.name);
          cy.get('[data-testid="signup-email"]').type(user.email);
          cy.get('[data-testid="signup-password"]').type(user.password);
      
          cy.get('[data-testid="signup-name"]').should('have.value', user.name);
          cy.get('[data-testid="signup-email"]').should('have.value', user.email);
          cy.get('[data-testid="signup-password"]').should('have.value', user.password);
        });
    });

    it('checks redirection to main after valid signup', () => {
        cy.fixture('auth/sign-up-users').then((users) => {
          const user = users.validUser;
          cy.get('[data-testid="signup-name"]').type(user.name);
          cy.get('[data-testid="signup-email"]').type(user.email);
          cy.get('[data-testid="signup-password"]').type(user.password);
          cy.get('button[type="submit"]').click();
        });
    });
    
});

