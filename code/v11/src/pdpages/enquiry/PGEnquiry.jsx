import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { useCollection } from '../../hooks/useCollection';
import { format, isWithinInterval, addMonths, startOfMonth, startOfYear, endOfYear } from 'date-fns';

// Import component 
import EnquirySingle from './EnquirySingle';
import EnquiryTable from './EnquiryTable';

// Import filter 
import Filters from '../../components/Filters';

const enquiryFilter = ["This Month", "Last 3 Months", "Last 6 Months"];

const PGEnquiry = () => {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();
  const { documents, error } = useCollection("enquiry");
  const [filter, setFilter] = useState(enquiryFilter[0]);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    let flag = user && user.role === "admin";
    if (!flag) {
      logout();
    }
  }, [user]);

  useEffect(() => {
    if (documents) {
      // Filter documents based on filter
      const filteredEnquiries = documents.filter((document) => {
        const createdAt = document.createdAt.toDate();
        switch (filter) {
          case "This Month":
            return isWithinInterval(createdAt, {
              start: startOfMonth(new Date()),
              end: new Date(),
            });
          case "Last 3 Months":
            return isWithinInterval(createdAt, {
              start: addMonths(new Date(), -3),
              end: new Date(),
            });
          case "Last 6 Months":
            return isWithinInterval(createdAt, {
              start: addMonths(new Date(), -6),
              end: new Date(),
            });
          default:
            // Check if filter is a specific year
            const selectedYear = parseInt(filter);
            return createdAt.getFullYear() === selectedYear;
        }
      });
      setEnquiries(filteredEnquiries);
    }
  }, [documents, filter]);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  useEffect(() => {
    // Set default filter to "This Month" when documents first load
    if (documents) {
      setFilter("This Month");
    }
  }, [documents]);

  // Extract unique years from documents and sort them in decreasing order
  const years = documents ? [...new Set(documents.map(doc => format(doc.createdAt.toDate(), 'yyyy')))].sort((a, b) => b - a) : [];


  // card and table view mode functionality start
  const [viewMode, setviewMode] = useState('card_view'); // Initial mode is grid with 3 columns

  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // card and table view mode functionality end

  return (
    <div className="top_header_pg pg_bg pg_enquiry">
      <div className="page_spacing">
        <div className="pg_header d-flex justify-content-between">
          <div className="left">
            <h2 className="m22">Enquiry {" "}
              <span className="r14 light_black" >( Application's filtered enquiries : {enquiries && enquiries.length} )</span>
            </h2>
          </div>
          <div className="right">
            <img src="./assets/img/icons/excel_logo.png" alt="" className="excel_dowanload" />
          </div>
        </div>
        <div className="vg12"></div>
        <div className="filters">
          <div className='left'>
            {viewMode === "card_view" && (
              <div className="rt_global_search search_field">
                <input
                  placeholder='Search'
                ></input>
                <div class="field_icon"><span class="material-symbols-outlined">search</span></div>
              </div>
            )}

          </div>
          <div className="right">
            <div className="user_filters new_inline">
              {documents && (
                <Filters
                  changeFilter={changeFilter}
                  filterList={[...enquiryFilter, ...years]}
                  filterLength={enquiries.length}
                />
              )}
            </div>
            <div className="button_filter diff_views">
              <div className={`bf_single ${viewMode === 'card_view' ? 'active' : ''}`} onClick={() => handleModeChange('card_view')}>
                <span className="material-symbols-outlined">calendar_view_month</span>
              </div>
              <div className={`bf_single ${viewMode === 'table_view' ? 'active' : ''}`} onClick={() => handleModeChange('table_view')}>
                <span className="material-symbols-outlined">view_list</span>
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        {error && <p className="error">{error}</p>}
        {enquiries && enquiries.length === 0 && <p className='text_red medium text-center' style={{
          fontSize: "18px"
        }}>No Enquiry Yet!</p>}

        {viewMode === "card_view" && (
          <div className="my_small_card_parent">
            {enquiries && <EnquirySingle enquiries={enquiries} /> }
            
          </div>
        )}
        {viewMode === "table_view" && (
          <>
            {enquiries && <EnquiryTable enquiries={enquiries} />}
          </>
        )}



      </div>
    </div>
  );
};

export default PGEnquiry;
