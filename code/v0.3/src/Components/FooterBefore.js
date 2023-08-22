import React from 'react'

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
                <button className='theme_btn btn_fill'>Search A Property</button>
                <button className='theme_btn btn_fill'>View All Properties</button>
                </div>
            </div>
        </div>
      </section>
    </div>
  )
}

export default FooterBefore
