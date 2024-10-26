import React from "react";
import { useState, useEffect } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const PDNotification = ({ notification }) => {

  // Check if notification.createdAt exists before using it
  const createdAt = notification.createdAt && notification.createdAt.toDate();

  return (
    <div className="my_small_card notification_card">
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
      <h4 className="top_left_content">
       {notification.type}
      </h4>     
    </div>
  );
};

export default PDNotification;
