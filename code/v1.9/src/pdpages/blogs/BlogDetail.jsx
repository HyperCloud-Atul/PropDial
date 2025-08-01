import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import "./blogdetail.scss";
import { useAuthContext } from "../../hooks/useAuthContext";
import { format } from "date-fns";

// Utility: Generate slug from title
const generateSlug = (title) => {
  if (!title || title.trim() === "") return "untitled";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all blogs
        const snapshot = await projectFirestore.collection("blogs").get();
        const blogs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Find the blog matching the slug
        const matchedBlog = blogs.find((b) => generateSlug(b.slug || b.title) === slug);
        setBlog(matchedBlog);
        setRelatedBlogs(blogs);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "#fff",
      }}>
        <div style={{
          border: "8px solid #f3f3f3",
          borderTop: "8px solid #3498db",
          borderRadius: "50%",
          width: "80px",
          height: "80px",
          animation: "spin 1s linear infinite"
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "#fff",
      }}>
        <p style={{ fontSize: "18px" }}>Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="top_header_pg pg_bg pgblogdetail">
      <div className="blog-detail-wrapper page_spacing pg_min_height">
        <div className="blog-detail-main">
          {/* Blog Image */}
          <div className="blog-image-container" style={{ position: "relative" }}>
            <img src={blog.image.url} alt={blog.title} className="blog-image" />

            {user && ["frontdesk", "admin", "superAdmin"].includes(user.role) && (
              <div className="author-right">
                <Link className="edit" to={`/blog-edit/${blog.id}`}>
                  Edit
                </Link>
              </div>
            )}

            <div className="published_date">
              {blog.updatedAt?.toDate
                ? format(blog.updatedAt.toDate(), "dd-MMM-yyyy")
                : format(blog.createdAt.toDate(), "dd-MMM-yyyy")}
            </div>
          </div>

          {/* Blog Content */}
          <div className="blog-box">
            <div className="title-container">
              <h1 className="blog-title">{blog.title}</h1>
            </div>
            <div className="blog-content">
              <h2 className="blog-subtitle">{blog.subTitle}</h2>
              <div
                className="blog-text"
                style={{ lineHeight: "1.6", fontSize: "1.4rem" }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </div>

        {/* Related Blogs */}
        <div className="blog-detail-sidebar">
          <h3 className="sidebar-title">Related Blogs</h3>
          <div className="related-cards">
            {relatedBlogs.map((rblog) => {
              const blogSlug = generateSlug(rblog.slug || rblog.title);
              return (
                <Link key={rblog.id} to={`/blog/${blogSlug}`}>
                  <div className={`related-card ${rblog.id === blog.id ? "selected" : ""}`}>
                    <div className="related-card-image">
                      <img src={rblog.image.url} alt={rblog.title} />
                    </div>
                    <div className="related-card-info">
                      <p>{rblog.title.substring(0, 125)}...</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Blog Floating Button */}
      {user &&
        user.status === "active" &&
        ["frontdesk", "admin", "superAdmin"].includes(user.role) && (
          <Link to="/add-blog" className="property-list-add-property">
            <span className="material-symbols-outlined">add</span>
          </Link>
        )}

      <style>{`
        .author-right {
          position: absolute;
          top: 10px;
          right: 10px;
        }

        .author-right .edit {
          display: inline-block;
          background-color: rgba(0, 0, 0, 0.6);
          color: #fff;
          padding: 6px 12px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.9rem;
          transition: background-color 0.3s ease;
        }

        .author-right .edit:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
