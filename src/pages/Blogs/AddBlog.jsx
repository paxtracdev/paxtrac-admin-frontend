import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomDropdown from "../../Components/CustomDropdown";
import ManageCategoriesModal from "./ManageCategoriesModal";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import {
  useCreateBlogMutation,
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
} from "../../api/blogApi";

const AddBlog = () => {
  const navigate = useNavigate();

  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const { data: catResponse } = useGetBlogCategoriesQuery();
  const [createBlogCategory] = useCreateBlogCategoryMutation();

  const categories = catResponse?.data || [];

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Published");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const handleAddNewCategory = async () => {
    const { value: categoryName } = await Swal.fire({
      title: "Create New Category",
      input: "text",
      inputPlaceholder: "Enter category name...",
      showCancelButton: true,
      confirmButtonText: "Create",
      confirmButtonColor: "#a99068",
      cancelButtonColor: "#6c757d",
      inputValidator: (value) => {
        if (!value?.trim()) {
          return "Category name cannot be empty";
        }
      },
    });

    if (categoryName?.trim()) {
      try {
        const res = await createBlogCategory({ name: categoryName.trim() }).unwrap();
        const createdName = res?.data?.name || categoryName.trim();
        setCategory(createdName);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: `Category "${createdName}" created successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.data?.message || "Failed to create category",
          confirmButtonColor: "#a99068",
        });
      }
    }
  };

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
      const formData = new FormData();
      formData.append("heading", title.trim());
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("status", status);
      formData.append("content", description);
      formData.append("description", description);
      const plainText = description.replace(/<[^>]*>/g, " ").trim();
      formData.append("excerpt", plainText.slice(0, 140) + "...");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createBlog(formData).unwrap();

      Swal.fire({
        title: "Success",
        text: "Blog created successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      }).then(() => navigate("/blogs"));
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.data?.message || "Failed to create blog",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  const categoryOptions = [
    ...categories.map((cat) => ({ label: cat.name, value: cat.name })),
  ];

  if (category && !categoryOptions.some((opt) => opt.value === category)) {
    categoryOptions.push({ label: category, value: category });
  }

  categoryOptions.push({ label: "+ Add new category...", value: "__NEW__" });
  categoryOptions.push({ label: "⚙ Manage categories...", value: "__MANAGE__" });

  const statusOptions = [
    { label: "Published", value: "Published" },
    { label: "Draft", value: "Draft" },
  ];

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
              <CustomDropdown
                options={categoryOptions}
                placeholder="Select category"
                value={category}
                onChange={(val) => {
                  if (val === "__NEW__") {
                    handleAddNewCategory();
                  } else if (val === "__MANAGE__") {
                    setIsCatModalOpen(true);
                  } else {
                    setCategory(val);
                  }
                }}
              />
            </div>
          </div>

          {/* Row 2: Status & Image */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Status</label>
              <CustomDropdown
                options={statusOptions}
                placeholder="Select status"
                value={status}
                onChange={(val) => setStatus(val)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Featured Image</label>
              <div className="d-flex align-items-center gap-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded border"
                    style={{ width: "90px", height: "60px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded border d-flex align-items-center justify-content-center text-muted"
                    style={{
                      width: "90px",
                      height: "60px",
                      backgroundColor: "#f8fafc",
                      fontSize: "12px",
                      borderStyle: "dashed",
                    }}
                  >
                    No Image
                  </div>
                )}
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

        <ManageCategoriesModal
          isOpen={isCatModalOpen}
          onClose={() => setIsCatModalOpen(false)}
        />
      </section>
    </main>
  );
};

export default AddBlog;
