import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import { addBlogItem } from "./BlogMockData";
import defaultBlogImg from "../../assets/images/blogimg.png";

const AddBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Property Management");
  const [status, setStatus] = useState("Published");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(defaultBlogImg);

  // Errors state
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Heading is required.";
    if (!description.trim()) newErrors.description = "Content cannot be empty.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      addBlogItem({
        title,
        category,
        status,
        author: "Admin Panel",
        excerpt: description.replace(/<[^>]*>/g, "").slice(0, 120) + "...",
        description,
        image: imagePreview,
      });

      Swal.fire({
        title: "Success",
        text: "Blog created successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      }).then(() => navigate("/blogs"));
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to create blog",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Add New Blog</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          {/* Row 1: Heading & Category */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Blog Heading</label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                placeholder="Enter blog heading"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <div className="text-danger mt-1">{errors.title}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Property Management">Property Management</option>
                <option value="Real Estate Trends">Real Estate Trends</option>
                <option value="Tips & Guides">Tips & Guides</option>
                <option value="Announcements">Announcements</option>
              </select>
            </div>
          </div>

          {/* Row 2: Status & Image */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Featured Image</label>
              <div className="d-flex align-items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded border"
                  style={{ width: "90px", height: "60px", objectFit: "cover" }}
                />
                <label className="primary-button card-btn mb-0 cursor-pointer">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Description Editor */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              init={{ height: 320, menubar: false }}
              onEditorChange={(v) => setDescription(v)}
            />
            {errors.description && (
              <div className="text-danger mt-1">{errors.description}</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 d-flex gap-3">
            <button
              className="button-secondary"
              onClick={() => navigate("/blogs")}
            >
              Cancel
            </button>
            <button className="primary-button" onClick={handleCreate}>
              Save
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AddBlog;
