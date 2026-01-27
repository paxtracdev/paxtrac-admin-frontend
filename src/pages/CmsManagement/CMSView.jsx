import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";

const CMSView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cmsItem = location.state?.cmsItem;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!cmsItem) {
      navigate("/cms");
      return;
    }

    setTitle(cmsItem.title);
    setContent(cmsItem.content);
  }, [cmsItem, navigate]);

  const handleSave = () => {
    if (!content.trim()) {
      Swal.fire("Error", "Content cannot be empty", "error");
      return;
    }

    Swal.fire({
      title: "Success",
      text: "CMS page updated successfully (static)",
      icon: "success",
      confirmButtonColor: "#166fff",
    });

    navigate("/cms");
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">
              {title ? `CMS: ${title}` : "CMS Page"}
            </div>
            <p className="title-sub-heading">
              View or update CMS page content
            </p>
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div className="mb-3">
            <label className="form-label fw-semibold">Page Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Page Content</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={content}
              init={{
                height: 350,
                menubar: false,
                plugins:
                  "advlist autolink lists link image charmap preview fullscreen",
                toolbar:
                  "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | preview fullscreen",
              }}
              onEditorChange={(value) => setContent(value)}
            />
          </div>

          <div className="d-flex gap-3 mt-4">
            <button
              className="button-secondary"
              onClick={() => navigate("/cms")}
            >
              Cancel
            </button>
            <button className="primary-button card-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CMSView;
