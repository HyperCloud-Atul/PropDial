import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import { Link } from "react-router-dom";
import "./Blog.scss";
import { useAuthContext } from "../../hooks/useAuthContext";

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
  const { id } = useParams();
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

  const canAddBlog = !!(user && user.uid);

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
    <>
      <div className="blog-detail-wrapper">
        <div className="blog-detail-main">
          {/* Blog Image Container with Edit button positioned on top-right */}
          <div className="blog-image-container" style={{ position: "relative" }}>
            <img src={blog.image.url} alt={blog.title} className="blog-image" />
            <div className="author-right">
              <Link className="edit" to={`/blog-edit/${blog.id}`}>
                Edit
              </Link>
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
            {relatedBlogs.map((rblog) => (
              <Link to={`/blog/${rblog.id}`} key={rblog.id}>
                <div className={`related-card ${rblog.id === id ? "selected" : ""}`}>
                  <div className="related-card-image">
                    <img src={rblog.image.url} alt={rblog.title} />
                  </div>
                  <div className="related-card-info">
                    <p>{rblog.title.substring(0, 125)}... </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Add Blog Button at bottom right moved a bit left */}
      {canAddBlog && (
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
            <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z" />
          </svg>
        </Link>
      )}

      <style>{`
        ${spinnerKeyframes}

        /* Floating Add Blog Button Styles */
        .add-blog-btn-circle {
          position: fixed;
          bottom: 20px;
          right: 40px; /* Moved from 20px to 40px to shift left */
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
    </>
  );
};

export default BlogDetail;
