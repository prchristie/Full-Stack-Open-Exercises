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

  describe('when logged in', function () {
    beforeEach(() => {
      cy.login({ username: 'test username', password: 'test password' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()

      cy.get('#title-input').type('test title')
      cy.get('#author-input').type('test author')
      cy.get('#url-input').type('test url')
      cy.get('#create-blog-button').click()

      cy.contains('test title')
    })

    describe('and a blog exists', function () {
      beforeEach(() => {
        cy.createBlog({
          title: 'test title',
          author: 'test author',
          url: 'test url',
          likes: 0
        })
      })

      it('it can be liked', () => {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('it can be deleted by the owner', () => {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'test title')
      })

      it('it cant be deleted by another user', () => {
        cy.createUser({ username: 'another user',
          name: 'another name',
          password: 'another password'
        })
        cy.login({ username: 'another user', password: 'another password' })

        cy.contains('view').click()
        cy.contains('remove').parent().should('have.css', 'display', 'none')
      })
    })
  })
})

