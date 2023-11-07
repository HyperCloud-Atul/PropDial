import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// styles
import "./PGAddProperty.css";

// component
import PropertySidebar from "../../Components/PropertySidebar";



export default function PGAddProperty({ propertyid }) {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  // radio button check
  // Initialize state for each radio button
  const [selectedRadioOption, setRadioSelectedOption] =
    useState("by_default_check");

  // Function to handle radio button selection
  const handleRadioCheck = (event) => {
    setRadioSelectedOption(event.target.value);
  };
  // radio button check

  const navigate = useNavigate();


  const [toggleFlag, setToggleFlag] = useState(false);

  // form field values

  const [category, setCategory] = useState("residential"); //Residential/Commercial

  // test 
  const [propertyName, setPropertyName] = useState("");
  // const [propertyLocality, setpropertyLocality] = useState("");
  const [propertyDetails, setPropertyDetails] = useState({
    Locality: '',
    City: ''
  });

  // const { addDocument, addResponse } = useFirestore("properties"); // Firestore collection name
  const { document: property, error: propertyerror } = useDocument("properties", propertyid);
  const { updateDocument, updateResponse } = useFirestore("properties"); // Firestore collection name


  // set property document values into form
  useEffect(() => {
    // console.log('property: ', property);

    if (property) {
      console.log('property.locality: ', property.locality);
      setPropertyDetails({
        Locality: property.locality,
        City: property.city
      })
    }
  }, [property])


  const saveData = async (e) => {
    e.preventDefault();

    // Create a property object
    const property = {
      unitNumber: "A-504-2",
      locality: propertyDetails.Locality
      // Add more properties as needed
    };

    // console.log("saveData: ", property)
    // Store the property data in Firestore
    // await addDocument(property);
    await updateDocument(propertyid, property);

    // Reset the form after submission
    // setPropertyName("");


    if (!updateResponse.error) {
      // Handle success, e.g., show a success message or redirect the user
      console.log('updateresponse (not error): ', updateResponse)
    } else {
      // Handle error, e.g., show an error message
      console.log('updateresponse (error) : ', updateResponse)
    }
  };

  const toggleBtnClick = () => {
    // console.log('toggleClick Category:', toggleFlag)
    if (toggleFlag) setCategory("residential");
    else setCategory("commercial");
    setToggleFlag(!toggleFlag);
  };



  return (
    <div className="dashboard_pg aflbg property_setup">
      <div className="sidebarwidth">
        <PropertySidebar />
      </div>
      <div className="right_main_content">
        <div className="property-detail">
          <div class="accordion" id="a1accordion_section">
            <div class="accordion-item">
              <h2 class="accordion-header" id="a1headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#a1collapseOne"
                  aria-expanded="true"
                  aria-controls="a1collapseOne"
                >
                  <div className="inner">
                    <div className="left">
                      <h5>A-502</h5>
                      <h6>
                        High Mont Society,
                        <br />
                        Hinjewadi, Pune
                      </h6>
                    </div>
                    <div className="right">
                      <h5>Sanskar Solanki</h5>
                      <h6>8770534650</h6>
                    </div>
                  </div>
                </button>
              </h2>
              <div
                id="a1collapseOne"
                class="accordion-collapse collapse"
                aria-labelledby="a1headingOne"
                data-bs-parent="#a1accordion_section"
              >
                <div class="accordion-body">
                  <div class="secondary-details-display">
                    <div class="secondary-details-inside-display">
                      <h5 style={{ textAlign: "center" }}>Atul Tripathi</h5>
                      <div
                        class="property-contact-div property-media-icons-horizontal"
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        <div>
                          <span class="material-symbols-outlined">call</span>
                          <h1>Call</h1>
                        </div>
                        <div>
                          <img
                            src="./assets/img/whatsapp_square_icon.png"
                            alt=""
                          />
                          <h1>WhatsApp</h1>
                        </div>
                        <div>
                          <span class="material-symbols-outlined">
                            alternate_email
                          </span>
                          <h1>Mail</h1>
                        </div>
                      </div>
                    </div>
                    <hr class="secondary-details-hr" />
                    <div style={{ width: "100%" }}>
                      <h5 style={{ textAlign: "center" }}>Vinay Prajapati</h5>
                      <div
                        class="property-contact-div property-media-icons-horizontal"
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        <div>
                          <span class="material-symbols-outlined">call</span>
                          <h1>Call</h1>
                        </div>
                        <div>
                          <img src="../img/whatsapp_square_icon.png" alt="" />
                          <h1>WhatsApp</h1>
                        </div>
                        <div>
                          <span class="material-symbols-outlined">
                            alternate_email
                          </span>
                          <h1>Mail</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="row no-gutters"
          style={{ margin: "10px 0px ", height: "50px", background: "white" }}
        >
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div
              className="residential-commercial-switch"
              style={{ height: "calc(100% - 10px)" }}
            >
              <span
                className={toggleFlag ? "" : "active"}
                style={{ color: "var(--theme-blue)" }}
              >
                Residential
              </span>

              <div
                className={
                  toggleFlag
                    ? "toggle-switch on commercial"
                    : "toggle-switch off residential"
                }
                style={{ padding: "0 10px" }}
              >
                {/* <small>{toggleFlag ? 'On' : 'Off'}</small> */}
                <div onClick={toggleBtnClick}>
                  <div></div>
                </div>
              </div>
              <span
                className={toggleFlag ? "active" : ""}
                style={{ color: "var(--theme-orange)" }}
              >
                Commercial
              </span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <button onClick={saveData} className="theme_btn btn_fill" style={{ height: '30px', paddingTop: '1px' }}>Save
                <span class="material-symbols-outlined btn_arrow ba_animation" style={{ top: '5px' }}>arrow_forward</span>
              </button>

            </div>

          </div>
        </div>
        <form>
          <Tabs>
            <TabList>
              <Tab className="pointer">Basic</Tab>
              <Tab className="pointer">Details</Tab>
              <Tab className="pointer">More</Tab>
            </TabList>
            <TabPanel className="basic_detail">
              <div className="basic_detail_inner">
                <div className="row no-gutters">
                  <div className="col-lg-4 first_col">
                    <div className="form_field st-2 mt-lg-0">
                      <label>Owner Name</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>
                            Select Owner
                          </option>
                          <option>1</option>
                          <option>2</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">person</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Co-Owner Name</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>
                            Select Co-Owner
                          </option>
                          <option>1</option>
                          <option>2</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">group</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Address Locator</label>
                      <div className="field_inner">
                        <input
                          type="text"
                          placeholder="Enter Property Unit Number"
                        />
                        <div className="field_icon">
                          <span class="material-symbols-outlined">map</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Country</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected>
                            India
                          </option>
                          <option value="">Denmark</option>
                          <option value="">Malasia</option>
                          <option value="">China</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">public</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>State</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected>
                            Delhi
                          </option>
                          <option value="">Harayana</option>
                          <option value="">Uttar Pradesh</option>
                          <option value="">Maharashtra</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            emoji_transportation
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>City</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected>
                            Delhi
                          </option>
                          <option value="">Gurugram</option>
                          <option value="">Noida</option>
                          <option value="">Pune</option>
                          <option value="">Hyderabad</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">apartment</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Locality</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.Locality} onChange={(e) => {
                          // console.log('e', e.target.text, e.target, e.target.value)
                          // console.log('propertyLocality', propertyLocality)
                          // setpropertyLocality(e.target.value)
                          setPropertyDetails({
                            ...propertyDetails,
                            Locality: e.target.value
                          })


                        }} >
                          <option selected={propertyDetails && propertyDetails.Locality === 'Malviya Nagar' ? true : false}>
                            Malviya Nagar
                          </option>
                          <option selected={propertyDetails && propertyDetails.Locality === 'Dwarka' ? true : false} >Dwarka</option>
                          <option selected={propertyDetails && propertyDetails.Locality === 'Rajori Garden' ? true : false}>Rajori Garden</option>
                          <option selected={propertyDetails && propertyDetails.Locality === 'Lajpat Nagar' ? true : false}>Lajpat Nagar</option>
                          <option selected={propertyDetails && propertyDetails.Locality === 'Saraojni Nagar' ? true : false}>Saraojni Nagar</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            holiday_village
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Pin Code</label>
                      <div className="field_inner">
                        <input type="number" placeholder="Enter Pin Code" />
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            drive_file_rename_outline
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Society</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>
                            Choose Society
                          </option>
                          <option value="">Society 1</option>
                          <option value="">Society 2</option>
                          <option value="">Society 3</option>
                          <option value="">Society 4</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            holiday_village
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Unit Number</label>
                      <div className="field_inner">
                        <input
                          type="text"
                          placeholder="Enter Property Unit Number"
                        />
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            drive_file_rename_outline
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Property Type</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>
                            Choose Property Type
                          </option>
                          <option value="">High Rise Apt</option>
                          <option value="">Low Rise Apt</option>
                          <option value="">Builder Floor</option>
                          <option value="">Kothi</option>
                          <option value="">Villa - Simplex</option>
                          <option value="">Villa - Duplex</option>
                          <option value="">Row House - Simplex</option>
                          <option value="">Row House - Duplex</option>
                          <option value="">Pent House - Simplex</option>
                          <option value="">Pent House - Duplex</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            format_list_bulleted
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Year of Constuction</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" disabled>
                            Year of Constuction
                          </option>
                          <option value="">1990</option>
                          <option value="">1991</option>
                          <option value="">1992</option>
                          <option value="">1993</option>
                          <option value="">1994</option>
                          <option value="">1995</option>
                          <option value="">1996</option>
                          <option value="">1997</option>
                          <option value="">1998</option>
                          <option value="">1999</option>
                          <option value="">2000</option>
                          <option value="">2001</option>
                          <option value="">2002</option>
                          <option value="">2003</option>
                          <option value="">2004</option>
                          <option value="">2005</option>
                          <option value="">2006</option>
                          <option value="">2007</option>
                          <option value="">2008</option>
                          <option value="">2009</option>
                          <option value="" selected>
                            2010
                          </option>
                          <option value="">2011</option>
                          <option value="">2012</option>
                          <option value="">2013</option>
                          <option value="">2014</option>
                          <option value="">2015</option>
                          <option value="">2016</option>
                          <option value="">2017</option>
                          <option value="">2018</option>
                          <option value="">2019</option>
                          <option value="">2020</option>
                          <option value="">2021</option>
                          <option value="">2022</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            engineering
                          </span>
                        </div>
                      </div>
                      <h6 className="dec_related_to_input">
                        Age Of Property is 12 Years
                      </h6>
                    </div>
                    <div className="form_field st-2">
                      <label>BHK</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>
                            Choose BHK
                          </option>
                          <option value="">EWS</option>
                          <option value="">1 RK</option>
                          <option value="">Studio</option>
                          <option value="">1 BHK</option>
                          <option value="">1.5 BHK</option>
                          <option value="">2 BHK</option>
                          <option value="">2.5 BHK</option>
                          <option value="">3 BHK</option>
                          <option value="">2.5 BHK</option>
                          <option value="">4 BHK</option>
                          <option value="">5 BHK</option>
                          <option value="">6 BHK</option>
                          <option value="">7 BHK</option>
                          <option value="">8 BHK</option>
                          <option value="">9+ BHK</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            bedroom_parent
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Furnishing</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="semi_furnished"
                              value="semi_furnished"
                              checked={selectedRadioOption === "by_default_check"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="semi_furnished">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Semi</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "fully_furnished"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="fully_furnished"
                              value="fully_furnished"
                              checked={selectedRadioOption === "fully_furnished"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="fully_furnished">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Fully</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "raw_furnished"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="raw_furnished"
                              value="raw_furnished"
                              checked={selectedRadioOption === "raw_furnished"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="raw_furnished">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Raw</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 second_col">
                    <div className="form_field st-2 mt-lg-0">
                      <label>No. of Bedrooms</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>
                            Number Of Bedrooms
                          </option>
                          <option value="">0</option>
                          <option value="">1</option>
                          <option value="">2</option>
                          <option value="">3</option>
                          <option value="">4</option>
                          <option value="">5</option>
                          <option value="">6</option>
                          <option value="">7</option>
                          <option value="">8</option>
                          <option value="">9</option>
                          <option value="">10</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">bed</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Bathrooms</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>
                            Number Of Bathrooms
                          </option>
                          <option value="">0</option>
                          <option value="">1</option>
                          <option value="">2</option>
                          <option value="">3</option>
                          <option value="">4</option>
                          <option value="">5</option>
                          <option value="">6</option>
                          <option value="">7</option>
                          <option value="">8</option>
                          <option value="">9</option>
                          <option value="">10</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">bathtub</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Balcony</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>
                            Number Of Balcony
                          </option>
                          <option value="">0</option>
                          <option value="">1</option>
                          <option value="">2</option>
                          <option value="">3</option>
                          <option value="">4</option>
                          <option value="">5</option>
                          <option value="">6</option>
                          <option value="">7</option>
                          <option value="">8</option>
                          <option value="">9</option>
                          <option value="">10</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">balcony</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Kitchen</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" disabled>
                            Number Of Kitchen
                          </option>
                          <option value="">0</option>
                          <option value="" selected>
                            1
                          </option>
                          <option value="">2</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            soup_kitchen
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Dining Area</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_yes"
                              value="dining_yes"
                              checked={selectedRadioOption === "by_default_check"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_yes">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Yes</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>No</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Living & Dining</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_yes"
                              value="dining_yes"
                              checked={selectedRadioOption === "by_default_check"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_yes">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Yes</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>No</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Living Area</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" disabled>
                            Number Of Living Area
                          </option>
                          <option value="">0</option>
                          <option value="" selected>
                            1
                          </option>
                          <option value="">2</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">living</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Passages</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_yes"
                              value="dining_yes"
                              checked={selectedRadioOption === "by_default_check"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_yes">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Yes</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>No</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Entrance Gallery</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_yes"
                              value="dining_yes"
                              checked={selectedRadioOption === "by_default_check"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_yes">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Yes</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>No</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Basement</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" disabled>
                            Number Of Basement
                          </option>
                          <option value="" selected>
                            0
                          </option>
                          <option value="">1</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            foundation
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Additional Rooms - ( 0 )</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_yes"
                              value="dining_yes"
                              checked={selectedRadioOption === "by_default_check"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_yes">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Servent Room</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Office Room</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Store Room</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Pooja Room</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Study Room</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Powder Room</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Additional Area - ( 0 )</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_yes"
                              value="dining_yes"
                              checked={selectedRadioOption === "by_default_check"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_yes">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Front Yard</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Back Yard</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Terrace</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Garden</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Garage</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 third_col">
                    <div className="form_field st-2 mt-lg-0">
                      <label>Total Floor</label>
                      <div className="field_inner">
                        <input type="text" placeholder="Total Floors..." />
                        <div className="field_icon">
                          <span class="material-symbols-outlined">

                            table_rows
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Floor Number</label>
                      <div className="field_inner">
                        <input type="text" placeholder="Floor Number..." value={propertyName}
                          onChange={(e) => setPropertyName(e.target.value)} />
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            filter_none
                          </span>
                        </div>
                      </div>
                    </div>
                    <input type="submit"></input>
                    <div className="form_field st-2">
                      <label>No. of Apt On Floor</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>
                            Number of Apt On Floor
                          </option>
                          <option value="">1</option>
                          <option value="">2</option>
                          <option value="">3</option>
                          <option value="">4</option>
                          <option value="">5</option>
                          <option value="">6</option>
                          <option value="">7</option>
                          <option value="">8</option>
                          <option value="">9</option>
                          <option value="">10</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            filter_none
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Lifts</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>
                            Number of Lifts
                          </option>
                          <option value="">1</option>
                          <option value="">2</option>
                          <option value="">3</option>
                          <option value="">4</option>
                          <option value="">5</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            full_stacked_bar_chart
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Power Backup</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_yes"
                              value="dining_yes"
                              checked={selectedRadioOption === "by_default_check"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_yes">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> No Backup</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Full Backup</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Partial Backup</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>  Lift Only</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>  Inverter</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Plot Area</label>
                      <div className="field_inner">
                        <input type="text" placeholder="Plot Area..." />
                        <div className="field_icon">
                          <select>
                            <option value="">SqFt</option>
                            <option value="">SqMtr</option>
                            <option value="">SqYd</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Super Area</label>
                      <div className="field_inner">
                        <input type="text" placeholder="Super Area..." />
                        <div className="field_icon">
                          <select>
                            <option value="">SqFt</option>
                            <option value="">SqMtr</option>
                            <option value="">SqYd</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Built-up Area</label>
                      <div className="field_inner">
                        <input type="text" placeholder="Build Area..." />
                        <div className="field_icon">
                          <select>
                            <option value="">SqFt</option>
                            <option value="">SqMtr</option>
                            <option value="">SqYd</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Carpet Area</label>
                      <div className="field_inner">
                        <input type="text" placeholder="Carpet Area..." />
                        <div className="field_icon">
                          <select>
                            <option value="">SqFt</option>
                            <option value="">SqMtr</option>
                            <option value="">SqYd</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Car Parking</label>
                      <div className="field_inner select">
                        <select>
                          <option value="" selected disabled>Number of Car Parking</option>
                          <option value="">1</option>
                          <option value="">2</option>
                          <option value="">3</option>
                          <option value="">4</option>
                          <option value="">5</option>
                        </select>
                        <div className="field_icon">
                          <span class="material-symbols-outlined">
                            local_parking
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Car Parking - ( 0 )</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_yes"
                              value="dining_yes"
                              checked={selectedRadioOption === "by_default_check"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_yes">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>  Open</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Closed</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>2-Wheeler Parking</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_yes"
                              value="dining_yes"
                              checked={selectedRadioOption === "by_default_check"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_yes">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>  Yes</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              value="dining_no"
                              checked={selectedRadioOption === "no"}
                              onChange={handleRadioCheck}
                            />
                            <label htmlFor="dining_no">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>  No</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel className="property_details">
              <div className="property_details_inner">
                <div className="row no-gutter">
                  <div className="col-md-4">
                    <div className="left">
                      <img src="./assets/img/homebanner1.jpg"></img>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="right">
                      <div class="accordion" id="property_detail_accordion">
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="bedroom">
                            <button
                              class="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#bedroom_collapse"
                              aria-expanded="true"
                              aria-controls="bedroom_collapse"
                            >
                              <div className="button_title">
                                <span class="material-symbols-outlined button_icon">
                                  bed
                                </span>
                                Bedrooms - (4)
                                {/* <span class="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span class="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="bedroom_collapse"
                            class="accordion-collapse collapse"
                            aria-labelledby="bedroom"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div class="accordion-body">
                              <h6 className="mt-2 text-center">Master Bedroom</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Is Bathroom attached ?</label>
                                    <div className="radio_group">
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                                            ? "radiochecked"
                                            : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_yes"
                                            value="dining_yes"
                                            checked={selectedRadioOption === "by_default_check"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_yes">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>  Yes</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_no"
                                            value="dining_no"
                                            checked={selectedRadioOption === "no"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_no">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>  No</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Is Balcony attached ?</label>
                                    <div className="radio_group">
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                                            ? "radiochecked"
                                            : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_yes"
                                            value="dining_yes"
                                            checked={selectedRadioOption === "by_default_check"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_yes">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>  Yes</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_no"
                                            value="dining_no"
                                            checked={selectedRadioOption === "no"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_no">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>  No</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Flooring Type</label>
                                    <div className="field_inner select">
                                      <select>
                                        <option value="" selected disabled>Flooring Type</option>
                                        <option value="">Marble</option>
                                        <option value="">Vetrified Tile</option>
                                        <option value="">Vinyl</option>
                                        <option value="">Hardwood</option>
                                        <option value="">Granite</option>
                                        <option value="">Bamboo</option>
                                        <option value="">Concrete</option>
                                        <option value="">Laminate</option>
                                        <option value="">Linoleum</option>
                                        <option value="">Terrazzo (Mosaic)</option>
                                        <option value="">Brick</option>
                                        <option value="">Red Oxide</option>
                                      </select>
                                      <div className="field_icon">
                                        <span class="material-symbols-outlined">
                                          crop_square
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="form_field st-2">
                                    <label>Fitting & Fixtures</label>
                                    <div className="radio_group">
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                                            ? "radiochecked"
                                            : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_yes"
                                            value="dining_yes"
                                            checked={selectedRadioOption === "by_default_check"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_yes">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>   Fan</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_no"
                                            value="dining_no"
                                            checked={selectedRadioOption === "no"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_no">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>  Tube Light</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_no"
                                            value="dining_no"
                                            checked={selectedRadioOption === "no"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_no">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>   Almirah</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_no"
                                            value="dining_no"
                                            checked={selectedRadioOption === "no"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_no">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>  Window</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr></hr>
                              <h6 className="mt-2 text-center">Bedroom 2</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr></hr>
                              <h6 className="mt-2 text-center">Bedroom 3</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr></hr>
                              <h6 className="mt-2 text-center">Bedroom 4</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="bathroom">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#bathroom_collapse"
                              aria-expanded="false"
                              aria-controls="bathroom_collapse"
                            >
                              <div className="button_title">
                                <span class="material-symbols-outlined button_icon">
                                  bathtub
                                </span>
                                Bathrooms - (1)
                                {/* <span class="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span class="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="bathroom_collapse"
                            class="accordion-collapse collapse"
                            aria-labelledby="bathroom"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div class="accordion-body">
                              <h6 className="mt-2 text-center">Bathroom 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Is attached to Bedroom ?</label>
                                    <div className="radio_group">
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                                            ? "radiochecked"
                                            : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_yes"
                                            value="dining_yes"
                                            checked={selectedRadioOption === "by_default_check"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_yes">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>  Yes</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_no"
                                            value="dining_no"
                                            checked={selectedRadioOption === "no"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_no">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>  No</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Flooring Type</label>
                                    <div className="field_inner select">
                                      <select>
                                        <option value="" selected disabled>Flooring Type</option>
                                        <option value="">Marble</option>
                                        <option value="">Vetrified Tile</option>
                                        <option value="">Vinyl</option>
                                        <option value="">Hardwood</option>
                                        <option value="">Granite</option>
                                        <option value="">Bamboo</option>
                                        <option value="">Concrete</option>
                                        <option value="">Laminate</option>
                                        <option value="">Linoleum</option>
                                        <option value="">Terrazzo (Mosaic)</option>
                                        <option value="">Brick</option>
                                        <option value="">Red Oxide</option>
                                      </select>
                                      <div className="field_icon">
                                        <span class="material-symbols-outlined">
                                          crop_square
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="form_field st-2">
                                    <label>Fitting & Fixtures</label>
                                    <div className="radio_group">
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "by_default_check"
                                            ? "radiochecked"
                                            : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_yes"
                                            value="dining_yes"
                                            checked={selectedRadioOption === "by_default_check"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_yes">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>   Fan</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_no"
                                            value="dining_no"
                                            checked={selectedRadioOption === "no"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_no">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>  Tube Light</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_no"
                                            value="dining_no"
                                            checked={selectedRadioOption === "no"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_no">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>   Almirah</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className={`custom_radio_button ${selectedRadioOption === "no" ? "radiochecked" : ""
                                            }`}
                                        >
                                          <input
                                            type="radio"
                                            id="dining_no"
                                            value="dining_no"
                                            checked={selectedRadioOption === "no"}
                                            onChange={handleRadioCheck}
                                          />
                                          <label htmlFor="dining_no">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>  Window</h6>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="balcony">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#balcony_collapse"
                              aria-expanded="false"
                              aria-controls="balcony_collapse"
                            >
                              <div className="button_title">
                                <span class="material-symbols-outlined button_icon">
                                  balcony
                                </span>
                                Balcony - (4)
                                {/* <span class="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span class="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="balcony_collapse"
                            class="accordion-collapse collapse"
                            aria-labelledby="balcony"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div class="accordion-body">
                              <h6 className="mt-2 text-center">Balcony 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="kitchen">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#kitchen_collapse"
                              aria-expanded="false"
                              aria-controls="kitchen_collapse"
                            >
                              <div className="button_title">
                                <span class="material-symbols-outlined button_icon">
                                  kitchen
                                </span>
                                All Kitchen - (4)
                                {/* <span class="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span class="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="kitchen_collapse"
                            class="accordion-collapse collapse"
                            aria-labelledby="kitchen"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div class="accordion-body">
                              <h6 className="mt-2 text-center">Kitchen 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="living">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#living_collapse"
                              aria-expanded="false"
                              aria-controls="living_collapse"
                            >
                              <div className="button_title">
                                <span class="material-symbols-outlined button_icon">
                                  chair
                                </span>
                                All Living - (4)
                                {/* <span class="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span class="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="living_collapse"
                            class="accordion-collapse collapse"
                            aria-labelledby="living"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div class="accordion-body">
                              <h6 className="mt-2 text-center">Living 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="living_dining">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#living_dining_collapse"
                              aria-expanded="false"
                              aria-controls="living_dining_collapse"
                            >
                              <div className="button_title">
                                <span class="material-symbols-outlined button_icon">
                                  dinner_dining
                                </span>
                                All Living & Dining - (4)
                                {/* <span class="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span class="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="living_dining_collapse"
                            class="accordion-collapse collapse"
                            aria-labelledby="living_dining"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div class="accordion-body">
                              <h6 className="mt-2 text-center">Living & Dining 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="gallery_passage">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#gallery_passage_collapse"
                              aria-expanded="false"
                              aria-controls="gallery_passage_collapse"
                            >
                              <div className="button_title">
                                <span class="material-symbols-outlined button_icon">
                                  gallery_thumbnail
                                </span>
                                Gallery & Passages - (4)
                                {/* <span class="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span class="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="gallery_passage_collapse"
                            class="accordion-collapse collapse"
                            aria-labelledby="gallery_passage"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div class="accordion-body">
                              <h6 className="mt-2 text-center">Gallery & Passage 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="bassment">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#bassment_collapse"
                              aria-expanded="false"
                              aria-controls="bassment_collapse"
                            >
                              <div className="button_title">
                                <span class="material-symbols-outlined button_icon">
                                  floor
                                </span>
                                Bassment - (4)
                                {/* <span class="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span class="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="bassment_collapse"
                            class="accordion-collapse collapse"
                            aria-labelledby="bassment"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div class="accordion-body">
                              <h6 className="mt-2 text-center">Basement 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="additional_room">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#additional_room_collapse"
                              aria-expanded="false"
                              aria-controls="additional_room_collapse"
                            >
                              <div className="button_title">
                                <span class="material-symbols-outlined button_icon">
                                  meeting_room
                                </span>
                                Additional Rooms - (4)
                                {/* <span class="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span class="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="additional_room_collapse"
                            class="accordion-collapse collapse"
                            aria-labelledby="additional_room"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div class="accordion-body">
                              <h6 className="mt-2 text-center">Additional Rooms 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Total Area</label>
                                    <div class="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div class="field_icon">
                                        <span class="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div class="form_field st-2">
                                    <label>width</label>
                                    <div className="field_two">
                                      <div class="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div class="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div class="field_icon">
                                          <div className="text_icon">
                                            in
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </TabPanel>
            <TabPanel className="more_about_property">
              <div className="map_inner">
                <div className="row no-gutters">
                  <div className="col-lg-6">
                    <div class="form_field st-2">
                      <label>Property Description</label>
                      <textarea></textarea>
                      <div class="field_icon">
                        <span class="material-symbols-outlined">
                          border_color
                        </span>
                      </div>

                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div class="form_field st-2">
                      <label>Owner Instruction</label>
                      <textarea></textarea>
                      <div class="field_icon">
                        <span class="material-symbols-outlined">
                          border_color
                        </span>
                      </div>

                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div class="form_field st-2">
                      <label>Key details / Key Handover</label>
                      <textarea></textarea>
                      <div class="field_icon">
                        <span class="material-symbols-outlined">
                          border_color
                        </span>
                      </div>

                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div class="form_field st-2">
                      <label>Bill Type Setting</label>
                      <textarea></textarea>
                      <div class="field_icon">
                        <span class="material-symbols-outlined">
                          border_color
                        </span>
                      </div>

                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div class="form_field st-2">
                      <label>Advertising</label>
                      <textarea></textarea>
                      <div class="field_icon">
                        <span class="material-symbols-outlined">
                          border_color
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </form>
      </div>
    </div >
  );
}
