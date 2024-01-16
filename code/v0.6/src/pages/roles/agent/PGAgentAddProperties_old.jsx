import { useState, useEffect, useRef } from 'react'
import { useCollection } from '../../../hooks/useCollection'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { timestamp, projectFirestore } from '../../../firebase/config'
import { useFirestore } from '../../../hooks/useFirestore'
import { useDocument } from '../../../hooks/useDocument'
import { useLocation } from "react-router-dom";
import Select from 'react-select'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { el } from 'date-fns/locale'
import SearchBarAutoComplete from '../../search/SearchBarAutoComplete'

const categories = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
]

export default function PGAgentAddProperties() {

    const { propertyid } = useParams()
    // console.log('Property ID: ', propertyid)

    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end
    const navigate = useNavigate()
    const { document: propertyDocument, error: propertyerror } = useDocument('properties', propertyid)

    const { documents: dbpropertiesdocuments, error: propertieserror } =
        useCollection("properties", ["postedBy", "==", "Agent"]);

    const dataCity = dbpropertiesdocuments && dbpropertiesdocuments.map((doc) => doc.city);
    const distinctValuesCity = [...new Set(dataCity)];

    const dataLocality = dbpropertiesdocuments && dbpropertiesdocuments.map((doc) => doc.locality);
    const distinctValuesLocality = [...new Set(dataLocality)];

    const dataSociety = dbpropertiesdocuments && dbpropertiesdocuments.map((doc) => doc.society);
    const distinctValuesSociety = [...new Set(dataSociety)];



    // console.log('distinctValues:', distinctValues)
    // const dbPropertyCities = dbpropertiesdocuments &&
    //     dbpropertiesdocuments.filter((item) => item.city.id === user.uid);
    // const dbPropertyCities = dbpropertiesdocuments && dbpropertiesdocuments.groupBy("city").get()
    //     .then((snapshot) => {
    //         snapshot.forEach((doc) => {
    //             console.log(doc.data().name, doc.data().count);
    //         });
    //     })
    //     .catch((error) => {
    //         console.error("Error getting documents: ", error);
    //     });

    // console.log('dbPropertyCities', dbPropertyCities)


    const { addDocument, response: addDocumentResponse } = useFirestore('properties')
    const { updateDocument, response: updateDocumentResponse } = useFirestore('properties')

    const { user } = useAuthContext()
    // const [users, setUsers] = useState([])

    // const { documents } = useCollection('users')

    const [toggleFlag, setToggleFlag] = useState(false)

    // form field values
    // const [unitNumber, setUnitNumber] = useState('')
    const [taggedOwner, setTaggedOwner] = useState([])
    // const { document: masterPropertyPurpose, error: masterPropertyPurposeerror } = useDocument('master', 'PROPERTYPURPOSE')
    // const { documents: masterCountry, error: masterCountryerror } = useCollection('m_countries')
    const [country, setCountry] = useState({ label: 'INDIA', value: 'INDIA' })
    const [state, setState] = useState()
    const [city, setCity] = useState()
    const [newCity, setNewCity] = useState()
    const [cityList, setCityList] = useState([])

    const [localityList, setLocalityList] = useState([])
    const [locality, setLocality] = useState()

    const [society, setSociety] = useState('')
    const [category, setCategory] = useState('RESIDENTIAL') //Residential/Commercial
    // const [purpose, setPurpose] = useState({ label: 'Rent', value: 'Rent' })
    // const [purpose, setPurpose] = useState()
    const [status, setStatus] = useState('pending approval')
    // const today = new Date();
    // const formattedDate = format(today, 'yyyy-MM-dd');
    const [onboardingDate, setOnboardingDate] = useState(new Date())
    const [formError, setFormError] = useState(null)

    const [propertyDetails, setPropertyDetails] = useState({

        // All select type  
        UnitNumber: 'Not Available',
        Purpose: 'RENT',
        Country: '',
        State: '',
        // state,
        City: '',
        Locality: '',
        Society: '',
        PropertyType: 'High Rise Apt',
        Bhk: 'BHK? Not Available',
        Furnishing: 'Raw',
        NumberOfBedrooms: '',
        NumberOfBathrooms: '1',
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

        // input type text + select         
        CarpetArea: 'Not Available',
    });


    // const propertyPurposeOptions = useRef([]);
    // const propertyPurposeOptionsSorted = useRef([]);
    // let countryOptions = useRef([]);
    // let countryOptionsSorted = useRef([]);
    let statesOptions = useRef([]);
    let statesOptionsSorted = useRef([]);
    // let citiesOptions = useRef([]);
    // let citiesOptionsSorted = useRef([]);
    // let localityOptions = useRef([]);
    // let localityOptionsSorted = useRef([]);
    // let societyOptions = useRef([]);
    // let societyOptionsSorted = useRef([]);

    useEffect(() => {
        // console.log('in useeffect')
        // console.log('users from db: ', documents)
        // if (documents) {
        //     setUsers(documents.map(user => {
        //         return { value: { ...user, id: user.id }, label: user.fullName + ' ( ' + user.phoneNumber + ' )' }
        //     }))
        // }

        // if (masterCountry) {
        //     countryOptions.current = masterCountry.map(countryData => ({
        //         label: countryData.country,
        //         value: countryData.country
        //     }))

        //     countryOptionsSorted.current = countryOptions.current.sort((a, b) =>
        //         a.label.localeCompare(b.label)
        //     );
        // handleCountryChange(country)
        // }

        handleCountryChange(country)

        if (propertyDocument) {
            setCategory(propertyDocument.category)
            if (propertyDocument.category === 'RESIDENTIAL')
                setToggleFlag(false);
            else
                setToggleFlag(true);

            setPropertyDetails({

                // All select type 
                UnitNumber: propertyDocument.unitNumber ? propertyDocument.unitNumber : '',
                Purpose: propertyDocument.purpose ? propertyDocument.purpose : '',
                Country: propertyDocument.country ? propertyDocument.country : '',
                State: propertyDocument.state ? propertyDocument.state : '',
                City: propertyDocument.city ? propertyDocument.city : '',
                Locality: propertyDocument.locality ? propertyDocument.locality : '',
                Society: propertyDocument.society ? propertyDocument.society : '',
                PropertyType: propertyDocument.propertyType ? propertyDocument.propertyType : '',
                Bhk: propertyDocument.bhk ? propertyDocument.bhk : '',
                NumberOfBedrooms: propertyDocument.numberOfBedrooms ? propertyDocument.numberOfBedrooms : '',
                NumberOfBathrooms: propertyDocument.numberOfBathrooms ? propertyDocument.numberOfBathrooms : '',
                Furnishing: propertyDocument.furnishing ? propertyDocument.furnishing : '',
                AdditionalRooms: propertyDocument.additionalRooms ? propertyDocument.additionalRooms : [],
                CarpetArea: propertyDocument.carpetArea ? propertyDocument.carpetArea : '',
                CarpetAreaUnit: propertyDocument.carpetAreaUnit ? propertyDocument.carpetAreaUnit : 'SqFt',

            })
        }

    }, [propertyDocument])


    const toggleBtnClick = () => {
        // console.log('toggleClick Category:', toggleFlag)
        if (toggleFlag)
            setCategory('RESIDENTIAL')
        else
            setCategory('COMMERCIAL')

        setToggleFlag(!toggleFlag);
    };

    // const usersSorted = users.sort((a, b) =>
    //     a.label.localeCompare(b.label)
    // );

    // Load dropdowns with db values
    //Load data into Country dropdown    
    //Country select onchange
    const handleCountryChange = async (option) => {
        setCountry(option)
        // let countryname = option.label;
        let countryname = "INDIA";
        const ref = await projectFirestore.collection('m_states').where("country", "==", countryname)
        ref.onSnapshot(async snapshot => {
            if (snapshot.docs) {
                statesOptions.current = snapshot.docs.map(stateData => ({
                    label: stateData.data().state,
                    value: stateData.data().state
                }))
                // console.log('statesOptions:', statesOptions)
                statesOptionsSorted.current = statesOptions.current.sort((a, b) =>
                    a.label.localeCompare(b.label)
                );

                statesOptionsSorted.current.unshift({
                    label: 'Select State',
                    value: 'Select State'
                })

                // console.log('statesOptionsSorted:', statesOptionsSorted)

                if (countryname === 'INDIA') {
                    if (propertyDocument && propertyDocument.state) {
                        setState({ label: propertyDocument.state, value: propertyDocument.state })
                        handleStateChange({ label: propertyDocument.state, value: propertyDocument.state })
                    }
                    else {
                        setState({ label: 'Select State', value: 'Select State' })
                        handleStateChange({ label: 'Select State', value: 'Select State' })
                    }
                }
                else {
                    setState({ label: statesOptionsSorted.current[0].label, value: statesOptionsSorted.current[0].value })
                    handleStateChange({ label: statesOptionsSorted.current[0].label, value: statesOptionsSorted.current[0].value })
                }
            }
            else {
                // setError('No such document exists')
            }
        }, err => {
            console.log(err.message)
            // setError('failed to get document')
        })
    }
    function setSearchedCity(cityname) {
        console.log('cityname', cityname);
        setPropertyDetails({
            ...propertyDetails,
            City: cityname
        })
    }
    function setSearchedLocality(localityname) {
        // console.log('cityname', cityname);
        setPropertyDetails({
            ...propertyDetails,
            Locality: localityname
        })
    }
    function setSearchedSociety(societyname) {
        // console.log('cityname', cityname);
        setPropertyDetails({
            ...propertyDetails,
            Society: societyname
        })
    }
    const handleStateChange = async (option) => {
        setState(option)
        let statename = option.label;
        // console.log('statename:', statename)
        const ref = await projectFirestore.collection('m_cities').where("state", "==", statename)
        ref.onSnapshot(async snapshot => {
            if (snapshot.docs) {
                // citiesOptions.current = snapshot.docs.map(cityData => ({
                //     label: cityData.data().city,
                //     value: cityData.data().city
                // }))

                // console.log('citiesOptions: ', citiesOptions)

                // citiesOptionsSorted.current = citiesOptions.current.sort((a, b) =>
                //     a.label.localeCompare(b.label)
                // );

                // if (statename === 'DELHI') {
                //     setCity({ label: 'DELHI', value: 'DELHI' })
                //     handleCityChange({ label: 'DELHI', value: 'DELHI' })
                // }
                // else {
                //     if (propertyDocument && propertyDocument.city) {

                //         setCity({ label: propertyDocument.city, value: propertyDocument.city })
                //         handleCityChange({ label: propertyDocument.city, value: propertyDocument.city })
                //     }
                //     else {
                //         console.log('In handleStateChange : ', citiesOptionsSorted)

                //         setCity({ label: citiesOptionsSorted.current[0].label, value: citiesOptionsSorted.current[0].value })
                //         handleCityChange({ label: citiesOptionsSorted.current[0].label, value: citiesOptionsSorted.current[0].value })
                //     }
                // }
            }
            else {
                // setError('No such document exists')
            }
        }, err => {
            console.log(err.message)
            // setError('failed to get document')
        })
    }

    //City select onchange
    // const handleCityChange = async (option) => {
    //     setCity(option)
    //     let cityname = option.label;
    //     console.log('cityname:', cityname)
    //     const ref = await projectFirestore.collection('m_localities').where("city", "==", cityname)
    //     ref.onSnapshot(async snapshot => {
    //         if (snapshot.docs) {
    //             localityOptions.current = snapshot.docs.map(localityData => ({
    //                 label: localityData.data().locality,
    //                 value: localityData.data().locality
    //             }))

    //             console.log('localityOptions:', localityOptions)

    //             if (localityOptions && localityOptions.current.length > 0) {
    //                 localityOptionsSorted.current = localityOptions.current.sort((a, b) =>
    //                     a.label.localeCompare(b.label)
    //                 );

    //                 if (propertyDocument && propertyDocument.locality) {
    //                     setLocality({ label: propertyDocument.locality, value: propertyDocument.locality })
    //                     handleLocalityChange({ label: propertyDocument.locality, value: propertyDocument.locality })
    //                 }
    //                 else {
    //                     setLocality({ label: localityOptionsSorted.current[0].label, value: localityOptionsSorted.current[0].value })
    //                     handleLocalityChange({ label: localityOptionsSorted.current[0].label, value: localityOptionsSorted.current[0].value })
    //                 }
    //             }

    //         }
    //         else {
    //             // setError('No such document exists')
    //         }
    //     }, err => {
    //         console.log(err.message)
    //         // setError('failed to get document')
    //     })
    // }

    //Locality select onchange
    // const handleLocalityChange = async (option) => {
    //     setLocality(option)
    //     let localityname = option.label;
    //     // console.log('cityname:', localityname)
    //     const ref = await projectFirestore.collection('m_societies').where("locality", "==", localityname)
    //     ref.onSnapshot(async snapshot => {
    //         if (snapshot.docs) {
    //             societyOptions.current = snapshot.docs.map(societyData => ({
    //                 label: societyData.data().society,
    //                 value: societyData.data().society
    //             }))

    //             if (societyOptions && societyOptions.current.length > 0) {
    //                 societyOptionsSorted.current = societyOptions.current.sort((a, b) =>
    //                     a.label.localeCompare(b.label)
    //                 );

    //                 if (propertyDocument && propertyDocument.society) {
    //                     setSociety({ label: propertyDocument.society, value: propertyDocument.society })
    //                     // handleSocietyChange({ label: propertyDocument.society, value: propertyDocument.society })
    //                 }
    //                 else {
    //                     setSociety({ label: societyOptionsSorted.current[0].label, value: societyOptionsSorted.current[0].value })
    //                     // setSociety({ label: societyOptionsSorted.current.label, value: societyOptionsSorted.current.value })
    //                     // handleCityChange({ label: statesOptionsSorted.current[0].label, value: statesOptionsSorted.current[0].value })
    //                 }
    //             }
    //         }
    //         else {
    //             // setError('No such document exists')
    //         }
    //     }, err => {
    //         console.log(err.message)
    //         // setError('failed to get document')
    //     })
    // }

    // console.log('state:', state)
    function camelCase(str) {
        return str
            .replace(/\s(.)/g, function (a) {
                return a.toUpperCase();
            })
            // .replace(/\s/g, '')
            .replace(/^(.)/, function (b) {
                return b.toUpperCase();
            });

    }
    // console.log('chennai in camelcase: ', camelCase('chennai abc def'))
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)
        let errorFlag = false
        let errorMsg = 'Please select '
        if (state.value === 'Select State') {
            errorMsg = errorMsg + 'state'
            errorFlag = true
        }
        if (propertyDetails.City === '') {
            if (errorMsg === 'Please select ')
                errorMsg = errorMsg + 'city'
            else
                errorMsg = errorMsg + ', city'
            errorFlag = true
        }
        if (propertyDetails.Locality === '') {
            if (errorMsg === 'Please select ')
                errorMsg = errorMsg + 'locality'
            else
                errorMsg = errorMsg + ', locality'
            errorFlag = true
        }
        if (propertyDetails.Society === '') {
            if (errorMsg === 'Please select ')
                errorMsg = errorMsg + 'society'
            else
                errorMsg = errorMsg + ', society'

            errorFlag = true
        }

        if (errorFlag)
            setFormError(errorMsg)
        else
            setFormError('')


        const property = {
            unitNumber: propertyDetails.UnitNumber ? propertyDetails.UnitNumber : '',
            category,
            purpose: propertyDetails.Purpose ? propertyDetails.Purpose : 'RENT',
            country: country.label ? country.label : '',
            state: state.label ? state.label : '',
            city: camelCase(propertyDetails.City.toLowerCase()),
            locality: camelCase(propertyDetails.Locality.toLowerCase()),
            society: camelCase(propertyDetails.Society.toLowerCase()),
            propertyType: propertyDetails.PropertyType ? propertyDetails.PropertyType : 'High Rise Apt',
            bhk: propertyDetails.Bhk ? propertyDetails.Bhk : '',
            numberOfBedrooms: propertyDetails.NumberOfBedrooms ? propertyDetails.NumberOfBedrooms : '',
            numberOfBathrooms: propertyDetails.NumberOfBathrooms ? propertyDetails.NumberOfBathrooms : '',
            furnishing: propertyDetails.Furnishing ? propertyDetails.Furnishing : '',
            additionalRooms: propertyDetails.AdditionalRooms ? propertyDetails.AdditionalRooms : [],
            carpetArea: propertyDetails.CarpetArea ? propertyDetails.CarpetArea : '',
            carpetAreaUnit: propertyDetails.CarpetAreaUnit ? propertyDetails.CarpetAreaUnit : 'SqFt',
        }

        if (propertyid === 'new') {
            // console.log('Property id while newly added : ', propertyid)
            // console.log("Property: ", property)

            const newProperty = {
                ...property,
                postedBy: 'Agent',
                status: 'pending approval',
                onboardingDate: timestamp.fromDate(new Date(onboardingDate))
            }
            // console.log('newProperty:', newProperty)
            if (!errorFlag) {
                await addDocument(newProperty)
                if (addDocumentResponse.error) {
                    navigate('/')
                }
                else {
                    // navigate('/agentproperties')
                    navigate("/agentproperties", {
                        state: {
                            propSearchFilter: 'PENDING APPROVAL'
                        }
                    });
                }
            }
        }
        else if (propertyid !== 'new') {
            // console.log('Property id while update: ', propertyid)
            // console.log("Property: ", property)

            const updatedBy = {
                id: user.uid,
                displayName: user.displayName + '(' + user.role + ')',
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                emailID: user.email,
                photoURL: user.photoURL
            }

            const updatedProperty = {
                ...property,
                updatedAt: timestamp.fromDate(new Date()),
                updatedBy
            }
            // console.log('updated property:', updatedProperty)

            if (!errorFlag) {
                await updateDocument(propertyid, updatedProperty)

                if (updateDocumentResponse.error) {
                    navigate('/')
                }
                else {
                    // navigate('/agentproperties')
                    navigate("/agentproperties", {
                        state: {
                            propSearchFilter: 'ACTIVE'
                            // eventID: props.event.Eventid,
                            // eventDetails: props.event,
                            // entryCount: props.event.EntryCount
                        }
                    });
                    // console.log('Property Udpated Successfully:')
                }
            }
        }
    }

    return (
        <div className='top_header_pg aflbg '>
            <div className='container'>
                <br />
                <h2 className='pg_title'>
                    ADD PROPERTY
                </h2>
                <hr />
                <div
                    className="row no-gutters"
                    style={{ margin: "10px 0px ", height: "50px", background: "white" }}
                >
                    <div className="col-md-6 col-sm-12 d-flex " style={{
                        alignItems: "center",
                        height: "50px"
                    }}                          >
                        <div className="residential-commercial-switch" style={{ top: "0" }}>
                            <span className={toggleFlag ? '' : 'active'} style={{ color: 'var(--theme-blue)' }}>Residential</span>
                            <div className={toggleFlag ? 'toggle-switch on commercial' : 'toggle-switch off residential'} style={{ padding: '0 10px' }}>
                                {/* <small>{toggleFlag ? 'On' : 'Off'}</small> */}
                                <div onClick={toggleBtnClick}>
                                    <div></div>
                                </div>
                            </div>
                            <span className={toggleFlag ? 'active' : ''} style={{ color: 'var(--theme-orange)' }}>Commercial</span>
                        </div>
                    </div>
                    {/* <div className="col-md-6 col-sm-12 d-flex" style={{
                        alignItems: "center",
                        height: "50px"
                    }}                        >
                        <div className="details-radio" style={{ top: "0" }}>
                            <div></div>
                            <div className='details-radio-inner'>
                                <div className="row no-gutters">
                                    <div className="col-6" style={{ padding: '0 5px' }}>
                                        <input type="checkbox" className="checkbox" style={{ width: '0px' }}
                                            name="BusinessType" id="businessTypeRent" value="Rent"
                                            onClick={() => setPurpose('rent')}
                                        />
                                        <label className="checkbox-label pointer" for="businessTypeRent" style={{ margin: "0px" }}>
                                            <span className="material-symbols-outlined add">
                                                add
                                            </span>
                                            <span className="material-symbols-outlined done">
                                                done
                                            </span>
                                            <small>Rent</small>
                                        </label>
                                    </div>

                                    <div className="col-6" style={{ padding: '0 5px' }}>
                                        <input type="checkbox" className="checkbox" style={{ width: '0px' }}
                                            name="BusinessType" id="businessTypeSale" value="Sale"
                                            onClick={() => setPurpose('sale')}
                                        />
                                        <label className="checkbox-label pointer" for="businessTypeSale" style={{ margin: "0px" }}>
                                            <span className="material-symbols-outlined add">
                                                add
                                            </span>
                                            <span className="material-symbols-outlined done">
                                                done
                                            </span>
                                            <small>Sale</small>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className='d_inner_card'>
                    <form onSubmit={handleSubmit}>
                        <div className="row no-gutters">
                            <div className="col-lg-6">
                                <div className="form_field st-2 mt-lg-0">
                                    <label>Unit Number</label>
                                    <div className="field_inner">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter Property Unit Number"
                                            maxLength={70}
                                            onChange={(e) => setPropertyDetails({
                                                ...propertyDetails,
                                                UnitNumber: e.target.value
                                            })}
                                            value={propertyDetails && propertyDetails.UnitNumber}
                                        />

                                        {/* <input required
                                            type="text"
                                            placeholder="Enter Property Unit Number"
                                            maxLength={70}
                                            onChange={(e) => setUnitNumber(e.target.value)}
                                            value={unitNumber} /> */}
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">
                                                drive_file_rename_outline
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form_field st-2 mt-lg-0">
                                    <label>Purpose</label>
                                    <div className="field_inner select">
                                        {/* <Select
                                            onChange={(e) => {
                                                setPropertyDetails({
                                                    ...propertyDetails,
                                                    Purpose: e.value ? e.value : ''
                                                })
                                            }}
                                            options={propertyPurposeOptionsSorted.current}
                                            value={propertyDetails && propertyDetails.Purpose}

                                        ></Select> */}
                                        {/* <Select className=''
                                            onChange={(option) => setPurpose(option)}
                                            options={propertyPurposeOptionsSorted.current}
                                            value={purpose}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#efefef',
                                                    border: 'none',
                                                    borderBottom: 'none',
                                                    paddingLeft: '10px',
                                                }),
                                            }}
                                        /> */}
                                        <select value={propertyDetails && propertyDetails.Purpose}
                                            onChange={(e) => {
                                                setPropertyDetails({
                                                    ...propertyDetails,
                                                    Purpose: e.target.value
                                                })
                                            }}>
                                            {/* <option selected disabled>
                                                Choose Purpose
                                            </option> */}
                                            <option defaultValue={propertyDetails && propertyDetails.Purpose === 'RENT' ? true : false}>Rent</option>
                                            <option defaultValue={propertyDetails && propertyDetails.Purpose === 'SALE' ? true : false}>Sale</option>
                                            {/* <option selected={propertyDetails && propertyDetails.Purpose === 'RENTED OUT' ? true : false}>Rented Out</option>
                                            <option selected={propertyDetails && propertyDetails.Purpose === 'SOLD OUT' ? true : false}>Sold Out</option> */}
                                        </select>
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined"> drive_file_rename_outline</span>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="form_field st-2">
                                    <label>Country</label>
                                    <div className="field_inner select">
                                        <Select className=''
                                            onChange={handleCountryChange}
                                            options={countryOptionsSorted.current}
                                            value={country}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#efefef',
                                                    border: 'none',
                                                    borderBottom: 'none',
                                                    paddingLeft: '10px',
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">       public</span>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="form_field st-2">
                                    <label>State</label>
                                    <div className="field_inner select">
                                        <Select className=''
                                            // onChange={(option) => setState(option)}
                                            onChange={handleStateChange}
                                            options={statesOptionsSorted.current}
                                            // options={stateList}
                                            value={state}
                                            // value={propertyDetails && propertyDetails.State}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#efefef',
                                                    border: 'none',
                                                    borderBottom: 'none',
                                                    paddingLeft: '10px'
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">       emoji_transportation</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form_field st-2">
                                    <label>City</label>
                                    <SearchBarAutoComplete enabled={state && state.value === 'Select State' ? true : false} dataList={distinctValuesCity} placeholderText={'Search City'} getQuery={setSearchedCity} queryValue={propertyDetails ? propertyDetails.City : ""}></SearchBarAutoComplete>
                                </div>
                                <div className="form_field st-2">
                                    <label>Locality</label>
                                    <SearchBarAutoComplete enabled={propertyDetails && propertyDetails.City === '' ? true : false} dataList={distinctValuesLocality}
                                        placeholderText={'Search Locality'} getQuery={setSearchedLocality} queryValue={propertyDetails ? propertyDetails.Locality : ''}></SearchBarAutoComplete>
                                </div>
                                <div className="form_field st-2">
                                    <label>Society</label>
                                    <SearchBarAutoComplete enabled={propertyDetails && propertyDetails.Locality === '' ? true : false} dataList={distinctValuesSociety}
                                        placeholderText={'Search Society'} getQuery={setSearchedSociety} queryValue={propertyDetails ? propertyDetails.Society : ''}></SearchBarAutoComplete>
                                </div>
                                {/* <div className="form_field st-2">
                                    <label>City</label>
                                    <div className="field_inner select">
                                        <Select className=''
                                            onChange={handleCityChange}
                                            options={citiesOptionsSorted.current}
                                            value={city}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#efefef',
                                                    border: 'none',
                                                    borderBottom: 'none',
                                                    paddingLeft: '10px'
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">       apartment</span>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="form_field st-2">
                                    <label>Locality</label>
                                    <div className="field_inner select">
                                        <Select className=''
                                            onChange={handleLocalityChange}
                                            options={localityOptionsSorted.current}
                                            value={locality}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#efefef',
                                                    border: 'none',
                                                    borderBottom: 'none',
                                                    paddingLeft: '10px'
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">        holiday_village</span>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="form_field st-2">
                                    <label>Society</label>
                                    <div className="field_inner select">
                                        <Select className=''
                                            onChange={(option) => setSociety(option)}
                                            options={societyOptionsSorted.current}
                                            value={society}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#efefef',
                                                    border: 'none',
                                                    borderBottom: 'none',
                                                    paddingLeft: '10px'
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">          home</span>
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                            <div className="col-lg-6">
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
                                            {/* <option selected disabled>
                                                Choose Property Type
                                            </option> */}
                                            <option defaultValue={propertyDetails && propertyDetails.PropertyType === 'High Rise Apt' ? true : false}>High Rise Apt</option>
                                            <option defaultValue={propertyDetails && propertyDetails.PropertyType === 'Low Rise Apt' ? true : false}>Low Rise Apt</option>
                                            <option defaultValue={propertyDetails && propertyDetails.PropertyType === 'Builder Floor' ? true : false}>Builder Floor</option>
                                            <option defaultValue={propertyDetails && propertyDetails.PropertyType === 'Kothi' ? true : false}>Kothi</option>
                                            <option defaultValue={propertyDetails && propertyDetails.PropertyType === 'Villa - Simplex' ? true : false}>Villa - Simplex</option>
                                            <option defaultValue={propertyDetails && propertyDetails.PropertyType === 'Villa - Duplex' ? true : false}>Villa - Duplex</option>
                                            <option defaultValue={propertyDetails && propertyDetails.PropertyType === 'Row House - Simplex' ? true : false}>Row House - Simplex</option>
                                            <option defaultValue={propertyDetails && propertyDetails.PropertyType === 'Row House - Duplex' ? true : false}>Row House - Duplex</option>
                                            <option defaultValue={propertyDetails && propertyDetails.PropertyType === 'Pent House - Simplex' ? true : false}>Pent House - Simplex</option>
                                            <option defaultValue={propertyDetails && propertyDetails.PropertyType === 'Pent House - Duplex' ? true : false}>Pent House - Duplex</option>
                                        </select>
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">
                                                format_list_bulleted
                                            </span>
                                        </div>
                                    </div>
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
                                            {/* <option value="" selected disabled>
                                                Choose BHK
                                            </option> */}
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === 'EWS' ? true : false}>EWS</option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '1 RK' ? true : false}>1 RK</option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === 'Studio' ? true : false}>Studio</option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '1 ' ? true : false}>1 BHK</option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '1.5 ' ? true : false}>1.5 BHK </option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '2 ' ? true : false}>2 BHK </option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '2.5 ' ? true : false}>2.5 BHK </option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '3 ' ? true : false}>3 BHK </option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '3.5 ' ? true : false}>3.5 BHK </option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '4 ' ? true : false}>4 BHK </option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '5 ' ? true : false}>5 BHK </option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '6 ' ? true : false}>6 BHK </option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '7 ' ? true : false}>7 BHK </option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '8 ' ? true : false}>8 BHK </option>
                                            <option defaultValue={propertyDetails && propertyDetails.Bhk === '9+ ' ? true : false}>9+ BHK </option>
                                        </select>
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">
                                                bedroom_parent
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="form_field st-2 mt-lg-0">
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
                                </div> */}
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
                                            {/* <option value="" selected disabled>
                                                Number Of Bathrooms
                                            </option> */}
                                            {/* <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '0' ? true : false}>0</option> */}
                                            <option defaultValue={propertyDetails && propertyDetails.NumberOfBathrooms === '1' ? true : false}>1</option>
                                            <option defaultValue={propertyDetails && propertyDetails.NumberOfBathrooms === '2' ? true : false}>2</option>
                                            <option defaultValue={propertyDetails && propertyDetails.NumberOfBathrooms === '3' ? true : false}>3</option>
                                            <option defaultValue={propertyDetails && propertyDetails.NumberOfBathrooms === '4' ? true : false}>4</option>
                                            <option defaultValue={propertyDetails && propertyDetails.NumberOfBathrooms === '5' ? true : false}>5</option>
                                            <option defaultValue={propertyDetails && propertyDetails.NumberOfBathrooms === '6+' ? true : false}>6+</option>
                                            {/* <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '7' ? true : false}>7</option>
                                            <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '8' ? true : false}>8</option>
                                            <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '9' ? true : false}>9</option>
                                            <option selected={propertyDetails && propertyDetails.NumberOfBathrooms === '10' ? true : false}>10</option> */}
                                        </select>
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">bathtub</span>
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
                                    <label>Furnishing</label>
                                    <div className="radio_group" style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className="radio_group_single" style={{ width: '100%' }}>
                                            <div
                                                className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === 'Semi'
                                                    ? "radiochecked"
                                                    : ""
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name='group_furnishing'
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
                                        <div className="radio_group_single" style={{ width: '100%' }}>

                                            <div
                                                className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === 'Fully'
                                                    ? "radiochecked"
                                                    : ""
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name='group_furnishing'
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
                                        <div className="radio_group_single" style={{ width: '100%' }}>
                                            <div
                                                className={`custom_radio_button ${propertyDetails && propertyDetails.Furnishing === 'Raw'
                                                    ? "radiochecked"
                                                    : ""
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name='group_furnishing'
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
                                                <option defaultValue={propertyDetails && propertyDetails.CarpetAreaUnit === 'SqFt' ? true : false}>SqFt</option>
                                                <option defaultValue={propertyDetails && propertyDetails.CarpetAreaUnit === 'SqMtr' ? true : false}>SqMtr</option>
                                                <option defaultValue={propertyDetails && propertyDetails.CarpetAreaUnit === 'SqYd' ? true : false}>SqYd</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4'>
                            <button className="theme_btn btn_fill">{propertyid === 'new' ? 'Add Property' : 'Update Property'}</button>
                            {formError && <p className="error">{formError}</p>}
                        </div>
                    </form>
                </div>

                <br />

            </div >
        </div>
    )
}

