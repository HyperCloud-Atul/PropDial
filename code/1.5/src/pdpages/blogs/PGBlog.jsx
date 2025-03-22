import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../../components/Hero';

// Import your images
import propertyBlogImage from '../../assets/img/property-blog.avif'; 
import propertyCardImage from '../../assets/img/PropertyCard1.jpg'; 
import MarketCardImage from '../../assets/img/MarketCard1.jpg'; 
import TechCardImage from '../../assets/img/TechCard1.webp';
import LifestyleCardImage from '../../assets/img/LifestyleCard1.jpg';
import TravelCardImage from '../../assets/img/TravelCard1.jpg';

// Comments Modal
const CommentsModal = ({ show, onClose, comments, blogTitle, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h3 className="modal-title">Comments on &ldquo;{blogTitle}&rdquo;</h3>
        <ul className="comments-list">
          {comments.map((comment, index) => (
            <li key={index} className="comment-item">
              <strong>{comment.author}:</strong> {comment.text}
            </li>
          ))}
        </ul>
        <form className="comment-form" onSubmit={handleSubmit}>
          <input 
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); } to { transform: scale(1); } }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.3s ease-in-out;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          animation: scaleIn 0.3s ease-in-out;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #333;
        }
        .modal-title {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
        }
        .comments-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem 0;
        }
        .comment-item {
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }
        .comment-form {
          display: flex;
          margin-top: 1rem;
        }
        .comment-form input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px 0 0 4px;
          font-size: 1rem;
        }
        .comment-form button {
          padding: 0.5rem 1rem;
          border: none;
          background: #007bff;
          color: #fff;
          cursor: pointer;
          font-size: 1rem;
          border-radius: 0 4px 4px 0;
        }
      `}</style>
    </div>
  );
};

const PGBlog = () => {
  // Helper function for dynamic image heights
  const getCardImageHeight = (category) => {
    switch (category) {
      case "Market":
        return "300px";
      // Add additional cases if needed
      default:
        return "250px";
    }
  };

  // Dummy post data arrays
  const initialPosts = [
    {
      id: 1,
      category: "Property",
      title: "Sustainable Property Management Practices for 2024",
      description:
        "Explore new frontier strategies and innovations to maximize property efficiency and occupant well-being.",
      posted: "3 days ago",
      fullContent:
        "Here is the full detail of Sustainable Property Management Practices for 2024. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      comments: [
        { author: "Alice", text: "Great post!" },
        { author: "Bob", text: "Very informative." },
      ],
      image: propertyCardImage,
    },
    {
      id: 2,
      category: "Market",
      title: "Real Estate Market Predictions for Q1 2024",
      description:
        "A look at how the real estate market may evolve in the first quarter of 2024, examining key economic indicators.",
      posted: "1 day ago",
      fullContent:
        "Full details about the Real Estate Market Predictions for Q1 2024. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      comments: [{ author: "Charlie", text: "Interesting insights." }],
      image: MarketCardImage,
    },
    {
      id: 3,
      category: "Tech",
      title: "Digital Tools for Modern Property Management",
      description:
        "Discover the latest software and digital solutions designed to streamline property management.",
      posted: "6 hours ago",
      fullContent:
        "Full content for Digital Tools for Modern Property Management. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      comments: [{ author: "Dave", text: "I love these tools!" }],
      image: TechCardImage,
    },
  ];

  const extraPosts = [
    {
      id: 4,
      category: "Lifestyle",
      title: "New Lifestyle Trends in 2024",
      description:
        "Explore the upcoming trends that are set to redefine lifestyles in 2024.",
      posted: "12 hours ago",
      fullContent:
        "Detailed insights into New Lifestyle Trends in 2024. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      comments: [{ author: "Eve", text: "Looks exciting!" }],
      image: LifestyleCardImage,
    },
    {
      id: 5,
      category: "Travel",
      title: "Top Travel Destinations for 2024",
      description:
        "Discover the most breathtaking travel destinations you should visit in 2024.",
      posted: "8 hours ago",
      fullContent:
        "An in-depth guide to Top Travel Destinations for 2024. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      comments: [{ author: "Frank", text: "Can't wait to travel!" }],
      image: TravelCardImage,
    },
  ];

  // Toggle to show or hide extra posts
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className="blogs">
      <Hero
        pageTitle="Blogs"
        pageSubTitle="Discover Blogs"
        heroImage={propertyBlogImage}
      />

      <section className="blog-section">
        <div className="blog-header">
          <h4>Latest Blogs</h4>
          {!showExtra && (
            <button className="see-all" onClick={() => setShowExtra(true)}>
              See All
            </button>
          )}
        </div>

        {/* First Row: Initial Posts */}
        <div className="card-container">
          {initialPosts.map((post) => (
            <div key={post.id} className="card">
              <div
                className="card-image"
                style={{
                  backgroundImage: `url(${post.image})`,
                  height: getCardImageHeight(post.category),
                }}
              />
              <div className="card-overlay">
                <span className="category-badge">{post.category}</span>
                <h4 className="card-title">{post.title}</h4>
                <p className="card-description">{post.description}</p>
                <div className="card-footer">
                  <span>{post.posted}</span>
                  <div className="footer-links">
                    {/* IMPORTANT: Use v6 syntax for passing 'post' */}
                    <Link
                      to="/pgblogdetails"
                      state={{ post }}
                      className="read-more"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row: Extra Posts */}
        {showExtra && (
          <div className="card-container extra">
            {extraPosts.map((post) => (
              <div key={post.id} className="card">
                <div
                  className="card-image"
                  style={{
                    backgroundImage: `url(${post.image})`,
                    height: getCardImageHeight(post.category),
                  }}
                />
                <div className="card-overlay">
                  <span className="category-badge">{post.category}</span>
                  <h4 className="card-title">{post.title}</h4>
                  <p className="card-description">{post.description}</p>
                  <div className="card-footer">
                    <span>{post.posted}</span>
                    <div className="footer-links">
                      <Link
                        to="/pgblogdetails"
                        state={{ post }}
                        className="read-more"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Comments Modal (not currently in use) */}
      <CommentsModal
        show={false}
        onClose={() => {}}
        comments={[]}
        blogTitle=""
        onAddComment={() => {}}
      />

      {/* Inline styles */}
      <style jsx>{`
        .blog-section {
          padding: 2rem;
          font-family: sans-serif;
        }
        .blog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .blog-header h4 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .see-all {
          background: #007bff;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .card-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          padding: 1rem 0;
        }
        .card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background-color: #eee;
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          min-height: 300px;
        }
        .card:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        .card-image {
          width: 100%;
          background-size: cover;
          background-position: center;
        }
        .card-overlay {
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 1rem;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .category-badge {
          background: #ff5a5f;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
          align-self: flex-start;
        }
        .card-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        .card-description {
          font-size: 0.95rem;
          opacity: 0.9;
          margin-bottom: 1rem;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1rem;
          font-weight: 500;
        }
        .footer-links {
          display: flex;
          gap: 1rem;
        }
        .read-more, .comments {
          cursor: pointer;
          text-decoration: underline;
          color: #ffcc00;
        }
      `}</style>
    </div>
  );
};

export default PGBlog;
