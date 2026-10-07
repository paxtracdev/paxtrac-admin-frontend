import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { ArrowLeft, ExternalLink, Globe, User, Mail, Phone, Calendar, DollarSign, Briefcase, CheckCircle2 } from "lucide-react";
import { MOCK_SAAS_OFFERS } from "./SaasOffers";

const ViewSaasOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const offer = MOCK_SAAS_OFFERS.find((item) => item._id === id) || MOCK_SAAS_OFFERS[0];

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const formatCurrency = (val) => {
    if (val == null || val === "") return "-";
    return `$${Number(val).toLocaleString()}`;
  };

  if (!offer) {
    return (
      <main className="app-content body-bg">
        <section className="container py-4">
          <div className="alert alert-warning">SaaS Offer not found.</div>
          <button className="login-btn" onClick={() => navigate("/saas-offers")}>
            Back to List
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-content body-bg">
      <section className="container py-4 position-relative">
        {/* HEADER & BACK BUTTON */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="title-heading mb-2">SaaS Offer Details</div>
            <p className="title-sub-heading">
              View detailed submission for {offer.firstName} {offer.lastName}
            </p>
          </div>
          <button
            className="login-btn d-flex align-items-center gap-2"
            onClick={() => navigate("/saas-offers")}
          >
            <ArrowLeft size={16} /> Back to Offers
          </button>
        </div>

        <Breadcrumbs />

        {/* MAIN CARD CONTAINER */}
        <div className="custom-card bg-white p-4 mt-3 mb-4 position-relative">
        

          <h5 className="mb-4 text-dark fw-bold  pb-3">
            Submission Information & Offer Overview
          </h5>

          {/* APPLICANT DETAILS SECTION */}
          <div className="mb-4">
            <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
              <User size={18} /> Applicant Profile
            </h6>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Submission ID</label>
                <input
                  className="form-control bg-light"
                  value={offer._id}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Country of Interest</label>
                <input
                  className="form-control bg-light"
                  value={offer.countryOfInterest || "-"}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">First Name</label>
                <input
                  className="form-control bg-light text-capitalize"
                  value={offer.firstName}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Last Name</label>
                <input
                  className="form-control bg-light text-capitalize"
                  value={offer.lastName}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  className="form-control bg-light text-lowercase"
                  value={offer.email}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Mobile Number</label>
                <input
                  className="form-control bg-light"
                  value={offer.mobileNumber || "-"}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Website</label>
                <div className="input-group">
                  <input
                    className="form-control bg-light text-lowercase"
                    value={offer.website || "-"}
                    disabled
                  />
                  {offer.website && (
                    <a
                      href={offer.website}
                      target="_blank"
                      rel="noreferrer"
                      className=" btn-outline-secondary d-flex align-items-center justify-content-center px-3"
                      title="Open Website"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Submitted Date</label>
                <input
                  className="form-control bg-light"
                  value={formatDate(offer.submittedAt)}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* FINANCIAL PROPOSAL SECTION */}
          <div className="mb-4 border-top pt-4">
            <h6 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
              <DollarSign size={18} /> Financial & Investment Proposal
            </h6>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Offer Amount (USD)</label>
                <input
                  className="form-control bg-light fw-bold text-success"
                  value={formatCurrency(offer.amountUsd)}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Sales Share Percentage (%)</label>
                <input
                  className="form-control bg-light fw-bold text-primary"
                  value={offer.salesPercentage != null ? `${offer.salesPercentage}%` : "-"}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Platform Setup Budget</label>
                <input
                  className="form-control bg-light"
                  value={offer.platformSetup || "-"}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Marketing & Staff Budget</label>
                <input
                  className="form-control bg-light"
                  value={offer.marketingAndStaff || "-"}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* QUALIFICATIONS & EXPERIENCE SECTION */}
          <div className="mb-3 border-top pt-4">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Briefcase size={18} /> Experience & Capacity
            </h6>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label fw-semibold">Relevant Experience</label>
                <textarea
                  className="form-control bg-light"
                  rows={3}
                  value={offer.relevantExperience || "-"}
                  disabled
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label fw-semibold">PaxTrac Capacity & Capabilities</label>
                <textarea
                  className="form-control bg-light"
                  rows={3}
                  value={offer.paxtrac || "-"}
                  disabled
                />
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default ViewSaasOffer;
