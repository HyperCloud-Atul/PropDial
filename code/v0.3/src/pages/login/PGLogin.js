
import { useLogin } from '../../hooks/useLogin'
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Hero from '../../Components/Hero'
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";

// styles
// import './Login.css'
import "./PGLoginSignup.css"

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
    <div className='pgloginsignup'>
      <Hero pageTitle="Login" pageSubTitle="login and signup" heroImage="./assets/img/loginbanner.jpg"></Hero>

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
          <img src="./img/google-icon.jpg" alt="" />
          <span>Sign in with Google</span>
        </div>

        <br /><br />
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--lightgrey-color)' }} > Don't have an account? <Link to='/Signup' style={{ paddingLeft: '5px', color: 'var(--red-color)' }}> Sign up </Link> </span>
        </div>
      </form > */}
      <section className="form_sec">
        <div className="left_img">
          {/* <img src="./assets/img/contact_from_left.jpg" alt="Left" /> */}
          <Carousel>
            <Carousel.Item>
              <div className="ad_container">
                <img src="./assets/img/p1.jpg" alt="Offer 1" />
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="ad_container">
                <img src="./assets/img/p2.jpg" alt="Offer 1" />
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="ad_container">
                <img src="./assets/img/p3.jpg" alt="Offer 1" />
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
        <div
          className="right_form relative" >
          <Carousel>
            <Carousel.Item>
              <div className="ad_container">
                <img src="./assets/img/p2.jpg" alt="Offer 1" />
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="ad_container">
                <img src="./assets/img/p3.jpg" alt="Offer 1" />
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="ad_container">
                <img src="./assets/img/p1.jpg" alt="Offer 1" />
              </div>
            </Carousel.Item>
          </Carousel>
          <div className='login_inner'>
            <div className='section_title'>
              <h3>Login as</h3>
            </div>
            <div className='login_btn'>
            <Link className='theme_btn btn_white' to="https://www.propdial.com/workshop/user_login.php">
              <img src='./assets/img/owner.jpg'></img>
              <span>Owner</span>
            </Link>
            <Link className='theme_btn btn_white' to="https://www.propdial.com/workshop/tenant_login.php">
            <img src='./assets/img/tenant.jpg'></img>
              <span>Tenant</span>
            </Link>
            <Link className='theme_btn btn_white' to="https://www.propdial.com/workshop/broker_login.php">
            <img src='./assets/img/agent.jpg'></img>
             <span>Agent</span>
            </Link>
            </div>
          </div>
          


        </div>
      </section>


    </div >
  )
}
