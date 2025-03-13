import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projectFirestore } from '../../firebase/config';

const InspectionDetails = () => {
  const { inspectionid } = useParams(); // Get ID from URL
  const [inspections, setInspections] = useState([]);

  useEffect(() => {
    const fetchInspectionDetails = async () => {
      try {
        const docRef = projectFirestore.collection('inspections').doc(inspectionid);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const data = docSnap.data();
          if (data.inspections && data.inspections.length > 0) {
            setInspections(data.inspections); // Store all inspections
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    if (inspectionid) {
      fetchInspectionDetails();
    }
  }, [inspectionid]);

  return (
    <div className="pg_property pd_single pg_bg">
      <div className="page_spacing full_card_width relative">
        <div className="property_cards">
          {inspections.length > 0 ? (
            inspections.map((inspection, index) => (
              <div key={index} className="property_card_single mobile_full_card">
                <div className="more_detail_card_inner">
                  <h2 className="card_title">{inspection.roomName || 'No Room Name'}</h2>

                  {/* Map fixturesstatus array inside each inspection */}
                  {inspection.fixturesstatus && inspection.fixturesstatus.length > 0 ? (
                    <div className="p_info">
                     
                      {inspection.fixturesstatus.map((fixture, fIndex) => (
                        <div key={fIndex} className="p_info_single">
                          {/* <div className="pd_icon">
                            <img src="/assets/img/property-detail-icon/car-parking.png" alt="propdial" />
                          </div> */}
                          <div className="pis_content">
                            <h6>{fixture.fixture || 'Unknown Fixture'}</h6>
                            <h5>{fixture.status || 'No Status'}</h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No Fixtures Available</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Loading or No Inspections Available...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;
