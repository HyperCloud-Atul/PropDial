import React from 'react'
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";


// components
import Filters from "../../../components/Filters";
import PropertyDetail from "../../../components/property/SearchProperty";


const propertyFilter = ["ALL", "RESIDENTIAL", "COMMERCIAL", "INACTIVE"];
// const propertyFilter = ["ALL", "ACTIVE", "INACTIVE"];

const PGAgentProperties = () => {

    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    // switch
    const [toggleFlag, setToggleFlag] = useState(false);
    const [propertyList, setPropertyList] = useState("byMe"); //by me/by other
    const toggleBtnClick = () => {
        if (toggleFlag) setPropertyList("byMe");
        else setPropertyList("byOthers");

        setToggleFlag(!toggleFlag);
    };
    // switch

    const { user } = useAuthContext();
    const { logout, isPending } = useLogout();
    const { documents: propertiesdocuments, error: propertieserror } =
        useCollection("properties");

    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        let flag = ((user && user.role === "propagent"));

        if (!flag) {
            logout();
        }
    }, [user, logout]);

    const changeFilter = (newFilter) => {
        setFilter(newFilter);
    };

    const properties = propertiesdocuments
        ? propertiesdocuments.filter((document) => {
            let filteredProperty = false;
            switch (filter) {
                case "ALL":
                    // document.taggedUsersList.forEach((u) => {
                    //   if (u.id === user.uid) {
                    //     filteredProperty = true;
                    //   }
                    // });

                    (document.ownerDetails.id === user.uid) || (document.coownerDetails.id === user.uid) ? filteredProperty = true : filteredProperty = false;

                    return filteredProperty;
                case "RESIDENTIAL":
                    // document.taggedUsersList.forEach((u) => {
                    //   if (
                    //     u.id === user.uid &&
                    //     document.category.toUpperCase() === "RESIDENTIAL"
                    //   ) {
                    //     filteredProperty = true;
                    //   }
                    // });

                    ((document.ownerDetails.id === user.uid) || (document.coownerDetails.id === user.uid)) &&
                        document.category.toUpperCase() === "RESIDENTIAL" ? filteredProperty = true : filteredProperty = false;

                    return filteredProperty;
                case "COMMERCIAL":
                    // document.taggedUsersList.forEach((u) => {
                    //   if (
                    //     u.id === user.uid &&
                    //     document.category.toUpperCase() === "COMMERCIAL"
                    //   ) {
                    //     filteredProperty = true;
                    //   }
                    // });
                    ((document.ownerDetails.id === user.uid) || (document.coownerDetails.id === user.uid)) &&
                        document.category.toUpperCase() === "COMMERCIAL" ? filteredProperty = true : filteredProperty = false;

                    return filteredProperty;
                case "INACTIVE":
                    // document.taggedUsersList.forEach((u) => {
                    //   if (
                    //     u.id === user.uid &&
                    //     document.status.toUpperCase() === "INACTIVE"
                    //   ) {
                    //     filteredProperty = true;
                    //   }
                    // });

                    ((document.ownerDetails.id === user.uid) || (document.coownerDetails.id === user.uid)) &&
                        document.status.toUpperCase() === "INACTIVE" ? filteredProperty = true : filteredProperty = false;

                    return filteredProperty;
                default:
                    return true;
            }
        })
        : null;


    return (
        <div className='top_header_pg aflbg '>
            <div className='brf_icon'>
                <Link to='/agentaddproperties'>
                    <div className='brfi_single'>
                        <span className="material-symbols-outlined">
                            add
                        </span>
                    </div>
                </Link>
            </div>
            <div className='container'>
                <br />
                <section className='single_card'>
                    <div
                        className="d-flex"
                        style={{
                            alignItems: "center",
                        }}
                    >
                        <div
                            className="residential-commercial-switch"
                            style={{ top: "0" }}
                        >
                            <span
                                className={toggleFlag ? "" : "active"}
                                style={{ color: "var(--theme-blue)" }}
                            >
                                By Me
                            </span>
                            <div
                                className={
                                    toggleFlag
                                        ? "toggle-switch on commercial"
                                        : "toggle-switch off residential"
                                }
                                style={{ padding: "0 10px" }}
                            >
                                {/* <small>{toggleFlag ? 'On' : 'Off'}</small> */}
                                <div onClick={toggleBtnClick}>
                                    <div></div>
                                </div>
                            </div>
                            <span
                                className={toggleFlag ? "active" : ""}
                                style={{ color: "var(--theme-orange)" }}
                            >
                                By Others
                            </span>
                        </div>
                    </div>
                </section>

                <section>
                    <div>
                        <div className="page-title">
                            <span className="material-symbols-outlined">real_estate_agent</span>
                            <h1>Properties </h1>
                        </div>
                        {propertieserror && <p className="error">{propertieserror}</p>}
                        {/* {billserror && <p className="error">{billserror}</p>} */}
                        {propertiesdocuments && (
                            <Filters
                                changeFilter={changeFilter}
                                filterList={propertyFilter}
                                filterLength={properties.length}
                            />
                        )}
                        {/* {billsdocuments && <Filters changeFilter={changeFilter} />} */}

                        {/* {properties && <PropertyList properties={properties} />} */}

                        {/* {bills && <BillList bills={bills} />} */}
                        <br></br>
                        <div className="property_card_left">
                            {propertiesdocuments && <PropertyDetail propertiesdocuments={propertiesdocuments} />}
                        </div>
                    </div>
                </section>
                <br />
            </div>
        </div>
    )
}

export default PGAgentProperties
