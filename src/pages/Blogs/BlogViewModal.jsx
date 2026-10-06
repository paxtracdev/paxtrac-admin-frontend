import React, { useEffect } from "react";
import { X, Calendar, User, Tag, Quote, Pencil } from "lucide-react";

const cleanHtmlEntities = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
};

/**
 * Extracts fields even from malformed or truncated JSON strings
 */
const extractFieldsFromPartialJson = (str) => {
  if (!str || typeof str !== "string") return null;
  const trimmed = str.trim();
  if (!trimmed.startsWith("{")) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") return parsed;
  } catch (_) {
    // String is truncated or unclosed JSON
  }

  const out = {};
  const titleMatch = trimmed.match(/"title":\s*"([^"\\]*(?:\\.[^"\\]*)*)"?/i);
  if (titleMatch && titleMatch[1]) out.title = titleMatch[1];

  const excerptMatch = trimmed.match(/"excerpt":\s*"([^"\\]*(?:\\.[^"\\]*)*)"?/i);
  if (excerptMatch && excerptMatch[1]) out.excerpt = excerptMatch[1];

  const contentMatch = trimmed.match(/"content":\s*"((?:[^"\\]|\\.)*)"?/i);
  if (contentMatch && contentMatch[1]) {
    out.content = contentMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
  }

  return Object.keys(out).length > 0 ? out : null;
};

/**
 * Safely decodes and extracts rich text or JSON-encoded blog content
 */
const resolveBlogDetails = (blog) => {
  if (!blog) return { title: "", description: "", excerpt: "" };

  let title = blog.title || blog.heading || "Untitled Blog";
  let description = blog.description || blog.content || "";
  let excerpt = blog.excerpt || "";

  // Handle truncated or valid JSON in description
  const partialFromDesc = extractFieldsFromPartialJson(description);
  if (partialFromDesc) {
    if (partialFromDesc.content && partialFromDesc.content.trim().length > 0) {
      description = partialFromDesc.content;
    } else if (partialFromDesc.description) {
      description = partialFromDesc.description;
    } else if (partialFromDesc.excerpt) {
      description = `<p>${partialFromDesc.excerpt}</p>`;
    }

    if (partialFromDesc.title && (!blog.title || blog.title.toLowerCase().includes("testing"))) {
      title = partialFromDesc.title;
    }

    if (partialFromDesc.excerpt && (!excerpt || excerpt.startsWith("{"))) {
      excerpt = partialFromDesc.excerpt;
    }
  }

  // Handle truncated or valid JSON in excerpt
  const partialFromExcerpt = extractFieldsFromPartialJson(excerpt);
  if (partialFromExcerpt) {
    excerpt = partialFromExcerpt.excerpt || partialFromExcerpt.description || "";
  }

  // If excerpt still has raw JSON remnants, clear or generate clean excerpt
  if (excerpt.startsWith("{") || excerpt.includes('"title":') || excerpt.includes('"excerpt":')) {
    const fallbackClean = description.replace(/<[^>]*>/g, " ").trim();
    excerpt = fallbackClean ? fallbackClean.slice(0, 160) : "";
  }

  title = cleanHtmlEntities(title);
  excerpt = cleanHtmlEntities(excerpt).replace(/^["'\s]+|["'\s]+$/g, "");

  return { title, description, excerpt };
};

const BlogViewModal = ({ blog, isOpen, onClose, onEdit }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !blog) return null;

  const { title, description, excerpt } = resolveBlogDetails(blog);
  const isPublished = blog.status === "Published" || blog.status === "published";

  const formattedDate = blog.date || blog.createdAt
    ? new Date(blog.date || blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <div
      className="modal-backdrop-wrapper"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 1055,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        overflowY: "auto",
      }}
    >
      <div
        className="blog-preview-modal-dialog bg-white"
        style={{
          width: "100%",
          maxWidth: "880px",
          height: "85vh",
          minHeight: "650px",
          maxHeight: "92vh",
          borderRadius: "16px",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "16px 24px",
            borderBottom: "1px solid #f1f5f9",
            backgroundColor: "#ffffff",
            flexShrink: 0,
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: isPublished ? "#ecfdf5" : "#f1f5f9",
                color: isPublished ? "#047857" : "#475569",
                border: `1px solid ${isPublished ? "#a7f3d0" : "#cbd5e1"}`,
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: isPublished ? "#10b981" : "#94a3b8",
                }}
              />
              {isPublished ? "Published" : "Draft"}
            </span>

            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: "rgba(169, 144, 104, 0.12)",
                color: "#8c734b",
                border: "1px solid rgba(169, 144, 104, 0.25)",
              }}
            >
              <Tag size={12} color="#8c734b" />
              {blog.category || "Property Management"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              marginLeft: "auto",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fee2e2";
              e.currentTarget.style.color = "#dc2626";
              e.currentTarget.style.borderColor = "#fca5a5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Body with Increased Vertical Room */}
        <div
          className="modal-body p-4 p-md-4 custom-modal-scroll"
          style={{
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title */}
          <h2
            style={{
              fontSize: "1.65rem",
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.35,
              letterSpacing: "-0.015em",
              marginBottom: "14px",
            }}
          >
            {title}
          </h2>

          {/* Meta Info Pill Chips */}
          <div
            className="d-flex flex-wrap gap-2 mb-4 pb-3 flex-shrink-0"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "12.5px",
                color: "#475569",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 500,
              }}
            >
              <User size={14} color="#a99068" />
              <span>{typeof blog.author === "object" ? blog.author?.name || "Admin" : blog.author || "Admin"}</span>
            </div>

            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "12.5px",
                color: "#475569",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 500,
              }}
            >
              <Calendar size={14} color="#a99068" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Featured Image */}
          {blog.image && (
            <div
              className="mb-4 text-center flex-shrink-0"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                maxHeight: "380px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
              }}
            >
              <img
                src={blog.image}
                alt={title}
                style={{
                  width: "100%",
                  maxHeight: "380px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          )}

          {/* Excerpt / Summary Quote */}
          {excerpt && (
            <div
              className="mb-4 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(169, 144, 104, 0.08) 0%, rgba(169, 144, 104, 0.02) 100%)",
                borderLeft: "4px solid #a99068",
                borderRadius: "0 10px 10px 0",
                padding: "14px 18px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <Quote
                size={18}
                color="#a99068"
                style={{ transform: "rotate(180deg)", flexShrink: 0, marginTop: "3px" }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "#334155",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                {excerpt}
              </p>
            </div>
          )}

          {/* Rich Content Article Body */}
          <div
            className="blog-article-content flex-grow-1"
            style={{
              lineHeight: 1.8,
              color: "#334155",
              fontSize: "15px",
            }}
          >
            {description ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-muted fst-italic">No content provided for this blog post.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="modal-footer px-4 py-3 d-flex justify-content-end align-items-center gap-2 flex-shrink-0"
          style={{
            borderTop: "1px solid #f1f5f9",
            backgroundColor: "#ffffff",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#475569",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
              e.currentTarget.style.borderColor = "#94a3b8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
          >
            Close
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(blog);
              }}
              style={{
                padding: "8px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#a99068",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 8px rgba(169, 144, 104, 0.25)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#957e59";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#a99068";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Pencil size={15} />
              Edit Blog
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogViewModal;
