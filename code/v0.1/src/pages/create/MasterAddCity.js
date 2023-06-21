import { useState, useEffect, useRef } from 'react'
import { projectFirestore } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useCollection } from '../../hooks/useCollection'
import Select from 'react-select'

export default function MasterAddCity() {
    const { addDocument, response } = useFirestore('m_states')
    const { documents: masterCity, error: masterCityerror } = useCollection('m_cities')
    // const { documents: masterState, error: masterStateerror } = useCollection('m_states')
    const { documents: masterCountry, error: masterCountryerror } = useCollection('m_countries')

    const [country, setCountry] = useState({ label: 'INDIA', value: 'INDIA' })
    const [state, setState] = useState()
    const [city, setCity] = useState()
    const [formError, setFormError] = useState(null)

    let countryOptions = useRef([]);
    let countryOptionsSorted = useRef([]);
    let stateOptions = useRef([]);
    let stateOptionsSorted = useRef([]);

    useEffect(() => {
        console.log('in useeffect')
        if (masterCountry) {
            countryOptions.current = masterCountry.map(countryData => ({
                label: countryData.country,
                value: countryData.country
            }))

            countryOptionsSorted.current = countryOptions.current.sort((a, b) =>
                a.label.localeCompare(b.label)
            );

            console.log('countryOptionsSorted:', countryOptionsSorted)

            // handleCountryChange(country)
        }

    }, [])



    // if (masterState) {
    //     stateOptions.current = masterState.map(stateData => ({
    //         label: stateData.state,
    //         value: stateData.state
    //     }))

    //     stateOptionsSorted.current = stateOptions.current.sort((a, b) =>
    //         a.label.localeCompare(b.label)
    //     );
    // }

    //Country select onchange
    const handleCountryChange = async (option) => {
        setCountry(option)
        let countryname = option.label;
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
                }
                else {
                    setState({ label: stateOptionsSorted.current[0].label, value: stateOptionsSorted.current[0].value })
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

        let cityname = city.trim().toUpperCase();
        let ref = projectFirestore.collection('m_cities').where("city", "==", cityname)

        const unsubscribe = ref.onSnapshot(async snapshot => {
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
            });

            if (results.length === 0) {
                const dataSet = {
                    country: country.label,
                    state: state.label,
                    city: cityname,
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
                <h1>Add City </h1>
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
                                    onChange={(option) => setCountry(option)}
                                    options={countryOptionsSorted.current}
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
                                    onChange={(option) => setState(option)}
                                    options={stateOptionsSorted.current}
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
                                <h1 className="owner-heading">New City</h1>
                                <input
                                    required
                                    type="text"
                                    placeholder='Entry City Name'
                                    onChange={(e) => setCity(e.target.value)}
                                    value={city}
                                />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <button className="btn">Add City</button>
                        {formError && <div className="error">{formError}</div>}
                    </div>
                    <br />
                </form>
            </div >
            <div className="row no-gutters">
                {masterCity && masterCity.length === 0 && <p>No City Yet!</p>}
                {masterCity && masterCity.map(data => (<>
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
                                            <h5 style={{ margin: '0' }}>{data.city}  </h5>
                                            <small style={{ margin: '0' }}>{data.state}, {data.country}</small>
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

