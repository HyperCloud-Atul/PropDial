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

  // If no post is found, display a fallback message
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

  // Expanded blog content with better styling
  const expandedContent = {
    "Property": `
      <h3>🏡 Sustainable Property Management in 2024</h3>
      <p>With growing concerns about <b>climate change</b>, the real estate industry is rapidly adopting <b>eco-friendly</b> solutions.</p>
      <ul>
        <li>🌞 <b>Solar energy</b> & green building materials.</li>
        <li>💧 Water-saving technologies & sustainable architecture.</li>
        <li>🏗️ Smart home automation to reduce energy consumption.</li>
      </ul>
      <p>Embracing sustainability <b>lowers costs</b>, <b>increases property value</b>, and makes buildings more attractive to modern buyers.</p>
    `,
    "Market": `
      <h3>📊 Real Estate Market Trends for 2024</h3>
      <p>The real estate market is evolving with <b>rising interest rates</b> and <b>increased demand</b> for suburban properties.</p>
      <ul>
        <li>🏡 <b>High demand</b> for rental properties.</li>
        <li>📉 <b>Economic shifts</b> impacting urban areas.</li>
        <li>🚀 <b>Technology-driven investments</b> on the rise.</li>
      </ul>
      <p>For investors, focusing on <b>smart urban planning</b> and <b>digital property assets</b> is key for success.</p>
    `,
    "Tech": `
      <h3>🤖 AI & Technology in Property Management</h3>
      <p>Technology is transforming real estate with <b>AI-driven analytics</b>, <b>blockchain transactions</b>, and <b>virtual property tours</b>.</p>
      <ul>
        <li>🔍 AI-based <b>property valuation</b> and pricing tools.</li>
        <li>📜 Smart contracts for <b>secure real estate transactions</b>.</li>
        <li>🏠 Virtual & Augmented Reality for immersive property tours.</li>
      </ul>
      <p>Technology is making real estate <b>faster, safer, and more accessible</b>.</p>
    `,
    "Lifestyle": `
      <h3>🌿 Lifestyle Trends in 2024</h3>
      <p>People are now prioritizing <b>wellness, smart living, and sustainability</b> in their lifestyle choices.</p>
      <ul>
        <li>🏡 <b>Minimalist & smart homes</b> are gaining popularity.</li>
        <li>🧘 Wellness-focused communities with gyms & parks.</li>
        <li>🌍 Eco-conscious living with green roofs & urban gardens.</li>
      </ul>
      <p>The future of lifestyle is about <b>simplicity, efficiency, and sustainability</b>.</p>
    `,
    "Travel": `
      <h3>✈️ Top Travel Destinations for 2024</h3>
      <p>Discover the world's most breathtaking destinations for <b>adventure & relaxation</b>.</p>
      <ul>
        <li>🏝️ Bali - Stunning beaches & spiritual retreats.</li>
        <li>🗻 Japan - A blend of <b>ancient culture & high-tech cities</b>.</li>
        <li>🌿 Iceland - Witness the <b>aurora borealis</b> & breathtaking landscapes.</li>
      </ul>
      <p>🌍 Travel responsibly and embrace <b>eco-friendly tourism</b>.</p>
    `
  };

  // Filtering out the selected post to display other blog posts in the sidebar
  const allPosts = [
    { id: 1, category: "Property", title: "Sustainable Property Management", image: propertyCardImage, posted: "3 days ago" },
    { id: 2, category: "Market", title: "Real Estate Market Predictions", image: MarketCardImage, posted: "1 day ago" },
    { id: 3, category: "Tech", title: "Digital Tools for Property Management", image: TechCardImage, posted: "6 hours ago" },
    { id: 4, category: "Lifestyle", title: "New Lifestyle Trends 2024", image: LifestyleCardImage, posted: "12 hours ago" },
    { id: 5, category: "Travel", title: "Top Travel Destinations 2024", image: TravelCardImage, posted: "8 hours ago" },
  ];

  const otherPosts = allPosts.filter((p) => p.id !== post.id);

  return (
    <div className="details-page">
      <button className="close-btn" onClick={() => navigate("/blog")}>×</button>

      <div className="main-container">
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

        <div className="right-column">
          <h3>Related Blogs</h3>
          <div className="card-list">
            {otherPosts.map((item) => (
              <div key={item.id} className="card">
                <img src={item.image} alt={item.title} className="card-thumb" />
                <p className="card-title">{item.title}</p>
                <p className="card-category">{item.category}</p>
                <p className="card-posted">{item.posted}</p>
                <Link to="/pgblogdetails" state={{ post: item }} className="read-more">Read More</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .details-page { font-family: 'Poppins', sans-serif; padding: 2rem; background: #f4f4f9; }
        .main-container { display: flex; gap: 2rem; max-width: 1100px; margin: auto; align-items: stretch; }
        .left-column { flex: 2; background: #fff; padding: 2rem; border-radius: 8px; display: flex; flex-direction: column; }
        .right-column { flex: 1; background: #fff; padding: 1rem; border-radius: 8px; height: auto; max-height: 100vh; overflow-y: auto; }
        .hero-section { height: 300px; background-size: cover; border-radius: 8px; }
        .hero-title { color: #fff; font-size: 2.5rem; }
        .detail-content { font-size: 1.2rem; line-height: 1.8; flex-grow: 1; }
        .card-list .card { padding: 1rem; border-radius: 6px; background: #f9f9f9; transition: 0.3s; }
        .card:hover { background: #e0e0e0; transform: scale(1.02); }
      `}</style>
    </div>
  );
};

export default PGBlogDetails;
