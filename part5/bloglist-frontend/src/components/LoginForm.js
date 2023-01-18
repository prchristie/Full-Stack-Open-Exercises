import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin(username, password)
          setUsername('')
          setPassword('')
        }}
      >
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default LoginForm
