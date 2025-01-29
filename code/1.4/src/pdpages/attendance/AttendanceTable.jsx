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
            Header: "Punch-In",
            accessor: "punchIn",
            Cell: ({ value }) => (
                <div className="mobile_min_width">
                    {/* {value && format(value.toDate(), "dd-MMM-yy hh:mm a")} */}
                    {/* {value && format(value.toDate(), "hh:mm a")} */}
                    <div className="name">{value}</div>
                </div>
            ),
            disableFilters: true,
        },
        {
            Header: "Punch-Out",
            accessor: "punchOut",
            Cell: ({ value }) => (
                <div className="mobile_min_width">
                    {/* {value && format(value.toDate(), "dd-MMM-yy hh:mm a")} */}
                    {/* {value && format(value.toDate(), "hh:mm a")} */}
                    <div className="name">{value}</div>
                </div>
            ),
            disableFilters: true,
        },
        {
            Header: "Work Hours",
            accessor: "workHrs",
            Cell: ({ value }) => (
                <div className="mobile_min_width">
                    <div className="name">{value}</div>
                </div>
            ),
            disableFilters: true,
        }

    ]

    return (
        <div >
            <ReactTable tableColumns={columns} tableData={attendanceDoc} />
        </div>
    );
};

export default AttendanceTable;
