import React from 'react'

// components 
import Hero from '../../Components/Hero'

// css 
import './PGContactUs.css'
const PGContactUs = () => {
    return (
        <div className="pg_contact_us">
            <Hero pageTitle="Contact Us" pageSubTitle="Reach Out to Us" heroImage="./assets/img/contact_us_page_hero.jpg"></Hero>
            <section className="loc_em_ph">
                <div className="container">              
                    <div
                        className="loc_em_ph_inner"
                        style={{
                            backgroundImage: "url('./assets/img/counterbg.png')",
                        }}
                    >
                        <div className="lep_single">
                            <div>
                                <div className="icon_div ">
                                    <img src="./assets/img/location_f_cpg.png"></img>
                                </div>
                                <h4>Address</h4>
                            </div>
                            <h6 className="lep_single_address">
                            #204, 2nd floor, Vipul Trade Centre,

Sector 48, Sohna Road, Gurugram - 122 018, Haryana
                            </h6>
                        </div>
                        <div className="lep_single">
                            <div>
                                <div className="icon_div">
                                    <img src="./assets/img/emailcpg.png"></img>
                                </div>
                                <h4>Email</h4>
                            </div>
                            <h6>info@propdial.com</h6>
                        </div>
                        <div className="lep_single">
                            <div>
                                <div className="icon_div">
                                    <span className="material-symbols-outlined ">
                                        deskphone
                                    </span>
                                </div>
                                <h4>Phone</h4>
                            </div>
                            <h6>
                            +91 95821 95821
                                <br />
                                +91 95821 95821
                            </h6>
                        </div>
                    </div>
                </div>
            </section>
            <section className="form_sec">
                <div className="left_img">
                    <img src="./assets/img/contact_us_page_hero.jpg" alt="Left" />
                </div>
                <div
                    className="right_form"
                    style={{
                        backgroundImage: "url('./assets/img/contact_us_page_hero.jpg')",
                    }}
                >
                    <form>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form_field">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        name="name"                                       
                                    
                                    />
                                    <div className="field_icon">
                                        <span className="material-symbols-outlined">Person</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form_field">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                     
                                    />
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
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        name="subject"
                               
                                    />
                                    <div className="field_icon">
                                        <span className="material-symbols-outlined">subject</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form_field">
                                    <textarea
                                        type="text"
                                        placeholder="Message"
                                        name="message"
                                    
                                    />
                                    <div className="field_icon">
                                        <span className="material-symbols-outlined">chat</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="submit_btn">
                                    <button
                                        type="submit"
                                        className="btn_fill"
                                       
                                    >
                                     Send
                                    </button>
                                </div>                          
                       
                            </div>
                        </div>
                    </form>
                </div>
           
                <iframe
                    title="Dentamax Clinic Location"
                    src="https://www.google.com/maps/dir//Propdial.com,+%23204,+2nd+floor,+Vipul+Trade+Centre,,+Sector+48,+Sohna+Road,+Gurugram,+Haryana+122018/@28.407147,77.04139,17z/data=!4m17!1m7!3m6!1s0x390d229097047f95:0x2d5ea723e57d3e4b!2sPropdial.com!8m2!3d28.406807!4d77.0424955!16s%2Fg%2F11g9djcvrs!4m8!1m0!1m5!1m1!1s0x390d229097047f95:0x2d5ea723e57d3e4b!2m2!1d77.0424955!2d28.406807!3e9?hl=en&entry=ttu"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                ></iframe>
       
            </section>
        </div>
    )
}

export default PGContactUs
