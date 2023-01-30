import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AnecdoteForm } from './components/AnecdoteForm'
import { AnecdoteList } from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { notify } from './reducers/notificationReducer'
import { setAnecdotes } from './reducers/anecdoteReducer'
import anecdoteService from './services/anecdoteService'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const initializeAnecdotes = async () => {
      const anecdotes = await anecdoteService.getAll()
      dispatch(setAnecdotes(anecdotes))
    }
    initializeAnecdotes().catch((e) => {
      console.error(e)
      return dispatch(notify('Couldn\'t get the anecdotes. Sorry :('))
    })
  }, [])

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
