import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2"; 

const BidView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bid, setBid] = useState(null);

  useEffect(() => {
    const passedBid = location.state?.bid;

    if (!passedBid) {
      Swal.fire({
        icon: "error",
        title: "Bid not found",
        confirmButtonColor: "#a99068",
      }).then(() => {
        navigate("/bid-management");
      });
    } else {
      setBid(passedBid);
    }
  }, [location, navigate]);

  if (!bid) return null;

  // For datetime-local input, convert "YYYY-MM-DD HH:mm" to "YYYY-MM-DDTHH:mm"
  const formattedBidTime = bid.bidTime.replace(" ", "T");

  const handleBidTimeChange = (e) => {
    setBid((prev) => ({ ...prev, bidTime: e.target.value.replace("T", " ") }));
  };

  const handleSaveChanges = () => {
    // TODO: API call to save changes here
    Swal.fire({
      icon: "success",
      title: "Changes saved",
      text: "Bid time updated successfully.",
      confirmButtonColor: "#a99068",
    }).then(() => {
      navigate("/bid-management");
    });
  };

  const handleFlagToggle = () => {
    const newStatus = bid.status === "Flagged" ? "Pending" : "Flagged";
    // TODO: API call to update flag status here

    Swal.fire({
      icon: "info",
      title: `Bid ${newStatus === "Flagged" ? "flagged" : "unflagged"}`,
      text: `Bid status changed to ${newStatus}.`,
      confirmButtonColor: "#a99068",
    }).then(() => {
      navigate("/bid-management");
    });
  };

  return (
    <main className="app-content body-bg">
      <section className="container py-4 position-relative">
        <div className="title-heading mb-2">View Bid</div>
        <p className="title-sub-heading">Bid details for {bid.firmName}</p>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3 position-relative">
          {/* Status badge (visible only if flagged) */}
          {bid.status === "Flagged" && (
            <span className="status-badge position-absolute inactive">
              {bid.status}
            </span>
          )}

          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Bid ID</label>
              <input
                type="text"
                className="form-control"
                value={bid.id}
                disabled
                readOnly
              />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Firm Name</label>
              <input
                type="text"
                className="form-control"
                value={bid.firmName}
                disabled
                readOnly
              />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Bid Amount</label>
              <input
                type="number"
                className="form-control"
                value={bid.bidAmount}
                disabled
                readOnly
              />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Property Type</label>
              <input
                type="text"
                className="form-control"
                value={bid.propertyType}
                disabled
                readOnly
              />
            </div>
            {/* <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Status</label>
              <input
                type="text"
                className="form-control"
                value={bid.status}
                disabled
                readOnly
              />
            </div> */}
            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Bid Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formattedBidTime}
                onChange={handleBidTimeChange}
                onClick={(e) => e.target.showPicker?.()}  
                onFocus={(e) => e.target.showPicker?.()}   
              />
            </div>
          </div>

          <div className="d-flex gap-2 align-items-center mt-2">
            <button className="login-btn" onClick={handleSaveChanges}>
              Save Changes
            </button>
            <button className="button-secondary" onClick={handleFlagToggle}>
              {bid.status === "Flagged" ? "Unflag this bid" : "Flag this bid"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BidView;
