describe('Auth Page', () => {


    beforeEach(() => {
        cy.visit('/auth?mode=login'); 
      });
    
      it('renders login card when mode is login', () => {
        cy.get('[data-testid="login-card"]').should('be.visible'); 
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
      
      it('redirect if login is successful', () => {
        cy.login();
        cy.wait(5000);
        // cy.url().should('include', '/main');
      });
    
  });
    