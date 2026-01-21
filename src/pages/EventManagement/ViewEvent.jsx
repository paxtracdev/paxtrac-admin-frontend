import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";

const ViewFirm = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();

  // 🔒 STATIC DATA (NO API)
  const property = {
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
    documents: ["Deed.pdf", "Insurance.pdf"],
    scopeOfWork:
      "Provide complete maintenance and upkeep of the residential property including plumbing, electrical, and common area cleaning.",
    contractLength: "2 Years",
    targetCompensation: "$120,000",
    expectedStartDate: "2026-02-01",
    completionTimeframe: "180 Days",
    contractFile: "ServiceContract.pdf",
    photos: 5,
    videos: 2,
  };

  const handleApprove = () => {
    Swal.fire("Approved", "Property has been approved", "success");
  };

  const handleReject = () => {
    Swal.fire("Rejected", "Property has been rejected", "error");
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">View Property</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div className="row">

            <Detail label="Property ID" value={propertyId} />
            <Detail label="Property Address" value={property.address} />
            <Detail label="Legal Owner" value={property.legalOwner} />
            <Detail
              label="Property Management Company"
              value={property.managementCompany}
            />
            <Detail
              label="Service Types"
              value={property.serviceTypes.join(", ")}
            />
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

            <Detail
              label="Relevant Documents"
              value={property.documents.join(", ")}
            />

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

            <Detail label="Contract File" value={property.contractFile} />
            <Detail label="Photos Uploaded" value={property.photos} />
            <Detail label="Videos Uploaded" value={property.videos} />
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="button-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="primary-button" onClick={handleApprove}>
              Approve
            </button>
            <button className="button-danger" onClick={handleReject}>
              Reject
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewFirm;
 
const Detail = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <div className="form-control bg-light">{value}</div>
  </div>
);

const FullDetail = ({ label, value }) => (
  <div className="col-md-12 mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <div className="form-control bg-light" style={{ minHeight: "80px" }}>
      {value}
    </div>
  </div>
);
