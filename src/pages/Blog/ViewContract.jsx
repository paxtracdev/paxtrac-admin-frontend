import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import CustomDropdown from "../../Components/CustomDropdown";
import defaultImage from "../../assets/images/businessImg3.png";
import { Pencil } from "lucide-react";

const ViewContract = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const contract = state?.contract;

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {}, [navigate]);

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
      text: "Contract updated successfully",
      icon: "success",
      confirmButtonColor: "#a99068", // custom confirm button color
    }).then(() => navigate("/contracts"));
  };

  const statusOptions = [
    { label: "Draft", value: "Draft" },
    { label: "Published", value: "Published" },
  ];

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Edit Contract</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          {/* Title */}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Contract Title</label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                placeholder="Enter contract title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <div className="text-danger mt-1">{errors.title}</div>
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
              onClick={() => navigate("/contracts")}
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

export default ViewContract;
