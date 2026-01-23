import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";

const ViewVlog = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const vlog = state?.vlog;

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (!vlog) navigate("/vlogs");
    else {
      setTitle(vlog.title);
      setVideoUrl(vlog.videoUrl);
    }
  }, [vlog, navigate]);

  const handleSave = () => {
    if (!title.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }
    if (!videoUrl.trim()) {
      Swal.fire("Error", "YouTube video URL is required", "error");
      return;
    }

    Swal.fire("Success", "Vlog updated successfully", "success").then(() =>
      navigate("/vlogs")
    );
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Edit Vlog</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <label className="form-label fw-semibold">Title</label>
          <input
            className="form-control mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="form-label fw-semibold">YouTube Video Link (Embed URL)</label>
          <input
            className="form-control mb-3"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          {videoUrl && (
            <div className="mb-3">
              <iframe
                width="100%"
                height="300"
                src={videoUrl}
                title="Vlog Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
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
