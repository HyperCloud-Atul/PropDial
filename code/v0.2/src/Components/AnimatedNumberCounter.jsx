import React, { useState } from "react";
import "./AnimatedNumberCounter.css";
import CountUp from 'react-countup';
import ScrollTrigger from 'react-scroll-trigger';


const AnimatedNumberCounter = () => {

    const [counterOn, setCounterOn] = useState(false);

  return (
    <>
    <ScrollTrigger onEnter={()=>setCounterOn(true)} onExit={()=> setCounterOn(false)}>
    <div className="container section-work-data">
        <div className="row animated-number">
            <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="counter-numbers">
                    <i className="bi bi-hand-thumbs-up"></i>
                    <h2 className="counter-numbers" data-number="100">{counterOn && <CountUp start={0} end={100} duration={3} delay={0}/>}+</h2>
 <div className="divider-line"></div>
                    <p>Satisfaction Guaranteed</p>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="counter-numbers">
                    <i className="bi bi-calendar-check"></i>
                    <h2 className="counter-numbers" data-number="100">{counterOn && <CountUp start={0} end={2000} duration={3} delay={0}/>}+</h2>
                    <div className="divider-line"></div>
                    <p>Properties</p>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
                <i className="bi bi-people"></i>
                <div className="counter-numbers">
                    <h2 className="counter-numbers" data-number="100">{counterOn && <CountUp start={0} end={7000} duration={3} delay={0}/>}+</h2>
                    <div className="divider-line"></div>
                    <p>Happy Customers</p>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
                <i className="bi bi-house-heart"></i>
                <div className="counter-numbers">
                    <h2 className="counter-numbers" data-number="100">{counterOn && <CountUp start={0} end={3000} duration={3} delay={0}/>}+</h2>
                    <div className="divider-line"></div>
                    <p>Best Reviews</p>
                </div>
            </div>
        </div>
    </div>
    <br/>
    <br/><br/>
    </ScrollTrigger>
    </>
  );
};

export default AnimatedNumberCounter;