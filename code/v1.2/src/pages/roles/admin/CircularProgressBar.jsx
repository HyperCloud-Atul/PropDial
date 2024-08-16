import React from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./ProgressBar.css";

const ProgressBarCard = ({ title, value, color, number }) => {
  return (
    <div className="property_detail_single">
      <div className="left">
        <h6>
          <span>{title}</span>{" "}
        </h6>
        <h5>{number}</h5>
      </div>
      <h3></h3>
      <div className="property_detail_circular-progress">
        <CircularProgressbar
          value={value}
          text={`${value.toFixed(2)}%`}
          styles={buildStyles({
            textColor: "#fff",
            pathColor: color,
            trailColor: "#eee",
          })}
        />
      </div>
    </div>
  );
};

const CircularProgressBar = ({
  rentProperties,
  saleProperties,
  rentedoutProperties,
  soldoutProperties,
  commercialProperties,
  residentialProperties,
  totalProperties,
}) => {

  const navigate = useNavigate()

  const calculatePercentage = (value) => {
    return (value / totalProperties) * 100;
  };

  const colorPalette = {
    rent: "#5A10D5",
    sale: "#FA6304",
    commercial: "#888888",
    residential: "#5EAB6B",
  };

  const getAgentProperties = (searchFilterVal) => {
    // console.log('In getAgentProperties')
    navigate("/agentproperties", {
      state: {
        propSearchFilter: searchFilterVal,
        filterType: '',
        filterBy: 'BYOTHERS'
      }
    })
  };

  return (
    <>
      <div className="property_details">
        <div>
          <ProgressBarCard
            title="East India"
            value={calculatePercentage(rentProperties)}
            color={colorPalette.rent}
            number={rentProperties}
          />
        </div>

        <div>
          <ProgressBarCard
            title="West India"
            value={calculatePercentage(saleProperties)}
            color={colorPalette.sale}
            number={saleProperties}
          />
        </div>

        <div>
          <ProgressBarCard
            title="North India"
            value={calculatePercentage(rentedoutProperties)}
            color={colorPalette.rent}
            number={rentedoutProperties}
          />
        </div>

        <div>
          <ProgressBarCard
            title="South India"
            value={calculatePercentage(soldoutProperties)}
            color={colorPalette.sale}
            number={soldoutProperties}
          />
        </div>

        {/* <div>
          <ProgressBarCard
            title="Commercial Property"
            value={calculatePercentage(commercialProperties)}
            color={colorPalette.commercial}
            number={commercialProperties}
          />
        </div> */}
        {/* <div>
          <ProgressBarCard
            title="Residential Property"
            value={calculatePercentage(residentialProperties)}
            color={colorPalette.residential}
            number={residentialProperties}
          />
        </div> */}
      </div>
    </>
  );
};

export default CircularProgressBar;
