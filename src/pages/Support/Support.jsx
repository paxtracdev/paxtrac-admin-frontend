import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { Modal, Form } from "react-bootstrap";
import { Eye, MessageSquare, Building2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import SupportStatusDropdown from "../../Components/SupportStatusDropdown";
import { LoadingComponent } from "../../Components/LoadingComponent";
import {
  useGetSupportQuery,
  useSupportMutation,
  useGetContactUsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactUsMutation,
} from "../../api/userApi";

ModuleRegistry.registerModules([AllCommunityModule]);



const Support = () => {
  // Tab state: "general" | "listing"
  const [activeTab, setActiveTab] = useState("general");

  // General Page state
  const [generalPage, setGeneralPage] = useState(1);
  const [generalPageSize, setGeneralPageSize] = useState(10);

  // Listing Support API pagination & search
  const [listingPage, setListingPage] = useState(1);
  const [listingPageSize, setListingPageSize] = useState(10);

  // Search input state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Modal & Selection State
  const [openModal, setOpenModal] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setGeneralPage(1);
      setListingPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // RTK Query for General Support / Contact Us Inquiries
  const { data: contactApiData, isLoading: isContactLoading } =
    useGetContactUsQuery(
      {
        page: generalPage,
        limit: generalPageSize,
        search: debouncedSearch,
      },
      { skip: activeTab !== "general" },
    );

  const [updateContactStatus] = useUpdateContactStatusMutation();
  const [deleteContactUs] = useDeleteContactUsMutation();

  const generalSupportData = contactApiData?.data || [];
  const generalTotalCount = contactApiData?.pagination?.total || 0;
  const generalTotalPages = contactApiData?.pagination?.totalPages || 1;

  // RTK Query for Listing Support Requests
  const { data: listingApiData, isLoading: isListingLoading } = useGetSupportQuery(
    {
      page: listingPage,
      pageSize: listingPageSize,
      search: debouncedSearch,
    },
    { skip: activeTab !== "listing" },
  );

  const [supportMutation] = useSupportMutation();

  const listingSupportData = listingApiData?.data || [];
  const listingTotalCount = listingApiData?.pagination?.total || 0;
  const listingTotalPages = Math.ceil(listingTotalCount / listingPageSize) || 1;

  // General Support Status Change Handler
  const handleGeneralStatusChange = async (value, rowData, node) => {
    if (value === "success") {
      const { value: resolutionText, isConfirmed } = await Swal.fire({
        title: "Resolve Support Request",
        html: `
          <div style="text-align: left; font-size: 14px; color: #475569; margin-bottom: 12px;">
            Please enter a resolution description explaining how this issue was resolved for <strong>${rowData.userName || rowData.name || "this user"}</strong>:
          </div>
        `,
        input: "textarea",
        inputPlaceholder: "Explain the issue and resolution (e.g., We looked into your inquiry and updated your property settings. The issue is now resolved)...",
        inputAttributes: {
          rows: 4,
          style: "font-size: 14px; border-radius: 8px; border-color: #cbd5e1; resize: vertical;",
        },
        showCancelButton: true,
        confirmButtonText: "Resolve Request",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#a99068",
        cancelButtonColor: "#6c757d",
        inputValidator: (val) => {
          if (!val?.trim()) {
            return "Please enter a resolution description before marking as resolved.";
          }
        },
      });

      if (isConfirmed && resolutionText?.trim()) {
        try {
          await updateContactStatus({
            id: rowData._id || rowData.id,
            status: "success",
            resolutionNotes: resolutionText.trim(),
          }).unwrap();

          node.setData({
            ...rowData,
            status: "success",
            resolutionNotes: resolutionText.trim(),
          });

          Swal.fire({
            title: "Resolved!",
            text: "General support request marked as resolved successfully.",
            icon: "success",
            confirmButtonColor: "#a99068",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err) {
          Swal.fire({
            title: "Error",
            text: err?.data?.message || "Failed to update status",
            icon: "error",
            confirmButtonColor: "#a99068",
          });
        }
      }
    }
  };

  // General Support Delete Handler
  const handleDeleteGeneralSupport = (rowData) => {
    Swal.fire({
      title: "Delete Support Request?",
      text: `Are you sure you want to delete inquiry from "${rowData.userName || rowData.name || "this user"}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteContactUs(rowData._id || rowData.id).unwrap();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "General support request deleted successfully.",
            timer: 1800,
            showConfirmButton: false,
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err?.data?.message || "Failed to delete support inquiry.",
            confirmButtonColor: "#a99068",
          });
        }
      }
    });
  };

  // Listing Support Status Change Handler
  const handleListingStatusChange = async (value, rowData, node) => {
    if (value === "success") {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to mark this listing support request as resolved?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#a99068",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Resolve it!",
      });

      if (result.isConfirmed) {
        try {
          const response = await supportMutation(rowData._id).unwrap();
          node.setData({ ...rowData, status: "success" });

          Swal.fire({
            title: "Resolved!",
            text: response?.message || "Listing support resolved successfully",
            icon: "success",
            confirmButtonColor: "#a99068",
          });
        } catch (err) {
          console.error("Support update error:", err);
          Swal.fire({
            title: "Error",
            text:
              err?.data?.message ||
              err?.error ||
              "Failed to update support status",
            icon: "error",
            confirmButtonColor: "#a99068",
          });
        }
      }
    }
  };

  // Column Definitions for Tab 1: General Support
  const generalColumnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        width: 80,
        valueGetter: (p) => (generalPage - 1) * generalPageSize + p.node.rowIndex + 1,
      },
      {
        headerName: "User Name",
        field: "userName",
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: "User Email",
        field: "userEmail",
        cellStyle: { textTransform: "lowercase" },
        minWidth: 200,
        flex: 1.2,
      },
      {
        headerName: "Message",
        field: "message",
        minWidth: 240,
        flex: 1.8,
        valueGetter: (p) =>
          p.data.message
            ? p.data.message.length > 60
              ? p.data.message.slice(0, 60) + "..."
              : p.data.message
            : "-",
      },
      {
        headerName: "Submitted On",
        minWidth: 130,
        flex: 0.9,
        valueGetter: (p) =>
          p.data.createdAt
            ? new Date(p.data.createdAt).toLocaleDateString()
            : "-",
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 160,
        cellRenderer: SupportStatusDropdown,
        cellRendererParams: {
          options: [
            { value: "pending", label: "Pending" },
            { value: "success", label: "Resolved" },
          ],
          lockAfter: "success",
          onChange: handleGeneralStatusChange,
        },
      },
      {
        headerName: "Action",
        width: 100,
        cellRenderer: (params) => (
          <div className="d-flex align-items-center gap-2 h-100">
            <button
              className="btn p-0 bg-transparent border-0"
              title="View Details"
              onClick={() => {
                setSelectedSupport(params.data);
                setOpenModal(true);
              }}
            >
              <Eye size={18} />
            </button>
            <button
              className="btn p-0 bg-transparent border-0 text-danger"
              title="Delete Request"
              onClick={() => handleDeleteGeneralSupport(params.data)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    [generalPage, generalPageSize],
  );

  // Column Definitions for Tab 2: Listing Support
  const listingColumnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        width: 80,
        valueGetter: (p) => (listingPage - 1) * listingPageSize + p.node.rowIndex + 1,
      },
      {
        headerName: "User Name",
        valueGetter: (params) => {
          const first = params.data?.userId?.firstName || "";
          const last = params.data?.userId?.lastName || "";
          return `${first} ${last}`.trim() || "-";
        },
        minWidth: 160,
        flex: 1,
      },
      {
        headerName: "User Email",
        cellStyle: { textTransform: "lowercase" },
        minWidth: 220,
        flex: 1.2,
        valueGetter: (params) => params.data?.userId?.email || "-",
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 160,
        cellRenderer: SupportStatusDropdown,
        cellRendererParams: {
          options: [
            { value: "pending", label: "Pending" },
            { value: "success", label: "Resolved" },
          ],
          lockAfter: "success",
          onChange: handleListingStatusChange,
        },
      },
      {
        headerName: "Action",
        width: 100,
        cellRenderer: (params) => (
          <button
            className="btn p-0 bg-transparent border-0"
            title="View Details"
            onClick={() => {
              setSelectedSupport(params.data);
              setOpenModal(true);
            }}
          >
            <Eye size={18} />
          </button>
        ),
      },
    ],
    [listingPage, listingPageSize],
  );

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* Title Header */}
        <div className="title-heading mb-2">Support Management</div>
        <p className="title-sub-heading">
          Review and resolve general user support requests and listing edit support queries
        </p>

        <Breadcrumbs />

        {/* Segmented Tab Bar */}
        <div
          className="d-inline-flex p-1 rounded-3 mb-3 gap-2 border shadow-sm"
          style={{ backgroundColor: "#f8f5f0", borderColor: "#e7e0d5" }}
        >
          <button
            type="button"
            className=" btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2 rounded-2 border-0"
            style={{
              backgroundColor: activeTab === "general" ? "#a99068" : "transparent",
              color: activeTab === "general" ? "#ffffff" : "#6c757d",
              boxShadow:
                activeTab === "general"
                  ? "0 2px 6px rgba(169, 144, 104, 0.35)"
                  : "none",
              transition: "all 0.2s ease-in-out",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={() => {
              setActiveTab("general");
              setSearch("");
            }}
          >
            <MessageSquare size={16} />
            General Support Requests
          </button>

          <button
            type="button"
            className=" px-3 py-2 fw-semibold d-flex align-items-center gap-2 rounded-2 border-0"
            style={{
              backgroundColor: activeTab === "listing" ? "#a99068" : "transparent",
              color: activeTab === "listing" ? "#ffffff" : "#6c757d",
              boxShadow:
                activeTab === "listing"
                  ? "0 2px 6px rgba(169, 144, 104, 0.35)"
                  : "none",
              transition: "all 0.2s ease-in-out",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={() => {
              setActiveTab("listing");
              setSearch("");
            }}
          >
            <Building2 size={16} />
            Listing Support Requests
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder={
              activeTab === "general"
                ? "Search general support by user, email, or subject..."
                : "Search listing support requests..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table Content */}
        <div className="custom-card bg-white p-3">
          {activeTab === "general" ? (
            /* TAB 1: General Support Requests */
            isContactLoading ? (
              <LoadingComponent isLoading fullScreen />
            ) : generalSupportData.length === 0 ? (
              <NoData text="No general support requests found" />
            ) : (
              <>
                <div className="ag-theme-alpine">
                  <AgGridReact
                    rowData={generalSupportData}
                    columnDefs={generalColumnDefs}
                    headerHeight={40}
                    rowHeight={48}
                    domLayout="autoHeight"
                    getRowStyle={(params) => ({
                      backgroundColor:
                        params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
                    })}
                  />
                </div>

                <CustomPagination
                  currentPage={generalPage}
                  totalPages={generalTotalPages}
                  totalCount={generalTotalCount}
                  pageSize={generalPageSize}
                  onPageChange={setGeneralPage}
                  onPageSizeChange={(size) => {
                    setGeneralPageSize(size);
                    setGeneralPage(1);
                  }}
                />
              </>
            )
          ) : (
            /* TAB 2: Listing Support Requests */
            isListingLoading ? (
              <LoadingComponent isLoading fullScreen />
            ) : listingSupportData.length === 0 ? (
              <NoData text="No listing support requests found" />
            ) : (
              <>
                <div className="ag-theme-alpine">
                  <AgGridReact
                    rowData={listingSupportData}
                    columnDefs={listingColumnDefs}
                    headerHeight={40}
                    rowHeight={48}
                    domLayout="autoHeight"
                    getRowStyle={(params) => ({
                      backgroundColor:
                        params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
                    })}
                  />
                </div>

                <CustomPagination
                  currentPage={listingPage}
                  totalPages={listingTotalPages}
                  totalCount={listingTotalCount}
                  pageSize={listingPageSize}
                  onPageChange={setListingPage}
                  onPageSizeChange={(size) => {
                    setListingPageSize(size);
                    setListingPage(1);
                  }}
                />
              </>
            )
          )}
        </div>

        {/* View Details Modal */}
        <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
          <Modal.Header closeButton className="border-bottom">
            <Modal.Title className="h5 fw-bold">
              {activeTab === "general"
                ? "General Support Request Details"
                : "Listing Support Request Details"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4">
            {selectedSupport && (
              <>
                <div className="mb-3">
                  <label className="fw-semibold text-muted small">User Name</label>
                  <div className="fw-bold">
                    {selectedSupport.userName ||
                      selectedSupport.name ||
                      `${selectedSupport?.userId?.firstName || ""} ${
                        selectedSupport?.userId?.lastName || ""
                      }`.trim() ||
                      "N/A"}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold text-muted small">User Email</label>
                  <div className="fw-semibold text-primary">
                    <a
                      href={`mailto:${selectedSupport.userEmail || selectedSupport.email || selectedSupport?.userId?.email || ""}`}
                      className="text-decoration-none"
                    >
                      {selectedSupport.userEmail || selectedSupport.email || selectedSupport?.userId?.email || "N/A"}
                    </a>
                  </div>
                </div>

                {selectedSupport.createdAt && (
                  <div className="mb-3">
                    <label className="fw-semibold text-muted small">Submitted On</label>
                    <div className="text-muted small">
                      {new Date(selectedSupport.createdAt).toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="fw-semibold text-muted small">Status</label>
                  <div>
                    <span
                      className={`badge ${
                        selectedSupport.status === "success" || selectedSupport.status === "resolved"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {selectedSupport.status === "success" || selectedSupport.status === "resolved"
                        ? "Resolved"
                        : "Pending"}
                    </span>
                  </div>
                </div>

                {selectedSupport.subject && (
                  <div className="mb-3">
                    <label className="fw-semibold text-muted small">Subject</label>
                    <div className="fw-semibold text-dark">{selectedSupport.subject}</div>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-muted small">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={selectedSupport.message || "No message content provided."}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>

                {selectedSupport.resolutionNotes && (
                  <div
                    className="p-3 rounded-3 mt-3"
                    style={{
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <label
                      className="fw-bold small d-flex align-items-center gap-1 mb-1"
                      style={{ color: "#166534" }}
                    >
                      ✓ Resolution Details
                    </label>
                    <div
                      className="small"
                      style={{ color: "#1e293b", whiteSpace: "pre-wrap" }}
                    >
                      {selectedSupport.resolutionNotes}
                    </div>
                    {selectedSupport.resolvedAt && (
                      <div className="text-muted small mt-2" style={{ fontSize: "11px" }}>
                        Resolved on: {new Date(selectedSupport.resolvedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </Modal.Body>

          <Modal.Footer className="border-top">
            <button
              className="button-secondary"
              onClick={() => setOpenModal(false)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </section>
    </main>
  );
};

export default Support;
