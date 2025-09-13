import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";
import { useAuthContext } from "../hooks/useAuthContext";
import { doc, getDoc } from "firebase/firestore";

const TicketSidebar = ({ 
  selectedTicket, 
  setSelectedTicket, 
  searchQuery, 
  setSearchQuery,
  onSelectTicket,
  onNewTicket,
  isMobile,
  onClose
}) => {
  const [tickets, setTickets] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [userDisplayNames, setUserDisplayNames] = useState({});

  // Generate consistent color based on issue type
  const getAvatarColor = (issueType) => {
    if (!issueType) return '#128c7e';
    const hash = issueType.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const getTwoLetters = (str) => {
    if (!str) return 'TK';
    const words = str.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    if (words[0].length > 1) {
      return (words[0][0] + words[0][words[0].length - 1]).toUpperCase();
    }
    return (words[0] + words[0]).toUpperCase();
  };

  // 🔹 Fetch tickets with role-based rules
  useEffect(() => {
    if (!user) return;

    let ref = projectFirestore.collection("tickets").orderBy("createdAt", "desc");

    if (user?.role === "superAdmin") {
      // super admin can see ALL tickets → no filter
    } else if (user?.role === "admin") {
      // admin sees tickets assigned to their property
      if (user.assignedProperty) {
        ref = ref.where("propertyId", "==", user.assignedProperty);
      }
    } else {
      // normal users only see tickets they created
      ref = ref.where("createdBy", "==", user.phoneNumber);
    }

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        setTickets(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 🔹 Fetch display names for admin/superAdmin
  useEffect(() => {
    if (!(user?.role === "admin" || user?.role === "superAdmin") || tickets.length === 0) return;

    const fetchDisplayNames = async () => {
      const names = {};
      for (const ticket of tickets) {
        if (!ticket.createdBy) continue;
        try {
          const userRef = doc(projectFirestore, "users-propdial", ticket.createdBy);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            names[ticket.createdBy] = userData.displayName || userData.fullName || "Unknown User";
          } else {
            names[ticket.createdBy] = "User Not Found";
          }
        } catch (error) {
          console.error("Error fetching display name:", error);
          names[ticket.createdBy] = "Error Loading";
        }
      }
      setUserDisplayNames(names);
    };

    fetchDisplayNames();
  }, [tickets, user?.role]);

  // 🔹 Filter tickets based on search
  useEffect(() => {
    const filtered = tickets.filter((ticket) =>
      ticket.issueType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((user?.role === "admin" || user?.role === "superAdmin") &&
        userDisplayNames[ticket.createdBy]?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredTickets(filtered);
  }, [tickets, searchQuery, user?.role, userDisplayNames]);

  // 🔹 Unread message listeners
  useEffect(() => {
    if (!user || tickets.length === 0) return;

    const unsubscribers = [];
    const counts = {};

    const setupListeners = async () => {
      for (const ticket of tickets) {
        const unsubscribe = projectFirestore
          .collection("tickets")
          .doc(ticket.id)
          .collection("messages")
          .where("read", "==", false)
          .where("senderId", "!=", user.phoneNumber)
          .onSnapshot((snapshot) => {
            counts[ticket.id] = snapshot.size;
            setUnreadCounts({ ...counts });
          });
        unsubscribers.push(unsubscribe);
      }
    };

    setupListeners();
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [tickets, user]);

  // 🔹 Reset unread count when opening a ticket
  useEffect(() => {
    if (selectedTicket) {
      setUnreadCounts((prev) => ({
        ...prev,
        [selectedTicket]: 0,
      }));
    }
  }, [selectedTicket]);

  // 🔹 Format ticket date
  const formatDate = (date) => {
    if (!date) return "";
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return new Date(date).toLocaleDateString([], { weekday: "short" });
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <div className={`sidebar ${isMobile ? "mobile" : ""}`}>
      {/* Search + New Ticket Button */}
      <div className="search-container">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="new-ticket-btn" onClick={onNewTicket} aria-label="Create new ticket">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="sidebar-content">
        {loading && (
          <div className="ticket-list loading">
            <div className="loading-spinner"></div>
            <p>Loading tickets...</p>
          </div>
        )}

        {/* No tickets */}
        {!isMobile && !loading && tickets.length === 0 && !searchQuery && (
          <div className="empty-container">
            <div className="empty-content">
              <div className="illustration">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>No Tickets Yet</h3>
              <p>You haven't created any support tickets yet</p>
              <button className="new-ticket-btn" onClick={onNewTicket}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Your First Ticket
              </button>
            </div>
          </div>
        )}

        {/* No search results */}
        {!isMobile && !loading && tickets.length > 0 && filteredTickets.length === 0 && (
          <div className="empty-container">
            <div className="empty-content">
              <h3>No Tickets Found</h3>
              <p>We couldn't find any tickets matching "{searchQuery}"</p>
            </div>
          </div>
        )}

        {/* Ticket List */}
        {!loading && filteredTickets.length > 0 && (
          <div className="ticket-list scrollable">
            {filteredTickets.map((ticket) => {
              const avatarText = getTwoLetters(ticket.issueType);
              const avatarColor = getAvatarColor(ticket.issueType);
              const mainText =
                user?.role === "admin" || user?.role === "superAdmin"
                  ? userDisplayNames[ticket.createdBy] || ticket.issueType || "No title"
                  : ticket.issueType || "No title";
              const isClosed = ticket.status === "closed";

              return (
                <div
                  key={ticket.id}
                  className={`ticket ${selectedTicket === ticket.id ? "active" : ""} ${isClosed ? "closed" : ""}`}
                  tabIndex={0}
                  onClick={() => {
                    setSelectedTicket(ticket.id);
                    onSelectTicket(ticket.id);
                    if (isMobile) onClose();
                  }}
                >
                  <div className="ticket-whole-container">
                    <div className="ticket-avatar" style={{ backgroundColor: isClosed ? "#bdbdbd" : avatarColor }}>
                      {avatarText}
                    </div>

                    <div className="ticket-content">
                      <div className="ticket-header">
                        <div>
                          <div className="issue-type">{mainText}</div>
                          <div className="subject">
                            {ticket.subject || "No subject"}
                            {isClosed && <span className="closed-badge">Closed</span>}
                          </div>
                        </div>
                        <div className="ticket-meta">
                          <div className="timestamp">{formatDate(ticket.createdAt)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-footer">
                      {(unreadCounts?.[ticket.id] ?? 0) > 0 && !isClosed && (
                        <span className="unread-badge">{unreadCounts[ticket.id]}</span>
                      )}
                      {isClosed && (
                        <span className="closed-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketSidebar;
