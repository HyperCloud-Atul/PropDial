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

const BlogEdit = () => {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [subTitle, setSubTitle] = useState("");
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
          setAltText(blogData.altText);
          setSubTitle(blogData.subTitle);
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
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !altText ||
      !subTitle ||
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
      subTitle,
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
    <div className="top_header_pg pg_bg">
      <div className="page_spacing pg_min_height">
        <h2 className="m22 text_blue text-center mb-2">Edit Blog</h2>
        <form onSubmit={handleUpdate}>
          <div className="aai_form add_inspection_pg">
            <div className="row row_gap_20">
              {/* Image Upload Section */}
              <div className="col-md-6">
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgb(3 70 135 / 22%)",
                    background: "white",
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
                    Upload image*
                  </h6>
                  {isUploading && <p>Uploading... {uploadProgress.toFixed(2)}%</p>}
                  <div className="add_and_images">
                    {image && (
                      <div className="uploaded_images relative">
                        <img src={image.url} alt={image.name} />
                        <div className="trash_icon">
                          <FaTrash size={14} color="red" onClick={handleImageDelete} />
                        </div>
                      </div>
                    )}
                    <div>
                      <div
                        onClick={() => document.getElementById("imageUpload").click()}
                        className="add_icon"
                      >
                        {image && image.url ? (
                          <div className="d-flex align-items-center" style={{ flexDirection: "column" }}>
                            <FaRetweet size={24} color="#555" />
                            <h6 style={{ fontSize: "12px", fontWeight: "400", marginTop: "5px" }}>Replace Image</h6>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center" style={{ flexDirection: "column" }}>
                            <FaPlus size={24} color="#555" />
                            <h6 style={{ fontSize: "12px", fontWeight: "400", marginTop: "5px" }}>Add Image</h6>
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

              {/* Input fields for title, subtitle, etc. */}
              <div className="col-md-6">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgb(3 70 135 / 22%)",
                    background: "white",
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
                    Title*
                  </h6>
                  <div className="field_box">
                    <input
                      className="w-100"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Add similar sections for other fields like subtitle, meta title, meta description, etc. */}

              {/* Content Editor */}
              <div className="col-md-12">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgb(3 70 135 / 22%)",
                    background: "white",
                  }}
                >
                  <h6 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "8px", color: "var(--theme-blue)" }}>
                    Content*
                  </h6>
                  <RichTextEditor value={content} onChange={setContent} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Update Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEdit;
