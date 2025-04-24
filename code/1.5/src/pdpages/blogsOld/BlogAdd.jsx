import React, { useState } from "react";
import RichTextEditor from "react-rte"; // Import react-rte
import imageCompression from "browser-image-compression";
import {
  projectStorage,
  projectFirestore,
  timestamp,
} from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { FaPlus, FaTrash, FaRetweet } from "react-icons/fa";

const AddBlog = () => {
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(RichTextEditor.createEmptyValue());
  const [image, setImage] = useState(null); // Single image
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Image Compression Settings
      const options = {
        maxSizeMB: 0.2, // Maximum size 200KB
        maxWidthOrHeight: 1024, // Resize if necessary
        useWebWorker: true,
      };

      // Compress Image
      const compressedFile = await imageCompression(file, options);

      // Upload to Firebase Storage
      const storageRef = projectStorage.ref(
        `blog_images/${compressedFile.name}`
      );
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
            setImage({ url, name: compressedFile.name }); // Save the uploaded image
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

    const blogData = {
      title,
      subTitle,
      altText,
      metaTitle,
      metaDescription,
      slug,
      content: content.toString("html"),
      image, // Single image
      createdAt: timestamp.fromDate(new Date()),
      createdBy: user.uid,
    };

    try {
      await projectFirestore.collection("blogs").add(blogData);
      alert("Blog added successfully!");
      // Reset Form
      setTitle("");
      setAltText("");
      setSubTitle("");
      setMetaTitle("");
      setMetaDescription("");
      setSlug("");
      setContent(RichTextEditor.createEmptyValue());
      setImage(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error adding blog:", error);
      alert("Error adding blog. Please try again.");
    }
  };

  return (
    <div className="top_header_pg pg_bg">
      <div className="page_spacing pg_min_height">
        <h2 className="m22 text_blue text-center mb-2">Add New Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="aai_form add_inspection_pg ">
            <div className="row row_gap_20">
              <div className="col-md-6">
                {/* Image Upload and Preview Section */}
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgb(3 70 135 / 22%)",
                    background: "white",
                  }}
                >
                  <h6
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--theme-blue)",
                    }}
                  >
                    Upload image*{" "}
                  </h6>
                  {isUploading && (
                    <p>Uploading... {uploadProgress.toFixed(2)}%</p>
                  )}
                  <div className="add_and_images">
                    {image && (
                      <div className="uploaded_images relative">
                        <img src={image.url} alt={image.name} />

                        <div className="trash_icon">
                          <FaTrash
                            size={14}
                            color="red"
                            onClick={handleImageDelete}
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <div
                        onClick={() =>
                          document.getElementById("imageUpload").click()
                        }
                        className="add_icon"
                      >
                        {image && image.url ? (
                          <div
                            className="d-flex align-items-center"
                            style={{
                              flexDirection: "column",
                            }}
                          >
                            <FaRetweet size={24} color="#555" />
                            <h6
                              style={{
                                fontSize: "12px",
                                fontWeight: "400",
                                marginTop: "5px",
                              }}
                            >
                              Replace Image
                            </h6>
                          </div>
                        ) : (
                          <div
                            className="d-flex align-items-center"
                            style={{
                              flexDirection: "column",
                            }}
                          >
                            <FaPlus size={24} color="#555" />
                            <h6
                              style={{
                                fontSize: "12px",
                                fontWeight: "400",
                                marginTop: "5px",
                              }}
                            >
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
                  <h6
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--theme-blue)",
                    }}
                  >
                    Image Alt*
                  </h6>
                  <div className="field_box">
                    <input
                      className="w-100"
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
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
                  <h6
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--theme-blue)",
                    }}
                  >
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
                  <h6
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--theme-blue)",
                    }}
                  >
                    Sub Title*
                  </h6>
                  <div className="field_box">
                    <input
                      className="w-100"
                      type="text"
                      value={subTitle}
                      onChange={(e) => setSubTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
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
                  <h6
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--theme-blue)",
                    }}
                  >
                    Slug*
                  </h6>
                  <div className="field_box">
                    <input
                      className="w-100"
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
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
                  <h6
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--theme-blue)",
                    }}
                  >
                    Meta Title*
                  </h6>
                  <div className="field_box">
                    <input
                      className="w-100"
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgb(3 70 135 / 22%)",
                    background: "white",
                  }}
                >
                  <h6
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--theme-blue)",
                    }}
                  >
                    Meta Description*
                  </h6>
                  <div className="field_box">
                    <textarea
                      className="w-100"
                      type="text"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div
                  className="form_field w-100"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid rgb(3 70 135 / 22%)",
                    background: "white",
                  }}
                >
                  <h6
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--theme-blue)",
                    }}
                  >
                    Content*
                  </h6>
                  <div className="field_box">
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Write your blog content here..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="vg22"></div>
          <button type="submit" disabled={isUploading} className="theme_btn btn_fill w-100 text-center no_icon">
            Add Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
