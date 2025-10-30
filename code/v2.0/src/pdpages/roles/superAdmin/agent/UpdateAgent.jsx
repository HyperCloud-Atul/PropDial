import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import ScrollToTop from "../../../../components/ScrollToTop";
import InactiveUserCard from "../../../../components/InactiveUserCard";
import AddAgent from "./AddAgent";
const UpdateAgent = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  
  return (
    <div>
      <ScrollToTop />
      {user && user.status === "active" ? (
        <AddAgent         
          agentID={id}
        />
      ) : (        
        <InactiveUserCard />
      )}
    </div>
  );
};

export default UpdateAgent;
