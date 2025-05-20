/// <reference types="cypress" />
declare global {
    namespace Cypress {
      interface Chainable {
        login(): Chainable<void>;
        signup(): Chainable<void>;
        maybeSignup(): Chainable<void>;
        createCompany(key: string): Chainable<void>;
        createClient(key: string): Chainable<void>;
        removeClient(key: string): Chainable<void>;
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
      cy.wait(5000);
});

Cypress.Commands.add('login', () => {
    cy.visit('/auth?mode=login');
    cy.fixture('auth/sign-up-users').then((users) => {
        const user = users.loginUser;
        cy.get('[data-testid="login-email"]').type(user.email);
        cy.get('[data-testid="login-password"]').type(user.password);
        cy.get('button[type="submit"]').click();
      });
      cy.url().should('include', '/main', { timeout: 35000 });
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
    cy.visit('/clients');
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

Cypress.Commands.add('createClient', (key: string) => {
  cy.visit('/clients');
  cy.get('[data-cy="company-table"]', { timeout: 5000 }).should('be.visible');
  cy.createCompany('newCompany').then(() => {
    cy.get('#toggle-2').click();
    cy.get('[data-cy="client-table"]', { timeout: 5000 }).should('be.visible');
  });
  cy.fixture('clients/clients').then((clients) => {
      const client = clients[key];
      cy.get('[data-cy="client-table-element"] tbody').then($tableBody => {
        const clientExists = $tableBody.text().includes(client.firstname);
        console.log("client exists", clientExists);
        // const contains = cy.contains(client.name);
        if (!clientExists) {
          cy.get('#new-client-btn').click();
          cy.wait(1000);
          cy.get('[data-cy="client-modal"]', { timeout: 5000 }).should('be.visible');
          cy.get('[data-cy="client-firstname"]').type(client.firstname);
          cy.get('[data-cy="client-lastname"]').type(client.lastname);
          cy.get('[data-cy="client-email"]').type(client.email);
          cy.get('[data-cy="client-company"]').select(client.company);
          cy.get('#save-client-btn').click();
        }
      })
  })
});

Cypress.Commands.add('removeClient', (key: string) => {
  cy.visit('/clients');
  cy.get('[data-cy="company-table"]', { timeout: 5000 }).should('be.visible');
  cy.get('#toggle-2').click();
  cy.get('[data-cy="client-table"]', { timeout: 5000 }).should('be.visible');
  
  cy.fixture('clients/clients').then((clients) => {
      const client = clients[key];
      cy.get('[data-cy="client-table-element"] tbody').then($tableBody => {
        const clientExists = $tableBody.text().includes(client.firstname);
        console.log("client exists", clientExists);
        // const contains = cy.contains(client.name);
        if (clientExists) {
          cy.get('[data-cy="searchbar"]').clear().type(client.firstname);
          cy.get('[data-cy="client-table"]', { timeout: 5000 }).should('be.visible');
          cy.get('[data-cy="client-0"]').click();
          cy.get('#first-btn').click();
        }
      })
  })
});