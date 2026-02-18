import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { MessageCircleMore } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import CustomPagination from "../../Components/CustomPagination";
import { Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useGetBidIndivisualQuery } from "../../api/userApi";
import { useStartBidMutation } from "../../api/userApi";
import { useBiddersQuery } from "../../api/userApi";
import { useBroadcastBiddersMutation } from "../../api/userApi";
import { useBroadcastBidderMutation } from "../../api/userApi";

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
  const [BidTime] = useStartBidMutation();
  const [broadcastBidders] = useBroadcastBiddersMutation();
  const [broadcastBidder] = useBroadcastBidderMutation();

  const location = useLocation();
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
    if (data?.data) {
      setBid(data.data[0]);
    }
  }, [data]);

  if (!bid) return null;

  // For datetime-local input, convert "YYYY-MM-DD HH:mm" to "YYYY-MM-DDTHH:mm"
  const formattedBidTime = bid.bidTime
    ? new Date(bid.bidTime).toISOString().slice(0, 16)
    : "";

  const formattedBidEndTime = bid.bidTime
    ? new Date(bid.bidEndTime).toISOString().slice(0, 16)
    : bid.bidDuration
      ? new Date(new Date(bid.bidDuration).getTime() + 60 * 60 * 1000)
          .toISOString()
          .slice(0, 16)
      : ""; // default to 1 hour after bidTime

  const handleBidTimeChange = (e) => {
    setBidTime(e.target.value);
  };

  const handleSaveChanges = async () => {
    const isoBidTime = new Date(bidTime).toISOString(); // converts local time to UTC ISO format

    const payload = {
      bidId: bid.propertyId,
      bidTime: isoBidTime,
    };
    try {
      // Call your API mutation
      await BidTime(payload).unwrap(); // assuming you have useStartBidMutation
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Bid details updated successfully.",
        confirmButtonColor: "#a99068",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update bid time",
        confirmButtonColor: "#a99068",
      });
    }
  };

  const handleCloseBidding = async () => {
    try {
      // Call backend to close the bid
      await endBidding({ bidId: bid.id }).unwrap();

      // Update UI
      setBid((prev) => ({ ...prev, status: "inactive" }));

      Swal.fire({
        icon: "success",
        title: "Bidding Closed",
        text: "Bidding has been closed successfully.",
        confirmButtonColor: "#a99068",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to close bidding",
        confirmButtonColor: "#a99068",
      });
    }
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

        <div className="custom-card bg-white p-4 mt-3 mb-4 position-relative">
          {/* Status badge */}
          <span
            className={`status-badge  ${bid.status !== "active" ? "inactive" : ""}`}
          >
            {bid.status}
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
            <button className="login-btn" onClick={openBroadcastModal}>
              Broadcast
            </button>
          </div>
          <div className="ag-theme-alpine">
            <AgGridReact
              rowData={filteredBidders}
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



