import axios from "axios"

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
    const res = await axios.get(baseUrl);
    return res.data;
}

export const create = async (content) => {
  const res = await axios.post(baseUrl, { content, votes: 0 })
  return res.data
}

export const vote = async (anecdote) => {
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  const res = await axios.put(`${baseUrl}/${anecdote.id}`, updatedAnecdote)
  return res.data
}