import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import {
  useGetPrivacyPolicyQuery,
  useGetTermsAndConditionsQuery,
  useUpdatePageContentMutation,
} from "../../api/cmsApi";

const CMSView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Receive data from CMS table (View/Edit button)
  const cmsItem = location.state?.cmsItem;

  // Detect page type
  const isPrivacy = cmsItem?.title?.toLowerCase().includes("privacy");
  const isTerms = cmsItem?.title?.toLowerCase().includes("terms");

  const { data: privacyData } = useGetPrivacyPolicyQuery(undefined, {
    skip: !isPrivacy,
  });

  const { data: termsData } = useGetTermsAndConditionsQuery(undefined, {
    skip: !isTerms,
  });

  const [updatePageContent, { isLoading: isUpdating }] =
    useUpdatePageContentMutation();

  // Redirect if user lands directly without item
  useEffect(() => {
    if (!cmsItem) {
      navigate("/cms");
    }
  }, [cmsItem, navigate]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (privacyData?.data && isPrivacy) {
      setTitle(privacyData.data.title);
      setSlug("privacy-policy");
      setContent(privacyData.data.content);
    }

    if (termsData?.data && isTerms) {
      setTitle(termsData.data.title);
      setSlug("terms-and-conditions");
      setContent(termsData.data.content);
    }
  }, [privacyData, termsData, isPrivacy, isTerms]);

  const handleSave = async () => {
    if (!content.trim()) {
      Swal.fire("Error", "Content cannot be empty", "error");
      return;
    }

    try {
      const pageId = isPrivacy ? privacyData.data.id : termsData.data.id;

      await updatePageContent({
        id: pageId,
        content,
      }).unwrap();

      Swal.fire({
        title: "Success",
        text: "CMS page updated successfully",
        icon: "success",
        confirmButtonColor: "#166fff",
      });

      navigate("/cms");
    } catch (error) {
      Swal.fire("Error", "Failed to update page", "error");
    }
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* Header */}
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
            {/* <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Slug Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="auto-generated-slug"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
              />
            </div> */}
          </div>

          {/* TinyMCE Editor */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Page Content</label>
            <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
  value={content}
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
