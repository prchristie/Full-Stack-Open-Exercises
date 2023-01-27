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

    describe('and one blog exists', function () {
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

    describe('and multiple blogs exist', function () {
      beforeEach(() => {
        [1, 2, 3].forEach((val) => cy.createBlog({
          title: `blog${val}`,
          author: `author${val}`,
          url: `url${val}`,
          likes: 0
        }))
      })

      const likeBlog = (blogSelector, numLikes) => {
        for(let i = 1; i < numLikes+1; i++) {
          cy.get(blogSelector).contains('like').click()
          cy.get(blogSelector).contains(`likes ${i}`)
        }
      }

      it('they are in order of number of likes', () => {
        cy.contains('blog2').parent().as('blog2').contains('view').click()
        cy.contains('blog3').parent().as('blog3').contains('view').click()

        likeBlog('@blog2', 1)
        likeBlog('@blog3', 2)

        cy.get('.blog').eq(0).contains('blog3')
        cy.get('.blog').eq(1).contains('blog2')
        cy.get('.blog').eq(2).contains('blog1')
      })
    })
  })
})

