import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";
import PropAgentMyProperties from "./PropAgentMyProperties";
import PropAgentAllProperties from "./PropAgentAllProperties";

const PGAgentProperties = () => {
    const { state } = useLocation();
    const { propSearchFilter } = state;

    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    const { user } = useAuthContext();
    const { logout, isPending } = useLogout();
    const [toggleFlag, setToggleFlag] = useState(propSearchFilter === 'ACTIVE' || propSearchFilter === 'INACTIVE' || propSearchFilter === 'PENDING APPROVAL' ? true : false);

    // useEffect(() => {
    //     let flag = user && (user.role === "propagent" || user.role === "propagentadmin");

    //     if (!flag) {
    //         logout();
    //     }
    //     // if (filterBy === 'BYOTHERS') setToggleFlag(true);
    // }, [user, logout]);

    const toggleBtnClick = () => {
        // console.log('toggleBtnClick', toggleFlag)
        if (toggleFlag) {
            // setFlag('BYME')            
        } else {
            // setFlag('BYOTHERS')            
        }

        setToggleFlag(!toggleFlag);
    };

    return (
        <div className="top_header_pg pa_bg">
            <div className="pa_inner_page">
                <div className="brf_icon">
                    <Link to="/agentaddproperties/new">
                        <div className="brfi_single">
                            <span className="material-symbols-outlined">add</span>
                        </div>
                    </Link>
                </div>
                <div className="my_prop_card my_all_filter">
                    <div className="residential-commercial-switch" style={{ top: "0" }}>
                        <span
                            className={toggleFlag ? "active" : ""}
                            style={{ color: "var(--theme-blue)" }}
                        >
                            My Properties
                        </span>
                        <div
                            className={
                                toggleFlag
                                    ? "toggle-switch off commercial"
                                    : "toggle-switch on residential"
                            }
                            style={{ padding: "0 10px" }}
                        >

                            <div onClick={toggleBtnClick}>
                                <div></div>
                            </div>
                        </div>
                        <span
                            className={toggleFlag ? "" : "active"}
                            style={{ color: "var(--theme-orange)" }}
                        >
                            All Properties
                        </span>
                    </div>

                </div>
                <div className="verticall_gap"></div>
                {/* <div>{searchText}</div> */}
                {toggleFlag === true ? <PropAgentMyProperties propSearchFilter={propSearchFilter} /> : <PropAgentAllProperties propSearchFilter={propSearchFilter} />}
            </div>
        </div>
    )
};

export default PGAgentProperties;