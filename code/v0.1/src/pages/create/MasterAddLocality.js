import { useState, useEffect, useRef } from 'react'
import { projectFirestore } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useCollection } from '../../hooks/useCollection'
import Select from 'react-select'

export default function MasterAddLocality() {
    const { addDocument, response } = useFirestore('m_localities')
    const { documents: masterLocality, error: masterCityerror } = useCollection('m_localities')
    // const { documents: masterState, error: masterStateerror } = useCollection('m_states')
    const { documents: masterCountry, error: masterCountryerror } = useCollection('m_countries')
    // console.log('masterCountry:', masterCountry)
    const [country, setCountry] = useState({ label: 'INDIA', value: 'INDIA' })
    const [countryList, setCountryList] = useState()
    const [state, setState] = useState()
    const [city, setCity] = useState()
    const [locality, setLocality] = useState()
    const [formError, setFormError] = useState(null)

    let countryOptions = useRef([]);
    let countryOptionsSorted = useRef([]);
    let stateOptions = useRef([]);
    let stateOptionsSorted = useRef([]);
    let cityOptions = useRef([]);
    let cityOptionsSorted = useRef([]);

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

    //Country select onchange
    const handleStateChange = async (option) => {
        setState(option)
        let statename = option.label;
        // console.log('statename:', statename)
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
                }
                else {
                    setCity({ label: cityOptionsSorted.current[0].label, value: cityOptionsSorted.current[0].value })
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

    let results = []
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        let localityname = locality.trim().toUpperCase();

        let ref = projectFirestore.collection('m_localities').where("locality", "==", localityname)
        const unsubscribe = ref.onSnapshot(async snapshot => {
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
            });

            if (results.length === 0) {
                const dataSet = {
                    country: country.label,
                    state: state.label,
                    city: city.label,
                    locality: localityname,
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

    return (
        <div>
            <div className='page-title'>
                <span className="material-symbols-outlined">
                    flag
                </span>
                <h1>Add Locality </h1>
            </div>

            <div style={{ overflow: 'hidden' }}>
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
                                            borderBottom: ' 1px solid var(--blue-color)'
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
                                            borderBottom: ' 1px solid var(--blue-color)'
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
                                    onChange={(option) => setCity(option)}
                                    options={cityOptionsSorted.current}
                                    // options={stateList}
                                    value={city}
                                    styles={{
                                        control: (baseStyles, state) => ({
                                            ...baseStyles,
                                            outline: 'none',
                                            background: '#eee',
                                            borderBottom: ' 1px solid var(--blue-color)'
                                        }),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div>
                                <br />
                                <h1 className="owner-heading">New Locality</h1>
                                <input
                                    required
                                    type="text"
                                    placeholder='Entry Locality Name'
                                    onChange={(e) => setLocality(e.target.value)}
                                    value={locality}
                                    styles={{
                                        backgroundColor: 'red',
                                        borderBottom: ' 5px solid var(--blue-color)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <button className="btn">Add Locality</button>
                        {formError && <div className="error">{formError}</div>}
                    </div>
                    <br />
                </form>
            </div >
            <div className="row no-gutters">
                {masterLocality && masterLocality.length === 0 && <p>No City Yet!</p>}
                {masterLocality && masterLocality.map(data => (<>
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                        <div className="property-status-padding-div">
                            <div className="profile-card-div" style={{ position: 'relative' }}>
                                <div className="address-div" style={{ paddingBottom: '5px' }}>
                                    <div className="icon">
                                        <span className="material-symbols-outlined" style={{ color: 'var(--darkgrey-color)' }}>
                                            flag
                                        </span>
                                    </div>
                                    <div className="address-text">
                                        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                                            <h5 style={{ margin: '0' }}>{data.locality}  </h5>
                                            <small style={{ margin: '0' }}>{data.city}, {data.state}, {data.country}</small>
                                        </div>
                                        <div className="">
                                            <small style={{ margin: '0' }}>{data.status}</small>
                                            <span className="material-symbols-outlined">
                                                chevron_right
                                            </span>
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

