
import { useLogin } from '../../hooks/useLogin';
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Hero from '../../components/Hero';
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";

// styles
// import './Login.css'
import "./PGLoginSignup.css"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isPending } = useLogin()
  const [loginAsOwner, setLoginAsOwner] = useState(true);

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
    <div className='pgloginsignup pgls_mobile'>
      <Hero pageTitle="Login" pageSubTitle="login and signup" heroImage="./assets/img/loginbanner.jpg"></Hero>


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
              <h3>{loginAsOwner ? 'Login As' : 'Login As Owner'} </h3>
            </div>
            <form onSubmit={handleSubmit} className={`login_form ${loginAsOwner ? 'hidden' : 'Show'}`}>
              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form_field'>
                    <input
                      required
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      placeholder='Email'
                    />
                    <div className="field_icon"><span className="material-symbols-outlined">mail</span></div>
                  </div>
                </div>
                <div className='col-sm-6'>
                  <div className='form_field'>
                    <input
                      required
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      placeholder='Password'
                    />
                    <div className="field_icon"><span className="material-symbols-outlined">mail</span></div>
                  </div>
                </div>
                <div className='col-sm-12' style={{
                  textAlign: "center"
                }}>
                  {!isPending && <button className="theme_btn btn_fill">Log in<span className="material-symbols-outlined btn_arrow ba_animation">arrow_forward</span></button>}
                  {isPending && <button className="theme_btn btn_fill" disabled>Signing...<span className="material-symbols-outlined btn_arrow ba_animation">arrow_forward</span></button>}
                  {error && <div className="error">{error}</div>}
                  <div onClick={() => setLoginAsOwner(!loginAsOwner)} className={`back_login_option ${loginAsOwner ? 'hidden' : 'show'}`}>
                    <span className="material-symbols-outlined">
                      arrow_back
                    </span>
                    Back to Login Options
                  </div>
                </div>
              </div>







              {/* <div style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--lightgrey-color)' }} > Don't have an account? <Link to='/Signup' style={{ paddingLeft: '5px', color: 'var(--red-color)' }}> Sign up </Link> </span>
              </div> */}
            </form >
            <div className={`login_btn ${loginAsOwner ? 'show' : 'hidden'}`}>
              <div className='theme_btn btn_white pointer' onClick={() => setLoginAsOwner(!loginAsOwner)}>
                <img src='./assets/img/owner.jpg'></img>
                <span>Owner</span>
              </div>
              <Link className='theme_btn btn_white pointer' to="https://www.propdial.com/workshop/tenant_login.php">
                <img src='./assets/img/tenant.jpg'></img>
                <span>Tenant</span>
              </Link>
              <Link className='theme_btn btn_white pointer' to="https://www.propdial.com/workshop/broker_login.php">
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
