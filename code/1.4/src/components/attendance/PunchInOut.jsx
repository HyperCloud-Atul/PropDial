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

import './Attendance.scss'


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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

const PunchInOut = () => {

  const { user } = useAuthContext();// Current user


  const [attendance, setAttendance] = useState([]);
  const [punchIn, setPunchIn] = useState(null);
  const [tripStart, setTripStart] = useState(null);
  const [tripEnd, setTripEnd] = useState(null);

  // console.log("attendence: ", attendance)
  const today = new Date();
  const formattedTodaysDate = format(today, "dd-MMM-yy"); // Formats as DD-MMM-YY
  const weekDay = days[today.getDay()] // Current weekday

  const { addDocument, updateDocument, deleteDocument, error } = useFirestore("attendance-propdial");
  const { documents: attendanceData, errors: attendanceDataError } =
    useCollection(
      "attendance-propdial",
      ["userId", "==", user.uid],
      ["date", "desc"],
      ["5"]
    );


  const [greeting, setGreeting] = useState("");

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

    // lastFiveRecords()


  }, []); // Run once when the component mounts


  //Popup Flags
  const [showPopupPunchInFlag, setShowPopupPunchInFlag] = useState(false);
  const [popupReturn, setPopupReturn] = useState(false);
  const [showPopupPunchOutFlag, setShowPopupPunchOutFlag] = useState(false);

  const showPunchInPopup = () => {
    // e.preventDefault();
    setShowPopupPunchInFlag(true);
    setPopupReturn(false);
  }

  const handlePunchInPopup = (action) => {
    // console.log('Popup Action:', action)
    if (action === 'CANCEL') {
      setPopupReturn(false)
    }
    if (action === 'CONFIRM') {
      // setPopupReturn(true)
      handlePunchIn()
    }
    setShowPopupPunchInFlag(false)
  }

  const showPunchOutPopup = () => {
    // e.preventDefault();
    setShowPopupPunchOutFlag(true);
    setPopupReturn(false);
  }

  // const checkPunchInRecordForToday = async () => {
  //   // Find the punch-in record for today
  //   const record = await projectFirestore
  //     .collection("attendance-propdial")
  //     .where("userId", "==", user.uid)
  //     .where("date", "==", formattedTodaysDate)
  //     .get();

  //   if (record.empty) {
  //     // alert("You have not punched in yet!");
  //     setIsPunchInToday(false)

  //   }
  //   else setIsPunchInToday(true)
  // }

  // const [isPunchInToday, setIsPunchInToday] = useState(false);
  // useEffect(() => {
  //   const checkPunchInRecordForToday = async () => {
  //     try {
  //       // Find the punch-in record for today
  //       const record = await projectFirestore
  //         .collection("attendance-propdial")
  //         .where("userId", "==", user.uid)
  //         .where("date", "==", formattedTodaysDate)
  //         .get();

  //       if (record.empty) {
  //         // alert("You have not punched in yet!");
  //         setIsPunchInToday(false)

  //       }
  //       else setIsPunchInToday(true)
  //     } catch (error) {
  //       console.error("Error fetching second last record:", error);
  //     }
  //   };

  //   checkPunchInRecordForToday();
  // }, [user.id]);



  const handlePunchOutPopup = (action) => {
    // console.log('Popup Action:', action)
    if (action === 'CANCEL') {
      setPopupReturn(false)
    }
    if (action === 'CONFIRM') {
      // setPopupReturn(true)
      handlePunchOut()
    }
    setShowPopupPunchOutFlag(false)
  }

  const handlePunchIn = async () => {

    if (!user) {
      alert("Please log in to punch in.");
      return;
    }

    const formattedPunchinTime = format(today, "hh:mm a"); // Formats as DD-MMM-YY

    try {
      // Add a punch-in record  
      console.log("punch in click");
      const data = {
        userId: user.uid,
        punchIn: formattedPunchinTime,
        punchOut: null,
        workHrs: null,
        date: formattedTodaysDate,
        weekDay,
        tripStart
      }

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
      const tripStart = record.docs[0].data().tripStart

      //Validation Start Trip Reading should not be greater than End Trip Reading
      if (Number(tripEnd) <= Number(tripStart)) {
        alert("Trip End Reading should not be less than Trip Start Reading!");
        return;
      }
      const tripDistance = tripEnd - tripStart
      // console.log("record.docs[0]: ", record.docs[0].data())

      // Update the punch-out time
      const data = {
        punchOut: formattedPunchoutTime,
        workHrs: calculateTimeDifference(record.docs[0].data().punchIn, formattedPunchoutTime),
        tripEnd,
        tripDistance
      }

      await updateDocument(docId, data)

      // alert("Punch Out successful!");
      setPunchIn(null);


    } catch (error) {
      console.log("Error to Check the existing Punch-In record: ", error);
    }
  };

  // Last 5 Five Records
  const lastFiveRecords = async () => {
    // Find the punch-in record for today
    const record = await projectFirestore
      .collection("attendance-propdial")
      .where("userId", "==", user.uid)
      // .where("date", "==", formattedTodaysDate)
      .limit(5)
      .get();

    // console.log("record: ", record.docs[0].data())

    return record.docs

  }

  //Fetch Second Last Record
  const [secondLastRecord, setSecondLastRecord] = useState(null);
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
          setSecondLastRecord({
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

  return (
    <>
      {/* Pupup */}
      <div>
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

      <div className="punch_in_out">
        <div className="container">
          <div className="pio_inner">
            <div className="pioi_2">
              <div className="pio_left">
                <h3 className="title">
                  {greeting} <span>{user.displayName}</span>
                </h3>
                {attendanceData && attendanceData[0].date !== formattedTodaysDate && <h6 className="no_punch">You have not yet Punch-in for TODAY!</h6>}
                {attendanceData && attendanceData[0].date === formattedTodaysDate &&
                  <div className="piol_inner">

                    <div className="pioli_single">
                      <h4 className="punch_in">Punch In</h4>
                      <h6>{attendanceData && attendanceData[0].punchIn}</h6>
                      <h6>{attendanceData && attendanceData[0].tripStart}</h6>
                    </div>
                    <div className="pioli_single">
                      <h4 className="punch_out">Punch Out</h4>
                      <h6>{attendanceData && attendanceData[0].punchOut}</h6>
                      <h6>{attendanceData && attendanceData[0].tripEnd}</h6>
                    </div>
                  </div>}
              </div>
              <div className="pio_right">
                {attendanceData && (!attendanceData[0].punchIn || attendanceData[0].date !== formattedTodaysDate) ?
                  <div className="theme_btn btn_fill no_icon text-center" onClick={showPunchInPopup}>Punch In</div> : attendanceData && (attendanceData[0].date === formattedTodaysDate && !attendanceData[0].punchOut) ? <div className="theme_btn btn_fill no_icon text-center" onClick={showPunchOutPopup}>Punch Out</div> : <h2>{attendanceData && attendanceData[0].workHrs}</h2>}
              </div>
            </div>
            <div className="pio_bottom">

              <div className="piob_top">
                <div className="piobt_single">
                  <h5 >Last Punch In/Out</h5>
                </div>
              </div>
              {secondLastRecord &&
                <div className="piob_body">
                  <div>{secondLastRecord.workHrs}</div>
                  <div className="piobb_single">
                    <h6>Date</h6>
                    <h5>{secondLastRecord.date}</h5>
                  </div>
                  <div className="piobb_single">
                    <h6>Day</h6>
                    <h5>{secondLastRecord.weekDay}</h5>
                  </div>
                  <div className="piobb_single">
                    <h6>Punch-in Time</h6>
                    <h5>{secondLastRecord.punchIn}</h5>
                  </div>
                  <div className="piobb_single">
                    <h6>Punch-out Time</h6>
                    <h5>{secondLastRecord.punchOut}</h5>
                  </div>
                  <div className="piobb_single">
                    <h6>Trip Start</h6>
                    <h5>{secondLastRecord.tripStart}</h5>
                  </div>
                  <div className="piobb_single">
                    <h6>Trip End</h6>
                    <h5>{secondLastRecord.tripEnd}</h5>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default PunchInOut;
