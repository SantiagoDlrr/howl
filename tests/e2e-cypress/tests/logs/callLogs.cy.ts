// tests/e2e-cypress/tests/logs/callLogs-simplified.cy.ts

// Versión simplificada que usa comandos personalizados y se adapta a la estructura HTML real

describe('US10: Historial de llamadas (Simplificado)', () => {
  
    context('AC1 & AC2: Como consultor, ver solo mis llamadas', () => {
      beforeEach(() => {
        // Configurar rol de consultor
        cy.setupUserRole('consultant', '101');
        
        // Configurar datos de llamadas
        cy.setupCallLogs();
        
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
        cy.verifyClientInTable('Cliente C', false);
        cy.verifyClientInTable('Cliente D', false);
      });
    });
  
    context('AC3: Como supervisor, ver mis llamadas y las de mis supervisados', () => {
      beforeEach(() => {
        // Configurar rol de supervisor
        cy.setupUserRole('supervisor', '201');
        
        // Configurar datos de llamadas
        cy.setupCallLogs();
        
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
        cy.verifyClientInTable('Cliente D', false); // consultor 103 (no supervisado)
        cy.verifyClientInTable('Cliente E'); // supervisor 201
      });
    });
  
    context('AC4: Como administrador, ver todas las llamadas', () => {
      beforeEach(() => {
        // Configurar rol de administrador
        cy.setupUserRole('administrator', '301');
        
        // Configurar datos de llamadas
        cy.setupCallLogs();
        
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
        cy.setupCallLogs(true);
        
        // Visitar la página
        cy.visitLogsPage();
        cy.wait(['@getRoles', '@getCallLogs']);
  
        // Verificar que se muestra el mensaje de sin resultados
        cy.contains('No se encontraron registros').should('be.visible');
      });
    });
  
    context('AC5: Filtrado y búsqueda', () => {
      beforeEach(() => {
        // Configurar rol de administrador para ver todas las llamadas
        cy.setupUserRole('administrator');
        
        // Configurar datos de llamadas
        cy.setupCallLogs();
        
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
  
      it('US10T7: Debería permitir buscar por término', () => {
        // Buscar un término específico
        cy.searchTerm('Cliente B');
        
        // Verificar los resultados
        cy.verifyTableRowCount(1);
        cy.verifyClientInTable('Cliente B');
        cy.verifyClientInTable('Cliente A', false);
      });
    });
  });