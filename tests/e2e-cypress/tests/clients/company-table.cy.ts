// cypress/e2e/createClient.cy.ts

// Define Company type locally since the import path is not valid
interface Company {
  id: number;
  name: string;
  client_since: string;
  satisfaction: number;
  address: {
    id: number;
    street: string;
    city: string;
    state: string;
    country: string;
    company_id: number;
  };
  _count: {
    client: number;
  };
}

describe("Client creation flow", () => {
    const mockCompanies: Company[] = [{
        id: 1,
        name: "Test Company",
        client_since: new Date().toISOString(),
        satisfaction: 5,
        address: {
          id: 1,
          street: "123 Test St",
          city: "Testville",
          state: "TS",
          country: "USA",
          company_id: 1
        },
        _count: { client: 0 }
      }];
    beforeEach(() => {
        cy.login();
        // cy.intercept('POST', '/api/trpc/company.getAll*', {
        //     body: mockCompanies // Direct array response matching your API
        //   }).as('getCompanies');
        // cy.mockTrpcQuery('company.getAll', mockCompanies);
        // cy.intercept('GET', '/api/trpc/company.getAll*', (req) => {
        //     req.continue((res) => {
        //       console.log('ACTUAL RESPONSE:', JSON.parse(JSON.stringify(res.body)));
        //     });
        //   }).as('realCall');
      })

      it('should properly intercept company.getAll', () => {
        // cy.intercept('GET', '/api/trpc/company.getAll*', (req) => {
        //     req.continue(res => {
        //       console.log('Actual response:', res.body);
        //     });
        //   });
        
        // cy.intercept('GET', '/api/trpc/company.getAll*', (req) => {
        //     req.continue((res) => {
        //       console.log('tRPC response:', res.body);
        //     });
        //   });
        // cy.intercept('GET', '/api/trpc/company.getAll*', (req) => {
        //     const queryId = Number(new URL(req.url).searchParams.get('batch')) || 0;
          
        //     req.reply([
        //       {
        //         id: queryId, // or whatever the actual ID is
        //         result: {
        //           data: [ {
        //             id: 1,
        //             name: "MockCorp",
        //             client_since: "2020-01-01T00:00:00.000Z",
        //             satisfaction: 10,
        //             address: {
        //               id: 100,
        //               street: "1 Mockingbird Lane",
        //               city: "Faketown",
        //               state: "FS",
        //               country: "Nowhere",
        //               company_id: 1
        //             },
        //             _count: { client: 3 }
        //           }]
        //         }
        //       }
        //     ]);
        //   });

          
          cy.visit('/clients');
        //   cy.wait('@trpc:company.getAll'); 
        // cy.wait('@getCompanies').then((interception) => {
        //     expect(interception.response?.body).to.deep.equal(mockCompanies);
        //   });
          
          // Verify UI rendering
        //   cy.contains('TechCorp').should('exist');
        //   cy.contains('Innovate Inc.').should('exist');

      })
  });
  