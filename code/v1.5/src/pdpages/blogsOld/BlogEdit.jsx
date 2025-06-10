import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RichTextEditor from "react-rte";
import imageCompression from "browser-image-compression";
import {
  projectStorage,
  projectFirestore,
  timestamp,
} from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { FaPlus, FaTrash, FaRetweet } from "react-icons/fa";
import { min } from "date-fns";

const BlogEdit = () => {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState(""); // Sub Title state added
  const [altText, setAltText] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(RichTextEditor.createEmptyValue());
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Fetch the blog data
    const fetchBlog = async () => {
      try {
        const doc = await projectFirestore.collection("blogs").doc(id).get();
        if (doc.exists) {
          const blogData = doc.data();
          setTitle(blogData.title);
          setSubTitle(blogData.subTitle || ""); // Set subTitle if available
          setAltText(blogData.altText);
          setMetaTitle(blogData.metaTitle);
          setMetaDescription(blogData.metaDescription);
          setSlug(blogData.slug);
          setContent(RichTextEditor.createValueFromString(blogData.content, "html"));
          setImage(blogData.image);
        } else {
          alert("Blog not found.");
          navigate("/blogs"); // Redirect if blog doesn't exist
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const storageRef = projectStorage.ref(`blog_images/${compressedFile.name}`);
      const uploadTask = storageRef.put(compressedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image:", error);
          setIsUploading(false);
        },
        async () => {
          try {
            const url = await storageRef.getDownloadURL();
            setImage({ url, name: compressedFile.name });
          } catch (error) {
            console.error("Error getting download URL:", error);
          } finally {
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error("Image compression error:", error);
      setIsUploading(false);
    }
  };

  const handleImageDelete = async () => {
    if (!image) return;
    const storageRef = projectStorage.ref(`blog_images/${image.name}`);
    try {
      await storageRef.delete();
      setImage(null);
      alert("Image deleted successfully.");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !subTitle || // Ensure subTitle is filled
      !altText ||
      !metaTitle ||
      !metaDescription ||
      !slug ||
      !content.toString("html") ||
      !image
    ) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    const updatedData = {
      title,
      subTitle, // Include subTitle
      altText,
      metaTitle,
      metaDescription,
      slug,
      content: content.toString("html"),
      image,
      updatedAt: timestamp.fromDate(new Date()),
      updatedBy: user.uid,
    };

    try {
      await projectFirestore.collection("blogs").doc(id).update(updatedData);
      alert("Blog updated successfully!");
      navigate("/blogs"); // Redirect after update
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Error updating blog. Please try again.");
    }
  };

  return (
    <div className="top_header_pg pg_bg" style={{ padding: "20px", background: "#f7f9fc" }}>
      <div className="page_spacing pg_min_height container" style={{ marginTop: "40px" }}>
        <h2 className="m22 text_blue text-center mb-4">Edit Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="aai_form add_inspection_pg">
            <div className="row row_gap_20">
              <div className="col-md-6 mb-3">
                {/* Image Upload and Preview Section */}
                <div
                  style={{
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid rgba(3, 70, 135, 0.22)",
                    background: "white",
                    height: "100%",
                  }}
                >
                  <h6
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      marginBottom: "10px",
                      color: "var(--theme-blue)",
                    }}
                  >
                    Upload image*
                  </h6>
                  {isUploading && <p>Uploading... {uploadProgress.toFixed(2)}%</p>}
                  <div className="add_and_images">
                    {image && (
                      <div className="uploaded_images relative">
                        <img
                          src={image.url}
                          alt={image.name}
                          style={{ width: "100%", borderRadius: "4px", marginBottom: "10px" }}
                        />
                        <div className="trash_icon" style={{ cursor: "pointer", textAlign: "center" }}>
                          <FaTrash size={14} color="red" onClick={handleImageDelete} />
                        </div>
                      </div>
                    )}
                    <div>
                      <div
                        onClick={() => document.getElementById("imageUpload").click()}
                        className="add_icon"
                        style={{ cursor: "pointer" }}
                      >
                        {image && image.url ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <FaRetweet size={24} color="#555" />
                            <h6 style={{ fontSize: "12px", fontWeight: "400", marginTop: "5px" }}>
                              Replace Image
                            </h6>
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <FaPlus size={24} color="#555" />
                            <h6 style={{ fontSize: "12px", fontWeight: "400", marginTop: "5px" }}>
                              Add Image
                            </h6>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                {/* Image Alt Field */}
                <div
                  className="form_field w-100"
                  style={{
                    padding: "15px",
                    borderRadius: "5px",
                    border: "1px solid rgba(3, 70, 135, 0.22)",
                    background: "white",
                    marginBottom: "15px",
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "10px", color: "var(--theme-blue)" }}>
                    Image Alt*
                  </h6>
                  <div className="field_box">
                    <input
                      className="w-100"
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      required
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </div>
                </div>
                {/* Meta Title Field */}
                <div
                  className="form_field w-100"
                  style={{
                    padding: "15px",
                    marginTop: "15px",
                    borderRadius: "5px",
                    border: "1px solid rgba(3, 70, 135, 0.22)",
                    background: "white",
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "10px", color: "var(--theme-blue)" }}>
                    Meta Title*
                  </h6>
                  <div className="field_box">
                    <input
                      className="w-100"
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      required
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row: Title and Slug fields side by side */}
            <div className="row row_gap_20">
              {/* Title Field */}
              <div className="col-md-6 mb-3">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgba(3, 70, 135, 0.22)",
                    background: "white",
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "10px", color: "var(--theme-blue)" }}>
                    Title*
                  </h6>
                  <div className="field_box">
                    <input
                      className="w-100"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </div>
                </div>
              </div>
              {/* Slug Field */}
              <div className="col-md-6 mb-3">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgba(3, 70, 135, 0.22)",
                    background: "white",
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "10px", color: "var(--theme-blue)" }}>
                    Slug*
                  </h6>
                  <div className="field_box">
                    <input
                      className="w-100"
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* New Row: Sub Title Field (full-width) */}
            <div className="row" style={{ marginTop: "15px" }}>
              <div className="col-12 mb-3">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgba(3, 70, 135, 0.22)",
                    background: "white",
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "10px", color: "var(--theme-blue)" }}>
                    Sub Title*
                  </h6>
                  <div className="field_box">
                    <input
                      className="w-100"
                      type="text"
                      value={subTitle}
                      onChange={(e) => setSubTitle(e.target.value)}
                      required
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* New Row: Meta Description Field (full-width) */}
            <div className="row" style={{ marginTop: "15px" }}>
              <div className="col-12 mb-3">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgba(3, 70, 135, 0.22)",
                    background: "white",
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "10px", color: "var(--theme-blue)" }}>
                    Meta Description*
                  </h6>
                  <div className="field_box">
                    <textarea
                      className="w-100"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      required
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        minHeight: "80px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* New Row: Content Editor (full-width) with increased gap */}
            <div className="row" style={{ marginTop: "30px" }}>
              <div className="col-12 mb-3">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgba(3, 70, 135, 0.22)",
                    background: "white",
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "10px", color: "var(--theme-blue)" }}>
                    Content*
                  </h6>
                  <div className="field_box">
                    <RichTextEditor
                      style={{ minHeight: "200px", borderRadius: "4px" }}
                      value={content}
                      onChange={setContent}
                      placeholder="Write your blog content here..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
                className="bottom_fixed_button"
               
              >
                <div className="next_btn_back">
                  <button
                    type="button"
                    className="theme_btn btn_border w-100 text-center no_icon"
                    onClick={() => navigate(-1)}                 
                  >
                  View 
                  </button>
                <button
            type="submit"
            disabled={isUploading}
            className="theme_btn btn_fill w-100 text-center no_icon"
       
          >
            Update Blog
          </button>
                </div>
              </div>
        
        </form>
      </div>
      <style>{`
        .update-blog-btn {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .update-blog-btn:hover {
          background: #006666;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default BlogEdit;
