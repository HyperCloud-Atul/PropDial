import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";

const BlogDetail = () => {
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

  if (!blog) {
    return <p>Loading blog details...</p>;
  }

  return (
    <div className="top_header_pg">
      <div className="container">
        <div className="page_spacing">
          {blog && (
            <div className="blog_detail_pg">
<img src={blog.image.url} className="w-100" />
<h1 className="text-3xl font-bold">{blog.title}</h1>
<h2 className="text-xl text-gray-600 mb-4">{blog.subTitle}</h2>
<div
        className="text-gray-800"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
            </div>
            
          )}
          
        </div>
      </div>
     
     
    
    </div>
  );
};

export default BlogDetail;
