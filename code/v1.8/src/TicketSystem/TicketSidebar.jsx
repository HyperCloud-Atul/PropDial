import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";
import { useAuthContext } from "../hooks/useAuthContext";

const TicketSidebar = ({ selectedTicket, setSelectedTicket, searchQuery, onSelectTicket }) => {
  const [tickets, setTickets] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const [filteredTickets, setFilteredTickets] = useState([]);

  // Fetch tickets from Firestore
  useEffect(() => {
    if (!user) return;

    let ref = projectFirestore.collection("tickets").orderBy("createdAt", "desc");

    if (user?.role !== "admin") {
      ref = ref.where("createdBy", "==", user.phoneNumber);
    }

    const unsubscribe = ref.onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setTickets(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Filter tickets based on search query
  useEffect(() => {
    const filtered = tickets.filter(ticket => 
      ticket.issueType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTickets(filtered);
  }, [tickets, searchQuery]);

  // Fetch unread message counts
  useEffect(() => {
    if (!user || tickets.length === 0) return;

    const unsubscribers = [];
    const counts = {};

    const setupListeners = async () => {
      for (const ticket of tickets) {
        const unsubscribe = projectFirestore
          .collection('tickets')
          .doc(ticket.id)
          .collection('messages')
          .where('read', '==', false)
          .where('senderId', '!=', user.phoneNumber)
          .onSnapshot((snapshot) => {
            counts[ticket.id] = snapshot.size;
            setUnreadCounts({...counts});
          });

        unsubscribers.push(unsubscribe);
      }
    };

    setupListeners();

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [tickets, user]);

  // Reset unread count when ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      setUnreadCounts(prev => ({
        ...prev,
        [selectedTicket]: 0
      }));
    }
  }, [selectedTicket]);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="ticket-list loading">
        <div className="loading-spinner"></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  if (tickets.length === 0 && !searchQuery) {
    return (
      <div className="ticket-list empty no-tickets">
        <div className="empty-content">
          <div className="illustration">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3>No tickets yet</h3>
          <p>Please Create New Ticket</p>
        </div>
      </div>
    );
  }

  if (filteredTickets.length === 0) {
    return (
      <div className="ticket-list empty no-results">
        <div className="empty-content">
          <div className="illustration">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9.172 16.242a4 4 0 1 1-5.656-5.657 4 4 0 0 1 5.656 5.657zM21 21l-6-6"></path>
            </svg>
          </div>
          <h3>No tickets found</h3>
          <p>No tickets match your search criteria</p>
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => onSelectTicket(null)}
            >
              Clear search
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-list">
      {filteredTickets.map((ticket) => (
        <div
          key={ticket.id}
          className={`ticket ${selectedTicket === ticket.id ? "active" : ""}`}
          onClick={() => {
            setSelectedTicket(ticket.id);
            onSelectTicket(ticket.id);
          }}
        >
          <div className="ticket-header">
            <div className="issue-type">{ticket.issueType || "No title"}</div>
            <div className="timestamp">{formatDate(ticket.createdAt)}</div>
          </div>
          
          <div className="ticket-footer">
            <div className="description">
              {ticket.description || "No description"}
            </div>
            <div className={`status-badge status-${ticket.status || 'open'}`}>
              {ticket.status || 'open'}
            </div>
          </div>
          
          {(unreadCounts?.[ticket.id] ?? 0) > 0 && (
            <span className="unread-badge">
              {unreadCounts[ticket.id]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketSidebar;