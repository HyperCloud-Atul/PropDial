import { Helmet } from "react-helmet";

const SEOHelmet = ({ title, description, og_description, og_title }) => {
  return (
    <Helmet>
      <title>{title || "Propdial - Property Management Services for Buy, Sell & Rent a Property in India"}</title>
      <meta
        name="description"
        content={description || "Propdial offers Property Management Services in India for Buy, Sell & Rent Services since last 10+ years in Delhi & NCR, Gurugram, Bangalore, Pune, Hyderabad, Mumbai, Dehradun and other major cities."}
      />
       <meta
        property="og:description"
        content={og_description || "Propdial offers Property Management Services in India for Buy, Sell & Rent Services since last 10+ years in Delhi & NCR, Gurugram, Bangalore, Pune, Hyderabad, Mumbai, Dehradun and other major cities."}
      />
       <meta
       property="og:title"
        content={og_title || "Propdial - Property Management Services for Buy, Sell & Rent a Property in India"}
      />
    </Helmet>
  );
};

export default SEOHelmet;

{/* <title>Propdial - Property Management Services for Buy, Sell & Rent a Property in India</title>
 <meta name="description"
 content="Propdial offers Property Management Services in India for Buy, Sell & Rent Services since last 10+ years in Delhi & NCR, Gurugram, Bangalore, Pune, Hyderabad, Mumbai, Dehradun and other major cities." />
 <meta property="og:title"
 content="Propdial - Property Management Services for Buy, Sell & Rent a Property in India" />
<meta property="og:description"
 content="Propdial offers Property Management Services in India for Buy, Sell & Rent Services since last 10+ years in Delhi & NCR, Gurugram, Bangalore, Pune, Hyderabad, Mumbai, Dehradun and other major cities." /> */}
