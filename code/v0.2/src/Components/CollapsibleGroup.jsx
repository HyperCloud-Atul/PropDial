import React from "react";
import Collapsible from "react-collapsible";

// style
import "./CollapsibleGroup.css";

const CollapsibleGroup = () => {
  return (
    <div className="parent_div">
      <div className="container">
        <div className="row">
          {/* Left section */}
          <div className="col-md-6 col-sm-12 d-flex justify-content-center img-div">
            <img src="./assets/img/coll-img.png" />
          </div>

          {/* Right section */}
          <div className="col-md-6 col-sm-12 d-flex justify-content-center flex-column right_sec">
            <div>
              <h4>Our Value</h4>
              <h2>Value We Give To You.</h2>
              <p
                style={{
                  color: "grey",
                  fontSize: "18px",
                  letterSpacing: "1px",
                }}
              >
                Property Management Systems or Hotel Operating System, under
                business, terms may be used in real estate hospitality
                accommodation management.
              </p>
            </div>

            <div className="collaps-main">
              <div className="d-flex align-items-center collaps-main-child">
                <div className="collaps-icon">
                  <i class="bi bi-house-heart-fill"></i>
                </div>
                <Collapsible trigger="What is PMS" className="collaps_trigger">
                  <p
                    style={{
                      marginLeft: "30px",
                      color: "#3F5E98",
                      letterSpacing: "1px",
                    }}
                  >
                    Property Management Systems or Hotel Operating System, under
                    business, terms may be used in real estate, manufacturing,
                    logistics, intellectual property, government, or hospitality
                    accommodation management.
                  </p>
                </Collapsible>
              </div>

              <div className="d-flex align-items-center collaps-main-child">
                <div className="collaps-icon">
                  <i class="bi bi-currency-exchange"></i>
                </div>
                <Collapsible
                  trigger="Best interest rates on the market"
                  className="collaps_trigger"
                >
                  <p
                    style={{
                      marginLeft: "30px",
                      color: "#3F5E98",
                      letterSpacing: "1px",
                    }}
                  >
                    Property Management Systems or Hotel Operating System, under
                    business, terms may be used in real estate, manufacturing,
                    logistics, intellectual property, government, or hospitality
                    accommodation management.
                  </p>
                </Collapsible>
              </div>

              <div className="d-flex align-items-center collaps-main-child">
                <div className="collaps-icon">
                  <i class="bi bi-database-fill-down"></i>
                </div>
                <Collapsible
                  trigger="Prevent unstable prices"
                  className="collaps_trigger"
                >
                  <p
                    style={{
                      marginLeft: "30px",
                      color: "#3F5E98",
                      letterSpacing: "1px",
                    }}
                  >
                    Property Management Systems or Hotel Operating System, under
                    business, terms may be used in real estate, manufacturing,
                    logistics, intellectual property, government, or hospitality
                    accommodation management.
                  </p>
                </Collapsible>
              </div>

              <div className="d-flex align-items-center collaps-main-child">
                <div className="collaps-icon">
                  <i class="bi bi-star-fill"></i>{" "}
                </div>
                <Collapsible
                  trigger="Best price on the market"
                  className="collaps_trigger"
                >
                  <p
                    style={{
                      marginLeft: "30px",
                      color: "#3F5E98",
                      letterSpacing: "1px",
                    }}
                  >
                    Property Management Systems or Hotel Operating System, under
                    business, terms may be used in real estate, manufacturing,
                    logistics, intellectual property, government, or hospitality
                    accommodation management.
                  </p>
                </Collapsible>
              </div>

              <div className="d-flex align-items-center collaps-main-child">
                <div className="collaps-icon">
                  <i class="bi bi-shield-lock-fill"></i>{" "}
                </div>
                <Collapsible
                  trigger="Security of your data"
                  className="collaps_trigger"
                >
                  <p
                    style={{
                      marginLeft: "30px",
                      color: "#3F5E98",
                      letterSpacing: "1px",
                    }}
                  >
                    Property Management Systems or Hotel Operating System, under
                    business, terms may be used in real estate, manufacturing,
                    logistics, intellectual property, government, or hospitality
                    accommodation management.
                  </p>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleGroup;
