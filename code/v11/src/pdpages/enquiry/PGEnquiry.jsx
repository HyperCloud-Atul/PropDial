import React, { useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
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

  return (
    <div className="top_header_pg pg_bg pg_enquiry">
      <div className="page_spacing">
        <div className="theme_tab prop_doc_tab">
          <Tabs>
            <TabList className="tabs">
              <Tab className="pointer">
                View Enquiries
              </Tab>
              <Tab className="pointer">
                Add Enquiries
              </Tab>
              <Tab className="pointer">
                Enquiries Updates
              </Tab>

            </TabList>
            <TabPanel>
              <ViewEnquiry />
            </TabPanel>
            <TabPanel>
              <AddEnquiry />
            </TabPanel>
            <TabPanel>
              <div className="vg22"></div>
              <h5 className="text_green ">
                Comming Soon.....
              </h5>
            </TabPanel>

          </Tabs>
        </div>








      </div>
    </div>
  );
};

export default PGEnquiry;