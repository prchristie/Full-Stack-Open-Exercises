import { useMutation, useQuery, useQueryClient } from 'react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAll, vote } from './services/anecdote'

const App = () => {
  const voteMutation = useMutation('anecdotes', vote)
  const queryClient =  useQueryClient()

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote, {
      onSuccess: (updatedAnecdote) => {
        const anecdotes = queryClient.getQueryData('anecdotes')
        queryClient.setQueryData('anecdotes', anecdotes.map(anecdote => anecdote.id === updatedAnecdote.id ?
          updatedAnecdote :
          anecdote))
      }
    })
  }

  const res = useQuery('anecdotes', getAll);

  if(res.isError) {
    return <>anecdote service not available due to problems in server</>
  }
  if(res.isLoading) {
    return <>loading...</>
  }

  const anecdotes = res.data;


  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
