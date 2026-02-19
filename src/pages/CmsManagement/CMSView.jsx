import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import {
  useGetPrivacyPolicyQuery,
  useGetTermsOfServiceQuery,
  useUpdatePrivacyPolicyMutation,
  useUpdateTermsOfServiceMutation,
} from "../../api/cmsApi";
import { LoadingComponent } from "../../Components/LoadingComponent";
import NoData from "../../Components/NoData";

const CMSView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pageType = location.state?.cmsItem?.name; // "privacy-policy" or "terms-of-service"
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // API hooks
  const { data: privacyData } = useGetPrivacyPolicyQuery(undefined, {
    skip: pageType !== "privacy-policy",
  });
  const { data: termsData } = useGetTermsOfServiceQuery(undefined, {
    skip: pageType !== "terms-of-service",
  });
  const [updatePrivacyPolicy] = useUpdatePrivacyPolicyMutation();
  const [updateTermsOfService] = useUpdateTermsOfServiceMutation();

  useEffect(() => {
    if (!pageType) {
      navigate("/policies");
      return;
    }

    setTitle(
      pageType === "privacy-policy" ? "Privacy Policy" : "Terms of Service",
    );

    if (pageType === "privacy-policy" && privacyData?.data) {
      setContent(privacyData.data.description);
    } else if (pageType === "terms-of-service" && termsData?.data) {
      setContent(termsData.data.description);
    }
  }, [pageType, privacyData, termsData, navigate]);

  const handleSave = async () => {
    if (!content.trim()) {
      Swal.fire("Error", "Content cannot be empty", "error");
      return;
    }

    try {
      if (pageType === "privacy-policy") {
        await updatePrivacyPolicy({
          name: "privacy policy",
          description: content,
        }).unwrap();
      } else if (pageType === "terms-of-service") {
        await updateTermsOfService({
          name: "terms of service",
          description: content,
        }).unwrap();
      }

      Swal.fire({
        title: "Success",
        text: "CMS page updated successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      });
      navigate("/policies");
    } catch (err) {
      Swal.fire("Error", "Failed to update CMS page", "error");
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
          {(!privacyData && pageType === "privacy-policy") ||
          (!termsData && pageType === "terms-of-service") ? (
            <LoadingComponent isLoading fullScreen />
          ) : content ? (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold">Page Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter page title"
                  value={title}
                  readOnly
                  disabled
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
                    content_style: ` 
                      ::selection {
                        background: #a99068 !important; /* selection background color */
                        color: #fff !important;    /* text color when selected */
                      } `,
                  }}
                  onEditorChange={(value) => setContent(value)}
                />
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  className="button-secondary"
                  onClick={() => navigate("/policies")}
                >
                  Cancel
                </button>
                <button
                  className="primary-button card-btn"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <NoData text="No data found" />
          )}
        </div>
      </section>
    </main>
  );
};

export default CMSView;
