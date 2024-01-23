import React from 'react'
import { Link, useLocation } from "react-router-dom";

// css 
import './FooterBefore.css'


const FooterBefore = () => {
  const location = useLocation(); // Get the current location
  // footer before display none Array 
  const excludedPaths = ["/", "aboutus", "contactus", "more-menu"];
  const shouldHide = excludedPaths.includes(location.pathname);
  const className = `footer_before relative ${shouldHide ? "" : "d_none"}`;
  // footer before display none Array 
  return (
    <div>
      <section className={className}
      style={{
        backgroundImage:"url('./assets/img/footer-before-bg.jpg')"
      }}
      >
        <div className='container'>
            <div className='fb_inner'>
                <h3>GET ACCESS TO THE BEST PROPERTY AROUND</h3>
                <h6>Listed Over 40K+ Properties Around You</h6>
                <div className='btn_group'>
               <Link to="search-property">
               <button className='theme_btn btn_white'>
               <span class="material-symbols-outlined btn_arrow ba_animation">
                                arrow_forward
                              </span>
                              Search Properties</button>
               </Link>
               {/* <Link to="search-property">
                <button className='theme_btn btn_white'>
                <span class="material-symbols-outlined btn_arrow ba_animation">
                                arrow_forward
                              </span>
                              View All Properties</button>
                </Link> */}
                </div>
            </div>
        </div>
      </section>
    </div>
  )
}

export default FooterBefore
