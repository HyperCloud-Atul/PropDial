// npm i react-countup

import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import "./CounterSection.css";

const CounterSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldCount, setShouldCount] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const counterRef = useRef(null);

  // Counter configurations for each counter
  const countersConfig = [
    { start: 0, end: 15, duration: 2 },
    { start: 0, end: 20, duration: 3 },
    { start: 0, end: 25, duration: 1 },
    { start: 0, end: 10, duration: 4 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          setShouldCount(false); // Stop counting when section is not visible
          setCounts(counts.map(() => 0)); // Reset all counts when section is not visible
        }
      });
    });

    observer.observe(counterRef.current);

    // Clean up the observer when the component unmounts
    return () => observer.disconnect();
  }, [counts]);

  useEffect(() => {
    if (isVisible) {
      setShouldCount(true); // Start counting when section becomes visible
    }
  }, [isVisible]);

  useEffect(() => {
    let interval;
    if (shouldCount) {
      interval = setInterval(() => {
        setCounts((prevCounts) =>
          prevCounts.map((prevCount, index) =>
            prevCount < countersConfig[index].end ? prevCount + 1 : prevCount
          )
        );
      }, 20); // Adjust the interval for smoother counting (lower values may result in faster counting)
    } else {
      clearInterval(interval); // Stop counting when the section is not visible
    }

    return () => clearInterval(interval); // Clean up the interval when the component unmounts or counting stops
  }, [shouldCount]);

  return (
    <div ref={counterRef}>
      {shouldCount && (
        <section className="counter sect_padding">
          <div className="container">
            <div className="row">
            <div className="col-lg-3">
                <div className="count_single relative">
                  <div className="cs_inner">
                    <div className="number_count">
                      <CountUp
                        start={countersConfig[3].start}
                        end={countersConfig[3].end}
                        duration={countersConfig[3].duration}
                      />
                      K+
                    </div>
                    <div className="count_which">
                      <h6>Beautiful</h6>
                      <h5>Properties</h5>
                    </div>
                  </div>
                  <div className="count_bg_number">10</div>
                </div>
                {/* <p>Current Count: {counts[1]}</p> */}
              </div>
              <div className="col-lg-3">
                <div className="count_single relative">
                  <div className="cs_inner">
                    <div className="number_count">
                      <CountUp
                        start={countersConfig[0].start}
                        end={countersConfig[0].end}
                        duration={countersConfig[0].duration}
                      />
                      +
                    </div>
                    <div className="count_which">
                      <h6>Years of
                      </h6>
                      <h5>Experience</h5>
                    </div>
                  </div>
                  <div className="count_bg_number">15</div>
                </div>
                {/* <p>Current Count: {counts[0]}</p> */}
              </div>
              <div className="col-lg-3">
                <div className="count_single relative">
                  <div className="cs_inner">
                    <div className="number_count">
                      <CountUp
                        start={countersConfig[1].start}
                        end={countersConfig[1].end}
                        duration={countersConfig[1].duration}
                      />
                      +
                    </div>
                    <div className="count_which">
                      <h6>Cities Presence in 
</h6>
                      <h5>India</h5>
                    </div>
                  </div>
                  <div className="count_bg_number">20</div>
                </div>
                {/* <p>Current Count: {counts[1]}</p> */}
              </div>
              <div className="col-lg-3">
                <div className="count_single relative">
                  <div className="cs_inner">
                    <div className="number_count">
                      <CountUp
                        start={countersConfig[2].start}
                        end={countersConfig[2].end}
                        duration={countersConfig[2].duration}
                      />
                      K+
                    </div>
                    <div className="count_which">
                      <h6>Happy</h6>
                      <h5>Customers</h5>
                    </div>
                  </div>
                  <div className="count_bg_number">25</div>
                </div>
                {/* <p>Current Count: {counts[1]}</p> */}
              </div>
             

            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CounterSection;
