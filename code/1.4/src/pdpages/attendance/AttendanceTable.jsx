import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuthContext } from "../../hooks/useAuthContext";
// import { useCommon } from "../../../../hooks/useCommon";
// import { useCollection } from "../../../../hooks/useCollection";
// import component
// import ReactTable from "../../../../components/ReactTable";
import ReactTable from "../../components/ReactTable";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AttendanceTable = ({ attendanceDoc }) => {
    // const { user } = useAuthContext();

    // console.log("attendanceDoc: ", attendanceDoc)

    const columns = [

        {
            Header: "Date",
            accessor: "date",
            Cell: ({ value }) => (
                <>
                    <div className="name">{value}</div>
                    <div>{days[new Date(value).getDay()]}</div>
                </>
            ),
            disableFilters: true,
        },
        {
            Header: "Attendance",
            // accessor: "attendanceDoc",
            Cell: ({ row }) => (
                <>
                    <div className="name" style={{ fontSize: "2rem", fontWeight: "bolder" }} >{row.original.workHrs}</div>
                    <div className="name"><strong>Punch-In:</strong> {row.original.punchIn}</div>
                    <div className="name"><strong>Punch-Out:</strong>  {row.original.punchOut}</div>
                </>
            ),
            disableFilters: true,
        },
        {
            Header: "Meter Reading",
            // accessor: "attendanceDoc",
            Cell: ({ row }) => (
                <>
                    <div className="name" style={{ fontSize: "2rem", fontWeight: "bolder" }} >{row.original.tripDistance} Km.</div>
                    <div className="name"><strong>Trip-Start:</strong> {row.original.tripStart}</div>
                    <div className="name"><strong>Trip-End:</strong>  {row.original.tripEnd}</div>
                </>
            ),
            disableFilters: true,
        },
        // {
        //     Header: "Punch-In",
        //     accessor: "punchIn",
        //     Cell: ({ value }) => (
        //         <div className="mobile_min_width">                   
        //             <div className="name">{value}</div>
        //         </div>
        //     ),
        //     disableFilters: true,
        // },
        // {
        //     Header: "Punch-Out",
        //     accessor: "punchOut",
        //     Cell: ({ value }) => (
        //         <div className="mobile_min_width">                    
        //             <div className="name">{value}</div>
        //         </div>
        //     ),
        //     disableFilters: true,
        // },
        // {
        //     Header: "Work Hours",
        //     accessor: "workHrs",
        //     Cell: ({ value }) => (
        //         <div className="mobile_min_width">
        //             <div className="name">{value}</div>
        //         </div>
        //     ),
        //     disableFilters: true,
        // }

    ]

    return (
        <div >
            <ReactTable tableColumns={columns} tableData={attendanceDoc} />
        </div>
    );
};

export default AttendanceTable;
