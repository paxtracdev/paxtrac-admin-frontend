import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import { getBlogById, updateBlogItem } from "./BlogMockData";
import defaultBlogImg from "../../assets/images/blogimg.png";

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Property Management");
  const [status, setStatus] = useState("Published");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(defaultBlogImg);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const foundBlog = location.state?.blog || getBlogById(id);
    if (foundBlog) {
      setBlog(foundBlog);
      setTitle(foundBlog.title || "");
      setCategory(foundBlog.category || "Property Management");
      setStatus(foundBlog.status || "Published");
      setDescription(foundBlog.description || "");
      setImagePreview(foundBlog.image || defaultBlogImg);
    } else {
      Swal.fire("Error", "Blog post not found", "error").then(() => {
        navigate("/blogs");
      });
    }
  }, [id, location.state, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Heading is required.";
    if (!description.trim()) newErrors.description = "Content cannot be empty.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      updateBlogItem(id, {
        title,
        category,
        status,
        description,
        excerpt: description.replace(/<[^>]*>/g, "").slice(0, 120) + "...",
        image: imagePreview,
      });

      Swal.fire({
        title: "Success",
        text: "Blog updated successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      }).then(() => navigate("/blogs"));
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to update blog",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  if (!blog) return null;

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Edit Blog</div>
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
                  Change Image
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
              value={description}
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
            <button className="primary-button" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EditBlog;
