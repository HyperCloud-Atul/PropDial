import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
// import Avatar from "../../Components/Avatar";
import { useFirestore } from "../../hooks/useFirestore";
import { useHistory, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import Filters from "../../Components/Filters";
import BillList from "../../Components/BillList";
import PhotoList from "../../Components/PhotoList";

// component
import PropertySidebar from "../../Components/PropertySidebar";
import PropertyDocumentList from "../../Components/PropertyDocumentList";

const propertyBillsFilter = ["PENDING", "COMPLETED", "CANCELLED"];
let filterLength = 0;
export default function PGPropertyBills() {

    const { propertyid } = useParams()
    console.log('property id: ', propertyid)

    // const { state } = useLocation();
    // const { propertyid } = state;
    const { user } = useAuthContext();
    const { updateDocument, response } = useFirestore("properties");
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
