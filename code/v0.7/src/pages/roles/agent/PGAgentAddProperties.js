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



const categories = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
]

export default function PGAgentAddProperties({ propertyid }) {
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
    const [taggedOwner, setTaggedOwner] = useState([])
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
        // console.log('users from db: ', documents)
        if (documents) {
            setUsers(documents.map(user => {
                return { value: { ...user, id: user.id }, label: user.fullName + ' ( ' + user.phoneNumber + ' )' }
            }))
        }

        if (masterPropertyPurpose) {
            propertyPurposeOptions.current = masterPropertyPurpose.data.map(propertyPurposeData => ({
                label: propertyPurposeData,
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
        if (taggedOwner.length < 1) {
            setFormError('Please assign the property to at least 1 user')
            return
        }

        console.log('tagged owner details: ', taggedOwner);

        const ownerDetails =
        {
            id: taggedOwner.value.id,
            displayName: taggedOwner.value.fullName,
            phoneNumber: taggedOwner.value.phoneNumber,
            emailID: taggedOwner.value.email,
            photoURL: taggedOwner.value.photoURL,
            role: taggedOwner.value.role
        }


        // const createdBy = {
        //     displayName: user.displayName + '(' + user.role + ')',
        //     photoURL: user.photoURL,
        //     id: user.uid
        // }

        // const updatedBy = {
        //     displayName: user.displayName + '(' + user.role + ')',
        //     photoURL: user.photoURL,
        //     id: user.uid
        // }

        const property = {
            unitNumber,
            ownerDetails,
            country: country.label,
            state: state.label,
            city: city.label,
            locality: locality.label,
            society: society.label,
            category: category,
            purpose: purpose.label,
            status: status,
            postedBy: 'Propdial',
            onboardingDate: timestamp.fromDate(new Date(onboardingDate)),
            comments: []
        }

        if (propertyid) {
            await updateDocument(propertyid, property)

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
                navigate('/pgpropertylist')
            }

            // console.log('addDocument:', property)
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
                    <div className="col-md-6 col-sm-12 d-flex" style={{
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
                    </div>
                </div>
                <div className='d_inner_card'>
                    <form onSubmit={handleSubmit}>
                        <div className="row no-gutters">
                            <div className="col-lg-4">
                                <div className="form_field st-2 mt-lg-0">
                                    <label>Unit Number</label>
                                    <div className="field_inner">
                                        <input required
                                            type="text"
                                            placeholder="e.g. A-504"
                                            maxLength={70}
                                            onChange={(e) => setUnitNumber(e.target.value)}
                                            value={unitNumber} />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">
                                                drive_file_rename_outline
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="form_field st-2 mt-lg-0">
                                    <label>Purpose</label>
                                    <div className="field_inner select">
                                        <Select className=''
                                            onChange={(option) => setPurpose(option)}
                                            options={propertyPurposeOptionsSorted.current}
                                            // value={propertyDocument ? propertyDocument.purpose : purpose}
                                            value={purpose}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    outline: 'none',
                                                    background: '#efefef',
                                                    border: 'none',
                                                    borderBottom: 'none'
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined"> drive_file_rename_outline</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12">
                                <div>
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
                            <div className="col-lg-4">
                                <div className="form_field st-2 mt-lg-0">
                                    <label>Owner: {taggedUsersListShow}</label>
                                    <div className="field_inner select">
                                        <Select className=''
                                            onChange={(option) => setTaggedOwner(option)}
                                            options={usersSorted}
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

                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">   person</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-lg-4">
                                <div className="form_field st-2">
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
                                                    borderBottom: 'none'
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">       public</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-lg-4">
                                <div className="form_field st-2">
                                    <label>State</label>
                                    <div className="field_inner select">
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
                                                    background: '#efefef',
                                                    border: 'none',
                                                    borderBottom: 'none'
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">       emoji_transportation</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-lg-4">
                                <div className="form_field st-2">
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
                                                    borderBottom: 'none'
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">       apartment</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-lg-4">
                                <div className="form_field st-2">
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
                                                    borderBottom: 'none'
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">        holiday_village</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-lg-4">
                                <div className="form_field st-2">
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
                                                    borderBottom: 'none'
                                                }),
                                            }}
                                        />
                                        <div className="field_icon">
                                            <span className="material-symbols-outlined">          home</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='mt-4'>
                            <button className="theme_btn btn_fill">{propertyid ? 'Update Property' : 'Add Property'}</button>
                            {formError && <p className="error">{formError}</p>}
                        </div>
                    </form>
                </div>

                <br />

            </div >
        </div>
    )
}

