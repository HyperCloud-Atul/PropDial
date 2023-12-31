import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
// import Avatar from "../../Components/Avatar";
// import { useFirestore } from "../../hooks/useFirestore";
// import { useHistory, useLocation } from "react-router-dom";
// import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useDocument } from "../../hooks/useDocument";
import Filters from "../../Components/Filters";
import BillList from "../../Components/BillList";
// import PhotoList from "../../Components/PhotoList";

// component
import PropertySidebar from "../../Components/PropertySidebar";
// import PropertyDocumentList from "../../Components/PropertyDocumentList";

const propertyBillsFilter = ["PENDING", "COMPLETED", "CANCELLED"];
let filterLength = 0;
export default function PGPropertyBills() {

    const { propertyid } = useParams()
    console.log('property id: ', propertyid)

    // const { state } = useLocation();
    // const { propertyid } = state;
    // const { user } = useAuthContext();
    // const { updateDocument, response } = useFirestore("properties");
    // const { documents: propertydocument, error: propertyerror } = useCollection(
    //     "properties",
    //     ["propertyid", "==", propertyid]
    // );
    const { document: propertydoc, error: propertydocerror } = useDocument('properties', propertyid)
    console.log('property document:', propertydoc)

    const [filter, setFilter] = useState("PENDING");
    const { documents: billsdocuments, error: billserror } = useCollection(
        "bills",
        ["propertyid", "==", propertyid]
    );
    // const { documents: photosdocuments, error: photoserror } = useCollection(
    //     "photos",
    //     ["propertyid", "==", propertyid]
    // );
    // const { documents: propertydocuments, error: propertydocumentserror } =
    //     useCollection("documents", ["propertyid", "==", propertyid]);

    const changeFilter = (newFilter) => {
        setFilter(newFilter);
    };

    if (billsdocuments) {
        filterLength = billsdocuments.length;
    }

    return (
        <>
            <div className="dashboard_pg aflbg property_setup">
                <div className="sidebarwidth">
                    {propertyid && <PropertySidebar propertyid={propertyid} />}
                </div>
                <div className="right_main_content">
                    <div className="property-detail">
                        <div class="accordion" id="a1accordion_section">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="a1headingOne">
                                    <button
                                        class="accordion-button"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#a1collapseOne"
                                        aria-expanded="true"
                                        aria-controls="a1collapseOne"
                                    >
                                        <div className="inner">
                                            <div className="left">
                                                <h5>{propertydoc && propertydoc.unitNumber} | {propertydoc && propertydoc.society}</h5>
                                                <h6>
                                                    {propertydoc && propertydoc.locality},
                                                    <br />
                                                    {propertydoc && propertydoc.city} | {propertydoc && propertydoc.state}
                                                </h6>
                                            </div>
                                            <div className="right">
                                                <h5>{propertydoc && propertydoc.ownerDetails.displayName}</h5>
                                                <h6>{propertydoc && propertydoc.ownerDetails.phoneNumber}</h6>
                                            </div>
                                        </div>
                                    </button>
                                </h2>
                                <div
                                    id="a1collapseOne"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="a1headingOne"
                                    data-bs-parent="#a1accordion_section"
                                >
                                    <div class="accordion-body">
                                        <div class="secondary-details-display">
                                            <div class="secondary-details-inside-display">
                                                <h5 style={{ textAlign: "center" }}>Atul Tripathi</h5>
                                                <div
                                                    class="property-contact-div property-media-icons-horizontal"
                                                    style={{
                                                        flexDirection: "row",
                                                        width: "100%",
                                                        height: "auto",
                                                    }}
                                                >
                                                    {propertydoc && propertydoc.ownerDetails &&
                                                        <a href={'Tel: +91' + propertydoc.ownerDetails.phoneNumber}>
                                                            <div>
                                                                <span class="material-symbols-outlined">call</span>
                                                                <h1>Call</h1>
                                                            </div>
                                                        </a>
                                                    }
                                                    {propertydoc && propertydoc.ownerDetails &&
                                                        <a href={'https://wa.me/+91' + propertydoc.ownerDetails.phoneNumber}>
                                                            <div>
                                                                <img
                                                                    src="/assets/img/whatsapp_square_icon.png"
                                                                    alt=""
                                                                />
                                                                <h1>WhatsApp</h1>
                                                            </div>
                                                        </a>
                                                    }
                                                    {propertydoc && propertydoc.ownerDetails &&
                                                        <a href={'mailto:' + propertydoc.ownerDetails.emailID}>
                                                            <div>
                                                                <span class="material-symbols-outlined">
                                                                    alternate_email
                                                                </span>
                                                                <h1>Mail</h1>
                                                            </div>
                                                        </a>
                                                    }
                                                </div>
                                            </div>
                                            <hr class="secondary-details-hr" />
                                            <div style={{ width: "100%" }}>
                                                {propertydoc && propertydoc.coownerDetails &&
                                                    <div>
                                                        <h5 style={{ textAlign: "center" }}>
                                                            {propertydoc.coownerDetails.role === 'coowner' ? propertydoc.coownerDetails.displayName : 'No Co-Owner Assigned'}
                                                        </h5>
                                                    </div>
                                                }
                                                <div
                                                    class="property-contact-div property-media-icons-horizontal"
                                                    style={{
                                                        flexDirection: "row",
                                                        width: "100%",
                                                        height: "auto",
                                                    }}
                                                >
                                                    {propertydoc && propertydoc.coownerDetails &&
                                                        <a href={'Tel: +91' + propertydoc.coownerDetails.phoneNumber}>
                                                            <div>
                                                                <span class="material-symbols-outlined">call</span>
                                                                <h1>Call</h1>
                                                            </div>
                                                        </a>
                                                    }
                                                    {propertydoc && propertydoc.coownerDetails &&
                                                        <a href={'https://wa.me/+91' + propertydoc.coownerDetails.phoneNumber}>
                                                            <div>
                                                                <img src="/assets/img/whatsapp_square_icon.png" alt="" />
                                                                <h1>WhatsApp</h1>
                                                            </div>
                                                        </a>
                                                    }
                                                    {propertydoc && propertydoc.coownerDetails &&
                                                        <a href={'mailto: ' + propertydoc.coownerDetails.emailID}>
                                                            <div>
                                                                <span class="material-symbols-outlined">
                                                                    alternate_email
                                                                </span>
                                                                <h1>Mail</h1>
                                                            </div>
                                                        </a>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div>Property Bills</div>
                    <Filters
                        changeFilter={changeFilter}
                        filterList={propertyBillsFilter}
                        filterLength={filterLength}
                    />
                    {/* <PropertyDetails property={document} /> */}
                    {filter === "PENDING" && billsdocuments && (
                        <BillList bills={billsdocuments} />
                    )}

                    {/* {filter === "PHOTOS" && photosdocuments && (
                        <PhotoList photos={photosdocuments} />
                    )} */}
                    {/* 
                    {filter === "DOCS" && photosdocuments && (
                        <PropertyDocumentList propertydocs={propertydocuments} />
                    )} */}
                </div>
            </div>
        </>
    );
}
