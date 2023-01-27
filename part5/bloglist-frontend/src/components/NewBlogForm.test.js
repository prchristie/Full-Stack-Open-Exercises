import { render, screen } from '@testing-library/react'
import 'jest'
import { BlogForm } from './NewBlogForm'
import userEvent from '@testing-library/user-event'

test('NewBlogForm calls createBlog callback correctly', async () => {
  const createBlogMock = jest.fn()

  const container = render(<BlogForm createBlog={createBlogMock} />).container

  const titleInput = container.querySelector('#titleInput')
  const authorInput = container.querySelector('#authorInput')
  const urlInput = container.querySelector('#urlInput')
  const submitButton = screen.getByText('create')

  const user = userEvent.setup()
  await user.type(titleInput, 'fakeTitle')
  await user.type(authorInput, 'fakeAuthor')
  await user.type(urlInput, 'fakeUrl')
  await user.click(submitButton)

  expect(createBlogMock.mock.calls[0][0]).toEqual({
    title: 'fakeTitle',
    author: 'fakeAuthor',
    url: 'fakeUrl',
  })
})
