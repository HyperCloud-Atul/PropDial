import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFirestore } from '../../hooks/useFirestore';

const PGAttendence = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();

    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    return (
        <div className='container'>
            <br />
            <br />
            <br />
            <br />

            <div>
                <h1>Atul Tripathi</h1>
                <h2>12/jun/07</h2>
                <button>Punch In</button>
            </div>
            <br />
            <table>
                <tr>
                    <th>Date</th>
                    <th>Punch In</th>
                    <th>Punch Out</th>
                    <th>Duration</th>
                </tr>
                <tr>
                    <td>27/Jan/25</td>
                    <td>09:00 am</td>
                    <td>06:00 pm</td>
                    <td>08:10 Hours</td>
                </tr>
                <tr>
                    <td>27/Jan/25</td>
                    <td>09:00 am</td>
                    <td>06:00 pm</td>
                    <td>08:10 Hours</td>
                </tr>
                <tr>
                    <td>27/Jan/25</td>
                    <td>09:00 am</td>
                    <td>06:00 pm</td>
                    <td>08:10 Hours</td>
                </tr>
                <tr>
                    <td>27/Jan/25</td>
                    <td>09:00 am</td>
                    <td>06:00 pm</td>
                    <td>08:10 Hours</td>
                </tr>
            </table>

            <br />
        </div>
    )
}

export default PGAttendence