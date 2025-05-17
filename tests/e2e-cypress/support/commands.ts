/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
Cypress.Commands.add('visitLogsPage', () => {
    cy.visit('/logs');
  });
  
  // Comando para verificar que hay cierta cantidad de filas en la tabla
  Cypress.Commands.add('verifyTableRowCount', (count: number) => {
    cy.get('table tbody tr').should('have.length', count);
  });
  
  // Comando para verificar que un cliente está visible en la tabla
  Cypress.Commands.add('verifyClientInTable', (clientName: string, shouldExist: boolean = true) => {
    if (shouldExist) {
      cy.contains('tr', clientName).should('exist');
    } else {
      cy.contains('tr', clientName).should('not.exist');
    }
  });
  
  // Comando para verificar el rol mostrado
  Cypress.Commands.add('verifyRole', (role: string) => {
    cy.contains('Rol actual:').should('be.visible');
    cy.contains(role).should('be.visible');
  });
  
  // Comando para filtrar por compañía
  Cypress.Commands.add('filterByCompany', (company: string) => {
  // Buscar el segundo select y seleccionar la compañía
  cy.get('select').eq(1).select(company);
});
  
  // Comando para buscar un término
  Cypress.Commands.add('searchTerm', (term: string) => {
    cy.get('input[type="text"]').first().clear().type(term);
  });
  
  // Comando para restablecer filtros
  Cypress.Commands.add('resetFilters', () => {
    cy.contains('button', /Reset|Restablecer/).click();
  });
  
  // Comando para configurar un rol de usuario
  Cypress.Commands.add('setupUserRole', (role: 'consultant' | 'supervisor' | 'administrator', id: string = '101') => {
    // Configurar el rol del usuario
    let roleData = {
      userId: `user-${id}`,
      consultantId: id,
      role: role
    };
  
    cy.intercept('GET', '/api/roles', {
      statusCode: 200,
      body: roleData
    }).as('getRoles');
  
    // Si es supervisor, también configurar consultores supervisados
    if (role === 'supervisor') {
      cy.intercept('GET', `/api/supervision?supervisor_id=${id}`, {
        statusCode: 200,
        body: {
          consultants: [101, 102]
        }
      }).as('getSupervisedConsultants');
    }
  });
  
  // Comando para configurar datos de llamadas
  Cypress.Commands.add('setupCallLogs', (empty: boolean = false) => {
    // Datos de ejemplo para las llamadas
    const callLogs = empty ? [] : [
      { id: 1, callDate: '2023-01-01', client: 'Cliente A', clientCompany: 'Empresa A', consultant_id: 101, category: 'Ventas', rating: '5', time: '10', summary: 'Resumen 1' },
      { id: 2, callDate: '2023-01-02', client: 'Cliente B', clientCompany: 'Empresa B', consultant_id: 101, category: 'Soporte', rating: '4', time: '15', summary: 'Resumen 2' },
      { id: 3, callDate: '2023-01-03', client: 'Cliente C', clientCompany: 'Empresa C', consultant_id: 102, category: 'Ventas', rating: '3', time: '20', summary: 'Resumen 3' },
      { id: 4, callDate: '2023-01-04', client: 'Cliente D', clientCompany: 'Empresa D', consultant_id: 103, category: 'Soporte', rating: '5', time: '5', summary: 'Resumen 4' },
      { id: 5, callDate: '2023-01-05', client: 'Cliente E', clientCompany: 'Empresa E', consultant_id: 201, category: 'Ventas', rating: '4', time: '12', summary: 'Resumen 5' }
    ];
  
    cy.intercept('GET', '/api/callLogs', {
      statusCode: 200,
      body: callLogs
    }).as('getCallLogs');
  });
  
  // Extender tipos para comandos personalizados
  declare global {
    namespace Cypress {
      interface Chainable {
        visitLogsPage(): Chainable<Element>;
        verifyTableRowCount(count: number): Chainable<Element>;
        verifyClientInTable(clientName: string, shouldExist?: boolean): Chainable<Element>;
        verifyRole(role: string): Chainable<Element>;
        filterByCompany(company: string): Chainable<Element>;
        searchTerm(term: string): Chainable<Element>;
        resetFilters(): Chainable<Element>;
        setupUserRole(role: 'consultant' | 'supervisor' | 'administrator', id?: string): Chainable<Element>;
        setupCallLogs(empty?: boolean): Chainable<Element>;
      }
    }
  }