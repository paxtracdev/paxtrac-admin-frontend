import React, { useEffect, useRef, useState } from "react";
import CustomDropdown from "./CustomDropdown";

const FilterModal = ({ show, onClose, onApply, initialFilters }) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const PROPERTY_TYPES = [
    "Multi-Family",
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

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "#00000080" }}
    >
      <div className="modal-dialog modal-md modal-dialog-centered fade-in">
        <div ref={modalRef} className="modal-content position-relative p-3">
          <div className=" w-100 text-center">
            <h5>Filter Listing</h5>
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
                {[
                  { label: "Under review", value: "under-review" },
                  { label: "Deal sealed", value: "dealSealed" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                ].map((status) => (
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
              <p className="mb-2 fw-semibold">Listing Type</p>
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

          <div className="d-flex align-items-center justify-content-center gap-2">
            <button
              className="button-secondary"
              onClick={() => {
                setLocalFilters({ status: "", propertyType: "" });
                onApply({ status: "", propertyType: "" });
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

export default FilterModal;
