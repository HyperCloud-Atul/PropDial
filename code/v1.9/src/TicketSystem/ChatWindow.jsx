import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import { FaPaperPlane, FaSmile, FaMicrophone, FaArrowLeft, FaPaperclip, 
         FaTimes, FaChevronDown, FaChevronUp, FaIdCard, FaPhone, 
         FaStop, FaPlay, FaPause, FaDownload, FaLock, FaClock, FaBuilding, 
         FaCity, FaGlobe, FaUser, FaUserTag } from 'react-icons/fa';
import { MdDoneAll, MdDone } from 'react-icons/md';
import { projectFirestore, timestamp, projectAuth } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { projectStorage } from "../firebase/config";
import { signOut } from "firebase/auth";


// Memoized Circular Progress Component
const CircularProgress = memo(({ progress }) => (
  <div className="circular-progress">
    <svg viewBox="0 0 36 36">
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#eee"
        strokeWidth="3"
      />
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="3"
        strokeDasharray={`${progress}, 100`}
      />
    </svg>
    <div className="progress-text">{progress}%</div>
  </div>
));


// Memoized VoicePlayer component
const VoicePlayer = memo(({ url, isSent }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);


  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);


  return (
    <div className={`voice-player ${isSent ? 'sent' : 'received'}`}>
      <audio ref={audioRef} src={url} preload="metadata" />
      <button className="play-btn" onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="duration">{duration ? `${Math.floor(duration)}s` : '...'}</div>
    </div>
  );
});


// Memoized MessageContent component
const MessageContent = memo(({ 
  msg, 
  isSent, 
  onShowAttachment,
  formatTime,
  userPhone
}) => {
  const isOptimistic = msg.tempId;
  const isPending = msg.pending;
  const hasError = msg.error;


  if (msg.isSystemMessage) {
    return (
      <div className="system-message">
        <p>{msg.text}</p>
        <span className="timestamp">{formatTime(msg.createdAt)}</span>
      </div>
    );
  }
  
  return (
    <div className={`message-content ${isPending ? 'pending' : ''} ${hasError ? 'error' : ''}`}>
      {msg.text && <p>{msg.text}</p>}
      
      {msg.attachments && msg.attachments.map((att) => (
        <div key={att.id} className={`attachment ${att.type} ${att.error ? 'error' : ''}`}>
          {att.type === 'image' ? (
            <div className="attachment-preview">
              <img 
                src={att.url} 
                alt="Attachment" 
                onClick={() => onShowAttachment(att)}
                loading="lazy"
              />
              {isPending && !att.error && (
                <div className="upload-status">
                  <CircularProgress progress={att.progress || 0} />
                </div>
              )}
              {att.error && (
                <div className="upload-error">
                  <FaTimes className="error-icon" />
                </div>
              )}
            </div>
          ) : att.type === 'audio' ? (
            <div className="audio-attachment">
              <VoicePlayer url={att.url} isSent={isSent} />
              {isPending && !att.error && (
                <div className="upload-status">
                  <FaClock className="pending-icon" />
                </div>
              )}
              {att.error && (
                <div className="upload-error">
                  <FaTimes className="error-icon" />
                </div>
              )}
            </div>
          ) : (
            <div className="file-attachment" onClick={() => onShowAttachment(att)}>
              <div className="file-icon">📄</div>
              <div className="file-name">{att.name.substring(0, 20)}</div>
              {isPending && !att.error && (
                <div className="upload-status">
                  <CircularProgress progress={att.progress || 0} />
                </div>
              )}
              {att.error && (
                <div className="upload-error">
                  <FaTimes className="error-icon" />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      
      <div className="message-footer">
        <span className="timestamp">{formatTime(msg.createdAt)}</span>
        {msg.senderId === userPhone && !isOptimistic && (
          <span className="read-status">
            {msg.read ? <MdDoneAll className="read" /> : <MdDone className="sent" />}
          </span>
        )}
        {isOptimistic && isPending && !hasError && (
          <span className="pending-status">
            <FaClock className="pending-icon" />
          </span>
        )}
        {isOptimistic && hasError && (
          <span className="error-status">
            <FaTimes className="error-icon" />
          </span>
        )}
      </div>
    </div>
  );
});


// Memoized AttachmentItem component
const AttachmentItem = memo(({ 
  attachment, 
  onRemove, 
  onPreview 
}) => {
  return (
    <div className={`attachment-item ${attachment.type}`}>
      <button className="remove-attachment" onClick={() => onRemove(attachment.id)}>
        <FaTimes />
      </button>
      {attachment.type === 'image' ? (
        <div className="image-preview" onClick={() => onPreview(attachment)}>
          <img src={attachment.url} alt="Preview" loading="lazy" />
          <div className="preview-overlay">
            <span>View</span>
          </div>
        </div>
      ) : attachment.type === 'audio' ? (
        <div className="audio-preview">
          <div className="audio-icon">🎤</div>
          <span>Voice Recording</span>
        </div>
      ) : (
        <div className="file-preview">
          <div className="file-icon">📄</div>
          <div className="file-name">{attachment.name.substring(0, 15)}</div>
        </div>
      )}
    </div>
  );
});


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
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState([]);


  // Check if admin can close ticket
  useEffect(() => {
    if (user?.role === 'admin' && ticketInfo?.status === 'open') {
      setCanCloseTicket(true);
    } else {
      setCanCloseTicket(false);
    }
  }, [user, ticketInfo]);


  // Close ticket function
  const closeTicket = useCallback(async () => {
    if (!canCloseTicket) return;
    
    try {
      await projectFirestore.collection('tickets').doc(ticketId).update({
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
      
      await projectFirestore.collection('tickets').doc(ticketId)
        .collection('messages').add(messageData);
        
      setCanCloseTicket(false);
      setShowCloseConfirm(false);
      
    } catch (error) {
      console.error("Error closing ticket:", error);
      setError("Failed to close ticket. Please try again.");
    }
  }, [canCloseTicket, ticketId, user]);


  // Memoized helper functions
  const truncateText = useCallback((text, maxLength) => {
    return text && text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text || '';
  }, []);


  const getAvatarText = useCallback((issueType) => {
    if (!issueType) return 'T';
    const words = issueType.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].length <= 2 
        ? words[0] 
        : words[0][0] + words[0][words[0].length - 1];
    }
    return words.map(word => word[0]).join('').substring(0, 2);
  }, []);


  const getAvatarColor = useCallback((str) => {
    if (!str) return '#128c7e';
    const hash = Array.from(str).reduce((acc, char) => 
      char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
  }, []);


  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);


  const formatDate = useCallback((date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  }, []);


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


        // Fetch creator's full name
        if (ticketData.createdBy) {
          try {
            const querySnapshot = await projectFirestore
              .collection('users-propdial')
              .where('phoneNumber', '==', ticketData.createdBy)
              .limit(1)
              .get();
            
            if (!querySnapshot.empty) {
              const creatorData = querySnapshot.docs[0].data();
              setCreatorFullName(creatorData.fullName || "User");
            } else {
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


  // Fetch messages with duplicate prevention
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
        
        // Optimized optimistic message removal
        setOptimisticMessages(prev => {
          const confirmedIds = new Set(
            msgs.filter(m => m.optimisticId).map(m => m.optimisticId)
          );
          return prev.filter(optMsg => !confirmedIds.has(optMsg.tempId));
        });


        setMessages(msgs);
        setLoading(false);


        // Batch update read status
        const unreadMessages = snapshot.docs.filter(
          doc => !doc.data().read && doc.data().senderId !== user.phoneNumber
        );
        
        if (unreadMessages.length > 0) {
          const batch = projectFirestore.batch();
          unreadMessages.forEach(doc => {
            batch.update(doc.ref, { read: true });
          });
          batch.commit().catch(console.error);
        }
      }, (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
        setError("Failed to load messages. Please try again.");
      });


    return () => unsubscribe();
  }, [ticketId, user.phoneNumber]);


  // Auto-scroll to bottom with throttling
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, optimisticMessages]);


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


  // Handle typing indicator with debouncing
  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  }, [isTyping]);


  // Handle authentication errors
  const handleAuthError = useCallback((error) => {
    console.error("Authentication error:", error);
    setError("Session expired. Please log in again.");
    
    signOut(projectAuth).then(() => {
      dispatch({ type: 'LOGOUT' });
    }).catch(console.error);
  }, [dispatch]);


  // Optimized sendMessage function
  const sendMessage = useCallback(async () => {
    if (ticketInfo?.status === 'closed') {
      setError("This ticket is closed. No further messages can be sent.");
      return;
    }
    
    if (input.trim() === '' && attachments.length === 0) return;
  
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      senderId: user.phoneNumber,
      senderType: user?.role === 'admin' ? 'admin' : 'user',
      createdAt: new Date(),
      read: false,
      pending: true,
      tempId: tempId,
      text: input,
      attachments: attachments.map(att => ({
        ...att,
        pending: true,
        progress: 0
      })),
    };
    
    setOptimisticMessages(prev => [...prev, optimisticMsg]);
    setAttachments([]);
    setInput('');
    setShowEmojiPicker(false);
  
    try {
      const messageData = {
        senderId: user.phoneNumber,
        senderType: user?.role === 'admin' ? 'admin' : 'user',
        createdAt: timestamp.now(),
        read: false,
        optimisticId: tempId,
      };
  
      if (input.trim() !== '') {
        messageData.text = input;
      }
  
      // Process attachments concurrently
      if (optimisticMsg.attachments.length > 0) {
        const uploadPromises = optimisticMsg.attachments.map((att, index) => {
          const fileToUpload = att.type === 'audio' 
            ? new File([att.blob], att.name, { type: 'audio/webm' }) 
            : att.file;
            
          const storageRef = ref(projectStorage, `attachments/${ticketId}/${att.name}`);
          const uploadTask = uploadBytesResumable(storageRef, fileToUpload);
          
          return new Promise((resolve, reject) => {
            uploadTask.on('state_changed', 
              (snapshot) => {
                const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                
                // Batch progress updates
                setOptimisticMessages(prev => prev.map(msg => {
                  if (msg.tempId === tempId) {
                    const newAttachments = [...msg.attachments];
                    newAttachments[index] = { ...newAttachments[index], progress };
                    return { ...msg, attachments: newAttachments };
                  }
                  return msg;
                }));
              },
              reject,
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({
                  id: att.id,
                  name: att.name,
                  type: att.type,
                  url: downloadURL,
                });
              }
            );
          });
        });
        
        messageData.attachments = await Promise.all(uploadPromises);
      }
  
      // Add to Firestore
      await projectFirestore.collection('tickets').doc(ticketId)
        .collection('messages').add(messageData);
  
      // Update ticket status
      await projectFirestore.collection('tickets').doc(ticketId).update({
        lastUpdated: timestamp.now(),
        status: 'open',
      });
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Mark message as failed
      setOptimisticMessages(prev => prev.map(msg => 
        msg.tempId === tempId 
          ? { ...msg, error: true, pending: false } 
          : msg
      ));
      
      if (error.code?.includes('auth')) {
        handleAuthError(error);
      } else {
        setError("Failed to send message. Please try again.");
      }
    }
  }, [input, attachments, ticketInfo, user, ticketId, handleAuthError]);


  // Add emoji
  const addEmoji = useCallback((emoji) => {
    setInput(prev => prev + emoji.native);
    inputRef.current.focus();
  }, []);


  // Start voice recording
  const startRecording = useCallback(async () => {
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
        
        setAttachments(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          name: `recording-${Date.now()}.webm`,
          type: 'audio',
          blob: audioBlob
        }]);
        
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
  }, [ticketInfo]);


  // Stop voice recording
  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [mediaRecorder, isRecording]);


  // Format recording time
  const formatRecordingTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);


  // Handle file attachment
  const handleAttachment = useCallback((e) => {
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
  }, [ticketInfo]);


  // Remove attachment
  const removeAttachment = useCallback((id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  }, []);


  // Render attachment preview
  const renderAttachmentPreview = useCallback(() => {
    if (!showAttachmentPreview) return null;
    
    const handlePinch = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (pinchStartDistance !== null) {
          const newZoom = distance / pinchStartDistance;
          setZoomLevel(Math.max(1, Math.min(3, zoomLevel * newZoom)));
        }
      }
    };


    return (
      <div 
        className="attachment-preview-modal"
        onClick={() => {
          setShowAttachmentPreview(null);
          setZoomLevel(1);
        }}
      >
        <div className="preview-content" onClick={e => e.stopPropagation()}>
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
                  setZoomLevel(zoomLevel === 1 ? 2 : 1);
                }}
                onTouchStart={(e) => {
                  if (e.touches.length === 2) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    setPinchStartDistance(Math.sqrt(dx * dx + dy * dy));
                  }
                }}
                onTouchMove={handlePinch}
                onTouchEnd={() => setPinchStartDistance(null)}
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
  }, [showAttachmentPreview, zoomLevel, pinchStartDistance]);


  // Memoized grouped messages
  const groupedMessages = useMemo(() => {
    const grouped = {};
    const allMessages = [...messages, ...optimisticMessages];
    
    allMessages.forEach(msg => {
      const dateKey = formatDate(msg.createdAt);
      grouped[dateKey] = grouped[dateKey] || [];
      grouped[dateKey].push(msg);
    });
    
    return grouped;
  }, [messages, optimisticMessages, formatDate]);


  // Memoized ticket details panel with all new features
  const ticketDetailsPanel = useMemo(() => {
    if (!ticketInfo) return null;
    
    return (
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
              <span className="detail-label">Ticket ID:</span>
              <span className="detail-value">{ticketInfo.id}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Mobile: </span>
              <span className="detail-value">{ticketInfo.createdBy}</span>
            </div>

            {/* Property PID */}
            {ticketInfo.propertyPid && (
              <div className="detail-row">
                <span className="detail-label">Property PID:</span>
                <span className="detail-value">{ticketInfo.propertyPid}</span>
              </div>
            )}

            {/* Property Name */}
            {ticketInfo.propertyName && (
              <div className="detail-row">
                <span className="detail-label">Property Name:</span>
                <span className="detail-value">{ticketInfo.propertyName}</span>
              </div>
            )}

            {/* Property ID (Firestore Document ID) */}
            <div className="detail-row">
              <span className="detail-label">Property ID:</span>
              <span className="detail-value">{ticketInfo.propertyId || "N/A"}</span>
            </div>

            {/* Country */}
            {ticketInfo.country && (
              <div className="detail-row">
                <span className="detail-label">Country:</span>
                <span className="detail-value">{ticketInfo.country}</span>
              </div>
            )}

            {/* City */}
            {ticketInfo.city && (
              <div className="detail-row">
                <span className="detail-label">City: </span>
                <span className="detail-value">{ticketInfo.city}</span>
              </div>
            )}

            {/* Created By Role */}
            <div className="detail-row">
              <span className="detail-label">Created By Role:</span>
              <span className="detail-value">{ticketInfo.role || "N/A"}</span>
            </div>

            {/* User Type */}
            {ticketInfo.userType && (
              <div className="detail-row">
                <span className="detail-label">User Type:</span>
                <span className="detail-value">{ticketInfo.userType}</span>
              </div>
            )}

            {/* User Tag */}
            {ticketInfo.userTag && (
              <div className="detail-row">
                <span className="detail-label">User Tag:</span>
                <span className="detail-value">{ticketInfo.userTag}</span>
              </div>
            )}

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
              <span className="detail-value">{ticketInfo.description || "No description"}</span>
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
              <>
                <div className="detail-row">
                  <span className="detail-label">Closed:</span>
                  <span className="detail-value">
                    {ticketInfo.closedAt.toLocaleDateString()} at {ticketInfo.closedAt.toLocaleTimeString()}
                  </span>
                </div>
                
                {ticketInfo.closedBy && (
                  <div className="detail-row">
                    <span className="detail-label">Closed By:</span>
                    <span className="detail-value">
                      {ticketInfo.closedBy === user.phoneNumber ? 'You' : ticketInfo.closedBy}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Admin Assignment (if applicable) */}
            {ticketInfo.adminId && adminName && (
              <div className="detail-row">
                <span className="detail-label">Assigned Admin:</span>
                <span className="detail-value">{adminName}</span>
              </div>
            )}


          </div>
        )}
      </div>
    );
  }, [ticketInfo, showTicketDetails, getAvatarColor, adminName, creatorFullName, user.phoneNumber]);


  // Loading state
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
      {/* Close Ticket Confirmation Popup */}
      {showCloseConfirm && (
        <div className="confirmation-popup">
          <div className="confirmation-content">
            <div className="confirmation-header">
              <FaLock className="warning-icon" />
              <h3>Close Ticket Confirmation</h3>
            </div>
            <div className="confirmation-body">
              <p>Are you sure you want to close this ticket?</p>
              <ul>
                <li>Users won't be able to send new messages</li>
                <li>The ticket will be marked as resolved</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
            <div className="confirmation-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowCloseConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={closeTicket}
              >
                <FaLock /> Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}


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
              {user?.role === 'admin' 
                ? (creatorFullName || "User") 
                : (ticketInfo?.issueType || "Support Ticket")}
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
        
        {canCloseTicket && (
          <button 
            className="close-ticket-btn"
            onClick={() => setShowCloseConfirm(true)}
          >
            <FaLock /> Close
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
      {ticketDetailsPanel}


      <div className="messages-container">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="message-date-group">
            <div className="date-divider">{date}</div>
            {dateMessages.map((msg) => {
              const isSent = msg.senderId === user.phoneNumber;
              return (
                <div
                  key={msg.id}
                  className={`message ${isSent ? 'sent' : 'received'} ${msg.isSystemMessage ? 'system' : ''}`}
                >
                  <div className="message-content-wrapper">
                    <MessageContent 
                      msg={msg} 
                      isSent={isSent}
                      onShowAttachment={setShowAttachmentPreview}
                      formatTime={formatTime}
                      userPhone={user.phoneNumber}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {messages.length === 0 && optimisticMessages.length === 0 && (
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
          {attachments.map(attachment => (
            <AttachmentItem
              key={attachment.id}
              attachment={attachment}
              onRemove={removeAttachment}
              onPreview={setShowAttachmentPreview}
            />
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


      {/* Input Area */}
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


export default memo(ChatWindow);
