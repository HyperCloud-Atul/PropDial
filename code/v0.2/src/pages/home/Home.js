import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Banner from "../../Components/Banner";
import OffersForAgents from "../../Components/OffersForAgents";
import TopCitiesInIndia from "../../Components/TopCitiesInIndia";
import CollapsibleGroup from "../../Components/CollapsibleGroup";
import Footer from "../../Components/Footer";
import CircularProgressBar from "../../Components/CircularProgressBar";
import NumberCounter from "../../Components/NumberCounter";
import "./Home.css"
const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <TopCitiesInIndia />
      <CircularProgressBar />
      <OffersForAgents />
      <section className="perfect_layout sect_padding">
        <div className="container">
          <div className="section_title">
            <h3>
              APARTMENT PLAN
            </h3>
            <div class="section_title_effect">
              APARTMENT PLAN
            </div>
          </div>
          <div className="section_sub_titiel">
            <h4>The Perfect Layouts</h4>
          </div>
          <div className="tabs">
            <Tabs>
              <TabList>
                <Tab>STUDIO APARTMENT</Tab>
                <Tab>
                  PENTHOUSES</Tab>
                <Tab>
                  3 BEDROOMS</Tab>
                <Tab>
                  2 BEDROOMS</Tab>
                <Tab>
                  1 BEDROOM</Tab>
              </TabList>

              <TabPanel>
                <h2>Any content 1</h2>
              </TabPanel>
              <TabPanel>
                <h2>Any content 2</h2>
              </TabPanel>
              <TabPanel>
                <h2>Any content 3</h2>
              </TabPanel>
              <TabPanel>
                <h2>Any content 4</h2>
              </TabPanel>
              <TabPanel>
                <h2>Any content 5</h2>
              </TabPanel>
            </Tabs>
          </div>

        </div>
      </section>
      <CollapsibleGroup />
      <NumberCounter />
      <Footer></Footer>
    </div>
  );
};

export default Home;
