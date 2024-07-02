import React, { useState, useEffect } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { format, isWithinInterval, addMonths, startOfMonth, startOfYear, endOfYear } from 'date-fns';
import { useExportToExcel } from '../../hooks/useExportToExcel';
import Switch from 'react-switch';
// Import component 
import EnquirySingle from './EnquirySingle';
import EnquiryTable from './EnquiryTable';

// Import filter 
import Filters from '../../components/Filters';

const enquiryFilter = ["This Month", "Last 3 Months", "Last 6 Months"];

const ViewEnquiry = () => {
  // code of display enquiry with filters start 
  const { documents, error } = useCollection("enquiry");
  const [filter, setFilter] = useState(enquiryFilter[0]);
  const [enquiries, setEnquiries] = useState([]);
  const [rentSaleFilter, setRentSaleFilter] = useState("rent");
  const handleRentSaleChange = (checked) => {
    setRentSaleFilter(checked ? "sale" : "rent");
  };


  // useEffect(() => {
  //   if (documents) {
  //     // Filter documents based on filter
  //     const filteredEnquiries = documents.filter((document) => {
  //       const createdAt = document.createdAt.toDate();
  //       switch (filter) {
  //         case "This Month":
  //           return isWithinInterval(createdAt, {
  //             start: startOfMonth(new Date()),
  //             end: new Date(),
  //           });
  //         case "Last 3 Months":
  //           return isWithinInterval(createdAt, {
  //             start: addMonths(new Date(), -3),
  //             end: new Date(),
  //           });
  //         case "Last 6 Months":
  //           return isWithinInterval(createdAt, {
  //             start: addMonths(new Date(), -6),
  //             end: new Date(),
  //           });
  //         default:
  //           // Check if filter is a specific year
  //           const selectedYear = parseInt(filter);
  //           return createdAt.getFullYear() === selectedYear;
  //       }
  //     });
  //     setEnquiries(filteredEnquiries);
  //   }
  // }, [documents, filter]);

  useEffect(() => {
    if (documents) {
      const filteredEnquiries = documents.filter((document) => {
        const createdAt = document.createdAt.toDate();
        const matchesDateFilter = (() => {
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
              const selectedYear = parseInt(filter);
              return createdAt.getFullYear() === selectedYear;
          }
        })();
        const matchesEnquiryTypeFilter = document.enquiryType === rentSaleFilter;
        return matchesDateFilter && matchesEnquiryTypeFilter;
      });
      setEnquiries(filteredEnquiries);
    }
  }, [documents, filter, rentSaleFilter]);


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
  // code of display enquiry with filters end

  // card and table view mode functionality start
  const [viewMode, setviewMode] = useState('card_view'); // Initial mode is grid with 3 columns

  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // card and table view mode functionality end

  // export in excel start
  const { exportToExcel, response: res } = useExportToExcel();
  const exportUsers = async () => {
    //create data
    const subsetData = enquiries.map(item => ({
      Name: item.name,
      IAm: item.iAm,
      Date: format(item.createdAt.toDate(), 'dd-MMM-yy hh:mm a'),
      PhoneNumbar: item.phone.replace(
        /(\d{2})(\d{5})(\d{5})/,
        "+$1 $2-$3"
      ),
      Country: item.country,
      State: item.state,
      City: item.city,
      Description: item.description
      // Add other fields as needed
    }));

    let filename = 'EnquiryList.xlsx'
    exportToExcel(subsetData, filename)

    // console.log(res)
  }
  // export in excel end
  return (
    <>
      <div className="vg22"></div>
      <div className="pg_header d-flex justify-content-between">
        <div className="left">
          <h2 className="m22">Enquiry {" "}
            <span className="r14 light_black" >( Application's filtered enquiries : {enquiries && enquiries.length} )</span>
          </h2>
        </div>
        <div className="right">
          <img src="./assets/img/icons/excel_logo.png" alt="" className="excel_dowanload pointer" onClick={exportUsers} />
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
        <div className="residentail_commercial rent_sale">
              <label className={rentSaleFilter === "sale" ? "on" : "off"}>
                <div className="switch">
                  <span className={`rent ${rentSaleFilter === "sale" ? "off" : "on"}`}>
                    Rent
                  </span>
                  <Switch
                    onChange={handleRentSaleChange}
                    checked={rentSaleFilter === "sale"}
                    handleDiameter={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    className="pointer"
                  />
                  <span className={`sale ${rentSaleFilter === "sale" ? "on" : "off"}`}>
                    Sale
                  </span>
                </div>
              </label>
            </div>
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
          {enquiries && <EnquirySingle enquiries={enquiries} />}

        </div>
      )}
      {viewMode === "table_view" && (
        <>
          {enquiries && <EnquiryTable enquiries={enquiries} />}
        </>
      )}

    </>
  )
}

export default ViewEnquiry
