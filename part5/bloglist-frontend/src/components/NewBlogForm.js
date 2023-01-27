import { useState } from 'react'

export const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          createBlog({ title, author, url })
          setTitle('')
          setAuthor('')
          setUrl('')
        }}
      >
        <div>
          title
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            id="title-input"
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            id="author-input"
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            id="url-input"
          />
        </div>
        <button id="create-blog-button" type="submit">create</button>
      </form>
    </>
  )
}
