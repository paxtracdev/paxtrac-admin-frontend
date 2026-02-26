import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";
import { Editor } from "@tinymce/tinymce-react";

const getEmbedUrl = (url) => {
  if (!url) return "";

  // youtu.be/VIDEO_ID
  if (url.includes("youtu.be/")) {
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1].split("?")[0]}`;
  }

  // youtube.com/watch?v=VIDEO_ID
  if (url.includes("watch?v=")) {
    return `https://www.youtube.com/embed/${url.split("watch?v=")[1].split("&")[0]}`;
  }

  // Already embed
  if (url.includes("/embed/")) {
    return url;
  }

  return "";
};
const Detail = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <input type="text" className="form-control bg-light"   />
  </div>
);
const ViewPlan = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const plan = state?.plan;

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const embedUrl = getEmbedUrl(videoUrl);
  const [titleError, setTitleError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent("Features");
  }, [plan, navigate]);

  const handleSave = () => {
    let hasError = false;

    setTitleError("");
    setVideoError("");

    if (!title.trim()) {
      setTitleError("Title is required");
      hasError = true;
    }

    if (!getEmbedUrl(videoUrl)) {
      setVideoError("Please enter a valid YouTube link");
      hasError = true;
    }

    if (hasError) return;

    Swal.fire({
      title: "Success",
      text: "Vlog updated successfully",
      icon: "success",
      confirmButtonColor: "#a99068",
    }).then(() => navigate("/plans"));
  };
  const handleApproveConfirm = async () => {
    try {
      Swal.fire({
        title: "Success",
        text: "successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      }).then(() => {
        navigate("/plans");
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.data?.message,
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };
  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Edit Plan</div>
        <Breadcrumbs />
        <div className="custom-card bg-white p-4 mt-3 position-relative ">
          <h2 className="title text-black mb-4">Plan Details</h2>
          <div className="row">
            <Detail label="Plan Name" value="mmm" />
            <Detail label="Annually Prices" value="mmm" />
            <Detail label="One Time Prices" value="mmm" />
            <Detail label="Included Properties" value="ykyuk" />
            <Detail label="Background Checks" value="utyu" />
            <Detail label="Save Annually" value="utyu" />
            <div className="mb-3">
              <label className="form-label fw-semibold">Features</label>
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
            {/* Documents preview */}

            {/* Videos Preview */}
          </div>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="button-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="primary-button" onClick={handleApproveConfirm}>
              Save
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewPlan;
