import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import { Notification } from './components/Notification'
import LoginForm from './components/LoginForm'
import { BlogForm } from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const displayNotification = (message, isError) => {
    setNotificationMessage(message)
    setIsError(isError)
    setTimeout(() => setNotificationMessage(null), 5000)
  }

  const sortBlogsByLikes = (blogs) =>
    [...blogs].sort((a, b) => b.likes - a.likes)



  useEffect(() => {
    const loadBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(sortBlogsByLikes(blogs))
    }
    loadBlogs()
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('user')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const likeBlog = async (blog) => {
    try {
      const newBlog = await blogService.like(blog)
      const newBlogs = blogs.map((b) => (b.id !== newBlog.id ? b : newBlog))
      setBlogs(sortBlogsByLikes(newBlogs))
    } catch (e) {
      displayNotification(e.response.data.error, true)
    }
  }

  const deleteBlog = async (blog) => {
    window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    await blogService.remove(blog)
    setBlogs(blogs.filter((n) => n.id !== blog.id))
  }

  const blogList = () => (
    <>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
          showRemove={blog.user.username === user.username}
        />
      ))}
    </>
  )

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      displayNotification('Successfully logged in!', false)
    } catch (e) {
      displayNotification('wrong username or password', true)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
  }

  const newBlogRef = useRef()
  const createNewBlog = async ({ title, author, url }) => {
    const newBlog = {
      title,
      author,
      url,
    }

    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      displayNotification(
        `a new blog ${blog.title} by ${blog.author} added`,
        false
      )
      newBlogRef.current.toggleVisibility()
    } catch (e) {
      if (e.response.data.error === 'invalid token') {
        displayNotification('You have been logged out', true)
        logout()
        return
      }
      displayNotification(e.response.data.error, true)
    }
  }

  const loggedInView = () => (
    <div>
      <h2>blogs</h2>
      <div>
        <p>
          {user.username} logged in
          <button id="logout-button" onClick={() => logout()}>logout</button>
        </p>
      </div>
      <Togglable buttonLabel="new blog" ref={newBlogRef}>
        <h2>create new</h2>
        <BlogForm createBlog={createNewBlog} />
      </Togglable>
      <div>{blogList()}</div>
    </div>
  )

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <LoginForm handleLogin={handleLogin} />
    </>
  )

  return <>{notificationMessage && (
    <Notification message={notificationMessage} isError={isError} />
  )}{user !== null ? loggedInView() : loginForm()}</>
}

export default App
