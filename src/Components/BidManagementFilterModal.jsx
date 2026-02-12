import React, { useEffect, useRef, useState } from "react";
import CustomDropdown from "./CustomDropdown";

const BidManagementFilterModal = ({
  show,
  onClose,
  onApply,
  initialFilters = { status: "", propertyType: "" },
}) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const modalRef = useRef(null);

  // Sync when initialFilters changes
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  const PROPERTY_TYPES = [
    "Multi Family",
    "Vacation Rentals",
    "Apartment Building",
    "HOA Condo",
    "HOA Single Family",
    "Co-op",
    "REO",
    "Commercial",
    "Single Family",
    "Single Family (portfolio)",
    "Other",
  ];

  const STATUS_OPTIONS = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Request Reopen", value: "request-reopen" },
  ];

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "#00000080" }}
    >
      <div className="modal-dialog modal-md modal-dialog-centered fade-in">
        <div ref={modalRef} className="modal-content position-relative p-3">
          <div className="w-100 text-center">
            <h5>Filter Bids</h5>
          </div>

          <button
            className="btn-close position-absolute"
            style={{ top: "10px", right: "10px" }}
            onClick={onClose}
          />

          <div className="modal-body p-2">
            {/* STATUS RADIO */}
            <div>
              <p className="mb-2 fw-semibold">Status</p>

              <div className="row">
                {STATUS_OPTIONS.map((status) => (
                  <div className="col-sm-6 mb-2" key={status.value}>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`status-${status.value}`}
                        name="status"
                        checked={localFilters.status === status.value}
                        onChange={() =>
                          setLocalFilters({
                            ...localFilters,
                            status: status.value,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`status-${status.value}`}
                      >
                        {status.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROPERTY TYPE SELECT */}
            <div className="mt-3">
              <p className="mb-2 fw-semibold">Property Type</p>
              <CustomDropdown
                placeholder="All"
                value={localFilters.propertyType}
                onChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    propertyType: value,
                  })
                }
                options={[
                  { label: "All", value: "" },
                  ...PROPERTY_TYPES.map((type) => ({
                    label: type,
                    value: type,
                  })),
                ]}
              />
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
            <button
              className="button-secondary"
              onClick={() => {
                const cleared = { status: "", propertyType: "" };
                setLocalFilters(cleared);
                onApply(cleared);
              }}
            >
              Clear
            </button>

            <button
              className="login-btn"
              onClick={() => onApply(localFilters)}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidManagementFilterModal;
