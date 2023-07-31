import { styled } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ScrollTrigger from "react-scroll-trigger";

// style
import "./CircularProgressBar.css";

function CircularProgressBar() {
  const [percentage1, setPercentage1] = useState(0);
  const [counterOn1, setCounterOn1] = useState(false);

  const [percentage2, setPercentage2] = useState(0);
  const [counterOn2, setCounterOn2] = useState(false);

  const [percentage3, setPercentage3] = useState(0);
  const [counterOn3, setCounterOn3] = useState(false);

  useEffect(() => {
    const increasePercentage1 = () => {
      if (percentage1 < 73) {
        setPercentage1((prevPercentage) => prevPercentage + 1);
      }
    };

    const increasePercentage2 = () => {
      if (percentage2 < 86) {
        setPercentage2((prevPercentage) => prevPercentage + 1);
      }
    };

    const increasePercentage3 = () => {
      if (percentage3 < 76) {
        setPercentage3((prevPercentage) => prevPercentage + 1);
      }
    };

    if (counterOn1 && percentage1 < 73) {
      const interval1 = setInterval(increasePercentage1, 25);
      return () => clearInterval(interval1);
    }

    if (counterOn2 && percentage2 < 86) {
      const interval2 = setInterval(increasePercentage2, 25);
      return () => clearInterval(interval2);
    }

    if (counterOn3 && percentage3 < 76) {
      const interval3 = setInterval(increasePercentage3, 25);
      return () => clearInterval(interval3);
    }
  }, [
    counterOn1,
    percentage1,
    counterOn2,
    percentage2,
    counterOn3,
    percentage3,
  ]);

  const handleScrollEnter = () => {
    setPercentage1(0);
    setCounterOn1(true);

    setPercentage2(0);
    setCounterOn2(true);

    setPercentage3(0);
    setCounterOn3(true);
  };

  return (
    <>
      <ScrollTrigger
        onEnter={handleScrollEnter}
        onExit={() => {
          setCounterOn1(false);
          setCounterOn2(false);
          setCounterOn3(false);
        }}
      >
        <div className="scroll_bar_parent">
          <div className="container">
            <div className="row">
              <div className="first_card_parent d-flex justify-content-center col-sm-12 col-md-12 col-lg-4">
                <div className="d-flex">
                  <div className="">
                    <div>
                      <div className="parent_scroll">
                        <CircularProgressbar
                          value={percentage1}
                          text={`${percentage1}%`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="right_div d-flex justify-content-center flex-column">
                    <p>OUR</p>
                    <h2>Expertise</h2>
                    <p>PropDial PMS showcases proven expertise.</p>
                  </div>
                </div>
              </div>

              {/* 2nd progress */}
              <div className="first_card_parent d-flex justify-content-center col-sm-12 col-md-12 col-lg-4">
                <div className="d-flex">
                  <div className="">
                    <div>
                      <div className="parent_scroll">
                        <CircularProgressbar
                          value={percentage2}
                          text={`${percentage2}%`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="right_div d-flex justify-content-center flex-column">
                    <p>HAPPY</p>
                    <h2>Clients</h2>
                    <p>Happy clients trust PropDial PMS.</p>
                  </div>
                </div>
              </div>

              {/* 3rd progress */}
              <div className="first_card_parent d-flex justify-content-center col-sm-12 col-md-12 col-lg-4">
                <div className="d-flex">
                  <div className="">
                    <div>
                      <div className="parent_scroll">
                        <CircularProgressbar
                          value={percentage3}
                          text={`${percentage3}%`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="right_div d-flex justify-content-center flex-column">
                    <p>COMPLETED</p>
                    <h2>Projects</h2>
                    <p>PropDial PMS boasts successful completed projects.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollTrigger>
    </>
  );
}

export default CircularProgressBar;
