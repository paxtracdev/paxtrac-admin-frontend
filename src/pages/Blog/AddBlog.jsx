import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";

const AddBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Draft");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = () => {
    if (!title.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }

    Swal.fire("Success", "Blog created successfully", "success").then(() =>
      navigate("/blogs")
    );
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Add New Blog</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <input
            className="form-control mb-3"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className="form-select mb-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Draft</option>
            <option>Published</option>
          </select>

          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Blog Image</label>
            <input type="file" className="form-control" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="mt-3 rounded"
                style={{ width: "250px", height: "150px", objectFit: "cover" }}
              />
            )}
          </div>

          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            init={{ height: 300, menubar: false }}
            onEditorChange={(v) => setContent(v)}
          />

          <div className="mt-4 d-flex gap-3">
            <button className="button-secondary" onClick={() => navigate("/blogs")}>
              Cancel
            </button>
            <button className="primary-button" onClick={handleCreate}>
              Create Blog
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AddBlog;
