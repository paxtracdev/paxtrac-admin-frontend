import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";
import CustomDropdown from "../../Components/CustomDropdown";

const PLACEHOLDER_PDF =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const AVAILABLE_BADGES = [
  { label: "Trusted", value: "Trusted" },
  { label: "Top Rated", value: "Top Rated" },
  { label: "Verified", value: "Verified" },
  { label: "Premium", value: "Premium" },
];

const STATIC_VENDORS = [
  {
    _id: "v1",
    vendorName: "Acme Services",
    personalDetails: {
      name: "John Doe",
      position: "CEO",
      email: "john@acme.com",
      phoneNumber: "1234567890",
      website: "https://acme.com",
    },
    businessDetails: {
      businessName: "Acme Services LLC",
      businessAddress: "123 Main St, New York, NY",
      serviceAreas: "New York, NJ",
      numberOfStaff: 50,
      businessStartYear: 2015,
      preferredCurrency: "USD",
    },
    servicesOffered: ["Cleaning", "Maintenance"],
    propertyManagementLicense: true,
    aboutCompany: "We provide top-notch cleaning and maintenance services.",
    projectExperience: [{ name: "Project Experience 1", url: PLACEHOLDER_PDF }],
    documentsCertifications: [
      { name: "Certification 1", url: PLACEHOLDER_PDF },
    ],
    keyTeamMembers: [
      { name: "Alice Smith", position: "Operations Manager" },
      { name: "Bob Johnson", position: "Lead Technician" },
    ], 
    verificationStatus: "pending", // pending | approved | rejected
    badges: ["Trusted"],
  },
];

export default function VendorView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [vendor, setVendor] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState("");

  useEffect(() => {
    const found = STATIC_VENDORS.find((v) => v._id === id);
    setVendor(found || null);
  }, [id]);

  if (!vendor) return <p className="p-4">Vendor not found</p>;

  const {
    vendorName,
    personalDetails,
    businessDetails,
    servicesOffered,
    propertyManagementLicense,
    aboutCompany,
    projectExperience,
    documentsCertifications,
    keyTeamMembers, 
    verificationStatus,
    badges,
  } = vendor;

  /* ---------------- ACTIONS ---------------- */

  const approveVendor = () => {
    Swal.fire({
      title: "Approve this vendor?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      confirmButtonColor: "#a99068",
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (res.isConfirmed) {
        setVendor((v) => ({ ...v, verificationStatus: "approved" }));
        Swal.fire({
          title: "Approved!",
          text: "Vendor approved successfully.",
          icon: "success",
          confirmButtonColor: "#a99068",
        }).then(() => {
          navigate("/vendor-management");
        });
      }
    });
  };

  const rejectVendor = () => {
    Swal.fire({
      title: "Reject this vendor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#a99068",
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (res.isConfirmed) {
        setVendor((v) => ({ ...v, verificationStatus: "rejected" }));
        Swal.fire({
          title: "Rejected!",
          text: "Vendor rejected.",
          icon: "success",
          confirmButtonColor: "#a99068",
        }).then(() => {
          navigate("/vendor-management");
        });
      }
    });
  };

  const handleAssignBadge = () => {
    if (!selectedBadge || badges.includes(selectedBadge)) return;

    setVendor((v) => ({
      ...v,
      badges: [...v.badges, selectedBadge],
    }));

    Swal.fire({
      title: "Assigned!",
      text: "Badge assigned successfully",
      icon: "success",
      confirmButtonColor: "#a99068",
    });

    setSelectedBadge("");
  };
  const availableBadgeOptions = AVAILABLE_BADGES.filter(
    (b) => !badges.includes(b.value),
  );

  /* ---------------- UI ---------------- */

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="title-heading">Vendor Details</h1>
            <p className="title-sub-heading">Review & manage vendor profile</p>
          </div>
          <button className="login-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 position-relative">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">{vendorName}</h3>
            <span
              className={`status-badge ${
                verificationStatus === "approved"
                  ? "approved"
                  : verificationStatus === "rejected"
                    ? "rejected"
                    : "pending"
              }`}
            >
              {verificationStatus.toUpperCase()}
            </span>
          </div>

          {/* PERSONAL DETAILS */}
          <h4 className="section-title">Personal Details</h4>
          <div className="row">
            {Object.entries(personalDetails).map(([k, v]) => (
              <div key={k} className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  {k.replace(/([A-Z])/g, " $1")}
                </label>
                <input className="form-control" value={v} disabled />
              </div>
            ))}
          </div>

          {/* BUSINESS DETAILS */}
          <h4 className="section-title">Business Details</h4>
          <div className="row">
            {Object.entries(businessDetails).map(([k, v]) => (
              <div key={k} className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  {k.replace(/([A-Z])/g, " $1")}
                </label>
                <input className="form-control" value={v} disabled />
              </div>
            ))}
          </div>

          {/* SERVICES */}
          <h4 className="section-title">Services Offered</h4>
          <div className="mb-3">
            {servicesOffered.map((s, i) => (
              <span key={i} className="service-chip me-2">
                {s}
              </span>
            ))}
          </div>

          {/* LICENSE */}
          <h4 className="section-title">Property Management License</h4>
          <input
            className="form-control w-50"
            value={propertyManagementLicense ? "Yes" : "No"}
            disabled
          />

          {/* ABOUT */}
          <h4 className="section-title mt-4">About Company</h4>
          <textarea
            className="form-control"
            rows={4}
            value={aboutCompany}
            disabled
          />

          {/* DOCUMENTS */}
          <h4 className="section-title mt-4">Documents</h4>
          <div className="row">
            {[...projectExperience, ...documentsCertifications].map(
              (doc, i) => (
                <div key={i} className="col-md-6 mb-3">
                  <p className="fw-semibold">{doc.name}</p>
                  <iframe
                    src={doc.url}
                    height="200"
                    width="100%"
                    style={{ borderRadius: 6, border: "1px solid #ddd" }}
                  />
                </div>
              ),
            )}
          </div>

          {/* TEAM */}
          <h4 className="section-title mt-4">Key Team Members</h4>
          <div className="row">
            {keyTeamMembers.map((m, i) => (
              <React.Fragment key={i}>
                <div className="col-md-6 mb-3">
                  <input className="form-control" value={m.name} disabled />
                </div>
                <div className="col-md-6 mb-3">
                  <input className="form-control" value={m.position} disabled />
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* BADGES */}
          <h4 className="section-title mt-4">Badges</h4>
          <div className="mb-3 d-flex flex-wrap gap-2">
            {badges.length ? (
              badges.map((b, i) => (
                <span key={i} className="assign-badge">
                  {b}
                </span>
              ))
            ) : (
              <span className="text-muted">No badges assigned</span>
            )}
          </div>

          {availableBadgeOptions.length > 0 && (
            <div className="d-flex gap-3 align-items-center w-100">
              <CustomDropdown
                options={availableBadgeOptions}
                placeholder="Select badge"
                value={selectedBadge}
                onChange={setSelectedBadge}
              />
              <button className="login-btn" onClick={handleAssignBadge}>
                Assign
              </button>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-5 d-flex gap-3">
            {verificationStatus !== "approved" && (
              <button className="login-btn" onClick={approveVendor}>
                Approve
              </button>
            )}
            {verificationStatus !== "rejected" && (
              <button
                className="login-btn"
                style={{ background: "#e83f3f" }}
                onClick={rejectVendor}
              >
                Reject
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
