import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEOHelmet from "../../components/SEOHelmet ";
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";

// component
import Hero from "../../components/Hero";
import "../../components/Blog.css";
import './Blog.scss'

const PGBlogs1 = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end
  const navigate = useNavigate();
  const { documents: blogDoc, error: blogDocError } = useCollection("blogs");
  return (
    <div className="blog_page blog_page_css">
      {/* <SEOHelmet title="Privacy Policy | Propdial - Comprehensive Property Management Services" description="Learn how Propdial, a leading property management company in India, collects, uses, and safeguards your data. Our Privacy Policy ensures transparency and compliance."
    og_description="Learn how Propdial, a leading property management company in India, collects, uses, and safeguards your data. Our Privacy Policy ensures transparency and compliance."
    og_title="Privacy Policy | Propdial - Comprehensive Property Management Services" />  */}
      {/* <BottomRightFixedIcon /> */}
      <Hero
        pageTitle="Propdial Blogs"
        pageSubTitle="Discover Our Blogs
        "
        heroImage="/assets/img/about_us_banner.jpg"
      ></Hero>
      <section className="blog_sect">
        <div className="container">
        {blogDoc && blogDoc.length === 0 && <p>Loading blogs...</p>}
          <div className="blog_inner relative">
          {blogDoc && blogDoc.map((blog) => (
            <div className="item card-container">
              <div className="card-image">
                <img src={blog.image.url}  />
              </div>
              <div className="card-body">
               
                <h3>
                 {blog.title}
                </h3>
                <p className="card-subtitle">
                {blog.subTitle}
                </p>
                <div className="card-author">
                  <img src="./assets/img/home/blog1.jpg" alt="author avatar" />
                  <div className="author-info">             
                    <Link
                      className="pointer"
                      to={`/blog/${blog.id}`}
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                        color: "var(--theme-green)",
                      }}
                    >
                      Read More
                    </Link>
                    <Link
                      className="pointer"
                      to={`/blog-edit/${blog.id}`}
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                        color: "var(--theme-green)",
                      }}
                    >
                      Edit
                    </Link>

                    
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PGBlogs1;
