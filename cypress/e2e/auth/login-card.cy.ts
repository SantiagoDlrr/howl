describe('LoginCard Component', () => {
    beforeEach(() => {
      cy.visit('/auth?mode=login'); // make sure it renders the LoginCard
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
  
    it('shows error if login fails (mocked)', () => {
      cy.intercept('POST', '/api/auth/callback/credentials', {
        statusCode: 200,
        body: {
          error: 'Invalid credentials',
          ok: false,
          status: 401,
        },
      }).as('loginRequest');
  
      cy.get('input[type="email"]').type('wrong@example.com');
      cy.get('input[type="password"]').type('wrongpass');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest');
      cy.contains('Usuario o contraseña incorrectos').should('exist');
    });
  });
  