import React, { useState } from "react";
import { Link } from "react-router-dom";

const NineDots = ({ nineDotsMenu }) => {
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);

  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };
  return (
    <div>
      <div onClick={openMoreAddOptions} className="property-list-add-property">
        <span className="material-symbols-outlined">apps</span>
      </div>
      <div
        className={
          handleMoreOptionsClick
            ? "more-add-options-div open"
            : "more-add-options-div"
        }
        onClick={closeMoreAddOptions}
        id="moreAddOptions"
      >
        <div className="more-add-options-inner-div">
          <div className="more-add-options-icons">
            <h1>Close</h1>
            <span className="material-symbols-outlined">close</span>
          </div>
          {nineDotsMenu.map((item, index) => (
            <Link to={item.link} className="more-add-options-icons">
              <h1>{item.title}</h1>
              <span className="material-symbols-outlined">{item.icon}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NineDots;
