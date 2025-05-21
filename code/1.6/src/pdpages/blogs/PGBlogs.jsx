import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Hero from "../../components/Hero";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../components/Blog.css";
import { format } from "date-fns";
import "./Blog.scss";

const PGBlogs1 = () => {
  const location = useLocation();
  const { documents: blogDoc } = useCollection("blogs");
  const { user } = useAuthContext();

  // Scroll to top and log the user for debugging
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("User object:", user);
  }, [location, user]);

  // ✅ Slug Generator (Handles empty title case)
  const generateSlug = (title) => {
    if (!title || title.trim() === "") return `/blog/untitled`;
    return (
      `/blog/` +
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  };

  return (
    <div className="blog_page blog_page_css">
      {/* Hero Section */}
      <div className="blog_head">
        <Hero
          pageTitle="Propdial Blogs"
          pageSubTitle="Discover Our Blogs"
          heroImage="/assets/img/blog-head-img.jpg"
        />
      </div>

      {/* Blog List */}
      <section className="blog_sect">
        <div className="container">
          {!blogDoc && <p>Loading blogs...</p>}
          <div className="blog_inner relative">
            {blogDoc &&
              blogDoc.map((blog) => {
                const blogUrl = generateSlug(blog.slug, blog.id);
                return (
                  <div key={blog.id} className="item card-container">
                    <div className="card-image">
                      <Link to={blogUrl} state={{ id: blog.id }}>
                        <img src={blog.image.url} alt={blog.title} />
                        <div className="published_date">
                          {blog.updatedAt?.toDate
                            ? format(blog.updatedAt.toDate(), "dd-MMM-yyyy")
                            : format(blog.createdAt.toDate(), "dd-MMM-yyyy")}
                        </div>
                      </Link>

                      {user &&
                        (user.role === "admin" ||
                          user.role === "superAdmin" ||
                          user.role === "executive") && (
                          <div className="author-right">
                            <Link className="edit" to={`/blog-edit/${blog.id}`}>
                              Edit
                            </Link>
                          </div>
                        )}
                    </div>

                    <Link
                      className="card-body"
                      to={blogUrl}
                      state={{ id: blog.id }}
                    >
                      <h3>{blog.title}</h3>
                      <p className="card-subtitle">{blog.subTitle}</p>
                    </Link>

                    <div className="card-author">
                      <div className="author-left">
                        <Link
                          className="read-more"
                          to={blogUrl}
                          state={{ id: blog.id }}
                        >
                          Read More <span className="arrow">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Floating Add Blog Button */}
      {user &&
        user.status === "active" &&
        (user.role === "admin" ||
          user.role === "superAdmin" ||
          user.role === "executive") && (
          <Link to="/add-blog" className="property-list-add-property ">
            <span className="material-symbols-outlined">add</span>
          </Link>
        )}
    </div>
  );
};

export default PGBlogs1;
