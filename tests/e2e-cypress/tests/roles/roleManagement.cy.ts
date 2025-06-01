describe('US25: Registro de admins, supervisores y empleados', () => {
  beforeEach(() => {
      cy.login();
      
      // Mock del endpoint de roles para simular que el usuario es admin
      cy.intercept('GET', '/api/roles', {
          statusCode: 200,
          body: {
              userId: 'test-user-id',
              consultantId: '999',
              role: 'administrator'
          }
      }).as('getUserRole');

      // Mock principal de usuarios
      cy.intercept('GET', '/api/roleManagement/users', {
          statusCode: 200,
          body: [
              {
                  id: 'user1',
                  consultantId: 101,
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john.doe@example.com',
                  accessLevel: 'consultant'
              },
              {
                  id: 'user2',
                  consultantId: 102,
                  firstName: 'Jane',
                  lastName: 'Smith',
                  email: 'jane.smith@example.com',
                  accessLevel: 'consultant'
              },
              {
                  id: 'user3',
                  consultantId: 103,
                  firstName: 'Mike',
                  lastName: 'Johnson',
                  email: 'mike.johnson@example.com',
                  accessLevel: 'supervisor'
              },
              {
                  id: 'user4',
                  consultantId: 104,
                  firstName: 'Admin',
                  lastName: 'User',
                  email: 'admin@tec.mx',
                  accessLevel: 'administrator'
              },
              {
                  id: 'user5',
                  firstName: 'New',
                  lastName: 'User',
                  email: 'new.user@example.com',
                  accessLevel: 'unassigned'
              }
          ]
      }).as('getUsers');

      cy.intercept('GET', '/api/roleManagement/supervision?supervisorId=103', {
          statusCode: 200,
          body: {
              supervisedUsers: [101]
          }
      }).as('getSupervisedUsers');

      // Mock para actualizar acceso
      cy.intercept('PUT', '/api/roleManagement/access', (req) => {
          req.reply({
              statusCode: 200,
              body: {
                  ...req.body,
                  firstName: req.body.userId === 'user2' ? 'Jane' : req.body.userId === 'user1' ? 'John' : 'Mike',
                  lastName: req.body.userId === 'user2' ? 'Smith' : req.body.userId === 'user1' ? 'Doe' : 'Johnson',
                  email: req.body.userId === 'user2' ? 'jane.smith@example.com' : req.body.userId === 'user1' ? 'john.doe@example.com' : 'mike.johnson@example.com'
              }
          });
      }).as('updateUserAccess');

      // Mock para actualizar supervisiones
      cy.intercept('PUT', '/api/roleManagement/supervision', {
          statusCode: 200,
          body: {
              success: true
          }
      }).as('updateSupervision');

      // Visitar la página
      cy.visit('/roles');
      
      // Esperar a que se verifique el rol
      cy.wait('@getUserRole');
      
      // Esperar a que se carguen los usuarios
      cy.wait('@getUsers');
  });

  // AC1: El usuario debe acceder con una cuenta con permiso de administrador
  it('US25T1: Debería mostrar la tabla de gestión de roles para un administrador', () => {
      // Verificar que NO se muestra acceso denegado
      cy.get('body').should('not.contain', 'Acceso Denegado');
      
      // Verificar que estamos en la página correcta
      cy.url().should('include', '/roles');
      
      // Verificar el indicador de rol
      cy.contains('Rol actual: Administrador').should('be.visible');
      
      // Verificar que el título está presente
      cy.contains('h1', 'Gestión de Usuarios').should('be.visible');
      
      // Verificar que la tabla tiene los encabezados correctos
      cy.get('table thead tr').within(() => {
          cy.contains('th', 'Nombre').should('be.visible');
          cy.contains('th', 'Email').should('be.visible');
          cy.contains('th', 'Nivel de Acceso').should('be.visible');
          cy.contains('th', 'Acciones').should('be.visible');
      });
      
      // Verificar que se muestran los usuarios
      cy.get('[data-testid="users-table"] tbody tr, table tbody tr').should('have.length', 5);
  });

  // AC2: El usuario puede cambiar el rol entre administrador, supervisor o consultor
  it('US25T2: Debería permitir cambiar el rol de un usuario a supervisor', () => {
      // Encontrar el usuario "Jane Smith" y cambiar su rol a supervisor
      cy.contains('tr', 'Jane Smith').within(() => {
          cy.get('[data-testid^="access-level-select"], select').select('supervisor');
      });
      
      // Esperar a que se abra el modal para asignar consultores supervisados
      cy.get('[data-testid="supervised-users-modal"], div[class*="fixed inset-0"]').should('be.visible');
      cy.contains('h2', 'Gestionar Consultores Supervisados').should('be.visible');
      
      // Guardar sin seleccionar supervisados
      cy.get('[data-testid="modal-save-btn"], button:contains("Guardar")').click();
      
      // Verificar que ahora aparece el botón de gestionar supervisados
      cy.contains('tr', 'Jane Smith').contains('button', 'Gestionar Supervisados')
          .should('be.visible', { timeout: 10000 });
  });

  // AC2 (parte 2): El usuario puede cambiar el rol a consultor
  it('US25T3: Debería permitir cambiar el rol a consultor', () => {
      // Encontrar el usuario "Mike Johnson" (supervisor) y cambiar su rol a consultor
      cy.contains('tr', 'Mike Johnson').within(() => {
          cy.get('[data-testid^="access-level-select"], select').select('consultant');
      });
      
      // Verificar que se hizo la llamada a la API
      cy.wait('@updateUserAccess').its('request.body').should('deep.include', {
          userId: 'user3',
          consultantId: 103,
          accessLevel: 'consultant'
      });
  });

  // AC3: El usuario podrá gestionar a las personas supervisadas por otro usuario con rol de supervisor
  it('US25T4: Debería permitir gestionar las personas supervisadas por un supervisor', () => {
      // Encontrar el usuario "Mike Johnson" (supervisor) y hacer clic en "Gestionar Supervisados"
      cy.contains('tr', 'Mike Johnson')
          .find('[data-testid^="manage-supervised-btn"], button:contains("Gestionar Supervisados")')
          .click();
      
      // Esperar a que se carguen los datos de supervisados
      cy.wait('@getSupervisedUsers');
      
      // Verificar que el modal está abierto con el título correcto
      cy.get('[data-testid="supervised-users-modal"], div[class*="fixed inset-0"]').should('be.visible');
      cy.contains('h2', 'Gestionar Consultores Supervisados').should('be.visible');
      cy.contains('Mike Johnson').should('be.visible');
      
      // Verificar que John Doe está seleccionado (ya que es supervisado por Mike)
      cy.get('[data-testid="consultant-checkbox-101"], input[type="checkbox"]')
          .should('be.checked');
      
      // Seleccionar a Jane Smith como supervisada también
      cy.get('[data-testid="consultant-checkbox-102"], input[type="checkbox"]')
          .check();
      
      // Guardar los cambios
      cy.get('[data-testid="modal-save-btn"], button:contains("Guardar")').click();
      
      // Verificar que se hizo la llamada a la API con los IDs correctos
      cy.wait('@updateSupervision', { timeout: 10000 }).its('request.body').should('deep.include', {
          supervisorId: 103,
          supervisedIds: [101, 102]
      });
  });

  // AC4: El usuario puede eliminar el rol a cualquier usuario
  it('US25T5: Debería permitir eliminar el rol de un usuario', () => {
      // Encontrar el usuario "John Doe" y cambiar su rol a "No Asignado"
      cy.contains('tr', 'John Doe').within(() => {
          cy.get('[data-testid^="access-level-select"], select').select('unassigned');
      });
      
      // Verificar que se hizo la llamada a la API
      cy.wait('@updateUserAccess').its('request.body').should('deep.include', {
          userId: 'user1',
          consultantId: 101,
          accessLevel: 'unassigned'
      });
  });

  // Prueba de búsqueda
  it('US25T6: Debería filtrar usuarios al buscar por texto', () => {
      // Escribir "Jane" en el campo de búsqueda
      cy.get('[data-testid="user-search-input"], input[type="text"][placeholder="Buscar usuarios..."]').type('Jane');
      
      // Verificar que solo se muestra un usuario
      cy.get('[data-testid="users-table"] tbody tr, table tbody tr').should('have.length', 1);
      cy.contains('tr', 'Jane Smith').should('be.visible');
      
      // Limpiar la búsqueda y verificar que vuelven a aparecer todos los usuarios
      cy.get('[data-testid="user-search-input"], input[type="text"][placeholder="Buscar usuarios..."]').clear();
      cy.get('[data-testid="users-table"] tbody tr, table tbody tr').should('have.length', 5);
  });

  // Prueba adicional: Buscar en el modal de supervisados
  it('US25T7: Debería filtrar consultores en el modal de supervisados', () => {
      // Abrir el modal de supervisados
      cy.contains('tr', 'Mike Johnson')
          .find('[data-testid^="manage-supervised-btn"], button:contains("Gestionar Supervisados")')
          .click();
      
      // Esperar a que se carguen los datos
      cy.wait('@getSupervisedUsers');
      
      // Buscar "Jane" en el campo de búsqueda del modal
      cy.get('[data-testid="consultant-search-input"], input[placeholder="Buscar consultores..."]').type('Jane');
      
      // Verificar que solo se muestra un consultor
      cy.get('[data-testid="consultants-table"] tbody tr, div[class*="max-h-96"] table tbody tr')
          .should('have.length', 1)
          .and('contain', 'Jane Smith');
      
      // Cancelar el modal
      cy.get('[data-testid="modal-cancel-btn"], button:contains("Cancelar")').click();
      
      // Verificar que el modal se ha cerrado
      cy.get('[data-testid="supervised-users-modal"], div[class*="fixed inset-0"]').should('not.exist');
  });

  // Prueba de manejo de errores
  it('US25T8: Debería manejar errores al cargar usuarios', () => {
      // Recargar la página e interceptar la petición con un error
      cy.intercept('GET', '/api/roleManagement/users', {
          statusCode: 500,
          body: {
              error: 'Error al cargar usuarios'
          }
      }).as('getUsersError');
      
      cy.visit('/roles');
      cy.wait('@getUserRole');
      cy.wait('@getUsersError');
      
      // Verificar que se muestra un mensaje de error
      cy.contains('Error al cargar usuarios').should('be.visible');
  });

  // Test adicional: Verificar acceso denegado para no administradores
  it('US25T9: Debería denegar acceso a usuarios no administradores', () => {
      // Mock del endpoint de roles para simular que el usuario NO es admin
      cy.intercept('GET', '/api/roles', {
          statusCode: 200,
          body: {
              userId: 'test-user-id',
              consultantId: '999',
              role: 'consultant' // No es admin
          }
      }).as('getUserRoleConsultant');

      // Visitar la página
      cy.visit('/roles');
      
      // Esperar a que se verifique el rol
      cy.wait('@getUserRoleConsultant');
      
      // Verificar que se muestra acceso denegado
      cy.contains('Acceso Denegado').should('be.visible');
      cy.contains('Solo los administradores pueden acceder a esta página').should('be.visible');
      cy.contains('Volver al inicio').should('be.visible');
      
      // Verificar que NO se muestra la tabla
      cy.get('[data-testid="users-table"]').should('not.exist');
  });
});