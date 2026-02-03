import React, { useEffect, useRef, useState } from "react";
import CustomDropdown from "./CustomDropdown";

const FilterUserModal = ({ show, onClose, onApply, initialFilters }) => {
  const [localFilters, setLocalFilters] = useState(
    initialFilters || { role: "" },
  );
  const modalRef = useRef(null);

  useEffect(() => {
    setLocalFilters(initialFilters || { role: "" });
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

            {/* Role Filter */}
            <div className="">
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
                setLocalFilters({ role: "" });
                onApply({ role: "" });
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
