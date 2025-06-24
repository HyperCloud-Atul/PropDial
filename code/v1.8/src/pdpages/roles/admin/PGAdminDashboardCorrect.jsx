import React from "react";
import { useState, useEffect } from "react";
import LinearProgressBar from "../../../pages/roles/owner/LinearProgressBar";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import {
  collection,
  getCountFromServer,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { projectFirestore } from "../../../firebase/config";
import { BeatLoader, ClipLoader } from "react-spinners";
import useStateWisePropertyCounts from "../../../utils/useStateWisePropertyCounts";

// owl carousel
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// owl carousel

// component
import InactiveUserCard from "../../../components/InactiveUserCard";

// css
import "./PGAdminDashboard.scss";

const PGAdminDashboard = () => {
  const { user } = useAuthContext();
  const { stateCounts } = useStateWisePropertyCounts();
  // advertisement img option in owl carousel
  const addImgOptions = {
    items: 1,
    dots: false,
    loop: true,
    margin: 10,
    nav: false,
    smartSpeed: 1500,
    autoplay: true,
    autoplayTimeout: 5000,
    responsive: {
      // Define breakpoints and the number of items to show at each breakpoint
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 1,
      },
    },
  };
  const addImgOptions2 = {
    items: 1,
    dots: false,
    loop: true,
    margin: 10,
    nav: false,
    smartSpeed: 1500,
    autoplay: true,
    autoplayTimeout: 9000,
    responsive: {
      // Define breakpoints and the number of items to show at each breakpoint
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 1,
      },
    },
  };
  // advertisement img option in owl carousel

  // 9 dots controls
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };
  // 9 dots controls

  // Count states
  const [totalCount, setTotalCount] = useState(null);
  const [inReviewCount, setInReviewCount] = useState(null);
  const [inactiveCount, setInactiveCount] = useState(null);
  const [activeCount, setActiveCount] = useState(null);
  const [residentialCount, setResidentialCount] = useState(null);
  const [commercialCount, setCommercialCount] = useState(null);
  const [plotCount, setPlotCount] = useState(null);
  const [availableForRentCount, setAvailableForRentCount] = useState(null);
  const [availableForSaleCount, setAvailableForSaleCount] = useState(null);
  const [rentedOutCount, setRentedOutCount] = useState(null);
  const [soldCount, setSoldCount] = useState(null);
  const [rentAndSaleCount, setRentAndSaleCount] = useState(null);
  const [rentedButSaleCount, setRentedButSaleCount] = useState(null);
  const [pmsOnlyCount, setPmsOnlyCount] = useState(null);
  const [pmsAfterRentCount, setPmsAfterRentCount] = useState(null);
  const [countLoading, setCountLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const cachedCounts = sessionStorage.getItem("propertyCounts");

    if (cachedCounts) {
      const data = JSON.parse(cachedCounts);
      setTotalCount(data.totalCount);
      setInReviewCount(data.inReviewCount);
      setInactiveCount(data.inactiveCount);
      setActiveCount(data.activeCount);
      setResidentialCount(data.residentialCount);
      setCommercialCount(data.commercialCount);
      setPlotCount(data.plotCount);
      setAvailableForRentCount(data.availableForRentCount);
      setAvailableForSaleCount(data.availableForSaleCount);
      setRentedOutCount(data.rentedOutCount);
      setSoldCount(data.soldCount);
      setRentAndSaleCount(data.rentAndSaleCount);
      setRentedButSaleCount(data.rentedButSaleCount);
      setPmsOnlyCount(data.pmsOnlyCount);
      setPmsAfterRentCount(data.pmsAfterRentCount);
      setCountLoading(false);
    }

    const fetchCounts = async () => {
      try {
        const baseColl = collection(projectFirestore, "properties-propdial");

        const [
          totalSnap,
          inReviewSnap,
          inactiveSnap,
          activeSnap,
          residentialSnap,
          commercialSnap,
          plotCountSnap,
          availableForRentSnap,
          availableForSaleSnap,
          rentedOutSnap,
          soldSnap,
          rentAndSaleSnap,
          rentedButSaleSnap,
          pmsOnlySnap,
          pmsAfterRentSnap,
        ] = await Promise.all([
          getCountFromServer(baseColl),
          getCountFromServer(
            query(baseColl, where("isActiveInactiveReview", "==", "In-Review"))
          ),
          getCountFromServer(
            query(baseColl, where("isActiveInactiveReview", "==", "Inactive"))
          ),
          getCountFromServer(
            query(baseColl, where("isActiveInactiveReview", "==", "Active"))
          ),
          getCountFromServer(
            query(baseColl, where("category", "==", "Residential"))
          ),
          getCountFromServer(
            query(baseColl, where("category", "==", "Commercial"))
          ),
          getCountFromServer(query(baseColl, where("category", "==", "Plot"))),
          getCountFromServer(
            query(baseColl, where("flag", "==", "Available For Rent"))
          ),
          getCountFromServer(
            query(baseColl, where("flag", "==", "Available For Sale"))
          ),
          getCountFromServer(
            query(baseColl, where("flag", "==", "Rented Out"))
          ),
          getCountFromServer(query(baseColl, where("flag", "==", "Sold Out"))),
          getCountFromServer(
            query(baseColl, where("flag", "==", "Rent and Sale"))
          ),
          getCountFromServer(
            query(baseColl, where("flag", "==", "Rented But Sale"))
          ),
          getCountFromServer(query(baseColl, where("flag", "==", "PMS Only"))),
          getCountFromServer(
            query(baseColl, where("flag", "==", "PMS After Rent"))
          ),
        ]);

        const freshData = {
          totalCount: totalSnap.data().count,
          inReviewCount: inReviewSnap.data().count,
          inactiveCount: inactiveSnap.data().count,
          activeCount: activeSnap.data().count,
          residentialCount: residentialSnap.data().count,
          commercialCount: commercialSnap.data().count,
          plotCount: plotCountSnap.data().count,
          availableForRentCount: availableForRentSnap.data().count,
          availableForSaleCount: availableForSaleSnap.data().count,
          rentedOutCount: rentedOutSnap.data().count,
          soldCount: soldSnap.data().count,
          rentAndSaleCount: rentAndSaleSnap.data().count,
          rentedButSaleCount: rentedButSaleSnap.data().count,
          pmsOnlyCount: pmsOnlySnap.data().count,
          pmsAfterRentCount: pmsAfterRentSnap.data().count,
        };

        const oldData = JSON.parse(
          sessionStorage.getItem("propertyCounts") || "{}"
        );

        if (JSON.stringify(oldData) !== JSON.stringify(freshData)) {
          sessionStorage.setItem("propertyCounts", JSON.stringify(freshData));
          setTotalCount(freshData.totalCount);
          setInReviewCount(freshData.inReviewCount);
          setInactiveCount(freshData.inactiveCount);
          setActiveCount(freshData.activeCount);
          setResidentialCount(freshData.residentialCount);
          setCommercialCount(freshData.commercialCount);
          setPlotCount(freshData.plotCount);
          setAvailableForRentCount(freshData.availableForRentCount);
          setAvailableForSaleCount(freshData.availableForSaleCount);
          setRentedOutCount(freshData.rentedOutCount);
          setSoldCount(freshData.soldCount);
          setRentAndSaleCount(freshData.rentAndSaleCount);
          setRentedButSaleCount(freshData.rentedButSaleCount);
          setPmsOnlyCount(freshData.pmsOnlyCount);
          setPmsAfterRentCount(freshData.pmsAfterRentCount);
        }

        setCountLoading(false);
      } catch (err) {
        console.error("❌ Error fetching property counts:", err);
        setError("Failed to fetch property counts");
        setCountLoading(false);
      }
    };

    // 🔁 Real-time listener for auto-refresh
    const baseColl = collection(projectFirestore, "properties-propdial");
    const unsubscribe = onSnapshot(baseColl, (snapshot) => {
      fetchCounts(); // If any change in collection, fetch new counts
    });

    // initial load from server
    fetchCounts();

    return () => unsubscribe(); // clean up listener when component unmounts
  }, []);
  // count total property documents end

  return (
    <div>
      {user && user.status === "active" ? (
        <>
          {/* 9 dots html  */}
          <Link
            to="/newproperty"
            className="property-list-add-property with_9dot"
          >
            <span className="material-symbols-outlined">add</span>
          </Link>
          <div
            onClick={openMoreAddOptions}
            className="property-list-add-property"
          >
            <span className="material-symbols-outlined">apps</span>
          </div>
          <div
            className={
              handleMoreOptionsClick
                ? "more-add-options-div open"
                : "more-add-options-div"
            }
            onClick={closeMoreAddOptions}
            id="moreAddOptions"
          >
            <div className="more-add-options-inner-div">
              <div className="more-add-options-icons">
                <h1>Close</h1>
                <span className="material-symbols-outlined">close</span>
              </div>

              <Link to="/newproperty" className="more-add-options-icons">
                <h1>Add property</h1>
                <span className="material-symbols-outlined">location_city</span>
              </Link>

              <Link to="/allproperties/all" className="more-add-options-icons">
                <h1>Properties</h1>
                <span className="material-symbols-outlined">
                  real_estate_agent
                </span>
              </Link>
            </div>
          </div>
          {/* 9 dots html  */}

          <div className="top_header_pg pg_bg propagent_dashboard">
            <div className="page_spacing pg_min_height">
              <div className="pg_header">
                <h2 className="m22 mb-1">
                  {user.role === "admin" ? "Admin" : "Super Admin"} Dashboard
                </h2>
                <h4 className="r18 light_black">
                  Welcome <b> {user.displayName} </b>to Propdial
                </h4>
              </div>
              <div className="vg22"></div>
              <div className="pg_body">
                <div className="propagent_dashboard_inner">
                  <section className="row">
                    <div className="col-xl-5">
                      <div className="total_prop_card relative">
                        <div className="bg_icon">
                          <img src="/assets/img/flats.png" alt="propdial" />
                        </div>
                        <div className="inner">
                          <div className="icon">
                            <img src="/assets/img/flats.png" alt="propdial" />
                          </div>
                          <div className="content">
                            <h4 className="title">My Properties</h4>
                            <div className="bar">
                              <LinearProgressBar total="55" current="20" />
                            </div>

                            <h6>360&deg; Property Management Solutions</h6>
                          </div>
                          <div className="number">{totalCount}</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-7 bg_575">
                      <div className="vg22_1199"></div>
                      <div className="property_status">
                        <Link
                          to="/filtered-property?filter=inreview"
                          className="ps_single pending"
                        >
                          <h5>{inReviewCount}</h5>
                          <h6>In-Review</h6>
                        </Link>
                        <Link className="ps_single active">
                          <h5>{activeCount}</h5>
                          <h6>Active</h6>
                        </Link>
                        <Link
                          to="/filtered-property?filter=inactive"
                          className="ps_single inactive"
                        >
                          <h5>{inactiveCount}</h5>
                          <h6>Inactive</h6>
                        </Link>
                      </div>
                    </div>
                  </section>
                  <div className="vg22"></div>
                  <section className="property_status assign">
                    <Link className="ps_single four">
                      <h5>{residentialCount}</h5>
                      <h6>
                        Property Category <br /> Residential{" "}
                      </h6>
                    </Link>
                    <Link className="ps_single five">
                      <h5>{commercialCount}</h5>
                      <h6>
                        Property Category <br /> Commercial{" "}
                      </h6>
                    </Link>
                    <Link className="ps_single five">
                      <h5>{plotCount}</h5>
                      <h6>
                        Property Category <br /> Plot{" "}
                      </h6>
                    </Link>
                  </section>
                  <div className="vg22"></div>
                  <section className="self_property_detail">
                    <Link className="spd_single">
                      <div className="left rent">
                        <img src="/assets/img/key.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>Available For Rent</h6>
                        <h5>{availableForRentCount}</h5>
                      </div>
                    </Link>
                    <Link className="spd_single">
                      <div className="left sale">
                        <img src="/assets/img/growth.png  " alt="propdial" />
                      </div>
                      <div className="right ">
                        <h6>Available For Sale</h6>
                        <h5>{availableForSaleCount}</h5>
                      </div>
                    </Link>
                    <Link className="spd_single">
                      <div className="left rent">
                        <img src="/assets/img/rented_out.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>Rented Out</h6>
                        <h5>{rentedOutCount}</h5>
                      </div>
                    </Link>
                    <Link className="spd_single">
                      <div className="left sale">
                        <img src="/assets/img/sold_out.png  " alt="propdial" />
                      </div>
                      <div className="right ">
                        <h6>Sold Out</h6>
                        <h5>{soldCount}</h5>
                      </div>
                    </Link>
                    <div className="spd_single">
                      <div className="left residential">
                        <img src="/assets/img/house.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>Rent And Sale</h6>
                        <h5>{rentAndSaleCount}</h5>
                      </div>
                    </div>
                    <div className="spd_single">
                      <div className="left commercial">
                        <img src="/assets/img/buildings.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>Rented But Sale</h6>
                        <h5>{rentedButSaleCount}</h5>
                      </div>
                    </div>
                    <div className="spd_single">
                      <div className="left commercial">
                        <img src="/assets/img/buildings.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>PMS Only</h6>
                        <h5>{pmsOnlyCount}</h5>
                      </div>
                    </div>
                    <div className="spd_single">
                      <div className="left commercial">
                        <img src="/assets/img/buildings.png" alt="propdial" />
                      </div>
                      <div className="right">
                        <h6>PMS After Rent</h6>
                        <h5>{pmsAfterRentCount}</h5>
                      </div>
                    </div>
                  </section>
                  <div className="vg22"></div>

                  <div className="properties_map">
                    <h2
                      className="p_title"
                      style={{
                        fontSize: "21px",
                        fontWeight: "500",
                        marginBottom: "6px",
                      }}
                    >
                      Properties in major states
                    </h2>

                    <div className="pi_cities row">
                      {Object.entries(stateCounts).map(([state, count]) => (
                        <div className="col-lg-3 col-md-4 col-6" key={state}>
                          <div className="pi_cities_single mt-4">
                            <h6>{state}</h6>
                            <h5>{count}</h5>
                            <div className="bar">
                              <div
                                className="bar_fill"
                                style={{
                                  width: `${(count / totalCount) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="vg22"></div>
                  <section className="add_section row">
                    <div className="add_single col-lg-6">
                      <OwlCarousel className="owl-theme" {...addImgOptions2}>
                        <div className="item">
                          <img
                            src="/assets/img/banner1.png"
                            alt="propdial"
                            className="add_img"
                          />
                        </div>
                        <div className="item">
                          <img
                            src="/assets/img/banner2.png"
                            alt="propdial"
                            className="add_img"
                          />
                        </div>
                      </OwlCarousel>
                    </div>
                    <div className="add_single col-lg-6 add_single_2">
                      <OwlCarousel className="owl-theme" {...addImgOptions}>
                        <div className="item">
                          <img
                            src="/assets/img/banner4.png"
                            alt="propdial"
                            className="add_img"
                          />
                        </div>
                        <div className="item">
                          <img
                            src="/assets/img/banner5.png"
                            alt="propdial"
                            className="add_img"
                          />
                        </div>
                      </OwlCarousel>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <InactiveUserCard />
      )}
    </div>
  );
};

export default PGAdminDashboard;
