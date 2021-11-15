describe('My First Test', () => {
    it('TC demande ', () => {
     
      cy.visit('http://localhost:4200/accueil/clubs')
      cy.get('#signin').click()
      cy.get('#emaill').clear().type('hayet@gmail.com')
      cy.get('#password').clear().type('123456')
      cy.get('#signini').click()
      cy.wait(5000)   
      cy.visit('http://localhost:4200/dashboard_club/liste-demandes/1')
      cy.wait(5000)
      cy.get('#list').click()
      cy.get('#accepter09882478').click()
      cy.visit('http://localhost:4200/dashboard_club/membres/1')
      cy.get('#9882478').blur()
      .should("exist")
      .prev().should('have.attr', 'style', 'color: red;')
    })
    
  })