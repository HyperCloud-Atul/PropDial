import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

// Importing images
import propertyCardImage from "../../assets/img/PropertyCard1.jpg";
import MarketCardImage from "../../assets/img/MarketCard1.jpg";
import TechCardImage from "../../assets/img/TechCard1.webp";
import LifestyleCardImage from "../../assets/img/LifestyleCard1.jpg";
import TravelCardImage from "../../assets/img/TravelCard1.jpg";

const PGBlogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || {};

  // Fallback: If no post is provided, show a message with a back button.
  if (!post) {
    return (
      <div className="no-post">
        <h2>Oops! No post found.</h2>
        <button className="back-button" onClick={() => navigate("/blog")}>
          Back to Blogs
        </button>
      </div>
    );
  }

  // Expanded blog content for each category
  const expandedContent = {
    "Property": `
      <h3>🏡 Sustainable Property Management in 2024</h3>
      <p>The real estate industry is rapidly adopting <b>eco-friendly</b> solutions. With growing concerns about climate change, property managers are now using cutting-edge techniques to minimize environmental impact.</p>
      <ul>
        <li>🌞 <b>Solar energy</b> installations reducing power costs.</li>
        <li>💧 Advanced water-saving technologies and sustainable design.</li>
        <li>🏗️ Smart automation to optimize energy usage.</li>
      </ul>
      <p>Embracing sustainability <b>lowers costs</b> and <b>increases property value</b>, making buildings more attractive to modern buyers and tenants.</p>
    `,
    "Market": `
      <h3>📊 Real Estate Market Trends for 2024</h3>
      <p>The market is evolving with <b>rising interest rates</b> and a shift toward suburban properties. Investors and buyers are adapting to new economic realities.</p>
      <ul>
        <li>🏡 Strong demand for rental properties.</li>
        <li>📉 Economic shifts affecting property values in major cities.</li>
        <li>🚀 Increased focus on technology-driven investments.</li>
      </ul>
      <p>Smart urban planning and digital property assets are key for long-term success in this evolving market.</p>
    `,
    "Tech": `
      <h3>🤖 AI & Technology in Property Management</h3>
      <p>Innovations in technology are transforming property management, making it more efficient and secure.</p>
      <ul>
        <li>🔍 AI-powered valuation and pricing models.</li>
        <li>📜 Blockchain-powered smart contracts for secure transactions.</li>
        <li>🏠 Virtual and augmented reality for immersive property tours.</li>
      </ul>
      <p>These advancements streamline operations and improve tenant satisfaction.</p>
    `,
    "Lifestyle": `
      <h3>🌿 Lifestyle Trends in 2024</h3>
      <p>Modern lifestyles emphasize wellness, minimalism, and sustainability. Homebuyers are looking for spaces that enhance quality of life.</p>
      <ul>
        <li>🏡 Minimalist and smart home designs.</li>
        <li>🧘 Wellness-focused communities with dedicated spaces.</li>
        <li>🌍 Eco-conscious living with green roofs and urban gardens.</li>
      </ul>
      <p>The future is about simplicity, efficiency, and creating a harmonious living environment.</p>
    `,
    "Travel": `
      <h3>✈️ Top Travel Destinations for 2024</h3>
      <p>Discover breathtaking destinations that offer both adventure and relaxation.</p>
      <ul>
        <li>🏝️ Bali – Stunning beaches and spiritual retreats.</li>
        <li>🗻 Japan – A unique blend of ancient culture and modern innovation.</li>
        <li>🌿 Iceland – Witness the aurora borealis and dramatic landscapes.</li>
      </ul>
      <p>Travel responsibly and enjoy experiences that enrich your life while preserving the environment.</p>
    `
  };

  // All posts data (simulate blog listing)
  const allPosts = [
    { id: 1, category: "Property", title: "Sustainable Property Management", image: propertyCardImage, posted: "3 days ago" },
    { id: 2, category: "Market", title: "Real Estate Market Predictions", image: MarketCardImage, posted: "1 day ago" },
    { id: 3, category: "Tech", title: "Digital Tools for Property Management", image: TechCardImage, posted: "6 hours ago" },
    { id: 4, category: "Lifestyle", title: "New Lifestyle Trends 2024", image: LifestyleCardImage, posted: "12 hours ago" },
    { id: 5, category: "Travel", title: "Top Travel Destinations 2024", image: TravelCardImage, posted: "8 hours ago" },
  ];

  // Filter out the selected post for the sidebar
  const otherPosts = allPosts.filter((p) => p.id !== post.id);

  return (
    <div className="details-page">
      <button className="close-btn" onClick={() => navigate("/blog")}>×</button>
      <div className="main-container">
        {/* Left Column: Selected Blog Details */}
        <div className="left-column">
          <div className="hero-section" style={{ backgroundImage: `url(${post.image})` }}>
            <div className="hero-overlay">
              <h1 className="hero-title">{post.title}</h1>
            </div>
          </div>
          <div className="detail-content">
            <div dangerouslySetInnerHTML={{ __html: expandedContent[post.category] }} />
          </div>
        </div>

        {/* Right Column: Scrollable Sidebar with Other Posts */}
        <div className="right-column">
          <h3>Related Blogs</h3>
          <div className="card-list">
            {otherPosts.map((item) => (
              <div key={item.id} className="card">
                <img src={item.image} alt={item.title} className="card-thumb" />
                <p className="card-title">{item.title}</p>
                <p className="card-category">{item.category}</p>
                <p className="card-posted">{item.posted}</p>
                <Link to="/blogdetails" state={{ post: item }} className="read-more">
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .details-page {
          font-family: "Poppins", sans-serif;
          padding: 2rem;
          background: #f4f4f9;
          /* Extra top padding to avoid overlap if header is fixed */
          padding-top: 80px;
        }
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: transparent;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #fff;
          z-index: 10;
        }
        .main-container {
          display: flex;
          gap: 2rem;
          max-width: 1100px;
          margin: auto;
          align-items: stretch;
        }
        /* Left Column Styles */
        .left-column {
          flex: 2;
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
        }
        .hero-section {
          height: 300px;
          background-size: cover;
          background-position: center;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .hero-overlay {
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-title {
          color: #fff;
          font-size: 2.5rem;
          text-align: center;
          margin: 0;
          padding: 0 1rem;
        }
        .detail-content {
          flex-grow: 1;
          font-size: 1.2rem;
          line-height: 1.8;
          padding: 1rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        /* Right Column Styles */
        .right-column {
          flex: 1;
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          max-height: 80vh;
          overflow-y: auto;
        }
        .right-column h3 {
          text-align: center;
          margin-top: 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid #ddd;
        }
        .card-list {
          display: flex;
          flex-direction: column;
          gap: 15px; /* Mild spacing between cards */
          padding-top: 1rem;
        }
        .card {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: 0.3s;
        }
        .card:hover {
          background: #e0e0e0;
          transform: scale(1.02);
        }
        .card-thumb {
          width: 100%;
          border-radius: 4px;
          object-fit: cover;
        }
        .card-title {
          font-size: 0.9rem;
          margin: 0.5rem 0 0;
          text-align: center;
          color: #555;
        }
        .card-category,
        .card-posted {
          font-size: 0.8rem;
          color: #888;
          margin: 0.2rem 0;
          text-align: center;
        }
        .read-more {
          display: block;
          text-align: center;
          margin-top: 0.5rem;
          text-decoration: underline;
          color: #ffcc00;
          font-weight: bold;
        }
        /* Mobile Styles */
        @media screen and (max-width: 768px) {
          .main-container {
            flex-direction: column;
          }
          .right-column {
            max-height: none;
            overflow-y: visible;
            margin-top: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PGBlogDetails;
