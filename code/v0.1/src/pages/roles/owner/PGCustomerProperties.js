import { useCollection } from '../../../hooks/useCollection'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useLogout } from '../../../hooks/useLogout'
import OwlCarousel from 'react-owl-carousel';

// components
import Filters from '../../../components/Filters'
import PropertyList from '../../../components/PropertyList'

// styles
// import './UserDashboard.css'
const propertyFilter = ['ALL', 'RESIDENTIAL', 'COMMERCIAL', 'INACTIVE'];

export default function PGCustomerProperties() {
    const { user } = useAuthContext()
    const { logout, isPending } = useLogout()
    const { documents: propertiesdocuments, error: propertieserror } = useCollection('properties')

    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        let flag = user && user.role === 'owner';
        if (!flag) {
            logout()
        }
    }, [user, logout])

    const [myState, setMyState] = useState({
        responsive: {
            0: {
                items: 2,
            },
            600: {
                items: 4,
            },
            1000: {
                items: 6,
            },
        },
    });

    useEffect(() => {
        setMyState({
            responsive: {
                0: {
                    items: 2,
                },
                600: {
                    items: 4,
                },
                1000: {
                    items: 6,
                },
            },
        }
        )
    }, [])

    // console.log('user uid:', user.uid)
    // console.log('property documents:', propertiesdocuments)

    const changeFilter = (newFilter) => {
        setFilter(newFilter)
    }

    const properties = propertiesdocuments ? propertiesdocuments.filter(document => {
        let filteredProperty = false
        switch (filter) {
            case 'ALL':
                document.taggedUsersList.forEach(u => {
                    if (u.id === user.uid) {
                        filteredProperty = true
                    }
                })
                return filteredProperty
            case 'RESIDENTIAL':
                document.taggedUsersList.forEach(u => {
                    if (u.id === user.uid && document.category.toUpperCase() === 'RESIDENTIAL') {
                        filteredProperty = true
                    }
                })
                return filteredProperty
            case 'COMMERCIAL':
                document.taggedUsersList.forEach(u => {
                    if (u.id === user.uid && document.category.toUpperCase() === 'COMMERCIAL') {
                        filteredProperty = true
                    }
                })
                return filteredProperty
            case 'INACTIVE':
                document.taggedUsersList.forEach(u => {
                    if (u.id === user.uid && document.status.toUpperCase() === 'INACTIVE') {
                        filteredProperty = true
                    }
                })
                return filteredProperty
            default:
                return true
        }
    }) : null

    return (

        <div>
            {/* <h2 className="page-title">Owner Dashboard</h2> */}

            {/* <br /> */}
            <div>
                <div className='page-title'>
                    <span className="material-symbols-outlined">
                        real_estate_agent
                    </span>
                    <h1>Properties </h1>
                </div>
                {propertieserror && <p className="error">{propertieserror}</p>}
                {/* {billserror && <p className="error">{billserror}</p>} */}
                {propertiesdocuments && <Filters changeFilter={changeFilter} filterList={propertyFilter} filterLength={properties.length} />}
                {/* {billsdocuments && <Filters changeFilter={changeFilter} />} */}
                {properties && <PropertyList properties={properties} />}
                {/* {bills && <BillList bills={bills} />} */}
            </div>
            <br></br><br></br>
            <hr></hr>
            <div className="row no-gutters">
                <div className="col-lg-6" style={{ padding: '2%' }}>
                    <h5 style={{ paddingLeft: '2%', fontWeight: 'bolder' }}>ANALYTICS</h5><br />

                    <div className="profile-card-div">
                        <div className="address-div" style={{ padding: '8px 10px 4px 10px' }}>
                            <div className="icon">
                                <span className="material-symbols-outlined">
                                    payments
                                </span>
                            </div>

                            <div className="address-text">
                                <div style={{ textAlign: 'left', position: 'relative', top: '-1px', }}>
                                    <h5 style={{ fontWeight: 'bolder' }}>Payments</h5>
                                    <h5 style={{ margin: '0', fontSize: '0.8rem', color: '#888' }}>0</h5>
                                </div>
                                <div className="" style={{ position: 'relative', top: '-6px' }}>
                                    <h6 style={{ margin: '0', fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>₹ 0
                                    </h6>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="profile-card-div">
                        <div className="address-div" style={{ padding: '8px 10px 4px 10px' }}>
                            <div className="icon">
                                <span className="material-symbols-outlined">
                                    local_library
                                </span>
                            </div>

                            <div className="address-text">
                                <div style={{ textAlign: 'left', position: 'relative', top: '-1px' }}>
                                    <h5 style={{ fontWeight: 'bolder' }}>Bills</h5>
                                    <h5 style={{ margin: '0', fontSize: '0.8rem', color: '#888' }}>0</h5>
                                </div>
                                <div className="" style={{ position: 'relative', top: '-6px' }}>
                                    <h6 style={{ margin: '0', fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>₹ 0
                                    </h6>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="profile-card-div">
                        <div className="address-div" style={{ padding: '8px 10px 4px 10px' }}>
                            <div className="icon">
                                <span className="material-symbols-outlined">
                                    article
                                </span>
                            </div>

                            <div className="address-text">
                                <div style={{ textAlign: 'left', position: 'relative', top: '-1px' }}>
                                    <h5 style={{ fonWweight: ' bolde' }}>Documents</h5>
                                    <h5 style={{ margin: '0', fontSize: '0.8rem', color: '#888' }}>0</h5>
                                </div>
                                <div className="" style={{ position: 'relative', top: '-6px' }}>
                                    <h6 style={{ margin: '0', fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>0
                                    </h6>
                                </div>
                            </div>
                        </div>

                    </div><br />

                    <div className="dashboardCardBoxoffer">
                        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"
                                    aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                                    aria-label="Slide 2"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img style={{ width: '100%', height: '100%' }} src="./assets/img/banner1.png" className="d-block w-100" alt="Ads 1" />
                                </div>
                                <div className="carousel-item">
                                    <img style={{ width: '100%', height: '100%' }} src="./assets/img/banner2.png" className="d-block w-100" alt="Ads 2" />
                                </div>

                            </div>
                        </div>
                    </div><br className="small" />
                </div >
                <div className="col-lg-3 col-6" style={{ padding: '2%' }}>
                    <h5 style={{ paddingLeft: '2%', fontWeight: 'bolder' }}>HOME SERVICES</h5><br />
                    <div className="addon-service">
                        <div className="">
                            <center>
                                <img src="./assets/img/1.png" alt="" />

                                <h5 className="addon-service-h5">Salon at Home</h5>
                            </center>
                        </div>
                    </div><br />
                    <div className="addon-service">
                        <div className="">
                            <center>
                                <img src="./assets/img/2.png" alt="" />

                                <h5 className="addon-service-h5">Diagonstic Test</h5>
                            </center>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-6" style={{ padding: '2%' }}>
                    <h5 style={{ visibility: 'hidden' }}>Home SERVICES</h5><br />

                    <div className="addon-service">
                        <div className="">
                            <center>
                                <img src="./assets/img/3.png" alt="" />

                                <h5 className="addon-service-h5">Packaging</h5>
                            </center>
                        </div>
                    </div><br />
                    <div className="addon-service">
                        <div className="">
                            <center>
                                <img src="./assets/img/4.png" alt="" />

                                <h5 className="addon-service-h5">Paint & Whitewashing</h5>
                            </center>
                        </div>

                    </div>
                </div>


            </div >
            <br className="small" />
        </div >
    )
}
