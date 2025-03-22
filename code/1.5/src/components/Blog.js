import React, { useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Link } from 'react-router-dom';
import "./Blog.css";

const Blog = () => {
  const [showExtra, setShowExtra] = useState(false);

  // Options for OwlCarousel
  const blogOptions = {
    items: 3,
    dots: false,
    loop: true,
    margin: 30,
    nav: false,
    smartSpeed: 1500,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      992: { items: 3 },
    },
  };

  // Cards for the main carousel (Property, Market, Tech)
  const mainCards = [
    {
      id: 1,
      image: "./assets/img/home/blog1.jpg",
      title: "Prop-tech Startup Propdial forays into 2nd home shared ownership space",
      subtitle: "Propdial, a Gurgaon based prop-tech startup that helps NRIs manage properties remotely...",
      link: "https://helloentrepreneurs.in/prop-tech-startup-propdial-forays-into-2nd-home-shared-ownership-space/",
      sourceImg: "./assets/img/home/blog_source1.webp",
    },
    {
      id: 2,
      image: "./assets/img/home/blog2.webp",
      title: "[Funding roundup] Cooby, Propdial, Oorjaa, Blue Tokai raise early-stage capital",
      subtitle: "Property management startup Propdial raises Rs 2 Cr as part of convertible debenture round...",
      link: "https://yourstory.com/2022/03/early-stage-funding-roundup-cooby-propdial-oorjaa-bluetokai-raise-capital",
      sourceImg: "./assets/img/home/blog_source2.svg",
    },
    {
      id: 3,
      image: "./assets/img/home/blog3.webp",
      title: "Property management company Propdial to expand to Mumbai, Chennai and Kolkata",
      subtitle: "Propdial is in talks to expand its operations as demand for property management rises...",
      link: "https://economictimes.indiatimes.com/industry/services/property-/-cstruction/property-management-company-propdial-to-expand-to-mumbai-chennai-and-kolkata/articleshow/85761366.cms",
      sourceImg: "./assets/img/home/blog_source3.png",
    },
  ];

  // Extra cards (Lifestyle and Travel)
  const extraCards = [
    {
      id: 4,
      image: "./assets/img/home/blog4.jpg",
      title: "THIS GURUGRAM-BASED STARTUP IS HELPING PROPERTY OWNERS REMOTELY MANAGE REAL ESTATE",
      subtitle: "Managing a property is no easy task, especially when you are sitting miles away...",
      link: "https://yourstory.com/2021/07/gurugram-startup-helps-property-owners-remotely-manage-real-estate",
      sourceImg: "./assets/img/home/blog_source2.svg",
    },
    {
      id: 5,
      image: "./assets/img/home/blog5.jpeg",
      title: "Housing.com dials into the property management services game, announces tie-up with Propdial",
      subtitle: "Housing.com partners with Propdial to expand its rental and property management services...",
      link: "https://bwdisrupt.businessworld.in/article/Housing-com-dials-into-the-property-management-services-game-announces-tie-up-with-Gurugram-based-Propdial/09-02-2021-375474/",
      sourceImg: "./assets/img/home/blog_source4.png",
    },
  ];

  return (
    <section className="blog_sect sect_padding">
      <div className="container">
        <div className="section_title">
          <h2 className="section_title_effect">News & Media</h2>
          <h3>Journeying Through Untold Stories and Hidden Reals</h3>
        </div>
        <div className="blog_inner relative">
          <OwlCarousel className="owl-theme" {...blogOptions}>
            {mainCards.map((card) => (
              <div key={card.id} className="item card-container">
                <div className="card-image">
                  <img src={card.image} alt={card.title} />
                </div>
                <div className="card-body">
                  <div className="blog_source">
                    <img src={card.sourceImg} alt="" />
                  </div>
                  <h3>{card.title}</h3>
                  <p className="card-subtitle">{card.subtitle}</p>
                  <div className="card-author">
                    <Link className="learn-more pointer" to={card.link} target="_blank" rel="noopener noreferrer">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </OwlCarousel>
          {!showExtra && (
            <button className="see-all-btn" onClick={() => setShowExtra(true)}>
              See All
            </button>
          )}
        </div>
        {showExtra && (
          <div className="extra-cards">
            {extraCards.map((card) => (
              <div key={card.id} className="item card-container">
                <div className="card-image">
                  <img src={card.image} alt={card.title} />
                </div>
                <div className="card-body">
                  <div className="blog_source">
                    <img src={card.sourceImg} alt="" />
                  </div>
                  <h3>{card.title}</h3>
                  <p className="card-subtitle">{card.subtitle}</p>
                  <div className="card-author">
                    <Link className="learn-more pointer" to={card.link} target="_blank" rel="noopener noreferrer">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        .blog_sect {
          padding: 4rem 0;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .section_title {
          text-align: center;
          margin-bottom: 2rem;
        }
        .section_title_effect {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .blog_inner {
          position: relative;
        }
        .see-all-btn {
          display: block;
          margin: 2rem auto 0;
          background: #007bff;
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
        .extra-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        .card-container {
          border: 1px solid #eee;
          border-radius: 6px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          margin: 0 0 1rem;
        }
        .card-image img {
          width: 100%;
          display: block;
          height: 200px;
          object-fit: cover;
        }
        .card-body {
          padding: 1rem;
        }
        .blog_source img {
          max-height: 40px;
          margin-bottom: 1rem;
        }
        .card-subtitle {
          color: #666;
          margin: 0.5rem 0 1rem;
        }
        .learn-more {
          color: #007bff;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
};

export default Blog;
