import React from "react";
import "./Services.css";
import Grid from '@mui/material/Grid';

const Services = () => {
  return (
    <>
    <section className="Services-parent">
    <h2>Why Choose Us</h2>
    <hr style={{width: "10rem",margin: "auto",BackgroundColor: "orange",border: "none"}} />
      <Grid item container xs={12}>
        <Grid item lg={4} sm={6} xs={12}>
            <div className="service-card">
                <h1>Happy and Satisfied Customers</h1>
                <p>We have a very happy customer base with a high retention rate of more than 80%, one of the highest across industry.</p>
            </div>
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
           <div className="service-card">
                <h1>Competitive Pricing</h1>
                <p>Propdial offers one of the best pricing for this service across the industry, without compromising on the quality of the service offered.</p>
            </div>
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
           <div className="service-card">
                <h1>Technology At Forefront</h1>
                <p>Propdial leverages technology to make the process of property management very smooth and efficient, with minimal effort required by the property owners.</p>
            </div>
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
           <div className="service-card">
                <h1>Full Transparency</h1>
                <p>Every step of the property management from tenant onboarding to property inspection and maintenance is documented and updated online immediately.</p>
            </div>
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
           <div className="service-card">
                <h1>Experienced Co-Founders</h1>
                <p>The co-founders including the core team have decades of experience in the property management space and thus are well equipped to solve customer pain points.</p>
            </div>
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
           <div className="service-card">
                <h1>Our Wide Network</h1>
                <p>Our extensive network of offline brokers and vast reach across multiple online platforms will ensure that you get the best clients without much delay.</p>
            </div>
        </Grid>
      </Grid>
    </section>
    </>
  );
};

export default Services;