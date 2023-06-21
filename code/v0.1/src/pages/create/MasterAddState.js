import { useState, useEffect, useRef } from 'react'
import { projectFirestore } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useCollection } from '../../hooks/useCollection'
import Select from 'react-select'

export default function MasterAddState() {
    const { addDocument, response } = useFirestore('m_states')
    const { documents: masterState, error: masterStateerror } = useCollection('m_states')
    const { documents: masterCountry, error: masterCountryerror } = useCollection('m_countries')

    const [country, setCountry] = useState()
    const [state, setState] = useState('')
    const [formError, setFormError] = useState(null)

    let countryOptions = useRef([]);
    let countryOptionsSorted = useRef([]);
    if (masterCountry) {
        countryOptions.current = masterCountry.map(countryData => ({
            label: countryData.country,
            value: countryData.country
        }))

        countryOptionsSorted.current = countryOptions.current.sort((a, b) =>
            a.label.localeCompare(b.label)
        );
    }
    useEffect(() => {
        console.log('in useeffect')

    }, [])


    let results = []
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        let statename = state.trim().toUpperCase();
        let ref = projectFirestore.collection('m_states').where("state", "==", statename)

        const unsubscribe = ref.onSnapshot(async snapshot => {
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
            });

            if (results.length === 0) {
                const dataSet = {
                    country: country.label,
                    state: statename,
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
                <h1>Add State </h1>
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
                                <h1 className="owner-heading">New State</h1>
                                <input
                                    required
                                    type="text"
                                    placeholder='Entry State Name'
                                    onChange={(e) => setState(e.target.value)}
                                    value={state}
                                />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <button className="btn">Add State</button>
                        {formError && <div className="error">{formError}</div>}
                    </div>
                    <br />
                </form>
            </div >
            <div className="row no-gutters">
                {masterState && masterState.length === 0 && <p>No State Yet!</p>}
                {masterState && masterState.map(data => (<>
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
                                            <h5 style={{ margin: '0' }}>{data.state} ( {data.country} )  </h5>
                                            {/* <small style={{ margin: '0' }}>{data.status} ({data.country})</small> */}
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

