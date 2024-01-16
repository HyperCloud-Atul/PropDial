import React, { useState } from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const PropAgentNotification = ({ notification }) => {
  // show more show less start
  const [expanded, setExpanded] = useState(false);

  const handleShowMoreClick = () => {
    setExpanded(!expanded);
  };
  const parentClassName = `propagentusersingle ${expanded ? "showmore" : ""}`;
  // show more show less end
  return (
  
      <div className={parentClassName}>
        <div className="left">
          <div>
            <div className="img_div">
              <img src="./assets/img/loudspeaker.jpg" alt="" />
            </div>
          </div>
          <div className="">
            <h5 className="name">{notification.shortDescription}</h5>
            <h6 className="phone_number">
              {notification.description}
            </h6>
          </div>
        </div>
        <h4 className="notification_date">
          <span>{formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}</span>
        </h4>
        {notification.description.length > 110 ? <h6 onClick={handleShowMoreClick} className="expand_line pointer">
          {expanded ? "show less" : "show more"}
        </h6> : ''}
             {/* <div className={parentClassName}>
        <div className="left">
          <div>
            <div className="img_div">
              <img src="./assets/img/congratulation.jpg" alt="" />
            </div>
          </div>
          <div className="">
            <h5 className="name">Feature Update</h5>
            <h6 className="phone_number">
              New feature update to search the property using free text search
            </h6>
          </div>
        </div>
        <h4 className="notification_date">
          <span>10 Jan 2024</span> - <span>10:00AM</span>
        </h4>
        <h6 onClick={handleShowMoreClick} className="expand_line pointer">
          {expanded ? "show less" : "show more"}
        </h6>
      </div> */}
      </div>
 
   
  );
};

export default PropAgentNotification;
