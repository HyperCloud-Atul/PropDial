import React from "react";

import Announcement from "../Components/Announcement";
import Navbar from "../Components/Navbar";
import Banner from "../Components/Banner";
import SearchBar from "../Components/SearchBar";
import TopCitiesInIndia from "../Components/TopCitiesInIndia";
import PropertyManagementServices from "../Components/PropertyManagementServices";
import AnimatedNumberCounter from "../Components/AnimatedNumberCounter.jsx";
import TopReasonsToChooseUs from "../Components/TopReasonsToChooseUs";
import AnimatedImages from "../Components/AnimatedImages";
import FounderSpeak from "../Components/FounderSpeak";
import MobileBottomMenu from "../Components/MobileBottomMenu";
import Footer from "../Components/Footer";
import PopupMessage from "../Components/PopupMessage";
const Home = () => {
  return (
    <div>
      <Announcement />
      <Navbar />
      <Banner />
      {/* <PopupMessage /> */}
      <SearchBar />
      <TopCitiesInIndia />
      <PropertyManagementServices />
      <AnimatedNumberCounter />
      <TopReasonsToChooseUs />
      <AnimatedImages />
      <FounderSpeak />
      <MobileBottomMenu />
      <Footer />
    </div>
  );
};

export default Home;
