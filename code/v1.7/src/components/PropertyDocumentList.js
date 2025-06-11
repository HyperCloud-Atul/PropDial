import React from 'react'
// import './PropertyDocumentList.css'
export default function PropertyDocumentList({ propertydocs }) {
    return (
        <div>
            {propertydocs.length === 0 && <p>No Document Yet!</p>}
            <div className="row">
                {propertydocs.map(propertydoc => (
                    <>
                        <div className="col-lg-4 col-sm-6 col-sm-12" style={{ padding: '10px' }}>
                            <div className="property-image-div">
                                <img src={propertydoc.photourl} className="property-image" alt="propdial"></img>
                                <div onclick="moreClickOpen(moreBtnDetails1)" className="object-more-icon">
                                    <span className="material-symbols-outlined">
                                        more_vert
                                    </span>
                                </div>
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

                            </div>
                            <div className="propety-description">
                                <h1>{propertydoc.name}</h1>
                                <div className="indicating-letter"></div>
                            </div>
                        </div>

                    </>
                ))}
            </div>
        </div>
    )
}
