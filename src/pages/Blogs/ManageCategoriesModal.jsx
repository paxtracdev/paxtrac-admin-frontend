import React, { useState } from "react";
import { X, Trash2, Plus, Tag } from "lucide-react";
import Swal from "sweetalert2";
import {
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} from "../../api/blogApi";

const ManageCategoriesModal = ({ isOpen, onClose }) => {
  const [newCatName, setNewCatName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: catResponse, isLoading } = useGetBlogCategoriesQuery(undefined, {
    skip: !isOpen,
  });
  const [createCategory] = useCreateBlogCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteBlogCategoryMutation();

  const categories = catResponse?.data || [];

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      Swal.fire({
        icon: "warning",
        title: "Category Name Required",
        text: "Please enter a name for the new category.",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createCategory({ name: trimmed }).unwrap();
      setNewCatName("");
      Swal.fire({
        icon: "success",
        title: "Created!",
        text: `Category "${trimmed}" created successfully.`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || "Failed to create category.",
        confirmButtonColor: "#a99068",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (cat) => {
    Swal.fire({
      title: "Delete Category?",
      text: `Are you sure you want to delete "${cat.name}"? If any active blogs are using this category, deletion will be blocked.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory(cat._id).unwrap();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: `Category "${cat.name}" deleted successfully.`,
            timer: 1800,
            showConfirmButton: false,
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Cannot Delete Category",
            text:
              err?.data?.message ||
              "This category cannot be deleted because it is associated with active blogs.",
            confirmButtonColor: "#a99068",
          });
        }
      }
    });
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        zIndex: 1055,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        className="category-modal-card"
        style={{
          width: "100%",
          maxWidth: "490px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.25)",
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
            padding: "18px 24px",
            borderBottom: "1px solid #f1f5f9",
            backgroundColor: "#ffffff",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(169, 144, 104, 0.12)",
                color: "#a99068",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Tag size={18} />
            </div>
            <div>
              <h6 className="mb-0 fw-bold" style={{ color: "#1e293b", fontSize: "16px" }}>
                Manage Categories
              </h6>
              <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                Add or remove blog categories
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "#f1f5f9",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e2e8f0";
              e.currentTarget.style.color = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "22px 24px" }}>
          {/* Add Category Form */}
          <form onSubmit={handleCreate} className="mb-4">
            <label
              className="form-label fw-semibold mb-2"
              style={{ fontSize: "13px", color: "#334155" }}
            >
              New Category Name
            </label>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                disabled={isSubmitting}
                style={{
                  fontSize: "14px",
                  height: "42px",
                  borderRadius: "8px",
                  borderColor: "#cbd5e1",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#a99068";
                  e.target.style.boxShadow = "0 0 0 3px rgba(169, 144, 104, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-button d-inline-flex align-items-center justify-content-center gap-1"
                style={{
                  whiteSpace: "nowrap",
                  padding: "0 18px",
                  height: "42px",
                  fontSize: "14px",
                  borderRadius: "8px",
                  backgroundColor: "#a99068",
                  borderColor: "#a99068",
                  boxShadow: "0 2px 6px rgba(169, 144, 104, 0.25)",
                }}
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </form>

          {/* Existing Categories */}
          <div>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span
                className="fw-semibold text-muted text-uppercase"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Existing Categories
              </span>
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: "rgba(169, 144, 104, 0.15)",
                  color: "#a99068",
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 8px",
                }}
              >
                {categories.length}
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-4 text-muted" style={{ fontSize: "13px" }}>
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div
                className="text-center py-4 text-muted rounded-3 border"
                style={{
                  backgroundColor: "#f8fafc",
                  borderColor: "#f1f5f9",
                  fontSize: "13px",
                }}
              >
                No categories created yet.
              </div>
            ) : (
              <div
                className="d-flex flex-column gap-2"
                style={{
                  maxHeight: "240px",
                  overflowY: categories.length > 5 ? "auto" : "visible",
                  paddingRight: categories.length > 5 ? "4px" : "0px",
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat._id || cat.name}
                    className="d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      minHeight: "44px",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#faf9f6";
                      e.currentTarget.style.borderColor = "#cbd5e1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    <span
                      className="fw-medium text-dark"
                      style={{ fontSize: "14px" }}
                    >
                      {cat.name}
                    </span>

                    <button
                      type="button"
                      title="Delete category"
                      disabled={isDeleting}
                      onClick={() => handleDelete(cat)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "6px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.12)";
                        e.currentTarget.style.color = "#dc2626";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#ef4444";
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #f1f5f9",
            backgroundColor: "#f8fafc",
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 20px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#475569",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriesModal;
