import { useEffect, useState, useRef, useCallback } from 'react';
import { FaPaperPlane, FaSmile, FaMicrophone, FaArrowLeft, FaEllipsisV, FaPaperclip, FaTimes } from 'react-icons/fa';
import { MdDoneAll, MdDone } from 'react-icons/md';
import { projectFirestore, timestamp } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const ChatWindow = ({ ticketId, onBack, isMobile }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);

  // Fetch ticket info
  useEffect(() => {
    if (!ticketId) return;

    const unsubscribeTicket = projectFirestore
      .collection('tickets')
      .doc(ticketId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setTicketInfo({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          });
        }
      });

    return () => unsubscribeTicket();
  }, [ticketId]);

  // Fetch messages
  useEffect(() => {
    if (!ticketId) return;

    const unsubscribe = projectFirestore
      .collection('tickets')
      .doc(ticketId)
      .collection('messages')
      .orderBy('createdAt')
      .onSnapshot((snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setMessages(msgs);
        setLoading(false);

        // Mark messages as read
        setTimeout(() => {
          const batch = projectFirestore.batch();
          snapshot.docs.forEach((doc) => {
            if (!doc.data().read && doc.data().senderId !== user.phoneNumber) {
              batch.update(doc.ref, { read: true });
            }
          });
          batch.commit();
        }, 300);
      }, (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [ticketId, user.phoneNumber]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showEmojiPicker && 
          !e.target.closest('.emoji-picker-container') && 
          !e.target.closest('.emoji-btn')) {
        setShowEmojiPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // Handle typing indicator
  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      // Simulate admin typing indicator
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (input.trim() === '' && attachments.length === 0) return;

    try {
      const messageData = {
        senderId: user.phoneNumber,
        senderType: user?.role === 'admin' ? 'admin' : 'user',
        createdAt: timestamp.now(),
        read: false,
      };

      if (input.trim() !== '') {
        messageData.text = input;
      }

      if (attachments.length > 0) {
        messageData.attachments = attachments;
      }

      await projectFirestore
        .collection('tickets')
        .doc(ticketId)
        .collection('messages')
        .add(messageData);

      setInput('');
      setAttachments([]);
      setShowEmojiPicker(false);
      
      // Update ticket status
      await projectFirestore
        .collection('tickets')
        .doc(ticketId)
        .update({
          lastUpdated: timestamp.now(),
          status: 'open'
        });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  // Add emoji
  const addEmoji = (emoji) => {
    setInput(prev => prev + emoji.native);
    inputRef.current.focus();
  };

  // Start voice recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice typing is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    let silenceTimeout;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setInput(prev => prev + transcript + ' ');
      
      // Reset silence timer
      clearTimeout(silenceTimeout);
      silenceTimeout = setTimeout(() => recognitionRef.current.stop(), 4000);
    };

    recognitionRef.current.onend = () => {
      clearTimeout(silenceTimeout);
    };

    recognitionRef.current.start();
  };

  // Format message time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format message date
  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Handle file attachment
  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.startsWith('image') ? 'image' : 'file',
      url: URL.createObjectURL(file),
      file
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Close ticket
  const closeTicket = async () => {
    if (!window.confirm('Are you sure you want to close this ticket?')) return;
    
    try {
      await projectFirestore
        .collection('tickets')
        .doc(ticketId)
        .update({
          status: 'closed',
          closedAt: timestamp.now()
        });
        
      setShowMenu(false);
    } catch (error) {
      console.error("Error closing ticket:", error);
      alert("Failed to close ticket. Please try again.");
    }
  };

  // Render attachment preview
  const renderAttachmentPreview = () => {
    if (!showAttachmentPreview) return null;
    
    return (
      <div className="attachment-preview-modal">
        <div className="preview-content">
          <button 
            className="close-preview"
            onClick={() => setShowAttachmentPreview(null)}
          >
            <FaTimes />
          </button>
          
          {showAttachmentPreview.type === 'image' ? (
            <img src={showAttachmentPreview.url} alt="Attachment preview" />
          ) : (
            <div className="file-preview">
              <div className="file-icon">📄</div>
              <div className="file-name">{showAttachmentPreview.name}</div>
              <a 
                href={showAttachmentPreview.url} 
                download={showAttachmentPreview.name}
                className="download-btn"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render message content
  const renderMessageContent = (msg) => {
    return (
      <div className="message-content">
        {msg.text && <p>{msg.text}</p>}
        
        {msg.attachments && msg.attachments.map(att => (
          <div 
            key={att.id} 
            className={`attachment ${att.type}`}
            onClick={() => setShowAttachmentPreview(att)}
          >
            {att.type === 'image' ? (
              <img src={att.url} alt="Attachment" />
            ) : (
              <div className="file-attachment">
                <div className="file-icon">📄</div>
                <div className="file-name">{att.name}</div>
              </div>
            )}
          </div>
        ))}
        
        <div className="message-footer">
          <span className="timestamp">{formatTime(msg.createdAt)}</span>
          {msg.senderId === user.phoneNumber && (
            <span className="read-status">
              {msg.read ? <MdDoneAll className="read" /> : <MdDone className="sent" />}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const grouped = {};
    
    messages.forEach(msg => {
      const dateKey = formatDate(msg.createdAt);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(msg);
    });
    
    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  if (loading) {
    return (
      <div className="chat-window loading">
        <div className="loading-spinner"></div>
        <p>Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="header-left">
          {isMobile && (
            <button className="back-button" onClick={onBack}>
              <FaArrowLeft />
            </button>
          )}
          <div className="user-avatar">
            {ticketInfo?.issueType?.charAt(0) || 'T'}
          </div>
          <div className="ticket-info">
            <h3>{ticketInfo?.issueType || "Support Ticket"}</h3>
            <div className="status-container">
              <span className={`status-badge status-${ticketInfo?.status || 'open'}`}>
                {ticketInfo?.status || 'open'}
              </span>
              {isTyping && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span>typing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="menu-container">
            <button 
              className="menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaEllipsisV />
            </button>
            
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={closeTicket}>Close Ticket</button>
                <button>View Ticket Details</button>
                <button>Export Conversation</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="messages-container">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="message-date-group">
            <div className="date-divider">{date}</div>
            {dateMessages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.senderId === user.phoneNumber ? 'sent' : 'received'}`}
              >
                {msg.senderId !== user.phoneNumber && (
                  <div className="sender-avatar">
                    {msg.senderName?.charAt(0) || 'A'}
                  </div>
                )}
                <div className="message-content-wrapper">
                  {msg.senderId !== user.phoneNumber && (
                    <div className="sender-name">
                      {msg.senderName || "Support Agent"}
                    </div>
                  )}
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))}
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="empty-messages">
            <div className="empty-illustration">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3>No messages yet</h3>
            <p>Start the conversation by sending a message</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {attachments.length > 0 && (
        <div className="attachments-preview">
          {attachments.map(att => (
            <div key={att.id} className="attachment-item">
              <button 
                className="remove-attachment"
                onClick={() => removeAttachment(att.id)}
              >
                <FaTimes />
              </button>
              {att.type === 'image' ? (
                <img src={att.url} alt="Preview" />
              ) : (
                <div className="file-preview">
                  <div className="file-icon">📄</div>
                  <div className="file-name">{att.name}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <Picker 
            data={data} 
            onEmojiSelect={addEmoji} 
            theme="light"
            previewPosition="none"
          />
        </div>
      )}

      <div className="message-input-area">
        <div className="input-actions">
          <button
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(prev => !prev)}
            title="Emoji"
          >
            <FaSmile />
          </button>
          
          <div className="file-upload-btn">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleAttachment}
              accept="image/*, .pdf, .doc, .docx, .xls, .xlsx"
            />
            <label htmlFor="file-upload">
              <FaPaperclip />
            </label>
          </div>
        </div>
        
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
        </div>
        
        <div className="send-actions">
          {input.trim() || attachments.length > 0 ? (
            <button 
              className="send-button" 
              onClick={sendMessage}
              disabled={!input.trim() && attachments.length === 0}
            >
              <FaPaperPlane />
            </button>
          ) : (
            <button 
              className="voice-button" 
              onClick={startListening} 
              title="Voice Input"
            >
              <FaMicrophone />
            </button>
          )}
        </div>
      </div>
      
      {renderAttachmentPreview()}
    </div>
  );
};

export default ChatWindow;