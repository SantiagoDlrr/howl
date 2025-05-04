describe('Sign-up field validation', () => {
    beforeEach(() => {
        cy.visit('/auth?mode=signup'); 
        cy.fixture('auth/sign-up-users').then((users) => {
            const user = users.validUser;
            cy.get('[data-testid="signup-name"]').clear().type(user.name);
            cy.get('[data-testid="signup-email"]').clear().type(user.email);
            cy.get('[data-testid="signup-password"]').clear().type(user.password);
          });
      });
    
    it('checks error message for name < 3 characters', () => {
        cy.get('[data-testid="signup-name"]').clear().type("ab");
        cy.get('button[type="submit"]').should('be.enabled').click();
        cy.get('[data-testid="error-message"]').should('contain', 'Nombre muy corto. (Al menos 3 caracteres)');
    });

    it('checks error message for invalid email', () => {
        cy.get('[data-testid="signup-email"]').clear().type("invalid-email");
        cy.get('button[type="submit"]').should('be.enabled').click();
        cy.get('[data-testid="signup-email"]')
            .invoke('prop', 'validity')
            .its('valid')
            .should('be.false');
    });

    it('checks error message for password < 8 characters', () => {
        cy.get('[data-testid="signup-password"]').clear().type("Ab1#");
        cy.get('button[type="submit"]').should('be.enabled').click();
        cy.get('[data-testid="error-message"]').should('contain', 'La contraseña debe tener al menos 8 caracteres');
    });

    it('checks error message for password without uppercase letter', () => {
        cy.get('[data-testid="signup-password"]').clear().type("abcde123#");
        cy.get('button[type="submit"]').should('be.enabled').click();
        cy.get('[data-testid="error-message"]').should('contain', 'La contraseña debe tener al menos una letra mayúscula');
    });

    it('checks error message for password without number', () => {
        cy.get('[data-testid="signup-password"]').clear().type("Abcdefgh#");
        cy.get('button[type="submit"]').should('be.enabled').click();
        cy.get('[data-testid="error-message"]').should('contain', 'La contraseña debe tener al menos un número');
    });

    it('checks error message for password without special character', () => {
        cy.get('[data-testid="signup-password"]').clear().type("Abcde1234");
        cy.get('button[type="submit"]').should('be.enabled').click();
        cy.get('[data-testid="error-message"]').should('contain', 'La contraseña debe tener al menos un caracter especial');
    });

});