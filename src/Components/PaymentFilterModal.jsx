import React, { useEffect, useRef, useState } from "react";

const PaymentFilterModal = ({
  show,
  onClose,
  onApply,
  initialStatus = "",
}) => {
  const [status, setStatus] = useState(initialStatus);
  const modalRef = useRef(null);

  // Sync status when prop changes
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  const STATUS_OPTIONS = [
    { label: "All", value: "" },
    { label: "Paid", value: "paid" },
    { label: "Failed", value: "failed" },
    { label: "Refund", value: "refund" },
  ];

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "#00000080" }}>
      <div className="modal-dialog modal-md modal-dialog-centered fade-in">
        <div ref={modalRef} className="modal-content position-relative p-3">
          <div className="w-100 text-center">
            <h5>Filter Payments</h5>
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
                {STATUS_OPTIONS.map((opt) => (
                  <div className="col-sm-6 mb-2" key={opt.value || "all"}>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`status-${opt.value || "all"}`}
                        name="status"
                        checked={status === opt.value}
                        onChange={() => setStatus(opt.value)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`status-${opt.value || "all"}`}
                      >
                        {opt.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
            <button
              className="button-secondary"
              onClick={() => {
                setStatus("");
                onApply("");
              }}
            >
              Clear
            </button>

            <button className="login-btn" onClick={() => onApply(status)}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilterModal;