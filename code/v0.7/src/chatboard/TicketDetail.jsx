import React from "react";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useLocation, Link } from "react-router-dom";

// component
import AllTicketsLeft from "./AllTicketsLeft";
import SingleTicketChat from "./SingleTicketChat";
import CreateTicket from "./CreateTicket";
import "./chatboard.css"

const TicketDetail = () => {
    const { user } = useAuthContext();

    const { documents: dbticketdocuments, error: dbticketerror } = useCollection(
      "tickets",
      ["postedBy", "==", "Propdial"],
      ["updatedAt", "desc"]
    );
    // console.log('dbticketdocuments: ', dbticketdocuments)
    const [activeTickets, setactiveTickets] = useState();
    const [userTickets, setUserTickets] = useState();
    const [allTickets, setAllTickets] = useState();
    const [selectedTicket, setSelectedTicket] = useState();
    const [searchKey, setSearchKey] = useState("");
    const [searchedTicket, setSearchedTicket] = useState([]);
  
    useEffect(() => {
      const userTicketDocuments =
        user && user.uid && user.role !== "propagentadmin"
          ? dbticketdocuments
          : dbticketdocuments &&
          dbticketdocuments.filter((item) => item.createdBy.id === user.uid);
      let ticketList = [];
      userTicketDocuments &&
        userTicketDocuments.forEach((ticket) => {
          ticketList.push({
            ...ticket,
            searchKey: ticket.createdBy.fullName + ticket.type,
          });
        });
  
      setUserTickets(ticketList);
      setSearchedTicket(ticketList);
      userTicketDocuments && setSelectedTicket(userTicketDocuments[0]);
      // const activeTicketDocuments =
      //   user &&
      //   user.uid &&
      //   dbticketdocuments &&
      //   dbticketdocuments.filter(
      //     (item) => (item.status.toUpperCase() === "ACTIVE")
      //   );
  
      // setactiveTickets(activeTicketDocuments)
    }, [dbticketdocuments]);
    function setSearchList(key) {
      setSearchKey(key.trim());
      // console.log('key', key)
      if (!key || key === '' || key.trim() === '') {
        setSearchedTicket(userTickets);
      }
      else {
        key = key.trim();
        var newArray = userTickets.filter((e) =>
          e.searchKey.toUpperCase().includes(key.toUpperCase())
        );
  
        // console.log("filteredlist :: ", newArray);
        setSearchedTicket(newArray);
      }
    }
    // console.log(
    //   "userTickets:",
    //   userTickets,
    //   "userTickets.lenght",
    //   userTickets && userTickets.length
    // );
  
    const [mobileDisplay, setmobileDisplay] = useState(false);
  
    function selectTicket(ticket) {
      setSelectedTicket(ticket);
      setmobileDisplay(true);
    }
    function backToChatList() {
      setmobileDisplay(false)
    }
  return (
    <div className="">
    <div>
      {!userTickets && <CreateTicket />}
      {userTickets && userTickets.length > 0 ? (
        <div className="top_header_pg pa_bg">
          <div className="chat_page">
            <div className={mobileDisplay ? "chat_list hide" : "chat_list"} >
              <div className="all_tickets_left relative">
                <div className="search-select">
                  <span className="material-symbols-outlined">search</span>
                  <input
                    className="input-wrapper"
                    type="search"
                    placeholder="Search here ..."
                    value={searchKey}
                    onChange={(e) => {

                      setSearchList(e.target.value);
                    }}
                  ></input>
                </div>

                {searchedTicket &&
                  searchedTicket.map((ticket) => (
                    <AllTicketsLeft
                      key={ticket.id}
                      ticket={ticket}
                      setSelectedTicket={selectTicket}
                      activeTickets={selectedTicket}
                    />
                  ))}

                {(user.role !== 'propagent') && <Link to="/createticket" className="new_ticket pointer">
                  <span className="material-symbols-outlined">add</span>
                </Link>}
              </div>
            </div>

            {searchedTicket && selectedTicket && (
              <div className={mobileDisplay ? "chat_window show" : "chat_window"} >
                <SingleTicketChat ticket={selectedTicket} backToChatList={backToChatList} />
              </div>
            )}

          </div>
        </div>

      ) : (<CreateTicket />)}
    </div>
  </div >
  )
}

export default TicketDetail
