import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";
import { useAuthContext } from "../hooks/useAuthContext";

const TicketSidebar = ({ selectedTicket, setSelectedTicket }) => {
  const [tickets, setTickets] = useState([]);
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (!user || tickets.length === 0) return;

    const unsubscribers = [];

    const setupListeners = async () => {
      for (const ticket of tickets) {
        const unsubscribe = projectFirestore
          .collection('tickets')
          .doc(ticket.id)
          .collection('messages')
          .where('read', '==', false)
          .where('senderId', '!=', user.phoneNumber)
          .onSnapshot((snapshot) => {
            setUnreadCounts(prev => ({
              ...prev,
              [ticket.id]: snapshot.size
            }));
          });

        unsubscribers.push(unsubscribe);
      }
    };

    setupListeners();

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [tickets, user]);

  useEffect(() => {
    const currentTicketIds = tickets.map(t => t.id);
    setUnreadCounts(prev => {
      const newCounts = {};
      currentTicketIds.forEach(id => {
        if (prev[id] !== undefined) newCounts[id] = prev[id];
      });
      return newCounts;
    });
  }, [tickets]);



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
      }));
      setTickets(data);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [user]);



  useEffect(() => {
    if (selectedTicket) {
      setUnreadCounts(prev => ({
        ...prev,
        [selectedTicket]: 0
      }));
    }
  }, [selectedTicket]);


  return (
    <div className="w-1/3 h-screen border-r overflow-y-auto bg-white">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className={`p-4 cursor-pointer hover:bg-gray-100 relative ${selectedTicket === ticket.id ? "bg-gray-200" : ""
            }`}
          onClick={() => setSelectedTicket(ticket.id)}
        >
          <h4 className="font-bold">{ticket.issueType}</h4>
          <p className="text-sm text-gray-600 truncate">{ticket.description}</p>
          {unreadCounts[ticket.id]}
          {/* 🔴 Unread badge */}
          {(unreadCounts?.[ticket.id] ?? 0) > 0 && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {unreadCounts[ticket.id]}
            </span>
          )}

        </div>
      ))}
    </div>
  );
};

export default TicketSidebar;
