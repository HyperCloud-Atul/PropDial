import { useState, useEffect } from "react";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import NineDots from "../../components/NineDots";
import MasterCountryTable from "./MasterCountryTable";

export default function MasterCountryList() {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  // const { addDocument, response } = useFirestore("m_countries");
  const { addDocumentWithCustomDocId, response } = useFirestore("m_countries");

  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("m_countries");
  const { documents: masterCountry, error: masterCountryerror } =
    useCollection("m_countries");

  const [country, setCountry] = useState("");
  const [formError, setFormError] = useState(null);
  const [formErrorType, setFormErrorType] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);
  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  useEffect(() => {
    // console.log('in useeffect')
  }, []);

  let results = [];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setFormError(null);
    setFormErrorType(null);

    if (country) {

      const countryname = country.trim().toUpperCase();
      const collectionRef = projectFirestore.collection("m_countries");

      if (currentDocid) {
        // Query to check if country already exists
        const querySnapshot = await collectionRef
          .where("country", "==", countryname)
          .get();

        if (querySnapshot.empty) {

          // Update existing document
          await updateDocument(currentDocid, {
            country: countryname,
          });

          setFormErrorType("success_msg");
          setFormError("Successfully updated");
          setIsAdding(false);

          // Reset error message after 5 seconds
          setTimeout(() => {
            setFormError(null);
            setFormErrorType(null);
          }, 5000);

        }
        else {
          // Handle duplicate case
          setFormErrorType("error_msg");
          setFormError("Already added");
          setIsAdding(false);

          // Reset error message after 5 seconds
          setTimeout(() => {
            setFormError(null);
            setFormErrorType(null);
          }, 5000);
        }

      } else {
        try {
          // Query to check if country already exists
          const querySnapshot = await collectionRef
            .where("country", "==", countryname)
            .get();

          if (querySnapshot.empty) {
            // If no duplicate exists, add new document
            const dataSet = {
              docId: "_" + countryname.split(" ").join("_").toLowerCase(),
              country: countryname,
              status: "active",
            };
            const _customDocId = dataSet.docId;
            await addDocumentWithCustomDocId(dataSet, _customDocId);

            setFormErrorType("success_msg");
            setFormError("Successfully added");
            setIsAdding(false);

            // Reset form and messages after 5 seconds
            setTimeout(() => {
              setFormError(null);
              setFormErrorType(null);
              setCountry("");
            }, 5000);
          } else {
            // Handle duplicate case
            setFormErrorType("error_msg");
            setFormError("Already added");
            setIsAdding(false);

            // Reset error message after 5 seconds
            setTimeout(() => {
              setFormError(null);
              setFormErrorType(null);
            }, 5000);
          }
        } catch (error) {
          console.error("Error adding/updating country:", error);
          setFormErrorType("error_msg");
          setFormError("An error occurred. Please try again.");
          setIsAdding(false);

          // Reset error message after 5 seconds
          setTimeout(() => {
            setFormError(null);
            setFormErrorType(null);
          }, 5000);
        }
      }
    }
    else {
      // Handle blank case
      setFormErrorType("error_msg");
      setFormError("Country should not be blank ");
      setIsAdding(false);

      // Reset error message after 5 seconds
      setTimeout(() => {
        setFormError(null);
        setFormErrorType(null);
      }, 5000);
    }

  };


  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);

  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };

  const handleAddSection = () => {
    setFormError(null);
    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText("Add Country");
    setCountry("");
    setCurrentDocid(null);
  };

  // const [cityStatus, setCityStatus] = useState();
  const handleChangeStatus = async (docid, status) => {
    // console.log('docid:', docid)
    if (status === "active") status = "inactive";
    else status = "active";
    await updateDocument(docid, {
      status,
    });
  };

  const handleEditCard = (docid, doccountry) => {
    // console.log('docid in handleEditCard:', docid)
    window.scrollTo(0, 0);
    setFormError(null);
    setCountry(doccountry);
    sethandleAddSectionFlag(!handleAddSectionFlag);
    setFormBtnText("Update Country");
    setCurrentDocid(docid);
  };

  // nine dots menu start
  const nineDotsMenu = [
    { title: "City's List", link: "/citylist", icon: "location_city" },
    { title: "State's List", link: "/statelist", icon: "map" },
    {
      title: "Locality's List",
      link: "/localitylist",
      icon: "holiday_village",
    },
    { title: "Society's List", link: "/societylist", icon: "home" },
  ];
  // nine dots menu end

  // View mode start
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // View mode end

  return (
    <div className="top_header_pg pg_bg pg_adminproperty">
      <div
        className={`page_spacing pg_min_height ${masterCountry && masterCountry.length === 0 && "pg_min_height"
          }`}
      >
        <NineDots nineDotsMenu={nineDotsMenu} />

        {masterCountry && masterCountry.length === 0 && (
          <div className={`pg_msg ${handleAddSectionFlag && "d-none"}`}>
            <div>
              No Country Yet!
              <div
                onClick={handleAddSection}
                className={`theme_btn no_icon header_btn mt-3 ${handleAddSectionFlag ? "btn_border" : "btn_fill"
                  }`}
              >
                {handleAddSectionFlag ? "Cancel" : "Add New"}
              </div>
            </div>
          </div>
        )}
        {masterCountry && masterCountry.length !== 0 && (
          <>
            <div className="pg_header d-flex justify-content-between">
              <div className="left">
                <h2 className="m22">
                  Total Country:{" "}
                  {masterCountry && (
                    <span className="text_orange">{masterCountry.length}</span>
                  )}
                </h2>
              </div>
              <div className="right">
                <img
                  src="./assets/img/icons/excel_logo.png"
                  alt=""
                  className="excel_dowanload"
                />
              </div>
            </div>
            <div className="vg12"></div>
            <div className="filters">
              <div className="left">
                <div className="rt_global_search search_field">
                  <input
                    placeholder="Search"
                  // value={searchInput}
                  // onChange={handleSearchInputChange}
                  />
                  <div className="field_icon">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                </div>
              </div>
              <div className="right">
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
                {!handleAddSectionFlag && (
                  <div
                    onClick={handleAddSection}
                    className={`theme_btn no_icon header_btn ${handleAddSectionFlag ? "btn_border" : "btn_fill"
                      }`}
                  >
                    Add New
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div
          style={{
            overflow: handleAddSectionFlag ? "visible" : "hidden",
            // transition: "1s",
            opacity: handleAddSectionFlag ? "1" : "0",
            maxHeight: handleAddSectionFlag ? "100%" : "0",
            background: "var(--theme-blue-bg)",
            marginLeft: handleAddSectionFlag ? "-22px" : "0px",
            marginRight: handleAddSectionFlag ? "-22px" : "0px",
            marginTop: handleAddSectionFlag ? "22px" : "0px",
            padding: handleAddSectionFlag ? "32px 22px" : "0px",

          }}
          className="add_md_form"
        >
          <form>
            <div className="row row_gap form_full">
              <div className="col-xl-4 col-lg-6">
                <div className="form_field label_top">
                  <label htmlFor="">Country Name</label>
                  <div className="form_field_inner">
                    <input
                      required
                      type="text"
                      placeholder="Entry Country Name"
                      onChange={(e) => setCountry(e.target.value)}
                      value={country}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="btn_and_msg_area">
              {formError && (
                <div className={`msg_area big_font ${formErrorType}`}>
                  {formError}
                </div>
              )}

              <div
                className="d-flex align-items-center justify-content-end"
                style={{
                  gap: "15px",
                }}
              >
                <div
                  className="theme_btn btn_border_red no_icon text-center"
                  onClick={handleAddSection}
                  style={{
                    minWidth: "140px",
                  }}
                >
                  Close
                </div>
                <div
                  className="theme_btn btn_fill no_icon text-center"
                  onClick={isAdding ? null : handleSubmit}
                  style={{
                    minWidth: "140px",
                  }}
                >
                  {isAdding ? "Processing..." : formBtnText}
                </div>
              </div>
            </div>


          </form>

        </div>
        {masterCountry && masterCountry.length !== 0 && (
          <>
            <div className="master_data_card">
              {viewMode === "card_view" && (
                <>
                  {masterCountry &&
                    masterCountry.map((data) => (
                      <div className="property-status-padding-div">
                        <div
                          className="profile-card-div"
                          style={{ position: "relative" }}
                        >
                          <div
                            className="address-div"
                            style={{ paddingBottom: "5px" }}
                          >
                            <div
                              className="icon"
                              style={{ position: "relative", top: "-5px" }}
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{ color: "var(--darkgrey-color)" }}
                              >
                                flag
                              </span>
                            </div>
                            <div className="address-text">
                              <div
                                onClick={() =>
                                  handleEditCard(data.id, data.country)
                                }
                                style={{
                                  width: "80%",
                                  height: "170%",
                                  textAlign: "left",
                                  display: "flex",
                                  justifyContent: "center",
                                  flexDirection: "column",
                                  transform: "translateY(-6px)",
                                  cursor: "pointer",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0",
                                    transform: "translateY(5px)",
                                  }}
                                >
                                  {data.country}{" "}
                                </h5>
                                {/* <small style={{ margin: '0', transform: 'translateY(5px)' }}>{data.status} ({data.country})</small> */}
                              </div>
                              <div
                                className=""
                                onClick={() =>
                                  handleChangeStatus(data.id, data.status)
                                }
                                style={{
                                  width: "20%",
                                  height: "calc(100% - -20px)",
                                  position: "relative",
                                  top: "-8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                  cursor: "pointer",
                                }}
                              >
                                <small
                                  style={{
                                    margin: "0",
                                    background:
                                      data.status === "active"
                                        ? "green"
                                        : "red",
                                    color: "#fff",
                                    padding: "3px 10px 3px 10px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  {data.status}
                                </small>
                                {/* <span className="material-symbols-outlined">
                                          chevron_right
                                      </span> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
            {viewMode === "table_view" && (
              // <h5 className="text-center text_green">Coming Soon....</h5>
              <>
                {masterCountry && (
                  <MasterCountryTable filterData={masterCountry} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
