import React, { useState } from 'react';
import './PGSocietyForm.scss';

function PGSocietyForm() {
  const [formData, setFormData] = useState({
    societyName: '',
    aboutSociety: '',
    residences: '',
    security: '',
    amenities: '',
    ecoFriendly: '',
    schools: [{ name: '', distance: '' }],
    hospitals: [{ name: '', distance: '' }],
    clubs: [{ name: '', distance: '' }],
    shopping: [{ name: '', distance: '' }],
    facilities: [],
    nearbySingleLocation: {
      type: '',
      name: '',
      distance: '',
    }
  });

  const facilitiesOptions = [
    'Swimming Pool', 'Gymnasium', "Children's Play Area", 'Community / Party Hall',
    'Jogging / Walking Track', 'Clubhouse / Lounge', 'Amphitheatre', 'Indoor Games Room',
    'Outdoor Sports Courts (Badminton, Basketball)', 'Yoga / Meditation Zone', 'Library',
    '24/7 Security Guards', 'CCTV Surveillance', 'Intercom Facility', 'Fire Safety System',
    'Smart Parking System', 'Tower Maintenance Facility', 'Elevator / Lift with Backup',
    '24/7 Water Supply', 'Power Backup (Generator)', 'Rainwater Harvesting', 'Waste Management',
    'Solar Lighting', 'Landscaped Gardens', 'EV Charging Station', 'Wi-Fi / Broadband Enabled',
    'Mini Mart / Grocery Store', 'Medical Room / First-Aid', 'Guest Room / Suite for Visitors'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFacilityChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      facilities: checked
        ? [...prev.facilities, value]
        : prev.facilities.filter(facility => facility !== value)
    }));
  };

  const handleArrayChange = (type, index, field, value) => {
    const updatedArray = [...formData[type]];
    updatedArray[index][field] = value;
    setFormData(prev => ({ ...prev, [type]: updatedArray }));
  };

  const addArrayItem = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { name: '', distance: '' }]
    }));
  };

  const handleNearbySingleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      nearbySingleLocation: {
        ...prev.nearbySingleLocation,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('Form submitted! Check console.');
  };

  return (
    <div className='pg-form-container-main'>
      <div className="pg-form-container">
        <h2>Society Information Form</h2>
        <form onSubmit={handleSubmit}>

          <div>
            <label>Society Name</label>
            <input type="text" name="societyName" value={formData.societyName} onChange={handleChange} required />
          </div>

          <div>
            <label>About the Society</label>
            <textarea name="aboutSociety" value={formData.aboutSociety} onChange={handleChange} rows="4" required />
          </div>

          <div className="pg-form-grid">
            <div>
              <label>Residences</label>
              <input type="number" name="residences" value={formData.residences} onChange={handleChange} required />
            </div>
            <div>
              <label>24/7 Security (Yes/No)</label>
              <input type="text" name="security" value={formData.security} onChange={handleChange} required />
            </div>
            <div>
              <label>Amenities</label>
              <input type="number" name="amenities" value={formData.amenities} onChange={handleChange} required />
            </div>
            <div>
              <label>Eco-Friendly Infrastructure</label>
              <input type="text" name="ecoFriendly" value={formData.ecoFriendly} onChange={handleChange} required />
            </div>
          </div>

          {['schools', 'hospitals', 'clubs', 'shopping'].map((type) => (
            <div key={type}>
              <label>{type.charAt(0).toUpperCase() + type.slice(1)} Nearby</label>
              {formData[type].map((item, index) => (
                <div key={index} className="pg-form-dynamic-input">
                  <input
                    type="text"
                    placeholder="Name"
                    value={item.name}
                    onChange={(e) => handleArrayChange(type, index, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Distance (km)"
                    value={item.distance}
                    onChange={(e) => handleArrayChange(type, index, 'distance', e.target.value)}
                    required
                  />
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem(type)} className="pg-add-btn">
                + Add More {type}
              </button>
            </div>
          ))}

          <div>
            <label>Facilities Available</label>
            <div className="pg-checkbox-group">
              {facilitiesOptions.map((facility) => (
                <label key={facility}>
                  <input
                    type="checkbox"
                    value={facility}
                    checked={formData.facilities.includes(facility)}
                    onChange={handleFacilityChange}
                  /> {facility}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label>Single Nearby Location</label>
            <div className="pg-form-grid">
              <div>
                <select name="type" value={formData.nearbySingleLocation.type} onChange={handleNearbySingleLocationChange} required>
                  <option value="">Select Type</option>
                  <option value="School">School</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Shopping Area">Shopping Area</option>
                  <option value="Police Station">Police Station</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.nearbySingleLocation.name}
                  onChange={handleNearbySingleLocationChange}
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  name="distance"
                  placeholder="Distance (km)"
                  value={formData.nearbySingleLocation.distance}
                  onChange={handleNearbySingleLocationChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="pg-submit-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PGSocietyForm;