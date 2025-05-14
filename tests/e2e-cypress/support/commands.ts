/// <reference types="cypress" />
declare global {
    namespace Cypress {
      interface Chainable {
        login(): Chainable<void>;
        signup(): Chainable<void>;
        maybeSignup(): Chainable<void>;
        mockTrpcQuery(procedure: string, data: any): Chainable<void>;
      }
    }
}

Cypress.Commands.add('signup', () => {
    cy.visit('/auth?mode=signup');
    cy.fixture('auth/sign-up-users').then((users) => {
        const user = users.loginUser;
        console.log(user);
        cy.get('[data-testid="signup-name"]').type(user.name);
        cy.get('[data-testid="signup-email"]').type(user.email);
        cy.get('[data-testid="signup-password"]').type(user.password);
        cy.get('button[type="submit"]').click();
      });
      cy.url().should('include', '/auth?mode=login', { timeout: 10000 });
});

Cypress.Commands.add('login', () => {
    cy.visit('/auth?mode=login');
    cy.fixture('auth/sign-up-users').then((users) => {
        const user = users.loginUser;
        cy.get('[data-testid="login-email"]').type(user.email);
        cy.get('[data-testid="login-password"]').type(user.password);
        cy.get('button[type="submit"]').click();
      });
      cy.url().should('include', '/main', { timeout: 10000 });
});

Cypress.Commands.add('maybeSignup', () => {
    cy.task('checkUserCreated').then((created) => {
      if (!created) {
        cy.signup().then(() => {
          cy.task('setUserCreated');
        });
      }
    });
});