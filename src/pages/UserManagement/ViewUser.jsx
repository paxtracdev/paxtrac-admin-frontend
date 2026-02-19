import React from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom"; 
import Breadcrumbs from "../../Components/Breadcrumbs";
import { File } from "lucide-react";
import { useGetUserByIdQuery } from "../../api/userApi"; 
import { LoadingComponent } from "../../Components/LoadingComponent";

const ViewUser = () => { 

  const { id } = useParams();
  console.log("ViewUser ID:", id);

const { data, isLoading, isError } = useGetUserByIdQuery(id);

if (isLoading) return  <LoadingComponent isLoading fullScreen />; 
if (isError || !data?.data) return <p>User not found</p>;

// Map API response to your component structure
const user = data.data;

const userId = user._id;
const first_name = user.firstName || "";
const last_name = user.lastName || "";
const email = user.email || "";
const phone = user.mobileNumber || "";
const role = user.role || "N/A";
const status = "active"; 
const registrationDate = user.createdAt;

const planDetails = {
  planName: "N/A", 
  billingType: "N/A",
  purchaseDate: "N/A",
  propertyUsed: user.plans?.usedProperties || 0,
  backgroundCheckUsed: user.plans?.usedbackgroundChecks || 0,
};

const businessDetails = 
  role === "owner" ? user.OwnerbusinessDetails?.[0] || {} :
  role === "vendor" ? user.VendorbusinessDetails?.[0] || {} :
  role === "manager" ? user.ManagerbusinessDetails?.[0] || {} : {};


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
            value={businessDetails.noOfEmployees}
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
            value={businessDetails.noOfUnitsOWn}
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
            value={businessDetails.businessStartYear}
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
            {businessDetails.propertyTypes?.map((type, i) => (
              <span
                key={i}
                className="service-chip"
                style={{ fontSize: "0.9rem" }}
                title={type} 
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
            value={businessDetails.nameOfBusiness || ""}
            disabled
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Business Address *</label>
          <input
            className="form-control"
            value={businessDetails.companyAddress || ""}
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
            value={businessDetails.businessStartYear || ""}
            disabled
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">
            Number of Staff Members
          </label>
          <input
            className="form-control"
            value={businessDetails.noOfStaffMembers || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Services Offered</label>
          <div className="d-flex flex-wrap gap-2">
            {(user.serviceOffered || []).map((s, i) => (
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
            value={user.licenseForManagementServices ? "Yes" : "No"}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">About Company</label>
          <textarea
            className="form-control"
            rows={3}
            value={user.aboutYourCompanyInfo || ""}
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
            value={user.projectsExperienceDescription || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Uploaded Files</label>
          <div className="d-flex flex-wrap gap-2">
            {(businessDetails.uploadedFiles || []).map((file, i) => (
              <a
                key={i}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="document-item"
              >
                <File size={18} />
                <span className="ms-2">{file.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">
            Documents & Certifications
          </label>
          <div className="d-flex flex-wrap gap-2">
            {(user.documentsCertificatesUploads || []).map((doc, i) => (
              <a
                key={i}
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

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Key Team Members</label>

          {(user.teamMembers || []).length ? (
            user.teamMembers.map((member, i) => (
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

  const   renderManagerDetails = () => (
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
            value={businessDetails.noOfStaffMembers || ""}
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
            value={businessDetails.businessStartYear || ""}
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
            {(businessDetails.propertyType || []).map((t, i) => (
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
            value={user.licenseForManagementServices ? "Yes" : "No"}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Services Offered</label>
          <div className="d-flex flex-wrap gap-2">
            {(user.serviceOffered || []).map((service, i) => (
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
            value={user.propertyPortfolioDescription || ""}
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
            value={user.successStoriesDescription || ""}
            disabled
          />
        </div>

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">
            Documents & Certifications
          </label>
          <div className="d-flex flex-wrap gap-2">
            {(user.documentsCertificatesUploads || []).map((doc, i) => (
              <a
                key={i}
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

        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Key Team Members</label>

          {(user.teamMembers || []).length ? (
            user.teamMembers.map((member, i) => (
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
              <label className="form-label fw-semibold">User ID</label>
              <input
                type="text"
                className="form-control"
                value={userId}
                disabled
                readOnly
              />
            </div>
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
                value={role?.charAt(0).toUpperCase() + role?.slice(1)}
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

          {/* Plan Details */}
          <h4 className="mb-3">Plan Details</h4>

          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Plan Name</label>
              <input
                type="text"
                className="form-control bg-light"
                value={planDetails?.planName || "N/A"}
                disabled
                readOnly
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Billing Type</label>
              <input
                type="text"
                className="form-control bg-light"
                value={planDetails?.billingType || "N/A"}
                disabled
                readOnly
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Purchase Date</label>
              <input
                type="text"
                className="form-control bg-light"
                value={
                  planDetails?.purchaseDate
                    ? new Date(planDetails.purchaseDate).toLocaleDateString(
                        "en-GB",
                      )
                    : "N/A"
                }
                disabled
                readOnly
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Property Used</label>
              <input
                type="number"
                className="form-control bg-light"
                value={planDetails?.propertyUsed ?? 0}
                disabled
                readOnly
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">
                Background Check Used
              </label>
              <input
                type="number"
                className="form-control bg-light"
                value={planDetails?.backgroundCheckUsed ?? 0}
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
