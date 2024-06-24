import React from 'react'
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import PropertyCard from "../../components/property/PropertyCard";
import PropertyTable from '../../components/property/PropertyTable';
// import filter 
import Filters from '../../components/Filters';
const propertyFilter = ["Residential", "Commercial", "Rent", "Sale"];

const PGAdminProperty = () => {

    const { user } = useAuthContext();
    const { documents: properties, error: propertieserror } = useCollection(
        "properties"
    );

    // filter code start 
    const [filter, setFilter] = useState(propertyFilter[0]);
    const changeFilter = (newFilter) => {
        setFilter(newFilter);
    };
    const filterProperties = properties
        ? properties.filter((document) => {
            switch (filter) {
                case "All":
                    return true;
                case "Residential":
                    return (document.category.toUpperCase() === "RESIDENTIAL");
                case "Commercial":
                    return (document.category.toUpperCase() === "COMMERCIAL");
                case "Rent":
                    return (document.purpose.toUpperCase() === "RENT");
                case "Sale":
                    return (document.purpose.toUpperCase() === "SALE");
                default:
                    return true;
            }
        })
        : null;
    // filter code end 



    // card and table view mode functionality start
    const [viewMode, setviewMode] = useState('card_view'); // Initial mode is grid with 3 columns

    const handleModeChange = (newViewMode) => {
        setviewMode(newViewMode);
    };
    // card and table view mode functionality end

    return (
        <div className="top_header_pg pg_bg">
            <div className="page_spacing">
                <div className="pg_header d-flex justify-content-between">
                    <div className="left">
                        <h2 className="m22">All properties {" "}
                            {/* <span className="r14 light_black" >( All application users : {users && users.length} )</span> */}
                        </h2>
                    </div>
                    <div className="right">
                        <img src="./assets/img/icons/excel_logo.png" alt="" className="excel_dowanload" />
                    </div>
                </div>
                <div className="vg12"></div>
                <div className="filters">
                    <div className='left'>
                        <div className="rt_global_search search_field">
                            <input
                                placeholder='Search'
                            ></input>
                            <div class="field_icon"><span class="material-symbols-outlined">search</span></div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="user_filters new_inline">
                            {properties && (
                                <Filters
                                    changeFilter={changeFilter}
                                    filterList={propertyFilter}
                                    filterLength={filterProperties.length}
                                />
                            )}
                        </div>
                        <div className="button_filter diff_views">
                            <div className={`bf_single ${viewMode === 'card_view' ? 'active' : ''}`} onClick={() => handleModeChange('card_view')}>
                                <span className="material-symbols-outlined">calendar_view_month</span>
                            </div>
                            <div className={`bf_single ${viewMode === 'table_view' ? 'active' : ''}`} onClick={() => handleModeChange('table_view')}>
                                <span className="material-symbols-outlined">view_list</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="property_cards_parent">
                    {viewMode === "card_view" && (
                        <>
                            {properties &&
                                filterProperties.map((property) => (
                                    <PropertyCard propertyid={property.id} />
                                ))}
                        </>
                    )}


                </div>
                {viewMode === "table_view" && (
                    <>
                        {properties && <PropertyTable properties={filterProperties} />}
                    </>
                )}

            </div>
        </div>
    )
}
export default PGAdminProperty;
