import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";

// Helper to convert normal YouTube URL to embed URL
const getEmbedUrl = (url) => {
  if (!url) return "";

  if (url.includes("youtu.be/")) {
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1].split("?")[0]}`;
  }

  if (url.includes("watch?v=")) {
    return `https://www.youtube.com/embed/${url.split("watch?v=")[1].split("&")[0]}`;
  }

  if (url.includes("/embed/")) {
    return url;
  }

  return "";
};

const AddVlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [titleError, setTitleError] = useState("");
  const [videoError, setVideoError] = useState("");

  const embedUrl = getEmbedUrl(videoUrl);

  const handleCreate = () => {
    let hasError = false;

    setTitleError("");
    setVideoError("");

    if (!title.trim()) {
      setTitleError("Title is required");
      hasError = true;
    }

    if (!embedUrl) {
      setVideoError("Please enter a valid YouTube link");
      hasError = true;
    }

    if (hasError) return;

    Swal.fire({
      title: "Success",
      text: "Vlog created successfully",
      icon: "success",
      confirmButtonColor: "#a99068",
    }).then(() => navigate("/vlogs"));
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Add New Vlog</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              className="form-control mb-1"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError("");
              }}
              placeholder="Enter vlog title"
            />
            {titleError && <div className="text-danger ">{titleError}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold">YouTube Video Link</label>
            <input
              className="form-control mb-1"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setVideoError("");
              }}
              placeholder="Paste YouTube video link here"
            />
            {videoError && <div className="text-danger ">{videoError}</div>}
          </div>

          {/* Preview */}
          {embedUrl && (
            <div className="mb-3">
              <iframe
                width="100%"
                height="300"
                src={embedUrl}
                title="Vlog Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "10px" }}
              />
            </div>
          )}

          <div className="d-flex gap-3 mt-4">
            <button
              className="button-secondary"
              onClick={() => navigate("/vlogs")}
            >
              Cancel
            </button>
            <button className="primary-button" onClick={handleCreate}>
              Create Vlog
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AddVlog;
