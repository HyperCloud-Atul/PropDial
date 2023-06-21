import { useState, useEffect } from 'react'
import { projectFirestore } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useCollection } from '../../hooks/useCollection'

export default function MasterAddCountry() {
    const { addDocument, response } = useFirestore('m_countries')
    const { documents: masterCountry, error: masterCountryerror } = useCollection('m_countries')

    const [country, setCountry] = useState('')
    const [formError, setFormError] = useState(null)


    useEffect(() => {
        // console.log('in useeffect')
    }, [])

    let results = []
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        let countryname = country.trim().toUpperCase();
        let ref = projectFirestore.collection('m_countries').where("country", "==", countryname)

        const unsubscribe = ref.onSnapshot(async snapshot => {
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
            });

            if (results.length === 0) {
                const dataSet = {
                    country: countryname,
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
                <h1>Add Country </h1>
            </div>

            <div style={{ overflow: 'hidden' }}>
                {/* <form onSubmit={handleSubmit} className="auth-form"> */}
                <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '350px' }}>
                    <div className="row no-gutters">
                        <div className="col-12">
                            <div>
                                <br />
                                <h1 className="owner-heading">New Country</h1>
                                <input
                                    required
                                    type="text"
                                    placeholder='Entry Country Name'
                                    onChange={(e) => setCountry(e.target.value)}
                                    value={country}
                                />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <button className="btn">Add Country</button>
                        {formError && <div className="error">{formError}</div>}
                    </div>
                    <br />
                </form>
            </div >
            <div className="row no-gutters">
                {masterCountry && masterCountry.length === 0 && <p>No Country Yet!</p>}
                {masterCountry && masterCountry.map(data => (<>
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
                                            <h5 style={{ margin: '0' }}>{data.country} </h5>
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

