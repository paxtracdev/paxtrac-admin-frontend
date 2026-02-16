import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";

import LightGallery from "lightgallery/react";
// Plugins if needed (optional)
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

// styles (make sure to import once in your app)
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import { CirclePlay, File, Play } from "lucide-react";
import { usePropertyByIdQuery } from "../../api/propertyApi";
import { useApprovePropertyMutation } from "../../api/propertyApi";
import { useRejectPropertyMutation } from "../../api/propertyApi";
const ViewListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: listingId } = useParams();

  const [activeVideo, setActiveVideo] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveDateTime, setApproveDateTime] = useState("");
  const [approveError, setApproveError] = useState("");
  const { data, isLoading, isError } = usePropertyByIdQuery(listingId, {
    skip: !listingId,
  });
  const [approveProperty] = useApprovePropertyMutation();
  const [rejectProperty] = useRejectPropertyMutation();

  // 🔒 STATIC DATA (NO API)
  const listing = data?.data;

  const handleApprove = () => {
    setApproveDateTime("");
    setApproveError("");
    setShowApproveModal(true);
  };

  const handleApproveConfirm = async () => {
    if (!approveDateTime) {
      setApproveError("Date & time is required");
      return;
    }

    const formattedStartDate = (approveDateTime) => {
      const d = new Date(approveDateTime);
      return d.toISOString()
    };

    try {
      setShowApproveModal(false);

      await approveProperty({
        listingId,
        startDate: formattedStartDate(approveDateTime),
      }).unwrap();

      Swal.fire({
        title: "Approved",
        text: "Property has been approved",
        icon: "success",
        confirmButtonColor: "#a99068",
      }).then(() => {
        navigate("/listing-management");
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.data?.message,
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "Reject Property?",
      text: "Are you sure you want to reject this property?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e83f3f",
      cancelButtonColor: "#a99068",
      confirmButtonText: "Yes, reject",
    });

    try {
      await rejectProperty(listingId).unwrap();

      Swal.fire({
        title: "Rejected",
        text: "Property has been rejected",
        icon: "success",
        confirmButtonColor: "#a99068",
      }).then(() => {
        navigate("/listing-management");
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.data?.message || "Failed to reject property",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  // For lightgallery ref (optional, if you want to control)
  const lightGalleryRef = useRef(null);

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">View Listing</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3 position-relative">
          <h2 className="title text-black mb-4">Listing Details</h2>

          {/* Status badge */}
          {(() => {
            const statusMap = {
              "under-review": { label: "Under review", className: "pending" },
              approved: { label: "Approved", className: "info" },
              dealSealed: { label: "Deal sealed", className: "" },
              rejected: { label: "Rejected", className: "inactive" },
            };

            const status = statusMap[listing?.status] || {};
            return (
              <div className={`status-badge ${status.className}`}>
                {status.label}
              </div>
            );
          })()}

          <div className="row">
            <Detail label="Listing ID" value={listing?.listingId} />
            <Detail
              label="Listing Address"
              value={listing?.servicePropertyAddress}
            />
            <Detail label="Legal Owner" value={listing?.legalOwnerName} />
            <Detail
              label="Property Management Company"
              value={listing?.propertyManagementCompanyName}
            />
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Service Types</label>

              <div className="d-flex flex-wrap gap-2">
                {listing?.serviceTypes?.map((type, idx) => (
                  <span key={idx} className="service-chip">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <Detail label="Property Type" value={listing?.propertyType} />

            {listing?.propertyType === "Residential" && (
              <Detail label="Units" value={listing?.totalResidentialUnits} />
            )}

            {listing?.propertyType === "Commercial" && (
              <Detail
                label="Square Feet"
                value={listing.commercialSquareFeet}
              />
            )}

            <Detail
              label="Due Diligence Period"
              value={`${listing?.dueDiligenceDays} Days`}
            />
            <Detail
              label="Inspection Allowed"
              value={listing?.allowInspection}
            />
            <Detail
              label="Bid Duration"
              value={`${listing?.bidDurationDays} Days`}
            />

            <FullDetail
              label="Additional Requirements"
              value={listing?.additionalRequirementText}
            />

            {/* Documents preview */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Relevant Documents
              </label>

              <div className="d-flex flex-wrap gap-2">
                {listing?.additionalRequirementDocuments?.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-item"
                  >
                    <File size={18} />
                    <span className="ms-2">{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <FullDetail
              label="Scope of Work"
              value={listing?.scopeOfworkDescription}
            />

            <Detail
              label="Service Contract Length"
              value={listing?.contractLength}
            />
            <Detail
              label="Target Compensation"
              value={listing?.compensationAmount}
            />
            <Detail
              label="Expected Start Date"
              value={listing?.contractStartDate}
            />
            <Detail
              label="Completion Timeframe"
              value={listing?.completionTimeframeDays}
            />

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Contract File</label>
              <div className="contract-file-item">
                <a
                  href={listing?.contractFile?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fd-inline-flex align-items-center me-3 mb-2 text-decoration-none"
                  style={{ color: "#7f6c4d" }}
                >
                  <File size={18} />{" "}
                  <span className="ms-1">{listing?.contractFile?.name}</span>
                </a>
              </div>
            </div>

            {/* Photos Preview with Lightgallery */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Photos Uploaded</label>
              <LightGallery
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
                elementClassNames="property-gallery"
                ref={lightGalleryRef}
              >
                {listing?.uploadPhotos?.map((src, idx) => (
                  <a key={idx} href={src} className="property-gallery-item">
                    <img src={src} alt={`Property photo ${idx + 1}`} />
                  </a>
                ))}
              </LightGallery>
            </div>

            {/* Videos Preview */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Videos Uploaded</label>

              <div className="video-gallery">
                {listing?.uploadVideos?.map((src, idx) => (
                  <div
                    key={idx}
                    className="video-item video-thumb"
                    onClick={() => setActiveVideo(src)}
                  >
                    <video src={src} muted />
                    <div className="play-overlay">
                      <Play />{" "}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="button-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            {listing?.status === "under-review" && (
              <>
                <button className="primary-button" onClick={handleApprove}>
                  Approve
                </button>
                <button
                  className="primary-button"
                  style={{ background: "#e83f3f" }}
                  onClick={handleReject}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Video modal  */}
      {activeVideo && (
        <div className="video-modal" onClick={() => setActiveVideo(null)}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <video src={activeVideo} controls autoPlay />
          </div>
        </div>
      )}

      {showApproveModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "#00000080" }}
          onClick={() => {
            // Clicking outside modal closes it
            setShowApproveModal(false);
            setApproveDateTime(""); // reset input
            setApproveError("");
          }}
        >
          <div
            className="modal-dialog modal-md modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-3">
              <div className="modal-body">
                <h5 className="text-center">Select Start Date & Time</h5>

                <div className="my-4">
                  <label className="form-label fw-semibold">
                    Date & Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={approveDateTime}
                    onChange={(e) => {
                      setApproveDateTime(e.target.value);
                      setApproveError("");
                    }}
                    onClick={(e) => e.target.showPicker?.()}
                    onFocus={(e) => e.target.showPicker?.()}
                  />
                  {approveError && (
                    <div className="text-danger mt-1">{approveError}</div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2 justify-content-center">
                  <button
                    className="button-secondary"
                    onClick={() => {
                      setShowApproveModal(false);
                      setApproveDateTime(""); // reset input
                      setApproveError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="primary-button"
                    onClick={handleApproveConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewListing;

const Detail = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <input
      type="text"
      className="form-control bg-light"
      value={value ?? ""}
      readOnly
      disabled
    />
  </div>
);

const FullDetail = ({ label, value }) => (
  <div className="col-md-12 mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <textarea
      className="form-control bg-light"
      value={value ?? ""}
      rows={4}
      readOnly
      disabled
    />
  </div>
);
