import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { projectFirestore } from "../../firebase/config";
import { timestamp } from "../../firebase/config";
import { format } from "date-fns";
import dayjs from "dayjs"; // Library for time calculations

import AttendanceTable from "./AttendanceTable";
import Popup from "../../components/Popup";
import PunchInOut from "../../components/attendance/PunchInOut";
import CurrentDateTime from "../../components/CurrentDateTime";
import ScrollToTop from "../../components/ScrollToTop";
import InactiveUserCard from "../../components/InactiveUserCard";

// import scss
import "./PGAttendance.scss";

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
//Restrict to Input
function restrictInput(event, maxLength) {
    // Get the value entered in the input field
    let inputValue = event.target.value;

    // Remove any non-numeric characters using a regular expression
    let numericValue = inputValue.replace(/[^0-9]/g, "");
    // console.log("numericValue: ", numericValue)

    if (numericValue.length > maxLength) {
        numericValue = numericValue.slice(0, maxLength);
    }

    // Update the input field with the numeric value
    event.target.value = numericValue;
}

const calculateTimeDifference = (punchIn, punchOut) => {
    // Convert 12-hour format to Date object
    const parseTime = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        return new Date(
            `2024-02-05T${String(hours).padStart(2, "0")}:${String(minutes).padStart(
                2,
                "0"
            )}:00`
        );
    };

    const punchInTime = parseTime(punchIn);
    const punchOutTime = parseTime(punchOut);

    // Calculate the difference in milliseconds
    const diffMs = punchOutTime - punchInTime;

    // Convert milliseconds to hours & minutes
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs} : ${diffMins}`;
};



const PGAttendance = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext(); // Current user

    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    const currentYear = new Date().getFullYear(); // Get current year
    const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]; // Create an array of years
    const [selectedYear, setSelectedYear] = useState(currentYear); // Set current year as default

    const currentMonthIndex = new Date().getMonth(); // Get current month index (0-11)
    const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
    // const [currentTime, setCurrentTime] = useState(new Date());

    const [startWeekDate, setStartWeekDate] = useState();
    const [endWeekDate, setEndWeekDate] = useState();


    const [greeting, setGreeting] = useState("");
    // const [attendance, setAttendance] = useState([]);
    const [punchIn, setPunchIn] = useState(null);
    const [tripStart, setTripStart] = useState(null);
    // const [tripEnd, setTripEnd] = useState(null);
    //Fetch Second Last Record
    const [topRecord, setTopRecord] = useState(null);
    const [tripEnd, setTripEnd] = useState(null);

    // console.log("attendence: ", attendance)
    const today = new Date();
    const formattedTodaysDate = format(today, "dd-MMM-yy"); // Formats as DD-MMM-YY
    const weekDay = days[today.getDay()]; // Current weekday



    const { addDocument, updateDocument, deleteDocument, error } = useFirestore(
        "attendance-propdial"
    );

    // const { documents: attendanceData, errors: attendanceDataError } =
    //     useCollection(
    //         "attendance-propdial",
    //         ["userId", "==", user.uid],
    //         ["date", "desc"],
    //         ["5"]
    //     );

    // console.log("attendanceData: ", attendanceData);

    const [attendanceData, setCurrentMonthRecords] = useState();
    const [currentWeekRecords, setCurrentWeekRecords] = useState();
    const [currentWeekDistance, setCurrentWeekDistance] = useState();
    const [currentWeekWorkedHours, setCurrentWeekWorkedHours] = useState();

    // console.log("currentWeekRecords: ", currentWeekRecords)

    //Popup Flags
    const [showPunchInPopup, setShowPunchInPopup] = useState(false);
    // const [showPopupFlag, setShowPopupFlag] = useState(false);
    const [popupReturn, setPopupReturn] = useState(false);
    const [showPopupPunchOutFlag, setShowPopupPunchOutFlag] = useState(false);
    // const [popupReturn, setPopupReturn] = useState(false);

    // console.log("check continuous log")
    // console.log("Top Record: ", topRecord)

    useEffect(() => {
        const getGreeting = () => {
            const currentHour = new Date().getHours(); // Get the current hour (0-23)

            if (currentHour < 12) {
                return "Good Morning";
            } else if (currentHour < 18) {
                return "Good Afternoon";
            } else {
                return "Good Evening";
            }
        };

        setGreeting(getGreeting());

        getCurrentWeekDates();

        // fetchCurrentWeekRecords()

        const currentMonthRecord = fetchSelectedMonthRecords(selectedMonth);
        // console.log("currentMonthRecord: ",)

        fetchTopRecord()

        // Update the time every second
        // const timer = setInterval(() => {
        //     setCurrentTime(new Date());
        // }, 1000);

        // Cleanup the interval on component unmount
        // return () => clearInterval(timer);
    }, [user.uid]); // Run once when the component mounts


    //Fetch Top Record
    const fetchTopRecord = async () => {
        // console.log("In fetchTopRecordRealTimeWithonSnapshot")
        try {
            // Step 1: Get the latest record
            const latestRecordRef = projectFirestore
                .collection("attendance-propdial")
                .where("userId", "==", user.uid)
                .orderBy("createdAt", "desc")
                .limit(1);

            const unsubscribe = latestRecordRef.onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    console.log("snapshot.docs[0].data(): ", snapshot.docs[0].data())
                    setTopRecord(snapshot.docs[0].data());
                }
            }, error => {
                console.log(error)
                // setError('could not fetch the data')
            })

            return () => unsubscribe(); // Cleanup listener when component unmounts

        } catch (error) {
            console.error("Error fetching second last record:", error);
        }
    }

    //Fetch Current Week Records
    // fetchCurrentWeekRecords(startOfWeek, endOfWeek)
    const fetchCurrentWeekRecords = async (_startOfWeek, _endOfWeek) => {
        // console.log("In fetchCurrentWeekRecords")
        try {
            const querySnapshot = await projectFirestore
                .collection("attendance-propdial")
                .where("userId", "==", user.uid)
                .where("createdAt", ">=", _startOfWeek)
                .where("createdAt", "<=", _endOfWeek)
                .orderBy("createdAt", "desc")

            const unsubscribe = querySnapshot.onSnapshot(snapshot => {
                let results = []
                snapshot.docs.forEach(doc => {
                    results.push({ ...doc.data(), id: doc.id })
                });

                // console.log("current week records: ", results)

                // // update state
                setCurrentWeekRecords(results)

                // Calculate total work hours
                const totalMinutes = results?.reduce((acc, record) => {
                    // console.log("record.workHrs? ", record.workHrs)
                    const [hours, minutes] = record.workHrs?.split(":").map(Number); // Convert to numbers
                    // const [hours, minutes] = record.workHrs; // Convert to numbers
                    return acc + hours * 60 + minutes;
                }, 0);

                // Convert minutes back to HH:mm format
                const totalHours = Math.floor(totalMinutes / 60);
                const totalMins = totalMinutes % 60;
                setCurrentWeekWorkedHours(`${String(totalHours).padStart(2, "0")}:${String(totalMins).padStart(2, "0")}`);

                // Total distance travelled for current week
                const sumOfDistance = results.reduce((acc, record) => acc + (record.tripDistance || 0), 0);
                setCurrentWeekDistance(sumOfDistance);

                // setError(null)
            }, error => {
                console.log(error)
                // setError('could not fetch the data')
            })

            return () => unsubscribe(); // Cleanup listener when component unmounts

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    //Fetch Selected Month Record
    const fetchSelectedMonthRecords = async (selmonth) => {
        // console.log("In fetchSelectedMonthRecords")
        setSelectedMonth(selmonth)
        // console.log("selectedMonth: ", selectedMonth)
        // Get first and last day of the current month
        const now = new Date();
        // console.log("Month: ", now.getMonth())

        const selectedMonthIndex = months.indexOf(selmonth);

        // const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDay = new Date(now.getFullYear(), selectedMonthIndex, 1);
        // const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const lastDay = new Date(now.getFullYear(), selectedMonthIndex + 1, 0, 23, 59, 59);

        try {
            const querySnapshot = await projectFirestore
                .collection("attendance-propdial")
                .where("userId", "==", user.uid)
                .where("createdAt", ">=", firstDay)
                .where("createdAt", "<=", lastDay)
                .orderBy("createdAt", "desc")

            const unsubscribe = querySnapshot.onSnapshot(snapshot => {
                let results = []
                snapshot.docs.forEach(doc => {
                    results.push({ ...doc.data(), id: doc.id })
                });

                // // update state
                setCurrentMonthRecords(results)
                // setError(null)
            }, error => {
                console.log(error)
                // setError('could not fetch the data')
            })

            return () => unsubscribe(); // Cleanup listener when component unmounts

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handelShowPunchInPopup = () => {
        setShowPunchInPopup(true);
    };

    const handlePunchInPopup = (action) => {

        if (action === "CONFIRM") {
            // setPopupReturn(true)
            handlePunchIn();
        }
        setShowPunchInPopup(false);
    };

    const showPunchOutPopup = () => {
        // e.preventDefault();
        setShowPopupPunchOutFlag(true);
        setPopupReturn(false);
    };

    const handlePunchOutPopup = (action) => {
        // console.log('Popup Action:', action)
        if (action === "CANCEL") {
            setPopupReturn(false);
        }
        if (action === "CONFIRM") {
            // setPopupReturn(true)
            handlePunchOut();
        }
        setShowPopupPunchOutFlag(false);
    };

    const handlePunchIn = async () => {
        if (!user) {
            alert("Please log in to punch in.");
            return;
        }

        const formattedPunchinTime = format(today, "hh:mm a"); // Formats as DD-MMM-YY

        try {
            // Add a punch-in record

            const data = {
                userId: user.uid,
                punchIn: formattedPunchinTime,
                punchOut: null,
                workHrs: "00:00",
                date: formattedTodaysDate,
                weekDay,
                tripStart,
            };

            await addDocument(data);

            // alert("Punch In successful!");
        } catch (error) {
            console.log("Error to add a Punch-in Record: ", error);
        }
    };

    const handlePunchOut = async () => {
        if (!user) {
            alert("Please log in to punch out.");
            return;
        }

        const formattedPunchoutTime = format(today, "hh:mm a"); // Formats as DD-MMM-YY

        try {
            // Find the punch-in record for today
            const record = await projectFirestore
                .collection("attendance-propdial")
                .where("userId", "==", user.uid)
                .where("date", "==", formattedTodaysDate)
                .get();

            if (record.empty) {
                alert("You have not punched in yet!");
                return;
            }

            const docId = record.docs[0].id;
            // const tripStart = record.docs[0].data().tripStart;

            //Validation Start Trip Reading should not be greater than End Trip Reading
            if (Number(tripEnd) <= Number(topRecord.tripStart)) {
                alert("Trip End Reading should not be less than Trip Start Reading!");
                return;
            }
            const tripDistance = Number(tripEnd) - Number(topRecord.tripStart);
            // console.log("record.docs[0]: ", record.docs[0].data())

            // Update the punch-out time
            const data = {
                punchOut: formattedPunchoutTime,
                workHrs: calculateTimeDifference(
                    topRecord.punchIn,
                    formattedPunchoutTime
                ),
                tripEnd,
                tripDistance,
            };

            await updateDocument(docId, data);

            // alert("Punch Out successful!");
            setPunchIn(null);
        } catch (error) {
            console.log("Error to Check the existing Punch-In record: ", error);
        }
    };

    const getCurrentWeekDates = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Get current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const startDiff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust if today is Sunday
        const startOfWeek = new Date(today.setDate(startDiff));
        const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

        // console.log("startOfWeek: ", startOfWeek)
        setStartWeekDate(startOfWeek)
        setEndWeekDate(endOfWeek)

        fetchCurrentWeekRecords(startOfWeek, endOfWeek)


        // return {
        //     startOfWeek: startOfWeek.toISOString().split("T")[0], // Format as YYYY-MM-DD
        //     endOfWeek: endOfWeek.toISOString().split("T")[0],
        // };
    };

    // console.log(getCurrentWeekDates());

    const lastFiveRecords = async () => {

        // Find the punch-in record for today
        const record = await projectFirestore
            .collection("attendance-propdial")
            .where("userId", "==", user.uid)
            // .where("date", "==", formattedTodaysDate)
            .limit(5)
            .get();

        console.log("record: ", record.docs[0].data())

        // return record.docs;
        return record;
    };

    //Fetch Second Last Record
    const [record, setRecord] = useState(null);
    useEffect(() => {
        // const fetchSecondLastRecord = async () => {
        //     try {
        //         // Step 1: Get the latest record
        //         const latestRecordRef = projectFirestore
        //             .collection("attendance-propdial")
        //             .where("userId", "==", user.uid)
        //             .orderBy("date", "desc")
        //             .limit(1);

        //         const latestSnapshot = await latestRecordRef.get();

        //         if (latestSnapshot.empty) {
        //             console.log("No records found");
        //             return;
        //         }

        //         const latestDoc = latestSnapshot.docs[0];

        //         // Step 2: Get the second last record, skipping the latest one
        //         const secondLastRecordRef = projectFirestore
        //             .collection("attendance-propdial")
        //             .where("userId", "==", user.uid)
        //             .orderBy("date", "desc")
        //             .startAfter(latestDoc) // Skip the latest record
        //             .limit(1);

        //         const secondLastSnapshot = await secondLastRecordRef.get();

        //         if (!secondLastSnapshot.empty) {
        //             setRecord({
        //                 id: secondLastSnapshot.docs[0].id,
        //                 ...secondLastSnapshot.docs[0].data(),
        //             });
        //         } else {
        //             console.log("No second last record found");
        //         }
        //     } catch (error) {
        //         console.error("Error fetching second last record:", error);
        //     }
        // };

        // fetchSecondLastRecord();
    }, [user.id]);

    // console.log("user details: ", user)

    // view mode control start
    const [viewMode, setViewMode] = useState("card_view");

    const handleModeChange = (newViewMode) => {
        setViewMode(newViewMode);
    };
    // view mode control end

    return (
        <>

            {user && user.status === "active" ? (
                <div >
                    <ScrollToTop />
                    {/* Pupup */}
                    <div>
                        <Modal
                            show={showPunchInPopup}
                            onHide={() => setShowPunchInPopup(false)}
                            centered
                        >
                            <Modal.Header
                                className="justify-content-center"
                                style={{
                                    paddingBottom: "0px",
                                    border: "none",
                                }}
                            >
                                <h5>
                                    Are you sure you want to Punch-In now?
                                </h5>
                            </Modal.Header>
                            <Modal.Body
                                className="text-center">
                                {user && user.vehicleStatus && (
                                    <input
                                        id="id_tripstart"
                                        className="custom-input"
                                        style={{ paddingRight: "10px" }}
                                        type="number"
                                        placeholder={topRecord && topRecord.tripEnd ? "Last Trip End: " + topRecord.tripEnd : ""}
                                        maxLength={7}
                                        onInput={(e) => {
                                            restrictInput(e, 7);
                                            // e.target.value = "45"
                                        }}
                                        onChange={(e) => setTripStart(e.target.value)}
                                    // value={topRecord && topRecord.tripEnd}
                                    />
                                )}
                            </Modal.Body>
                            <Modal.Footer
                                className="d-flex justify-content-between"
                                style={{
                                    border: "none",
                                    gap: "15px",
                                }}
                            >
                                {/* {errorForNoSelectReasonMessage && (
                      <div
                        style={{
                          fontSize: "15px",
                          padding: "4px 15px",
                          borderRadius: "8px",
                          background: "#ffe9e9",
                          color: "red",
                          width: "fit-content",
                          margin: "auto",
                        }}
                      >
                        {errorForNoSelectReasonMessage}
                      </div>
                    )} */}
                                <div
                                    className="done_btn"
                                    onClick={() => handlePunchInPopup("CONFIRM")}
                                // disabled={loading}
                                >
                                    {/* {loading ? "Saving..." : "Yes, Update"} */}
                                    Confirm
                                </div>
                                <div
                                    className="cancel_btn"
                                    onClick={() => setShowPunchInPopup(false)}
                                >
                                    Cancel
                                </div>
                            </Modal.Footer>
                        </Modal>

                        <div
                            className={showPopupPunchOutFlag ? "pop-up-div open" : "pop-up-div"}
                        >
                            <div>
                                <p>
                                    {showPopupPunchOutFlag &&
                                        " Are you sure you want to Punch-Out now? "}
                                </p>

                                {user && user.vehicleStatus && (
                                    <>
                                        <p>
                                            Trip Start:{" "}
                                            {topRecord &&
                                                topRecord.tripStart}
                                        </p>
                                        <input
                                            id="id_tripend"
                                            className="custom-input"
                                            style={{ paddingRight: "10px" }}
                                            type="number"
                                            placeholder="Trip End - Meter Reading"
                                            maxLength={7}
                                            onInput={(e) => {
                                                restrictInput(e, 7);


                                            }}
                                            onChange={(e) => setTripEnd(e.target.value)}
                                        // onChange={(e) => setTripEndTemp(e.target.value)}
                                        // value={
                                        //     topRecord && topRecord.tripEnd ? topRecord.tripEnd : topRecord && topRecord.tripStart ? topRecord.tripStart : ""
                                        // }
                                        // value={
                                        //     tripEndTemp
                                        // }
                                        />
                                        <p>
                                            {Number(tripEnd) > Number(topRecord && topRecord.tripStart) ? "Distance: " + (Number(tripEnd) - Number(topRecord && topRecord.tripStart)) + " KM" : "Trip End should be greater than Trip Start"}
                                        </p>
                                    </>
                                )}
                                <br></br>
                                <br></br>
                                <button
                                    onClick={() => handlePunchOutPopup("CONFIRM")}
                                    className="theme_btn btn_red pointer no_icon"
                                    style={{ margin: "0px" }}
                                // disabled={(Number(topRecord && topRecord.tripStart) >= Number(tripEndTemp)) ? true : false}
                                >
                                    CONFIRM
                                </button>
                                <button
                                    onClick={() => handlePunchOutPopup("CANCEL")}
                                    className="theme_btn btn_fill pointer no_icon"
                                    style={{ margin: "0px" }}
                                >
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="top_header_pg pg_bg attendance_pg relative">
                        {/* Left section */}
                        <div className="attendance_dashboard">
                            <div className="pg_header">
                                <h2>Your progress of this week {startWeekDate?.getDate()} - {endWeekDate?.getDate()} {months[endWeekDate?.getMonth()]?.slice(0, 3)}'{endWeekDate?.getFullYear()} </h2>
                            </div>
                            <div className="attendance_cards">
                                <div className="ac_single day">
                                    <h6>Total number of</h6>
                                    <h5>Days</h5>
                                    <h2>{currentWeekRecords?.length}</h2>
                                    <div className="icon">
                                        <div className="icon_inner">
                                            <img src="/assets/img/edicon/appointment.png" alt="" />
                                        </div>
                                    </div>
                                    <div className="trending">
                                        <div className="inner up">
                                            <span className="material-symbols-outlined">trending_up</span>
                                            <div className="value">2.5%</div>
                                        </div>
                                        <p>last week</p>
                                    </div>
                                </div>
                                <div className="ac_single hr">
                                    <h6>Total number of</h6>
                                    <h5>Hrs Worked</h5>                                    
                                    <h2>{currentWeekWorkedHours ? (currentWeekWorkedHours.split(":")[0]) + "hrs " + (currentWeekWorkedHours.split(":")[1]) + "mins" : "--:--"}</h2>
                                    <div className="icon">
                                        <div className="icon_inner">
                                            <img src="/assets/img/edicon/working-time.png" alt="" />
                                        </div>
                                    </div>
                                    <div className="trending">
                                        <div className="inner down">
                                            <span className="material-symbols-outlined">
                                                trending_down
                                            </span>
                                            <div className="value">0.5%</div>
                                        </div>
                                        <p>last week</p>
                                    </div>
                                </div>
                                <div className="ac_single dist">
                                    <h6>Total number of</h6>
                                    <h5>Distance</h5>
                                    <h2>{currentWeekDistance ? currentWeekDistance : "--:--"}</h2>
                                    <div className="icon">
                                        <div className="icon_inner">
                                            <img src="/assets/img/edicon/distance.png" alt="" />
                                        </div>
                                    </div>
                                    <div className="trending">
                                        <div className="inner up">
                                            <span className="material-symbols-outlined">trending_up</span>
                                            <div className="value">2.5%</div>
                                        </div>
                                        <p>last week</p>
                                    </div>
                                </div>
                            </div>

                            <div className="year_month">
                                <div className="left">
                                    <h2>Logs</h2>
                                </div>
                                <div className="right">
                                    <div className="filters">
                                        <div className="right">
                                            <div className="icon_dropdown">
                                                <select value={selectedMonth}
                                                    
                                                    onChange={(e) => fetchSelectedMonthRecords(e.target.value)}
                                                >
                                                    {months.map((month, index) => (
                                                        <option key={index} value={month}>
                                                            {month}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="icon_dropdown">
                                                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                                    {years.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="button_filter diff_views">
                                                <div
                                                    className={`bf_single ${viewMode === "card_view" ? "active" : ""
                                                        }`}
                                                    onClick={() => handleModeChange("card_view")}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        calendar_view_month
                                                    </span>
                                                </div>
                                                <div
                                                    className={`bf_single ${viewMode === "table_view" ? "active" : ""
                                                        }`}
                                                    onClick={() => handleModeChange("table_view")}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        view_list
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="export pointer">
                                                <img src="/assets/img/icons/excel_logo.png" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="previous_punch">
                                {
                                    attendanceData && attendanceData.length > 0 && attendanceData.map((data) => (
                                        <>
                                            <div className="pp_single">
                                                <div className="top">
                                                    <div className="left">
                                                        {data.date ? <h3>{data.date.slice(0, 2)}</h3> : ""}
                                                        {data.weekDay ? <h4>{data.weekDay.slice(0, 3)}</h4> : ""}
                                                    </div>
                                                    <div className="right">
                                                        <div className="r_single">
                                                            <h6> Hrs Worked</h6>
                                                            {data.workHrs === "00:00" ? "--:--" : <h5>{data.workHrs}</h5>}
                                                        </div>
                                                        <div className="r_single">
                                                            <h6> Distance</h6>
                                                            {data.tripDistance ? <h5>{data.tripDistance} KM</h5> : "--:--"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bottom">
                                                    <div className="b_single">
                                                        <h6>Punch In</h6>
                                                        {data.punchIn ? <h5>{data.punchIn}</h5> : "--:--"}
                                                    </div>
                                                    <div className="b_single">
                                                        <h6>Punch Out</h6>
                                                        {data.punchOut ? <h5>{data.punchOut}</h5> : "--:--"}
                                                    </div>
                                                    <div className="b_single">
                                                        <h6>Trip Start</h6>
                                                        {data.tripStart ? <h5>{data.tripStart}</h5> : "--:--"}
                                                    </div>
                                                    <div className="b_single">
                                                        <h6>Trip End</h6>
                                                        {data.tripEnd ? <h5>{data.tripEnd}</h5> : "--:--"}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Right side punch section */}
                        {/* <div className="punch">
                            <div className="punch_inner">
                                <div className="top">
                                    <div className="left">
                                        <h3>Hey {user && user.fullName}!</h3>
                                        <h6>{greeting}! Mark your attendance</h6>
                                    </div>
                                    <div className="right">
                                        <img src={user && user.photoURL} alt="" />
                                    </div>
                                </div>
                                <div className="body">
                               <div className="body_top">
                               <CurrentDateTime />
                                    {topRecord && topRecord.length === 0 ? (
                                        <div className="punch_button outer" onClick={handelShowPunchInPopup}>
                                            <div className="inner_one">
                                                <div className="inner_two">
                                                    <img src="/assets/img/hand-pointer.png" alt="" />
                                                    <h6>Punch In : Length === 0</h6>
                                                </div>
                                            </div>
                                        </div>
                                    ) : topRecord &&
                                        (topRecord.createdAt?.toDate() < ((new Date()).setHours(0, 0, 0, 0)) || !topRecord?.punchIn) ? (
                                        <div className="punch_button outer" onClick={handelShowPunchInPopup}>
                                            <div className="inner_one">
                                                <div className="inner_two">
                                                    <img src="/assets/img/hand-pointer.png" alt="" />
                                                    <h6>Punch In</h6>
                                                </div>
                                            </div>
                                        </div>
                                    ) : topRecord &&
                                        topRecord.date === formattedTodaysDate &&
                                        !topRecord.punchOut ? (
                                        <div
                                            className="punch_button punchout outer"
                                            onClick={showPunchOutPopup}
                                        >
                                            <div className="inner_one">
                                                <div className="inner_two">
                                                    <img src="/assets/img/punchouthand.png" alt="" />
                                                    <h6>Punch Out</h6>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="punch_button pio_done outer">
                                            <div className="inner_one">
                                                <div className="inner_two">
                                                   
                                                    <h6 className="text-center">Next Punch In Tomorrow</h6>
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    )}
                               </div>

                                    <div className="punch_detail">
                                        <div className="pd_single">
                                            <img src="/assets/img/punchin.png" alt="" />
                                            {topRecord && !topRecord.date === formattedTodaysDate ? (
                                                <div className="data">--:--</div>
                                            ) : (
                                                <div className="data">
                                                    {topRecord &&
                                                        topRecord.date === formattedTodaysDate &&
                                                        topRecord.punchIn
                                                        ? topRecord.punchIn
                                                        : "--:--"}
                                                </div>
                                            )}

                                            <h6>Punch In</h6>
                                        </div>
                                        <div className="pd_single">
                                            <img src="/assets/img/punchout.png" alt="" />
                                            {topRecord && !topRecord.date === formattedTodaysDate ? (
                                                <div className="data">--:--</div>
                                            ) : (
                                                <div className="data">
                                                    {topRecord &&
                                                        topRecord.date === formattedTodaysDate &&
                                                        topRecord.punchOut
                                                        ? topRecord.punchOut
                                                        : "--:--"}
                                                </div>
                                            )}
                                            <h6>Punch Out</h6>
                                        </div>

                                        <div className="pd_single">
                                            <img src="/assets/img/edicon/total_work.png" alt="" />
                                            {topRecord && !topRecord.date === formattedTodaysDate ? (
                                                <div className="data">--:--</div>
                                            ) : (
                                                <div className="data">
                                                    {
                                                        (
                                                            topRecord && topRecord.workHrs &&                                                           
                                                            topRecord.workHrs === "00:00")
                                                            ? "--:--" :
                                                            topRecord?.workHrs &&
                                                                topRecord.date === formattedTodaysDate ?
                                                                topRecord && topRecord.workHrs : "--:--"}
                                                </div>
                                            )}
                                            <h6>Hrs Worked</h6>
                                        </div>
                                        <div className="pd_single">
                                            <img src="/assets/img/edicon/tripstart.png" alt="" />
                                            {topRecord && !topRecord.date === formattedTodaysDate ? (
                                                <div className="data">--:--</div>
                                            ) : (
                                                <div className="data">
                                                    {topRecord &&
                                                        topRecord.date === formattedTodaysDate &&
                                                        topRecord.tripStart
                                                        ? topRecord.tripStart
                                                        : "--:--"}
                                                </div>
                                            )}

                                            <h6>Trip Start</h6>
                                        </div>
                                        <div className="pd_single">
                                            <img src="/assets/img/edicon/tripend.png" alt="" />
                                            {topRecord && !topRecord.date === formattedTodaysDate ? (
                                                <div className="data">--:--</div>
                                            ) : (
                                                <div className="data">
                                                    {topRecord &&
                                                        topRecord.date === formattedTodaysDate &&
                                                        topRecord.tripEnd
                                                        ? topRecord.tripEnd
                                                        : "--:--"}
                                                </div>
                                            )}
                                            <h6>Trip End</h6>
                                        </div>
                                        <div className="pd_single">
                                            <img src="/assets/img/edicon/travel.png" alt="" />
                                            {topRecord && !topRecord.date === formattedTodaysDate ? (
                                                <div className="data">--:--</div>
                                            ) : (
                                                <div className="data">
                                                    {topRecord &&
                                                        topRecord.date === formattedTodaysDate &&
                                                        topRecord.tripDistance
                                                        ? topRecord.tripDistance
                                                        : "--:--"}
                                                </div>
                                            )}
                                            <h6>Distance</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            ) : (
                <InactiveUserCard />
            )}



        </>
    );
};

export default PGAttendance;
