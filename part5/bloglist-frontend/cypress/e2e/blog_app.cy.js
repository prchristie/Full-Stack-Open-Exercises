describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    cy.createUser({
      username: 'test username',
      name: 'test name',
      password: 'test password'
    })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('login')
    cy.get('#username-input')
    cy.get('#password-input')
    cy.get('#login-button')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function() {
      cy.get('#username-input').type('test username')
      cy.get('#password-input').type('test password')
      cy.get('#login-button').click()

      cy.contains('Successfully logged in!')
      cy.get('#logout-button')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username-input').type('wrong username')
      cy.get('#password-input').type('wrong password')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})
