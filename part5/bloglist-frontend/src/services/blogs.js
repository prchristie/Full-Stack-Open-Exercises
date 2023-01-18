import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const like = async (blog) => {
  const likedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
  const response = await axios.put(`${baseUrl}/${blog.id}`, likedBlog)
  return response.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

export default { getAll, create, setToken, like, remove }
