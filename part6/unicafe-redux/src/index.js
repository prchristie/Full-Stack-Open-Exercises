import React from 'react'
import ReactDOM from 'react-dom/client'

import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './reducer'

const store = configureStore({ reducer: counterReducer })

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const StatisticLine = ({ statistic, value }) => {
  return (
    <tr>
      <td>{statistic}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  if (total === 0) {
    return <p>No feedback given</p>
  }
  return (
    <table>
      <tbody>
        <StatisticLine statistic="good" value={good} />

        <StatisticLine statistic="neutral" value={neutral} />

        <StatisticLine statistic="bad" value={bad} />
        <StatisticLine statistic="all" value={total} />

        <StatisticLine statistic="average" value={(good - bad) / total} />
        <StatisticLine
          statistic="positive"
          value={100 * (good / total) + ' %'}
        />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const state = store.getState()

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => store.dispatch({ type: 'GOOD' })} text="good" />
      <Button handleClick={() => store.dispatch({ type: 'OK' })} text="neutral" />
      <Button handleClick={() => store.dispatch({ type: 'BAD' })} text="bad" />
      <h1>statistics</h1>
      <Statistics good={state.good} neutral={state.ok} bad={state.bad} />
    </div>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'))
const renderApp = () => root.render(<App />)

renderApp()
store.subscribe(renderApp)
