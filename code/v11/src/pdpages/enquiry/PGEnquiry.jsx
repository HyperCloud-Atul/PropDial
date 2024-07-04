import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// import component 
import ViewEnquiry from './ViewEnquiry';
import AddEnquiry from './AddEnquiry';

// import css 
import './PGEnquiry.scss'

const PGEnquiry = () => {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();

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

  // show and hide add payment form start

  const [showForm, setShowForm] = useState(false);

  const handelShowForm = () => {
    setShowForm(!showForm);
  };

  // show and hide add payment form end

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
        {/* <div className="theme_tab prop_doc_tab">
          <Tabs defaultIndex={0}>
            <TabList className="tabs">
              <Tab className="pointer">
                View Enquiries
              </Tab>
              <Tab className="pointer">
                Add Enquiries
              </Tab>
              <Tab className="pointer" disabled style={{
                opacity: "0.5",
                cursor: "context-menu"
              }}>
                Update  Enquiry
              </Tab>
            </TabList>
            <TabPanel>
              <ViewEnquiry />
            </TabPanel>
            <TabPanel>
              <AddEnquiry />
            </TabPanel>
            <TabPanel>
              ""

            </TabPanel>
          </Tabs>
        </div> */}
        {!showForm && (
          <ViewEnquiry />
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
