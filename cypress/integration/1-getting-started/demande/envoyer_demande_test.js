describe('Envoyer demande', () => {
    it('TC demande ', () => {
      cy.visit('http://localhost:4200/accueil/clubs')
      cy.get('#inscrire').click()
      cy.get('#cin').clear().type('09882478')
      cy.get('#email').clear().type('medsalahh1@gmail.com')
      // Delay each keypress by 0.1 sec
      .type('slow.typing@email.com', { delay: 100 })
      .should('have.value', 'slow.typing@email.com')
      cy.get('#tel').clear().type('25225162')
      cy.get('#equipe').select('1')
      cy.get('#motivation').clear().type('hello')
      cy.get('#envoyer').click()
      
    })
    
  })