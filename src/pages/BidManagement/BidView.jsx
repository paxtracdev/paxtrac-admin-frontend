import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { MessageCircleMore } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import CustomPagination from "../../Components/CustomPagination";
import { Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  useGetBidIndivisualQuery,
  useStartBidMutation,
  useCloseBidMutation,
  useBiddersQuery,
  useBroadcastBiddersMutation,
  useBroadcastBidderMutation,
} from "../../api/userApi";

const formatToLocalDateTimeLocal = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

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
  const { id } = useParams();
  const { data, isLoading, isError } = useGetBidIndivisualQuery(id, {
    skip: !id,
  });
  const [BidTime, { isLoading: isReopening }] = useStartBidMutation();
  const [closeBid, { isLoading: isClosing }] = useCloseBidMutation();
  const [broadcastBidders] = useBroadcastBiddersMutation();
  const [broadcastBidder] = useBroadcastBidderMutation();

  const location = useLocation();
  const bidStatusFromList = location.state?.bidStatus;
  const [bidStatus, setBidStatus] = useState(bidStatusFromList || "");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: dataList, isLoading: biddersLoading } = useBiddersQuery(
    {
      bidId: id,
      page,
      limit,
      search,
    },
    { skip: !id },
  );
  const bidders = dataList?.bidders || [];

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "broadcast" | "bidder"
  const [messageText, setMessageText] = useState("");
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [messageError, setMessageError] = useState("");
  const [bidTime, setBidTime] = useState(""); // for datetime-local input

  const [bid, setBid] = useState(null);

  const filteredBidders = bidders.filter((b) => {
    const query = search.toLowerCase();
    return (
      b?.bidderId?.toLowerCase().includes(query) ||
      b?.name?.toLowerCase().includes(query) ||
      b?.email?.toLowerCase().includes(query) ||
      b?.status?.toLowerCase().includes(query) ||
      b?.bidAmount?.toString().includes(query)
    );
  });

  useEffect(() => {
    if (data?.data && data.data[0]) {
      const b = data.data[0];
      setBid(b);
      if (b.bidStatus) {
        setBidStatus(b.bidStatus);
      } else if (
        b.status === "approved" &&
        b.bidDuration &&
        new Date(b.bidDuration) >= new Date()
      ) {
        setBidStatus("active");
      } else {
        setBidStatus("inactive");
      }

      if (b.bidDuration) {
        const localFormatted = formatToLocalDateTimeLocal(b.bidDuration);
        if (localFormatted) {
          setBidTime(localFormatted);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (bidStatusFromList && !bidStatus) {
      setBidStatus(bidStatusFromList);
    }
  }, [bidStatusFromList, bidStatus]);

  if (!bid) return null;

  const currentDeadline = bid.bidDuration
    ? formatToLocalDateTimeLocal(bid.bidDuration)
    : "";

  const handleBidTimeChange = (e) => {
    setBidTime(e.target.value);
  };

  const handleSaveChanges = async () => {
    if (!bidTime) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a valid bidding deadline date and time.",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    const dateObj = new Date(bidTime);
    if (isNaN(dateObj.getTime())) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid date format",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    if (dateObj.getTime() <= Date.now()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Deadline",
        text: "The bidding deadline must be set to a future date and time.",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    const isoBidTime = dateObj.toISOString();

    const payload = {
      bidId: bid.propertyId,
      bidTime: isoBidTime,
      bidEndTime: isoBidTime,
    };
    try {
      await BidTime(payload).unwrap();
      setBid((prev) => ({
        ...prev,
        bidDuration: isoBidTime,
        status: "approved",
      }));
      setBidStatus("active");
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Bidding deadline updated successfully.",
        confirmButtonColor: "#a99068",
      });
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to update bidding deadline.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#a99068",
      });
    }
  };

  const handleCloseBidding = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will close bidding on this property immediately.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a99068",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, close bidding",
    });

    if (!result.isConfirmed) return;

    try {
      await closeBid(bid.propertyId).unwrap();

      // Update UI state
      setBid((prev) => ({
        ...prev,
        status: "under-review",
        bidDuration: new Date().toISOString(),
      }));
      setBidStatus("inactive");

      Swal.fire({
        icon: "success",
        title: "Bidding Closed",
        text: "Bidding has been closed successfully.",
        confirmButtonColor: "#a99068",
      });
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to close bidding";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#a99068",
      });
    }
  };

  const handleReopenBidding = async () => {
    if (!bidTime) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a bidding deadline to reopen bidding.",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    const dateObj = new Date(bidTime);
    if (isNaN(dateObj.getTime())) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid date format",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    if (dateObj.getTime() <= Date.now()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Deadline",
        text: "The new bidding deadline must be set to a future date and time.",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    const isoBidTime = dateObj.toISOString();

    const payload = {
      bidId: bid.propertyId,
      bidTime: isoBidTime,
      bidEndTime: isoBidTime,
      bidStartTime: new Date().toISOString(),
    };

    try {
      await BidTime(payload).unwrap();
      setBid((prev) => ({
        ...prev,
        status: "approved",
        bidDuration: isoBidTime,
        biddingStartAt: new Date().toISOString(),
      }));
      setBidStatus("active");

      Swal.fire({
        icon: "success",
        title: "Bidding Reopened",
        text: "Bidding has been reopened and is now available for vendors.",
        confirmButtonColor: "#a99068",
      });
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to reopen bidding";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#a99068",
      });
    }
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
      flex: 1.5,
      valueGetter: (params) =>
        `${params.data?.firstName || ""} ${params.data?.lastName || ""}`.trim(),
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

  const handleSendMessage = async () => {
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

    try {
      if (modalType === "broadcast") {
        await broadcastBidders({
          propertyId: bid.propertyId,
          text: messageText,
        }).unwrap();
      } else {
        await broadcastBidder({
          propertyId: bid.propertyId,
          bidderId: selectedBidder.bidderId,
          text: messageText,
        }).unwrap();
      }

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
            : `Message sent to ${selectedBidder?.firstName || ""}`,
        confirmButtonColor: "#a99068",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send message",
        confirmButtonColor: "#a99068",
      });
    }
  };

  return (
    <main className="app-content body-bg">
      <section className="container py-4 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="title-heading mb-2">Bid Details</div>
            <p className="title-sub-heading">
              Monitor and manage bid details
            </p>
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3 mb-4 position-relative">
          {/* Status badge */}
          <span
            className={`status-badge  ${bidStatus?.toLowerCase() !== "active" ? "inactive" : ""}`}
          >
            {bidStatus || "-"}
          </span>

          <div className="row mt-2">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Property ID</label>
              <input className="form-control" value={bid.propertyId} disabled />
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
              <input
                className="form-control"
                value={bid.firstName + " " + bid.lastName}
                disabled
              />
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
              <label className="form-label fw-semibold">Current Bidding Deadline</label>
              <input
                type="datetime-local"
                className="form-control"
                value={currentDeadline}
                disabled
                readOnly
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Extend / Reopen Bidding Deadline</label>
              <input
                type="datetime-local"
                className="form-control"
                value={bidTime}
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
                value={bid.servicePropertyAddress || "-"}
                disabled
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              className="login-btn"
              onClick={handleSaveChanges}
              disabled={isReopening}
            >
              {isReopening ? "Saving..." : "Save Changes"}
            </button>

            {bidStatus?.toLowerCase() !== "active" ? (
              <button
                className="button-secondary"
                onClick={handleReopenBidding}
                disabled={isReopening}
              >
                {isReopening ? "Reopening..." : "Reopen"}
              </button>
            ) : (
              <button
                className="button-secondary"
                onClick={handleCloseBidding}
                disabled={isClosing}
              >
                {isClosing ? "Closing..." : "Close this Bidding"}
              </button>
            )}
          </div>
        </div>

        <div className="search-bar mb-3 w-50">
          <input
            type="text"
            className="form-control ps-3"
            placeholder="Search bidders by name, id, email, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="custom-card bg-white p-4 mt-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Bidding Details</h5>
            {/* <button className="login-btn" onClick={openBroadcastModal}>
              Broadcast
            </button> */}
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
            currentPage={page}
            totalPages={dataList?.totalPages || 1}
            totalCount={dataList?.total || 0}
            pageSize={limit}
            pageSizeOptions={[5, 10]}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => {
              setLimit(s);
              setPage(1);
            }}
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
