import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateSlug } from "../../utils/generateSlug";

const PropertySummaryCard = ({ propertydoc, propertyId }) => {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleClick = (e) => {
    if (window.innerWidth > 575) {
      navigate(`/propertydetails/${generateSlug(propertydoc)}`);     
    } else {
      e.preventDefault();
    }
  };

  function formatNumberWithCommas(number) {
    let numStr = number.toString();
    const [integerPart, decimalPart] = numStr.split(".");
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    const formattedNumber =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherDigits ? "," : "") +
      lastThreeDigits;
    return decimalPart ? `${formattedNumber}.${decimalPart}` : formattedNumber;
  }

  return (
    <div className="col-lg-6">
      {propertydoc && (
        <div
          className="title_card short_prop_summary relative pointer"
          onClick={handleClick}
        >
          {expanded && (
            <div className="top on_mobile_575">
              <div
                className="d-flex align-items-center"
                style={{
                  gap: "5px",
                }}
              >
                <h6
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  {propertydoc.unitNumber} | {propertydoc.society}{" "}
                </h6>
              </div>
            </div>
          )}
          <div className="on_desktop_hide_575">
            <div className="left">
              <div className="img">
                <img
                  src={
                    propertydoc.images.length > 0
                      ? propertydoc.images[0]
                      : propertydoc.category === "Residential"
                      ? "/assets/img/admin_banner.jpg"
                      : propertydoc.category === "Commercial"
                      ? "/assets/img/commercial.jpg"
                      : propertydoc.category === "Plot"
                      ? "/assets/img/plot.jpg"
                      : "/assets/img/admin_banner.jpg"
                  }
                  alt={propertydoc.bhk || "Property Image"}
                />
              </div>
              <div className="detail">
                <div>
                  <span className="card_badge">{propertydoc.pid}</span>{" "}
                  <span
                    className={`card_badge ${propertydoc.isActiveInactiveReview.toLowerCase()}`}
                  >
                    {propertydoc.isActiveInactiveReview}
                  </span>
                </div>
                <h6 className="demand">
                  <span>₹</span>
                  {propertydoc.flag.toLowerCase() === "pms only" ||
                  propertydoc.flag.toLowerCase() === "pms after rent" ||
                  propertydoc.flag.toLowerCase() === "available for rent" ||
                  propertydoc.flag.toLowerCase() === "rented out"
                    ? propertydoc.demandPriceRent &&
                      formatNumberWithCommas(propertydoc.demandPriceRent)
                    : propertydoc.flag.toLowerCase() === "rent and sale" ||
                      propertydoc.flag.toLowerCase() === "rented but sale"
                    ? propertydoc.demandPriceRent &&
                      formatNumberWithCommas(propertydoc.demandPriceRent) +
                        " / ₹" +
                        propertydoc.demandPriceSale &&
                      formatNumberWithCommas(propertydoc.demandPriceSale)
                    : propertydoc.demandPriceSale &&
                      formatNumberWithCommas(propertydoc.demandPriceSale)}
                  <span
                    style={{
                      marginLeft: "3px",
                    }}
                  >
                    Demand for {propertydoc.purpose}
                  </span>
                  {/* {propertydoc.maintenancecharges !== "" && (
                      <span
                        style={{
                          fontSize: "10px",
                        }}
                      >
                        + ₹{propertydoc.maintenancecharges} (
                        {propertydoc.maintenancechargesfrequency})
                      </span>
                    )} */}
                </h6>
                <h6>
                  {propertydoc.unitNumber} | {propertydoc.society}{" "}
                </h6>
                <h6>
                  {propertydoc &&
                    (propertydoc.category === "Residential" ? (
                      <>
                        {propertydoc.bhk} {propertydoc.furnishing && "|"}{" "}
                        {propertydoc.furnishing && `${propertydoc.furnishing}`}{" "}
                      </>
                    ) : propertydoc.category === "Commercial" ? (
                      <>
                        Your perfect {propertydoc.propertyType} awaits—on{" "}
                        {propertydoc.purpose.toLowerCase() === "rentsaleboth"
                          ? "Rent / Lease Now"
                          : propertydoc.purpose.toLowerCase() === "rent"
                          ? "Lease Now"
                          : propertydoc.purpose.toLowerCase() === "sale"
                          ? "Sale Now"
                          : ""}
                      </>
                    ) : propertydoc.category === "Plot" ? (
                      <>
                        {propertydoc.propertyType} Plot | For{" "}
                        {propertydoc.purpose.toLowerCase() === "rentsaleboth"
                          ? "Rent / Lease"
                          : propertydoc.purpose.toLowerCase() === "rent"
                          ? "Lease"
                          : propertydoc.purpose.toLowerCase() === "sale"
                          ? "Sale"
                          : ""}
                      </>
                    ) : null)}
                </h6>
                <h6>
                  {propertydoc.locality}, {propertydoc.city} |{" "}
                  {propertydoc.state}
                </h6>
              </div>
            </div>
          </div>
          <div className="on_mobile_575">
            {!expanded && (
              <div className="left">
                <div className="img w-100 d-flex align-items-center">
                  {propertydoc.images.length > 0 ? (
                    <img src={propertydoc.images[0]} alt={propertydoc.bhk} />
                  ) : (
                    <img src="/assets/img/admin_banner.jpg" alt="propdial" />
                  )}
                  <Link
                    // to={`/propertydetails/${propertyId}`}
                     to={`/propertydetails/${generateSlug(propertydoc)}`}
                    className="text_green text-center"
                    style={{
                      flexGrow: "1",
                    }}
                  >
                    View Detail
                  </Link>
                </div>
                <div className="detail">
                  <div>
                    <span className="card_badge">{propertydoc.pid}</span>{" "}
                    <span className="card_badge">
                      {propertydoc.isActiveInactiveReview}
                    </span>
                  </div>
                  <h6 className="demand">
                    <span>₹</span>
                    {propertydoc.flag.toLowerCase() === "pms only" ||
                    propertydoc.flag.toLowerCase() === "pms after rent" ||
                    propertydoc.flag.toLowerCase() === "available for rent" ||
                    propertydoc.flag.toLowerCase() === "rented out"
                      ? propertydoc.demandPriceRent &&
                        formatNumberWithCommas(propertydoc.demandPriceRent)
                      : propertydoc.flag.toLowerCase() === "rent and sale" ||
                        propertydoc.flag.toLowerCase() === "rented but sale"
                      ? propertydoc.demandPriceRent &&
                        formatNumberWithCommas(propertydoc.demandPriceRent) +
                          " / ₹" +
                          propertydoc.demandPriceSale &&
                        formatNumberWithCommas(propertydoc.demandPriceSale)
                      : propertydoc.demandPriceSale &&
                        formatNumberWithCommas(propertydoc.demandPriceSale)}

                    {propertydoc.maintenancecharges !== "" && (
                      <span
                        style={{
                          fontSize: "10px",
                        }}
                      >
                        + ₹{propertydoc.maintenancecharges} (
                        {propertydoc.maintenancechargesfrequency})
                      </span>
                    )}
                  </h6>
                  <h6>
                    {propertydoc.unitNumber} | {propertydoc.society}{" "}
                  </h6>
                  <h6>
                    {propertydoc.bhk} | {propertydoc.propertyType}{" "}
                    {propertydoc.furnishing === ""
                      ? ""
                      : " | " + propertydoc.furnishing + ""}{" "}
                  </h6>
                  <h6>
                    {propertydoc.locality}, {propertydoc.city} |{" "}
                    {propertydoc.state}
                  </h6>
                </div>
              </div>
            )}
          </div>

          <div className="expand on_mobile_575" onClick={handleExpand}>
            <span className="material-symbols-outlined">
              {expanded ? "keyboard_arrow_down" : "keyboard_arrow_up"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySummaryCard;
