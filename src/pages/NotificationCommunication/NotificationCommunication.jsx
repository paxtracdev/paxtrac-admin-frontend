import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomDropdown from "../../Components/CustomDropdown";
import { Eye, Trash2 } from "lucide-react";
import {
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAnnouncementByIdQuery,
  useGetAnnouncementsQuery,
} from "../../api/notificationApi";
import Loader from "../../Components/Loader";
import { ReadMoreCell } from "../../Components/ReadMoreCell";

ModuleRegistry.registerModules([AllCommunityModule]);
const notiTypeOptions = [
  { label: "General Notification", value: "general" },
  { label: "Promotional Offer", value: "promotion" },
  { label: "System Update", value: "system_update" },
  { label: "Important Update", value: "Important Update" },
  { label: "Maintenance Notice", value: "Maintenance Notice" },
];

const prioritytyOptions = [
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const NotificationCommunication = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [notiType, setNotiType] = useState("");
  const [prorityType, SetProrityType] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { data, isLoading } = useGetAnnouncementsQuery({
    page,
    limit: pageSize,
    search,
  });
  const {
    data: singleNotification,
    isLoading: isLoadingSingle,
    error,
  } = useGetAnnouncementByIdQuery(selectedId, {
    skip: !selectedId,
  });
  const [createAnnouncement, { isLoading: isSending }] =
    useCreateAnnouncementMutation();

  const [deleteNotification] = useDeleteAnnouncementMutation();

  const notifications = data?.data?.announcements || [];
  const pagination = data?.data?.pagination || {};

  const totalCount = pagination.total || 0;
  const totalPages = pagination.pages || 1;

  const paginatedData = useMemo(() => {
    return notifications;
  }, [notifications]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // SUBMIT
  const handleSubmit = async () => {
    if (!title.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }

    if (!message.trim()) {
      Swal.fire("Error", "Message is required", "error");
      return;
    }

    if (!notiType) {
      Swal.fire("Error", "Please select notification type", "error");
      return;
    }

    if (!prorityType) {
      Swal.fire("Error", "Please select priority type", "error");
      return;
    }
    try {
      await createAnnouncement({
        title,
        message,
        type: notiType,
        priority: prorityType,
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Notification sent successfully!",
        icon: "success",
        timer: 3000, // ⏱ auto close in 3 sec
        showConfirmButton: true,
        timerProgressBar: true,
      });
      // Reset form
      setTitle("");
      setMessage("");
      setNotiType("");
      SetProrityType("");
    } catch (error) {
      Swal.fire("Error", "Failed to send notification", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      Swal.fire("Error", "Invalid event ID", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Delete Announcement?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await deleteNotification(id).unwrap();
        Swal.fire("Deleted!", "Announcement removed successfully.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete event", "error");
      }
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedId(null);
  };

  const statusStyles = {
    sent: {
      background: "#DCFCE7",
      color: "#166534",
    },
    scheduled: {
      background: "#DBEAFE",
      color: "#1E40AF",
    },
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.NO.",
        minWidth: 100,
        flex: 1,
        valueGetter: (p) => p.node.rowIndex + 1 + (page - 1) * pageSize,
      },
      {
        headerName: "Title",
        field: "title",
        flex: 1,
        minWidth: 200,
        flex: 1,
        wrapText: true,
        autoHeight: true,
        cellRenderer: ReadMoreCell,
      },

      { headerName: "Type", field: "type", minWidth: 200, flex: 1 },
      {
        headerName: "Target Audience",
        field: "targetAudience",
        minWidth: 200,
        flex: 1,
      },
      { headerName: "Priority", field: "priority", minWidth: 200, flex: 1 },
      {
        headerName: "Status",
        field: "status",
        minWidth: 160,
        flex: 1,
        cellRenderer: (params) => {
          const status = params.value?.toLowerCase();
          const style = statusStyles[status] || {
            background: "#E5E7EB",
            color: "#374151",
          };

          return (
            <span
              style={{
                backgroundColor: style.background,
                color: style.color,
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "capitalize",
                display: "inline-block",
                minWidth: "90px",
                textAlign: "center",
              }}
            >
              {status}
            </span>
          );
        },
      },

      {
        headerName: "Scheduled For",
        field: "scheduledFor",
        minWidth: 200,
        flex: 1,
        valueFormatter: (p) =>
          p.value ? new Date(p.value).toLocaleDateString("en-GB") : "N/A",
      },
      {
        headerName: "Sent At",
        field: "sentAt",
        minWidth: 200,
        flex: 1,
        valueFormatter: (p) =>
          p.value ? new Date(p.value).toLocaleDateString("en-GB") : "N/A",
      },
      {
        headerName: "Action",
        minWidth: 120,
        flex: 1,
        cellRenderer: (params) => (
          <div className="d-flex gap-3">
            <button className="border-0 bg-transparent" title="View">
              <Eye
                size={18}
                style={{ cursor: "pointer" }}
                title="View"
                onClick={() => {
                  setSelectedId(params.data.id);
                  setOpenModal(true);
                }}
              />
            </button>
            |
            <button className="border-0 bg-transparent" title="Delete">
              <Trash2
                size={18}
                className="text-danger"
                title="Delete"
                style={{ cursor: "pointer" }}
                onClick={() => handleDelete(params.data.id)}
              />
            </button>
          </div>
        ),
      },
    ],
    [page, pageSize]
  );

  if (isLoading) {
    return (
      <section className="app-content h-full overflow-auto">
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          <Loader size="lg" color="logo" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="app-content">
        <div className="container">
          <NoData
            text="Notifications not found"
            imageWidth={300}
            showImage={true}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">
              Notification & Communication
            </div>
            <p className="title-sub-heading">
              Send in-app notifications and view recent communication
            </p>
          </div>
        </div>

        <Breadcrumbs />

        {/* FORM CARD */}
        <div className="custom-card bg-white p-4 mb-4">
          <div className="row">
            {/* title */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Type your title..."
                value={title}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            {/* Custom Dropdown */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Notification Type <span className="text-danger">*</span>
              </label>

              <CustomDropdown
                options={notiTypeOptions}
                placeholder="Select notification type"
                value={notiType}
                onChange={setNotiType}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Priority <span className="text-danger">*</span>
              </label>

              <CustomDropdown
                options={prioritytyOptions}
                placeholder="Select priority"
                value={prorityType}
                onChange={SetProrityType}
              />
            </div>
            {/* Message */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Message <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="col-md-12">
              <button
                className="primary-button card-btn"
                onClick={handleSubmit}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Notification"}
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-bar mb-3">
          <input
            type="text"
            className="form-control ps-3"
            placeholder="Search notifications..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="custom-card bg-white p-3">
          <h5 className="mb-3">Recent Notifications</h5>

          {isLoading ? (
            <p className="text-center">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <NoData text="No notifications found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={paginatedData}
                  columnDefs={columnDefs}
                  headerHeight={40}
                  rowHeight={50}
                  domLayout="autoHeight"
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#0061ff10" : "white",
                  })}
                />
              </div>

              <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            </>
          )}
        </div>

        {/* VIEW MODAL */}
        <Modal show={openModal} onHide={handleClose} centered>
          <Modal.Body>
            <Modal.Title className="title fw-light text-center mb-3">
              {selectedNotification?.type || ""}
            </Modal.Title>

            <Form.Group>
              <Form.Label className="fw-semibold">Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={singleNotification?.data?.message || ""}
                readOnly
              />
            </Form.Group>

            <div className="text-end mt-4">
              <button
                className="button-secondary"
                onClick={() => setOpenModal(false)}
              >
                {" "}
                Close{" "}
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </main>
  );
};

export default NotificationCommunication;
