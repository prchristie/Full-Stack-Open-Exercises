import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    voteFor(state, action) {
      const anecdoteToChange = state.find((n) => n.id === action.payload)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      }

      return state.map((a) => (a.id !== action.payload ? a : changedAnecdote))
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { voteFor, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
