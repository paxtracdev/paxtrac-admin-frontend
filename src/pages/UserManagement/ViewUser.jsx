import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { File } from "lucide-react";

// Static data simulating users and their business info (ideally you would fetch this)
const STATIC_USERS = [
  // ===== OWNER =====
  {
    _id: "1",
    first_name: "Amit",
    last_name: "Sharma",
    email: "amit.owner@example.com",
    phone: "9876543210",
    role: "owner",
    status: "active",
    registrationDate: "2025-12-01",
    businessDetails: {
      ownerName: "Sharma Properties Pvt Ltd",
      ownerAddress: "123 MG Road, Mumbai",
      employees: 40,
      unitsOwned: 120,
      startYear: 2008,
      capexBudget: "₹1,20,00,000",
      geographicAreas: "Mumbai, Pune",
      propertyTypes: ["Apartment", "Commercial", "Villa"],
      propertyPortfolio:
        "Managing premium residential and commercial properties across metro cities.",
    },
  },

  // ===== VENDOR =====
  {
    _id: "2",
    first_name: "John",
    last_name: "Doe",
    email: "john.vendor@example.com",
    phone: "9876500000",
    role: "vendor",
    status: "active",
    registrationDate: "2026-01-10",
    businessDetails: {
      businessName: "Doe Infrastructure Services",
      businessAddress: "45 Industrial Area, Delhi",
      geographicAreas: "Delhi NCR, Haryana",
      startYear: 2016,
      staffCount: 22,
      services: [
        "Surveyors",
        "Excavators",
        "Crane Operator",
        "Welders",
        "Fencing Contractor",
      ],
      license: true,
      about:
        "We provide end-to-end infrastructure and construction support services.",
      experience:
        "Completed over 150 commercial and residential projects across North India.",
      uploadedFiles: ["company-profile.pdf", "service-brochure.pdf"],
      documents: ["gst-certificate.pdf", "trade-license.pdf"],
      keyTeamMembers: [
        { name: "Rohit Verma", position: "Project Manager" },
        { name: "Ankit Jain", position: "Site Supervisor" },
        { name: "Sunil Rao", position: "Operations Head" },
        { name: "Deepak Singh", position: "Safety Officer" },
        { name: "Neha Gupta", position: "HR Manager" },
      ],
    },
  },

  // ===== MANAGER =====
  {
    _id: "3",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.manager@example.com",
    phone: "9123456789",
    role: "manager",
    status: "inactive",
    registrationDate: "2026-01-15",
    businessDetails: {
      companyName: "Smith Property Management",
      companyAddress: "78 Park Street, Bengaluru",
      geographicAreas: "Bengaluru, Mysuru",
      staffCount: 15,
      startYear: 2014,
      propertyTypes: ["Apartment", "Multi-Family"],
      license: true,
      about:
        "We specialize in professional property management for residential communities.",
      services: ["Tenant Management", "Maintenance", "Rent Collection"],
      portfolio:
        "Currently managing 25+ residential societies with 3000+ units.",
      successStories:
        "Improved tenant retention by 35% and reduced maintenance costs by 20%.",
      documents: ["property-management-license.pdf", "iso-certification.pdf"],
      keyTeamMembers: [
        { name: "Karan Mehta", position: "Senior Manager" },
        { name: "Pooja Nair", position: "Accounts Lead" },
        { name: "Rahul Iyer", position: "Maintenance Head" },
        { name: "Sneha Kapoor", position: "Client Relations" },
      ],
    },
  },
];

const ViewUser = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id");

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!id) return;

    const foundUser = STATIC_USERS.find((u) => u._id === id);
    setUser(foundUser);
  }, [id]);

  if (!user) return;

  const {
    first_name,
    last_name,
    email,
    phone,
    role,
    status,
    registrationDate,
    businessDetails,
  } = user;

  const renderOwnerDetails = () => (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            Name of Property Owner (Entity) *
          </label>
          <input
            type="text"
            className="form-control"
            value={businessDetails.ownerName}
            disabled
            readOnly
            placeholder="Name of Property Owner (Entity)"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            Property Owner Entity Address *
          </label>
          <input
            type="text"
            className="form-control"
            value={businessDetails.ownerAddress}
            disabled
            readOnly
            placeholder="Property Owner Entity Address"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            Number of employees? *
          </label>
          <input
            type="number"
            className="form-control"
            value={businessDetails.employees}
            disabled
            readOnly
            placeholder="Number of employees"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            How many units does this entity own? *
          </label>
          <input
            type="number"
            className="form-control"
            value={businessDetails.unitsOwned}
            disabled
            readOnly
            placeholder="Units owned"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            What year did the business start? *
          </label>
          <input
            type="number"
            className="form-control"
            value={businessDetails.startYear}
            disabled
            readOnly
            placeholder="Business start year"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            Average annual CapEx budget? *
          </label>
          <input
            type="text"
            className="form-control"
            value={businessDetails.capexBudget}
            disabled
            readOnly
            placeholder="Annual CapEx budget"
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">
            Geographic areas that you focus on
          </label>
          <div className="d-flex flex-wrap gap-2">
            {businessDetails.geographicAreas?.split(",").map((area, i) => (
              <span
                key={i}
                className="service-chip"
                style={{ fontSize: "0.9rem" }}
                title={area.trim()}
              >
                {area.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Types of property</label>
          <div className="d-flex flex-wrap gap-2">
            {businessDetails.propertyTypes.map((type, i) => (
              <span
                key={i}
                className="service-chip"
                style={{ fontSize: "0.9rem" }}
                title={type} // shows tooltip on hover
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Property Portfolio</label>
          <textarea
            className="form-control"
            rows={4}
            value={businessDetails.propertyPortfolio}
            disabled
            readOnly
            placeholder="Property Portfolio details"
          ></textarea>
        </div>
      </div>
    </>
  );

  const renderVendorDetails = () => (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Business Name *</label>
          <input
            className="form-control"
            value={businessDetails.businessName || ""}
            disabled
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Business Address *</label>
          <input
            className="form-control"
            value={businessDetails.businessAddress || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">
            Geographic areas that you focus on
          </label>
          <div className="d-flex flex-wrap gap-2">
            {businessDetails.geographicAreas?.split(",").map((area, i) => (
              <span key={i} className="service-chip">
                {area.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            Business Start Year *
          </label>
          <input
            className="form-control"
            value={businessDetails.startYear || ""}
            disabled
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            Number of Staff Members
          </label>
          <input
            className="form-control"
            value={businessDetails.staffCount || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Services Offered</label>
          <div className="d-flex flex-wrap gap-2">
            {(businessDetails.services || []).map((s, i) => (
              <span key={i} className="service-chip">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">License Available</label>
          <input
            className="form-control"
            value={businessDetails.license ? "Yes" : "No"}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">About Company</label>
          <textarea
            className="form-control"
            rows={3}
            value={businessDetails.about || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">
            Projects & Experience
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={businessDetails.experience || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Uploaded Files</label>
          <div className="d-flex flex-wrap gap-2">
            {(businessDetails.uploadedFiles || []).map((file, i) => (
              <a
                key={i}
                href={`/pdfs/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="document-item"
              >
                <File size={18} /> <span className="ms-2">{file}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">
            Documents & Certifications
          </label>
          <div className="d-flex flex-wrap gap-2">
            {(businessDetails.documents || []).map((doc, i) => (
              <a
                key={i}
                href={`/pdfs/${doc}`}
                target="_blank"
                rel="noopener noreferrer"
                className="document-item"
              >
                <File size={18} /> <span className="ms-2">{doc}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Key Team Members</label>

          {(businessDetails.keyTeamMembers || []).length ? (
            businessDetails.keyTeamMembers.map((member, i) => (
              <div key={i} className="d-flex gap-2 mb-2">
                <input className="form-control" value={member.name} disabled />
                <input
                  className="form-control"
                  value={member.position}
                  disabled
                />
              </div>
            ))
          ) : (
            <p className="text-muted">No team members provided</p>
          )}
        </div>
      </div>
    </>
  );

  const renderManagerDetails = () => (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            Property Management Company *
          </label>
          <input
            className="form-control"
            placeholder="Enter business name"
            value={businessDetails.companyName || ""}
            disabled
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Company Address *</label>
          <input
            className="form-control"
            placeholder="Enter business address"
            value={businessDetails.companyAddress || ""}
            disabled
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Number of Staff</label>
          <input
            className="form-control"
            placeholder="Enter number of staff members"
            value={businessDetails.staffCount || ""}
            disabled
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            Business Start Year *
          </label>
          <input
            className="form-control"
            placeholder="Enter business start year"
            value={businessDetails.startYear || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">
            Geographic areas that you focus on
          </label>
          <div className="d-flex flex-wrap gap-2">
            {businessDetails.geographicAreas?.split(",").map((area, i) => (
              <span key={i} className="service-chip">
                {area.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Property Types</label>
          <div className="d-flex flex-wrap gap-2">
            {(businessDetails.propertyTypes || []).map((t, i) => (
              <span key={i} className="service-chip">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">License Available</label>
          <input
            className="form-control"
            value={businessDetails.license ? "Yes" : "No"}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Services Offered</label>
          <div className="d-flex flex-wrap gap-2">
            {(businessDetails.services || []).map((service, i) => (
              <span key={i} className="service-chip">
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">
            Property Portfolio & Experience
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={businessDetails.portfolio || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">About Company</label>
          <textarea
            className="form-control"
            placeholder="Enter company details"
            rows={3}
            value={businessDetails.about || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Success Stories</label>
          <textarea
            className="form-control"
            rows={3}
            value={businessDetails.successStories || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">
            Documents & Certifications
          </label>
          <div className="d-flex flex-wrap gap-2">
            {(businessDetails.documents || []).map((doc, i) => (
              <a
                key={i}
                href={`/pdfs/${doc}`}
                target="_blank"
                rel="noopener noreferrer"
                className="document-item"
              >
                <File size={18} /> <span className="ms-2">{doc}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Key Team Members</label>

          {(businessDetails.keyTeamMembers || []).length ? (
            businessDetails.keyTeamMembers.map((member, i) => (
              <div key={i} className="d-flex gap-2 mb-2">
                <input className="form-control" value={member.name} disabled />
                <input
                  className="form-control"
                  value={member.position}
                  disabled
                />
              </div>
            ))
          ) : (
            <p className="text-muted">No team members provided</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <main className="app-content body-bg">
      <section className="container py-4 position-relative">
        {/* Header */}
        <div className="d-flex justify-content-between mb-4 align-items-center">
          <div>
            <div className="title-heading mb-2">User Management</div>
            <p className="title-sub-heading">
              Manage registered users and their access
            </p>
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3 position-relative">
          <h2 className="title text-black mb-4">User Details</h2>
          {/* Status Badge Top Right */}
          <div
            className={`status-badge ${status === "inactive" ? "inactive" : ""}`}
          >
            {status}
          </div>

          {/* User Details */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                value={`${first_name} ${last_name}`}
                disabled
                readOnly
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email address"
                value={email}
                disabled
                readOnly
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter phone number"
                value={phone}
                disabled
                readOnly
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Role</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter role"
                value={role.charAt(0).toUpperCase() + role.slice(1)}
                disabled
                readOnly
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Registration Date
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Select registration date"
                value={new Date(registrationDate).toLocaleDateString("en-GB")}
                disabled
                readOnly
              />
            </div>
          </div>

          {/* Business Details */}
          <h4 className="mb-3">Business Details</h4>

          {role === "owner" && renderOwnerDetails()}
          {role === "vendor" && renderVendorDetails()}
          {role === "manager" && renderManagerDetails()}
        </div>
      </section>
    </main>
  );
};

export default ViewUser;
