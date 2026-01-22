import React, { useEffect, useRef, useState } from "react";
import CustomDropdown from "./CustomDropdown";

const FilterUserModal = ({ show, onClose, onApply, initialFilters }) => {
  const [localFilters, setLocalFilters] = useState(
    initialFilters || { status: "" },
  );
  const modalRef = useRef(null);

  useEffect(() => {
    setLocalFilters(initialFilters || { status: "" });
  }, [initialFilters]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!show) return null; 

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "#00000080" }}
    >
      <div className="modal-dialog modal-md modal-dialog-centered fade-in">
        <div ref={modalRef} className="modal-content position-relative p-3">
          <div className="w-100 text-center">
            <h5>Filter Users</h5>
          </div>
          <button
            className="btn-close position-absolute"
            style={{ top: "10px", right: "10px" }}
            onClick={onClose}
          />

          <div className="modal-body p-2">
            {/* Status Radio */}
            <div>
              <p className="mb-2 fw-semibold">Status</p>
              <div className="d-flex align-items-center gap-4">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="status-all"
                    name="status"
                    checked={localFilters.status === ""}
                    onChange={() =>
                      setLocalFilters({ ...localFilters, status: "" })
                    }
                  />
                  <label className="form-check-label" htmlFor="status-all">
                    All
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="status-active"
                    name="status"
                    checked={localFilters.status === "active"}
                    onChange={() =>
                      setLocalFilters({ ...localFilters, status: "active" })
                    }
                  />
                  <label className="form-check-label" htmlFor="status-active">
                    Active
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="status-inactive"
                    name="status"
                    checked={localFilters.status === "inactive"}
                    onChange={() =>
                      setLocalFilters({ ...localFilters, status: "inactive" })
                    }
                  />
                  <label className="form-check-label" htmlFor="status-inactive">
                    Inactive
                  </label>
                </div>
              </div>
            </div>

            {/* Role Filter */}
            <div className="mt-3">
              <p className="mb-2 fw-semibold">Role</p>
              <CustomDropdown
                placeholder="All"
                value={localFilters.role || ""}
                onChange={(value) =>
                  setLocalFilters({ ...localFilters, role: value })
                }
                options={[
                  { label: "All", value: "" },
                  { label: "Vendor", value: "vendor" },
                  { label: "Manager", value: "manager" },
                  { label: "Owner", value: "owner" },
                ]}
              />
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
            <button
              className="button-secondary"
              onClick={() => {
                setLocalFilters({ status: "", role: "" });
                onApply({ status: "", role: "" });
              }}
            >
              Clear
            </button>

            <button className="login-btn" onClick={() => onApply(localFilters)}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterUserModal;
