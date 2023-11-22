import React from 'react'
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PGAgentDashboard = () => {

    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    return (
        <div className='top_header_pg'>
           <h1 className='mt-3 mb-3'> PGAgentDashboard</h1>
        </div>
    )
}

export default PGAgentDashboard
