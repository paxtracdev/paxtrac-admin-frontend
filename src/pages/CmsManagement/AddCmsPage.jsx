import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import { useCreatePageMutation } from "../../api/cmsApi";
import { cleanHtmlContent } from "../../utils/cleanHtml";

const AddCmsPage = () => {
  const navigate = useNavigate();
  const [createPage, { isLoading: isCreating }] = useCreatePageMutation();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  // Auto-generate slug
  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Swal.fire("Error", "Page title cannot be empty", "error");
      return;
    }

    if (!slug.trim()) {
      Swal.fire("Error", "Slug cannot be empty", "error");
      return;
    }

    const cleanedContent = cleanHtmlContent(content.trim());
    if (!cleanedContent) {
      Swal.fire("Error", "Page content cannot be empty", "error");
      return;
    }

    try {
      const res = await createPage({
        title: title.trim(),
        slug: slug.trim(),
        content: cleanedContent,
      }).unwrap();

      Swal.fire({
        title: "Page Created",
        text: res?.message || "CMS page added successfully!",
        icon: "success",
        confirmButtonColor: "#a99068",
      }).then(() => {
        navigate("/policies");
      });
    } catch (err) {
      console.error("Failed to create CMS page:", err);
      Swal.fire(
        "Error",
        err?.data?.message || err?.message || "Failed to create CMS page. Please try again.",
        "error"
      );
    }
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* Header */}
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">Add New CMS Page</div>
            <p className="title-sub-heading">Create a new CMS page</p>
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div className="row">
            {/* Page Title */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Page Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter page title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(generateSlug(e.target.value));
                }}
              />
            </div>

            {/* Slug Field */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Slug Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="auto-generated-slug"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
              />
            </div>
          </div>

          {/* TinyMCE Editor */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Page Content</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              initialValue=""
              init={{
                height: 350,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste help wordcount",
                ],
                toolbar:
                  "undo redo | bold italic underline | alignleft aligncenter alignright |" +
                  " bullist numlist outdent indent | link | preview fullscreen",
              }}
              onEditorChange={(newValue) => setContent(newValue)}
            />
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3 mt-4">
            <button
              className="button-secondary"
              onClick={() => navigate("/policies")}
            >
              Cancel
            </button>

            <button
              className="primary-button card-btn"
              onClick={handleCreate}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Page"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AddCmsPage;
