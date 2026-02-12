import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { MessageCircleMore } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import CustomPagination from "../../Components/CustomPagination";
import { Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const BidView = () => {
  const mockBidders = [
    {
      bidderId: "BIDDER-001",
      name: "Alpha Constructions",
      email: "alpha@build.com",
      bidAmount: 120000,
      status: "shortlisted",
    },
    {
      bidderId: "BIDDER-002",
      name: "Zenith Infra",
      email: "zenith@infra.com",
      bidAmount: 125000,
      status: "not shortlisted",
    },
    {
      bidderId: "BIDDER-003",
      name: "Nova Builders",
      email: "nova@builders.com",
      bidAmount: 118000,
      status: "winner",
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const [bidders, setBidders] = useState(mockBidders);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "broadcast" | "bidder"
  const [messageText, setMessageText] = useState("");
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [messageError, setMessageError] = useState("");

  const [bid, setBid] = useState(null);

  useEffect(() => {
    const passedBid = location.state?.bid;

    if (!passedBid) {
      navigate("/bid-management");
    } else {
      setBid(passedBid);
    }
  }, [location, navigate]);

  if (!bid) return null;

  // For datetime-local input, convert "YYYY-MM-DD HH:mm" to "YYYY-MM-DDTHH:mm"
  const formattedBidTime = bid.bidTime ? bid.bidTime.replace(" ", "T") : "";
  const formattedBidEndTime = bid.bidEndTime
    ? bid.bidEndTime.replace(" ", "T")
    : new Date(new Date(bid.bidTime).getTime() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16); // default to 1 hour after bidTime

  const handleBidTimeChange = (e) => {
    const value = e.target.value;
    setBid((prev) => ({
      ...prev,
      bidTime: value ? value.replace("T", " ") : "",
    }));
  };

  const handleSaveChanges = () => {
    Swal.fire({
      icon: "success",
      title: "Saved",
      text: "Bid details updated successfully.",
      confirmButtonColor: "#a99068",
    });
  };

  const handleCloseBidding = () => {
    setBid((prev) => ({ ...prev, status: "inactive" }));

    Swal.fire({
      icon: "success",
      title: "Bidding Closed",
      text: "Bidding has been closed successfully.",
      confirmButtonColor: "#a99068",
    });
  };

  const handleReopenBidding = () => {
    setBid((prev) => ({ ...prev, status: "active" }));

    Swal.fire({
      icon: "success",
      title: "Bidding Reopened",
      text: "Bidding has been reopened successfully.",
      confirmButtonColor: "#a99068",
    });
  };

  const bidderColumnDefs = [
    {
      headerName: "S.No",
      width: 80,
      valueGetter: (params) => params.node.rowIndex + 1,
    },
    {
      headerName: "Bidder ID",
      field: "bidderId",
      flex: 1,
    },
    {
      headerName: "Bidder Name",
      field: "name",
      flex: 1.5,
    },
    {
      headerName: "Bidder Email",
      field: "email",
      flex: 1.5,
      cellStyle: { textTransform: "lowercase" },
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      cellRenderer: (params) => {
        const value = params.value?.toLowerCase();

        return (
          <span
            className={`status-badge-table ${
              value === "not shortlisted"
                ? "inactive"
                : value === "shortlisted"
                  ? "info"
                  : ""
            }`}
          >
            {params.value}
          </span>
        );
      },
    },

    {
      headerName: "Bid Amount",
      field: "bidAmount",
      flex: 1,
    },
    {
      headerName: "Action",
      width: 100,
      cellRenderer: (params) => (
        <MessageCircleMore
          size={18}
          style={{ cursor: "pointer" }}
          title="Message Bidder"
          onClick={() => openMessageModal(params.data)}
        />
      ),
    },
  ];

  const openBroadcastModal = () => {
    setModalType("broadcast");
    setSelectedBidder(null);
    setMessageText("");
    setMessageError("");
    setShowModal(true);
  };

  const openMessageModal = (bidder) => {
    setModalType("bidder");
    setSelectedBidder(bidder);
    setMessageText("");
    setMessageError("");
    setShowModal(true);
  };

  const handleSendMessage = () => {
    // TODO: API call here

    if (!messageText.trim()) {
      setMessageError("Message is required");
      return;
    }
    // console.log({
    //   type: modalType,
    //   bidder: selectedBidder,
    //   message: messageText,
    // });

    setShowModal(false);
    setMessageText("");
    setMessageError("");
    setSelectedBidder(null);

    Swal.fire({
      icon: "success",
      title: "Message sent",
      text:
        modalType === "broadcast"
          ? "Broadcast message sent successfully."
          : `Message sent to ${selectedBidder?.name}`,
      confirmButtonColor: "#a99068",
    });
  };

  return (
    <main className="app-content body-bg">
      <section className="container py-4 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="title-heading mb-2">View Bid</div>
            <p className="title-sub-heading">
              <p className="title-sub-heading">
                Bid details for {bid.holderName}
              </p>{" "}
            </p>
          </div>
        </div>

        <div className="title-heading mb-2"></div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3 position-relative">
          {/* Status badge */}
          <span
            className={`status-badge  ${bid.status !== "active" ? "inactive" : ""}`}
          >
            {bid.status}
          </span>

          <div className="row mt-2">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Property ID</label>
              <input className="form-control" value={bid.id} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Property Type</label>
              <input
                className="form-control"
                value={bid.propertyType}
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Property Holder Name
              </label>
              <input className="form-control" value={bid.listerName} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Total Bidders</label>
              <input
                className="form-control"
                value={bid.totalBidders}
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                className="form-control text-lowercase"
                value={bid.email}
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Bid Duration</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formattedBidEndTime}
                disabled
                readOnly
              />
            </div>

            <div className="col-md-6 mb-3">
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

            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Property Address</label>
              <textarea
                className="form-control"
                rows={3}
                value={bid.address || "-"}
                disabled
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button className="login-btn" onClick={handleSaveChanges}>
              Save Changes
            </button>

            {bid.status !== "active" ? (
              <button
                className="button-secondary"
                onClick={handleReopenBidding}
              >
                Reopen
              </button>
            ) : (
              <button className="button-secondary" onClick={handleCloseBidding}>
                Close this Bidding
              </button>
            )}
          </div>
        </div>

        <div className="custom-card bg-white p-4 mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Bidding Details</h5>
            <button className="login-btn" onClick={openBroadcastModal}>
              Broadcast
            </button>
          </div>
          <div className="ag-theme-alpine">
            <AgGridReact
              rowData={bidders}
              columnDefs={bidderColumnDefs}
              domLayout="autoHeight"
              headerHeight={40}
              rowHeight={48}
              getRowStyle={(params) => ({
                backgroundColor:
                  params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
              })}
            />
          </div>

          <CustomPagination
            currentPage={1}
            totalPages={1}
            totalCount={bidders.length}
            pageSize={10}
            pageSizeOptions={[5, 10]}
          />
        </div>

        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setMessageText("");
            setMessageError("");
            setSelectedBidder(null);
          }}
          centered
        >
          <Modal.Body>
            <Modal.Title className="fw-light text-center mb-3">
              {modalType === "broadcast"
                ? "Broadcast Message"
                : `Message to ${selectedBidder?.name}`}
            </Modal.Title>

            <Form.Group>
              <Form.Label className="fw-semibold">Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  setMessageError("");
                }}
                placeholder="Type your message..."
              />
              {messageError && (
                <div className="text-danger mt-1">{messageError}</div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                className="button-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>

              <button className="login-btn" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </main>
  );
};

export default BidView;
