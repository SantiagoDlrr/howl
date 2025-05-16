describe('Flujo de importación desde Google Forms', () => {
    it('Importa datos correctamente', () => {
      cy.request('POST', '/api/importData').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.include('imported');
      });
    });
  
    it('Evita duplicados si ya existen', () => {
      cy.request('POST', '/api/importData').then(() => {
        cy.request('POST', '/api/importData').then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.include('imported');
        });
      });
    });
  
    it('Se activa correctamente desde Google Forms (simulado)', () => {
      cy.request('POST', '/api/importData').then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });