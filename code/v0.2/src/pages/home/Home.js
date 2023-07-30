import React from "react";

import Banner from "../../Components/Banner";
import OffersForAgents from "../../Components/OffersForAgents";
import TopCitiesInIndia from "../../Components/TopCitiesInIndia";
import CollapsibleGroup from "../../Components/CollapsibleGroup";
import Footer from "../../Components/Footer";
const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <TopCitiesInIndia />
      <OffersForAgents />
      <CollapsibleGroup />
      <Footer></Footer>
    </div>
  );
};

export default Home;
