import React, { useState, useEffect } from "react";
import { useCollection } from "../../hooks/useCollection";
import { format, isWithinInterval, addMonths, startOfMonth } from "date-fns";
import { useExportToExcel } from "../../hooks/useExportToExcel";
import Switch from "react-switch";

// Import components
import EnquirySingle from "./EnquirySingle";
import EnquiryTable from "./EnquiryTable";

// Import filters
import Filters from "../../components/Filters";

const enquiryFilter = ["This Month", "Last 3 Months", "Last 6 Months"];
const enquiryStatusFilter = ["Total", "Open", "Working", "Successful", "Dead"];

const ViewEnquiry = ({ enquiryDocs, enquiryDocsError }) => {
  //  const { documents: enquiryDocs, error: enquiryDocsError } = useCollection("enquiry-propdial");
  const [filter, setFilter] = useState(enquiryFilter[0]);
  const [enquiries, setEnquiries] = useState([]);
  const [rentSaleFilter, setRentSaleFilter] = useState("rent");
  const [enquiryStatus, setEnquiryStatus] = useState("Total");
  const [currentFilter, setCurrentFilter] = useState(enquiryStatusFilter[0]);
  const [searchTerm, setSearchTerm] = useState("");
  // length useState start
  const [totalDocsLength, setTotalDocsLength] = useState(0);
  const [totalRentLength, setTotalRentLength] = useState(0);
  const [totalSaleLength, setTotalSaleLength] = useState(0);
  const [openRentEnquiryLength, setOpenRentEnquiryLength] = useState(0);
  const [openSaleEnquiryLength, setOpenSaleEnquiryLength] = useState(0);
  const [workingRentEnquiryLength, setWorkingRentEnquiryLength] = useState(0);
  const [workingSaleEnquiryLength, setWorkingSaleEnquiryLength] = useState(0);
  const [successfulRentEnquiryLength, setSuccessfulRentEnquiryLength] =
    useState(0);
  const [successfulSaleEnquiryLength, setSuccessfulSaleEnquiryLength] =
    useState(0);
  const [deadRentEnquiryLength, setDeadRentEnquiryLength] = useState(0);
  const [deadSaleEnquiryLength, setDeadSaleEnquiryLength] = useState(0);
  // length useState end

  const handleRentSaleChange = (checked) => {
    setRentSaleFilter(checked ? "sale" : "rent");
  };

  // old useeffect code without search start
  // useEffect(() => {
  //   if (enquiryDocs) {
  //     const filteredEnquiries = enquiryDocs.filter((document) => {
  //       const createdAt = document.createdAt.toDate();
  //       const matchesDateFilter = (() => {
  //         switch (filter) {
  //           case "This Month":
  //             return isWithinInterval(createdAt, {
  //               start: startOfMonth(new Date()),
  //               end: new Date(),
  //             });
  //           case "Last 3 Months":
  //             return isWithinInterval(createdAt, {
  //               start: addMonths(new Date(), -3),
  //               end: new Date(),
  //             });
  //           case "Last 6 Months":
  //             return isWithinInterval(createdAt, {
  //               start: addMonths(new Date(), -6),
  //               end: new Date(),
  //             });
  //           default:
  //             const selectedYear = parseInt(filter);
  //             return createdAt.getFullYear() === selectedYear;
  //         }
  //       })();
  //       const matchesEnquiryTypeFilter = document.enquiryType === rentSaleFilter;

  //       // Filter based on enquiryStatus
  //       const matchesEnquiryStatus = (enquiryStatus === "Total") ||
  //         (enquiryStatus === "Open" && document.enquiryStatus.toLowerCase() === "open") ||
  //         (enquiryStatus === "Working" && document.enquiryStatus.toLowerCase() === "working") ||
  //         (enquiryStatus === "Successful" && document.enquiryStatus.toLowerCase() === "successful") ||
  //         (enquiryStatus === "Dead" && document.enquiryStatus.toLowerCase() === "dead");

  //       return matchesDateFilter && matchesEnquiryTypeFilter && matchesEnquiryStatus;
  //     });

  //     setTotalDocsLength(enquiryDocs.length);
  //     setOpenRentEnquiryLength(enquiryDocs.filter(doc => (doc.enquiryStatus.toLowerCase() === "open") && (doc.enquiryType.toLowerCase() === "rent")).length);
  //     setTotalRentLength(enquiryDocs.filter(doc => (doc.enquiryType.toLowerCase() === "rent")).length);
  //     setTotalSaleLength(enquiryDocs.filter(doc => (doc.enquiryType.toLowerCase() === "sale")).length);
  //     setOpenSaleEnquiryLength(enquiryDocs.filter(doc => (doc.enquiryStatus.toLowerCase() === "open") && (doc.enquiryType.toLowerCase() === "sale")).length);
  //     setWorkingRentEnquiryLength(enquiryDocs.filter(doc => (doc.enquiryStatus.toLowerCase() === "working") && (doc.enquiryType.toLowerCase() === "rent")).length);
  //     setWorkingSaleEnquiryLength(enquiryDocs.filter(doc => (doc.enquiryStatus.toLowerCase() === "working") && (doc.enquiryType.toLowerCase() === "sale")).length);
  //     setSuccessfulRentEnquiryLength(enquiryDocs.filter(doc => (doc.enquiryStatus.toLowerCase() === "successful") && (doc.enquiryType.toLowerCase() === "rent")).length);
  //     setSuccessfulSaleEnquiryLength(enquiryDocs.filter(doc => (doc.enquiryStatus.toLowerCase() === "successful") && (doc.enquiryType.toLowerCase() === "sale")).length);
  //     setDeadRentEnquiryLength(enquiryDocs.filter(doc => (doc.enquiryStatus.toLowerCase() === "dead") && (doc.enquiryType.toLowerCase() === "rent")).length);
  //     setDeadSaleEnquiryLength(enquiryDocs.filter(doc => (doc.enquiryStatus.toLowerCase() === "dead") && (doc.enquiryType.toLowerCase() === "sale")).length);

  //     setEnquiries(filteredEnquiries);
  //   }
  // }, [enquiryDocs, filter, rentSaleFilter, enquiryStatus]);
  // old useeffect code without search start
  const [filteredRentCount, setFilteredRentCount] = useState(0);
  const [filteredSaleCount, setFilteredSaleCount] = useState(0);

  useEffect(() => {
    if (enquiryDocs) {
      const filteredEnquiries = enquiryDocs.filter((document) => {
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

        const matchesEnquiryTypeFilter =
          document.enquiryType === rentSaleFilter;

        // Filter based on enquiryStatus
        const matchesEnquiryStatus =
          enquiryStatus === "Total" ||
          (enquiryStatus === "Open" &&
            document.enquiryStatus.toLowerCase() === "open") ||
          (enquiryStatus === "Working" &&
            document.enquiryStatus.toLowerCase() === "working") ||
          (enquiryStatus === "Successful" &&
            document.enquiryStatus.toLowerCase() === "successful") ||
          (enquiryStatus === "Dead" &&
            document.enquiryStatus.toLowerCase() === "dead");

        // Filter based on search term
        const matchesSearchTerm = searchTerm === "" ||
          document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          document.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          document.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          document.source.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesDateFilter && matchesEnquiryTypeFilter && matchesEnquiryStatus && matchesSearchTerm;
      });

      setFilteredRentCount(filteredEnquiries.filter(doc => doc.enquiryType.toLowerCase() === "rent").length);
      setFilteredSaleCount(filteredEnquiries.filter(doc => doc.enquiryType.toLowerCase() === "sale").length);

      setTotalDocsLength(enquiryDocs.length);
      setOpenRentEnquiryLength(
        enquiryDocs.filter(
          (doc) =>
            doc.enquiryStatus.toLowerCase() === "open" &&
            doc.enquiryType.toLowerCase() === "rent"
        ).length
      );
      setTotalRentLength(
        enquiryDocs.filter((doc) => doc.enquiryType.toLowerCase() === "rent")
          .length
      );
      setTotalSaleLength(
        enquiryDocs.filter((doc) => doc.enquiryType.toLowerCase() === "sale")
          .length
      );
      setOpenSaleEnquiryLength(
        enquiryDocs.filter(
          (doc) =>
            doc.enquiryStatus.toLowerCase() === "open" &&
            doc.enquiryType.toLowerCase() === "sale"
        ).length
      );
      setWorkingRentEnquiryLength(
        enquiryDocs.filter(
          (doc) =>
            doc.enquiryStatus.toLowerCase() === "working" &&
            doc.enquiryType.toLowerCase() === "rent"
        ).length
      );
      setWorkingSaleEnquiryLength(
        enquiryDocs.filter(
          (doc) =>
            doc.enquiryStatus.toLowerCase() === "working" &&
            doc.enquiryType.toLowerCase() === "sale"
        ).length
      );
      setSuccessfulRentEnquiryLength(
        enquiryDocs.filter(
          (doc) =>
            doc.enquiryStatus.toLowerCase() === "successful" &&
            doc.enquiryType.toLowerCase() === "rent"
        ).length
      );
      setSuccessfulSaleEnquiryLength(
        enquiryDocs.filter(
          (doc) =>
            doc.enquiryStatus.toLowerCase() === "successful" &&
            doc.enquiryType.toLowerCase() === "sale"
        ).length
      );
      setDeadRentEnquiryLength(
        enquiryDocs.filter(
          (doc) =>
            doc.enquiryStatus.toLowerCase() === "dead" &&
            doc.enquiryType.toLowerCase() === "rent"
        ).length
      );
      setDeadSaleEnquiryLength(
        enquiryDocs.filter(
          (doc) =>
            doc.enquiryStatus.toLowerCase() === "dead" &&
            doc.enquiryType.toLowerCase() === "sale"
        ).length
      );

      setEnquiries(filteredEnquiries);
    }
  }, [enquiryDocs, filter, rentSaleFilter, enquiryStatus, searchTerm]);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const changeEnquiryStatus = (newStatus) => {
    setEnquiryStatus(newStatus);
    setCurrentFilter(newStatus);
  };

  useEffect(() => {
    if (enquiryDocs) {
      setFilter("This Month");
    }
  }, [enquiryDocs]);

  const years = enquiryDocs
    ? [
      ...new Set(
        enquiryDocs.map((doc) => format(doc.createdAt.toDate(), "yyyy"))
      ),
    ].sort((a, b) => b - a)
    : [];

  // view mode control start
  const [viewMode, setViewMode] = useState("card_view");

  const handleModeChange = (newViewMode) => {
    setViewMode(newViewMode);
  };
  // view mode control end

  // export data in excel
  const { exportToExcel, response: res } = useExportToExcel();
  const exportUsers = async () => {
    const subsetData = enquiries.map((item) => ({
      Name: item.name,
      IAm: item.iAm,
      Date: format(item.createdAt.toDate(), "dd-MMM-yy hh:mm a"),
      PhoneNumbar: item.phone.replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2-$3"),
      Country: item.country,
      State: item.state,
      City: item.city,
      Description: item.description,
    }));

    let filename = "EnquiryList.xlsx";
    exportToExcel(subsetData, filename);
  };
  // export data in excel

  // progress bar percentage
  const totalRentPercentage =
    totalDocsLength > 0 ? (totalRentLength * 100) / totalDocsLength : 0;
  const totalSalePercentage =
    totalDocsLength > 0 ? (totalSaleLength * 100) / totalDocsLength : 0;

  return (
    <>
      <div className="pg_header d-flex justify-content-between">
        <div className="left">
          <h2 className="m22 mb-1">Enquiry Dashboard </h2>
          <h6 className="r14 light_black">
            ( Application's filtered enquiries : {enquiries && enquiries.length}{" "}
            )
          </h6>
        </div>
        <div className="right">
          <img
            src="/assets/img/icons/excel_logo.png"
            alt=""
            className="excel_dowanload pointer"
            onClick={exportUsers}
          />
        </div>
      </div>
      <div className="vg22"></div>

      {enquiryDocs && (
        <div className="card_filter">
          {enquiryStatusFilter.map((f) => {
            if (f === "Total") {
              return (
                <div
                  key={f}
                  onClick={() => changeEnquiryStatus(f)}
                  className={`cs_single_big ${currentFilter === f ? "active" : ""
                    } ${f.toLowerCase()}`}
                >
                  <div className="inner">
                    <div className="left">
                      <div className="content">
                        <div className="top">{f} Enquiry</div>
                        <div className="card_upcoming">
                          <div className="parent">
                            <div className="child">
                              <div className="left">
                                <h5>{totalRentLength}</h5>
                                <div className="line">
                                  <div
                                    className="line_fill"
                                    style={{
                                      width: `${totalRentPercentage}%`, // Ensure to add `%` for CSS width property
                                      background: "#5A10D5",
                                    }}
                                  ></div>
                                </div>

                                <h6>Rent</h6>
                              </div>
                            </div>
                            <div className="child">
                              <div className="left">
                                <h5>{totalSaleLength}</h5>
                                <div className="line">
                                  <div
                                    className="line_fill"
                                    style={{
                                      width: `${totalSalePercentage}%`, // Ensure to add `%` for CSS width property
                                      background: "#00a8a8",
                                    }}
                                  ></div>
                                </div>
                                <h6>Sale</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="right">{totalDocsLength}</div>
                  </div>
                </div>
              );
            } else if (f === "Open") {
              return (
                <div
                  key={f}
                  onClick={() => changeEnquiryStatus(f)}
                  className={`cf_single ${currentFilter === f ? "active" : ""
                    } ${f.toLowerCase()}`}
                >
                  <div className="inner">
                    <div className="top">
                      <div className="left">
                        <h5>{openRentEnquiryLength}</h5>
                        <h6>Rent</h6>
                      </div>
                      <div className="right">
                        <h5>{openSaleEnquiryLength}</h5>
                        <h6>Sale</h6>
                      </div>
                    </div>
                    <div className="bottom">
                      <h6>{f}</h6>
                    </div>
                  </div>
                </div>
              );
            } else if (f === "Working") {
              return (
                <div
                  key={f}
                  onClick={() => changeEnquiryStatus(f)}
                  className={`cf_single ${currentFilter === f ? "active" : ""
                    } ${f.toLowerCase()}`}
                >
                  <div className="inner">
                    <div className="top">
                      <div className="left">
                        <h5>{workingRentEnquiryLength}</h5>
                        <h6>Rent</h6>
                      </div>
                      <div className="right">
                        <h5>{workingSaleEnquiryLength}</h5>
                        <h6>Sale</h6>
                      </div>
                    </div>
                    <div className="bottom">
                      <h6>{f}</h6>
                    </div>
                  </div>
                </div>
              );
            } else if (f === "Successful") {
              return (
                <div
                  key={f}
                  onClick={() => changeEnquiryStatus(f)}
                  className={`cf_single ${currentFilter === f ? "active" : ""
                    } ${f.toLowerCase()}`}
                >
                  <div className="inner">
                    <div className="top">
                      <div className="left">
                        <h5>{successfulRentEnquiryLength}</h5>
                        <h6>Rent</h6>
                      </div>
                      <div className="right">
                        <h5>{successfulSaleEnquiryLength}</h5>
                        <h6>Sale</h6>
                      </div>
                    </div>
                    <div className="bottom">
                      <h6>{f}</h6>
                    </div>
                  </div>
                </div>
              );
            } else if (f === "Dead") {
              return (
                <div
                  key={f}
                  onClick={() => changeEnquiryStatus(f)}
                  className={`cf_single ${currentFilter === f ? "active" : ""
                    } ${f.toLowerCase()}`}
                >
                  <div className="inner">
                    <div className="top">
                      <div className="left">
                        <h5>{deadRentEnquiryLength}</h5>
                        <h6>Rent</h6>
                      </div>
                      <div className="right">
                        <h5>{deadSaleEnquiryLength}</h5>
                        <h6>Sale</h6>
                      </div>
                    </div>
                    <div className="bottom">
                      <h6>{f}</h6>
                    </div>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      )}

      <div className="vg22"></div>
      <div className="vg12"></div>
      <div className="filters">
        <div className="left">
          <div className="rt_global_search search_field">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="field_icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="mobile_size residentail_commercial rent_sale">
            <label className={rentSaleFilter === "sale" ? "on" : "off"}>
              <div className="switch">
                <span
                  className={`rent ${rentSaleFilter === "sale" ? "off" : "on"}`}
                >
                  Rent ({filteredRentCount})
                </span>
                <Switch
                  onChange={handleRentSaleChange}
                  checked={rentSaleFilter === "sale"}
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  className="pointer"
                />
                <span
                  className={`sale ${rentSaleFilter === "sale" ? "on" : "off"}`}
                >
                  Sale ({filteredSaleCount})
                </span>
              </div>
            </label>
          </div>
          <div className="new_inline">
            {enquiryDocs && (
              <Filters
                changeFilter={changeFilter}
                filterList={[...enquiryFilter, ...years]}
                filterLength={enquiries.length}
              />
            )}
          </div>
          <div className="button_filter diff_views">
            <div
              className={`bf_single ${viewMode === "card_view" ? "active" : ""
                }`}
              onClick={() => handleModeChange("card_view")}
            >
              <span className="material-symbols-outlined">
                calendar_view_month
              </span>
            </div>
            <div
              className={`bf_single ${viewMode === "table_view" ? "active" : ""
                }`}
              onClick={() => handleModeChange("table_view")}
            >
              <span className="material-symbols-outlined">view_list</span>
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="vg12"></div>
      {enquiryDocsError && <p className="error">{enquiryDocsError}</p>}
      {enquiries && enquiries.length === 0 && (
        <p
          className="text_red medium text-center"
          style={{
            fontSize: "18px",
          }}
        >
          No Enquiry Yet!
        </p>
      )}

      {viewMode === "card_view" && (
        <div className="my_small_card_parent">
          {enquiries && <EnquirySingle enquiries={enquiries} />}
        </div>
      )}
      {viewMode === "table_view" && (
        // <>{enquiries && <EnquiryTable enquiries={enquiries} />}</>
        <h5 className="text-center text_green">
          Coming Soon....
        </h5>
      )}
    </>
  );
};

export default ViewEnquiry;
