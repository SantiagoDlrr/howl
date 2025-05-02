describe('LoginCard Component', () => {
    beforeEach(() => {
      cy.visit('/auth?mode=login'); 
    });
  
    it('shows error if email is empty and form is submitted', () => {
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.contains('Email vacío').should('exist');
    });
  
    it('shows error if password is empty and form is submitted', () => {
      cy.get('input[type="email"]').type('user@example.com');
      cy.get('button[type="submit"]').click();
      cy.contains('Contraseña vacía').should('exist');
    });
  
  });
  