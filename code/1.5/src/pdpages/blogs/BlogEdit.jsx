import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { projectFirestore } from "../../firebase/config";

const BlogEdit = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const doc = await projectFirestore.collection("blogs").doc(id).get();
      if (doc.exists) {
        setBlog(doc.data());
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (field, value) => {
    setBlog({ ...blog, [field]: value });
  };

  const handleSave = async () => {
    try {
      await projectFirestore.collection("blogs").doc(id).update(blog);
      alert("Blog updated successfully!");
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  if (!blog) {
    return <p>Loading blog for editing...</p>;
  }

  return (
    <div className="flex p-4">
      {/* Left Side: Live Preview */}
      <div className="w-1/2 p-4 bg-gray-100 rounded shadow-md mr-4">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
        <h2 className="text-xl text-gray-600 mb-4">{blog.subtitle}</h2>
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="mb-4 w-full max-w-lg"
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </div>

      {/* Right Side: Form */}
      <div className="w-1/2 p-4 bg-white rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
        <input
          type="text"
          value={blog.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Title"
        />
        <input
          type="text"
          value={blog.subtitle}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Subtitle"
        />
        <ReactQuill
          theme="snow"
          value={blog.content}
          onChange={(value) => handleChange("content", value)}
          className="mb-4"
        />
        <button onClick={handleSave} className="btn btn-success">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default BlogEdit;
