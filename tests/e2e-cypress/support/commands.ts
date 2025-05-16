/// <reference types="cypress" />
declare global {
    namespace Cypress {
      interface Chainable {
        login(): Chainable<void>;
        signup(): Chainable<void>;
        maybeSignup(): Chainable<void>;
        createCompany(key: string): Chainable<void>;
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
      cy.url().should('include', '/main', { timeout: 20000 });
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

Cypress.Commands.add('createCompany', (key: string) => {
  
  
    cy.fixture('clients/companies').then((companies) => {
        const company = companies[key];
        cy.get('[data-cy="company-table-element"] tbody').then($tableBody => {
          const companyExists = $tableBody.text().includes(company.name);
          console.log("compnay exists", companyExists);
          // const contains = cy.contains(company.name);
          if (!companyExists) {
            cy.get('#new-company-btn').click();
            cy.wait(1000);
            cy.get('[data-cy="company-modal"]', { timeout: 5000 }).should('be.visible');
            cy.get('[data-cy="company-name"]').type(company.name);
            cy.get('[data-cy="company-country"]').type(company.country);
            cy.get('[data-cy="company-state"]').type(company.state);
            cy.get('[data-cy="company-city"]').type(company.city);
            cy.get('[data-cy="company-street"]').type(company.street);
            cy.get('#save-company-btn').click();
          }
        })
    })
});