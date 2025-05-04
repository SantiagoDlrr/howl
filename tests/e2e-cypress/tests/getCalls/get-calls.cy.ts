describe('Consulta de llamadas por consultor', () => {
    it('Debería retornar las llamadas del consultor', () => {
      cy.request('/api/consultantCalls?id=25').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });
  });