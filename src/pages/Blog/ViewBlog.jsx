import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import CustomDropdown from "../../Components/CustomDropdown";
import defaultImage from "../../assets/images/businessImg3.png";
import { Pencil } from "lucide-react";

const ViewBlog = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const blog = state?.blog;

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(blog?.image || defaultImage);

  // Validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!blog) navigate("/blogs");
    else {
      setTitle(blog.title);
      setStatus(blog.status);
      setContent(blog.content);
    }
  }, [blog, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(defaultImage);
  };

  const handleSave = () => {
    // Reset errors
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!status) newErrors.status = "Status is required.";
    if (!content.trim()) newErrors.content = "Content cannot be empty.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    Swal.fire({
      title: "Success",
      text: "Blog updated successfully",
      icon: "success",
      confirmButtonColor: "#a99068", // custom confirm button color
    }).then(() => navigate("/blogs"));
  };

  const statusOptions = [
    { label: "Draft", value: "Draft" },
    { label: "Published", value: "Published" },
  ];

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Edit Blog</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Blog Image</label>

            <div className="image-wrapper position-relative">
              <img src={imagePreview} alt="Blog" className="blog-image" />

              <label className="image-action edit-icon">
                <Pencil size={18} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Blog Title</label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                placeholder="Enter blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <div className="text-danger mt-1">{errors.title}</div>
              )}
            </div>

            {/* Status */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Status</label>
              <CustomDropdown
                options={statusOptions}
                placeholder="Select status"
                value={status}
                onChange={(val) => setStatus(val)}
              />
              {errors.status && (
                <div className="text-danger mt-1">{errors.status}</div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Content</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={content}
              init={{ height: 300, menubar: false }}
              onEditorChange={(v) => setContent(v)}
            />
            {errors.content && (
              <div className="text-danger mt-1">{errors.content}</div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-4 d-flex gap-3">
            <button
              className="button-secondary"
              onClick={() => navigate("/blogs")}
            >
              Cancel
            </button>
            <button className="primary-button" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewBlog;
