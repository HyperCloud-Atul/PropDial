import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';
import { timestamp } from '../firebase/config';

const CreateTicket = ({ onTicketCreated, onClose, isMobile }) => {
  const [issueType, setIssueType] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [loadingProperties, setLoadingProperties] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user || !user.phoneNumber) return;
      
      try {
        setLoadingProperties(true);
        let propertyIds = [];
        
        // Check user role and fetch appropriate properties
        if (user.role === 'owner') {
          // Fetch properties where user is owner
          const ownerPropertiesQuery = await projectFirestore
            .collection('propertyusers')
            .where('userId', '==', user.phoneNumber)
            .where('userType', '==', 'propertyowner')
            .where('userTag', 'in', ['Owner', 'owner'])
            .get();
            
          propertyIds = ownerPropertiesQuery.docs.map(doc => doc.data().propertyId);
        } else if (user.role === 'executive') {
          // Fetch properties where user is executive
          const executivePropertiesQuery = await projectFirestore
            .collection('propertyusers')
            .where('userId', '==', user.phoneNumber)
            .where('userType', '==', 'propertymanager')
            .where('userTag', 'in', ['Executive', 'executive'])
            .get();
            
          propertyIds = executivePropertiesQuery.docs.map(doc => doc.data().propertyId);
        }
        
        if (propertyIds.length > 0) {
          // Fetch property details from properties-propdial collection
          const propertiesPromises = propertyIds.map(async (propertyId) => {
            const propertyDoc = await projectFirestore
              .collection('properties-propdial')
              .doc(propertyId)
              .get();
              
            if (propertyDoc.exists) {
              return {
                id: propertyId,
                ...propertyDoc.data()
              };
            }
            return null;
          });
          
          const propertiesData = (await Promise.all(propertiesPromises)).filter(prop => prop !== null);
          setProperties(propertiesData);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError('Failed to load properties. Please try again.');
      } finally {
        setLoadingProperties(false);
      }
    };
    
    fetchProperties();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    if (!selectedProperty || !issueType || !subject || !description) {
      setError('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    try {
      const docRef = await projectFirestore.collection('tickets').add({
        issueType,
        subject,
        description,
        createdBy: user.phoneNumber,
        createdAt: timestamp.now(),
        status: 'open',
        lastUpdated: timestamp.now(),
        propertyId: selectedProperty // Store the selected property ID
      });

      onTicketCreated(docRef.id);
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError('Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIssueType('');
    setSubject('');
    setDescription('');
    setSelectedProperty('');
    setError('');
    
    if (onClose) onClose({
      resetSelection: isMobile,
      resetSearch: isMobile
    });
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
            {loadingProperties ? (
              <div>Loading properties...</div>
            ) : properties.length > 0 ? (
              <>
                <label>Select Property</label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value="">Select a property</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.city || 'Unknown City'} - {property.id}
                    </option>
                  ))}
                </select>
                
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
                
                <label>Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
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
                    onClick={handleCancel}  
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
              </>
            ) : (
              <div>
                <p>No properties found for your account.</p>
                <button
                  type="button"
                  className="create-ticket__button-group-cancel"
                  onClick={handleCancel}
                >
                  Close
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;