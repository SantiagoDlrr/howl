
describe("Company CRUD tests", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/clients");
        cy.get('[data-cy="company-table"]', { timeout: 5000 }).should('be.visible');
      })

      /**
       * Verifies the company creation 
       * - Clicks on the new company button
       * - Writes new company data
       * - Confirms success dialog message
      */
      it('should verify a new company is created through the new company modal', () => {
        cy.fixture('clients/companies').then((companies) => {
          const company = companies.newCompany;
                // Create company
                cy.get('#new-company-btn').click();
                cy.wait(1000);
                cy.get('[data-cy="company-modal"]', { timeout: 5000 }).should('be.visible');
                cy.get('[data-cy="company-name"]').type(company.name);
                cy.get('[data-cy="company-country"]').type(company.country);
                cy.get('[data-cy="company-state"]').type(company.state);
                cy.get('[data-cy="company-city"]').type(company.city);
                cy.get('[data-cy="company-street"]').type(company.street);
                cy.get('#save-company-btn').click();
                cy.contains(`Empresa ${company.name} creada`, { timeout: 10000 });

                // Delete the company after creation
                cy.get('[data-cy="searchbar"]').clear().type(company.name);
                cy.get('[data-cy="company-table"]', { timeout: 5000 }).should('be.visible');
                cy.get('[data-cy="company-0"]').click();
                cy.get('#first-btn').click();
            })
      });

      /**
       * Verifies the edit functionality of the company table
       * - Edits a row in the company table
       * - Types new data in the edit panel
       * - Confirms the success dialog message
       * - Confirms the company data has been updated
      */
      it ('should verify that the data of a company can be modified', () => {
        // Open edit panel
        cy.createCompany('newCompany').then(() => {
          cy.get('[data-cy="edit-company-0"]').click();
          cy.fixture('clients/companies').then((companies) => {
            // Edit company data
            const company = companies.editedCompany;
            cy.get('[data-cy="company-name"]').clear().type(company.name);
            cy.get('[data-cy="company-country"]').clear().type(company.country);
            cy.get('[data-cy="company-state"]').clear().type(company.state);
            cy.get('[data-cy="company-city"]').clear().type(company.city);
            cy.get('[data-cy="company-street"]').clear().type(company.street);
            cy.get('#second-btn').click();
            cy.get('#company-close-column').click();

            // Verify that the company data has been updated
            cy.get('[data-cy="company-table"]', { timeout: 5000 }).should('be.visible');
            cy.get('[data-cy="edit-company-0"]').click();
            cy.contains(company.name, { timeout: 10000 });
            cy.contains(company.country, { timeout: 10000 });
            cy.contains(company.state, { timeout: 10000 });
            cy.contains(company.city, { timeout: 10000 });
            cy.contains(company.street, { timeout: 10000 });
          })
        })
      });

      /**
       * Verifies the search functionality of the company table
       * - Creates a new company
       * - Searches for the company using the search bar
       * - Confirms the company is found (appears in the table)
       * - Confirms the company data matches the created company
      */
      it ('should verify that a company can be searched', () => {
        cy.createCompany('searchCompany').then(() => {
          cy.fixture('clients/companies').then((companies) => {
            const company = companies.searchCompany;
            cy.get('[data-cy="searchbar"]').clear().type(company.name);
            cy.get('[data-cy="company-table"]', { timeout: 5000 }).should('be.visible');
            cy.get('[data-cy="company-0"]').click();
            cy.contains(company.name, { timeout: 10000 });
            cy.contains(company.country, { timeout: 10000 });
            cy.contains(company.state, { timeout: 10000 });
            cy.contains(company.city, { timeout: 10000 });
            cy.contains(company.street, { timeout: 10000 }); 
          });
        });
      });


     /**
       * Verifies the delete functionality of the company table
       * - Creates a new company
       * - Searches for the company using the search bar
       * - Removes the company
       * - Confirms the success dialog message
       * - Confirms the company is not found (does not appear in the table)
      */ 
      it ('should verify that a company can be deleted', () => {
        cy.createCompany('deletedCompany').then(() => {
          cy.fixture('clients/companies').then((companies) => {
            const company = companies.deletedCompany;
            cy.get('[data-cy="searchbar"]').clear().type(company.name);
            cy.get('[data-cy="company-table"]', { timeout: 5000 }).should('be.visible');
            cy.get('[data-cy="company-0"]').click();
            cy.get('#first-btn').click();
            cy.contains(`Empresa ${company.name} eliminada`, { timeout: 10000 });
            cy.wait(1000);
            cy.get('[data-cy="company-table"]', { timeout: 5000 }).should('be.visible');
            cy.contains(company.name).should('not.exist');
          })
        })
      });

  });
  