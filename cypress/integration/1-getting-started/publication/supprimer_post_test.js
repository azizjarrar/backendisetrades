describe("Ajouter event test", () => {
    it("Can fill the form", () => {
    cy.visit("http://localhost:4200/dashboard_club/accueil/1");   
    //choisir e post a delete
    cy.get('#menupost').click()
    cy.get('#deletePOST').click()  
    });
  });