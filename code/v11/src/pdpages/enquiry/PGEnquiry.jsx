import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { Link } from 'react-router-dom';
import { useCollection } from '../../hooks/useCollection';
import { useParams } from 'react-router-dom';

// import component 
import ViewEnquiry from './ViewEnquiry';
import AddEnquiry from './AddEnquiry';

// import css 
import './PGEnquiry.scss'

const PGEnquiry = () => {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  // render ViewEnquiry by url id start 
  const { id } = useParams();
  const { documents: enquiryDocs, error: enquiryDocsError } = useCollection("enquiry")
  const enquiryDocsById = id === "all" ? enquiryDocs : (enquiryDocs && enquiryDocs.filter(doc => (doc.propId === id)));
  console.log("enquiryDocsById", enquiryDocsById, id);
  // render ViewEnquiry by url id end

  useEffect(() => {
    let flag = user && user.role === "admin";
    if (!flag) {
      logout();
    }
  }, [user]);


  // 9 dots controls
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };
  // 9 dots controls

  // show and hide form start
  const [showForm, setShowForm] = useState(false);

  const handelShowForm = () => {
    setShowForm(!showForm);
  };
  // show and hide form end

  return (
    <div className="top_header_pg pg_bg pg_enquiry">
      <div className="page_spacing">
        {/* 9 dots html  */}
        <div onClick={openMoreAddOptions} className="property-list-add-property">
          <span className="material-symbols-outlined">apps</span>
        </div>
        <div
          className={
            handleMoreOptionsClick
              ? "more-add-options-div open"
              : "more-add-options-div"
          }
          onClick={closeMoreAddOptions}
          id="moreAddOptions"
        >
          <div className="more-add-options-inner-div">
            <div className="more-add-options-icons">
              <h1>Close</h1>
              <span className="material-symbols-outlined">close</span>
            </div>

            <Link to="/newproperty" className="more-add-options-icons">
              <h1>Add property</h1>
              <span className="material-symbols-outlined">location_city</span>
            </Link>

            <Link to="" className="more-add-options-icons">
              <h1>Add bills</h1>
              <span class="material-symbols-outlined">receipt_long</span>
            </Link>

            <Link to="/addnotification/new" className="more-add-options-icons">
              <h1>Add notification</h1>
              <span class="material-symbols-outlined">notifications</span>
            </Link>
          </div>
        </div>
        {/* 9 dots html  */}
        <Link className="bottom_add_button">
          <span class="material-symbols-outlined" onClick={handelShowForm}>
            {showForm ? "close" : "add"}
          </span>
        </Link>
        {!showForm && (
          <ViewEnquiry enquiryDocs={enquiryDocsById} enquiryDocsError={enquiryDocsError} />
        )}
        {showForm && (
          <>
            <div className="pg_header d-flex justify-content-between">
              <div className="left d-flex align-items-center pointer" style={{
                gap: "5px"
              }}>
                <span class="material-symbols-outlined pointer" onClick={handelShowForm} >
                  arrow_back
                </span>
                <h2 className="m22 mb-1">Add Enquiry
                </h2>
              </div>

            </div>
            <AddEnquiry />
          </>
        )}


      </div>
    </div>
  );
};

export default PGEnquiry;
