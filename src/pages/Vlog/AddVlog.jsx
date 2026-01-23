import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";

const AddVlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleCreate = () => {
    if (!title.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }

    if (!videoUrl.trim()) {
      Swal.fire("Error", "YouTube video URL is required", "error");
      return;
    }

    // For now just show success and navigate back
    Swal.fire("Success", "Vlog created successfully", "success").then(() =>
      navigate("/vlogs")
    );
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Add New Vlog</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <label className="form-label fw-semibold">Title</label>
          <input
            className="form-control mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter vlog title"
          />

          <label className="form-label fw-semibold">YouTube Video Link (Embed URL)</label>
          <input
            className="form-control mb-3"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
          />

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
