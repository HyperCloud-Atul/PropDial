import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useCollection } from "../../../../hooks/useCollection";
import { useFirestore } from "../../../../hooks/useFirestore";
import { projectFirestore } from "../../../../firebase/config";
import { useDocument } from "../../../../hooks/useDocument";
import { useCommon } from "../../../../hooks/useCommon";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import { timestamp } from "../../../../firebase/config";
import ScrollToTop from "../../../../components/ScrollToTop";
import InactiveUserCard from "../../../../components/InactiveUserCard";
import AddAgent from "./AddAgent";
const UpdateAgent = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  // const { camelCase } = useCommon();
  // const {
  //   // addDocument: addAgentDoc,
  //   updateDocument: updateAgentDoc,
  //   // deleteDocument: deleteAgentDoc,
  //   error: addingError,
  // } = useFirestore("agent-propdial");

  // const [showAIForm, setShowAIForm] = useState(false);
  // const handleShowAIForm = () => setShowAIForm(!showAIForm);
  // const navigate = useNavigate();
  // const { documents: masterState, error: masterStateError } = useCollection(
  //   "m_states",
  //   "",
  //   ["state", "asc"]
  // );
  // const { documents: masterCity, error: masterCityError } = useCollection(
  //   "m_cities", "", ["city", "asc"]
  // );
  // const { documents: masterLocality, error: masterLocalityError } = useCollection(
  //   "m_localities", "", ["locality", "asc"]
  // );
  // const { documents: masterSociety, error: masterSocietyError } =
  //   useCollection("m_societies", "", ["society", "asc"]);

  // const { updateDocument, error: updateAgentDocError } =
  //   useFirestore("agent-propdial");

  // const { document: agentDoc, error: agentDocError } = useDocument(
  //   "agent-propdial",
  //   id
  // );
  // console.log("agentDoc: ", agentDoc)

  // const [state, setState] = useState();
  // const [city, setCity] = useState();
  // const [locality, setLocality] = useState();
  // const [society, setSociety] = useState();

  // let stateOptions = useRef([]);
  // let cityOptions = useRef([]);
  // let localityOptions = useRef([]);
  // let societyOptions = useRef([]);

  // const [searchList, setSearchList] = useState(null);
  // useEffect(() => {
  //   if (agentDoc) {
  //     // console.log("agentDoc: ", agentDoc)

  //     setAgentName(camelCase(agentDoc.agentName) || "");
  //     setAgentCompnayName(agentDoc.agentCompnayName || "");
  //     setAgentPhone(agentDoc.agentPhone || "");
  //     setAgentEmail(agentDoc.agentEmail || "");
  //     setAgentPancard(agentDoc.agentPancard || "");
  //     setAgentGstNumber(agentDoc.agentGstNumber || "");
  //     let _state = masterState.find(e => e.state === agentDoc.state)
  //     setState({
  //       label: _state.state || "",
  //       value: _state.id || ""
  //     });
  //     // console.log(_state)

  //     let _city = masterCity.find(e => e.city === agentDoc.city && e.state === _state.id)
  //     // console.log(_city)
  //     setCity({
  //       label: _city.city || "",
  //       value: _city.id || ""
  //     });
  //     setLocality(agentDoc.locality

  //     );
  //     setSociety(agentDoc.society);

  //     handleStateChange({
  //       label: _state.state || "",
  //       value: _state.id || ""
  //     }, {
  //       label: _city.city || "",
  //       value: _city.id || ""
  //     }, agentDoc.locality, agentDoc.society

  //     )

  //     handleCityChange({
  //       label: _city.city || "",
  //       value: _city.id || ""
  //     }, agentDoc.locality,
  //       agentDoc.society
  //     )

  //     // handleLocalityChange(agentDoc.locality)

  //   }
  // }, [agentDoc]);

  //Master Data Loading Initialisation - Start

  // useEffect(() => {
  //   // console.log('in useeffect')
  //   // Master data: State Populate
  //   if (masterState) {
  //     stateOptions.current = masterState.map((stateData) => ({
  //       label: stateData.state,
  //       value: stateData.id,
  //     }));
  //   }
  // }, [masterState]);

  // Populate Master Data - Start
  //State select onchange
  // const handleStateChange = async (option) => {
  // const handleStateChange = async (option, selectedCity, selectedLocality, selectedSociety) => {
  //   setState(option);

  //   if (option.label === agentDoc.state) {
  //     setLocality(agentDoc.locality);
  //     setSociety(agentDoc.society);
  //     let cityList = masterCity.filter(e => e.state === option.value)
  //     cityOptions.current = cityList && cityList.map((cityData) => ({
  //       label: cityData.city,
  //       value: cityData.id,
  //     }));
  //     let _city = masterCity.find(e => e.city === agentDoc.city && e.state === option.value)
  //     // console.log(_city)
  //     setCity({
  //       label: _city.city || "",
  //       value: _city.id || ""
  //     });
  //     handleCityChange({
  //       label: _city.city || "",
  //       value: _city.id || ""
  //     }, agentDoc.locality, agentDoc.society);
  //   } else {
  //     if (option) {
  //       console.log('state.id:', option, city)
  //       let cityList = masterCity.filter(e => e.state === option.value)
  //       cityOptions.current = cityList && cityList.map((cityData) => ({
  //         label: cityData.city,
  //         value: cityData.id,
  //       }));
  //       console.log('cityList', cityList, selectedCity)
  //       if (cityList && selectedCity && cityList.find(e => e.id === selectedCity.value)) {

  //       } else {
  //         console.log('cityList', cityList[0])
  //         setLocality([]);
  //         setSociety([])
  //         setCity({
  //           label: cityList[0].city,
  //           value: cityList[0].id
  //         })
  //         handleCityChange({
  //           label: cityList[0].city,
  //           value: cityList[0].id
  //         }, selectedLocality, selectedSociety);
  //       }

  //       // if (cityOptions.current.length === 0) {
  //       //   console.log("No City");
  //       //   handleCityChange(null);
  //       // } else {
  //       //   // handleCityChange({
  //       //   //   label: cityOptions.current[0].label,
  //       //   //   value: cityOptions.current[0].value,
  //       //   // });
  //       //   console.log('before handleCityChange', city)
  //       //   handleCityChange(city);
  //       // }
  //     }

  //   }

  // };

  //City select onchange
  // const handleCityChange = async (option) => {
  // const handleCityChange = async (option, selectedLocality, selectedSociety) => {
  //   setCity(option);
  //   let _selectedlocalty = selectedLocality;
  //   let _selectedSociety = selectedSociety;
  //   // console.log('city.id:', option)

  //   // console.log('city.id:', option, masterLocality, masterCity, selectedLocality, selectedSociety)
  //   if (option) {

  //     let _localitylist = masterLocality.filter(e => e.city === option.value);
  //     let _societylist = masterSociety.filter(e => e.city === option.value);
  //     // console.log('_localitylist', _localitylist)
  //     // console.log('_societylist', _societylist)
  //     if (selectedSociety && selectedSociety[0] && _societylist.find(e => e.id === selectedSociety[0].value)) {

  //     } else {
  //       _selectedlocalty = [];
  //       _selectedSociety = [];
  //       setLocality([]);
  //       setSociety([]);
  //     }
  //     if (option.label === agentDoc.city) {
  //       setLocality(agentDoc.locality);
  //       setSociety(agentDoc.society);
  //     }
  //     localityOptions.current = _localitylist.map((localityData) => ({
  //       label: localityData.locality,
  //       value: localityData.id,
  //     }));

  //     societyOptions.current = _societylist.map((societyData) => ({
  //       label: societyData.society + "; " + (masterLocality && masterLocality.find((e) => e.id === societyData.locality).locality),
  //       value: societyData.id,
  //     }));

  //     if (localityOptions.current.length === 0) {
  //       console.log("No Locality");
  //       // handleLocalityChange(null);
  //     } else {
  //       // handleLocalityChange({
  //       //   label: localityOptions.current[0].label,
  //       //   value: localityOptions.current[0].value,
  //       // });
  //     }
  //   } else {
  //     // handleLocalityChange(null);
  //     // setError('No such document exists')
  //   }
  // }

  //Locality select onchange
  // const handleLocalityChange = async (option) => {
  //   // setLocality(option);
  //   console.log('locality.id:', option)
  //   // console.log('selected city:', city)

  //   if (option) {

  //     const ref = await projectFirestore
  //       .collection("m_societies")
  //       .where("locality", "==", option.value)
  //       .orderBy("society", "asc");
  //     ref.onSnapshot(
  //       async (snapshot) => {
  //         if (snapshot.docs) {
  //           societyOptions.current = snapshot.docs.map((societyData) => ({
  //             label: societyData.data().society,
  //             value: societyData.id,
  //           }));

  //         }
  //       },
  //       (err) => {
  //         console.log(err.message);
  //         // setError('failed to get document')
  //       }
  //     );
  //   }
  // };

  //Society select onchange
  // const handleSocietyChange = async (option) => {
  //   setSociety(option);
  //   // option
  //   let _locality = []

  //   console.log('society.id:', option)
  //   option.forEach(element => {
  //     // let str = []
  //     // str = element.label.split('; ')
  //     let _societyObj = masterSociety.find(e => e.id === element.value)

  //     console.log(_societyObj)
  //     let _localityObj = masterLocality.find(e => e.id === _societyObj.locality)
  //     console.log('_localityObj', _localityObj)

  //     if (_locality.find(e => e.value === _localityObj.id)) {

  //       console.log('already present')
  //     } else {
  //       _locality.push({
  //         label: _localityObj.locality,
  //         value: _localityObj.id
  //       })
  //       console.log('not present')
  //     }
  //     console.log('_locality', _locality)
  //     setLocality(_locality)
  //   });
  // };
  // Populate Master Data - End

  // all useStates
  // const [isUploading, setIsUploading] = useState(false);
  // const [agentName, setAgentName] = useState("");
  // const [agentCompnayName, setAgentCompnayName] = useState("");
  // const [agentPhone, setAgentPhone] = useState("");
  // const [agentEmail, setAgentEmail] = useState("");
  // const [agentPancard, setAgentPancard] = useState("");
  // const [agentGstNumber, setAgentGstNumber] = useState("");
  // const [errors, setErrors] = useState({});

  // functions
  // const handleChangeAgentName = (e) => setAgentName(e.target.value);
  // const handleChangeAgentComanayName = (e) =>
  //   setAgentCompnayName(e.target.value);
  // const handleChangeAgentPhone = (value) => setAgentPhone(value);
  // const handleChangeAgentEmail = (e) => setAgentEmail(e.target.value);
  // const handleChangeAgentPancard = (e) => setAgentPancard(e.target.value);
  // const handleChangeAgentGstNumber = (e) => setAgentGstNumber(e.target.value);

  // Add additional state variables for tracking errors
  // const [errors, setErrors] = useState({
  //   agentName: "",
  //   agentPhone: "",
  //   // agentEmail: "",
  //   state: "",
  //   city: "",
  //   locality: "",
  //   society: "",
  // });

  // const someError = errors.agentName || errors.agentEmail;

  // Helper function to validate email format
  // const isValidEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  // Update the submit function to set error messages when fields are empty or invalid
  // const submitUpdatedAgent = async (e) => {
  //   e.preventDefault();

  //   const newErrors = {
  //     agentName: !agentName ? "Name is required" : "",
  //     agentPhone: !agentPhone ? "Phone number is required" : "",
  //     // agentEmail: !agentEmail
  //     //   ? "Email is required"
  //     //   : !isValidEmail(agentEmail)
  //     //     ? "Invalid email format"
  //     //     : "",
  //     state: !state ? "State is required" : "",
  //     city: !city ? "City is required" : "",
  //     locality: !locality ? "Locality is required" : "",
  //     // society: !society ? "Society is required" : "",
  //   };

  //   setErrors(newErrors);

  //   // Check if there are any errors
  //   const hasErrors = Object.values(newErrors).some((error) => error !== "");
  //   if (hasErrors) return;

  //   try {
  //     setIsUploading(true);

  //     const dataSet = {
  //       agentName,
  //       agentCompnayName,
  //       agentPhone,
  //       agentEmail,
  //       agentPancard: agentPancard.toUpperCase(),
  //       agentGstNumber: agentGstNumber.toUpperCase(),
  //       country: "India",
  //       state: state.label,
  //       city: city.label,
  //       locality: locality,
  //       society: society,
  //       status: "active",
  //     };

  //     console.log("dataSet: ", dataSet)

  //     const docRef = await addAgentDoc(dataSet);

  //     // Reset fields and errors after successful submission
  //     setAgentName("");
  //     setAgentCompnayName("");
  //     setAgentPhone("");
  //     setAgentEmail("");
  //     setAgentPancard("");
  //     setAgentGstNumber("");
  //     setState("");
  //     setLocality("");
  //     setCity("");
  //     // setSociety("");
  //     setErrors({});
  //     setIsUploading(false);
  //     setShowAIForm(!showAIForm);
  //   } catch (addingError) {
  //     console.error("Error adding document:", addingError);
  //     setIsUploading(false);
  //     setShowAIForm(!showAIForm);
  //   }
  // };

  // const submitUpdatedAgent = async () => {
  //   try {
  //     setIsUploading(true);

  //     // Log data before update
  //     const updatedAgentDoc = {
  //       agentName: camelCase(agentName),
  //       agentCompnayName,
  //       agentPhone,
  //       agentEmail,
  //       agentPancard: agentPancard.toUpperCase(),
  //       agentGstNumber: agentGstNumber.toUpperCase(),
  //       country: "India",
  //       state: state?.label || "",
  //       city: city?.label || "",
  //       locality: locality,
  //       society: society,
  //       status: "active",
  //       updatedAt: timestamp.fromDate(new Date()),
  //       updatedBy: user.uid,
  //     };
  //     // console.log('updatedAgentDoc', updatedAgentDoc, id)
  //     // Execute updateDocument
  //     const result = await updateDocument(id, updatedAgentDoc);
  //     console.log("Document update result:", result); // Check if update was successful

  //     setIsUploading(false);

  //     // Navigate if successful
  //     if (!updateAgentDocError) {
  //       navigate("/agents");
  //     }
  //   } catch (error) {
  //     console.error("Error updating document:", error);
  //     setIsUploading(false);
  //   }
  // };

  // const backViewAgents = () => {
  //   navigate("/agents");
  // };
  return (
    <div>
      <ScrollToTop />
      {user && user.status === "active" ? (
        <AddAgent
          // showAIForm={showAIForm}
          // setShowAIForm={setShowAIForm}
          // handleShowAIForm={handleShowAIForm}
          agentID={id}
        />
      ) : (
        // <div className="top_header_pg pg_bg pg_agent">
        //   <div className="page_spacing pg_min_height">
        //     <div className="pg_header d-flex justify-content-between">
        //       <div
        //         className="left d-flex align-items-center pointer"
        //         style={{
        //           gap: "5px",
        //         }}
        //       >
        //         <span
        //           className="material-symbols-outlined pointer"
        //           onClick={backViewAgents}
        //         >
        //           arrow_back
        //         </span>
        //         <h2 className="m22">Update Agent</h2>
        //       </div>
        //     </div>
        //     <hr />
        //     <form>
        //       <div className="vg12"></div>

        //       <div className="vg22"></div>

        //     </form>
        //   </div>
        // </div>
        <InactiveUserCard />
      )}
    </div>
  );
};

export default UpdateAgent;
