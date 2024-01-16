import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";
import Filters from "../../../Components/Filters";
import PropAgentPropertyCard from "./PropAgentPropertyCard";

const propertyFilter = ["ACTIVE", "INACTIVE", "PENDING APPROVAL"];

const PropAgentMyProperties = ({ propSearchFilter }) => {
    // const { state } = useLocation();
    // const { propSearchFilter } = state;
    // const { filterType } = state;
    // console.log('propSearchFilter', propSearchFilter)
    // console.log('filterType', filterType)

    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    const { user } = useAuthContext();
    const { logout, isPending } = useLogout();
    // const [properties, setProperties] = useState([]);
    const [filter, setFilter] = useState(propSearchFilter !== '' ? propSearchFilter : "ACTIVE");

    // console.log('user:', user)
    const { documents: dbpropertiesdocuments, error: dbpropertieserror } =
        useCollection("properties", ["postedBy", "==", "Agent"]);

    // console.log('dbpropertiesdocuments:', dbpropertiesdocuments)

    const propertiesdocuments = user && user.uid && dbpropertiesdocuments && dbpropertiesdocuments.filter(
        (item) => item.createdBy.id === user.uid);


    // console.log('propertiesdocuments:', propertiesdocuments)

    // useEffect(() => {
    //     let flag = user && user.role === "propagent";

    //     if (!flag) {
    //         logout();
    //     }

    // }, [user, logout]);

    const changeFilter = (newFilter) => {
        setFilter(newFilter);
    };


    // console.log('filer in getProperties', filter)    
    let properties = propertiesdocuments
        ? propertiesdocuments.filter((document) => {
            let filteredProperty = false;
            switch (filter) {
                case "ACTIVE":
                    document.status === "active"
                        ? (filteredProperty = true)
                        : (filteredProperty = false);

                    return filteredProperty;
                case "INACTIVE":
                    document.status === "inactive"
                        ? (filteredProperty = true)
                        : (filteredProperty = false);

                    return filteredProperty;

                case "PENDING APPROVAL":
                    document.status === "pending approval"
                        ? (filteredProperty = true)
                        : (filteredProperty = false);

                    return filteredProperty;

                default:
                    return true;
            }
        })
        : null;

    return (
        <div className="propagent_myproperties">
            <div className="">
                {properties &&
                    (filter === "BYME" ||
                        filter === "ACTIVE" ||
                        filter === "INACTIVE" ||
                        filter === "PENDING APPROVAL") && (
                        <Filters
                            changeFilter={changeFilter}
                            filterList={propertyFilter}
                            activeFilter={filter}
                            filterLength={properties && properties.length}
                        />
                    )}


                {properties && properties.length === 0 && (
                    <h2 className="p_title">No property available</h2>
                )}

                <div className="ppc_single_parent">
                    {properties &&
                        properties.map((property) => (
                            <PropAgentPropertyCard
                                key={property.id}
                                property={property}
                            />
                        ))}
                </div>
                <div className="verticall_gap"></div>
                <div className="verticall_gap_991"></div>
            </div>
        </div>
    )

}

export default PropAgentMyProperties;