describe('My First Test', () => {
    it('TC demande ', () => {
     /* cy.visit('http://localhost:4200/accueil/clubs')
      cy.get('#inscrire').click()
      cy.get('#cin').clear().type('02365897')
      cy.get('#email').clear().type('medsalahh1@gmail.com')
      cy.get('#tel').clear().type('25225162')
      cy.get('#equipe').select('2')
      cy.get('#motivation').clear().type('hello')
      cy.get('#envoyer').click()*/
      cy.visit('http://localhost:4200/accueil/clubs')
      cy.get('#signin').click()
      cy.get('#emaill').clear().type('hayet@gmail.com')
      cy.get('#password').clear().type('123456')
      cy.get('#signini').click()
      cy.wait(5000)
      cy.visit('http://localhost:4200/dashboard_club/liste-demandes/1')
      cy.wait(5000)
      cy.get('#list').click()
      cy.get('#delete09882478').click()
    })
    
  })