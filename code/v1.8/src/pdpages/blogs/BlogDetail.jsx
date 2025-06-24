import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import "./blogdetail.scss";
import { useAuthContext } from "../../hooks/useAuthContext";
import { format } from "date-fns";

const loaderStyle = {
  border: "8px solid #f3f3f3",
  borderTop: "8px solid #3498db",
  borderRadius: "50%",
  width: "80px",
  height: "80px",
  animation: "spin 1s linear infinite",
};

const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const BlogDetail = () => {
  const { slug } = useParams();

  // Extract id from slug using regex or split
  const location = useLocation();
  const id = location.state?.id;
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const doc = await projectFirestore.collection("blogs").doc(id).get();
        if (doc.exists) {
          setBlog({ id: doc.id, ...doc.data() });
        }

        const snapshot = await projectFirestore.collection("blogs").get();
        const blogs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRelatedBlogs(blogs);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  // If still loading, return null
  if (loading) {
    return null;
  }

  // If loading is complete but no blog is found, display fallback message.
  if (!blog) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          color: "#fff",
        }}
      >
        <p style={{ fontSize: "18px" }}>Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="top_header_pg pg_bg pgblogdetail">
      <div className="blog-detail-wrapper page_spacing pg_min_height">
        <div className="blog-detail-main">
          {/* Blog Image Container with Edit button rendered only when logged in */}
          <div
            className="blog-image-container"
            style={{ position: "relative" }}
          >
            <img src={blog.image.url} alt={blog.title} className="blog-image" />
            {user &&
              (user.role === "admin" ||
                user.role === "superAdmin") && (
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

          <div className="blog-box">
            <div className="title-container">
              <h1 className="blog-title">{blog.title}</h1>
            
            </div>
            <div className="blog-content">
              <h2 className="blog-subtitle">{blog.subTitle}</h2>
              <div
                className="blog-text"
                style={{ lineHeight: "1", fontSize: "1.4rem" }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </div>

        <div className="blog-detail-sidebar">
          <h3 className="sidebar-title">Related Blogs</h3>
          <div className="related-cards">
            {relatedBlogs.map((rblog) => {
              const slug = rblog.slug
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");

              return (
                <Link
                  key={rblog.id}
                  to={`/blog/${slug}`}
                  state={{ id: rblog.id }}
                >
                  <div
                    className={`related-card ${
                      rblog.id === id ? "selected" : ""
                    }`}
                  >
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

      {/* Floating Add Blog Button, visible only when logged in */}
      {user &&
        user.status === "active" &&
        (user.role === "admin" ||
          user.role === "superAdmin") && (
          <Link to="/add-blog" className="property-list-add-property ">
            <span className="material-symbols-outlined">add</span>
          </Link>
        )}

      <style>{`
        ${spinnerKeyframes}
        /* Edit button styles positioned at the top right of the image container */
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
