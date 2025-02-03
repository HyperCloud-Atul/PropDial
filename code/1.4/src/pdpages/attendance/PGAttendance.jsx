import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { projectFirestore } from "../../firebase/config";
import { timestamp } from "../../firebase/config";
import { format } from "date-fns";

import AttendanceTable from "./AttendanceTable";
import Popup from "../../components/Popup";
import PunchInOut from "../../components/attendance/PunchInOut";

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

  return `${diffHrs} hrs ${diffMins} mins`;
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

  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [punchIn, setPunchIn] = useState(null);
  const [tripStart, setTripStart] = useState(null);
  const [tripEnd, setTripEnd] = useState(null);

  // console.log("attendence: ", attendance)
  const today = new Date();
  const formattedTodaysDate = format(today, "dd-MMM-yy"); // Formats as DD-MMM-YY
  const weekDay = days[today.getDay()]; // Current weekday

  const { addDocument, updateDocument, deleteDocument, error } = useFirestore(
    "attendance-propdial"
  );
  const { documents: attendanceData, errors: attendanceDataError } =
    useCollection(
      "attendance-propdial",
      ["userId", "==", user.uid],
      ["date", "desc"],
      ["5"]
    );

  //Popup Flags
  const [showPopupPunchInFlag, setShowPopupPunchInFlag] = useState(false);
  // const [showPopupFlag, setShowPopupFlag] = useState(false);
  const [popupReturn, setPopupReturn] = useState(false);
  const [showPopupPunchOutFlag, setShowPopupPunchOutFlag] = useState(false);
  // const [popupReturn, setPopupReturn] = useState(false);

  const showPunchInPopup = () => {
    // e.preventDefault();
    setShowPopupPunchInFlag(true);
    setPopupReturn(false);
  };

  const handlePunchInPopup = (action) => {
    // console.log('Popup Action:', action)
    if (action === "CANCEL") {
      setPopupReturn(false);
    }
    if (action === "CONFIRM") {
      // setPopupReturn(true)
      handlePunchIn();
    }
    setShowPopupPunchInFlag(false);
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

    lastFiveRecords();

    // Update the time every second
    // const timer = setInterval(() => {
    //     setCurrentTime(new Date());
    // }, 1000);

    // Cleanup the interval on component unmount
    // return () => clearInterval(timer);
  }, []); // Run once when the component mounts

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
        workHrs: null,
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
      const tripStart = record.docs[0].data().tripStart;

      //Validation Start Trip Reading should not be greater than End Trip Reading
      if (Number(tripEnd) <= Number(tripStart)) {
        alert("Trip End Reading should not be less than Trip Start Reading!");
        return;
      }
      const tripDistance = tripEnd - tripStart;
      // console.log("record.docs[0]: ", record.docs[0].data())

      // Update the punch-out time
      const data = {
        punchOut: formattedPunchoutTime,
        workHrs: calculateTimeDifference(
          record.docs[0].data().punchIn,
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

  const lastFiveRecords = async () => {
    // Find the punch-in record for today
    const record = await projectFirestore
      .collection("attendance-propdial")
      .where("userId", "==", user.uid)
      // .where("date", "==", formattedTodaysDate)
      .limit(5)
      .get();

    // console.log("record: ", record.docs[0].data())

    return record.docs;
  };

  //Fetch Second Last Record
  const [record, setRecord] = useState(null);
  useEffect(() => {
    const fetchSecondLastRecord = async () => {
      try {
        // Step 1: Get the latest record
        const latestRecordRef = projectFirestore
          .collection("attendance-propdial")
          .where("userId", "==", user.uid)
          .orderBy("date", "desc")
          .limit(1);

        const latestSnapshot = await latestRecordRef.get();

        if (latestSnapshot.empty) {
          console.log("No records found");
          return;
        }

        const latestDoc = latestSnapshot.docs[0];

        // Step 2: Get the second last record, skipping the latest one
        const secondLastRecordRef = projectFirestore
          .collection("attendance-propdial")
          .where("userId", "==", user.uid)
          .orderBy("date", "desc")
          .startAfter(latestDoc) // Skip the latest record
          .limit(1);

        const secondLastSnapshot = await secondLastRecordRef.get();

        if (!secondLastSnapshot.empty) {
          setRecord({
            id: secondLastSnapshot.docs[0].id,
            ...secondLastSnapshot.docs[0].data(),
          });
        } else {
          console.log("No second last record found");
        }
      } catch (error) {
        console.error("Error fetching second last record:", error);
      }
    };

    fetchSecondLastRecord();
  }, [user.id]);

  // console.log("user details: ", user)

  // current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Extract date components separately
  const optionsDate = { month: "short", day: "2-digit", year: "numeric" };
  const formattedDate = currentDateTime.toLocaleDateString(
    "en-US",
    optionsDate
  );
  const weekday = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Format time like "09:25 AM"
  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <>
      {/* <div>
                <div className={showPopupPunchInFlag ? 'pop-up-div open' : 'pop-up-div'}>
                    <div>
                        <p>
                            {showPopupPunchInFlag && (" Are you sure you want to Punch-In now? ")}
                        </p><br />

                        {user && user.vehicleStatus &&
                            <input
                                id="id_tripstart"
                                className="custom-input"
                                style={{ paddingRight: "10px" }}
                                type="number"
                                placeholder="Trip Start - Meter Reading"
                                maxLength={7}
                                onInput={(e) => {
                                    restrictInput(e, 7);
                                }}
                                onChange={(e) =>
                                    setTripStart(e.target.value)
                                }
                                value={attendanceData && attendanceData[0].punchInMeterReading}
                            />
                        }

                        <br></br><br></br>
                        <button onClick={() => handlePunchInPopup('CONFIRM')} className="theme_btn btn_red pointer no_icon" style={{ margin: '0 0px' }}>CONFIRM</button>
                        <button onClick={() => handlePunchInPopup('CANCEL')} className="theme_btn btn_fill pointer no_icon" style={{ margin: '0 0px' }}>CANCEL</button>
                    </div>
                </div>
                <div className={showPopupPunchOutFlag ? 'pop-up-div open' : 'pop-up-div'}>
                    <div>
                        <p>
                            {showPopupPunchOutFlag && (" Are you sure you want to Punch-Out now? ")}
                        </p>


                        {user && user.vehicleStatus &&
                            <>
                                <p>
                                    Trip Start: {attendanceData && attendanceData[0].tripStart}
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
                                    onChange={(e) =>
                                        setTripEnd(e.target.value)
                                    }
                                    value={attendanceData && attendanceData[0].tripEnd}
                                />
                            </>
                        }
                        <br></br><br></br>
                        <button onClick={() => handlePunchOutPopup('CONFIRM')} className="theme_btn btn_red pointer no_icon" style={{ margin: '0px' }}>CONFIRM</button>
                        <button onClick={() => handlePunchOutPopup('CANCEL')} className="theme_btn btn_fill pointer no_icon" style={{ margin: '0px' }}>CANCEL</button>
                    </div>
                </div>
            </div >
            <div className='container' style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", marginTop: "20px" }}>
                    <h1>{greeting}!</h1>
                    <p>Welcome {user.fullName}</p>
                </div>
                <hr></hr>
                <p style={{ fontSize: "33px", fontWeight: "bolder", marginTop: "0px" }}>
                  
                </p>
                <div style={{ width: "100%", display: 'flex', justifyContent: 'center', }}>
                    <div style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'space-around', maxWidth: '400px' }} >
                        <button className={attendanceData && (!attendanceData[0].punchIn || attendanceData[0].date !== formattedTodaysDate) ? 'attendance-punch-button active' : 'attendance-punch-button'} onClick={showPunchInPopup}
                            disabled={!(attendanceData && (!attendanceData[0].punchIn || attendanceData[0].date !== formattedTodaysDate))}
                        // disabled={!!punchIn}
                        >
                            Punch In
                        </button>

                        <button className={attendanceData && attendanceData[0].punchOut ? 'attendance-punch-button ' : 'attendance-punch-button active'} onClick={showPunchOutPopup}
                            disabled={attendanceData && attendanceData[0].punchOut}
                        // disabled={!punchIn}
                        >
                            Punch Out
                        </button>
                    </div>
                </div>
                <br></br>
                <PunchInOut/>
                <br />
                <h2>Attendance Records</h2>
                <div>
                    {attendanceData && <AttendanceTable attendanceDoc={attendanceData} />}
                </div>

                <br />
            </div> */}
      <div className="top_header_pg pg_bg attendance_pg relative">
        <div className="attendance_list">cards</div>
        <div className="punch">
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
            <div className="date_time">
            <h3>{formattedTime}
            </h3>
                <h6>{formattedDate} - {weekday}
                </h6>
              
            </div>
            <div className="punch_button outer">
      <div className="inner_one">
        <div className="inner_two">
           <img src="/assets/img/hand-pointer.png" alt="" />
           <h6>Punch In</h6>
        </div>
      </div>
            </div>
            <div className="punch_detail">
              <div className="pd_single">
                <img src="/assets/img/punchin.png" alt="" />
                <div className="data">--:--</div>
<h6>Punch In</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PGAttendance;
