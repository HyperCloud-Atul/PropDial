import { useState, useEffect } from 'react'
import { projectFirestore } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useCollection } from '../../hooks/useCollection'
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom'

// component 
import Hero from '../../components/Hero'

export default function MasterCountryList() {
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end
    const { addDocument, response } = useFirestore('m_countries')
    const { updateDocument, response: responseUpdateDocument } = useFirestore('m_countries')
    const { documents: masterCountry, error: masterCountryerror } = useCollection('m_countries')

    const [country, setCountry] = useState('')
    const [formError, setFormError] = useState(null)
    const [formBtnText, setFormBtnText] = useState('')
    const [currentDocid, setCurrentDocid] = useState(null)


    useEffect(() => {
        // console.log('in useeffect')
    }, [])

    let results = []
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        let countryname = country.trim().toUpperCase();

        if (currentDocid) {
            await updateDocument(currentDocid, {
                country: countryname
            })

            setFormError('Successfully updated')
        }
        else {

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
        setFormBtnText('Add Country')
        setCountry('')
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


    const handleEditCard = (docid, doccountry) => {
        // console.log('docid in handleEditCard:', docid)
        setFormError(null)
        setCountry(doccountry)
        sethandleAddSectionFlag(true)
        setFormBtnText('Update Country')
        setCurrentDocid(docid)
    }

    return (
        <div className="pg_property">
            <Hero
                pageTitle="Country List"
                pageSubTitle="Add or update country
        "
                heroImage="./assets/img/country_banner.jpg"
            ></Hero>
            <div className="container">
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

                        <div onClick={handleAddSection} className="more-add-options-icons active" >
                            <h1>Add Country</h1>
                            <span className="material-symbols-outlined">
                                add
                            </span>
                        </div>

                        <Link to='/statelist' className="more-add-options-icons">
                            <h1>State List</h1>
                            <span className="material-symbols-outlined">
                                map
                            </span>
                        </Link>

                        <Link to='/citylist' className="more-add-options-icons">
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

                        <Link to='/societylist' className="more-add-options-icons" >
                            <h1>Society List</h1>
                            <span className="material-symbols-outlined">
                                home
                            </span>
                        </Link>

                    </div>

                </div>

                <div style={{
                    overflow: 'hidden',
                    transition: '2s',
                    opacity: handleAddSectionFlag ? '1' : '0',
                    maxHeight: handleAddSectionFlag ? '500px' : '0',
                }}>
                    {/* <form onSubmit={handleSubmit} className="auth-form"> */}
                    <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '350px' }}>
                        <div className="row no-gutters">
                            <div className="col-12">
                                <div>
                                    <h1 className="owner-heading">Country Name</h1>
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
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <button className="theme_btn btn_fill">{formBtnText}</button>
                            {formError && <div style={{ margin: '0' }} className="error">{formError}</div>}
                        </div>
                    </form>
                </div >
                <br />
                <div className="row no-gutters">
                    {masterCountry && masterCountry.length === 0 && <p>No Country Yet!</p>}
                    {masterCountry && masterCountry.map(data => (<>
                        <div className='col-lg-6 col-md-6 col-sm-12'>
                            <div className="property-status-padding-div">
                                <div className="profile-card-div" style={{ position: 'relative' }}>
                                    <div className="address-div" style={{ paddingBottom: '5px' }}>
                                        <div className="icon" style={{ position: 'relative', top: '-5px' }}>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--darkgrey-color)' }}>
                                                flag
                                            </span>
                                        </div>
                                        <div className="address-text">
                                            <div onClick={() => handleEditCard(data.id, data.country)}
                                                style={{
                                                    width: '80%',
                                                    height: '170%',
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column',
                                                    transform: 'translateY(-6px)',
                                                    cursor: 'pointer',
                                                }}>
                                                <h5 style={{ margin: '0', transform: 'translateY(5px)' }}>{data.country} </h5>
                                                {/* <small style={{ margin: '0', transform: 'translateY(5px)' }}>{data.status} ({data.country})</small> */}
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
                <br />
            </div>
        </div >
    )
}

