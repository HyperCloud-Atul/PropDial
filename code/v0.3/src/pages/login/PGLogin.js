import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { Link } from 'react-router-dom'
import Hero from '../../Components/Hero'

// styles
// import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isPending } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div>
    <Hero pageTitle="Login" pageSubTitle="login and signup"></Hero>

      <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '350px' }}>
        <div className='page-title'>
          <h1>Login </h1>
        </div>
        <br />
        <label>
          <div className='form-field-title'>
            <span className="material-symbols-outlined">
              person
            </span>
            <h1>Email </h1>

            <input
              required
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
        </label>

        <label>
          <div className='form-field-title'>
            <span className="material-symbols-outlined">
              lock
            </span>
            <h1>Password </h1>

            <input
              required
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {error && <div className="error">{error}</div>}
          {/* {<div className="error">{error} this is error box</div>} */}
          {!isPending && <button className="btn">Log in</button>}
          {isPending && <button className="btn" disabled>Signing...</button>}

        </div>
        <br />
        <div className='sign-up-or-div'>
          <h1>OR</h1>
        </div>
        <br />

        <div className='sign-in-with-more-methods-div'>
          <img src="./img/google-icon.png" alt="" />
          <span>Sign in with Google</span>
        </div>

        <br /><br />
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--lightgrey-color)' }} > Don't have an account? <Link to='/Signup' style={{ paddingLeft: '5px', color: 'var(--red-color)' }}> Sign up </Link> </span>
        </div>
      </form >
    </div >
  )
}
