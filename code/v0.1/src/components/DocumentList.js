import React from 'react'
import './PhotoList.css'
import { useAuthContext } from '../hooks/useAuthContext'

export default function DocumentList({ docs }) {
    const { user } = useAuthContext()
    return (
        <div>
            {docs.length === 0 && <p>No Doc Yet!</p>}
            <div className="row">
                {docs.map(doc => (
                    <>
                        {/* <div>
                            <h1>My Component</h1>
                            <iframe src="https://www.example.com" title="External Content" width="500" height="300"></iframe>
                        </div> */}
                        {/* {console.log('document url: ', photo.documenturl)} */}
                        <div className="col-lg-6 col-sm-12 col-sm-12" style={{ padding: '10px' }}>
                            <a href={doc.documenturl} target='_blank' rel="noreferrer">
                                {/* <iframe src={doc.documenturl} title="Document" width="100%" height="250px"> */}
                                <div className="property-image-div">
                                    <img src='https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/propertyDocuments%2Fpdf_thumbnail.png?alt=media&token=dd3dbe09-c073-4c9b-9fff-51645cdb6199' className="property-image" alt=""></img>

                                    {user.role === 'admin' &&
                                        <div onclick="moreClickOpen(moreBtnDetails1)" className="object-more-icon">
                                            <span className="material-symbols-outlined">
                                                more_vert
                                            </span>
                                        </div>
                                    }
                                    {user.role === 'admin' &&
                                        <div id="moreBtnDetails1" className="object-more-details">

                                            <div>
                                                <span className="material-symbols-outlined">
                                                    cloud_upload
                                                </span>
                                                <h1>UPLOAD</h1>
                                            </div>

                                            <div>
                                                <span className="material-symbols-outlined">
                                                    delete
                                                </span>
                                                <h1>TRASH</h1>
                                            </div>

                                        </div>
                                    }

                                </div>
                            </a>
                            {/* </iframe> */}
                            <div className="propety-description">
                                <h1>{doc.documentName}</h1>
                                <div className="indicating-letter"></div>
                            </div>


                        </div>


                    </>
                ))}
            </div>
        </div>
    )
}
