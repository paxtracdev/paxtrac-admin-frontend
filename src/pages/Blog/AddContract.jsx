import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import CustomDropdown from "../../Components/CustomDropdown";
import defaultImage from "../../assets/images/blogimg.png";
import { Pencil, Trash2 } from "lucide-react";
import { useCreateContractadMutation } from "../../api/userApi";
const AddContract = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Draft");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(defaultImage);

  // Errors state
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const [createContractad, { isLoading }] = useCreateContractadMutation();
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(defaultImage);
  };

  const statusOptions = [
    { label: "Draft", value: "Draft" },
    { label: "Published", value: "Published" },
  ];

  const handleCreate = async () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    // if (!status) newErrors.status = "Status is required.";
    if (!content.trim()) newErrors.content = "Content cannot be empty.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    try {
      await createContractad({
        content,
        contractForm: title,
      }).unwrap();

      Swal.fire({
        title: "Success",
        text: "Contract created successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      }).then(() => navigate("/contracts"));
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.data?.message || "Failed to create contract",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Add New Contract</div>
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

            {/* Status */}
            {/* <div className="col-md-6 mb-3">
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
            </div> */}
          </div>

          {/* Content */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Content</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
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
            <button className="primary-button" onClick={handleCreate}>
              
              Save
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AddContract;
