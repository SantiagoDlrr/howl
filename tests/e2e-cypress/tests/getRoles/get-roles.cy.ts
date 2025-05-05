describe('Recuperación de roles después de login', () => {
    beforeEach(() => {
      cy.visit('/auth?mode=login');
  
      cy.get('input[type="email"]').type('msoberon@neoris.com');
      cy.get('input[type="password"]').type('Password1!');
      cy.get('button[type="submit"]').click();
  
      // Esperar redirección o carga completa
      
    });
  
    it('Debería recuperar el rol del usuario autenticado', () => {
      cy.url({ timeout: 10000 }).should('not.include', 'auth');
      cy.request('/api/roles').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('role');
        expect(response.body.role).to.be.oneOf(['administrator', 'supervisor', 'consultant']);
      });
    });
  });