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

// styles
import './PGAddProperty.css'
import { el } from 'date-fns/locale'

// component 
import Hero from '../../Components/Hero'

const categories = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
]

export default function PGAddPropertyOld({ propertyid }) {
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end
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

    return (
        <div>     

            <div className='container'>
                <div className="row no-gutters" style={{ margin: '20px 0 0px 0', height: '50px' }}>


                    <div className="col-lg-6 col-md-6 col-sm-12"
                        style={{ background: 'rgba(var(--green-color), 0.5)', padding: ' 0 10px', borderRadius: '8px 0px 0px 8px' }}>
                        <div className="residential-commercial-switch" style={{ height: 'calc(100% - 10px)' }}>
                            <span className={toggleFlag ? '' : 'active'} style={{ color: 'var(--theme-blue)' }}>Residential</span>

                            <div className={toggleFlag ? 'toggle-switch on commercial' : 'toggle-switch off residential'} style={{ padding: '0 10px' }}>
                                {/* <small>{toggleFlag ? 'On' : 'Off'}</small> */}
                                <div onClick={toggleBtnClick}>
                                    <div></div>
                                </div>
                            </div>
                            <span className={toggleFlag ? 'active' : ''} style={{ color: 'var(--red-color)' }}>Commercial</span>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12"
                        style={{ background: 'rgba(var(--green-color), 0.5)', padding: '10px 10px 0 10px', borderRadius: '0px 8px 8px 0px', display:"none" }}>
                        <div className="details-radio">
                            <div></div>
                            <div className='details-radio-inner'>
                                <div className="row no-gutters">
                                    {/* <div className="col-6" style={{ padding: '0 5px' }}>
                    <input type="checkbox" className="checkbox" style={{ width: '0px' }}
                        name="BusinessType" id="businessTypeRent" value="Rent"
                        onClick={() => setPurpose('rent')}
                    />
                    <label className="checkbox-label" for="businessTypeRent">
                        <span className="material-symbols-outlined add">
                            add
                        </span>
                        <span className="material-symbols-outlined done">
                            done
                        </span>
                        <small>Rent</small>
                    </label>
                </div> */}

                                    {/* <div className="col-6" style={{ padding: '0 5px' }}>
                    <input type="checkbox" className="checkbox" style={{ width: '0px' }}
                        name="BusinessType" id="businessTypeSale" value="Sale"
                        onClick={() => setPurpose('sale')}
                    />
                    <label className="checkbox-label" for="businessTypeSale">
                        <span className="material-symbols-outlined add">
                            add
                        </span>
                        <span className="material-symbols-outlined done">
                            done
                        </span>
                        <small>Sale</small>
                    </label>
                </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div style={{ overflow: 'hidden' }}>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="row no-gutters">
                            <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="property-form-border-div" style={{ border: 'none', paddingBottom: '0' }}>
                                    <h1 className="owner-heading">Unit Number</h1>
                                    <div className="location-search">                    
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. A-504"
                                            maxLength={70}
                                            onChange={(e) => setUnitNumber(e.target.value)}
                                            value={unitNumber}
                                        />
                                        <div className="underline"></div>
                                        <span className="material-symbols-outlined">
                                            drive_file_rename_outline
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="property-form-border-div" style={{ border: 'none', paddingBottom: '0' }}>
                                    <h1 className="owner-heading">Purpose</h1>
                                    <div className="location-search">                      

                                        <Select className=''
                                            onChange={(option) => setPurpose(option)}
                                            options={propertyPurposeOptionsSorted.current}
                                            // value={propertyDocument ? propertyDocument.purpose : purpose}
                                            value={purpose}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#eee',
                                                    borderBottom: ' 1px solid var(--theme-blue)'
                                                }),
                                            }}
                                        />
                                        <div className="underline"></div>
                                        <span className="material-symbols-outlined">
                                            drive_file_rename_outline
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="property-form-border-div" style={{ border: 'none', paddingBottom: '0' }}>
                                    <h1 className="owner-heading">Onboarding Date</h1>
                                    <div className="location-search">
                                        <DatePicker
                                            selected={onboardingDate}
                                            maxDate={new Date()}
                                            required
                                            onChange={(onboardingDate) => setOnboardingDate(onboardingDate)}
                                        // value={onboardingDate}
                                        />
                                        <div className="underline"></div>
                                        <span className="material-symbols-outlined">
                                            calendar_month
                                        </span>
                                    </div>
                                </div>
                                <br /><br />
                            </div>

                        </div>

                        <div className="row no-gutters">
                            <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="property-form-border-div">
                                    <h1 className="owner-heading">Tag Users : {taggedUsersListShow}</h1>
                                    <div className="location-search">
                                        <Select className=''
                                            onChange={(option) => setTaggedUsers(option)}
                                            options={usersSorted}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#eee',
                                                    borderBottom: ' 1px solid var(--theme-blue)'
                                                }),
                                            }}
                                            isMulti
                                        />
                                        <div className="underline"></div>
                                        <span className="material-symbols-outlined">
                                            person
                                        </span>
                                    </div>
                                </div></div>
                            <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="property-form-border-div">
                                    <h1 className="owner-heading">Country</h1>
                                    <div className="location-search">
                                        <Select className=''
                                            onChange={handleCountryChange}
                                            options={countryOptionsSorted.current}
                                            value={country}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#eee',
                                                    borderBottom: ' 1px solid var(--theme-blue)'
                                                }),
                                            }}
                                        />
                                        <div className="underline"></div>
                                        <span className="material-symbols-outlined">
                                            public
                                        </span>
                                    </div><br />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="property-form-border-div">
                                    <h1 className="owner-heading">State</h1>
                                    <div className="location-search">
                                        <Select className=''
                                            // onChange={(option) => setState(option)}
                                            onChange={handleStateChange}
                                            options={statesOptionsSorted.current}
                                            // options={stateList}
                                            value={state}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#eee',
                                                    borderBottom: ' 1px solid var(--theme-blue)'
                                                }),
                                            }}
                                        />
                                        <div className="underline"></div>
                                        <span className="material-symbols-outlined">
                                            emoji_transportation
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="property-form-border-div" style={{ border: 'none', }}>
                                        <h1 className="owner-heading">City</h1>
                                        <div className="location-search">
                                            <Select className=''
                                                onChange={handleCityChange}
                                                options={citiesOptionsSorted.current}
                                                value={city}
                                                styles={{
                                                    control: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        outline: 'none',
                                                        background: '#eee',
                                                        borderBottom: ' 1px solid var(--theme-blue)'
                                                    }),
                                                }}
                                            />
                                            <div className="underline"></div>
                                            <span className="material-symbols-outlined">
                                                apartment
                                            </span>
                                        </div><br />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="property-form-border-div" style={{ border: 'none', }}>
                                        <h1 className="owner-heading">Lacality</h1>
                                        <div className="location-search">
                                            <Select className=''
                                                onChange={handleLocalityChange}
                                                options={localityOptionsSorted.current}
                                                value={locality}
                                                styles={{
                                                    control: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        outline: 'none',
                                                        background: '#eee',
                                                        borderBottom: ' 1px solid var(--theme-blue)'
                                                    }),
                                                }}
                                            />
                                            <div className="underline"></div>
                                            <span className="material-symbols-outlined">
                                                holiday_village
                                            </span>
                                        </div><br />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="property-form-border-div" style={{ border: 'none', }}>

                                        <h1 className="owner-heading">Society</h1>
                                        <div className="location-search">
                                            <Select className=''
                                                onChange={(option) => setSociety(option)}
                                                options={societyOptionsSorted.current}
                                                value={society}
                                                styles={{
                                                    control: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        outline: 'none',
                                                        background: '#eee',
                                                        borderBottom: ' 1px solid var(--theme-blue)'
                                                    }),
                                                }}
                                            />
                                            <div className="underline"></div>
                                            <span className="material-symbols-outlined">
                                                home
                                            </span>
                                        </div>

                                        <br />
                                    </div>

                                </div>
                            </div>

                            {/* <div className="col-lg-4 col-md-6 col-sm-12">

            <label>
                <div className='form-field-title'>
                    <span className="material-symbols-outlined">
                        badge
                    </span>
                    <h1>Unit No </h1>
                    <input
                        required
                        type="text"
                        maxLength={70}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>
            </label>

            <label>
                <div className='form-field-title'>
                    <span className="material-symbols-outlined">
                        badge
                    </span>
                    <h1>Property Details </h1>
                    <textarea
                        required
                        type="text"
                        maxLength={70}
                        onChange={(e) => setDetails(e.target.value)}
                        value={details}
                    />
                </div>
            </label>
        </div> */}
                            {/* <label>
            <div className='form-field-title'>
            <span className="material-symbols-outlined">
                badge
            </span>
            <h1>Owners</h1>
            <Select className='select'
                onChange={(option) => setAssignedUsers(option)}
                options={users}
                isMulti
            />
            </div>
        </label> */}
                            {/* <div className="col-lg-6 col-md-6 col-sm-12">
            <label>
                <h1>test</h1>
                <Select className='select'
                    onChange={(option) => setAssignedUsers(option)}
                    options={users}
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused ? 'grey' : 'red',
                            background: 'yellow',
                            zIndex: '999'
                        }),
                    }}
                    isMulti
                />
            </label>
            <label>
                <div className='form-field-title'>
                    <span className="material-symbols-outlined">
                        badge
                    </span>
                    <h1>Country</h1>
                    <Select
                        onChange={(option) => setCategory(option)}
                        options={categories}
                    />
                </div>
            </label>
        </div> */}
                            {/* <div className="col-lg-6 col-md-6 col-sm-12">
            <div style={{ position: 'relative' }}>
                <label>
                    <span style={{
                        position: 'absolute',
                        top: '37px',
                        right: '5px',
                        color: 'var(--theme-blue)',
                        background: '#eee',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: '999',
                        pointerEvents: 'none'
                    }} className="material-symbols-outlined">
                        badge
                    </span>
                    <h1>test</h1>
                    <Select className='select'
                        onChange={(option) => setAssignedUsers(option)}
                        options={users}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                outline: 'none',
                                background: '#eee',
                                borderBottom: ' 3px solid var(--theme-blue)'
                            }),
                        }}
                        isMulti
                    />
                </label>
            </div>

            <label>
                <h1 style={{ fontSize: '0.9rem', fontWeight: 'bolder', paddingLeft: '4px', color: 'var(--theme-blue)' }}>Country</h1>
                <Select
                    onChange={(option) => setCategory(option)}
                    options={categories}
                />
            </label>
        </div> */}
                            {/* <label>
            <span>Set Onboarding Date:</span>
            <input
                required
                type="date"
                onChange={(e) => setDueDate(e.target.value)}
                value={onboardingDate}
            />
        </label> */}


                        </div>
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className="theme_btn btn_fill">{propertyid ? 'Update Property' : 'Add Property'}</button>
                            {formError && <p className="error">{formError}</p>}
                        </div>
                        <br />
                    </form>
                    <br /><br />

                    {/* <br /><hr />
<br /><br /><br /><br /> */}
                    {/* <div className="row no-gutters section-btn-div">
    <div className="col-12">
        <div className="section-btn">
            <a href="propertyList.html" style={{ textDecoration: 'none', width: '100%' }}>
                <button type="button" name="button" onclick="addPropertyMenu('Details')"
                    className="mybutton button5">
                    Add
                </button>
            </a>

        </div>
    </div>
</div> */}
                </div >
            </div>

        </div >
    )
}

