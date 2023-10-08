import { useState, useEffect, useRef } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp, projectFirestore } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useDocument } from '../../hooks/useDocument'
import { useLocation } from "react-router-dom";
import Select from 'react-select'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Navigate, Link } from "react-router-dom";


// styles
import './PGAddProperty.css'
import { el } from 'date-fns/locale'

// component 
import Hero from '../../Components/Hero'
import PropertySidebar from '../../Components/PropertySidebar'

const categories = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
]

export default function PGAddProperty({ propertyid }) {
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    // radio button check
    // Initialize state for each radio button
    const [selectedRadioOption, setRadioSelectedOption] = useState('by_default_check');

    // Function to handle radio button selection
    const handleRadioCheck = (event) => {
        setRadioSelectedOption(event.target.value);
    };
    // radio button check

    const navigate = useNavigate()
    const { document: propertyDocument, error: propertyerror } = useDocument('properties', propertyid)
    const { addDocument, response: addDocumentResponse } = useFirestore('properties')
    const { updateDocument, response: updateDocumentResponse } = useFirestore('properties')

    const { user } = useAuthContext()
    const [users, setUsers] = useState([])

    const { documents } = useCollection('users')

    const [toggleFlag, setToggleFlag] = useState(false)

    // form field values
    const [unitNumber, setUnitNumber] = useState('')
    const [taggedUsers, setTaggedUsers] = useState([])
    const { document: masterPropertyPurpose, error: masterPropertyPurposeerror } = useDocument('master', 'PROPERTYPURPOSE')
    const { documents: masterCountry, error: masterCountryerror } = useCollection('m_countries')
    const [country, setCountry] = useState({ label: 'INDIA', value: 'INDIA' })
    const [state, setState] = useState()
    const [city, setCity] = useState()
    const [cityList, setCityList] = useState([])

    const [localityList, setLocalityList] = useState([])
    const [locality, setLocality] = useState()

    const [society, setSociety] = useState('')
    const [category, setCategory] = useState('residential') //Residential/Commercial
    const [purpose, setPurpose] = useState()
    const [status, setStatus] = useState('active')
    // const today = new Date();
    // const formattedDate = format(today, 'yyyy-MM-dd');
    const [onboardingDate, setOnboardingDate] = useState(new Date())
    const [formError, setFormError] = useState(null)

    let taggedUsersListShow = '';
    if (propertyDocument) {
        let taggedUsersListCount = propertyDocument.taggedUsersList.length;
        // console.log('taggedUsersListCount', taggedUsersListCount)
        for (var i = 0; i < taggedUsersListCount; i++) {
            if (propertyDocument.taggedUsersList) {
                // console.log('propertyDocument.taggedUsersList:', propertyDocument.taggedUsersList[i])
                if (taggedUsersListShow === '')
                    taggedUsersListShow = propertyDocument.taggedUsersList[i].displayName + '(' + propertyDocument.taggedUsersList[i].phoneNumber + ')';
                else
                    taggedUsersListShow = taggedUsersListShow + ', ' + propertyDocument.taggedUsersList[i].displayName + '(' + propertyDocument.taggedUsersList[i].phoneNumber + ')';
            }
        }
    }

    const propertyPurposeOptions = useRef([]);
    const propertyPurposeOptionsSorted = useRef([]);
    let countryOptions = useRef([]);
    let countryOptionsSorted = useRef([]);
    let statesOptions = useRef([]);
    let statesOptionsSorted = useRef([]);
    let citiesOptions = useRef([]);
    let citiesOptionsSorted = useRef([]);
    let localityOptions = useRef([]);
    let localityOptionsSorted = useRef([]);
    let societyOptions = useRef([]);
    let societyOptionsSorted = useRef([]);

    useEffect(() => {
        // console.log('in useeffect')
        if (documents) {
            setUsers(documents.map(user => {
                return { value: { ...user, id: user.id }, label: user.fullName + ' ( ' + user.phoneNumber + ' )' }
            }))
        }

        if (masterPropertyPurpose) {
            propertyPurposeOptions.current = masterPropertyPurpose.data.map(propertyPurposeData => ({
                label: propertyPurposeData.toUpperCase(),
                value: propertyPurposeData
            }))

            propertyPurposeOptionsSorted.current = propertyPurposeOptions.current.sort((a, b) =>
                a.label.localeCompare(b.label)
            );
        }

        if (masterCountry) {
            countryOptions.current = masterCountry.map(countryData => ({
                label: countryData.country,
                value: countryData.country
            }))

            countryOptionsSorted.current = countryOptions.current.sort((a, b) =>
                a.label.localeCompare(b.label)
            );
            handleCountryChange(country)
        }

        if (propertyDocument) {
            setCategory(propertyDocument.category)
            if (propertyDocument.category.toUpperCase() === 'RESIDENTIAL')
                setToggleFlag(false);
            else
                setToggleFlag(true);

            setUnitNumber(propertyDocument.unitNumber)
            setPurpose({ label: propertyDocument.purpose })
            const date = new Date(propertyDocument.onboardingDate.seconds * 1000);
            setOnboardingDate(date)
            setCountry({ label: propertyDocument.country })
            setState({ label: propertyDocument.state })
            setCity({ label: propertyDocument.city })
            setLocality({ label: propertyDocument.locality })
            setSociety({ label: propertyDocument.society })
        }

    }, [documents, propertyDocument, masterPropertyPurpose])


    const toggleBtnClick = () => {
        // console.log('toggleClick Category:', toggleFlag)
        if (toggleFlag)
            setCategory('residential')
        else
            setCategory('commercial')

        setToggleFlag(!toggleFlag);
    };

    const usersSorted = users.sort((a, b) =>
        a.label.localeCompare(b.label)
    );

    // Load dropdowns with db values
    //Load data into Country dropdown    
    //Country select onchange
    const handleCountryChange = async (option) => {
        setCountry(option)
        let countryname = option.label;
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

                if (countryname === 'INDIA') {
                    setState({ label: 'DELHI', value: 'DELHI' })
                    handleStateChange({ label: 'DELHI', value: 'DELHI' })
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

    const handleStateChange = async (option) => {
        setState(option)
        let statename = option.label;
        console.log('statename:', statename)
        const ref = await projectFirestore.collection('m_cities').where("state", "==", statename)
        ref.onSnapshot(async snapshot => {
            if (snapshot.docs) {
                citiesOptions.current = snapshot.docs.map(cityData => ({
                    label: cityData.data().city,
                    value: cityData.data().city
                }))

                citiesOptionsSorted.current = citiesOptions.current.sort((a, b) =>
                    a.label.localeCompare(b.label)
                );

                if (statename === 'DELHI') {
                    setCity({ label: 'DELHI', value: 'DELHI' })
                    handleCityChange({ label: 'DELHI', value: 'DELHI' })
                }
                else {
                    setCity({ label: citiesOptionsSorted.current[0].label, value: citiesOptionsSorted.current[0].value })
                    handleCityChange({ label: citiesOptionsSorted.current[0].label, value: citiesOptionsSorted.current[0].value })
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

    //City select onchange
    const handleCityChange = async (option) => {
        setCity(option)
        let cityname = option.label;
        console.log('cityname:', cityname)
        const ref = await projectFirestore.collection('m_localities').where("city", "==", cityname)
        ref.onSnapshot(async snapshot => {
            if (snapshot.docs) {
                localityOptions.current = snapshot.docs.map(localityData => ({
                    label: localityData.data().locality,
                    value: localityData.data().locality
                }))

                localityOptionsSorted.current = localityOptions.current.sort((a, b) =>
                    a.label.localeCompare(b.label)
                );

                setLocality({ label: localityOptionsSorted.current[0].label, value: localityOptionsSorted.current[0].value })
                handleLocalityChange({ label: localityOptionsSorted.current[0].label, value: localityOptionsSorted.current[0].value })

            }
            else {
                // setError('No such document exists')
            }
        }, err => {
            console.log(err.message)
            // setError('failed to get document')
        })
    }

    //Locality select onchange
    const handleLocalityChange = async (option) => {
        setLocality(option)
        let localityname = option.label;
        // console.log('cityname:', localityname)
        const ref = await projectFirestore.collection('m_societies').where("locality", "==", localityname)
        ref.onSnapshot(async snapshot => {
            if (snapshot.docs) {
                societyOptions.current = snapshot.docs.map(societyData => ({
                    label: societyData.data().society,
                    value: societyData.data().society
                }))

                societyOptionsSorted.current = societyOptions.current.sort((a, b) =>
                    a.label.localeCompare(b.label)
                );

                setSociety({ label: societyOptionsSorted.current[0].label, value: societyOptionsSorted.current[0].value })
                // setSociety({ label: societyOptionsSorted.current.label, value: societyOptionsSorted.current.value })
                // handleCityChange({ label: statesOptionsSorted.current[0].label, value: statesOptionsSorted.current[0].value })
            }
            else {
                // setError('No such document exists')
            }
        }, err => {
            console.log(err.message)
            // setError('failed to get document')
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        if (!category) {
            setFormError('Please select a property category.')
            return
        }
        if (taggedUsers.length < 1) {
            setFormError('Please assign the property to at least 1 user')
            return
        }

        const taggedUsersList = taggedUsers.map(u => {
            return {
                id: u.value.id,
                displayName: u.value.fullName,
                phoneNumber: u.value.phoneNumber,
                photoURL: u.value.photoURL,
                role: u.value.role
            }
        })

        const createdBy = {
            displayName: user.displayName + '(' + user.role + ')',
            photoURL: user.photoURL,
            id: user.uid
        }

        const updatedBy = {
            displayName: user.displayName + '(' + user.role + ')',
            photoURL: user.photoURL,
            id: user.uid
        }

        const property = {
            unitNumber,
            taggedUsersList,
            country: country.label,
            state: state.label,
            city: city.label,
            locality: locality.label,
            society: society.label,
            category: category,
            purpose: purpose.label,
            status: status,
            updatedBy,
            onboardingDate: timestamp.fromDate(new Date(onboardingDate)),
            comments: []
        }

        if (propertyid) {
            await updateDocument(propertyid, {
                unitNumber: unitNumber,
                taggedUsersList,
                country: country.label,
                state: state.label,
                city: city.label,
                locality: locality.label,
                society: society.label,
                category,
                purpose: purpose.label,
                status: status,
                createdBy,
                onboardingDate: timestamp.fromDate(new Date(onboardingDate)),
                comments: []
            })
            if (updateDocumentResponse.error) {
                // console.log('updateDocument Error:', updateDocumentResponse.error)
                navigate('/')
            }
            else {
                // console.log('Property Udpated Successfully:', property)
            }
        }
        else {
            await addDocument(property)
            if (addDocumentResponse.error) {
                navigate('/error')
            }
            else {
                navigate('/admindashboard')
            }

            // console.log('addDocument:', property)
        }

    }
    // sticky top property details - start

    function openPropertyDetails(propertyDetails) {
        propertyDetails.classList.toggle('open');
    }

    // sticky top property details - end

    return (
        <div className='dashboard_pg aflbg property_setup'>
            <div className="sidebarwidth">
                <PropertySidebar />
            </div>
            <div className="right_main_content">
                <div className='property-detail'>
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
                                    <div className='inner'>
                                        <div className='left'>
                                            <h5>A-502</h5>
                                            <h6>High Mont Society,<br />Hinjewadi, Pune</h6>

                                        </div>
                                        <div className='right'>
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
                                            <div class="property-contact-div property-media-icons-horizontal"
                                                style={{ flexDirection: "row", width: "100%", height: "auto" }}>
                                                <div>
                                                    <span class="material-symbols-outlined">
                                                        call
                                                    </span>
                                                    <h1>Call</h1>
                                                </div>
                                                <div>
                                                    <img src="./assets/img/whatsapp_square_icon.png" alt="" />
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
                                            <div class="property-contact-div property-media-icons-horizontal"
                                                style={{ flexDirection: "row", width: "100%", height: "auto" }}>
                                                <div>
                                                    <span class="material-symbols-outlined">
                                                        call
                                                    </span>
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
                <div className="row no-gutters" style={{ margin: '10px 0px ', height: '50px', background: "white" }}>
                    <div className="col-lg-6 col-md-6 col-sm-12"
                    >
                        <div className="residential-commercial-switch" style={{ height: 'calc(100% - 10px)' }}>
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
                </div>
                <form>
                    <Tabs>
                        <TabList>
                            <Tab className="pointer">Basic</Tab>
                            <Tab className="pointer">Details</Tab>
                            <Tab className="pointer">More</Tab>
                        </TabList>
                        <TabPanel className="basic_detail">
                            <div className='row no-gutters'>
                                <div className='col-lg-4 first_col'>
                                    <div className='form_field st-2'>
                                        <label>
                                            Owner Name
                                        </label>
                                        <div className='field_inner select'>
                                            <select>
                                                <option value="" selected disabled>Select Owner</option>
                                                <option>1</option>
                                                <option>2</option>
                                            </select>
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    person
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            Co-Owner Name
                                        </label>
                                        <div className='field_inner select'>
                                            <select>
                                                <option value="" selected disabled>Select Co-Owner</option>
                                                <option>1</option>
                                                <option>2</option>
                                            </select>
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    group
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            Address Locator
                                        </label>
                                        <div className='field_inner'>
                                            <input type="text" placeholder="Enter Property Unit Number" />
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    map
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            Country
                                        </label>
                                        <div className='field_inner select'>
                                            <select>
                                                <option value="" selected>India</option>
                                                <option value="">Denmark</option>
                                                <option value="">Malasia</option>
                                                <option value="">China</option>
                                            </select>
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    public
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            State
                                        </label>
                                        <div className='field_inner select'>
                                            <select>
                                                <option value="" selected>Delhi</option>
                                                <option value="">Harayana</option>
                                                <option value="">Uttar Pradesh</option>
                                                <option value="">Maharashtra</option>
                                            </select>
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    emoji_transportation
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            City
                                        </label>
                                        <div className='field_inner select'>
                                            <select>
                                                <option value="" selected>Delhi</option>
                                                <option value="">Gurugram</option>
                                                <option value="">Noida</option>
                                                <option value="">Pune</option>
                                                <option value="">Hyderabad</option>
                                            </select>
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    apartment
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            Locality
                                        </label>
                                        <div className='field_inner select'>
                                            <select>
                                                <option value="" selected>Malviya Nagar</option>
                                                <option value="">Dwarka</option>
                                                <option value="">Rajori Garden</option>
                                                <option value="">Lajpat Nagar</option>
                                                <option value="">Saraojni Nagar</option>
                                            </select>
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    holiday_village
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            Pin Code
                                        </label>
                                        <div className='field_inner'>
                                            <input type="number" placeholder="Enter Pin Code" />
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    drive_file_rename_outline
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            Society
                                        </label>
                                        <div className='field_inner select'>
                                            <select>
                                                <option value="" selected disabled>Choose Society</option>
                                                <option value="">Society 1</option>
                                                <option value="">Society 2</option>
                                                <option value="">Society 3</option>
                                                <option value="">Society 4</option>
                                            </select>
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    holiday_village
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            Unit Number
                                        </label>
                                        <div className='field_inner'>
                                            <input type="text" placeholder="Enter Property Unit Number" />
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    drive_file_rename_outline
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            Property Type
                                        </label>
                                        <div className='field_inner select'>
                                            <select>
                                                <option value="" selected disabled>Choose Property Type</option>
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
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    format_list_bulleted
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            Year of Constuction
                                        </label>
                                        <div className='field_inner select'>
                                            <select>
                                                <option value="" disabled>Year of Constuction</option>
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
                                                <option value="" selected>2010</option>
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
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    engineering
                                                </span>
                                            </div>


                                        </div>
                                        <h6 className='dec_related_to_input'>Age Of Property is 12 Years
                                        </h6>
                                    </div>
                                    <div className='form_field st-2'>
                                        <label>
                                            BHK
                                        </label>
                                        <div className='field_inner select'>
                                            <select>
                                                <option value="" selected disabled>Choose BHK</option>
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
                                            <div className='field_icon'>
                                                <span class="material-symbols-outlined">
                                                    bedroom_parent
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                    <div className='form_field st-2'>
                                        <div className='form_field st-2'>
                                            <div className='radio_group'>
                                                <div className='radio_group_single'>
                                                    <div className={`custom_radio_button ${selectedRadioOption === 'by_default_check' ? 'radiochecked' : ''}`}>
                                                        <input
                                                            type="radio"
                                                            id="semi_furnished"
                                                            value="semi_furnished"
                                                            checked={selectedRadioOption === 'by_default_check'}
                                                            onChange={handleRadioCheck}
                                                        />
                                                        <label htmlFor="semi_furnished">
                                                            <div className="radio_icon">
                                                                <span className="material-symbols-outlined add">add</span>
                                                                <span className="material-symbols-outlined check">done</span>
                                                            </div>
                                                            <h6>Semi</h6>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className='radio_group_single'>
                                                    <div className={`custom_radio_button ${selectedRadioOption === 'fully_furnished' ? 'radiochecked' : ''}`}>
                                                        <input
                                                            type="radio"
                                                            id="fully_furnished"
                                                            value="fully_furnished"
                                                            checked={selectedRadioOption === 'fully_furnished'}
                                                            onChange={handleRadioCheck}
                                                        />
                                                        <label htmlFor="fully_furnished">
                                                            <div className="radio_icon">
                                                                <span className="material-symbols-outlined add">add</span>
                                                                <span className="material-symbols-outlined check">done</span>
                                                            </div>
                                                            <h6>Fully</h6>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className='radio_group_single'>
                                                    <div className={`custom_radio_button ${selectedRadioOption === 'raw_furnished' ? 'radiochecked' : ''}`}>
                                                        <input
                                                            type="radio"
                                                            id="raw_furnished"
                                                            value="raw_furnished"
                                                            checked={selectedRadioOption === 'raw_furnished'}
                                                            onChange={handleRadioCheck}
                                                        />
                                                        <label htmlFor="raw_furnished">
                                                            <div className="radio_icon">
                                                                <span className="material-symbols-outlined add">add</span>
                                                                <span className="material-symbols-outlined check">done</span>
                                                            </div>
                                                            <h6>Raw</h6>
                                                        </label>
                                                    </div>
                                                </div>
                                             
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className='col-lg-4 second_col'>
                                    hi
                                </div>
                                <div className='col-lg-4 third_col'>
                                    hi
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            hello
                        </TabPanel>
                    </Tabs>
                </form>
            </div>
        </div >
    )
}

