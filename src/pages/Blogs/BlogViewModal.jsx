import React from "react";
import { X, Calendar, User, Eye, Tag } from "lucide-react";

const BlogViewModal = ({ blog, isOpen, onClose, onEdit }) => {
  if (!isOpen || !blog) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-3">
          {/* Header */}
          <div className="modal-header border-bottom px-4 py-3 bg-light d-flex justify-content-between align-items-center">
            <div>
              <span
                className={`badge px-2 py-1 me-2 ${
                  blog.status === "Published"
                    ? "bg-success-subtle text-success border border-success"
                    : "bg-secondary-subtle text-secondary border border-secondary"
                }`}
                style={{ fontSize: "12px", borderRadius: "4px" }}
              >
                {blog.status}
              </span>
              <span className="text-muted small fw-semibold">
                <Tag size={14} className="me-1" />
                {blog.category || "General"}
              </span>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {/* Title */}
            <h3 className="fw-bold mb-3 text-dark">{blog.title}</h3>

            {/* Meta information */}
            <div className="d-flex flex-wrap gap-3 text-muted small mb-4 pb-3 border-bottom">
              <span className="d-flex align-items-center gap-1">
                <User size={16} className="text-secondary" />
                {blog.author || "Admin"}
              </span>
              <span className="d-flex align-items-center gap-1">
                <Calendar size={16} className="text-secondary" />
                {blog.date ? new Date(blog.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }) : "N/A"}
              </span>
              <span className="d-flex align-items-center gap-1">
                <Eye size={16} className="text-secondary" />
                {blog.views ?? 0} Views
              </span>
            </div>

            {/* Image */}
            {blog.image && (
              <div className="mb-4 text-center">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="img-fluid rounded-3 shadow-sm"
                  style={{ maxHeight: "360px", width: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            {/* Short Excerpt */}
            {blog.excerpt && (
              <div className="p-3 bg-light rounded-3 border-start border-4 border-warning mb-4 fst-italic text-secondary">
                "{blog.excerpt}"
              </div>
            )}

            {/* Content HTML */}
            <div className="blog-content-body lh-lg text-secondary">
              {blog.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />
              ) : (
                <p className="text-muted">No description provided for this blog post.</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-top px-4 py-3">
            <button
              type="button"
              className="button-secondary btn-sm"
              onClick={onClose}
            >
              Close
            </button>
            {onEdit && (
              <button
                type="button"
                className="primary-button card-btn"
                onClick={() => {
                  onClose();
                  onEdit(blog);
                }}
              >
                Edit Blog
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogViewModal;
