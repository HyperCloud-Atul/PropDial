import React from "react";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useCollection } from "../../../hooks/useCollection";


// component
import PropAgentTicket from "./PropAgentTicket";

const PGAgentTickets = () => {
  const { user } = useAuthContext();

  const { documents: dbticketdocuments, error: dbticketerror } =
    useCollection("tickets", ["postedBy", "==", "Agent"]);

  const [activeTickets, setactiveTickets] = useState();

  useEffect(() => {
    // let propList = [];
    const activeTicketDocuments =
      user &&
      user.uid &&
      dbticketdocuments &&
      dbticketdocuments.filter(
        (item) => (item.status.toUpperCase() === "ACTIVE")
      );

    setactiveTickets(activeTicketDocuments)


  }, [dbticketdocuments])

  console.log('activeTickets:', activeTickets)

  return (
    <div className="top_header_pg pa_bg">
      <div className="pa_inner_page">
        <div className="pg_header">
          <h2 className="p_title">User Tickets</h2>
          <h4 className="p_subtitle">All user tickets here</h4>
        </div>
        <div className="verticall_gap"></div>
        <div className="propagentuser propagentnotification propagentcontactdetail">
          {activeTickets &&
            activeTickets.map((ticket) => (
              <PropAgentTicket key={ticket.id} ticket={ticket} />
            ))}
          {/* <PropAgentTicket /> */}
          <div className="verticall_gap"></div>
        </div>
      </div>
    </div>
  );
};

export default PGAgentTickets;
