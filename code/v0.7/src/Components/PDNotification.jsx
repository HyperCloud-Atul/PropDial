import React from "react";
import { useState, useEffect } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const PDNotification = ({ notification }) => {
  // show more show less start
  const [expanded, setExpanded] = useState(false);

  const handleShowMoreClick = () => {
    setExpanded(!expanded);
  };
  const parentClassName = `propagentusersingle ${expanded ? "showmore" : ""}`;
  // show more show less end

  // Check if notification.createdAt exists before using it
  const createdAt = notification.createdAt && notification.createdAt.toDate();

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
          <h6 className="phone_number">{notification.description}</h6>
        </div>
      </div>
      <h4 className="notification_date">
        <span>
          {createdAt
            ? formatDistanceToNow(createdAt, {
                addSuffix: true,
              })
            : ""}
        </span>
      </h4>
      {notification.description.length > 110 ? (
        <h6 onClick={handleShowMoreClick} className="expand_line pointer">
          {expanded ? "show less" : "show more"}
        </h6>
      ) : (
        ""
      )}
    </div>
  );
};

export default PDNotification;
