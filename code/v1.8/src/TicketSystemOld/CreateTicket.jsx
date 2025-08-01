import { useState } from 'react';
import { projectFirestore } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';
import { timestamp } from '../firebase/config';
const CreateTicket = ({ onTicketCreated }) => {
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');

  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issueType || !description) return alert("Please fill all fields");

    const docRef = await projectFirestore.collection('tickets').add({
      issueType,
      description,
      createdBy: user.phoneNumber,
      createdAt: timestamp.now(),
      status: 'open'
    });

    setOpen(false);
    setIssueType('');
    setDescription('');

    if (onTicketCreated) {
      onTicketCreated(docRef.id); // Optional: Select ticket after creation
    }
  };

  return (
    <>
      {/* Floating Create Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        + Create Ticket
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create New Ticket</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 font-medium">Issue Type</label>
              <select
                className="w-full border px-3 py-2 rounded mb-4"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                required
              >
                <option value="">-- Select --</option>
                <option value="Bug">Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Login Issue">Login Issue</option>
                <option value="Other">Other</option>
              </select>

              <label className="block mb-2 font-medium">Description</label>
              <textarea
                className="w-full border px-3 py-2 rounded mb-4"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue"
                required
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTicket;
