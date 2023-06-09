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

export default function PGOwnerDashboard() {
    const { user } = useAuthContext()
    const { logout, isPending } = useLogout()
    const { documents: propertiesdocuments, error: propertieserror } = useCollection('properties')

    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        let flag = user && user.roles && user.roles.includes('owner');
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

            <div className="row no-gutters">
                <div className="col-lg-6 col-md-12 col-sm-12" style={{ padding: '10px' }}>
                    <div className="default-card">
                        <div className='default-card-inner'>
                            <div>
                                <h6>PMS Due</h6>
                                <h1 style={{ color: 'var(--red-color)' }}>
                                    ₹42000
                                </h1>
                                <h3>Cut-off Date : 12 Jun'23</h3>
                                {/* <h4>Due Date Exceeded : ₹100</h4> */}

                            </div>
                            <div>
                                <h6>Property</h6>
                                <h3 style={{ color: 'var(--blue-color)' }}>D2-201 & A-504</h3>


                            </div>
                        </div>
                        <div className='default-card-inner'>
                            <button className="btn info">Details</button>
                            <button className="btn">Pay Now</button>
                        </div>
                    </div>

                </div>

                <div className="col-lg-6 col-md-12 col-sm-12" style={{ padding: '10px' }}>

                    <div className="tenant-dashboard-ticket-card">
                        <div className="ticket-round-left"></div>
                        <div className="ticket-round-right"></div>
                        <h1 className="tenant-dashboard-ticket-card-heading">Tickets</h1>
                        <hr />
                        <div className="tenant-dashboard-ticket-card-content">
                            <div>
                                <h1>Pending Tickets</h1>
                                <h2>10</h2>
                                <h3>Last Raised Date</h3>
                                <h4>15 Jan 2023</h4>
                            </div>
                            <div>
                                <h1>Closed Tickets</h1>
                                <h2>30</h2>
                                <button className="mybutton button5">Raise Ticket</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br />

            <div className="row no-gutters partners-div" style={{ backgroundColor: 'rgb(188, 236, 224, 0.5)', padding: '2% 0;' }}>
                <div className="col-md-12 col-md-offset-1">
                    <OwlCarousel
                        className="owl-theme"
                        loop={true}
                        nav={false}
                        autoplay={false}
                        smartSpeed={3000}
                        autoplayTimeout={3000}
                        autoplayHoverPause={false}
                        dots={false}
                        center={true}
                        margin={10}
                        stagePadding={30}
                        responsive={myState.responsive} >
                        <div class="owlcarousel-item">
                            <div class="">
                                <center>
                                    <span class="material-symbols-outlined">
                                        groups
                                    </span>
                                    <h1>59</h1>
                                    <h5 class="owlcarousel-item-h5">Rental Enquiries</h5>
                                </center>
                            </div>
                        </div>
                        <div class="owlcarousel-item">
                            <div class="">
                                <center>
                                    <span class="material-symbols-outlined">
                                        groups
                                    </span>
                                    <h1>0</h1>
                                    <h5 class="owlcarousel-item-h5">Sale Enquiries</h5>
                                </center>
                            </div>
                        </div>
                        <div class="owlcarousel-item">
                            <div class="">
                                <center>
                                    <span class="material-symbols-outlined">
                                        groups
                                    </span>
                                    <h1>0</h1>
                                    <h5 class="owlcarousel-item-h5">General Visits</h5>
                                </center>
                            </div>
                        </div>
                        <div class="owlcarousel-item">
                            <div class="">
                                <center>
                                    <span class="material-symbols-outlined">
                                        groups
                                    </span>
                                    <h1>0</h1>
                                    <h5 class="owlcarousel-item-h5">Rental Visits</h5>
                                </center>
                            </div>
                        </div>
                        <div class="owlcarousel-item">
                            <div class="">
                                <center>
                                    <span class="material-symbols-outlined">
                                        groups
                                    </span>
                                    <h1>0</h1>
                                    <h5 class="owlcarousel-item-h5">Sale Visits</h5>
                                </center>
                            </div>
                        </div>
                        <div class="owlcarousel-item">
                            <div class="">
                                <center>
                                    <span class="material-symbols-outlined">
                                        groups
                                    </span>
                                    <h1>₹1985 </h1>
                                    <h5 class="owlcarousel-item-h5">PMS Billing</h5>
                                </center>
                            </div>
                        </div>
                        <div class="owlcarousel-item">
                            <div class="">
                                <center>
                                    <span class="material-symbols-outlined">
                                        groups
                                    </span>
                                    <h1>₹1985 </h1>
                                    <h5 class="owlcarousel-item-h5">Brokerage Billing</h5>
                                </center>
                            </div>
                        </div>
                        <div class="owlcarousel-item">
                            <div class="">
                                <center>
                                    <span class="material-symbols-outlined">
                                        groups
                                    </span>
                                    <h1>₹1985 </h1>
                                    <h5 class="owlcarousel-item-h5">Maintenance Billing</h5>
                                </center>
                            </div>
                        </div>
                        <div class="owlcarousel-item">
                            <div class="">
                                <center>
                                    <span class="material-symbols-outlined">
                                        groups
                                    </span>
                                    <h1>₹1985 </h1>
                                    <h5 class="owlcarousel-item-h5">Sale Registration Advance</h5>
                                </center>
                            </div>
                        </div>

                    </OwlCarousel>
                </div >
                <br /><br />
            </div >
            <br />
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
                                    <h5 style={{ margin: '0', fontSize: '0.8rem', color: '#888' }}>1,708</h5>
                                </div>
                                <div className="" style={{ position: 'relative', top: '-6px' }}>
                                    <h6 style={{ margin: '0', fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>₹84,538
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
                                    <h5 style={{ margin: '0', fontSize: '0.8rem', color: '#888' }}>152</h5>
                                </div>
                                <div className="" style={{ position: 'relative', top: '-6px' }}>
                                    <h6 style={{ margin: '0', fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>₹6,907
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
                                    <h5 style={{ margin: '0', fontSize: '0.8rem', color: '#888' }}>742</h5>
                                </div>
                                <div className="" style={{ position: 'relative', top: '-6px' }}>
                                    <h6 style={{ margin: '0', fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>742
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
