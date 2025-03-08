import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { projectFirestore } from "../../firebase/config";
import { timestamp } from "../../firebase/config";
import { useExportToExcel } from "../../hooks/useExportToExcel";
import { format } from "date-fns";
import dayjs from "dayjs"; // Library for time calculations
import { BeatLoader } from "react-spinners";
import AttendanceTable from "./AttendanceTable";
import Popup from "../../components/Popup";
import PunchInOut from "../../components/attendance/PunchInOut";
import CurrentDateTime from "../../components/CurrentDateTime";
import ScrollToTop from "../../components/ScrollToTop";
import InactiveUserCard from "../../components/InactiveUserCard";
import ReactTable from "../../components/ReactTable";

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
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
  const pagelocation = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pagelocation]);
  // Scroll to the top of the page whenever the location changes end

  const currentYear = new Date().getFullYear(); // Get current year
  const years = [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
  ]; // Create an array of years
  const [selectedYear, setSelectedYear] = useState(currentYear); // Set current year as default

  const currentMonthIndex = new Date().getMonth(); // Get current month index (0-11)
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);

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
  const [punchInError, setPunchInError] = useState(false);
  const [punchOutError, setPunchOutError] = useState(false);

  // console.log("currentWeekRecords: ", currentWeekRecords)

  //Popup Flags
  const [showPunchInPopup, setShowPunchInPopup] = useState(false);
  const [showPunchOutPopup, setShowPunchOutPopup] = useState(false);
  const [popupReturn, setPopupReturn] = useState(false);
  const [showPopupPunchOutFlag, setShowPopupPunchOutFlag] = useState(false);

  //Fetch current location of user : Start
  const [location, setLocation] = useState("");

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

    try {
      setGreeting(getGreeting());

      getLocation();

      getCurrentWeekDates();

      // fetchCurrentWeekRecords()

      const currentMonthRecord = fetchSelectedMonthRecords(selectedMonth);
      // console.log("currentMonthRecord: ",)

      fetchTopRecord();

    }
    catch (err) {
      console.log("Error: ", err)
    }

    // ensureMissingRecords()

    // Update the time every second
    // const timer = setInterval(() => {
    //     setCurrentTime(new Date());
    // }, 1000);

    // Cleanup the interval on component unmount
    // return () => clearInterval(timer);
  }, [user.uid]); // Run once when the component mounts

  // Generate missing records from last recorded date to today
  const ensureMissingRecords = async () => {
    try {
      // Step 1: Get the latest record
      const record = await projectFirestore
        .collection("attendance-propdial")
        .where("userId", "==", user.uid)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      // const docId = record.docs[0].id;
      // record.docs[0].data()

      // const unsubscribe = latestRecordRef.onSnapshot(snapshot => {

      if (!record.empty) {
        // console.log("snapshot.docs[0].data(): ", snapshot.docs[0].data())
        // setTopRecord(snapshot.docs[0].data());
        const latestRecordDate = record.docs[0].data().date;
        const lastDate = dayjs(new Date(latestRecordDate));
        console.log("last date: ", lastDate);

        const today = dayjs();
        console.log("today: ", today);

        if (lastDate.format("DD-MMM-YY") === today.format("DD-MMM-YY")) {
          console.log("Last day & today is same");
        } else {
          console.log("Last day is less than today");
          for (
            let date = lastDate.add(1, "day");
            date.isBefore(today);
            date = date.add(1, "day")
          ) {
            if (date.format("DD-MMM-YY") === today.format("DD-MMM-YY")) {
              console.log("loop date & today is same, so break the loop");
              break;
            }

            // let date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
            // const dateStr = date.format("YYYY-MM-DD");
            const dateStr = date.format("DD-MMM-YY");
            console.log("missing dates: ", dateStr);

            // console.log("missing date: ", date)
            const weekDay = days[new Date(dateStr).getDay()];
            // const weekDay = days[date.getDay()];
            console.log("weekDay: ", weekDay);

            try {
              // Add a punch-in record
              const data = {
                // createdAt: (new Date(dateStr)),
                createdAt: date.toDate(),
                userId: user.uid,
                punchIn: null,
                punchOut: null,
                workHrs: "00:00",
                date: dateStr,
                // date,
                weekDay,
                tripStart: "",
                punchInLocation: "",
              };

              console.log("missing data: ", data);
              const ref = projectFirestore.collection("attendance-propdial");

              // await addDocument(data);
              ref.add(data);

              // alert("Punch In successful!");
            } catch (error) {
              console.log("Error to add a Punch-in Record: ", error);
            }
          }
        }
      }

      console.log("ensureMissingRecords");
      // const lastDate = topRecord.createdAt;
      // console.log("latest record date: ", latestRecordDate)

      // const lastDate = dayjs(new Date(latestRecordDate));
      // console.log("last date: ", lastDate)
      // const today = dayjs();
      // console.log("today: ", today)

      // for (let date = lastDate.add(1, "day"); date.isBefore(today) || date.isSame(today, "day"); date = date.add(1, "day")) {
      //     // let date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
      //     // const dateStr = date.format("YYYY-MM-DD");
      //     const dateStr = date.format("DD-MMM-YY");
      //     console.log("missing dates: ", dateStr)

      //     const weekDay = days[(new Date(dateStr)).getDay()];
      //     console.log("weekDay: ", weekDay)

      //     try {
      //         // Add a punch-in record
      //         const data = {
      //             createdAt: (new Date(dateStr)),
      //             userId: user.uid,
      //             punchIn: "",
      //             punchOut: null,
      //             workHrs: "00:00",
      //             date: dateStr,
      //             weekDay,
      //             tripStart: "",
      //             punchInLocation: "",
      //         };

      //         const ref = projectFirestore.collection("attendance-propdial");

      //         // await addDocument(data);
      //         await ref.add({ data });

      //         // alert("Punch In successful!");
      //     } catch (error) {
      //         console.log("Error to add a Punch-in Record: ", error);
      //     }

      //     // const attendanceDoc = doc(db, `users_attendance/${userId}/attendance/${dateStr}`);

      //     // batchUpdates.push(setDoc(attendanceDoc, {
      //     //     punchIn: null,
      //     //     punchOut: null,
      //     //     workHrs: null,
      //     //     location: null,
      //     //     date: dateStr,
      //     // }, { merge: true })); // `merge: true` ensures we don't overwrite existing data
      // }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  // // Filter months based on selected year
  const filteredMonths =
    selectedYear === currentYear
      ? months.slice(0, currentMonthIndex + 1) // Show only past & current months
      : months; // Show all months for past years

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

      const unsubscribe = latestRecordRef.onSnapshot(
        (snapshot) => {
          if (!snapshot.empty) {
            // console.log("snapshot.docs[0].data(): ", snapshot.docs[0].data());
            setTopRecord(snapshot.docs[0].data());
          }
        },
        (error) => {
          console.log(error);
          // setError('could not fetch the data')
        }
      );

      return () => unsubscribe(); // Cleanup listener when component unmounts
    } catch (error) {
      console.error("Error fetching second last record:", error);
    }
  };

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
        .orderBy("createdAt", "desc");

      const unsubscribe = querySnapshot.onSnapshot(
        (snapshot) => {
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });

          // console.log("current week records: ", results)

          // // update state
          setCurrentWeekRecords(results);

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
          setCurrentWeekWorkedHours(
            `${String(totalHours).padStart(2, "0")}:${String(
              totalMins
            ).padStart(2, "0")}`
          );

          // Total distance travelled for current week
          const sumOfDistance = results.reduce(
            (acc, record) => acc + (record.tripDistance || 0),
            0
          );
          setCurrentWeekDistance(sumOfDistance);

          // setError(null)
        },
        (error) => {
          console.log(error);
          // setError('could not fetch the data')
        }
      );

      return () => unsubscribe(); // Cleanup listener when component unmounts
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //Fetch Selected Month Record
  const fetchSelectedMonthRecords = async (selmonth) => {
    setSelectedMonth(selmonth);
    fetchSelectedMonthYearRecords(selmonth, selectedYear);
  };

  //Fetch Selected Year Record
  const fetchSelectedYearRecords = async (selYear) => {
    // console.log("Selected Year: ", selYear)
    setSelectedYear(selYear);

    // console.log("Selected Month: ", selectedMonth)
    fetchSelectedMonthYearRecords(selectedMonth, selYear);
  };

  //Fetch Selected Month & Year Record
  const fetchSelectedMonthYearRecords = async (selmonth, selyear) => {
    // console.log("In fetchSelectedMonthRecords")
    setSelectedMonth(selmonth);
    // console.log("selectedMonth: ", selectedMonth)
    // Get first and last day of the current month

    const now = new Date();
    // console.log("now.getFullYear(): ", now.getFullYear())
    // console.log("selectedYear: ", selectedYear)

    const selectedMonthIndex = months.indexOf(selmonth);

    // const firstDay = new Date(now.getFullYear(), selectedMonthIndex, 1);
    const firstDay = new Date(selyear, selectedMonthIndex, 1);

    // const lastDay = new Date(now.getFullYear(), selectedMonthIndex + 1, 0, 23, 59, 59);
    const lastDay = new Date(selyear, selectedMonthIndex + 1, 0, 23, 59, 59);

    try {
      const querySnapshot = await projectFirestore
        .collection("attendance-propdial")
        .where("userId", "==", user.uid)
        .where("createdAt", ">=", firstDay)
        .where("createdAt", "<=", lastDay)
        .orderBy("createdAt", "desc");

      const unsubscribe = querySnapshot.onSnapshot(
        (snapshot) => {
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });

          // // update state
          setCurrentMonthRecords(results);
          // setError(null)
        },
        (error) => {
          console.log(error);
          // setError('could not fetch the data')
        }
      );

      return () => unsubscribe(); // Cleanup listener when component unmounts
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handelShowPunchInPopup = () => {
    setShowPunchInPopup(true);
  };

  const handlePunchInPopup = async (action) => {
    if (action === "CONFIRM") {
      // setPopupReturn(true)
      getLocation();
      handlePunchIn();
    }
    setShowPunchInPopup(false);
  };

  const handelShowPunchOutPopup = () => {
    setShowPunchOutPopup(true);
  };

  const handlePunchOutPopup = async (action) => {
    // console.log('Popup Action:', action)
    if (action === "CANCEL") {
      setPopupReturn(false);
    }
    if (action === "CONFIRM") {
      // setPopupReturn(true)
      getLocation();
      handlePunchOut();
    }
  };

  const handlePunchIn = async () => {
    if (!user) {
      alert("Please log in to punch in.");
      return;
    }

    if (user.vehicleStatus && !tripStart) {
      setPunchInError(true);
      return; // Prevent further execution
    }

    try {

      const formattedPunchinTime = format(today, "hh:mm a");

      // Add a punch-in record
      const data = {
        userId: user.uid,
        userName: user.fullName,
        userPhoneNo: user.phoneNumber,
        punchIn: formattedPunchinTime,
        punchOut: null,
        workHrs: "00:00",
        date: formattedTodaysDate,
        weekDay,
        tripStart,
        punchInLocation: location,
      };

      // Find the punch-in record for today
      const record = await projectFirestore
        .collection("attendance-propdial")
        .where("userId", "==", user.uid)
        .where("date", "==", formattedTodaysDate)
        .get();

      if (record.empty) {
        console.log("Add new record!");

        await addDocument(data);
      }
      else { //Update record
        const docId = record.docs[0].id;

        await updateDocument(docId, data);
      }
    }
    catch (error) {
      console.log("Error adding a Punch-in Record: ", error);
    }

    setShowPunchInPopup(false);
    setPunchInError(false);
    setTripStart(null);
  };

  const handlePunchOut = async () => {
    if (!user) {
      alert("Please log in to punch out.");
      return;
    }
    if (user.vehicleStatus && !tripEnd) {
      setPunchOutError(true);
      return; // Prevent further execution
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
      } else {
        const docId = record.docs[0].id;
        // const tripStart = record.docs[0].data().tripStart;

        //Validation Start Trip Reading should not be greater than End Trip Reading
        // if (Number(tripEnd) <= Number(topRecord.tripStart)) {
        //     alert("Trip End Reading should not be less than Trip Start Reading!");
        //     return;
        // }
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
          punchOutLocation: location,
        };

        await updateDocument(docId, data);

        // alert("Punch Out successful!");
        setPunchIn(null);
      }
    } catch (error) {
      console.log("Error to Check the existing Punch-In record: ", error);
    }
    setShowPunchOutPopup(false);
    setPunchOutError(false);
    setTripEnd(null);
  };

  //Fetch the current week dates
  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Get current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const startDiff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust if today is Sunday
    const startOfWeek = new Date(today.setDate(startDiff));
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

    // console.log("startOfWeek: ", startOfWeek)
    setStartWeekDate(startOfWeek);
    setEndWeekDate(endOfWeek);

    fetchCurrentWeekRecords(startOfWeek, endOfWeek);
  };

  //Find out Last 5 records
  // const lastFiveRecords = async () => {

  //     // Find the punch-in record for today
  //     const record = await projectFirestore
  //         .collection("attendance-propdial")
  //         .where("userId", "==", user.uid)
  //         // .where("date", "==", formattedTodaysDate)
  //         .limit(5)
  //         .get();

  //     console.log("record: ", record.docs[0].data())

  //     // return record.docs;
  //     return record;
  // };

  //Fetch Second Last Record
  // const [record, setRecord] = useState(null);
  // useEffect(() => {
  //     const fetchSecondLastRecord = async () => {
  //         try {
  //             // Step 1: Get the latest record
  //             const latestRecordRef = projectFirestore
  //                 .collection("attendance-propdial")
  //                 .where("userId", "==", user.uid)
  //                 .orderBy("date", "desc")
  //                 .limit(1);

  //             const latestSnapshot = await latestRecordRef.get();

  //             if (latestSnapshot.empty) {
  //                 console.log("No records found");
  //                 return;
  //             }

  //             const latestDoc = latestSnapshot.docs[0];

  //             // Step 2: Get the second last record, skipping the latest one
  //             const secondLastRecordRef = projectFirestore
  //                 .collection("attendance-propdial")
  //                 .where("userId", "==", user.uid)
  //                 .orderBy("date", "desc")
  //                 .startAfter(latestDoc) // Skip the latest record
  //                 .limit(1);

  //             const secondLastSnapshot = await secondLastRecordRef.get();

  //             if (!secondLastSnapshot.empty) {
  //                 setRecord({
  //                     id: secondLastSnapshot.docs[0].id,
  //                     ...secondLastSnapshot.docs[0].data(),
  //                 });
  //             } else {
  //                 console.log("No second last record found");
  //             }
  //         } catch (error) {
  //             console.error("Error fetching second last record:", error);
  //         }
  //     };

  //     fetchSecondLastRecord();
  // }, [user.id]);

  // console.log("user details: ", user)

  // view mode control start

  const [viewMode, setViewMode] = useState("card_view");

  const handleModeChange = (newViewMode) => {
    setViewMode(newViewMode);
  };
  // view mode control end

  // Function to get user's location
  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // console.log("Lat:", latitude, "Lng:", longitude);
          // await getAddress(latitude, longitude); // Convert lat/lng to address
          await getLocationName(latitude, longitude); // Convert lat/lng using Google Map Geolocation
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location access denied.");
        }
      );
    } else {
      setLocation("Geolocation is not supported by this browser.");
    }
  };

  // Function to convert lat/lng to a readable address (Using OpenStreetMap API)
  const getAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      // console.log("location object: ", data);
      if (data && data.display_name) {
        const location_details =
          data.address.suburb +
          ", " +
          data.address.state_district +
          ", " +
          data.address.state +
          ", " +
          data.address.country;
        setLocation(location_details); // Set location name
        // setLocation(data.display_name); // Set location name
      } else {
        setLocation("Location not found.");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocation("Error fetching location.");
    }
  };

  const getComponent = (components, type) => {
    const found = components.find((component) =>
      component.types.includes(type)
    );
    return found ? found.long_name : "";
  };

  const getLocationName = async (latitude, longitude) => {
    // console.log("In getLocationName");
    const API_KEY = "AIzaSyBQ1dlizv-nwe6vtOH-Z2acQX7paKwHykw"; // Dev API - Replace with your API Key
    // const API_KEY = "AIzaSyAHSLHwNrU95nb1ZYZ7Fgkr2ZIhguEBYks"; // Production API - Replace with your API Key

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    try {
      let locationName

      const response = await fetch(url);
      const data = await response.json();
      // console.log("data from GeoLocation: ", data);
      if (data.status === "OK") {
        // const locationName = data.results[0].formatted_address;
        // console.log("Location Name:", locationName);

        const formattedAddress = data.results[0].formatted_address;
        console.log("formattedAddress: ", formattedAddress)
        // const addressParts = formattedAddress.split(",");
        // console.log("address Parts: ", addressParts)


        // addressParts.map((data) => (
        //   locationName += ", " + data
        // ))

        // console.log("addressParts map data: ", locationName)


        // const stateFallback = addressParts.length === 1 ? addressParts[addressParts.length - 2].trim() : "";
        // const cityFallback = addressParts.length > 2 ? addressParts[addressParts.length - 3].trim() : "";
        // const localityFallback = addressParts.length > 3 ? addressParts[addressParts.length - 4].trim() : "";

        // locationName = localityFallback + ", " + cityFallback + ", " + stateFallback

        // console.log("Fallback: ", locationName)

        // const addressComponents = data.results[0].address_components;
        // const sublocality = getComponent(addressComponents, "sublocality");
        // console.log("sublocality: ", sublocality);
        // // const locality = getComponent(addressComponents, "locality");
        // // console.log("locality: ", locality)
        // const city = getComponent(
        //   addressComponents,
        //   "administrative_area_level_2"
        // );
        // console.log("city: ", city);
        // // const district = getComponent(addressComponents, "administrative_area_level_3");
        // // console.log("district: ", district)
        // const state = getComponent(
        //   addressComponents,
        //   "administrative_area_level_1"
        // );
        // console.log("state: ", state);
        // const country = getComponent(addressComponents, "country");
        // console.log("country: ", country);
        // const locationName =
        //   sublocality + ", " + city + ", " + state + ", " + country;

        setLocation(formattedAddress); // Set location name
        // return locationName;
      } else {
        console.error("Geocoding Error:", data.status);
        // return null;
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      // return null;
    }
  };

  //Fetch current location of user : End

  // previous punches data in table
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "serialNumber",
        Cell: ({ row }) => row.index + 1,
        disableFilters: true,
      },
      {
        Header: "Date",
        accessor: "date",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="date mobile_min_width">{value}</div>
        ),
      },
      {
        Header: "Hrs Worked",
        accessor: "workHrs",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="hr_worked mobile_min_width">
            {value !== "00:00"
              ? value.split(":").map((val, index) => (
                <span key={index}>
                  {val.trim()}
                  <span className="unit">{index === 0 ? "hrs" : "min"}</span>
                  {index === 0 && (
                    <span style={{ marginRight: "8px" }}></span>
                  )}
                </span>
              ))
              : "--:--"}
          </div>
        ),
      },
      {
        Header: "Punch In",
        accessor: "punchIn",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="time mobile_min_width">{value ? value : "--:--"}</div>
        ),
      },
      {
        Header: "Punch In Location",
        accessor: "punchInLocation",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="location mobile_min_width">
            {value
              ? value
                .split(",")
                .filter(
                  (part) => part.trim() !== "undefined" && part.trim() !== ""
                )
                .slice(0, -1)
                .join(", ")
              : "--:--"}
          </div>
        ),
      },

      {
        Header: "Punch Out",
        accessor: "punchOut",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="time mobile_min_width">{value ? value : "--:--"}</div>
        ),
      },
      {
        Header: "Punch Out Location",
        accessor: "punchOutLocation",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="location mobile_min_width">
            {value
              ? value
                .split(",")
                .filter(
                  (part) => part.trim() !== "undefined" && part.trim() !== ""
                )
                .slice(0, -1)
                .join(", ")
              : "--:--"}
          </div>
        ),
      },
      {
        Header: "Dist (Km)",
        accessor: "tripDistance",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="time mobile_min_width">{value ? value : "--:--"}</div>
        ),
      },
      {
        Header: "Trip Start",
        accessor: "tripStart",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="time mobile_min_width">{value ? value : "--:--"}</div>
        ),
      },
      {
        Header: "Trip End",
        accessor: "tripEnd",
        disableFilters: true,
        Cell: ({ value }) => (
          <div className="time mobile_min_width">{value ? value : "--:--"}</div>
        ),
      },
    ],
    []
  );

  // export data in excel
  const { exportToExcel, response: res } = useExportToExcel();
  const exportExcelFormate = async () => {
    const subsetData = attendanceData.map((item) => ({
      Date: item.date,
      "Hrs Worked":
        item.workHrs !== "00:00"
          ? item.workHrs
            .split(":")
            .map(
              (val, index) => `${val.trim()}${index === 0 ? " hrs" : " min"}`
            )
            .join(" ")
          : "--:--",
      "Punch In": item.punchIn ? item.punchIn : "--:--",
      "Punch In Location": item.punchInLocation
        ? item.punchInLocation
          .split(",")
          .filter(
            (part) => part.trim() !== "undefined" && part.trim() !== ""
          )
          .join(", ")
        : "--:--",
      "Punch Out": item.punchOutLocation
        ? item.punchOutLocation
          .split(",")
          .filter(
            (part) => part.trim() !== "undefined" && part.trim() !== ""
          )
          .join(", ")
        : "--:--",
      "Punch Out Location": item.punchOutLocation || "--",

      // Conditionally adding Distance, Trip Start, and Trip End if vehicleStatus exists
      ...(user && user.vehicleStatus
        ? {
          "Distance (km)": item.tripDistance
            ? item.tripDistance + " Km"
            : "--:--",
          "Trip Start": item.tripStart ? item.tripStart : "--:--",
          "Trip End": item.tripEnd ? item.tripEnd : "--:--",
        }
        : {}),
    }));

    let filename = "your-attendance.xlsx";
    exportToExcel(subsetData, filename);
  };

  // export data in excel

  const [expandedCards, setExpandedCards] = useState({}); // Stores expand state for each card


  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle expand state for the clicked card
    }));
  };

  return (
    <>
      {user && user.status === "active" ? (
        <div>
          <ScrollToTop />
          {/* Poupup */}
          <div>
            <Modal
              show={showPunchInPopup}
              onHide={() => setShowPunchInPopup(false)}
              centered
              className="pl-0"
            >
              <Modal.Header
                className="justify-content-center"
                style={{
                  paddingBottom: "0px",
                  border: "none",
                }}
              >
                <h5 className="text-center text_red">
                  Are you sure you want to Punch-In now?
                </h5>
              </Modal.Header>
              <Modal.Body className="text-center">
                {user && user.vehicleStatus && (
                  <div className="form_field pi_input">
                    <label htmlFor="id_tripstart">Trip Start Meter Reading*</label>
                    <input
                      id="id_tripstart"
                      className="custom-input"
                      style={{ paddingRight: "10px" }}
                      type="number"
                      // placeholder={
                      //   topRecord && topRecord.tripEnd
                      //     ? "Last Trip End: " + topRecord.tripEnd
                      //     : ""
                      // }
                      placeholder="Enter here"
                      maxLength={7}
                      onInput={(e) => {
                        restrictInput(e, 7);
                        // e.target.value = "45"
                      }}
                      onChange={(e) => setTripStart(e.target.value)}
                    // value={topRecord && topRecord.tripEnd}
                    />
                    {punchInError && (
                      <div className="field_error">
                        Please enter the trip start
                      </div>
                    )}
                  </div>
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
                  className="cancel_btn"
                  onClick={() => {
                    setShowPunchInPopup(false);
                    setPunchInError(false);
                    setTripStart(null);
                  }}
                >
                  Cancel
                </div>
                <div
                  className="done_btn"
                  onClick={handlePunchIn}
                // disabled={loading}
                >
                  Confirm
                </div>
              </Modal.Footer>
            </Modal>
            <Modal
              show={showPunchOutPopup}
              onHide={() => setShowPunchOutPopup(false)}
              centered
              className="pl-0"
            >
              <Modal.Header
                className="justify-content-center"
                style={{
                  paddingBottom: "0px",
                  border: "none",
                }}
              >
                <h5 className="text-center text_red">
                  Are you sure you want to Punch-Out now?
                </h5>
              </Modal.Header>
              <Modal.Body className="text-center">
                {user && user.vehicleStatus && (
                  <div className="form_field pi_input">
                    <label htmlFor="id_tripstart">Trip End Meter Reading*</label>
                    <input
                      id="id_tripend"
                      className="custom-input"
                      style={{ paddingRight: "10px" }}
                      type="number"
                      // placeholder={`Trip Start: ${
                      //   topRecord && topRecord.tripStart
                      // }`}
                      placeholder="Enter here"
                      maxLength={7}
                      onInput={(e) => {
                        restrictInput(e, 7);
                      }}
                      onChange={(e) => setTripEnd(e.target.value)}
                    />
                    <p className="mt-2 text_grey">
                      {Number(tripEnd) >
                        Number(topRecord && topRecord.tripStart)
                        ? "Distance: " +
                        (Number(tripEnd) -
                          Number(topRecord && topRecord.tripStart)) +
                        " KM"
                        : "Note:- Trip End should be greater than Trip Start"}
                    </p>
                    {punchOutError && (
                      <div className="field_error">
                        Please enter the trip end
                      </div>
                    )}
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer
                className="d-flex justify-content-between"
                style={{
                  border: "none",
                  gap: "15px",
                }}
              >
                <div
                  className="cancel_btn"
                  onClick={() => {
                    setShowPunchOutPopup(false);
                    setPunchOutError(false);
                    setTripEnd(null);
                  }}
                >
                  Cancel
                </div>
                <div
                  className="done_btn"
                  onClick={handlePunchOut}
                // disabled={loading}
                >
                  Confirm
                </div>
              </Modal.Footer>
            </Modal>
          </div>

          <div className="top_header_pg pg_bg attendance_pg relative">
            {/* Left section */}
            <div className="attendance_dashboard">
              <div className="pg_header">
                <h2>
                  Your progress of this week {startWeekDate?.getDate()} -{" "}
                  {endWeekDate?.getDate()}{" "}
                  {months[endWeekDate?.getMonth()]?.slice(0, 3)}'
                  {endWeekDate?.getFullYear()}{" "}
                </h2>
              </div>
              <div className="attendance_cards">
                <div className="ac_single day">
                  <h6>Total number of</h6>
                  <h5>Days</h5>
                  <h2>{currentWeekRecords?.length}</h2>
                  <div className="icon">
                    <div className="icon_inner">
                      <img src="/assets/img/edicon/appointment.png" alt="propdial" />
                    </div>
                  </div>
                  <div className="trending">
                    <div className="inner up">
                      {/* <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#00a300"><path d="m147-209-51-51 281-281 152 152 212-211H624v-72h240v240h-72v-117L529-287 377-439 147-209Z" /></svg>
                                            <div className="value">2.5%</div> */}
                      --:--
                    </div>
                    <p>last week</p>
                  </div>
                </div>
                <div className="ac_single hr">
                  <h6>Total number of</h6>
                  <h5>Hrs Worked</h5>
                  <h2>
                    {currentWeekWorkedHours &&
                      currentWeekWorkedHours === "00:00" ? (
                      "--:--"
                    ) : currentWeekWorkedHours ? (
                      <>
                        {currentWeekWorkedHours.split(":")[0]}
                        <span className="unit">hrs</span>{" "}
                        {currentWeekWorkedHours.split(":")[1]}
                        <span className="unit">mins</span>
                      </>
                    ) : (
                      "--:--"
                    )}
                  </h2>

                  <div className="icon">
                    <div className="icon_inner">
                      <img src="/assets/img/edicon/working-time.png" alt="propdial" />
                    </div>
                  </div>
                  <div className="trending">
                    <div className="inner down">
                      {/* <span className="material-symbols-outlined">
                                                trending_down
                                            </span> */}
                      {/* <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FA6262"><path d="M624-209v-72h117L529-492 377-340 96-621l51-51 230 230 152-152 263 262v-117h72v240H624Z" /></svg>
                                            <div className="value">0.5%</div> */}
                      --:--
                    </div>
                    <p>last week</p>
                  </div>
                </div>
                {user && user.vehicleStatus && (
                  <div className="ac_single dist">
                    <h6>Total number of</h6>
                    <h5>Distance</h5>
                    <h2>
                      {currentWeekDistance ? (
                        <>
                          {currentWeekDistance}
                          <span className="unit">km</span>
                        </>
                      ) : (
                        "--:--"
                      )}
                    </h2>

                    <div className="icon">
                      <div className="icon_inner">
                        <img src="/assets/img/edicon/distance.png" alt="propdial" />
                      </div>
                    </div>
                    <div className="trending">
                      <div className="inner up">
                        {/* <span className="material-symbols-outlined">trending_up</span> */}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#00a300"><path d="m147-209-51-51 281-281 152 152 212-211H624v-72h240v240h-72v-117L529-287 377-439 147-209Z" /></svg>
                                              <div className="value">2.5%</div> */}
                        --:--
                      </div>
                      <p>last week</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="year_month">
                <div className="left">
                  <h2>Logs</h2>
                </div>
                <div className="right">
                  <div className="filters">
                    <div className="right">
                      <div className="icon_dropdown">
                        <select
                          value={selectedMonth}
                          onChange={(e) =>
                            fetchSelectedMonthRecords(e.target.value)
                          }
                        >
                          {/* {months.map((month, index) => (
                                                        <option key={index} value={month}>
                                                            {month}
                                                        </option>
                                                    ))} */}

                          {filteredMonths.map((month, index) => (
                            <option key={index} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="icon_dropdown">
                        <select
                          value={selectedYear}
                          onChange={(e) =>
                            fetchSelectedYearRecords(e.target.value)
                          }
                        >
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
                          {/* <span className="material-symbols-outlined">
                                                        calendar_view_month
                                                    </span> */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#FFFFFF"
                          >
                            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-360h160v-200H160v200Zm240 0h160v-200H400v200Zm240 0h160v-200H640v200ZM320-240v-200H160v200h160Zm80 0h160v-200H400v200Zm240 0h160v-200H640v200Z" />
                          </svg>
                        </div>
                        <div
                          className={`bf_single ${viewMode === "table_view" ? "active" : ""
                            }`}
                          onClick={() => handleModeChange("table_view")}
                        >
                          {/* <span className="material-symbols-outlined">
                                                        view_list
                                                    </span> */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#FFFFFF"
                          >
                            <path d="M360-240h440v-107H360v107ZM160-613h120v-107H160v107Zm0 187h120v-107H160v107Zm0 186h120v-107H160v107Zm200-186h440v-107H360v107Zm0-187h440v-107H360v107ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z" />
                          </svg>
                        </div>
                      </div>
                      <div
                        className="export pointer"
                        onClick={exportExcelFormate}
                      >
                        <img src="/assets/img/icons/excel_logo.png" alt="propdial" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {viewMode === "card_view" && (
                <div >
                  {attendanceData && attendanceData.length === 0 ? (
                    <div className="no_data">
                      <h6>
                        No data found
                      </h6>
                    </div>
                  ) : (

                    <div className="previous_punch">
                      {attendanceData &&
                        attendanceData.length > 0 &&
                        attendanceData.map((data) => (
                          <div
                            className={`pp_single ${user && user.vehicleStatus ? "" : "v_not"
                              }`}
                          >
                            <div className="top">
                              <div className="left">
                                {data.date ? (
                                  <h3>{data.date.slice(0, 2)}</h3>
                                ) : (
                                  ""
                                )}
                                {data.weekDay ? (
                                  <h4>{data.weekDay.slice(0, 3)}</h4>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className="right">
                                <div className="r_single">
                                  <h6> Hrs Worked</h6>
                                  {data.workHrs === "00:00" ? (
                                    "--:--"
                                  ) : (
                                    // <h5>{data.workHrs}</h5>
                                    <h5>
                                      {data.workHrs
                                        ? data.workHrs
                                          .split(":")
                                          .map((val, index) => (
                                            <span key={index}>
                                              {val.trim()}
                                              <span className="unit">
                                                {index === 0 ? "hrs" : "min"}
                                              </span>
                                              {index === 0 && (
                                                <span
                                                  style={{ marginRight: "8px" }}
                                                ></span>
                                              )}
                                            </span>
                                          ))
                                        : "--:--"}
                                    </h5>
                                  )}
                                </div>

                                {user && user.vehicleStatus ? (
                                  <div className="r_single">
                                    <h6> Distance</h6>
                                    {data.tripDistance ? (
                                      <h5>{data.tripDistance} KM</h5>
                                    ) : (
                                      "--:--"
                                    )}
                                  </div>
                                ) : (
                                  <div className="r_single">
                                    <h6> Punch In</h6>
                                    {data.punchIn ? (
                                      <h5>{data.punchIn}</h5>
                                    ) : (
                                      "--:--"
                                    )}
                                  </div>
                                )}
                                {user && user.vehicleStatus ? (
                                  ""
                                ) : (
                                  <div className="r_single">
                                    <h6> Punch Out</h6>
                                    {data.punchOut ? (
                                      <h5>{data.punchOut}</h5>
                                    ) : (
                                      "--:--"
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            {user && user.vehicleStatus ? (
                              <div
                                className={`bottom ${user && user.vehicleStatus ? "trip" : ""
                                  }`}
                              >
                                <div className="b_single">
                                  <h6>Punch In</h6>
                                  {data.punchIn ? (
                                    <h5>{data.punchIn}</h5>
                                  ) : (
                                    "--:--"
                                  )}
                                </div>
                                <div className="b_single">
                                  <h6>Punch Out</h6>
                                  {data.punchOut ? (
                                    <h5>{data.punchOut}</h5>
                                  ) : (
                                    "--:--"
                                  )}
                                </div>
                                {user && user.vehicleStatus && (
                                  <div className="b_single">
                                    <h6>Trip Start</h6>
                                    {data.tripStart ? (
                                      <h5>{data.tripStart}</h5>
                                    ) : (
                                      "--:--"
                                    )}
                                  </div>
                                )}
                                {user && user.vehicleStatus && (
                                  <div className="b_single">
                                    <h6>Trip End</h6>
                                    {data.tripEnd ? (
                                      <h5>{data.tripEnd}</h5>
                                    ) : (
                                      "--:--"
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                            <div className={`punch_location ${expandedCards[data.id] ? "expand_text" : ""
                              }`}>
                              <div className="pl_single">
                                <h6>Punch In Location</h6>

                                <h5>
                                  {data.punchInLocation
                                    ? data.punchInLocation
                                      .split(",")
                                      .filter(
                                        (part) =>
                                          part.trim() !== "undefined" &&
                                          part.trim() !== ""
                                      )
                                      .slice(0, -1)
                                      .join(", ")
                                    : "--:--"}
                                </h5>
                              </div>
                              <div className="pl_single">
                                <h6>Punch Out Location </h6>

                                <h5>
                                  {data.punchOutLocation
                                    ? data.punchOutLocation
                                      .split(",")
                                      .filter(
                                        (part) =>
                                          part.trim() !== "undefined" &&
                                          part.trim() !== ""
                                      )
                                      .slice(0, -1)
                                      .join(", ")
                                    : "--:--"}
                                </h5>
                              </div>
                              <div className="expand_location"
                                onClick={() => toggleExpand(data.id)}
                              >
                                <span className="material-symbols-outlined">

                                  {expandedCards[data.id] ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#606060">
                                      <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                                    </svg>
                                  ) : (


                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#606060">
                                      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                    </svg>
                                  )}

                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                  )}
                </div>
              )}
              {viewMode === "table_view" && (
                <div className="attendance_table table_filter_hide mt-3">
                  <ReactTable
                    tableColumns={columns}
                    tableData={attendanceData}
                  />
                </div>
              )}
            </div>

            {/* Todays'punch-in & punch-out section */}
            <div className="punch">
              {/* <div className="punch_inner"> */}
              <div className="top">
                <div className="left">
                  <h3>Hey {user && user.fullName}!</h3>
                  <h6>{greeting}! Mark your attendance</h6>
                </div>
                <div className="right">
                  <img src={user && user.photoURL} alt="propdial" />
                </div>
              </div>
              <div className="body">
                <div className="body_top">
                  <CurrentDateTime />
                  {
                    // !topRecord ? 
                    // (
                    //     <div className="punch_button outer">
                    //       <div className="inner_one">
                    //         <div className="inner_two">
                    //           <BeatLoader color="grey" loading={true} />
                    //         </div>
                    //       </div>
                    //     </div>
                    //   ) : 
                    (
                      <>
                        {topRecord && topRecord.length === 0 ? (
                          <div
                            className="punch_button outer"
                            onClick={handelShowPunchInPopup}
                          >
                            <div className="inner_one">
                              <div className="inner_two">
                                <img src="/assets/img/hand-pointer.png" alt="propdial" />
                                <h6>Punch In</h6>
                              </div>
                            </div>
                          </div>
                        ) : !topRecord ||
                          (topRecord &&
                            (topRecord.createdAt?.toDate() <
                              new Date().setHours(0, 0, 0, 0) ||
                              !topRecord?.punchIn)) ? (
                          <div
                            className="punch_button outer"
                            onClick={handelShowPunchInPopup}
                          >
                            <div className="inner_one">
                              <div className="inner_two">
                                <img src="/assets/img/hand-pointer.png" alt="propdial" />
                                <h6>Punch In</h6>
                              </div>
                            </div>
                          </div>
                        ) : topRecord &&
                          topRecord.date === formattedTodaysDate &&
                          !topRecord.punchOut ? (
                          <div
                            className="punch_button punchout outer"
                            onClick={handelShowPunchOutPopup}
                          >
                            <div className="inner_one">
                              <div className="inner_two">
                                <img src="/assets/img/punchouthand.png" alt="propdial" />
                                <h6>Punch Out</h6>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="punch_button pio_done outer">
                            <div className="inner_one">
                              <div className="inner_two">
                                <h6 className="text-center">
                                  Next Punch In Tomorrow
                                </h6>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                </div>

                <div className="punch_detail">
                  <div className="pd_single">
                    <img src="/assets/img/punchin.png" alt="propdial" />
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
                    {/* <h6>
                      {topRecord &&
                      topRecord.date === formattedTodaysDate &&
                      topRecord.punchInLocation
                        ? (() => {
                            const parts = topRecord.punchInLocation
                              .split(", ")
                              .map((part) => part.trim());                           
                            const first =
                              parts[0] !== "undefined" && parts[0] !== ""
                                ? parts[0]
                                : null;
                            const second =
                              parts[1] !== "undefined" && parts[1] !== ""
                                ? parts[1]
                                : null;

                            if (first && second) return `${first}, ${second}`;
                            if (!first && second) return second; 
                            return first || "";
                          })()
                        : ""}
                    </h6> */}

                    <marquee behavior="" direction="" scrollamount="3">
                      {/* <h6>
                      {topRecord &&
                      topRecord.date === formattedTodaysDate &&
                      topRecord.punchInLocation
                        ? topRecord.punchInLocation
                        : ""}
                    </h6> */}
                      <h6>
                        {topRecord &&
                          topRecord.date === formattedTodaysDate &&
                          topRecord.punchInLocation
                          ? topRecord.punchInLocation
                            .split(",")
                            .filter(
                              (part) =>
                                part.trim() !== "undefined" &&
                                part.trim() !== ""
                            )
                            .slice(0, -1)
                            .join(", ")
                          : ""}
                      </h6>
                    </marquee>
                  </div>

                  <div className="pd_single">
                    <img src="/assets/img/edicon/total_work.png" alt="propdial" />
                    {topRecord && !topRecord.date === formattedTodaysDate ? (
                      <div className="data">--:--</div>
                    ) : (
                      // <div className="data">
                      //   {topRecord &&
                      //   topRecord.workHrs &&
                      //   topRecord.workHrs === "00:00"
                      //     ? "--:--"
                      //     : topRecord?.workHrs &&
                      //       topRecord.date === formattedTodaysDate
                      //     ? topRecord && topRecord.workHrs
                      //     : "--:--"}
                      // </div>
                      <div className="data">
                        {topRecord?.workHrs
                          ? topRecord.workHrs === "00:00"
                            ? "--:--"
                            : topRecord.date === formattedTodaysDate
                              ? `${parseInt(
                                topRecord.workHrs.split(":")[0]
                              )}hrs ${parseInt(
                                topRecord.workHrs.split(":")[1]
                              )}min`
                              : "--:--"
                          : "--:--"}
                      </div>
                    )}
                    <h6>Hrs Worked</h6>
                  </div>
                  <div className="pd_single">
                    <img src="/assets/img/punchout.png" alt="propdial" />
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
                    {/* <h6>
                      {" "}
                      {topRecord &&
                      topRecord.date === formattedTodaysDate &&
                      topRecord.punchOutLocation
                        ? topRecord.punchOutLocation
                        : ""}
                    </h6> */}
                    <marquee behavior="" direction="" scrollamount="3">
                      <h6>
                        {topRecord &&
                          topRecord.date === formattedTodaysDate &&
                          topRecord.punchOutLocation
                          ? topRecord.punchOutLocation
                            .split(",")
                            .filter(
                              (part) =>
                                part.trim() !== "undefined" &&
                                part.trim() !== ""
                            )
                            .slice(0, -1)
                            .join(", ")
                          : ""}
                      </h6>
                    </marquee>
                  </div>
                  {user && user.vehicleStatus && (
                    <div className="pd_single">
                      <img src="/assets/img/edicon/tripstart.png" alt="propdial" />
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
                  )}
                  {user && user.vehicleStatus && (
                    <div className="pd_single">
                      <img src="/assets/img/edicon/tripend.png" alt="propdial" />
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
                  )}
                  {user && user.vehicleStatus && (
                    <div className="pd_single">
                      <img src="/assets/img/edicon/travel.png" alt="propdial" />
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
                  )}
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </>
  );
};

export default PGAttendance;

