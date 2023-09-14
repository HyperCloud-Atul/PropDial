import { useState, useEffect, useRef } from 'react'
import { projectFirestore } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useCollection } from '../../hooks/useCollection'
import Select from 'react-select'
import { Link } from 'react-router-dom'

export default function MasterSocietyList() {
    const { addDocument, response } = useFirestore('m_societies')
    const { updateDocument, response: responseUpdateDocument } = useFirestore('m_societies')
    const { documents: masterSociety, error: masterSocietyerror } = useCollection('m_societies')
    // const { documents: masterState, error: masterStateerror } = useCollection('m_states')
    const { documents: masterCountry, error: masterCountryerror } = useCollection('m_countries')
    // console.log('masterCountry:', masterCountry)
    const [country, setCountry] = useState({ label: 'INDIA', value: 'INDIA' })
    const [countryList, setCountryList] = useState()
    const [state, setState] = useState()
    const [city, setCity] = useState()
    const [locality, setLocality] = useState()
    const [society, setSociety] = useState()
    const [formError, setFormError] = useState(null)
    const [formBtnText, setFormBtnText] = useState('')
    const [currentDocid, setCurrentDocid] = useState(null)


    let countryOptions = useRef([]);
    let countryOptionsSorted = useRef([]);
    let stateOptions = useRef([]);
    let stateOptionsSorted = useRef([]);
    let cityOptions = useRef([]);
    let cityOptionsSorted = useRef([]);
    let localityOptions = useRef([]);
    let localityOptionsSorted = useRef([]);

    useEffect(() => {
        // console.log('in useeffect')
        if (masterCountry) {
            countryOptions.current = masterCountry.map(countryData => ({
                label: countryData.country,
                value: countryData.country
            }))

            countryOptionsSorted.current = countryOptions.current.sort((a, b) =>
                a.label.localeCompare(b.label)
            );

            setCountryList(countryOptionsSorted.current)

            handleCountryChange(country)
        }

    }, [masterCountry])


    //Country select onchange
    const handleCountryChange = async (option) => {
        setCountry(option)
        let countryname = option.label;
        // console.log('countryname:', countryname)
        const ref = await projectFirestore.collection('m_states').where("country", "==", countryname)
        ref.onSnapshot(async snapshot => {
            if (snapshot.docs) {
                stateOptions.current = snapshot.docs.map(stateData => ({
                    label: stateData.data().state,
                    value: stateData.data().state
                }))
                // console.log('stateOptions:', stateOptions)
                stateOptionsSorted.current = stateOptions.current.sort((a, b) =>
                    a.label.localeCompare(b.label)
                );

                // console.log('stateOptionsSorted.current:', stateOptionsSorted.current)
                if (countryname === 'INDIA') {
                    setState({ label: 'DELHI', value: 'DELHI' })
                    handleStateChange({ label: 'DELHI', value: 'DELHI' })
                }
                else {
                    setState({ label: stateOptionsSorted.current[0].label, value: stateOptionsSorted.current[0].value })
                    handleStateChange({ label: stateOptionsSorted.current[0].label, value: stateOptionsSorted.current[0].value })
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

    //Stae select onchange
    const handleStateChange = async (option) => {
        setState(option)
        // console.log('option.label:', option.label)
        let statename = option.label;

        const ref = await projectFirestore.collection('m_cities').where("state", "==", statename)
        ref.onSnapshot(async snapshot => {
            if (snapshot.docs) {
                cityOptions.current = snapshot.docs.map(cityData => ({
                    label: cityData.data().city,
                    value: cityData.data().city
                }))
                cityOptionsSorted.current = cityOptions.current.sort((a, b) =>
                    a.label.localeCompare(b.label)
                );

                if (statename === 'DELHI') {
                    setCity({ label: 'DELHI', value: 'DELHI' })
                    handleCityChange({ label: 'DELHI', value: 'DELHI' })
                }
                else {
                    setCity({ label: cityOptionsSorted.current[0].label, value: cityOptionsSorted.current[0].value })
                    handleCityChange({ label: cityOptionsSorted.current[0].label, value: cityOptionsSorted.current[0].value })
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
        // console.log('statename:', statename)
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

            }
            else {
                // setError('No such document exists')
            }
        }, err => {
            console.log(err.message)
            // setError('failed to get document')
        })
    }

    let results = []
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        let societyname = society.trim().toUpperCase();

        if (currentDocid) {
            await updateDocument(currentDocid, {
                country: country.label,
                state: state.label,
                city: city.label,
                locality: locality.label,
                society: societyname
            })
            setFormError('Successfully updated')
        }
        else {

            let ref = projectFirestore.collection('m_societies').where("society", "==", societyname)
            const unsubscribe = ref.onSnapshot(async snapshot => {
                snapshot.docs.forEach(doc => {
                    results.push({ ...doc.data(), id: doc.id })
                });

                if (results.length === 0) {
                    const dataSet = {
                        country: country.label,
                        state: state.label,
                        city: city.label,
                        locality: locality.label,
                        society: societyname,
                        status: 'active'
                    }
                    await addDocument(dataSet)
                    setFormError('Successfully added')
                }
                else {
                    setFormError('Already added')
                }
            })
        }
    }

    const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);

    const openMoreAddOptions = () => {
        setHandleMoreOptionsClick(true)
    }
    const closeMoreAddOptions = () => {
        setHandleMoreOptionsClick(false)
    }

    const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
    const handleAddSection = () => {
        setFormError(null)
        sethandleAddSectionFlag(true)
        setFormBtnText('Add Society')
        handleCountryChange(country)
        setSociety('')
        setCurrentDocid(null)
    }

    // const [cityStatus, setCityStatus] = useState();
    const handleChangeStatus = async (docid, status) => {
        // console.log('docid:', docid)
        if (status === 'active')
            status = 'inactive'
        else
            status = 'active'
        await updateDocument(docid, {
            status
        })
    }

    const handleEditCard = (docid, doccountry, docstate, doccity, doclocality, docsociety) => {
        // console.log('data:', data)
        setFormError(null)
        setCountry({ label: doccountry, value: doccountry })
        setState({ label: docstate, value: docstate })
        setCity({ label: doccity, value: doccity })
        setLocality({ label: doclocality, value: doclocality })
        setSociety(docsociety)
        sethandleAddSectionFlag(true)
        setFormBtnText('Update Society')
        setCurrentDocid(docid)
    }

    return (
        <div>

            <div onClick={openMoreAddOptions} className="property-list-add-property">
                <span className="material-symbols-outlined">
                    apps
                </span>
            </div>

            <div className={handleMoreOptionsClick ? 'more-add-options-div open' : 'more-add-options-div'}
                onClick={closeMoreAddOptions} id="moreAddOptions">

                <div className='more-add-options-inner-div'>

                    <div className="more-add-options-icons">
                        <h1>Close</h1>
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </div>

                    <Link to='/countrylist' className="more-add-options-icons">
                        <h1>Country List</h1>
                        <span className="material-symbols-outlined">
                            public
                        </span>
                    </Link>

                    <Link to='/statelist' className="more-add-options-icons">
                        <h1>State List</h1>
                        <span className="material-symbols-outlined">
                            map
                        </span>
                    </Link>

                    <Link to='/citylist' className="more-add-options-icons" >
                        <h1>City List</h1>
                        <span className="material-symbols-outlined">
                            location_city
                        </span>
                    </Link>

                    <Link to='/localitylist' className="more-add-options-icons" >
                        <h1>Locality List</h1>
                        <span className="material-symbols-outlined">
                            holiday_village
                        </span>
                    </Link>

                    <div onClick={handleAddSection} className="more-add-options-icons active" >
                        <h1>Add Society</h1>
                        <span className="material-symbols-outlined">
                            add
                        </span>
                    </div>

                </div>

            </div>

            <div className='page-title'>
                <span className="material-symbols-outlined">
                    flag
                </span>
                <h1>Society List </h1>
            </div>

            <div style={{
                overflow: 'hidden',
                transition: '2s',
                opacity: handleAddSectionFlag ? '1' : '0',
                maxHeight: handleAddSectionFlag ? '800px' : '0',
            }}>
                {/* <form onSubmit={handleSubmit} className="auth-form"> */}
                <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '350px' }}>
                    <div className="row no-gutters">
                        <div className="col-12">
                            <div>
                                <br />
                                <h1 className="owner-heading">Country</h1>
                                <Select className=''
                                    onChange={handleCountryChange}
                                    // options={countryOptionsSorted.current}
                                    options={countryList}
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
                            </div>
                        </div>
                        <div className="col-12">
                            <div>
                                <br />
                                <h1 className="owner-heading">State</h1>
                                <Select className=''
                                    onChange={handleStateChange}
                                    options={stateOptionsSorted.current}
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
                            </div>
                        </div>
                        <div className="col-12">
                            <div>
                                <br />
                                <h1 className="owner-heading">City</h1>
                                <Select className=''
                                    onChange={handleCityChange}
                                    options={cityOptionsSorted.current}
                                    // options={stateList}
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
                            </div>
                        </div>
                        <div className="col-12">
                            <div>
                                <br />
                                <h1 className="owner-heading">Locality</h1>
                                <Select className=''
                                    onChange={(option) => setLocality(option)}
                                    options={localityOptionsSorted.current}
                                    // options={stateList}
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
                            </div>
                        </div>
                        <div className="col-12">
                            <div>
                                <br />
                                <h1 className="owner-heading">New Society</h1>
                                <input
                                    required
                                    type="text"
                                    placeholder='Entry Locality Name'
                                    onChange={(e) => setSociety(e.target.value)}
                                    value={society}
                                    styles={{
                                        backgroundColor: 'red',
                                        borderBottom: ' 5px solid var(--theme-blue)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <button className="btn">{formBtnText}</button>
                        <br />
                        {formError && <div style={{ margin: '0' }} className="error">{formError}</div>}
                    </div>
                    <br />
                </form>
            </div >
            <hr></hr>
            <div className="row no-gutters">
                {masterSociety && masterSociety.length === 0 && <p>No City Yet!</p>}
                {masterSociety && masterSociety.map(data => (<>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                        <div className="property-status-padding-div">
                            <div className="profile-card-div" style={{ position: 'relative' }}>
                                <div className="address-div" style={{ paddingBottom: '5px' }}>
                                    <div className="icon" style={{ position: 'relative', top: '-1px' }}>
                                        <span className="material-symbols-outlined" style={{ color: 'var(--darkgrey-color)' }}>
                                            flag
                                        </span>
                                    </div>
                                    <div className="address-text">
                                        <div onClick={() => handleEditCard(data.id, data.country, data.state, data.city, data.locality, data.society)}
                                            style={{
                                                width: '80%',
                                                height: '170%',
                                                textAlign: 'left',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                                transform: 'translateY(-7px)',
                                                cursor: 'pointer',
                                            }}>
                                            <h5 style={{ margin: '0', transform: 'translateY(5px)' }}>{data.society}  </h5>
                                            <small style={{ margin: '0', transform: 'translateY(5px)' }}>{data.locality}, {data.city}, {data.state}, {data.country}</small>
                                        </div>
                                        <div className="" onClick={() => handleChangeStatus(data.id, data.status)}
                                            style={{
                                                width: '20%',
                                                height: 'calc(100% - -20px)',
                                                position: 'relative',
                                                top: '-8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                cursor: 'pointer',
                                            }}>
                                            <small style={{
                                                margin: '0',
                                                background: data.status === 'active' ? 'green' : 'red',
                                                color: '#fff',
                                                padding: '3px 10px 3px 10px',
                                                borderRadius: '4px',
                                            }}>{data.status}</small>
                                            {/* <span className="material-symbols-outlined">
                                                chevron_right
                                            </span> */}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
                ))}
            </div>
        </div >
    )
}

