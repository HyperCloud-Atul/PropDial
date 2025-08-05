import { useState, useEffect } from 'react';
import TicketSidebar from './TicketSidebar';
import ChatWindow from './ChatWindow';
import CreateTicket from './CreateTicket';
import './ChatApp.scss';

const ChatApp = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Check screen size for responsiveness
  useEffect(() => {
    const checkIsMobile = () => {
      const mobileWidth = window.innerWidth < 768;
      setIsMobile(mobileWidth);
      
      // Always show sidebar on desktop, conditionally on mobile
      if (mobileWidth) {
        setShowSidebar(!selectedTicket);
      } else {
        setShowSidebar(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [selectedTicket]);

  const handleNewTicket = () => {
    setShowCreateModal(true);
    if (isMobile) setShowSidebar(false);
  };

  return (
    <div className="chat-app">
      {/* Always show sidebar on desktop, conditionally on mobile */}
      {showSidebar && (
        <TicketSidebar 
          selectedTicket={selectedTicket} 
          setSelectedTicket={setSelectedTicket}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectTicket={(ticketId) => {
            setSelectedTicket(ticketId);
            if (isMobile) setShowSidebar(false);
          }}
          onNewTicket={handleNewTicket}
          isMobile={isMobile}
          onClose={() => setShowSidebar(false)}
        />
      )}

      {/* Conditionally render chat window or empty state */}
      <div className="chat-window">
        {selectedTicket ? (
          <ChatWindow 
            ticketId={selectedTicket} 
            onBack={() => {
              setSelectedTicket(null);
              if (isMobile) setShowSidebar(true);
            }}
            isMobile={isMobile}
          />
        ) : (
          // Only show empty state on desktop
          !isMobile && (
            <div className="empty-state">
              <div className="empty-content">
                <div className="illustration">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3>No Ticket Selected</h3>
                <p>Select a ticket from the list or create a new one</p>
                <button 
                  className="new-ticket-btn"
                  onClick={handleNewTicket}
                >
                  + Create New Ticket
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {showCreateModal && (
        <CreateTicket 
          onTicketCreated={(ticketId) => {
            setSelectedTicket(ticketId);
            setShowCreateModal(false);
            if (isMobile) setShowSidebar(false);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default ChatApp;