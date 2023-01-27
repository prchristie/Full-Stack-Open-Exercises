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
            id="username-input"
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            id="password-input"
          />
        </div>
        <button type="submit" id="login-button">login</button>
      </form>
    </>
  )
}

export default LoginForm
