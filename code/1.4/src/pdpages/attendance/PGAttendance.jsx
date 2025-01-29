import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFirestore } from '../../hooks/useFirestore';
import { projectFirestore } from '../../firebase/config';
import { timestamp } from '../../firebase/config';
import { format } from 'date-fns';

import AttendanceTable from './AttendanceTable';
import Popup from '../../components/Popup';

// import scss 
import './PGAttendance.scss'

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const calculateTimeDifference = (punchIn, punchOut) => {
    // Convert 12-hour format to Date object
    const parseTime = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        return new Date(`2024-02-05T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
    };

    const punchInTime = parseTime(punchIn);
    const punchOutTime = parseTime(punchOut);

    // Calculate the difference in milliseconds
    const diffMs = punchOutTime - punchInTime;

    // Convert milliseconds to hours & minutes
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs} hrs ${diffMins} mins`;
};

const PGAttendance = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();// Current user

    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState("");
    const [attendance, setAttendance] = useState([]);
    const [punchIn, setPunchIn] = useState(null);

    // console.log("attendence: ", attendance)
    const today = new Date();
    const formattedTodaysDate = format(today, "dd-MMM-yy"); // Formats as DD-MMM-YY
    const weekDay = days[today.getDay()]

    const { addDocument, updateDocument, deleteDocument, error } = useFirestore("attendance-propdial");
    const { documents: attendanceData, errors: attendanceDataError } =
        useCollection(
            "attendance-propdial",
            ["userId", "==", user.uid],
            ["date", "desc"]
        );

    //Popup Flags
    const [showPopupFlag, setShowPopupFlag] = useState(false);
    const [popupReturn, setPopupReturn] = useState(false);

    //Popup Flags
    const showPopup = async (e) => {
        e.preventDefault();
        setShowPopupFlag(true);
        setPopupReturn(false);
    };


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

        // Update the time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(timer);

    }, []); // Run once when the component mounts


    const handlePunchIn = async () => {
        if (!user) {
            alert("Please log in to punch in.");
            return;
        }

        showPopup()

        const formattedPunchinTime = format(today, "hh:mm a"); // Formats as DD-MMM-YY


        try {
            // Add a punch-in record  

            const data = {
                userId: user.uid,
                punchIn: formattedPunchinTime,
                punchOut: null,
                workHrs: null,
                date: formattedTodaysDate,
                weekDay
            }

            await addDocument(data);

            alert("Punch In successful!");


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
            // console.log("record.docs[0]: ", record.docs[0].data())

            // Update the punch-out time
            const data = {
                punchOut: formattedPunchoutTime,
                workHrs: calculateTimeDifference(record.docs[0].data().punchIn, formattedPunchoutTime)
            }

            await updateDocument(docId, data)

            alert("Punch Out successful!");
            setPunchIn(null);


        } catch (error) {
            console.log("Error to Check the existing Punch-In record: ", error);
        }
    };



    return (
        <>
            <br></br><br></br>
            <div className='container' style={{ textAlign: "center" }}>
                {/* Popup Component */}
                <Popup
                    showPopupFlag={showPopupFlag}
                    setShowPopupFlag={setShowPopupFlag}
                    setPopupReturn={setPopupReturn}
                    msg={"Are you sure you want to Punch-In Now?"}
                />

                <div style={{ fontSize: "24px", marginTop: "20px" }}>
                    <h1>{greeting}!</h1>
                    <p>Welcome {user.fullName}</p>
                </div>
                <hr></hr>
                <p style={{ fontSize: "33px", fontWeight: "bolder", marginTop: "0px" }}>
                    {currentTime.toLocaleTimeString()} {/* Example: 11:45:03 AM */}
                </p>
                <div style={{ width: "100%", display: 'flex', justifyContent: 'center', }}>
                    <div style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'space-around', maxWidth: '400px' }} >
                        <button className={attendanceData && (!attendanceData[0].punchIn || attendanceData[0].date !== formattedTodaysDate) ? 'attendance-punch-button active' : 'attendance-punch-button'} onClick={showPopup}
                            disabled={!(attendanceData && (!attendanceData[0].punchIn || attendanceData[0].date !== formattedTodaysDate))}
                        // disabled={!!punchIn}
                        >
                            Punch In
                        </button>

                        <button className={attendanceData && attendanceData[0].punchOut ? 'attendance-punch-button ' : 'attendance-punch-button active'} onClick={handlePunchOut}
                            disabled={attendanceData && attendanceData[0].punchOut}
                        // disabled={!punchIn}
                        >
                            Punch Out
                        </button>
                    </div>
                </div>
                <br></br><br></br>
                <h2>Attendance Records</h2>
                <div>
                    {attendanceData && <AttendanceTable attendanceDoc={attendanceData} />}
                </div>

                <br />
            </div>
        </>
    )
}

export default PGAttendance