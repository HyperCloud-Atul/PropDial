import { useEffect, useState, useRef } from 'react';
import { FaPaperPlane, FaSmile, FaMicrophone, FaArrowLeft, FaPaperclip, FaTimes, FaChevronDown, FaChevronUp, FaIdCard, FaPhone, FaStop, FaPlay, FaPause, FaDownload, FaLock } from 'react-icons/fa';
import { MdDoneAll, MdDone } from 'react-icons/md';
import { projectFirestore, timestamp, projectAuth } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { projectStorage } from "../firebase/config";
import { signOut } from "firebase/auth";

// Updated VoicePlayer component
const VoicePlayer = ({ url, isSent }) => {
  // ... existing VoicePlayer implementation (unchanged) ...
};

const ChatWindow = ({ ticketId, onBack, isMobile }) => {
  const { user, dispatch } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState(null);
  const [pinchStartDistance, setPinchStartDistance] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [creatorFullName, setCreatorFullName] = useState('');
  const [canCloseTicket, setCanCloseTicket] = useState(false);

  // Check if admin can close ticket
  useEffect(() => {
    if (user?.role === 'admin' && ticketInfo?.status === 'open') {
      setCanCloseTicket(true);
    } else {
      setCanCloseTicket(false);
    }
  }, [user, ticketInfo]);

  // Close ticket function
  const closeTicket = async () => {
    if (!canCloseTicket) return;
    
    try {
      await projectFirestore
        .collection('tickets')
        .doc(ticketId)
        .update({
          status: 'closed',
          closedAt: timestamp.now(),
          closedBy: user.phoneNumber
        });
      
      setTicketInfo(prev => ({
        ...prev,
        status: 'closed',
        closedAt: new Date(),
        closedBy: user.phoneNumber
      }));
      
      // Add system message about closure
      const messageData = {
        senderId: 'system',
        text: `Ticket closed by admin ${user.displayName || user.phoneNumber}`,
        createdAt: timestamp.now(),
        read: true,
        isSystemMessage: true
      };
      
      await projectFirestore
        .collection('tickets')
        .doc(ticketId)
        .collection('messages')
        .add(messageData);
        
      setCanCloseTicket(false);
      
    } catch (error) {
      console.error("Error closing ticket:", error);
      setError("Failed to close ticket. Please try again.");
    }
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  // Generate avatar text from issue type
  const getAvatarText = (issueType) => {
    if (!issueType) return 'T';
    
    const words = issueType.trim().split(/\s+/);
    
    if (words.length === 1) {
      const word = words[0];
      if (word.length <= 2) return word;
      return word.charAt(0) + word.charAt(word.length - 1);
    }
    
    return words.map(word => word.charAt(0)).join('').substring(0, 2);
  };

  // Fetch ticket info, admin name, and creator name
  useEffect(() => {
    if (!ticketId) return;

    let isMounted = true;

    const unsubscribeTicket = projectFirestore
      .collection('tickets')
      .doc(ticketId)
      .onSnapshot(async (doc) => {
        if (!doc.exists || !isMounted) return;

        const ticketData = doc.data();
        const ticketInfo = {
          id: doc.id,
          ...ticketData,
          createdAt: ticketData.createdAt?.toDate() || new Date(),
          closedAt: ticketData.closedAt?.toDate() || null
        };
        setTicketInfo(ticketInfo);

        // Fetch admin name if assigned
        if (ticketData.adminId) {
          try {
            const adminDoc = await projectFirestore
              .collection('users')
              .doc(ticketData.adminId)
              .get();
            
            if (adminDoc.exists) {
              const adminData = adminDoc.data();
              setAdminName(adminData.displayName || adminData.name || 'Admin');
            }
          } catch (error) {
            console.error("Error fetching admin details:", error);
          }
        }

        // Fetch creator's full name from users-propdial collection
        if (ticketData.createdBy) {
          try {
            const querySnapshot = await projectFirestore
              .collection('users-propdial')
              .where('phoneNumber', '==', ticketData.createdBy)
              .limit(1)
              .get();
            
            if (!querySnapshot.empty) {
              const creatorDoc = querySnapshot.docs[0];
              const creatorData = creatorDoc.data();
              setCreatorFullName(creatorData.fullName || "User");
            } else {
              console.log("Creator document not found in users-propdial");
              setCreatorFullName("User");
            }
          } catch (error) {
            console.error("Error fetching creator details:", error);
            setCreatorFullName("User");
          }
        }
      });

    return () => {
      isMounted = false;
      unsubscribeTicket();
    };
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

        setTimeout(() => {
          const batch = projectFirestore.batch();
          snapshot.docs.forEach((doc) => {
            if (!doc.data().read && doc.data().senderId !== user.phoneNumber) {
              batch.update(doc.ref, { read: true });
            }
          });
          batch.commit().catch(error => {
            console.error("Error marking messages as read:", error);
          });
        }, 300);
      }, (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
        setError("Failed to load messages. Please try again.");
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
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  // Handle authentication errors
  const handleAuthError = (error) => {
    console.error("Authentication error:", error);
    setError("Session expired. Please log in again.");
    
    // Sign out user and redirect to login
    signOut(projectAuth).then(() => {
      dispatch({ type: 'LOGOUT' });
    }).catch((signOutError) => {
      console.error("Sign out error:", signOutError);
    });
  };

  // Send message - disabled when ticket is closed
  const sendMessage = async () => {
    if (ticketInfo?.status === 'closed') {
      setError("This ticket is closed. No further messages can be sent.");
      return;
    }
    
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
        const uploadedAttachments = [];
  
        for (const att of attachments) {
          let fileToUpload;
  
          if (att.type === 'audio') {
            fileToUpload = new File([att.blob], att.name, { type: 'audio/webm' });
          } else {
            fileToUpload = att.file;
          }
  
          const storageRef = ref(projectStorage, `attachments/${ticketId}/${att.name}`);
          await uploadBytes(storageRef, fileToUpload);
          const downloadURL = await getDownloadURL(storageRef);
  
          uploadedAttachments.push({
            id: att.id,
            name: att.name,
            type: att.type,
            url: downloadURL,
          });
        }
  
        messageData.attachments = uploadedAttachments;
      }
  
      await projectFirestore
        .collection('tickets')
        .doc(ticketId)
        .collection('messages')
        .add(messageData);
  
      setInput('');
      setAttachments([]);
      setShowEmojiPicker(false);
  
      await projectFirestore
        .collection('tickets')
        .doc(ticketId)
        .update({
          lastUpdated: timestamp.now(),
          status: 'open',
        });
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Handle token refresh errors
      if (error.code && error.code.includes('auth')) {
        handleAuthError(error);
      } else {
        setError("Failed to send message. Please try again.");
      }
    }
  };
  

  // Add emoji
  const addEmoji = (emoji) => {
    setInput(prev => prev + emoji.native);
    inputRef.current.focus();
  };

  // Start voice recording - disabled when ticket is closed
  const startRecording = async () => {
    if (ticketInfo?.status === 'closed') {
      setError("This ticket is closed. No further messages can be sent.");
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        const audioAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: `recording-${new Date().getTime()}.webm`,
          type: 'audio',
          blob: audioBlob
        };
        
        setAttachments(prev => [...prev, audioAttachment]);
        setAudioChunks([]);
        stream.getTracks().forEach(track => track.stop());
        clearInterval(recordingTimerRef.current);
        setRecordingTime(0);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Failed to access microphone. Please check permissions.");
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Format recording time
  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

  // Handle file attachment - disabled when ticket is closed
  const handleAttachment = (e) => {
    if (ticketInfo?.status === 'closed') {
      setError("This ticket is closed. No further messages can be sent.");
      return;
    }
    
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

  // Render attachment preview
  const renderAttachmentPreview = () => {
    if (!showAttachmentPreview) return null;
    
    return (
      <div 
        className="attachment-preview-modal"
        onClick={() => {
          setShowAttachmentPreview(null);
          setZoomLevel(1);
        }}
      >
        <div 
          className="preview-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="close-preview"
            onClick={() => {
              setShowAttachmentPreview(null);
              setZoomLevel(1);
            }}
          >
            <FaTimes />
          </button>
          
          {showAttachmentPreview.type === 'image' ? (
            <div className="image-container">
              <img 
                src={showAttachmentPreview.url} 
                alt="Attachment preview" 
                className="zoomable-image"
                style={{ transform: `scale(${zoomLevel})` }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (zoomLevel === 1) {
                    setZoomLevel(2);
                  } else {
                    setZoomLevel(1);
                  }
                }}
                onTouchStart={(e) => {
                  if (e.touches.length === 2) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    setPinchStartDistance(Math.sqrt(dx * dx + dy * dy));
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches.length === 2) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (pinchStartDistance !== null) {
                      const newZoom = distance / pinchStartDistance;
                      setZoomLevel(Math.max(1, Math.min(3, zoomLevel * newZoom)));
                    }
                  }
                }}
                onTouchEnd={() => {
                  setPinchStartDistance(null);
                }}
              />
              <div className="zoom-hint">
                {zoomLevel === 1 ? 'Click to zoom in' : 'Click to reset zoom'}
              </div>
            </div>
          ) : showAttachmentPreview.type === 'audio' ? (
            <audio controls src={showAttachmentPreview.url} />
          ) : (
            <div className="file-preview">
              <div className="file-icon">📄</div>
              <div className="file-name">{showAttachmentPreview.name}</div>
              <a 
                href={showAttachmentPreview.url} 
                download={showAttachmentPreview.name}
                className="download-btn"
              >
                <FaDownload /> Download
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render message content with system message support
  const renderMessageContent = (msg) => {
    if (msg.isSystemMessage) {
      return (
        <div className="system-message">
          <p>{msg.text}</p>
          <span className="timestamp">{formatTime(msg.createdAt)}</span>
        </div>
      );
    }
    
    return (
      <div className="message-content">
        {msg.text && <p>{msg.text}</p>}
        
        {msg.attachments && msg.attachments.map(att => (
          <div 
            key={att.id} 
            className={`attachment ${att.type}`}
          >
            {att.type === 'image' ? (
              <img 
                src={att.url} 
                alt="Attachment" 
                onClick={() => {
                  setShowAttachmentPreview(att);
                  setZoomLevel(1);
                }}
              />
            ) : att.type === 'audio' ? (
              <VoicePlayer 
                url={att.url} 
                isSent={msg.senderId === user.phoneNumber} 
              />
            ) : (
              <div 
                className="file-attachment"
                onClick={() => setShowAttachmentPreview(att)}
              >
                <div className="file-icon">📄</div>
                <div className="file-name">{truncateText(att.name, 20)}</div>
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

  // Generate consistent color based on string
  const getAvatarColor = (str) => {
    if (!str) return '#128c7e';
    
    const hash = str.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
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
          <div 
            className="user-avatar"
            style={{ backgroundColor: getAvatarColor(ticketInfo?.issueType) }}
          >
            {ticketInfo?.issueType ? getAvatarText(ticketInfo.issueType) : 'T'}
          </div>
          <div className="ticket-info">
            <h3>
              {user?.role === 'admin' ? 
                (creatorFullName || "User") : 
                (ticketInfo?.issueType || "Support Ticket")
              }
            </h3>
            <div className="status-container">
              <span className="subject-text">
                {truncateText(ticketInfo?.subject, 40)}
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
        
        {/* Close Ticket Button (Admin Only) */}
        {canCloseTicket && (
          <button 
            className="close-ticket-btn"
            onClick={closeTicket}
          >
            <FaLock /> Close Ticket
          </button>
        )}
      </div>
      
      {/* Closed Ticket Banner */}
      {ticketInfo?.status === 'closed' && (
        <div className="closed-banner">
          <div className="closed-content">
            <FaLock className="closed-icon" />
            <span>This ticket is closed. No further messages can be sent.</span>
            {ticketInfo.closedBy && (
              <span className="closed-by">
                Closed by: {ticketInfo.closedBy === user.phoneNumber ? 'You' : ticketInfo.closedBy}
              </span>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>
            <FaTimes />
          </button>
        </div>
      )}
      
      {/* Ticket Details Panel */}
      {ticketInfo && (
        <div className="ticket-details-panel">
          <div 
            className="panel-header"
            onClick={() => setShowTicketDetails(!showTicketDetails)}
          >
            <h4>Ticket Details</h4>
            <span className="toggle-icon">
              {showTicketDetails ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          
          {showTicketDetails && (
            <div className="panel-content">
              <div className="detail-row">
                <span className="detail-label">
                  <FaIdCard className="detail-icon" /> Ticket ID:
                </span>
                <span className="detail-value">
                  {ticketInfo.id}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">
                  <FaPhone className="detail-icon" /> Mobile:
                </span>
                <span className="detail-value">
                  {ticketInfo.createdBy}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Subject:</span>
                <span className="detail-value">{ticketInfo.subject || "No subject"}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Issue Type:</span>
                <span 
                  className="issue-type-badge"
                  style={{ backgroundColor: getAvatarColor(ticketInfo.issueType) }}
                >
                  {ticketInfo.issueType}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{ticketInfo.description || "No description provided"}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">
                  {ticketInfo.createdAt.toLocaleDateString()} at {ticketInfo.createdAt.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${ticketInfo.status}`}>
                  {ticketInfo.status}
                </span>
              </div>
              
              {ticketInfo.status === 'closed' && ticketInfo.closedAt && (
                <div className="detail-row">
                  <span className="detail-label">Closed:</span>
                  <span className="detail-value">
                    {ticketInfo.closedAt.toLocaleDateString()} at {ticketInfo.closedAt.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="messages-container">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="message-date-group">
            <div className="date-divider">{date}</div>
            {dateMessages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.senderId === user.phoneNumber ? 'sent' : 'received'} ${msg.isSystemMessage ? 'system' : ''}`}
              >
                <div className="message-content-wrapper">
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
            <div key={att.id} className={`attachment-item ${att.type}`}>
              <button 
                className="remove-attachment"
                onClick={() => removeAttachment(att.id)}
              >
                <FaTimes />
              </button>
              {att.type === 'image' ? (
                <div 
                  className="image-preview"
                  onClick={() => {
                    setShowAttachmentPreview(att);
                    setZoomLevel(1);
                  }}
                >
                  <img src={att.url} alt="Preview" />
                  <div className="preview-overlay">
                    <span>View</span>
                  </div>
                </div>
              ) : att.type === 'audio' ? (
                <div className="audio-preview">
                  <div className="audio-icon">🎤</div>
                  <span>Voice Recording</span>
                </div>
              ) : (
                <div className="file-preview">
                  <div className="file-icon">📄</div>
                  <div className="file-name">{truncateText(att.name, 15)}</div>
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

      {/* Input Area - Disabled when ticket is closed */}
      {ticketInfo?.status !== 'closed' ? (
        <div className="message-input-area">
          {isRecording && (
            <div className="recording-indicator">
              <div className="pulse"></div>
              <span>Recording: {formatRecordingTime(recordingTime)}</span>
              <button className="stop-recording" onClick={stopRecording}>
                <FaTimes />
              </button>
            </div>
          )}
          
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
            <button 
              className="send-button" 
              onClick={sendMessage}
              disabled={!input.trim() && attachments.length === 0}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-disabled">
          <FaLock className="disabled-icon" />
          <p>This conversation is closed. No further messages can be sent.</p>
        </div>
      )}
      
      {renderAttachmentPreview()}
    </div>
  );
};

export default ChatWindow;