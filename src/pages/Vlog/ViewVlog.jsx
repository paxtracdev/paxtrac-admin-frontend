import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";

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

const ViewVlog = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const vlog = state?.vlog;

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const embedUrl = getEmbedUrl(videoUrl);
  const [titleError, setTitleError] = useState("");
  const [videoError, setVideoError] = useState("");

  useEffect(() => {
    if (!vlog) navigate("/vlogs");
    else {
      setTitle(vlog.title);
      setVideoUrl(vlog.videoUrl);
    }
  }, [vlog, navigate]);

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
    }).then(() => navigate("/vlogs"));
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Edit Vlog</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div className="mb-3">
            <input
              className="form-control mb-1"
              placeholder="Enter vlog title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError("");
              }}
            />
            {titleError && (
              <div className="text-danger ">{titleError}</div>
            )}
          </div>

          <label className="form-label fw-semibold">YouTube Video Link</label>
          <div className="mb-3">
            <input
              className="form-control mb-1"
              placeholder="Paste YouTube video link here"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setVideoError("");
              }}
            />
            {videoError && (
              <div className="text-danger ">{videoError}</div>
            )}
          </div>

          {embedUrl && (
            <div className="mb-3">
              <iframe
                width="100%"
                height="300"
                src={embedUrl}
                title="Vlog Video"
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
            <button className="primary-button" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewVlog;
