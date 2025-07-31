import { useEffect, useState } from 'react';
import { timestamp } from "../firebase/config";
import { useAuthContext } from '../hooks/useAuthContext';
import { projectFirestore } from '../firebase/config';

const ChatWindow = ({ ticketId }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

useEffect(() => {
  const unsubscribe = projectFirestore
    .collection('tickets')
    .doc(ticketId)
    .collection('messages')
    .orderBy('createdAt')
    .onSnapshot(snapshot => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

      // Delay read marking slightly
      setTimeout(() => {
        const batch = projectFirestore.batch();
        snapshot.docs.forEach(doc => {
          if (!doc.data().read && doc.data().senderId !== user.phoneNumber) {
            batch.update(doc.ref, { read: true });
          }
        });

        batch.commit();
      }, 300); // Delay to ensure UI render
    });

  return () => unsubscribe();
}, [ticketId, user.phoneNumber]);



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
         read: false
      });

    setInput('');
  };

  return (
    <div className="w-2/3 h-screen flex flex-col bg-gray-50">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-lg max-w-xs ${
              msg.senderId === user.phoneNumber ? 'bg-green-200 ml-auto' : 'bg-white'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="p-2 border-t flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded border"
        />
        <button onClick={sendMessage} className="ml-2 px-4 bg-green-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
