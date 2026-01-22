import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { CirclePlay, Play } from "lucide-react";

const ViewProperty = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("id");
  const [activeVideo, setActiveVideo] = useState(null);

  // 🔒 STATIC DATA (NO API)
  const property = {
    propertyId: "PROP-001",
    address: "123 Main Street, New York, NY 10001",
    legalOwner: "John Doe",
    managementCompany: "ABC Property Management LLC",
    serviceTypes: ["Maintenance", "Cleaning", "Security"],
    propertyType: "Residential",
    units: 24,
    squareFeet: null,
    dueDiligenceDays: 14,
    inspectionAllowed: "Yes",
    bidDuration: "30 Days",
    additionalRequirements:
      "All vendors must provide valid insurance and licenses.",
    status: "active",
    documents: [
      {
        name: "Property_Deed.pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        name: "Insurance.docx",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],

    scopeOfWork:
      "Provide complete maintenance and upkeep of the residential property including plumbing, electrical, and common area cleaning.",
    contractLength: "2 Years",
    targetCompensation: "$120,000",
    expectedStartDate: "2026-02-01",
    completionTimeframe: "180 Days",
    contractFile: {
      name: "ServiceContract.pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    photos: [
      "https://picsum.photos/id/1015/600/400",
      "https://picsum.photos/id/1016/600/400",
      "https://picsum.photos/id/1018/600/400",
      "https://picsum.photos/id/1020/600/400",
      "https://picsum.photos/id/1024/600/400",
    ],
    videos: [
      "https://media.w3.org/2010/05/sintel/trailer.mp4",
      "https://media.w3.org/2010/05/bunny/trailer.mp4",
      "https://media.w3.org/2010/05/video/movie_300.mp4",
    ],
  };

  const handleApprove = () => {
    Swal.fire({
      title: "Approved",
      text: "Property has been approved",
      icon: "success",
      confirmButtonColor: "#a99068",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/property-management");
      }
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: "Rejected",
      text: "Property has been rejected",
      icon: "error",
      confirmButtonColor: "#a99068",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/property-management");
      }
    });
  };

  // For lightgallery ref (optional, if you want to control)
  const lightGalleryRef = useRef(null);

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">View Property</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3 position-relative">
          <h2 className="title text-black mb-4">Property Details</h2>

          {/* Status badge */}
          <div className={`status-badge ${property.status === "inactive" ? "inactive" : ""}`}>{property.status}</div>

          <div className="row">
            <Detail label="Property ID" value={property.propertyId} />
            <Detail label="Property Address" value={property.address} />
            <Detail label="Legal Owner" value={property.legalOwner} />
            <Detail
              label="Property Management Company"
              value={property.managementCompany}
            />
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Service Types</label>

              <div className="d-flex flex-wrap gap-2">
                {property.serviceTypes.map((type, idx) => (
                  <span key={idx} className="service-chip">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <Detail label="Property Type" value={property.propertyType} />

            {property.propertyType === "Residential" && (
              <Detail label="Units" value={property.units} />
            )}

            {property.propertyType === "Commercial" && (
              <Detail label="Square Feet" value={property.squareFeet} />
            )}

            <Detail
              label="Due Diligence Period"
              value={`${property.dueDiligenceDays} Days`}
            />
            <Detail
              label="Inspection Allowed"
              value={property.inspectionAllowed}
            />
            <Detail label="Bid Duration" value={property.bidDuration} />

            <FullDetail
              label="Additional Requirements"
              value={property.additionalRequirements}
            />

            {/* Documents preview */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Relevant Documents
              </label>

              <div className="d-flex flex-wrap gap-2">
                {property.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-item"
                  >
                    <DocIcon />
                    <span className="ms-2">{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <FullDetail label="Scope of Work" value={property.scopeOfWork} />

            <Detail
              label="Service Contract Length"
              value={property.contractLength}
            />
            <Detail
              label="Target Compensation"
              value={property.targetCompensation}
            />
            <Detail
              label="Expected Start Date"
              value={property.expectedStartDate}
            />
            <Detail
              label="Completion Timeframe"
              value={property.completionTimeframe}
            />

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Contract File</label>
              <div className="contract-file-item">
                <a
                  href={property.contractFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fd-inline-flex align-items-center me-3 mb-2 text-decoration-none"
                  style={{ color: "#7f6c4d" }}
                >
                  <DocIcon />{" "}
                  <span className="ms-1">{property.contractFile.name}</span>
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
                {property.photos.map((src, idx) => (
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
                {property.videos.map((src, idx) => (
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
    </main>
  );
};

export default ViewProperty;

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

const DocIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="currentColor"
    className="bi bi-file-earmark-word"
    viewBox="0 0 16 16"
  >
    <path d="M6.5 8.995v-1h3v1h-3z" />
    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM13.5 5H9a.5.5 0 0 0-.5.5V6h4.5v-.5a.5.5 0 0 0-.5-.5z" />
  </svg>
);
