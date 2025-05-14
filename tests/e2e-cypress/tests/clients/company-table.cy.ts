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
    beforeEach(() => {
        cy.visit("/clients");
      })

      it('should properly intercept company.getAll', () => {
        

      })
  });
  