import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDocument } from '../hooks/useDocument'
import './More.css'

export default function More() {
    const { user } = useAuthContext()

    return (
        <>
            <div className='more-expand-div'>
                {/* <div className='more-div-profile-div' style={{ background: 'rgba(84,204,203,1)' }}>
                    <div className='more-div-profile-div-img'>
                        <span>
                            <img src={user.photoURL} alt=""></img></span>
                    </div>
                    <div className='more-div-profile-div-content'>
                        <h1>{user.fullName}</h1>
                        <h2>{user.role}</h2>
                    </div>
                    <div className='more-div-profile-div-arrow'>
                        <span className="material-symbols-outlined">
                            arrow_forward_ios
                        </span>
                    </div>
                </div> */}
                {/* <br /> */}

                <div className='more-div-big-icon-div'>
                    <div className='more-div-big-icon-div-inner'>
                        <div>
                            <Link to='/profile' >
                                <span className="material-symbols-outlined">
                                    person
                                </span>
                            </Link>
                        </div>
                        <Link to='/profile' >
                            <h1>My Account</h1>
                        </Link>
                    </div>

                    <div className='more-div-big-icon-div-inner'>
                        <div>
                            <span className="material-symbols-outlined">
                                notifications
                            </span>
                        </div>
                        <h1>Notifications</h1>
                    </div>

                    <div className='more-div-big-icon-div-inner'>
                        <div>
                            <span className="material-symbols-outlined">
                                account_balance_wallet
                            </span>
                        </div>
                        <h1>Wallet</h1>
                    </div>
                </div>
                <br />
            </div>

            {/* section for 'admin' user role  */}
            {user && user.role === 'admin' &&
                <div className='more-expand-div'>
                    <div className='more-div-card'>
                        <h1 className='more-div-card-heading'>Properties</h1>
                        <div className='row no-gutters'>
                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <Link to='/addproperty' className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            shopping_bag
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Add Property</h2>
                                        <h3>all properties to be shown</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            shopping_bag
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Add Bills</h2>
                                        <h3>All The Trips You Can Track Here</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12'>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            favorite
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>PMS Payments</h2>
                                        <h3>All The Trips You Can Track Here</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12'>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            favorite
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Manage Tickets</h2>
                                        <h3>All The Trips You Can Track Here</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            }

            {user && user.role === 'admin' &&
                <div className='more-expand-div'>
                    <div className='more-div-card'>
                        <h1 className='more-div-card-heading'>Users</h1>
                        <div className='row no-gutters'>
                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            shopping_bag
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Customer List</h2>
                                        <h3>add new property</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            shopping_bag
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Executive List</h2>
                                        <h3>All The Trips You Can Track Here</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12'>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            favorite
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Customer List</h2>
                                        <h3>All The Trips You Can Track Here</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12'>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            favorite
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Executive List</h2>
                                        <h3>All The Trips You Can Track Here</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            }

            {user && user.role === 'admin' &&

                <div className='more-expand-div'>
                    <div className='more-div-card'>
                        <h1 className='more-div-card-heading'>Settings</h1>
                        <div className='row no-gutters'>
                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <Link to='/adminsettings' className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            flag
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Logo-Theme</h2>
                                        <h3>set your current location</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </Link>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            g_translate
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Outgoing Email</h2>
                                        <h3>setup your native language</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>


                            </div>

                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            favorite
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Payment Gateway</h2>
                                        <h3>update your app password</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            lock_open
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Wallet</h2>
                                        <h3>sign-out from the application</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            }

            {user && user.role === 'admin' &&

                <div className='more-expand-div'>
                    <div className='more-div-card'>
                        <h1 className='more-div-card-heading'>Master Data</h1>
                        <div className='row no-gutters'>
                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <Link to='/addcountry' className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            flag
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Add Country</h2>
                                        <h3>set your current location</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </Link>
                                <Link to='/addstate' className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            g_translate
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Add State</h2>
                                        <h3>setup your native language</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </Link>


                            </div>

                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <Link to='/addcity' className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            favorite
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Add City</h2>
                                        <h3>update your app password</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </Link>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            lock_open
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Add Locality</h2>
                                        <h3>sign-out from the application</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            }

            {/* section for 'owner' user role  */}
            {user && user.role === 'owner' &&
                <div className='more-expand-div'>
                    <div className='more-div-card'>
                        <h1 className='more-div-card-heading'>Properties</h1>
                        <div className='row no-gutters'>
                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            shopping_bag
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Manage Properties</h2>
                                        <h3>add new property</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            shopping_bag
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Manage Documents</h2>
                                        <h3>All The Trips You Can Track Here</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            favorite
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Manage Payments</h2>
                                        <h3>All The Trips You Can Track Here</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            favorite
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Manage Tickets</h2>
                                        <h3>All The Trips You Can Track Here</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            }

            {user && user.role === 'owner' &&
                <div className='more-expand-div'>
                    <div className='more-div-card'>
                        <h1 className='more-div-card-heading'>Settings</h1>
                        <div className='row no-gutters'>
                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            flag
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Country</h2>
                                        <h3>set your current location</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            g_translate
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Language</h2>
                                        <h3>setup your native language</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>


                            </div>

                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            favorite
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Password</h2>
                                        <h3>update your app password</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>

                                <div className='more-div-card-inner'>
                                    <div className='more-div-card-inner-icon'>
                                        <span className="material-symbols-outlined">
                                            lock_open
                                        </span>
                                    </div>
                                    <div className='more-div-card-inner-content'>
                                        <h2>Logout</h2>
                                        <h3>sign-out from the application</h3>
                                    </div>
                                    <div className='more-div-card-inner-arrow'>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <br /><br /><br /><br />
        </>
    )
}
