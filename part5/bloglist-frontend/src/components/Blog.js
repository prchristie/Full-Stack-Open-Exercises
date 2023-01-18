import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, showRemove }) => {
  const [hidden, toggleHidden] = useState(true)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const extraInfoStyle = { display: hidden ? 'none' : '' }
  const removeButtonStyle = { display: showRemove ? '' : 'none' }

  return (
    <div style={blogStyle}>
      {blog.title}
      <button
        onClick={() => {
          toggleHidden(!hidden)
        }}
      >
        {hidden ? 'view' : 'hide'}
      </button>
      <div style={extraInfoStyle}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => likeBlog(blog)}>like</button>
        </div>
        <div>{blog.author}</div>
        <div style={removeButtonStyle}>
          <button onClick={() => deleteBlog(blog)}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
