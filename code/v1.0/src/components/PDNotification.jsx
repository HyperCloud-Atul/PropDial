import React from "react";
import { useState, useEffect } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const PDNotification = ({ notification }) => {
  // show more show less start
  const [expanded, setExpanded] = useState(false);

  const handleShowMoreClick = () => {
    setExpanded(!expanded);
  };
  const parentClassName = `my_small_card notification_card ${expanded ? "showmore" : ""}`;
  // show more show less end

  // Check if notification.createdAt exists before using it
  const createdAt = notification.createdAt && notification.createdAt.toDate();

  return (
    <div className={parentClassName}>
      <div className="left">       
          <div className="img_div">
            <img src="./assets/img/loudspeaker.jpg" alt="" />
          </div>      
        <div className="right">
          <h5 className="title">{notification.shortDescription}</h5>
          <h6 className="sub_title">{notification.description}</h6>
        </div>
      </div>
      <h4 className="top_right_content">
        <span>
          {createdAt
            ? formatDistanceToNow(createdAt, {
                addSuffix: true,
              })
            : ""}
        </span>
      </h4>
      {notification.description.length > 110 ? (
        <h6 onClick={handleShowMoreClick} className="expand_line pointer bottom_line_content">
          {expanded ? "show less" : "show more"}
        </h6>
      ) : (
        ""
      )}
    </div>
  );
};

export default PDNotification;
