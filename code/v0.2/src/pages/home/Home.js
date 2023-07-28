import React from "react";

import Banner from "../../Components/Banner";
import OffersForAgents from "../../Components/OffersForAgents";
import TopCitiesInIndia from "../../Components/TopCitiesInIndia";
import CollapsibleGroup from "../../Components/CollapsibleGroup";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <TopCitiesInIndia />
      <OffersForAgents />
      <CollapsibleGroup />
    </div>
  );
};

export default Home;
