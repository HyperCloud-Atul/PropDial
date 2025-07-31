import { useEffect, useState, useRef } from 'react';
import { timestamp } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';
import { projectFirestore } from '../firebase/config';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';



const ChatWindow = ({ ticketId }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch messages
  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection('tickets')
      .doc(ticketId)
      .collection('messages')
      .orderBy('createdAt')
      .onSnapshot((snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);

        // Mark as read
        setTimeout(() => {
          const batch = projectFirestore.batch();
          snapshot.docs.forEach((doc) => {
            if (!doc.data().read && doc.data().senderId !== user.phoneNumber) {
              batch.update(doc.ref, { read: true });
            }
          });
          batch.commit();
        }, 300);
      });

    return () => unsubscribe();
  }, [ticketId, user.phoneNumber]);

  // Send message
  const sendMessage = async () => {
    if (input.trim() === '') return;

    await projectFirestore
      .collection('tickets')
      .doc(ticketId)
      .collection('messages')
      .add({
        text: input,
        senderId: user.phoneNumber,
        senderType: user?.role === 'admin' ? 'admin' : 'user',
        createdAt: timestamp.now(),
        read: false,
      });

    setInput('');
  };

  // Add emoji
const addEmoji = (emoji) => {
  setInput((prev) => prev + emoji.native);
};

// useEffect(() => {
//   const handleClickOutside = (e) => {
//     if (!e.target.closest('.emoji-picker-button') && !e.target.closest('.emoji-mart')) {
//       setShowEmojiPicker(false);
//     }
//   };
//   document.addEventListener('mousedown', handleClickOutside);
//   return () => document.removeEventListener('mousedown', handleClickOutside);
// }, []);

  // Start voice recognition
const startListening = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Voice typing not supported on this browser!');
    return;
  }

  const SpeechRecognition = window.webkitSpeechRecognition;
  recognitionRef.current = new SpeechRecognition();
  recognitionRef.current.continuous = true; // ✅ keep listening
  recognitionRef.current.interimResults = false;
  recognitionRef.current.lang = 'en-IN';

  let silenceTimeout;

  recognitionRef.current.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    setInput((prev) => prev + transcript + ' ');
    
    // reset silence timer
    clearTimeout(silenceTimeout);
    silenceTimeout = setTimeout(() => recognitionRef.current.stop(), 4000); // 4 seconds of silence
  };

  recognitionRef.current.onend = () => {
    clearTimeout(silenceTimeout);
  };

  recognitionRef.current.start();
};


  return (
    <div className="w-2/3 h-screen flex flex-col bg-gray-50">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-lg max-w-xs ${
              msg.senderId === user.phoneNumber ? 'bg-green-200 ml-auto' : 'bg-white'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

    {showEmojiPicker && (
  <div className="absolute bottom-20 left-2 z-50">
    <Picker data={data} onEmojiSelect={addEmoji} />
  </div>
)}


      <div className="p-2 border-t flex items-center gap-2">
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-2xl"
          title="Emoji"
        >
          😊
        </button>
        <button
          onClick={startListening}
          className="text-2xl"
          title="Voice Input"
        >
          🎤
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded border"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 bg-green-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
