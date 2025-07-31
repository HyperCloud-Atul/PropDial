import { useState } from 'react';
import TicketSidebar from './TicketSidebar';
import ChatWindow from './ChatWindow';
import CreateTicket from './CreateTicket';
import './ChatApp.scss';

const ChatApp = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="flex h-screen relative">
      <br /><br /><br /><br /><br />
      <TicketSidebar selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} />
      {selectedTicket ? (
        <ChatWindow ticketId={selectedTicket} />
      ) : (
        <div className="w-2/3 flex items-center justify-center text-gray-400">
          Select a ticket to start chatting
        </div>
      )}

      {/* Create Ticket Floating Button */}
      <CreateTicket onTicketCreated={(ticketId) => setSelectedTicket(ticketId)} />
    </div>
  );
};

export default ChatApp;
