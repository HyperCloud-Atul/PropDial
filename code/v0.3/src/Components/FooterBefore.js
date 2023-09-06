import React from 'react'
import { Link } from 'react-router-dom'

// css 
import './FooterBefore.css'


const FooterBefore = () => {
  return (
    <div>
      <section className='footer_before relative'
      style={{
        backgroundImage:"url('./assets/img/footer-before-bg.jpg')"
      }}
      >
        <div className='container'>
            <div className='fb_inner'>
                <h3>GET ACCESS TO THE BEST PROPERTY AROUND</h3>
                <h6>Listed Over 3000+ Properties Around You</h6>
                <div className='btn_group'>
               <Link to="search-property">
               <button className='theme_btn btn_white'>
               <span class="material-symbols-outlined btn_arrow ba_animation">
                                arrow_forward
                              </span>
                              Search A Property</button>
               </Link>
               <Link to="search-property">
                <button className='theme_btn btn_white'>
                <span class="material-symbols-outlined btn_arrow ba_animation">
                                arrow_forward
                              </span>
                              View All Properties</button>
                </Link>
                </div>
            </div>
        </div>
      </section>
    </div>
  )
}

export default FooterBefore
