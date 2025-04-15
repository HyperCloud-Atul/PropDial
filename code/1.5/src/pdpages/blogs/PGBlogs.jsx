import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Hero from "../../components/Hero";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../components/Blog.css";
import "./Blog.scss";

const PGBlogs1 = () => {
  const location = useLocation();
  const { documents: blogDoc } = useCollection("blogs");
  const { user } = useAuthContext();

  // Log the user for debugging
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("User object:", user);
  }, [location, user]);

  const canAddBlog = !!(user && user.uid);

  return (
    <div className="blog_page blog_page_css">
      {/* Hero Section */}
      <div className="blog_head">
        <Hero
          pageTitle="Propdial Blogs"
          pageSubTitle="Discover Our Blogs"
          heroImage="/assets/img/home/blog5.jpeg"
        />
      </div>

      {/* Blog List */}
      <section className="blog_sect">
        <div className="container">
          {!blogDoc && <p>Loading blogs...</p>}
          <div className="blog_inner relative">
            {blogDoc &&
              blogDoc.map((blog) => (
                <div key={blog.id} className="item card-container">
                  <div className="card-image">
                    <Link to={`/blog/${blog.id}`}>
                      <img src={blog.image.url} alt={blog.title} />
                    </Link>
                    {user && (
                      <div className="author-right">
                        <Link className="edit" to={`/blog-edit/${blog.id}`}>
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <h3>{blog.title}</h3>
                    <p className="card-subtitle">{blog.subTitle}</p>
                  </div>
                  <div className="card-author">
                    <div className="author-left">
                      <Link className="read-more" to={`/blog/${blog.id}`}>
                        Learn More <span className="arrow">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Floating Add Blog Button (visible only if logged in) */}
      {canAddBlog && (
        <div className="action-buttons">
          <Link className="add-blog-btn-circle" to="/add-blog" title="Add Blog">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="bi bi-patch-plus"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"
              />
              <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z"
              />
            </svg>
          </Link>
        </div>
      )}

      {/* Inline styles for floating button positioning and general styling */}
      <style>{`
        .action-buttons {
          display: flex;
          justify-content: center;
          margin: 30px auto 10px;
        }
        .add-blog-btn-circle {
          position: fixed;
          bottom: 20px;
          right: 40px; /* Adjust to move left from the extreme right */
          background-color: rgb(18, 146, 146);
          border: 1px solid #006666;
          color: #fff;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease;
          z-index: 1000;
        }
        .add-blog-btn-circle:hover {
          background-color: #006666;
        }
      `}</style>
    </div>
  );
};

export default PGBlogs1;
