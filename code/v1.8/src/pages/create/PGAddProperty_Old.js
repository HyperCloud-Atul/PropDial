import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Select from 'react-select'

// styles
import "./PGUpdateProperty.css";

// component
import PropertySidebar from "../../Components/PropertySidebar";



export default function PGAddProperty_Old({ propertyid }) {
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

  const [category, setCategory] = useState("Residential"); //Residential/Commercial
  const [taggedOwner, setTaggedOwner] = useState([])
  const [taggedCoOwner, setTaggedCoOwner] = useState([])
  const [taggedPropertyManager, setTaggedPropertyManager] = useState([])

  // const { user } = useAuthContext()
  const [owners, setOwners] = useState([])
  const [coowners, setCoOwners] = useState([])
  const [propertymanagers, setPropertyManagers] = useState([])

  // const [propertyLocality, setpropertyLocality] = useState("");
  const [propertyDetails, setPropertyDetails] = useState({

    // All select type 
    PropertyPOC: '',
    PostedBy: '',
    Locality: '',
    City: '',
    Country: '',
    State: '',
    Society: '',
    PropertyType: '',
    YearOfConstruction: '',
    Bhk: '',
    Furnishing: '',

    NumberOfBedrooms: '',
    NumberOfBathrooms: '',
    NumberOfBalcony: '',
    NumberOfKitchen: '',

    DiningArea: '',
    LivingDining: '',

    NumberOfLivingArea: '',

    Passages: '',
    EntranceGallery: '',

    NumberOfBasement: '',

    AdditionalRooms: [],
    AdditionalArea: [],

    NumberOfAptOnFloor: '',
    NumberOfLifts: '',

    PowerBackup: '',

    NumberOfCarParking: '',
    TwoWheelerParking: '',

    // all input types text    
    AddressLocator: '',
    PinCode: '',
    UnitNumber: '',
    TotalFloor: '',
    FloorNo: '',

    // input type text + select 
    PlotArea: '',
    SuperArea: '',
    BuiltUpArea: '',
    CarpetArea: '',

    // More tab (menu) fields
    PropertyDesciption: '',
    OwnerInstruction: '',
    KeyDetailsHandover: '',
    BillTypeSetting: '',
    Advertising: '',

  });

  // const { documents: userList } = useCollection("users-propdial")
  const { documents: ownerList } = useCollection("users-propdial", ["role", "==", "owner"])
  const { documents: coownerList } = useCollection("users-propdial", ["role", "==", "coowner"])
  const { documents: propertymanagerList } = useCollection("users-propdial", ["role", "==", "manager"])

  const { document: property, error: propertyerror } = useDocument("properties-propdial", propertyid);
  const { updateDocument, updateResponse } = useFirestore("properties-propdial"); // Firestore collection name


  // set property document values into form
  useEffect(() => {
    // console.log('property id: ', propertyid);
    // console.log('ownerList : ', ownerList)
    if (ownerList) {
      setOwners(ownerList.map(user => {
        return { value: { ...user, id: user.id }, label: user.fullName + ' ( ' + user.phoneNumber + ' )' }
      }))
    }

    if (coownerList) {
      setCoOwners(coownerList.map(user => {
        return { value: { ...user, id: user.id }, label: user.fullName + ' ( ' + user.phoneNumber + ' )' }
      }))
    }

    if (propertymanagerList) {
      setPropertyManagers(propertymanagerList.map(user => {
        return { value: { ...user, id: user.id }, label: user.fullName + ' ( ' + user.phoneNumber + ' )' }
      }))
    }

    if (property) {
      // console.log('property: ', property);

      setCategory(property.category)

      if (property.category === 'Residential')
        setToggleFlag(false);
      else
        setToggleFlag(true)

      setCategory(property.category)

      setPropertyDetails({

        // All select type 
        PropertyPOC: property.propertyPOC ? property.propertyPOC : '',
        PostedBy: property.postedBy ? property.postedBy : '',
        // category: property.category ? property.category : 'Residential',
        Locality: property.locality ? property.locality : '',
        City: property.city ? property.city : '',
        Country: property.country ? property.country : '',
        State: property.state ? property.state : '',
        Society: property.society ? property.society : '',
        PropertyType: property.propertyType ? property.propertyType : '',
        YearOfConstruction: property.yearOfConstruction ? property.yearOfConstruction : '',
        Bhk: property.bhk ? property.bhk : '',

        LivingDining: property.livingdining ? property.livingdining : '',
        NumberOfBedrooms: property.numberOfBedrooms ? property.numberOfBedrooms : '',
        NumberOfBathrooms: property.numberOfBathrooms ? property.numberOfBathrooms : '',
        NumberOfBalcony: property.numberOfBalcony ? property.numberOfBalcony : '',
        NumberOfKitchen: property.numberOfKitchen ? property.numberOfKitchen : '',

        Furnishing: property.furnishing ? property.furnishing : '',
        DiningArea: property.diningarea ? property.diningarea : '',

        NumberOfLivingArea: property.numberOfLivingArea ? property.numberOfLivingArea : '',

        Passages: property.passages ? property.passages : '',
        EntranceGallery: property.entrancegallery ? property.entrancegallery : '',

        NumberOfBasement: property.numberOfBasement ? property.numberOfBasement : '',

        AdditionalRooms: property.additionalRooms ? property.additionalRooms : [],
        AdditionalArea: property.additionalArea ? property.additionalArea : [],

        NumberOfAptOnFloor: property.numberOfAptOnFloor ? property.numberOfAptOnFloor : '',
        NumberOfLifts: property.numberOfLifts ? property.numberOfLifts : '',

        PowerBackup: property.powerbackup ? property.powerbackup : '',

        NumberOfCarParking: property.numberOfCarParking ? property.numberOfCarParking : '',
        TwoWheelerParking: property.twowheelerparking ? property.twowheelerparking : '',

        // all input type text        
        AddressLocator: property.addressLocator ? property.addressLocator : '',
        PinCode: property.pinCode ? property.pinCode : '',
        UnitNumber: property.unitNumber ? property.unitNumber : '',
        TotalFloor: property.totalFloor ? property.totalFloor : '',
        FloorNo: property.floorNo ? property.floorNo : '',

        // input type text + select 
        PlotArea: property.plotArea ? property.plotArea : '',
        PlotAreaUnit: property.plotAreaUnit ? property.plotAreaUnit : 'SqFt',
        SuperArea: property.superArea ? property.superArea : '',
        SuperAreaUnit: property.superAreaUnit ? property.superAreaUnit : 'SqFt',
        BuiltUpArea: property.builtUpArea ? property.builtUpArea : '',
        BuiltUpAreaUnit: property.builtUpAreaUnit ? property.builtUpAreaUnit : 'SqFt',
        CarpetArea: property.carpetArea ? property.carpetArea : '',
        CarpetAreaUnit: property.carpetAreaUnit ? property.carpetAreaUnit : 'SqFt',

        // More tab (menu) fields
        PropertyDesciption: property.propertydesciption ? property.propertydesciption : '',
        OwnerInstruction: property.ownerinstruction ? property.ownerinstruction : '',
        KeyDetailsHandover: property.keydetailshandover ? property.keydetailshandover : '',
        BillTypeSetting: property.billtypesetting ? property.billtypesetting : '',
        Advertising: property.advertising ? property.advertising : '',

        ServentRoomClick: property.additionalRooms && property.additionalRooms.includes('Servent Room') ? true : false,
        OfficeRoomClick: property.additionalRooms && property.additionalRooms.includes('Office Room') ? true : false,
        StoreRoomClick: property.additionalRooms && property.additionalRooms.includes('Store Room') ? true : false,
        PoojaRoomClick: property.additionalRooms && property.additionalRooms.includes('Pooja Room') ? true : false,
        StudyRoomClick: property.additionalRooms && property.additionalRooms.includes('Study Room') ? true : false,
        PowerRoomClick: property.additionalRooms && property.additionalRooms.includes('Power Room') ? true : false,

        FrontYardClick: property.additionalArea && property.additionalArea.includes('Front Yard') ? true : false,
        BackYardClick: property.additionalArea && property.additionalArea.includes('Back Yard') ? true : false,
        TerraceClick: property.additionalArea && property.additionalArea.includes('Terrace') ? true : false,
        GardenClick: property.additionalArea && property.additionalArea.includes('Garden') ? true : false,
        GarageClick: property.additionalArea && property.additionalArea.includes('Garage') ? true : false,

      })

    }
  }, [property, ownerList, coownerList, propertymanagerList])

  const saveData = async (e) => {
    e.preventDefault();

    // console.log('save updated for property details: ', propertyDetails)

    // Create a property object
    let updatedProperty = {

      // All select type
      propertyPOC: propertyDetails.PropertyPOC ? propertyDetails.PropertyPOC : '',
      postedBy: propertyDetails.PostedBy ? propertyDetails.PostedBy : '',
      category,
      // ownerDetails,
      // coownerDetails,
      locality: propertyDetails.Locality ? propertyDetails.Locality : '',
      country: propertyDetails.Country ? propertyDetails.Country : '',
      state: propertyDetails.State ? propertyDetails.State : '',
      city: propertyDetails.City ? propertyDetails.City : '',
      society: propertyDetails.Society ? propertyDetails.Society : '',
      propertyType: propertyDetails.PropertyType ? propertyDetails.PropertyType : '',
      yearOfConstruction: propertyDetails.YearOfConstruction ? propertyDetails.YearOfConstruction : '',
      bhk: propertyDetails.Bhk ? propertyDetails.Bhk : '',
      furnishing: propertyDetails.Furnishing ? propertyDetails.Furnishing : '',

      numberOfBedrooms: propertyDetails.NumberOfBedrooms ? propertyDetails.NumberOfBedrooms : '1',
      numberOfBathrooms: propertyDetails.NumberOfBathrooms ? propertyDetails.NumberOfBathrooms : '',
      numberOfBalcony: propertyDetails.NumberOfBalcony ? propertyDetails.NumberOfBalcony : '',
      numberOfKitchen: propertyDetails.NumberOfKitchen ? propertyDetails.NumberOfKitchen : '',

      diningarea: propertyDetails.DiningArea ? propertyDetails.DiningArea : '',
      livingdining: propertyDetails.LivingDining ? propertyDetails.LivingDining : '',

      numberOfLivingArea: propertyDetails.NumberOfLivingArea ? propertyDetails.NumberOfLivingArea : '',

      passages: propertyDetails.Passages ? propertyDetails.Passages : '',
      entrancegallery: propertyDetails.EntranceGallery ? propertyDetails.EntranceGallery : '',

      numberOfBasement: propertyDetails.NumberOfBasement ? propertyDetails.NumberOfBasement : '',

      additionalRooms: propertyDetails.AdditionalRooms ? propertyDetails.AdditionalRooms : [],
      additionalArea: propertyDetails.AdditionalArea ? propertyDetails.AdditionalArea : [],

      numberOfAptOnFloor: propertyDetails.NumberOfAptOnFloor ? propertyDetails.NumberOfAptOnFloor : '',
      numberOfLifts: propertyDetails.NumberOfLifts ? propertyDetails.NumberOfLifts : '',

      powerbackup: propertyDetails.PowerBackup ? propertyDetails.PowerBackup : '',

      numberOfCarParking: propertyDetails.NumberOfCarParking ? propertyDetails.NumberOfCarParking : '',
      twowheelerparking: propertyDetails.TwoWheelerParking ? propertyDetails.TwoWheelerParking : '',

      // All input type text       
      addressLocator: propertyDetails.AddressLocator ? propertyDetails.AddressLocator : '',
      pinCode: propertyDetails.PinCode ? propertyDetails.PinCode : '',
      unitNumber: propertyDetails.UnitNumber ? propertyDetails.UnitNumber : '',
      totalFloor: propertyDetails.TotalFloor ? propertyDetails.TotalFloor : '',
      floorNo: propertyDetails.FloorNo ? propertyDetails.FloorNo : '',


      // input type text + select 
      plotArea: propertyDetails.PlotArea ? propertyDetails.PlotArea : '',
      plotAreaUnit: propertyDetails.PlotAreaUnit ? propertyDetails.PlotAreaUnit : 'SqFt',
      superArea: propertyDetails.SuperArea ? propertyDetails.SuperArea : '',
      superAreaUnit: propertyDetails.SuperAreaUnit ? propertyDetails.SuperAreaUnit : 'SqFt',
      builtUpArea: propertyDetails.BuiltUpArea ? propertyDetails.BuiltUpArea : '',
      builtUpAreaUnit: propertyDetails.BuiltUpAreaUnit ? propertyDetails.BuiltUpAreaUnit : 'SqFt',
      carpetArea: propertyDetails.CarpetArea ? propertyDetails.CarpetArea : '',
      carpetAreaUnit: propertyDetails.CarpetAreaUnit ? propertyDetails.CarpetAreaUnit : 'SqFt',


      // More tab (menu) fields
      propertydesciption: propertyDetails.PropertyDesciption ? propertyDetails.PropertyDesciption : '',
      ownerinstruction: propertyDetails.OwnerInstruction ? propertyDetails.OwnerInstruction : '',
      keydetailshandover: propertyDetails.KeyDetailsHandover ? propertyDetails.KeyDetailsHandover : '',
      billtypesetting: propertyDetails.BillTypeSetting ? propertyDetails.BillTypeSetting : '',
      advertising: propertyDetails.Advertising ? propertyDetails.Advertising : '',

    };

    // console.log('tagged Owner details:', taggedOwner)
    // console.log('tagged Owner Length:', taggedOwner.length)
    let ownerDetails = '';
    if (taggedOwner && taggedOwner.length !== 0) {
      console.log('tagged Owner details:', taggedOwner)
      ownerDetails = {
        id: taggedOwner.value.id,
        displayName: taggedOwner.value.fullName,
        phoneNumber: taggedOwner.value.phoneNumber,
        emailID: taggedOwner.value.email,
        photoURL: taggedOwner.value.photoURL,
        role: taggedOwner.value.role
      }

      updatedProperty = { ...updatedProperty, ownerDetails }
    }

    let coownerDetails = '';
    if (taggedCoOwner && taggedCoOwner.length !== 0) {
      console.log('tagged Owner details:', taggedCoOwner)
      coownerDetails = {
        id: taggedCoOwner.value.id,
        displayName: taggedCoOwner.value.fullName,
        phoneNumber: taggedCoOwner.value.phoneNumber,
        emailID: taggedCoOwner.value.email,
        photoURL: taggedCoOwner.value.photoURL,
        role: taggedCoOwner.value.role
      }

      updatedProperty = { ...updatedProperty, coownerDetails }
    }

    let propertymanagerDetails = '';
    if (taggedPropertyManager && taggedPropertyManager.length !== 0) {
      console.log('tagged Owner details:', taggedPropertyManager)
      propertymanagerDetails = {
        id: taggedPropertyManager.value.id,
        displayName: taggedPropertyManager.value.fullName,
        phoneNumber: taggedPropertyManager.value.phoneNumber,
        emailID: taggedPropertyManager.value.email,
        photoURL: taggedPropertyManager.value.photoURL,
        role: taggedPropertyManager.value.role
      }

      updatedProperty = { ...updatedProperty, propertymanagerDetails }
    }

    console.log("saveData updated property: ", updatedProperty)
    // Store the property data in Firestore
    // await addDocument(property);

    await updateDocument(propertyid, updatedProperty);

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
    if (toggleFlag) setCategory("Residential");
    else setCategory("Commercial");
    setToggleFlag(!toggleFlag);
  };

  const ownerListSorted = owners.sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  const coownerListSorted = coowners.sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const propertyManagerListSorted = propertymanagers.sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  return (
    <div className="dashboard_pg aflbg property_setup">
      <div className="sidebarwidth">
        {/* <PropertySidebar ({propertyid}) /> */}
        {propertyid && <PropertySidebar propertyid={propertyid} />}
      </div>
      <div className="right_main_content">
        <div className="property-detail">
          <div className="accordion" id="a1accordion_section">
            <div className="accordion-item">
              <h2 className="accordion-header" id="a1headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#a1collapseOne"
                  aria-expanded="true"
                  aria-controls="a1collapseOne"
                >
                  <div className="inner">
                    <div className="left">
                      <h5>{property && property.unitNumber} - {property && property.society}</h5>
                      <h6>
                        {property && property.locality}, {property && property.city}
                        <br />
                        {property && property.state}, {property && property.country}
                      </h6>
                    </div>
                    <div className="right">
                      {property && property.ownerDetails &&
                        <div>
                          <h5>
                            {property.ownerDetails.role === 'owner' ? property.ownerDetails.displayName : 'No Owner Assigned'}
                          </h5>
                          <h6>
                            {property.ownerDetails.role === 'owner' ? property.ownerDetails.phoneNumber : 'No Phone Number'}
                          </h6>

                        </div>
                      }
                    </div>
                  </div>
                </button>
              </h2>
              <div
                id="a1collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="a1headingOne"
                data-bs-parent="#a1accordion_section"
              >
                <div className="accordion-body">
                  <div className="secondary-details-display">
                    <div className="secondary-details-inside-display">
                      {property && property.ownerDetails &&
                        <div>
                          <h5 style={{ textAlign: "center" }}>
                            {property.ownerDetails.role === 'owner' ? property.ownerDetails.displayName : 'No Owner Assigned'}
                          </h5>
                        </div>
                      }
                      <div
                        className="property-contact-div property-media-icons-horizontal"
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        {property && property.ownerDetails &&
                          <a href={'Tel: +91' + property.ownerDetails.phoneNumber}>
                            <div>
                              <span className="material-symbols-outlined">call</span>
                              <h1>Call</h1>
                            </div>
                          </a>
                        }

                        {property && property.ownerDetails &&
                          <a href={'https://wa.me/+91' + property.ownerDetails.phoneNumber}>
                            <div>
                              <img
                                src="/assets/img/whatsapp_square_icon.png"
                                alt="propdial"
                              />
                              <h1>WhatsApp</h1>
                            </div>
                          </a>
                        }
                        {property && property.ownerDetails &&
                          <a href={'mailto:' + property.ownerDetails.emailID}>
                            <div>
                              <span className="material-symbols-outlined">
                                alternate_email
                              </span>
                              <h1>Mail</h1>
                            </div>
                          </a>
                        }
                      </div>
                    </div>
                    <hr className="secondary-details-hr" />
                    <div style={{ width: "100%" }}>
                      {property && property.coownerDetails &&
                        <div>
                          <h5 style={{ textAlign: "center" }}>
                            {property.coownerDetails.role === 'coowner' ? property.coownerDetails.displayName : 'No Co-Owner Assigned'}
                          </h5>
                        </div>
                      }
                      <div
                        className="property-contact-div property-media-icons-horizontal"
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        {property && property.coownerDetails &&
                          <a href={'Tel: +91' + property.coownerDetails.phoneNumber}>
                            <div>
                              <span className="material-symbols-outlined">call</span>
                              <h1>Call</h1>
                            </div>
                          </a>
                        }
                        {property && property.coownerDetails &&
                          <a href={'https://wa.me/+91' + property.coownerDetails.phoneNumber}>
                            <div>
                              <img src="/assets/img/whatsapp_square_icon.png" alt="propdial" />
                              <h1>WhatsApp</h1>
                            </div>
                          </a>
                        }
                        {property && property.coownerDetails &&
                          <a href={'mailto: ' + property.coownerDetails.emailID}>
                            <div>
                              <span className="material-symbols-outlined">
                                alternate_email
                              </span>
                              <h1>Mail</h1>
                            </div>
                          </a>
                        }
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
                <span className="material-symbols-outlined btn_arrow ba_animation" style={{ top: '5px' }}>arrow_forward</span>
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
                      <label>Owner: </label>
                      {property && property.ownerDetails &&
                        <>
                          <span style={{ fontWeight: "normal", fontSize: 14 }}>
                            {property.ownerDetails.role === 'owner' ? " " + property.ownerDetails.displayName : ' Not Assigned'} (
                            {property.ownerDetails.role === 'owner' ? property.ownerDetails.phoneNumber : ''} )
                          </span>
                        </>
                      }
                      <div className="field_inner select">
                        <Select className=''
                          onChange={(option) => setTaggedOwner(option)}
                          options={ownerListSorted}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              outline: 'none',
                              background: '#efefef',
                              border: 'none',
                              borderBottom: 'none',
                              position: "relative",
                              zIndex: "99"
                            }),
                          }}
                        // isMulti
                        />

                        <div className="field_icon">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Co-Owner</label>
                      {property && property.coownerDetails &&
                        <>
                          <span style={{ fontWeight: "normal", fontSize: 14 }}>
                            {property.coownerDetails.role === 'coowner' ? " " + property.coownerDetails.displayName : ' Not Assigned'} (
                            {property.coownerDetails.role === 'coowner' ? property.coownerDetails.phoneNumber : ''} )
                          </span>
                        </>
                      }
                      <div className="field_inner select">
                        <Select className=''
                          onChange={(option) => setTaggedCoOwner(option)}
                          options={coownerListSorted}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              outline: 'none',
                              background: '#efefef',
                              border: 'none',
                              borderBottom: 'none',
                              position: "relative",
                              zIndex: "99"
                            }),
                          }}
                        // isMulti
                        />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">group</span>
                        </div>
                      </div>
                    </div>

                    <div className="form_field st-2">
                      <label>Property POC (Name-Mobile)</label>
                      <div className="field_inner">
                        <input type="text" placeholder="Enter POC Name & Mobile Number"
                          onChange={(e) => setPropertyDetails({
                            ...propertyDetails,
                            PropertyPOC: e.target.value
                          })}
                          value={propertyDetails && propertyDetails.PropertyPOC} />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            drive_file_rename_outline
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form_field st-2">
                      <label>Property Manager</label>
                      {property && property.propertymanagerDetails &&
                        <>
                          <span style={{ fontWeight: "normal", fontSize: 14 }}>
                            {property.propertymanagerDetails.role === 'propertymanager' ? " " + property.propertymanagerDetails.displayName : ' Not Assigned'} (
                            {property.propertymanagerDetails.role === 'propertymanager' ? property.propertymanagerDetails.phoneNumber : ''} )
                          </span>
                        </>
                      }
                      <div className="field_inner select">
                        <Select className=''
                          onChange={(option) => setTaggedPropertyManager(option)}
                          options={propertyManagerListSorted}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              outline: 'none',
                              background: '#efefef',
                              border: 'none',
                              borderBottom: 'none',
                              position: "relative",
                              zIndex: "99"
                            }),
                          }}
                        // isMulti
                        />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">group</span>
                        </div>
                      </div>
                    </div>


                    <div className="form_field st-2">
                      <label>Posted By</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${propertyDetails && propertyDetails.PostedBy === 'Propdial'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="postedBy_propdial"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  PostedBy: 'Propdial'
                                })
                              }}
                            />
                            <label htmlFor="postedBy_propdial">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Propdial</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">

                          <div
                            className={`custom_radio_button ${propertyDetails && propertyDetails.PostedBy === 'Agent'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="postedBy_agent"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  PostedBy: 'Agent'
                                })
                              }}

                            />
                            <label htmlFor="postedBy_agent">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Agent</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form_field st-2">
                      <label>Address Locator</label>
                      <div className="field_inner">
                        <input
                          type="text"
                          placeholder="Enter Property Unit Number"
                          onChange={(e) => setPropertyDetails({
                            ...propertyDetails,
                            AddressLocator: e.target.value
                          })}
                          value={propertyDetails && propertyDetails.AddressLocator}
                        />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">map</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Country</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.Country}
                          onChange={(e) => {
                            // console.log('e', e.target.text, e.target, e.target.value)
                            // console.log('propertyLocality', propertyLocality)
                            // setpropertyLocality(e.target.value)
                            setPropertyDetails({
                              ...propertyDetails,
                              Country: e.target.value
                            })
                          }}>
                          <option selected={propertyDetails && propertyDetails.Country === 'India' ? true : false}>
                            India
                          </option>
                          <option selected={propertyDetails && propertyDetails.Country === 'USA' ? true : false} >USA</option>
                          <option selected={propertyDetails && propertyDetails.Country === 'UK' ? true : false}>UK</option>
                          <option selected={propertyDetails && propertyDetails.Country === 'Denmark' ? true : false}>Denmark</option>
                          <option selected={propertyDetails && propertyDetails.Country === 'Malasia' ? true : false}>Malasia</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">public</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>State</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.State}
                          onChange={(e) => {
                            // console.log('e', e.target.text, e.target, e.target.value)
                            // console.log('propertyLocality', propertyLocality)
                            // setpropertyLocality(e.target.value)
                            setPropertyDetails({
                              ...propertyDetails,
                              State: e.target.value
                            })
                          }}>
                          <option selected={propertyDetails && propertyDetails.State === 'Madhya Pradesh' ? true : false}>
                            Madhya Pradesh
                          </option>
                          <option selected={propertyDetails && propertyDetails.State === 'Maharastra' ? true : false} >Maharastra</option>
                          <option selected={propertyDetails && propertyDetails.State === 'Haryana' ? true : false}>Haryana</option>
                          <option selected={propertyDetails && propertyDetails.State === 'Uttar Pradesh' ? true : false}>Uttar Pradesh</option>
                          <option selected={propertyDetails && propertyDetails.State === 'Kerala' ? true : false}>Kerala</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            emoji_transportation
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>City</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.City}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              City: e.target.value
                            })
                          }}>
                          <option selected={propertyDetails && propertyDetails.City === 'Ujjain' ? true : false}>
                            Ujjain
                          </option>
                          <option selected={propertyDetails && propertyDetails.City === 'Indore' ? true : false} >Indore</option>
                          <option selected={propertyDetails && propertyDetails.City === 'Bhopal' ? true : false}>Bhopal</option>
                          <option selected={propertyDetails && propertyDetails.City === 'Delhi' ? true : false}>Delhi</option>
                          <option selected={propertyDetails && propertyDetails.City === 'Gwalior' ? true : false}>Gwalior</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">apartment</span>
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
                          <span className="material-symbols-outlined">
                            holiday_village
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Pin Code</label>
                      <div className="field_inner">
                        <input type="number" placeholder="Enter Pin Code"
                          onChange={(e) => setPropertyDetails({
                            ...propertyDetails,
                            PinCode: e.target.value
                          })}
                          value={propertyDetails && propertyDetails.PinCode} />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            drive_file_rename_outline
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Society</label>
                      <div className="field_inner select">

                        <select value={propertyDetails && propertyDetails.Society}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Society: e.target.value
                            })
                          }}>
                          <option selected={propertyDetails && propertyDetails.Society === 'Society 1' ? true : false}>
                            Society 1
                          </option>
                          <option selected={propertyDetails && propertyDetails.Society === 'Society 2' ? true : false} >Society 2</option>
                          <option selected={propertyDetails && propertyDetails.Society === 'Society 3' ? true : false}>Society 3</option>
                          <option selected={propertyDetails && propertyDetails.Society === 'Society 4' ? true : false}>Society 4</option>
                          <option selected={propertyDetails && propertyDetails.Society === 'Society 5' ? true : false}>Society 5</option>
                        </select>

                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            holiday_village
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Unit Number</label>
                      <div className="field_inner">
                        <input
                          required
                          type="text"
                          placeholder="Enter Property Unit Number"
                          onChange={(e) => setPropertyDetails({
                            ...propertyDetails,
                            UnitNumber: e.target.value
                          })}
                          value={propertyDetails && propertyDetails.UnitNumber}
                        />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            drive_file_rename_outline
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Property Type</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.PropertyType}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              PropertyType: e.target.value
                            })
                          }}>
                          <option selected disabled>
                            Choose Property Type
                          </option>
                          <option selected={propertyDetails && propertyDetails.PropertyType === 'High Rise Apt' ? true : false}>High Rise Apt</option>
                          <option selected={propertyDetails && propertyDetails.PropertyType === 'Low Rise Apt' ? true : false}>Low Rise Apt</option>
                          <option selected={propertyDetails && propertyDetails.PropertyType === 'Builder Floor' ? true : false}>Builder Floor</option>
                          <option selected={propertyDetails && propertyDetails.PropertyType === 'Kothi' ? true : false}>Kothi</option>
                          <option selected={propertyDetails && propertyDetails.PropertyType === 'Villa - Simplex' ? true : false}>Villa - Simplex</option>
                          <option selected={propertyDetails && propertyDetails.PropertyType === 'Villa - Duplex' ? true : false}>Villa - Duplex</option>
                          <option selected={propertyDetails && propertyDetails.PropertyType === 'Row House - Simplex' ? true : false}>Row House - Simplex</option>
                          <option selected={propertyDetails && propertyDetails.PropertyType === 'Row House - Duplex' ? true : false}>Row House - Duplex</option>
                          <option selected={propertyDetails && propertyDetails.PropertyType === 'Pent House - Simplex' ? true : false}>Pent House - Simplex</option>
                          <option selected={propertyDetails && propertyDetails.PropertyType === 'Pent House - Duplex' ? true : false}>Pent House - Duplex</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            format_list_bulleted
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Year of Constuction</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.YearOfConstruction}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              YearOfConstruction: e.target.value
                            })
                          }}>
                          <option value="" disabled>
                            Year of Constuction
                          </option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '1990' ? true : false}>1990</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '1991' ? true : false}>1991</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '1992' ? true : false}>1992</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '1993' ? true : false}>1993</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '1994' ? true : false}>1994</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '1995' ? true : false}>1995</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '1996' ? true : false}>1996</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '1997' ? true : false}>1997</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '1998' ? true : false}>1998</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '1999' ? true : false}>1999</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2000' ? true : false}>2000</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2001' ? true : false}>2001</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2002' ? true : false}>2002</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2019' ? true : false}>2003</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2004' ? true : false}>2004</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2005' ? true : false}>2005</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2006' ? true : false}>2006</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2007' ? true : false}>2007</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2008' ? true : false}>2008</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2009' ? true : false}>2009</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2010' ? true : false}>
                            2010
                          </option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2011' ? true : false}>2011</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2012' ? true : false}>2012</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2013' ? true : false}>2013</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2014' ? true : false}>2014</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2015' ? true : false}>2015</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2016' ? true : false}>2016</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2017' ? true : false}>2017</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2018' ? true : false}>2018</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2019' ? true : false}>2019</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2020' ? true : false}>2020</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2021' ? true : false}>2021</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2022' ? true : false}>2022</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2023' ? true : false}>2023</option>
                          <option selected={propertyDetails && propertyDetails.YearOfConstruction === '2024' ? true : false}>2024</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
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
                        <select value={propertyDetails && propertyDetails.Bhk}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              Bhk: e.target.value
                            })
                          }}>
                          <option value="" selected disabled>
                            Choose BHK
                          </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === 'EWS' ? true : false}>EWS</option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '1 RK' ? true : false}>1 RK</option>
                          <option selected={propertyDetails && propertyDetails.Bhk === 'Studio' ? true : false}>Studio</option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '1 ' ? true : false}>1 BHK</option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '1.5 ' ? true : false}>1.5 BHK </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '2 ' ? true : false}>2 BHK </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '2.5 ' ? true : false}>2.5 BHK </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '3 ' ? true : false}>3 BHK </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '3.5 ' ? true : false}>3.5 BHK </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '4 ' ? true : false}>4 BHK </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '5 ' ? true : false}>5 BHK </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '6 ' ? true : false}>6 BHK </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '7 ' ? true : false}>7 BHK </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '8 ' ? true : false}>8 BHK </option>
                          <option selected={propertyDetails && propertyDetails.Bhk === '9+ ' ? true : false}>9+ BHK </option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === 'Semi'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="semi_furnished"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Furnishing: 'Semi'
                                })
                              }}
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === 'Fully'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="fully_furnished"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Furnishing: 'Fully'
                                })
                              }}

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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === 'Raw'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="raw_furnished"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Furnishing: 'Raw'
                                })
                              }}
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
                        <select value={propertyDetails && propertyDetails.NumberOfBedrooms}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              NumberOfBedrooms: e.target.value
                            })
                          }}>
                          <option value="" selected disabled>
                            Number Of Bedrooms
                          </option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '0' ? true : false}>0</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '1' ? true : false}>1</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '2' ? true : false}>2</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '3' ? true : false}>3</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '4' ? true : false}>4</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '5' ? true : false}>5</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '6' ? true : false}>6</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '7' ? true : false}>7</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '8' ? true : false}>8</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '9' ? true : false}>9</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBedrooms === '10' ? true : false}>10</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">bed</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Bathrooms</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.NumberOfBathrooms}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              NumberOfBathrooms: e.target.value
                            })
                          }}>
                          <option value="" selected disabled>
                            Number Of Bathrooms
                          </option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '0' ? true : false}>0</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '1' ? true : false}>1</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '2' ? true : false}>2</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '3' ? true : false}>3</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '4' ? true : false}>4</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '5' ? true : false}>5</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '6' ? true : false}>6</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '7' ? true : false}>7</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '8' ? true : false}>8</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '9' ? true : false}>9</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '10' ? true : false}>10</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">bathtub</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Balcony</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.NumberOfBalcony}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              NumberOfBalcony: e.target.value
                            })
                          }}>
                          <option value="" selected disabled>
                            Number Of Balcony
                          </option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '0' ? true : false}>0</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '1' ? true : false}>1</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '2' ? true : false}>2</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '3' ? true : false}>3</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '4' ? true : false}>4</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '5' ? true : false}>5</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '6' ? true : false}>6</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '7' ? true : false}>7</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '8' ? true : false}>8</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '9' ? true : false}>9</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBalcony === '10' ? true : false}>10</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">balcony</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Kitchen</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.NumberOfKitchen}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              NumberOfKitchen: e.target.value
                            })
                          }}>
                          <option value="" disabled>
                            Number Of Kitchen
                          </option>
                          <option selected={propertyDetails && propertyDetails.NumberOfKitchen === '0' ? true : false}>0</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfKitchen === '1' ? true : false}>1</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfKitchen === '2' ? true : false}>2</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfKitchen === '3' ? true : false}>3</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.DiningArea === 'Yes'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_yes"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  DiningArea: 'Yes'
                                })
                              }}
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.DiningArea === 'No'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="dining_no"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  DiningArea: 'No'
                                })
                              }}
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.LivingDining === 'Yes'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="living_dining_yes"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  LivingDining: 'Yes'
                                })
                              }}
                            />
                            <label htmlFor="living_dining_yes">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.LivingDining === 'No'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="living_dining_no"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  LivingDining: 'No'
                                })
                              }}
                            />
                            <label htmlFor="living_dining_no">
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
                        <select value={propertyDetails && propertyDetails.NumberOfLivingArea}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              NumberOfLivingArea: e.target.value
                            })
                          }}>
                          <option value="" disabled>
                            Number Of Living Area
                          </option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLivingArea === '0' ? true : false}>0</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLivingArea === '1' ? true : false}>1</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLivingArea === '2' ? true : false}>2</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLivingArea === '3' ? true : false}>3</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLivingArea === '4' ? true : false}>4</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLivingArea === '5' ? true : false}>5</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">living</span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Passages</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={`custom_radio_button ${propertyDetails && propertyDetails.Passages === 'Yes'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="passage_yes"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Passages: 'Yes'
                                })
                              }}
                            />
                            <label htmlFor="passage_yes">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.Passages === 'No'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="passage_no"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  Passages: 'No'
                                })
                              }}
                            />
                            <label htmlFor="passage_no">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.EntranceGallery === 'Yes'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="entrancegallery_yes"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  EntranceGallery: 'Yes'
                                })
                              }}
                            />
                            <label htmlFor="entrancegallery_yes">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.EntranceGallery === 'No'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="entrancegallery_no"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  EntranceGallery: 'No'
                                })
                              }}
                            />
                            <label htmlFor="entrancegallery_no">
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
                        <select value={propertyDetails && propertyDetails.NumberOfBasement}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              NumberOfBasement: e.target.value
                            })
                          }}>
                          <option value="" disabled>
                            Number Of Basement
                          </option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBasement === '0' ? true : false}>0</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfBasement === '1' ? true : false}>1</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            foundation
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Additional Rooms - ( {propertyDetails.AdditionalRooms.length} )</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div className={propertyDetails.ServentRoomClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}>

                            <input
                              type="checkbox"
                              id="servent_room"
                              onClick={(e) => {
                                if (propertyDetails.ServentRoomClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: propertyDetails.AdditionalRooms && propertyDetails.AdditionalRooms.filter(elem => elem !== 'Servent Room'),
                                    ServentRoomClick: !propertyDetails.ServentRoomClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: [...propertyDetails.AdditionalRooms, 'Servent Room'],
                                    ServentRoomClick: !propertyDetails.ServentRoomClick
                                  });

                                }

                              }}
                            />
                            <label htmlFor="servent_room">
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
                            className={propertyDetails.OfficeRoomClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}
                          >
                            <input
                              type="checkbox"
                              id="office_room"
                              onClick={(e) => {
                                if (propertyDetails.OfficeRoomClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: propertyDetails.AdditionalRooms && propertyDetails.AdditionalRooms.filter(elem => elem !== 'Office Room'),
                                    OfficeRoomClick: !propertyDetails.OfficeRoomClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: [...propertyDetails.AdditionalRooms, 'Office Room'],
                                    OfficeRoomClick: !propertyDetails.OfficeRoomClick
                                  });

                                }

                              }}
                            />
                            <label htmlFor="office_room">
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
                            className={propertyDetails.StoreRoomClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}
                          >
                            <input
                              type="checkbox"
                              id="store_room"
                              onClick={(e) => {
                                if (propertyDetails.StoreRoomClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: propertyDetails.AdditionalRooms && propertyDetails.AdditionalRooms.filter(elem => elem !== 'Store Room'),
                                    StoreRoomClick: !propertyDetails.StoreRoomClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: [...propertyDetails.AdditionalRooms, 'Store Room'],
                                    StoreRoomClick: !propertyDetails.StoreRoomClick
                                  });
                                }
                              }
                              }
                            />
                            <label htmlFor="store_room">
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
                            className={propertyDetails.PoojaRoomClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}
                          >
                            <input
                              type="checkbox"
                              id="pooja_room"
                              onClick={(e) => {
                                if (propertyDetails.PoojaRoomClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: propertyDetails.AdditionalRooms && propertyDetails.AdditionalRooms.filter(elem => elem !== 'Pooja Room'),
                                    PoojaRoomClick: !propertyDetails.PoojaRoomClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: [...propertyDetails.AdditionalRooms, 'Pooja Room'],
                                    PoojaRoomClick: !propertyDetails.PoojaRoomClick
                                  });
                                }
                              }}

                            />
                            <label htmlFor="pooja_room">
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
                            className={propertyDetails.StudyRoomClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}
                          >
                            <input
                              type="checkbox"
                              id="study_room"
                              onClick={(e) => {
                                if (propertyDetails.StudyRoomClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: propertyDetails.AdditionalRooms && propertyDetails.AdditionalRooms.filter(elem => elem !== 'Study Room'),
                                    StudyRoomClick: !propertyDetails.StudyRoomClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: [...propertyDetails.AdditionalRooms, 'Study Room'],
                                    StudyRoomClick: !propertyDetails.StudyRoomClick
                                  });
                                }
                              }}

                            />
                            <label htmlFor="study_room">
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
                            className={propertyDetails.PowerRoomClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}
                          >
                            <input
                              type="checkbox"
                              id="power_room"
                              onClick={(e) => {
                                if (propertyDetails.PowerRoomClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: propertyDetails.AdditionalRooms && propertyDetails.AdditionalRooms.filter(elem => elem !== 'Power Room'),
                                    PowerRoomClick: !propertyDetails.PowerRoomClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalRooms: [...propertyDetails.AdditionalRooms, 'Power Room'],
                                    PowerRoomClick: !propertyDetails.PowerRoomClick
                                  });
                                }
                              }}
                            />
                            <label htmlFor="power_room">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6> Power Room</h6>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Additional Area - ( {propertyDetails.AdditionalArea.length} )</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className={propertyDetails.FrontYardClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}
                          >
                            <input
                              type="radio"
                              id="front_yard"
                              onClick={(e) => {
                                if (propertyDetails.FrontYardClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalArea: propertyDetails.AdditionalArea && propertyDetails.AdditionalArea.filter(elem => elem !== 'Front Yard'),
                                    FrontYardClick: !propertyDetails.FrontYardClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalArea: [...propertyDetails.AdditionalArea, 'Front Yard'],
                                    FrontYardClick: !propertyDetails.FrontYardClick
                                  });
                                }
                              }}
                            />
                            <label htmlFor="front_yard">
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
                            className={propertyDetails.BackYardClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}
                          >
                            <input
                              type="radio"
                              id="back_yard"
                              onClick={(e) => {
                                if (propertyDetails.BackYardClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalArea: propertyDetails.AdditionalArea && propertyDetails.AdditionalArea.filter(elem => elem !== 'Back Yard'),
                                    BackYardClick: !propertyDetails.BackYardClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalArea: [...propertyDetails.AdditionalArea, 'Back Yard'],
                                    BackYardClick: !propertyDetails.BackYardClick
                                  });
                                }
                              }}
                            />
                            <label htmlFor="back_yard">
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
                            className={propertyDetails.TerraceClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}
                          >
                            <input
                              type="radio"
                              id="terrace"
                              onClick={(e) => {
                                if (propertyDetails.TerraceClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalArea: propertyDetails.AdditionalArea && propertyDetails.AdditionalArea.filter(elem => elem !== 'Terrace'),
                                    TerraceClick: !propertyDetails.TerraceClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalArea: [...propertyDetails.AdditionalArea, 'Terrace'],
                                    TerraceClick: !propertyDetails.TerraceClick
                                  });
                                }
                              }}
                            />
                            <label htmlFor="terrace">
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
                            className={propertyDetails.GardenClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}
                          >
                            <input
                              type="radio"
                              id="garden"
                              onClick={(e) => {
                                if (propertyDetails.GardenClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalArea: propertyDetails.AdditionalArea && propertyDetails.AdditionalArea.filter(elem => elem !== 'Garden'),
                                    GardenClick: !propertyDetails.GardenClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalArea: [...propertyDetails.AdditionalArea, 'Garden'],
                                    GardenClick: !propertyDetails.GardenClick
                                  });
                                }
                              }}
                            />
                            <label htmlFor="garden">
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
                            className={propertyDetails.GarageClick ? 'custom_radio_button radiochecked' : 'custom_radio_button'}
                          >
                            <input
                              type="radio"
                              id="garage"
                              onClick={(e) => {
                                if (propertyDetails.GarageClick) {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalArea: propertyDetails.AdditionalArea && propertyDetails.AdditionalArea.filter(elem => elem !== 'Garage'),
                                    GarageClick: !propertyDetails.GarageClick
                                  })

                                } else {
                                  setPropertyDetails({
                                    ...propertyDetails,
                                    AdditionalArea: [...propertyDetails.AdditionalArea, 'Garage'],
                                    GarageClick: !propertyDetails.GarageClick
                                  });
                                }
                              }}
                            />
                            <label htmlFor="garage">
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
                        <input type="text" placeholder="Total Floors"
                          onChange={(e) => setPropertyDetails({
                            ...propertyDetails,
                            TotalFloor: e.target.value
                          })}
                          value={propertyDetails && propertyDetails.TotalFloor}
                        />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            table_rows
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Floor Number</label>
                      <div className="field_inner">
                        <input type="text" placeholder="Floor Number"
                          onChange={(e) => setPropertyDetails({
                            ...propertyDetails,
                            FloorNo: e.target.value
                          })}
                          value={propertyDetails && propertyDetails.FloorNo} />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            filter_none
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Apt On Floor</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.NumberOfAptOnFloor}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              NumberOfAptOnFloor: e.target.value
                            })
                          }}>
                          <option value="" selected disabled>
                            Number of Apt On Floor
                          </option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '0' ? true : false}>0</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '1' ? true : false}>1</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '2' ? true : false}>2</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '3' ? true : false}>3</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '4' ? true : false}>4</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '5' ? true : false}>5</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '6' ? true : false}>6</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '7' ? true : false}>7</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '8' ? true : false}>8</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '9' ? true : false}>9</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfAptOnFloor === '10' ? true : false}>10</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            filter_none
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Lifts</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.NumberOfLifts}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              NumberOfLifts: e.target.value
                            })
                          }}>
                          <option value="" selected disabled>
                            Number of Lifts
                          </option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLifts === '0' ? true : false}>0</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLifts === '1' ? true : false}>1</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLifts === '2' ? true : false}>2</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLifts === '3' ? true : false}>3</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLifts === '4' ? true : false}>4</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfLifts === '5' ? true : false}>5</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.PowerBackup === 'No Backup'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="power_nobackup"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  PowerBackup: 'No Backup'
                                })
                              }}
                            />
                            <label htmlFor="power_nobackup">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.PowerBackup === 'Full Backup'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="power_fullbackup"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  PowerBackup: 'Full Backup'
                                })
                              }}
                            />
                            <label htmlFor="power_fullbackup">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.PowerBackup === 'Partial Backup'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="power_partialbackup"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  PowerBackup: 'Partial Backup'
                                })
                              }}
                            />
                            <label htmlFor="power_partialbackup">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.PowerBackup === 'Lift Only'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="power_liftonly"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  PowerBackup: 'Lift Only'
                                })
                              }}
                            />
                            <label htmlFor="power_liftonly">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.PowerBackup === 'Inverter'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="power_inverter"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  PowerBackup: 'Inverter'
                                })
                              }}
                            />
                            <label htmlFor="power_inverter">
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
                      <div className="field_inner i_and_s">
                        <input type="text" placeholder="Plot Area"
                          onChange={(e) => setPropertyDetails({
                            ...propertyDetails,
                            PlotArea: e.target.value
                          })}
                          value={propertyDetails && propertyDetails.PlotArea} />
                        <div className="inner_select">
                          <select value={propertyDetails && propertyDetails.PlotAreaUnit}
                            onChange={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                PlotAreaUnit: e.target.value
                              })
                            }}>
                            <option selected={propertyDetails && propertyDetails.PlotAreaUnit === 'SqFt' ? true : false}>SqFt</option>
                            <option selected={propertyDetails && propertyDetails.PlotAreaUnit === 'SqMtr' ? true : false}>SqMtr</option>
                            <option selected={propertyDetails && propertyDetails.PlotAreaUnit === 'SqYd' ? true : false}>SqYd</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Super Area</label>
                      <div className="field_inner i_and_s">
                        <input type="text" placeholder="Super Area"
                          onChange={(e) => setPropertyDetails({
                            ...propertyDetails,
                            SuperArea: e.target.value
                          })}
                          value={propertyDetails && propertyDetails.SuperArea} />
                        <div className="inner_select">
                          <select value={propertyDetails && propertyDetails.SuperAreaUnit}
                            onChange={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                SuperAreaUnit: e.target.value
                              })
                            }}>
                            <option selected={propertyDetails && propertyDetails.SuperAreaUnit === 'SqFt' ? true : false}>SqFt</option>
                            <option selected={propertyDetails && propertyDetails.SuperAreaUnit === 'SqMtr' ? true : false}>SqMtr</option>
                            <option selected={propertyDetails && propertyDetails.SuperAreaUnit === 'SqYd' ? true : false}>SqYd</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Built-up Area</label>
                      <div className="field_inner i_and_s">
                        <input type="text" placeholder="Build Area"
                          onChange={(e) => setPropertyDetails({
                            ...propertyDetails,
                            BuiltUpArea: e.target.value
                          })}
                          value={propertyDetails && propertyDetails.BuiltUpArea} />
                        <div className="inner_select">
                          <select value={propertyDetails && propertyDetails.BuiltUpAreaUnit}
                            onChange={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                BuiltUpAreaUnit: e.target.value
                              })
                            }}>
                            <option selected={propertyDetails && propertyDetails.BuiltUpAreaUnit === 'SqFt' ? true : false}>SqFt</option>
                            <option selected={propertyDetails && propertyDetails.BuiltUpAreaUnit === 'SqMtr' ? true : false}>SqMtr</option>
                            <option selected={propertyDetails && propertyDetails.BuiltUpAreaUnit === 'SqYd' ? true : false}>SqYd</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Carpet Area</label>
                      <div className="field_inner i_and_s">
                        <input type="text" placeholder="Carpet Area"
                          onChange={(e) => setPropertyDetails({
                            ...propertyDetails,
                            CarpetArea: e.target.value
                          })}
                          value={propertyDetails && propertyDetails.CarpetArea} />
                        <div className="inner_select">
                          <select value={propertyDetails && propertyDetails.CarpetAreaUnit}
                            onChange={(e) => {
                              setPropertyDetails({
                                ...propertyDetails,
                                CarpetAreaUnit: e.target.value
                              })
                            }}>
                            <option selected={propertyDetails && propertyDetails.CarpetAreaUnit === 'SqFt' ? true : false}>SqFt</option>
                            <option selected={propertyDetails && propertyDetails.CarpetAreaUnit === 'SqMtr' ? true : false}>SqMtr</option>
                            <option selected={propertyDetails && propertyDetails.CarpetAreaUnit === 'SqYd' ? true : false}>SqYd</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>No. of Car Parking</label>
                      <div className="field_inner select">
                        <select value={propertyDetails && propertyDetails.NumberOfCarParking}
                          onChange={(e) => {
                            setPropertyDetails({
                              ...propertyDetails,
                              NumberOfCarParking: e.target.value
                            })
                          }}>
                          <option value="" selected disabled>Number of Car Parking</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfCarParking === '0' ? true : false}>0</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfCarParking === '1' ? true : false}>1</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfCarParking === '2' ? true : false}>2</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfCarParking === '3' ? true : false}>3</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfCarParking === '4' ? true : false}>4</option>
                          <option selected={propertyDetails && propertyDetails.NumberOfCarParking === '5' ? true : false}>5</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            local_parking
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form_field st-2">
                      <label>Car Parking - ( {propertyDetails.NumberOfCarParking} )</label>
                      <div className="radio_group">
                        <div className="radio_group_single">
                          <div
                            className="custom_radio_button"
                          >
                            <input
                              type="radio"
                              id="carparking_open"
                            />
                            <label htmlFor="carparking_open">
                              <div className="radio_icon">
                                <span className="material-symbols-outlined add">
                                  add
                                </span>
                                <span className="material-symbols-outlined check">
                                  done
                                </span>
                              </div>
                              <h6>Open</h6>
                            </label>
                          </div>
                        </div>
                        <div className="radio_group_single">
                          <div
                            className="custom_radio_button"
                          >
                            <input
                              type="radio"
                              id="carparking_closed"
                            />
                            <label htmlFor="carparking_closed">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.TwoWheelerParking === 'Yes'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="twowheelerparking_yes"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  TwoWheelerParking: 'Yes'
                                })
                              }}
                            />
                            <label htmlFor="twowheelerparking_yes">
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
                            className={`custom_radio_button ${propertyDetails && propertyDetails.TwoWheelerParking === 'No'
                              ? "radiochecked"
                              : ""
                              }`}
                          >
                            <input
                              type="radio"
                              id="twowheelerparking_no"
                              onClick={(e) => {
                                setPropertyDetails({
                                  ...propertyDetails,
                                  TwoWheelerParking: 'No'
                                })
                              }}
                            />
                            <label htmlFor="twowheelerparking_no">
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
                      <div className="accordion" id="property_detail_accordion">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="bedroom">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#bedroom_collapse"
                              aria-expanded="true"
                              aria-controls="bedroom_collapse"
                            >
                              <div className="button_title">
                                <span className="material-symbols-outlined button_icon">
                                  bed
                                </span>
                                Bedrooms - (4)
                                {/* <span className="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span className="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="bedroom_collapse"
                            className="accordion-collapse collapse"
                            aria-labelledby="bedroom"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div className="accordion-body">
                              <h6 className="mt-2 text-center">Master Bedroom</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                          className="custom_radio_button"
                                        >
                                          <input
                                            type="radio"
                                            id="yes_bathroomattach_masterbedroom"
                                          />
                                          <label htmlFor="yes_bathroomattach_masterbedroom">
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
                                          className="custom_radio_button"
                                        >
                                          <input
                                            type="radio"
                                            id="no_bathroomattach_masterbedroom"
                                          />
                                          <label htmlFor="no_bathroomattach_masterbedroom">
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
                                          className="custom_radio_button"
                                        >
                                          <input
                                            type="radio"
                                            id="yes_balconyattach_masterbedroom"

                                          />
                                          <label htmlFor="yes_balconyattach_masterbedroom">
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
                                          className="custom_radio_button"
                                        >
                                          <input
                                            type="radio"
                                            id="no_balconyattach_masterbedroom"
                                          />
                                          <label htmlFor="no_balconyattach_masterbedroom">
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
                                        <span className="material-symbols-outlined">
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
                                          className="custom_radio_button"
                                        >
                                          <input
                                            type="checkbox"
                                            id="fan_masterbedroom"
                                          />
                                          <label htmlFor="fan_masterbedroom">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>Fan</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className="custom_radio_button"
                                        >
                                          <input
                                            type="radio"
                                            id="tubelight_masterbedroom"
                                          />
                                          <label htmlFor="tubelight_masterbedroom">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>Tube Light</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className="custom_radio_button"
                                        >
                                          <input
                                            type="radio"
                                            id="almirah_masterbedroom"
                                          />
                                          <label htmlFor="almirah_masterbedroom">
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
                                          className="custom_radio_button"
                                        >
                                          <input
                                            type="radio"
                                            id="window_masterbedroom"
                                          />
                                          <label htmlFor="window_masterbedroom">
                                            <div className="radio_icon">
                                              <span className="material-symbols-outlined add">
                                                add
                                              </span>
                                              <span className="material-symbols-outlined check">
                                                done
                                              </span>
                                            </div>
                                            <h6>Window</h6>
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
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="bathroom">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#bathroom_collapse"
                              aria-expanded="false"
                              aria-controls="bathroom_collapse"
                            >
                              <div className="button_title">
                                <span className="material-symbols-outlined button_icon">
                                  bathtub
                                </span>
                                Bathrooms - (1)
                                {/* <span className="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span className="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="bathroom_collapse"
                            className="accordion-collapse collapse"
                            aria-labelledby="bathroom"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div className="accordion-body">
                              <h6 className="mt-2 text-center">Bathroom 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                          className="custom_radio_button"
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
                                            <h6> Yes</h6>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="radio_group_single">
                                        <div
                                          className="custom_radio_button"
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
                                        <span className="material-symbols-outlined">
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
                                          className="custom_radio_button"
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
                                          className="custom_radio_button"
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
                                          className="custom_radio_button"
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
                                          className="custom_radio_button"
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
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="balcony">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#balcony_collapse"
                              aria-expanded="false"
                              aria-controls="balcony_collapse"
                            >
                              <div className="button_title">
                                <span className="material-symbols-outlined button_icon">
                                  balcony
                                </span>
                                Balcony - (4)
                                {/* <span className="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span className="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="balcony_collapse"
                            className="accordion-collapse collapse"
                            aria-labelledby="balcony"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div className="accordion-body">
                              <h6 className="mt-2 text-center">Balcony 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="kitchen">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#kitchen_collapse"
                              aria-expanded="false"
                              aria-controls="kitchen_collapse"
                            >
                              <div className="button_title">
                                <span className="material-symbols-outlined button_icon">
                                  kitchen
                                </span>
                                All Kitchen - (4)
                                {/* <span className="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span className="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="kitchen_collapse"
                            className="accordion-collapse collapse"
                            aria-labelledby="kitchen"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div className="accordion-body">
                              <h6 className="mt-2 text-center">Kitchen 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="living">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#living_collapse"
                              aria-expanded="false"
                              aria-controls="living_collapse"
                            >
                              <div className="button_title">
                                <span className="material-symbols-outlined button_icon">
                                  chair
                                </span>
                                All Living - (4)
                                {/* <span className="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span className="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="living_collapse"
                            className="accordion-collapse collapse"
                            aria-labelledby="living"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div className="accordion-body">
                              <h6 className="mt-2 text-center">Living 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="living_dining">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#living_dining_collapse"
                              aria-expanded="false"
                              aria-controls="living_dining_collapse"
                            >
                              <div className="button_title">
                                <span className="material-symbols-outlined button_icon">
                                  dinner_dining
                                </span>
                                All Living & Dining - (4)
                                {/* <span className="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span className="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="living_dining_collapse"
                            className="accordion-collapse collapse"
                            aria-labelledby="living_dining"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div className="accordion-body">
                              <h6 className="mt-2 text-center">Living & Dining 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="gallery_passage">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#gallery_passage_collapse"
                              aria-expanded="false"
                              aria-controls="gallery_passage_collapse"
                            >
                              <div className="button_title">
                                <span className="material-symbols-outlined button_icon">
                                  gallery_thumbnail
                                </span>
                                Gallery & Passages - (4)
                                {/* <span className="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span className="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="gallery_passage_collapse"
                            className="accordion-collapse collapse"
                            aria-labelledby="gallery_passage"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div className="accordion-body">
                              <h6 className="mt-2 text-center">Gallery & Passage 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="bassment">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#bassment_collapse"
                              aria-expanded="false"
                              aria-controls="bassment_collapse"
                            >
                              <div className="button_title">
                                <span className="material-symbols-outlined button_icon">
                                  floor
                                </span>
                                Bassment - (4)
                                {/* <span className="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span className="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="bassment_collapse"
                            className="accordion-collapse collapse"
                            aria-labelledby="bassment"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div className="accordion-body">
                              <h6 className="mt-2 text-center">Basement 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="additional_room">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#additional_room_collapse"
                              aria-expanded="false"
                              aria-controls="additional_room_collapse"
                            >
                              <div className="button_title">
                                <span className="material-symbols-outlined button_icon">
                                  meeting_room
                                </span>
                                Additional Rooms - (4)
                                {/* <span className="material-symbols-outlined done">
                                  done
                                </span> */}
                                <span className="material-symbols-outlined close">
                                  close
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id="additional_room_collapse"
                            className="accordion-collapse collapse"
                            aria-labelledby="additional_room"
                            data-bs-parent="#property_detail_accordion"
                          >
                            <div className="accordion-body">
                              <h6 className="mt-2 text-center">Additional Rooms 1</h6>
                              <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Total Area</label>
                                    <div className="field_inner">
                                      <input type="text" value="1200 sqft 6 in" />
                                      <div className="field_icon">
                                        <span className="material-symbols-outlined">crop_square</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form_field st-2">
                                    <label>Length</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                                    <label>width</label>
                                    <div className="field_two">
                                      <div className="field_inner">
                                        <input type="text" placeholder="Feet" />
                                        <div className="field_icon">
                                          <div className="text_icon">
                                            ft
                                          </div>
                                        </div>
                                      </div>
                                      <div className="field_inner">
                                        <input type="text" placeholder="inch" />
                                        <div className="field_icon">
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
                    <div className="form_field st-2">
                      <label>Property Description</label>
                      <textarea
                        type="text"
                        placeholder="Enter the details here"
                        onChange={(e) => setPropertyDetails({
                          ...propertyDetails,
                          PropertyDesciption: e.target.value
                        })}
                        value={propertyDetails && propertyDetails.PropertyDesciption}
                      />
                      <div className="field_icon">
                        <span className="material-symbols-outlined">
                          border_color
                        </span>
                      </div>

                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_field st-2">
                      <label>Owner Instruction</label>

                      <textarea
                        type="text"
                        placeholder="Enter the details here"
                        onChange={(e) => setPropertyDetails({
                          ...propertyDetails,
                          OwnerInstruction: e.target.value
                        })}
                        value={propertyDetails && propertyDetails.OwnerInstruction}
                      />
                      <div className="field_icon">
                        <span className="material-symbols-outlined">
                          border_color
                        </span>
                      </div>

                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_field st-2">
                      <label>Key details / Key Handover</label>
                      <textarea
                        type="text"
                        placeholder="Enter the details here"
                        onChange={(e) => setPropertyDetails({
                          ...propertyDetails,
                          KeyDetailsHandover: e.target.value
                        })}
                        value={propertyDetails && propertyDetails.KeyDetailsHandover}
                      />
                      <div className="field_icon">
                        <span className="material-symbols-outlined">
                          border_color
                        </span>
                      </div>

                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_field st-2">
                      <label>Bill Type Setting</label>
                      <textarea
                        type="text"
                        placeholder="Enter the details here"
                        onChange={(e) => setPropertyDetails({
                          ...propertyDetails,
                          BillTypeSetting: e.target.value
                        })}
                        value={propertyDetails && propertyDetails.BillTypeSetting}
                      />
                      <div className="field_icon">
                        <span className="material-symbols-outlined">
                          border_color
                        </span>
                      </div>

                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_field st-2">
                      <label>Advertising</label>
                      <textarea
                        type="text"
                        placeholder="Enter the details here"
                        onChange={(e) => setPropertyDetails({
                          ...propertyDetails,
                          Advertising: e.target.value
                        })}
                        value={propertyDetails && propertyDetails.Advertising}
                      />
                      <div className="field_icon">
                        <span className="material-symbols-outlined">
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
