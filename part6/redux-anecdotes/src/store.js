import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './reducers/anecdoteReducer'

export const anecdoteStore = configureStore({ reducer: anecdoteReducer })