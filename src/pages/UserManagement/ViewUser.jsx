import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";

// Static data simulating users and their business info (ideally you would fetch this)
const STATIC_USERS = [
  {
    _id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone: "9876543210",
    role: "vendor",
    status: "active",
    registrationDate: "2025-12-01",
    businessDetails: {
      ownerName: "John Doe Enterprises",
      ownerAddress: "123 Main St, Cityville",
      employees: 25,
      unitsOwned: 100,
      startYear: 2010,
      capexBudget: "$1,000,000",
      geographicAreas: "Cityville, Region A",
      propertyTypes: ["Apartment", "Commercial", "Vacation Rentals"],
      propertyPortfolio:
        "We own multiple apartment buildings and commercial properties focused on mid-sized urban developments.",
    },
  },
  {
    _id: "2",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    phone: "9876500000",
    role: "manager",
    status: "inactive",
    registrationDate: "2026-01-10",
    businessDetails: {
      ownerName: "Smith Property Group",
      ownerAddress: "456 Elm St, Townsville",
      employees: 10,
      unitsOwned: 50,
      startYear: 2015,
      capexBudget: "$500,000",
      geographicAreas: "Townsville, Region B",
      propertyTypes: ["Single Family", "Multi-Family"],
      propertyPortfolio:
        "Focused on residential single and multi-family homes in suburban areas.",
    },
  }, 
  {
    _id: "3",
    first_name: "Michael",
    last_name: "Brown",
    email: "michael.brown@example.com",
    phone: "9123456789",
    role: "vendor",
    status: "active",
    registrationDate: "2026-01-15",
    businessDetails: {
      ownerName: "Brown Realty Solutions",
      ownerAddress: "789 Oak Ave, Metropolis",
      employees: 18,
      unitsOwned: 75,
      startYear: 2012,
      capexBudget: "$750,000",
      geographicAreas: "Metropolis, Region C",
      propertyTypes: ["Commercial", "Office Space"],
      propertyPortfolio:
        "Specializing in property acquisition and leasing of office and mixed-use commercial spaces.",
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

  if (!user) return ;

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
                value={new Date(registrationDate).toLocaleDateString("en-GB")}
                disabled
                readOnly
              />
            </div>
          </div>

          {/* Business Details */}
          <h4 className="mb-3">Business Details</h4>

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
                List the geographic areas that you focus on
              </label>
              <input
                type="text"
                className="form-control"
                value={businessDetails.geographicAreas}
                disabled
                readOnly
                placeholder="Geographic areas"
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Types of property
              </label>
              <div className="d-flex flex-wrap gap-2">
                {businessDetails.propertyTypes.map((type, i) => (
                  <span
                    key={i}
                    className="service-chip"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Property Portfolio
              </label>
              <textarea
                className="form-control"
                rows={4}
                value={businessDetails.propertyPortfolio}
                disabled
                readOnly
                placeholder="Property Portfolio"
              ></textarea>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewUser;
