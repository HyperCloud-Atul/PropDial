import { useState } from 'react';
import { projectFirestore } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';
import { timestamp } from '../firebase/config';

const CreateTicket = ({ onTicketCreated, onClose }) => {
  const [issueType, setIssueType] = useState('');
  const [subject, setSubject] = useState(''); // New state for subject
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Updated validation to include subject
    if (!issueType || !subject || !description) {
      setError('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    try {
      const docRef = await projectFirestore.collection('tickets').add({
        issueType,
        subject, // Include subject in the ticket data
        description,
        createdBy: user.phoneNumber,
        createdAt: timestamp.now(),
        status: 'open',
        lastUpdated: timestamp.now()
      });

      onTicketCreated(docRef.id);
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError('Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-ticket__modal-overlay">
      <div className="create-ticket__modal">
        <div className="create-ticket__modal-header">
          <h2>Create New Ticket</h2>
        </div>
        
        <div className="create-ticket__modal-body">
          {error && <div className="error-message">{error}</div>}
          
          <form className="create-ticket__form" onSubmit={handleSubmit}>
            <label>Issue Type</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              required
              disabled={submitting}
            >
              <option value="">Select an issue type</option>
              <option value="Bug">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Login Issue">Login Issue</option>
              <option value="Payment Problem">Payment Problem</option>
              <option value="Account Issue">Account Issue</option>
              <option value="Other">Other</option>
            </select>
            
            {/* New Subject Field */}
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              // placeholder="Brief summary of your issue"
              required
              disabled={submitting}
              maxLength={100}
            />
            
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue in detail..."
              required
              disabled={submitting}
            />
            
            <div className="create-ticket__button-group">
              <button
                type="button"
                className="create-ticket__button-group-cancel"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="create-ticket__button-group-submit"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;