import React from 'react'

// css 
import './OurTeam.css'

const OurTeam = () => {
    return (
        <>
            <section className='our_team sect_padding'>
                <div className='container'>
                    <div className="section_title">
                        <div class="section_title_effect">OUR TEAM</div>
                        <h3>Unveiling the Stars Behind Our Success</h3>
                    </div>
                    <div className='team_member'>
                    <div className='tm_single'>
                        <div class="flip-card" tabIndex="0">
                            <div class="flip-card-inner">
                                <div class="flip-card-front">
                                    <h3>Hover, please!</h3>
                                </div>
                                <div class="flip-card-back">
                                    <h3>Whoaaa!!!</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            
            </section>
        </>
    )
}

export default OurTeam
