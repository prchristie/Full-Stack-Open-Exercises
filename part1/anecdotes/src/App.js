import { useState } from "react";

const Votes = ({ votes }) => (
  <div>
    has {votes} {votes === 1 ? "vote" : "votes"}
  </div>
);

const Anecdote = ({ anecdote, numVotes: votes }) => (
  <>
    <div>{anecdote}</div>
    <Votes votes={votes} />
  </>
);

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length));

  const randomizeAnecdote = () =>
    setSelected(Math.floor(Math.random() * anecdotes.length));

  const voteForAnecdote = () => {
    const copy = [...votes];
    copy[selected]++;
    setVotes(copy);
  };

  const indexOfMax = (arr) => {
    const max = Math.max(...arr);
    return arr.indexOf(max);
  };

  const mostVoted = indexOfMax(votes);

  // Im not sure I entirely see the point behind a Button and Header component like a lot of the examples show.
  // They don't abstract anything meaningful away unless we are doing more with the header/button.
  // Probably lack of knowledge from me, but the simplest and most effective code imo is this - DRY and YAGNI
  return (
    <>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={anecdotes[selected]} numVotes={votes[selected]} />
      <button onClick={randomizeAnecdote}>next anecdote</button>
      <button onClick={voteForAnecdote}>vote</button>
      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote={anecdotes[mostVoted]} numVotes={votes[mostVoted]} />
    </>
  );
};

export default App;
