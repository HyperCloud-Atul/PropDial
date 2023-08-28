
import { useLogin } from '../../hooks/useLogin'
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
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
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes en
  return (
    <div>
    <Hero pageTitle="Login" pageSubTitle="login and signup"></Hero>

      {/* <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '350px' }}>
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
      </form > */}
       <section className="form_sec">
        <div className="left_img">
          <img src="./assets/img/contact_from_left.jpg" alt="Left" />
        </div>
        <div
          className="right_form"
          style={{
            backgroundImage: "url('./assets/img/contact_from_right.jpg')",
          }}
        >
          <form>
            <div className="row">
              <div className="col-sm-12">
                <div className="section_title mb-4">
                  <h3>Get In Touch With Us</h3>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form_field">
                  <input type="text" placeholder="Name" name="name" />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">Person</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form_field">
                  <input type="email" placeholder="Email" name="email" />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form_field">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    name="phoneNumber"
                  />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form_field">
                  <input type="text" placeholder="Subject" name="subject" />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">subject</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form_field">
                  <textarea type="text" placeholder="Message" name="message" />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="submit_btn">
                  <button type="submit" className=" theme_btn btn_fill">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <iframe
          title="Dentamax Clinic Location"
          src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=propdial managment company&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
        ></iframe>
      </section>


    </div >
  )
}
