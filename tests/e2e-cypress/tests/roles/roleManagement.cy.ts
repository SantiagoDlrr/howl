// tests/e2e-cypress/support/roleManagement.commands.ts

// Comandos personalizados para las pruebas de gestión de roles
// Se pueden importar en el archivo principal de comandos (commands.ts)

// Tipo para el nivel de acceso
type AccessLevel = 'consultant' | 'supervisor' | 'administrator' | 'unassigned';

// Comando para configurar los mocks básicos de la gestión de roles
Cypress.Commands.add('setupRoleManagementMocks', (includeError = false) => {
  // Mock de usuarios
  if (includeError) {
    cy.intercept('GET', '/api/roleManagement/users', {
      statusCode: 500,
      body: {
        error: 'Error al cargar usuarios'
      }
    }).as('getUsersError');
  } else {
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
  }

  // Mock para supervisados
  cy.intercept('GET', '/api/roleManagement/supervision?supervisorId=103', {
    statusCode: 200,
    body: {
      supervisedUsers: [101]
    }
  }).as('getSupervisedUsers');

  // Mock para actualizar acceso
  cy.intercept('PUT', '/api/roleManagement/access', (req) => {
    // Devolver los datos del usuario actualizado
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
});

// Comando para buscar un usuario por nombre
Cypress.Commands.add('searchUser', (searchTerm: string) => {
  cy.get('[data-testid="user-search-input"], input[type="text"][placeholder="Buscar usuarios..."]')
    .clear()
    .type(searchTerm);
});

// Comando para cambiar el rol de un usuario
Cypress.Commands.add('changeUserRole', (userName: string, newRole: AccessLevel) => {
  cy.contains('tr', userName).within(() => {
    cy.get('[data-testid^="access-level-select"], select').select(newRole);
  });
});

// Comando para abrir el modal de supervisados
Cypress.Commands.add('openSupervisedModal', (supervisorName: string) => {
  cy.contains('tr', supervisorName).within(() => {
    cy.get('[data-testid^="manage-supervised-btn"], button:contains("Gestionar Supervisados")').click();
  });
});

// Comando para seleccionar un consultor en el modal
Cypress.Commands.add('selectConsultant', (consultantName: string, shouldBeSelected: boolean = true) => {
  cy.contains('tr', consultantName).find('input[type="checkbox"]').then(($checkbox) => {
    if (shouldBeSelected && !$checkbox.is(':checked')) {
      cy.wrap($checkbox).check();
    } else if (!shouldBeSelected && $checkbox.is(':checked')) {
      cy.wrap($checkbox).uncheck();
    }
  });
});

// Comando para guardar los cambios en el modal
Cypress.Commands.add('saveModalChanges', () => {
  cy.get('[data-testid="modal-save-btn"], button:contains("Guardar")').click();
});

// Comando para cancelar el modal
Cypress.Commands.add('cancelModal', () => {
  cy.get('[data-testid="modal-cancel-btn"], button:contains("Cancelar")').click();
});

// Comando para verificar que el rol de un usuario se ha cambiado correctamente
Cypress.Commands.add('verifyUserRole', (userName: string, expectedRole: AccessLevel) => {
  cy.contains('tr', userName).within(() => {
    cy.get('[data-testid^="access-level-select"], select').should('have.value', expectedRole);
  });
});

// Comando para verificar que un usuario tiene el botón de gestionar supervisados
Cypress.Commands.add('verifySupervisorManageButton', (userName: string, shouldExist: boolean = true) => {
  if (shouldExist) {
    cy.contains('tr', userName).contains('button', 'Gestionar Supervisados').should('be.visible');
  } else {
    cy.contains('tr', userName).contains('button', 'Gestionar Supervisados').should('not.exist');
  }
});

// Extender tipos para comandos personalizados
declare global {
  namespace Cypress {
    interface Chainable {
      setupRoleManagementMocks(includeError?: boolean): Chainable<Element>;
      searchUser(searchTerm: string): Chainable<Element>;
      changeUserRole(userName: string, newRole: AccessLevel): Chainable<Element>;
      openSupervisedModal(supervisorName: string): Chainable<Element>;
      selectConsultant(consultantName: string, shouldBeSelected?: boolean): Chainable<Element>;
      saveModalChanges(): Chainable<Element>;
      cancelModal(): Chainable<Element>;
      verifyUserRole(userName: string, expectedRole: AccessLevel): Chainable<Element>;
      verifySupervisorManageButton(userName: string, shouldExist?: boolean): Chainable<Element>;
    }
  }
}
// tests/e2e-cypress/tests/roles/roleManagement.cy.ts

describe('US25: Registro de admins, supervisores y empleados', () => {
    // Función global de login que se ejecuta antes de cada prueba
    beforeEach(() => {
      // Interceptar peticiones a la API para poder controlar las respuestas
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
  
      // Mock para obtener los consultores supervisados por un supervisor
      cy.intercept('GET', '/api/roleManagement/supervision?supervisorId=103', {
        statusCode: 200,
        body: {
          supervisedUsers: [101]
        }
      }).as('getSupervisedUsers');
  
      // Mock para actualizar el acceso de un usuario
      cy.intercept('PUT', '/api/roleManagement/access', (req) => {
        // Devolver los datos del usuario actualizado
        req.reply({
          statusCode: 200,
          body: {
            ...req.body,
            firstName: req.body.userId === 'user2' ? 'Jane' : 'Mike',
            lastName: req.body.userId === 'user2' ? 'Smith' : 'Johnson',
            email: req.body.userId === 'user2' ? 'jane.smith@example.com' : 'mike.johnson@example.com'
          }
        });
      }).as('updateUserAccess');
  
      // Mock para actualizar las supervisiones
      cy.intercept('PUT', '/api/roleManagement/supervision', {
        statusCode: 200,
        body: {
          success: true
        }
      }).as('updateSupervision');
  
      // Iniciar sesión antes de cada prueba
      cy.login();
      
      // Visitar la página de gestión de roles
      cy.visit('/roles');
      
      // Esperar a que se carguen los datos
      cy.wait('@getUsers');
    });
  
    // AC1: El usuario debe acceder con una cuenta con permiso de administrador
    it('US25T1: Debería mostrar la tabla de gestión de roles para un administrador', () => {
      // Verificar que estamos en la página correcta
      cy.url().should('include', '/roles');
      
      // Verificar que el título está presente
      cy.contains('h1', 'Gestión de Usuarios').should('be.visible');
      
      // Verificar que la tabla tiene los encabezados correctos
      cy.get('table thead tr').within(() => {
        cy.contains('th', 'Nombre').should('be.visible');
        cy.contains('th', 'Email').should('be.visible');
        cy.contains('th', 'Nivel de Acceso').should('be.visible');
        cy.contains('th', 'Acciones').should('be.visible');
      });
      
      // Verificar que se muestran los usuarios (usando data-testid si está disponible)
      cy.get('[data-testid="users-table"] tbody tr, table tbody tr').should('have.length', 5);
    });
  
    // AC2: El usuario puede cambiar el rol entre administrador, supervisor o consultor
    // Corrección para el test US25T2 en roleManagement.cy.ts o roleManagement-simplified.cy.ts

    it('US25T2: Debería permitir cambiar el rol de un usuario a supervisor', () => {
        // Primero verificamos que el interceptor está correctamente configurado
        cy.intercept('PUT', '/api/roleManagement/access', (req) => {
        // Devolver los datos del usuario actualizado
        req.reply({
            statusCode: 200,
            body: {
            ...req.body,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com'
            }
        });
        }).as('updateUserAccess');
    
        // Encontrar el usuario "Jane Smith" y cambiar su rol a supervisor
        cy.contains('tr', 'Jane Smith').within(() => {
        // Usar data-testid si está disponible, sino el selector normal
        cy.get('[data-testid^="access-level-select"], select').select('supervisor');
        });
        
        // Esperar a que se abra el modal para asignar consultores supervisados
        cy.get('[data-testid="supervised-users-modal"], div[class*="fixed inset-0"]').should('be.visible');
        cy.contains('h2', 'Gestionar Consultores Supervisados').should('be.visible');
        
        // Guardar sin seleccionar supervisados
        cy.get('[data-testid="modal-save-btn"], button:contains("Guardar")').click();
        
        // Usa:
        cy.contains('tr', 'Jane Smith').contains('button', 'Gestionar Supervisados')
        .should('be.visible', { timeout: 10000 });
    });
  
    // AC2 (parte 2): El usuario puede cambiar el rol a consultor
    it('US25T3: Debería permitir cambiar el rol a consultor', () => {
      // Encontrar el usuario "Mike Johnson" (supervisor) y cambiar su rol a consultor
      cy.contains('tr', 'Mike Johnson').within(() => {
        // Usar data-testid si está disponible, sino el selector normal
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
    it('US25T4: Debería permitir gestionar las personas supervisadas por un supervisor (con data-testid)', () => {
        // Encontrar el usuario "Mike Johnson" (supervisor) y hacer clic en "Gestionar Supervisados"
        cy.get('[data-testid="user-row-user3"]')
          .find('[data-testid="manage-supervised-btn-user3"]')
          .click();
        
        // Esperar a que se carguen los datos de supervisados
        cy.wait('@getSupervisedUsers');
        
        // Verificar que el modal está abierto con el título correcto
        cy.get('[data-testid="supervised-users-modal"]').should('be.visible');
        cy.get('[data-testid="modal-title"]').should('contain', 'Gestionar Consultores Supervisados');
        cy.get('[data-testid="supervisor-name"]').should('contain', 'Mike Johnson');
        
        // Verificar que John Doe está seleccionado (ya que es supervisado por Mike)
        cy.get('[data-testid="consultant-checkbox-101"]').should('be.checked');
        
        // Seleccionar a Jane Smith como supervisada también
        cy.get('[data-testid="consultant-checkbox-102"]').check();
        
        // Guardar los cambios
        cy.get('[data-testid="modal-save-btn"]').click();
        
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
        // Usar data-testid si está disponible, sino el selector normal
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
      cy.wait('@getUsersError');
      
      // Verificar que se muestra un mensaje de error
      cy.contains('Error al cargar usuarios').should('be.visible');
    });
  });