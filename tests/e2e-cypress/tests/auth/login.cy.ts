describe('Auth Page', () => {


    beforeEach(() => {
        cy.visit('/auth?mode=login'); 
      });
    
      it('renders login card when mode is login', () => {
        cy.get('[data-testid="login-card"]').should('be.visible'); 
      });

      // it('shows success if login is successful', () => {
      //   cy.get('input[type="email"]').type('admin@tec.mx');
      //   cy.get('input[type="password"]').type('123456#A');
      //   cy.get('button[type="submit"]').click();
      //   cy.contains('Login successful').should('exist');
      // });
      
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
    




