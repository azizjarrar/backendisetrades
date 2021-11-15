describe("Ajouter event test", () => {
  it("Can fill the form", () => {
    cy.visit("http://localhost:4200/dashboard_club/accueil/1");
  
    cy.get('#post').clear()
      .type("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s")
      .should("have.value");

    
      const filepath = 'C:/Users/winte/Documents/GitHub/backendisetrades/cypress/fixtures/images/post.png'
      cy.get('#actual-btn').attachFile(filepath)
      cy.get('#Choisir').click()
      cy.get('#file-chosen').contains('post.png')
  
  cy.get('#partage').click()
   // cy.get('#post_image').click()  
    //cy.addImage(‘images/front.jpeg’);
    //cy.get('#password').clear().type('123456')  
  });
});