import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import { useCreateContractadMutation } from "../../api/userApi";
import { cleanHtmlContent } from "../../utils/cleanHtml";

const AddContract = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [createContractad, { isLoading }] = useCreateContractadMutation();

  const handleCreate = async () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    if (!content.trim()) newErrors.content = "Content cannot be empty.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const sanitized = cleanHtmlContent(content.trim());
      await createContractad({
        content: sanitized,
        contractForm: title.trim(),
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
        text: err?.data?.message || err?.message || "Failed to create contract",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">Add New Contract</div>
            <p className="title-sub-heading">Create a new legal contract form</p>
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div className="mb-3">
            <label className="form-label fw-semibold">Contract Title</label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              placeholder="e.g. Master Services Agreement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <div className="text-danger mt-1">{errors.title}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Contract Content</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={content}
              init={{
                height: 480,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "table",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | removeformat code fullscreen",
                content_style: ` 
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; }
                  ::selection {
                    background: #a99068 !important;
                    color: #fff !important;
                  } `,
              }}
              onEditorChange={(v) => setContent(v)}
            />
            {errors.content && (
              <div className="text-danger mt-1">{errors.content}</div>
            )}
          </div>

          <div className="d-flex gap-3 mt-4">
            <button
              className="button-secondary"
              onClick={() => navigate("/contracts")}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="primary-button card-btn"
              onClick={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Contract"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AddContract;
