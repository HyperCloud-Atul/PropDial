import React, { useState, useEffect, useRef } from "react";
import AddBookingIcon from "./AddBookingIcon";
import NotificationIcon from "./NotificationIcon";
import { useLocation } from "react-router-dom";

import Dental from "./Dental";
import Hijama from "./Hijama";
import Homeopathy from "./Homeopathy";
import Dermatology from "./Dermatology";
import "./Services.css";

// import owl carousel
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import FooterUpper from "./FooterUpper";

const Services = () => {
  const images = [
    "./assets/img/dentamax services  banner.png",
    "./assets/img/about-us.png",
    // Add more image paths as needed
  ];

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e) => {
    if (e.deltaY > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [images]);

  // Initialize a state variable to track the active section
  const [activeSection, setActiveSection] = useState("Dental");
  const serviceHeadings = {
    Dental: "Dental Services",
    Dermatology: "Dermatology Services",
    Homeopathy: "Homeopathy Services",
    Hijama: "Hijama Services",
  };

  // Use the activeSection to get the corresponding heading
  const sectionHeading = serviceHeadings[activeSection] || "";

  // Use useEffect to set the initial state when the component mounts
  useEffect(() => {
    // Get the current URL path to determine the initial active section
    const currentPath = window.location.pathname;
    if (currentPath === "/dermatology") {
      setActiveSection("Dermatology");
    } else if (currentPath === "/homeopathy") {
      setActiveSection("Homeopathy");
    } else if (currentPath === "/hijama") {
      setActiveSection("Hijama");
    }
  }, []);

  // Function to scroll to the "our-services-heading" element
  const scrollToOurServicesHeading = () => {
    const ourServicesHeading = document.getElementById("our-services-heading");
    if (ourServicesHeading) {
      ourServicesHeading.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to handle the service click and scroll to "our-services-heading" if a specific service is clicked
  const handleServiceClick = (service) => {
    setActiveSection(service);
    if (
      service === "Dental" ||
      service === "Dermatology" ||
      service === "Homeopathy" ||
      service === "Hijama"
    ) {
      scrollToOurServicesHeading();
    }
  };

  // Initialize state for the banner image source
  const [bannerImages, setBannerImage] = useState("");

  // Use useEffect to set the banner image source based on the active section
  useEffect(() => {
    // Define a mapping of service names to banner images
    const bannerImages = {
      Dental: "./assets/img/dentamax services  banner.png",
      Dermatology: "./assets/img/dermatology-banner.png",
      Homeopathy: "./assets/img/homeopathy-banner.png",
      Hijama: "./assets/img/homebanner5.jpg",
    };

    // Set the banner image source based on the active section
    setBannerImage(bannerImages[activeSection]);
  }, [activeSection]);

  // Define variables for text content of each service
  let serviceHeading = "";
  let serviceDescription = "";

  // Update text content based on the active section
  if (activeSection === "Dental") {
    serviceHeading = "Integrated Healthcare Solutions";
    serviceDescription = "Solutions Catering to Your Diverse Medical Needs";
  } else if (activeSection === "Dermatology") {
    serviceHeading = "Skin health expertise.";
    serviceDescription = "Skin health, disorders, and treatments for all ages.";
  } else if (activeSection === "Homeopathy") {
    serviceHeading = "Natural remedy using diluted substances.";
    serviceDescription =
      "Alternative medicine based on diluted natural substances.";
  } else if (activeSection === "Hijama") {
    serviceHeading = "Therapeutic cupping therapy.";
    serviceDescription =
      "Traditional healing method using controlled suction cups.";
  }

  return (
    <div>
      <AddBookingIcon />
      <NotificationIcon />
      <div className="pg_contact_us">
        <div className="banner relative">
          <img src={bannerImages} alt="Banner" />
          <div className="banner_content">
            <div className="bc_inner">
              <div className="container">
                <h3 className="banner_subheading">{serviceHeading}</h3>
                <h2 className="services_banner_heading">
                  {serviceDescription}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* top four services */}
      {/* <div className="parent_div">
        <div className="container">
          <div className="row">
            <div className="services_heading">
              <p>Our Services</p>
              <h1 id="top_heading">
                Our Comprehensive Range of Tailored Services
              </h1>
            </div>

            <div
              className="col-md-3 col-sm-12 img-parent"
              onClick={() => handleServiceClick("Dental")}
            >
              <img
                src="./assets/img/dental_img.jpg"
                alt="dental_img"
                className="services-img"
              />
              <h2>Dental</h2>
              <h5>
                Dental care ensures a healthy smile and overall well-being.
              </h5>
            </div>
            <div
              className="col-md-3 col-sm-12 img-parent"
              onClick={() => handleServiceClick("Dermatology")}
            >
              <img
                src="./assets/img/dermatolgy-service.jpg"
                alt="dental_img"
                className="services-img"
              />
              <h2>Dermatology</h2>
              <h5>
                Dermatology provides expert skin care for a radiant, healthy
                appearance.{" "}
              </h5>
            </div>
            <div
              className="col-md-3 col-sm-12 img-parent"
              onClick={() => handleServiceClick("Homeopathy")}
            >
              <img
                src="./assets/img/homeopathy.jpg"
                alt="dental_img"
                className="services-img"
              />
              <h2>Homeopathy</h2>
              <h5>
                Homeopathy offers natural remedies tailored to enhance holistic
                wellness effectively.{" "}
              </h5>
            </div>
            <div
              className="col-md-3 col-sm-12 img-parent"
              onClick={() => handleServiceClick("Hijama")}
            >
              <img
                src="./assets/img/hijama_img.jpg"
                alt="dental_img"
                className="services-img"
              />
              <h2>Hijama</h2>
              <h5>
                Hijama therapy promotes well-being through traditional cupping
                for enhanced vitality.
              </h5>
            </div>
          </div>
        </div>
      </div> */}

      {/* icons services section */}
      <div style={{ marginTop: "70px" }}>
        <div className="container-fluid">
          <div className="row">
            {/* left section */}
            <div className="col col-md-6 col-sm-12">
              <div className="row">
                <h2 className="service_selct_choice">Select By Choice</h2>
              </div>
              <div className="services_icon_div">
                <div className="row">
                  <div
                    className={`col col-md-6 col-sm-6 icon_top_row first_service_icon ${activeSection === "Dental" ? "active-service" : ""
                      }`}
                    style={{
                      borderRight: "1px solid gray",
                      borderBottom: "1px solid gray",
                    }}
                    onClick={() => handleServiceClick("Dental")}
                  >
                    <img
                      alt="
                  dental image"
                      src="https://cdnl.iconscout.com/lottie/premium/thumb/tooth-digging-6735859-5583541.gif"
                      className="services_icon_images"
                    />
                    <h5>Dental</h5>
                  </div>
                  <div
                    className={`col col-md-6 col-sm-6 icon_top_row first_service_icon ${activeSection === "Dermatology" ? "active-service" : ""
                      }`}
                    style={{
                      borderBottom: "1px solid gray",
                    }}
                    onClick={() => handleServiceClick("Dermatology")}
                  >
                    <img
                      alt="dermatology image"
                      src="https://media4.giphy.com/media/FkOv06L1Q3uJqu5Myu/giphy.gif"
                      className="services_icon_images"
                    />
                    <h5>Dermatology</h5>
                  </div>
                </div>
                <div className="row">
                  <div
                    className={`col col-md-6 col-sm-6 icon_top_row first_service_icon ${activeSection === "Homeopathy" ? "active-service" : ""
                      }`}
                    style={{
                      borderRight: "1px solid gray",
                    }}
                    onClick={() => handleServiceClick("Homeopathy")}
                  >
                    <img
                      alt="homeopathy img"
                      src="https://perfectheal.in/wp-content/uploads/2022/12/48-favorite-heart-outline-2.gif"
                      className="services_icon_images"
                    />
                    <h5>Homeopathy</h5>
                  </div>
                  <div
                    className={`col col-md-6 col-sm-6 icon_top_row first_service_icon ${activeSection === "Hijama" ? "active-service" : ""
                      }`}
                    onClick={() => handleServiceClick("Hijama")}
                  >
                    <img
                      alt="hijama img"
                      src="https://cdn-icons-png.flaticon.com/512/6173/6173465.png"
                      className="services_icon_images"
                    />
                    <h5>Hijama</h5>
                  </div>
                </div>
              </div>
            </div>
            {/* right section */}
            <div className="col col-md-6 col-sm-12 right_row_parent_div">
              <div style={{ position: "relative" }}>
                <img
                  src="./assets/img/service_direction_girl.png"
                  alt="direction girl 1"
                  className="direction_girl"
                />
                <img
                  src="./assets/img/sevices_direction_circle.png"
                  alt="direction girl 2"
                  className="sevices_direction_circle"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="our-services-heading">
          <h1
            style={{
              textAlign: "center",
              // marginTop: "100px",
              backgroundColor: "white",
              color: "white",
              fontSize: "25px",
              padding: "10px",
              fontWeight: "700",
            }}
          >
            {sectionHeading}
          </h1>
        </div>
        <h1
          style={{
            textAlign: "center",
            // marginTop: "100px",
            backgroundColor: "var(--click-color)",
            color: "white",
            fontSize: "30px",
            padding: "10px",
            fontWeight: "700",
          }}
        >
          {sectionHeading}
        </h1>
        {/* Conditionally render the active section */}
        {activeSection === "Dental" && <Dental />}
        {activeSection === "Dermatology" && <Dermatology />}
        {activeSection === "Homeopathy" && <Homeopathy />}
        {activeSection === "Hijama" && <Hijama />}
      </div>
      {/* <h1
        style={{
          textAlign: "center",
          marginTop: "100px",
          backgroundColor: "var(--click-color)",
          color: "white",
          fontSize: "30px",
          padding: "10px",
          fontWeight: "700",
        }}
        className="service_heading_name"
      >
        {sectionHeading}
      </h1> */}

      {/* Top Services */}
      <section className="top_cities sect_padding">
        <div className="first_div">
          <div className="cities_single title">
            <div>
              <div className="section_title">
                <div class="section_title_effect">Services</div>
                <h3>Healthcare Services for You.</h3>
              </div>
            </div>
          </div>
          <div className="cities_single down">
            <img
              src="./assets/img/homeopathy-img.jpg"
              alt="city img"
              className="city_image"
            />
            {/* <div className="city_number">04.</div> */}
            <div className="city_name">
              <h6>Homeopathy</h6>
              {/* <h5>Homeopathy</h5> */}
            </div>
          </div>
        </div>
        <div className="second_div">
          <div className="first_row">
            <div className="cities_single first_row_img pointer">
              <img
                src="./assets/img/paediatric-dentistry.jpg"
                alt="city img 2"
                className="city_image"
              />
              <h6>paediatric-dentistry</h6>
              {/* <h5>paediatric-dentistry</h5> */}
            </div>
            <div className="cities_single first_row_img pointer">
              <img
                src="./assets/img/surgical-procedures.jpeg"
                alt="city img 3"
                className="city_image"
              />

              <h6>surgical-procedures</h6>
            </div>
            <div className="cities_single first_row_img pointer">
              <img
                src="./assets/img/restorative-treatments.jpg"
                alt="city img 4"
                className="city_image"
              />
              <h6>restorative-treatments</h6>
            </div>
          </div>
          <div className="second_row">
            <div className="cities_single sr_img_1 pointer">
              <img
                src="./assets/img/orthodontics.jpg"
                alt="city img 5"
                className="city_image"
              />

              <h6>Orthodontics</h6>
            </div>
            <div className="cities_single sr_img_2 pointer">
              <img
                src="./assets/img/prosthodontics.webp"
                alt="city img 7"
                className="city_image"
              />
              <h6>Prosthodontics</h6>
            </div>
          </div>
        </div>
      </section>

      <FooterUpper />
    </div>
  );
};

export default Services;
