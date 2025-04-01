describe('Home Page', () => {
    it('should display the heading', () => {
      cy.visit('/') // Navigate to the home page
      cy.get('h1').should('contain', 'Análisis de llamadas') // Check for an H1 heading
    })
  })
  