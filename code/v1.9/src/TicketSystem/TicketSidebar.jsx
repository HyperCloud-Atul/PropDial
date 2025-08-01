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

  if (filteredTickets.length === 0) {
    return (
      <div className="ticket-list empty">
        <p>No tickets found</p>
        {searchQuery && (
          <button 
            className="clear-search"
            onClick={() => onSelectTicket(null)}
          >
            Clear search
          </button>
        )}
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