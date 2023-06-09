import { useNavigate } from "react-router-dom"
// import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useEffect, useState } from 'react'
import { useFirestore } from "../../hooks/useFirestore"
import { useDocument } from "../../hooks/useDocument"
import Avatar from "../../components/Avatar"
import { useLogout } from "../../hooks/useLogout"
import Popup from '../../components/Popup'

// styles
import './PGProfile.css'

export default function PGProfile() {
    const { user } = useAuthContext()
    // const { document, error } = useDocument('users', user.uid)
    // const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [fullName, setFullName] = useState('')
    const { updateDocument, response } = useFirestore('users')
    const { document: userDocument, error: userDocumentError } = useDocument('users', user.uid)
    const [formError, setFormError] = useState(null)
    const { logout, isPending } = useLogout()
    //Popup Flags
    const [showPopupFlag, setShowPopupFlag] = useState(false)
    const [popupReturn, setPopupReturn] = useState(false)

    const navigate = useNavigate();

    //Popup Flags
    useEffect(() => {
        if (popupReturn) {
            //Logout
            logout();
        }

    }, [popupReturn])

    //Popup Flags
    const showPopup = async (e) => {
        e.preventDefault()
        setShowPopupFlag(true)
        setPopupReturn(false)
    }

    const showDashboard = () => {

        if (user && user.roles && user.roles.includes('superadmin')) {
            // console.log('in superadmin', user.roles)
            navigate('/superadmindashboard')
        }

        if (user && user.roles && user.roles.includes('admin')) {
            // console.log('in admin', user.roles)
            navigate('/admindashboard')
        }

        if (user && user.roles && user.roles.includes('owner')) {
            // console.log('in user', user.roles)
            navigate('/ownerdashboard')
        }

        if (user && user.roles && user.roles.includes('tenant')) {
            // console.log('in user', user.roles)
            navigate('/tenantdashboard')
        }

        if (user && user.roles && user.roles.includes('executive')) {
            // console.log('in user', user.roles)
            navigate('/executivedashboard')
        }

        if (user && user.roles && user.roles.includes('user')) {
            // console.log('in user', user.roles)
            navigate('/userdashboard')
        }
    }

    const handleSubmit = async (e) => {
        // deleteDocument(property.id)
        // history.push('/')
        e.preventDefault();
        setFormError(null)

        // if (!category) {
        //     setFormError('Please select a property category.')
        //     return
        // }
        // if (assignedUsers.length < 1) {
        //     setFormError('Please assign the property to at least 1 user')
        //     return
        // }

        // await updateDocument(user.uid, {
        //     admin: 'true',          
        // })

        await updateDocument(user.uid, {
            fullName,
            phoneNumber
        })

        // setFormError('Data updated successfully')
    }

    const changePwd = (e) => {
        navigate('/updatepwd')
    }


    // if (error) {
    //     return <div className="error">{error}</div>
    // }
    // if (!document) {
    //     return <div className="loading">Loading...</div>
    // }

    // --------------------HTML UI Codebase------------------
    return (
        <div>

            {/* Popup Component */}
            <Popup showPopupFlag={showPopupFlag}
                setShowPopupFlag={setShowPopupFlag}
                setPopupReturn={setPopupReturn}
                msg={'Are you sure you want to logout?'} />

            <div className="profile-card-div">
                <div className="content">
                    <div className="user-name">
                        <div className="user-logo-parent-div">
                            <div className="user-logo">
                                <Avatar src={user.photoURL} />
                            </div>
                        </div>

                        <div className="details">
                            <h5>{user.fullName}</h5>
                            <p>{user.email}</p>
                            <p>{user.phoneNumber}</p>
                        </div>

                        <div className="edit">
                            <span className="material-symbols-outlined">
                                edit
                            </span>
                        </div>
                    </div>
                </div>

                <div className="edit-profile-div">
                    <small>Visit Dashboard for more deatils</small>
                    <div>
                        <div></div>
                        <button type="button" className="btn" onClick={showDashboard}>Dashboard</button>
                    </div>
                </div>
            </div>



            <div className="row no-gutters">
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="property-status-padding-div">
                        <div className="profile-card-div">
                            <div className="address-div">
                                <div className="icon" style={{ background: 'rgba(84,204,203,0.3)' }}>
                                    <span className="material-symbols-outlined">
                                        security
                                    </span>
                                </div>

                                <div className="address-text">
                                    <h5>Security alert list</h5>
                                    <div className="">
                                        <span className="material-symbols-outlined">
                                            chevron_right
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <hr style={{ margin: '0', border: 'none', borderBottom: '1px solid #eee' }} />

                            <div className="address-div" style={{ cursor: 'pointer' }}>
                                <div className="icon" style={{ background: 'rgba(84,204,203,0.3)' }}>
                                    <span className="material-symbols-outlined">
                                        sms
                                    </span>
                                </div>


                                <div className="address-text">
                                    {/* {!isPending && <button className="btn" onClick={sendEmail} >Send Email</button>}
                                        {isPending && <button className="btn" disabled>Processing...</button>} */}
                                    <h5>Help & Support</h5>
                                    <div className="">
                                        <span className="material-symbols-outlined">
                                            chevron_right
                                        </span>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="property-status-padding-div">
                        <div className="profile-card-div">
                            <div className="address-div" style={{ cursor: 'pointer' }} onClick={changePwd}>
                                <div className="icon" style={{ background: 'rgba(84,204,203,0.3)' }}>
                                    <span className="material-symbols-outlined">
                                        lock_open
                                    </span>
                                </div>

                                {user && (
                                    <div className="address-text">
                                        {/* {!isPending && <button className="btn" onClick={changePwd} >Change Password</button>}
                                        {isPending && <button className="btn" disabled>Processing...</button>} */}
                                        <h5>Change Password</h5>
                                        <div className="">
                                            <span className="material-symbols-outlined">
                                                chevron_right
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <hr style={{ margin: '0', border: 'none', borderBottom: '1px solid #aaa' }} />

                            <div className="address-div" style={{ cursor: 'pointer' }} onClick={showPopup}>
                                <div className="icon" style={{ background: 'rgba(84,204,203,0.3)' }}>
                                    <span className="material-symbols-outlined">
                                        logout
                                    </span>
                                </div>

                                {user && (
                                    <div className="address-text">
                                        {/* {!isPending && <button className="btn" onClick={logout}>Logout</button>}
                                        {isPending && <button className="btn" disabled>Logging out...</button>} */}
                                        <h5>Logout</h5>
                                        <div className="">
                                            <span className="material-symbols-outlined">
                                                chevron_right
                                            </span>
                                        </div>

                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div><br />
            {/* <form onSubmit={handleSubmit}>
                <label>
                    <span>Full Name:</span>
                    <input
                        required
                        type="text"
                        placeholder={user.displayName}
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName}
                    />
                </label>
                <label>
                    <span>Phone:</span>
                    <input
                        required
                        type="text"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                    />
                </label>

                <button className="btn">Save</button>

            </form> */}

        </div>
    );
}
