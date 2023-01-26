import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    likes: 10,
    url: 'url',
  }
  let container
  let mockDelete
  let mockLike

  beforeEach(() => {
    mockDelete = jest.fn()
    mockLike = jest.fn()

    container = render(
      <Blog
        blog={blog}
        deleteBlog={mockDelete}
        likeBlog={mockLike}
        showRemove={false}
      />
    ).container
  })

  test('initially displays title and author only', () => {
    const div = container.querySelector('.blogExtraInfo')
    expect(div).toHaveStyle('display: none')

    screen.getByText('Title')
    screen.getByText('Author')
  })

  test('displays url and likes after button is pressed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogExtraInfo')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking the like button calls callback', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})
