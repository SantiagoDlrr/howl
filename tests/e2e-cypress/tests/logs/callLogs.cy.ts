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
  // Buscar el primer select y seleccionar la compañía
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
    }
  }
}

describe('US10: Historial de llamadas (Simplificado)', () => {
  beforeEach(() => {
    cy.login();
  });
  // Ejecutar login antes de todas las pruebas
    context('AC1 & AC2: Como consultor, ver solo mis llamadas', () => {
      beforeEach(() => {
        // Configurar rol de consultor
        cy.setupUserRole('consultant', '101');
        
        // La API ya filtra las llamadas según el rol, así que el mock debe devolver solo las llamadas relevantes para el consultor
        cy.intercept('GET', '/api/callLogs', {
          statusCode: 200,
          body: [
            { id: 1, callDate: '2023-01-01', client: 'Cliente A', clientCompany: 'Empresa A', consultant_id: 101, category: 'Ventas', rating: 'Positive', time: '10', summary: 'Resumen 1' },
            { id: 2, callDate: '2023-01-02', client: 'Cliente B', clientCompany: 'Empresa B', consultant_id: 101, category: 'Soporte', rating: 'Positive', time: '15', summary: 'Resumen 2' }
          ]
        }).as('getCallLogs');
        
        // Visitar la página
        cy.visitLogsPage();
        
        // Esperar a que se completen las solicitudes
        cy.wait(['@getRoles', '@getCallLogs']);
      });
  
      it('US10T1: Debería identificar el rol de consultor y mostrar solo mis llamadas', () => {
        // Verificar rol
        cy.verifyRole('Consultor');
        
        // Verificar que solo se muestran las llamadas del consultor
        cy.verifyTableRowCount(2);
        
        // Verificar clientes visibles
        cy.verifyClientInTable('Cliente A');
        cy.verifyClientInTable('Cliente B');
      });
    });
  
    context('AC3: Como supervisor, ver mis llamadas y las de mis supervisados', () => {
      beforeEach(() => {
        // Configurar rol de supervisor
        cy.setupUserRole('supervisor', '201');
        
        // Simular respuesta de consultores supervisados
        cy.intercept('GET', '/api/supervision?supervisor_id=201', {
          statusCode: 200,
          body: {
            consultants: [101, 102]
          }
        }).as('getSupervisedConsultants');
        
        // La API ya filtra las llamadas según el rol, así que el mock debe devolver solo las llamadas relevantes
        cy.intercept('GET', '/api/callLogs', {
          statusCode: 200,
          body: [
            { id: 1, callDate: '2023-01-01', client: 'Cliente A', clientCompany: 'Empresa A', consultant_id: 101, category: 'Ventas', rating: 'Positive', time: '10', summary: 'Resumen 1' },
            { id: 2, callDate: '2023-01-02', client: 'Cliente B', clientCompany: 'Empresa B', consultant_id: 101, category: 'Soporte', rating: 'Positive', time: '15', summary: 'Resumen 2' },
            { id: 3, callDate: '2023-01-03', client: 'Cliente C', clientCompany: 'Empresa C', consultant_id: 102, category: 'Ventas', rating: 'Negative', time: '20', summary: 'Resumen 3' },
            { id: 5, callDate: '2023-01-05', client: 'Cliente E', clientCompany: 'Empresa E', consultant_id: 201, category: 'Ventas', rating: 'Positive', time: '12', summary: 'Resumen 5' }
          ]
        }).as('getCallLogs');
        
        // Visitar la página
        cy.visitLogsPage();
        
        // Esperar a que se completen las solicitudes
        cy.wait(['@getRoles', '@getSupervisedConsultants', '@getCallLogs']);
      });
  
      it('US10T2: Debería identificar el rol de supervisor y mostrar mis llamadas y las de mis supervisados', () => {
        // Verificar rol
        cy.verifyRole('Supervisor');
        
        // Verificar que se muestran las llamadas correctas
        cy.verifyTableRowCount(4);
        
        // Verificar clientes visibles
        cy.verifyClientInTable('Cliente A'); // consultor 101
        cy.verifyClientInTable('Cliente B'); // consultor 101
        cy.verifyClientInTable('Cliente C'); // consultor 102
        cy.verifyClientInTable('Cliente E'); // supervisor 201
      });
    });
  
    context('AC4: Como administrador, ver todas las llamadas', () => {
      beforeEach(() => {
        // Configurar rol de administrador
        cy.setupUserRole('administrator', '301');
        
        // Para el administrador, la API devuelve todas las llamadas
        cy.intercept('GET', '/api/callLogs', {
          statusCode: 200,
          body: [
            { id: 1, callDate: '2023-01-01', client: 'Cliente A', clientCompany: 'Empresa A', consultant_id: 101, category: 'Ventas', rating: 'Positive', time: '10', summary: 'Resumen 1' },
            { id: 2, callDate: '2023-01-02', client: 'Cliente B', clientCompany: 'Empresa B', consultant_id: 101, category: 'Soporte', rating: 'Positive', time: '15', summary: 'Resumen 2' },
            { id: 3, callDate: '2023-01-03', client: 'Cliente C', clientCompany: 'Empresa C', consultant_id: 102, category: 'Ventas', rating: 'Negative', time: '20', summary: 'Resumen 3' },
            { id: 4, callDate: '2023-01-04', client: 'Cliente D', clientCompany: 'Empresa D', consultant_id: 103, category: 'Soporte', rating: 'Positive', time: '5', summary: 'Resumen 4' },
            { id: 5, callDate: '2023-01-05', client: 'Cliente E', clientCompany: 'Empresa E', consultant_id: 201, category: 'Ventas', rating: 'Positive', time: '12', summary: 'Resumen 5' }
          ]
        }).as('getCallLogs');
        
        // Visitar la página
        cy.visitLogsPage();
        
        // Esperar a que se completen las solicitudes
        cy.wait(['@getRoles', '@getCallLogs']);
      });
  
      it('US10T3: Debería identificar el rol de administrador y mostrar todas las llamadas', () => {
        // Verificar rol
        cy.verifyRole('Administrador');
        
        // Verificar que se muestran todas las llamadas
        cy.verifyTableRowCount(5);
        
        // Verificar clientes visibles
        cy.verifyClientInTable('Cliente A');
        cy.verifyClientInTable('Cliente B');
        cy.verifyClientInTable('Cliente C');
        cy.verifyClientInTable('Cliente D');
        cy.verifyClientInTable('Cliente E');
      });
    });
  
    context('Manejo de errores', () => {
      it('US10T4: Debería mostrar un mensaje de error cuando falla la obtención del rol', () => {
        // Simular error en la API de roles
        cy.intercept('GET', '/api/roles', {
          statusCode: 500,
          body: {
            error: 'Error obteniendo rol'
          }
        }).as('getRolesError');
  
        // Visitar la página
        cy.visitLogsPage();
        cy.wait('@getRolesError');
  
        // Verificar que se muestra el mensaje de error
        cy.contains('Error:').should('be.visible');
      });
  
      it('US10T5: Debería mostrar mensaje de "sin resultados" cuando no hay logs', () => {
        // Configurar rol
        cy.setupUserRole('consultant');
        
        // Configurar logs vacíos
        cy.intercept('GET', '/api/callLogs', {
          statusCode: 200,
          body: []
        }).as('getEmptyCallLogs');
        
        // Visitar la página
        cy.visitLogsPage();
        cy.wait(['@getRoles', '@getEmptyCallLogs']);
  
        // Verificar que se muestra el mensaje de sin resultados
        cy.contains('No se encontraron registros').should('be.visible');
      });
    });
  
    context('AC5: Filtrado y búsqueda', () => {
      beforeEach(() => {
        // Configurar rol de administrador para ver todas las llamadas
        cy.setupUserRole('administrator');
        
        // Para el administrador, la API devuelve todas las llamadas
        cy.intercept('GET', '/api/callLogs', {
          statusCode: 200,
          body: [
            { id: 1, callDate: '2023-01-01', client: 'Cliente A', clientCompany: 'Empresa A', consultant_id: 101, category: 'Ventas', rating: 'Positive', time: '10', summary: 'Resumen 1' },
            { id: 2, callDate: '2023-01-02', client: 'Cliente B', clientCompany: 'Empresa B', consultant_id: 101, category: 'Soporte', rating: 'Positive', time: '15', summary: 'Resumen 2' },
            { id: 3, callDate: '2023-01-03', client: 'Cliente C', clientCompany: 'Empresa C', consultant_id: 102, category: 'Ventas', rating: 'Negative', time: '20', summary: 'Resumen 3' },
            { id: 4, callDate: '2023-01-04', client: 'Cliente D', clientCompany: 'Empresa D', consultant_id: 103, category: 'Soporte', rating: 'Positive', time: '5', summary: 'Resumen 4' },
            { id: 5, callDate: '2023-01-05', client: 'Cliente E', clientCompany: 'Empresa E', consultant_id: 201, category: 'Ventas', rating: 'Positive', time: '12', summary: 'Resumen 5' }
          ]
        }).as('getCallLogs');
        
        // Visitar la página
        cy.visitLogsPage();
        cy.wait(['@getRoles', '@getCallLogs']);
      });
  
      it('US10T6 AND US10T8: Debería filtrar por empresa y permitir restablecer filtros', () => {
        // Verificar la cantidad inicial de filas
        cy.verifyTableRowCount(5);
        
        // Aplicar filtro de empresa
        cy.filterByCompany('Empresa A');
        
        // Verificar que solo se muestra 1 fila
        cy.verifyTableRowCount(1);
        cy.verifyClientInTable('Cliente A');
        cy.verifyClientInTable('Cliente B', false);
        
        // Restablecer filtros
        cy.resetFilters();
        
        // Verificar que se restablecen las filas
        cy.verifyTableRowCount(5);
      });
  
      /*it('US10T7: Debería permitir buscar por término', () => {
        // Buscar un término específico
        cy.searchTerm('Cliente B');
        
        // Verificar los resultados
        cy.verifyTableRowCount(1);
        cy.verifyClientInTable('Cliente B');
        cy.verifyClientInTable('Cliente A', false);
      });*/
    });
  });