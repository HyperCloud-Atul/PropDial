import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';
import { timestamp } from '../firebase/config';

const CreateTicket = ({ onTicketCreated, onClose, isMobile }) => {
  const [issueType, setIssueType] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [properties, setProperties] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [role, setRole] = useState('');
  const [userType, setUserType] = useState('');
  const [userTag, setUserTag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useAuthContext();

  // Store dropdown options
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  // Fetch user role + properties based on role
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?.phoneNumber) return;
        
        setLoading(true);
        
        // Fetch user document from users-propdial
        const userDoc = await projectFirestore
          .collection('users-propdial')
          .doc(user.phoneNumber.replace('+91', ''))
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          const userRole = userData.rolePropDial || '';
          const userWhoAmI = userData.whoAmI || '';
          
          setRole(userRole);
          setUserType(userWhoAmI);
          setUserTag(`${userRole} (${userWhoAmI})`);

          // Role-based property fetching
          let propsQuery = projectFirestore.collection('properties-propdial');
          
          // Different query based on user role
          switch (userRole.toLowerCase()) {
            case 'admin':
            case 'superadmin':
            case 'super admin':
              // Admins can see all properties - no filter needed
              break;
              
            case 'property manager':
            case 'propertymanager':
            case 'manager':
              // Property managers see properties where they are the manager
              propsQuery = propsQuery.where('propertyManagerID', '==', user.phoneNumber.replace('+91', ''));
              break;
              
            case 'owner':
            case 'property owner':
            case 'propertyowner':
              // Property owners see their own properties
              propsQuery = propsQuery.where('ownerId', '==', user.phoneNumber.replace('+91', ''));
              break;
              
            case 'tenant':
            case 'renter':
              // Tenants see properties where they are assigned
              propsQuery = propsQuery.where('tenantId', '==', user.phoneNumber.replace('+91', ''));
              break;
              
            case 'agent':
            case 'sales agent':
            case 'salesagent':
              // Agents see properties assigned to them
              propsQuery = propsQuery.where('agentId', '==', user.phoneNumber.replace('+91', ''));
              break;
              
            default:
              // Default behavior - filter by propertyManagerID (fallback)
              propsQuery = propsQuery.where('propertyManagerID', '==', user.phoneNumber.replace('+91', ''));
              break;
          }

          const propsSnapshot = await propsQuery.get();
          const propsList = propsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Filter out properties without required fields
          const validProperties = propsList.filter(prop => 
            prop.country && prop.city && prop.pid
          );

          setProperties(validProperties);

          // Get unique country options
          const uniqueCountries = [
            ...new Set(validProperties.map(prop => prop.country).filter(Boolean))
          ];
          setCountryOptions(uniqueCountries);
          
          if (validProperties.length === 0) {
            setError(`No properties found for role: ${userRole}. Please contact your administrator.`);
          }
        } else {
          setError("User data not found. Please contact administrator.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // When a country is selected, populate city options
  useEffect(() => {
    if (selectedCountry) {
      const cities = [
        ...new Set(
          properties
            .filter(prop => prop.country === selectedCountry)
            .map(prop => prop.city)
            .filter(Boolean)
        ),
      ];
      setCityOptions(cities);
      setSelectedCity('');
      setFilteredProperties([]);
      setSelectedProperty('');
    } else {
      setCityOptions([]);
      setSelectedCity('');
      setFilteredProperties([]);
      setSelectedProperty('');
    }
  }, [selectedCountry, properties]);

  // When a city is selected, populate filtered properties
  useEffect(() => {
    if (selectedCity) {
      const filtered = properties.filter(
        prop => prop.country === selectedCountry && prop.city === selectedCity
      );
      setFilteredProperties(filtered);
      setSelectedProperty('');
    } else {
      setFilteredProperties([]);
      setSelectedProperty('');
    }
  }, [selectedCity, selectedCountry, properties]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!selectedCountry || !selectedCity || !selectedProperty || !issueType || !subject || !description) {
      setError('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    try {
      // Find the selected property's info by PID
      const propertyObj = filteredProperties.find(prop => prop.pid === selectedProperty);
      
      if (!propertyObj) {
        setError('Selected property not found. Please try again.');
        setSubmitting(false);
        return;
      }

      // Create ticket with comprehensive data
      const ticketData = {
        propertyPid: propertyObj.pid,
        propertyName: propertyObj.propertyName || '',
        propertyId: propertyObj.id,
        issueType,
        subject,
        description,
        createdBy: user.phoneNumber,
        role,
        userType,
        userTag,
        country: selectedCountry,
        city: selectedCity,
        createdAt: timestamp.now(),
        status: 'open',
        lastUpdated: timestamp.now(),
      };

      const docRef = await projectFirestore.collection('tickets').add(ticketData);
      
      // Reset form
      setIssueType('');
      setSubject('');
      setDescription('');
      setSelectedCountry('');
      setSelectedCity('');
      setSelectedProperty('');
      
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
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedProperty('');
    setError('');
    
    if (onClose) {
      onClose({
        resetSelection: isMobile,
        resetSearch: isMobile,
      });
    }
  };

  if (loading) {
    return (
      <div className="create-ticket__modal-overlay">
        <div className="create-ticket__modal">
          <div className="create-ticket__modal-body" style={{ textAlign: 'center', padding: '40px' }}>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-ticket__modal-overlay">
      <div className="create-ticket__modal">
        <div className="create-ticket__modal-header">
          <h2>Create New Ticket</h2>
          {role && (
            <p>
              User Role: <strong>{role}</strong>
            </p>
          )}
          {userTag && (
            <p>
              User Tag: <strong>{userTag}</strong>
            </p>
          )}
        </div>

        <div className="create-ticket__modal-body">
          {error && <div className="error-message">{error}</div>}

          <form className="create-ticket__form" onSubmit={handleSubmit}>
            {/* Country Dropdown */}
            <label>Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              required
              disabled={submitting || countryOptions.length === 0}
            >
              <option value="">Select a country</option>
              {countryOptions.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            {/* City Dropdown */}
            {cityOptions.length > 0 && (
              <>
                <label>City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value="">Select a city</option>
                  {cityOptions.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* Property (PID) Dropdown */}
            {filteredProperties.length > 0 && (
              <>
                <label>Property</label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value="">Select a property (PID)</option>
                  {filteredProperties.map(prop => (
                    <option key={prop.pid} value={prop.pid}>
                      {prop.pid} - {prop.propertyName || prop.id}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* Issue Type */}
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
              <option value="Maintenance">Maintenance Request</option>
              <option value="Other">Other</option>
            </select>

            {/* Subject */}
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={submitting}
              maxLength={100}
              placeholder="Enter a brief subject..."
            />

            {/* Description */}
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue in detail..."
              required
              disabled={submitting}
              rows={4}
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
                disabled={submitting || properties.length === 0}
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
