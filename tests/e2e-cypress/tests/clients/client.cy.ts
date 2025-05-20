
describe("Client CRUD tests", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/clients");
        cy.get('[data-cy="company-table"]', { timeout: 5000 }).should('be.visible');
        cy.createCompany('newCompany').then(() => {
          cy.get('#toggle-2').click();
          cy.get('[data-cy="client-table"]', { timeout: 5000 }).should('be.visible');
        });
      })

    //   /**
    //    * Verifies the client creation 
    //    * - Clicks on the new client button
    //    * - Writes new client data
    //    * - Confirms success dialog message
    //   */
      it('US26T1 - should verify a new client is created through the new client modal', () => {
        cy.fixture('clients/clients').then((clients) => {
          const client = clients.newClient;
                // Create clienC
                cy.get('#new-client-btn').click();
                cy.wait(1000);
                cy.get('[data-cy="client-modal"]', { timeout: 5000 }).should('be.visible');
                cy.get('[data-cy="client-firstname"]').type(client.firstname);
                cy.get('[data-cy="client-lastname"]').type(client.lastname);
                cy.get('[data-cy="client-email"]').type(client.email);
                cy.get('[data-cy="client-company"]').select(client.company);
                cy.get('#save-client-btn').click();
                cy.contains(`Cliente ${client.firstname} ${client.lastname} creado`, { timeout: 10000 });

                // // Delete the client after creation
                cy.removeClient('newClient')
        })
      });

    //   /**
    //    * Verifies the edit functionality of the client table
    //    * - Edits a row in the client table
    //    * - Types new data in the edit panel
    //    * - Confirms the success dialog message
    //    * - Confirms the client data has been updated
    //   */
      it ('US26T2 - should verify that the data of a client can be modified', () => {
        // Open edit panel
        cy.createClient('newClient').then(() => {
          cy.get('#edit-client-0').click();
          cy.fixture('clients/clients').then((clients) => {
            // Edit client data
            const client = clients.editedClient;
            const previousClient = clients.newClient;
            cy.get('[data-cy="client-firstname"]').clear().type(client.firstname);
            cy.get('[data-cy="client-lastname"]').clear().type(client.lastname);
            cy.get('[data-cy="client-email"]').clear().type(client.email);
            cy.get('[data-cy="client-company"]').select(client.company);
            cy.get('#second-btn').click();
            cy.get('#close-column').click();

            // Verify that the client data has been updated
            cy.get('[data-cy="client-table"]', { timeout: 5000 }).should('be.visible');
            cy.get('#edit-client-0').click();
            cy.contains(`Cliente ${previousClient.firstname} ${previousClient.lastname} actualizado`, { timeout: 10000 });
            cy.contains(client.firstname, { timeout: 10000 });
            cy.contains(client.lastname, { timeout: 10000 });
            cy.contains(client.email, { timeout: 10000 });
            cy.contains(client.company, { timeout: 10000 });

            // Delete the client after creation
            cy.removeClient('editedClient')
          })
        })
      });

    //   /**
    //    * Verifies the search functionality of the client table
    //    * - Creates a new client
    //    * - Searches for the client using the search bar
    //    * - Confirms the client is found (appears in the table)
    //    * - Confirms the client data matches the created client
    //   */
      it ('US26T3 - should verify that a client can be searched', () => {
        cy.createClient('searchClient').then(() => {
          cy.fixture('clients/clients').then((clients) => {
            const client = clients.searchClient;
            cy.get('[data-cy="searchbar"]').clear().type(client.firstname);
            cy.get('[data-cy="client-table"]', { timeout: 5000 }).should('be.visible');
            cy.get('[data-cy="client-0"]').click();
            cy.contains(client.firstname, { timeout: 10000 });
            cy.contains(client.lastname, { timeout: 10000 });
            cy.contains(client.email, { timeout: 10000 });
            cy.contains(client.company, { timeout: 10000 });
          });
        });
        cy.removeClient('searchClient')
      });


    //  /**
    //    * Verifies the delete functionality of the client table
    //    * - Creates a new client
    //    * - Searches for the client using the search bar
    //    * - Removes the client
    //    * - Confirms the success dialog message
    //    * - Confirms the client is not found (does not appear in the table)
    //   */ 
      it ('US26T4 - should verify that a client can be deleted', () => {
        cy.createClient('deletedClient').then(() => {
          cy.fixture('clients/clients').then((clients) => {
            const client = clients.deletedClient;
            cy.get('[data-cy="searchbar"]').clear().type(client.firstname);
            cy.get('[data-cy="client-table"]', { timeout: 5000 }).should('be.visible');
            cy.get('[data-cy="client-0"]').click();
            cy.get('#first-btn').click();
            cy.contains(`Cliente ${client.firstname} ${client.lastname} eliminado`, { timeout: 10000 });
            cy.wait(1000);
            cy.get('[data-cy="client-table"]', { timeout: 5000 }).should('be.visible');
            cy.contains(client.firstname).should('not.exist');
          })
        })
      });

  });
  