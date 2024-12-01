import React, { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import Gallery from "react-image-gallery";
import { useNavigate, useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useCommon } from "../../hooks/useCommon";
import { format } from "date-fns";
import './PGUserProfileDetails.css'

export default function PGUserProfileDetails() {
    const images = [];
    const { userProfileId } = useParams();
    const { camelCase } = useCommon();
    // const { user } = useAuthContext();
    const [isUploading, setIsUploading] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState("/assets/img/team1.jpg");

    console.log("userProfileId: ", userProfileId)

    const { document: userProfileDoc, error: userProfileDocError } = useDocument("users-propdial", userProfileId)

    return (
        <>
            <br></br>
            <br></br>
            <br></br>

            {/* <div className="container-fluid">
                <div className="row no-gutters">
                    <div className="col-lg-3 col-md-4 col-sm-12">
                        <div className="profile-main-card-css">
                            <div className="profile-card-img-div">
                                <img src={selectedImage}
                                    alt="Selected img" />
                            </div>
                            <div className="profile-card-details">
                                <h1>Vinay Chachu</h1>
                                <div>
                                    <h2>Executive</h2>
                                    <span className="material-symbols-outlined">
                                        edit
                                    </span>
                                </div>
                                <h3>Active</h3>
                                <h4>"</h4>
                                <small>I am the ceo of the company PropDial, and i am creating a good looking profile page.</small>
                            </div><br />
                            <div className="profile-card-user-details">
                                <span><strong>Age: </strong> 26</span><br />
                                <span><strong>Gender: </strong> Male</span><br />
                                <span><strong>Position: </strong> CEO</span><br />
                                <span><strong>Location: </strong> Delhi, India</span><br /><br />
                                <div className="profile-card-user-details-buttons">
                                    <div>
                                        <input id="Owner" type="checkbox" name="type" />
                                        <label htmlFor="Owner">Owner</label>
                                    </div>
                                    <div>
                                        <input id="Frontdesk" type="checkbox" name="type" />
                                        <label htmlFor="Frontdesk">Frontdesk</label>
                                    </div>
                                    <div>
                                        <input id="Executive" type="checkbox" name="type" />
                                        <label htmlFor="Executive">Executive</label>
                                    </div>
                                    <div>
                                        <input id="Admin" type="checkbox" name="type" />
                                        <label htmlFor="Admin">Admin</label>
                                    </div>
                                    <div>
                                        <input id="Agent" type="checkbox" name="type" />
                                        <label htmlFor="Agent">Agent</label>
                                    </div>
                                    <div>
                                        <input id="Superadmin" type="checkbox" name="type" />
                                        <label htmlFor="Superadmin">Super Admin</label>
                                    </div>
                                    <div>
                                        <input id="Tenant" type="checkbox" name="type" />
                                        <label htmlFor="Tenant">Tenant</label>
                                    </div>
                                    <div>
                                        <input id="Tenant" type="checkbox" name="type" />
                                        <label htmlFor="Tenant">Tenant</label>
                                    </div>
                                    <div>
                                        <input id="Prospectivetenant" type="checkbox" name="type" />
                                        <label htmlFor="Prospectivetenant">Prospective Tenant</label>
                                    </div>
                                    <div>
                                        <input id="Buyer" type="checkbox" name="type" />
                                        <label htmlFor="Buyer">Buyer</label>
                                    </div>
                                    <div>
                                        <input id="Prospectivebuyer" type="checkbox" name="type" />
                                        <label htmlFor="Prospectivebuyer">Prospective Buyer</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <div className="profile-main-card-css">
                            <h1 className="profile-main-card-css-heading">Bio</h1>
                            <small className="profile-main-card-css-details">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum voluptas vitae similique. Fugiat cum nulla temporibus ad voluptatum at laudantium maiores, harum deleniti sed perspiciatis natus quia, voluptatibus magni amet?</small>
                        </div>

                        <div className="profile-main-card-css">
                            <h1 className="profile-main-card-css-heading">Personality</h1>
                            <div className="personality-outter">
                                <small>Introvert</small>
                                <div className="personality-inner"></div>
                                <small>Extrovert</small>
                            </div>
                            <div className="personality-outter">
                                <small>Introvert</small>
                                <div className="personality-inner"></div>
                                <small>Extrovert</small>
                            </div>
                            <div className="personality-outter">
                                <small>Introvert</small>
                                <div className="personality-inner"></div>
                                <small>Extrovert</small>
                            </div>
                            <div className="personality-outter">
                                <small>Introvert</small>
                                <div className="personality-inner"></div>
                                <small>Extrovert</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12"></div>
                    <div className="col-lg-1 col-md-1 col-sm-12">
                        <div className="profile-main-card-css-large">

                        </div>
                    </div>
                </div>
            </div> */}
            <br />

            <div className="container">

                <div className="profile-card">
                    <div className="row no-gutters">
                        <div className="col-lg-5 col-md-5 col-sm-12">
                            <div className="profile-card-image">
                                <img
                                    src={userProfileDoc && userProfileDoc.photoURL}
                                    alt="Selected img"
                                />
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-7 col-sm-12">
                            <div className="profile-card-content">
                                <h1>{userProfileDoc && userProfileDoc.fullName}</h1>
                                <h2>{userProfileDoc && userProfileDoc.phoneNumber.replace(
                                    /(\d{2})(\d{5})(\d{5})/,
                                    "+$1 $2-$3"
                                )}</h2>
                                <h2>{userProfileDoc && userProfileDoc.email}</h2>
                                <h4>{userProfileDoc && userProfileDoc.address}  </h4>
                                <h5> {userProfileDoc && camelCase(userProfileDoc.status)}</h5>
                                <div>
                                    <h3>{userProfileDoc && camelCase(userProfileDoc.rolePropDial)}</h3>
                                    <span className="material-symbols-outlined">
                                        edit
                                    </span>
                                </div>
                                <div>
                                    <h3>Is Employee? {userProfileDoc && userProfileDoc.whoAmI === 'employee' ? 'Yes' : 'No'}</h3>
                                    <span className="material-symbols-outlined">
                                        edit
                                    </span>
                                </div>

                                <div className="">
                                    <h2>  {userProfileDoc && userProfileDoc.dateofJoinee ? format(
                                        userProfileDoc.lastLoginTimestamp.toDate(),
                                        "dd-MMM-yyyy hh:mm a"
                                    ) : ""}
                                    </h2>


                                </div>
                                <div>
                                    <small>Last Logged-in</small>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <br />
                {userProfileDoc && userProfileDoc.whoAmI === 'employee' && <div className="profile-card">
                    <h1 className="profile-card-heading">Employee Details</h1>
                    <div className="employee-details">
                        <div className="employee-details-outter-div">
                            <div className="employee-details-inner-div">
                                <h5>{userProfileDoc && userProfileDoc.dateofJoinee ? format(
                                    userProfileDoc.dateofJoinee.toDate(),
                                    "dd-MMM-yyyy"
                                ) : ""}</h5>
                                <small>Date of Joinee</small>
                            </div>
                            <div className="employee-details-inner-div">
                                <h5>{userProfileDoc && userProfileDoc.dateofLeaving ? format(
                                    userProfileDoc.dateofLeaving.toDate(),
                                    "dd-MMM-yyyy"
                                ) : "NA"}</h5>

                                <small>Date of Leaving</small>
                            </div>
                            {/* <div className="employee-details-inner-div">
                                <h5>{userProfileDoc && userProfileDoc.dateofJoinee ? format(
                                    userProfileDoc.lastLoginTimestamp.toDate(),
                                    "dd-MMM-yyyy hh:mm a"
                                ) : ""}</h5>
                                <small>Last Logged-in</small>
                            </div> */}
                        </div>
                    </div>
                    <hr />
                    <div className="row no-gutters" style={{ padding: '0 10px' }}>
                        <div className="col-lg-6 col-md-6 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static">
                                <div>
                                    <small><strong>Employee id</strong></small>
                                    <h5>{userProfileDoc && userProfileDoc.employeeId} </h5>
                                </div>
                                <span className="material-symbols-outlined">
                                    edit
                                </span>
                            </div>
                        </div>


                        <div className="col-lg-6 col-md-6 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static" style={{ borderRight: 'none' }}>
                                <div>
                                    <small><strong>Manager</strong></small>
                                    <h5>Atul Tripathi / 9822752885 / atulmani@gmail.com / super_admin</h5>
                                </div>
                                <span className="material-symbols-outlined">
                                    edit
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static">
                                <div>
                                    <small><strong>Department</strong></small>
                                    <h5>{userProfileDoc && userProfileDoc.department}</h5>
                                </div>
                                <span className="material-symbols-outlined">
                                    edit
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static" style={{ borderRight: 'none' }}>
                                <div>
                                    <small><strong>Designation</strong></small>
                                    <h5>{userProfileDoc && userProfileDoc.designation}</h5>
                                </div>
                                <span className="material-symbols-outlined">
                                    edit
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static">
                                <div>
                                    <small><strong>UAN Number</strong></small>
                                    <h5>{userProfileDoc && userProfileDoc.uan}</h5>
                                </div>
                                <span className="material-symbols-outlined">
                                    edit
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static" style={{ borderRight: 'none' }}>
                                <div>
                                    <small><strong>PAN Number</strong></small>
                                    <h5>{userProfileDoc && userProfileDoc.pan}</h5>
                                </div>
                                <span className="material-symbols-outlined">
                                    edit
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static" style={{ borderBottom: 'none', paddingBottom: '2px' }}>
                                <div>
                                    <small><strong>Aadhar Number</strong></small>
                                    <h5>{userProfileDoc && userProfileDoc.aadhaar}</h5>
                                </div>
                                <span className="material-symbols-outlined">
                                    edit
                                </span>
                            </div>
                        </div>
                    </div>
                </div>}
                <br />
                <div className="profile-card">
                    <h1 className="profile-card-heading">Access Management</h1>
                    <div style={{ padding: '8px' }} />
                    <div className="row no-gutters" style={{ padding: '0 10px' }}>
                        <div className="col-lg-6 col-md-6 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static">
                                <div style={{ width: '100%' }}>
                                    <small><strong>Select Country</strong></small><br />
                                    <select name="" id="">
                                        <option value="" disabled>Country</option>
                                        <option value="">India</option>
                                        <option value="">United States of America</option>
                                        <option value="">Australia</option>
                                        <option value="">Japan</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static" style={{ borderRight: 'none' }}>
                                <div style={{ width: '100%' }}>
                                    <small><strong>Select State</strong></small><br />
                                    <select name="" id="">
                                        <option value="" disabled>State</option>
                                        <option value="">Maharashtra</option>
                                        <option value="">Karnataka</option>
                                        <option value="">Delhi</option>
                                        <option value="">Goa</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static" style={{ borderBottom: 'none', paddingBottom: '2px' }}>
                                <div style={{ width: '100%' }}>
                                    <small><strong>Select City</strong></small><br />
                                    <select name="" id="">
                                        <option value="" disabled>City</option>
                                        <option value="">Pune</option>
                                        <option value="">Nagpur</option>
                                        <option value="">Mumbai</option>
                                        <option value="">Thane</option>
                                        <option value="">Palghar</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                {/* Reference 1 */}

                {userProfileDoc && userProfileDoc.reference1 && <div className="profile-card">
                    <h1 className="profile-card-heading">Reference 1</h1>
                    <div style={{ padding: '8px' }} />
                    <div className="row no-gutters" style={{ padding: '0 10px' }}>
                        <div className="col-lg-4 col-md-4 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static">
                                <div style={{ width: '100%' }}>
                                    <small><strong>Name</strong></small><br />
                                    <input placeholder="Enter Name" type="text" value={userProfileDoc.reference1.name}>

                                    </input>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static">
                                <div style={{ width: '100%' }}>
                                    <small><strong>Email</strong></small><br />
                                    <input placeholder="Enter Email" type="email" value={userProfileDoc.reference1.email} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static" style={{ borderRight: 'none' }}>
                                <div style={{ width: '100%' }}>
                                    <small><strong>Mobile Number</strong></small><br />
                                    <input placeholder="Enter Mobile Number" type="number" value={userProfileDoc.reference1.mobile} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static" style={{ borderRight: 'none', borderBottom: 'none', paddingBottom: '2px' }}>
                                <div style={{ width: '100%' }}>
                                    <small><strong>Local Address</strong></small><br />
                                    <textarea name="" placeholder="Enter Address" id="" value={userProfileDoc.reference1.address}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                <br />
                {/* Reference 2 */}
                {userProfileDoc && userProfileDoc.reference2 && <div className="profile-card">
                    <h1 className="profile-card-heading">Reference 2</h1>
                    <div style={{ padding: '8px' }} />
                    <div className="row no-gutters" style={{ padding: '0 10px' }}>
                        <div className="col-lg-4 col-md-4 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static">
                                <div style={{ width: '100%' }}>
                                    <small><strong>Name</strong></small><br />
                                    <input placeholder="Enter Name" type="text" value={userProfileDoc.reference2.name}>

                                    </input>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static">
                                <div style={{ width: '100%' }}>
                                    <small><strong>Email</strong></small><br />
                                    <input placeholder="Enter Email" type="email" value={userProfileDoc.reference2.email} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static" style={{ borderRight: 'none' }}>
                                <div style={{ width: '100%' }}>
                                    <small><strong>Mobile Number</strong></small><br />
                                    <input placeholder="Enter Mobile Number" type="number" value={userProfileDoc.reference2.mobile} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12" style={{ padding: '0' }}>
                            <div className="employee-details-static" style={{ borderRight: 'none', borderBottom: 'none', paddingBottom: '2px' }}>
                                <div style={{ width: '100%' }}>
                                    <small><strong>Local Address</strong></small><br />
                                    <textarea name="" placeholder="Enter Address" id="" value={userProfileDoc.reference2.address}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

                <br />

            </div>
        </>

    )
}
