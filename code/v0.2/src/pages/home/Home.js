import React from "react";

import Banner from "../../Components/Banner";
import OffersForAgents from "../../Components/OffersForAgents";
import TopCitiesInIndia from "../../Components/TopCitiesInIndia";
import CollapsibleGroup from "../../Components/CollapsibleGroup";
import Footer from "../../Components/Footer";
import CircularProgressBar from "../../Components/CircularProgressBar";
import NumberCounter from "../../Components/NumberCounter";
const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <TopCitiesInIndia />
      <CircularProgressBar />
      <OffersForAgents />
      <CollapsibleGroup />
      <NumberCounter />
      <Footer></Footer>
    </div>
  );
};

export default Home;
