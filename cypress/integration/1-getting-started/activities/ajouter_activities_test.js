import 'cypress-file-upload';

describe('My First Test', () => {
    it('TC demande ', () => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
          })
          cy.viewport(1920,1024)
        cy.visit('http://localhost:4200/accueil/clubs')
        cy.get('#signin').click()
        cy.get('#emaill').clear().type('hayet@gmail.com')
        cy.get('#password').clear().type('123456')
        cy.get('#signini').click()
        cy.wait(3000)   
      cy.visit('http://localhost:4200/dashboard_club/accueil/1')
      cy.get('#Activitesduclub').click()
      cy.get('#changetoaddact').click()
      cy.get('#date_act').type('2009-12-12')
      cy.get('#titre').clear().type('titre')
      cy.get('#description_act').clear().type('description_act')
      const filepath = '/images/post.png'
      cy.get('#image_act').attachFile(filepath)
      cy.get('#addactivites').click()
      cy.wait(3000)   

      cy.visit('http://localhost:4200/dashboard_club/accueil/1')
      cy.get('#Activitesduclub').click()
      cy.wait(3000)   
      cy.get(".ng-tns-c3-1").contains('description_act') // Yield first el in document containing 'Hello'
      cy.wait(3000)   

      /*cy.wait(3000)
      cy.get('#list').click()
      cy.get('#accepter09882478').click()
      cy.visit('http://localhost:4200/dashboard_club/membres/1')
      cy.get('#9882478').blur()
      .should("exist")
      .prev().should('have.attr', 'style', 'color: red;')*/
    })
    
  })