import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import {
  useGetPageBySlugQuery,
  useUpdatePageBySlugMutation,
} from "../../api/cmsApi";
import { LoadingComponent } from "../../Components/LoadingComponent";
import { cleanHtmlContent } from "../../utils/cleanHtml";

const CMSView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cmsItem = location.state?.cmsItem;
  const pageType = cmsItem?.name; // "privacy-policy", "terms-of-service", "join-us", etc.

  const formatTitle = (name, rawTitle) => {
    if (name === "privacy-policy") return "Privacy Policy";
    if (
      name === "terms-of-service" ||
      name === "terms-of-use" ||
      name === "term-of-use" ||
      (rawTitle && rawTitle.toLowerCase().includes("terms"))
    ) {
      return "Terms of Use";
    }
    if (name === "join-us") return "Join Us";
    if (rawTitle && rawTitle.trim()) return rawTitle.trim();
    return name
      ? name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
      : "CMS Page";
  };

  const [title, setTitle] = useState(
    cmsItem?.title || formatTitle(pageType, cmsItem?.title)
  );
  const [content, setContent] = useState(cleanHtmlContent(cmsItem?.description || ""));

  // Fetch freshest data from server for this page slug
  const { data: pageData, isLoading } = useGetPageBySlugQuery(pageType, {
    skip: !pageType,
  });
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageBySlugMutation();

  useEffect(() => {
    if (!pageType) {
      navigate("/policies");
      return;
    }

    if (pageData?.data) {
      if (pageData.data.title) {
        setTitle(pageData.data.title);
      } else {
        setTitle(formatTitle(pageType, cmsItem?.title));
      }
      setContent(cleanHtmlContent(pageData.data.description || ""));
    } else if (cmsItem) {
      setTitle(cmsItem.title || formatTitle(pageType, cmsItem.title));
      if (cmsItem.description && !content) {
        setContent(cleanHtmlContent(cmsItem.description));
      }
    }
  }, [pageType, pageData, cmsItem, navigate]);

  const handleSave = async () => {
    const cleaned = cleanHtmlContent(content.trim());
    if (!cleaned) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Content cannot be empty",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    try {
      await updatePage({
        slug: pageType,
        title: title.trim(),
        description: cleaned,
      }).unwrap();

      Swal.fire({
        title: "Success",
        text: "CMS page updated successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      });
      navigate("/policies");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || err?.message || "Failed to update CMS page",
        confirmButtonColor: "#a99068",
      });
    }
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">
              {title ? `CMS: ${title}` : "CMS Page"}
            </div>
            <p className="title-sub-heading">View or update CMS page content</p>
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          {isLoading && !content ? (
            <LoadingComponent isLoading fullScreen />
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold">Page Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter page title"
                  value={title}
                  disabled
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Page Content</label>
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
                  onEditorChange={(value) => setContent(value)}
                />
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  className="button-secondary"
                  onClick={() => navigate("/policies")}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  className="primary-button card-btn"
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default CMSView;
