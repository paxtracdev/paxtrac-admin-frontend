import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { Modal, Form } from "react-bootstrap";
import { Eye, Search } from "lucide-react";
import Loader from "../../Components/Loader";
import Swal from "sweetalert2";
import SupportStatusDropdown from "../../Components/SupportStatusDropdown";

ModuleRegistry.registerModules([AllCommunityModule]);

const STATIC_SUPPORT_DATA = [
  {
    id: "1",
    userName: "John Doe",
    userEmail: "john@example.com",
    message: "I am unable to login with my credentials.",
    status: "pending",
  },
  {
    id: "2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    message: "My payment failed but amount was deducted.",
    status: "resolved",
  },
  {
    id: "3",
    userName: "Alex Brown",
    userEmail: "alex@example.com",
    message: "App crashes when opening dashboard.",
    status: "pending",
  },
];

const Support = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyModal, setReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [statusRow, setStatusRow] = useState(null);
  const [replyError, setReplyError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredData = useMemo(() => {
    return STATIC_SUPPORT_DATA.filter(
      (item) =>
        item.userName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [debouncedSearch]);

  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const handleCloseReplyModal = () => {
    setReplyModal(false);
    setReplyText("");
    setReplyError("");
    setStatusRow(null);
  };

  useEffect(() => {
    if (replyModal) {
      setReplyText("");
      setReplyError("");
    }
  }, [replyModal]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (p) => p.node.rowIndex + 1 + (page - 1) * pageSize,
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
        minWidth: 250,
        flex: 1,
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 160,
        cellRenderer: SupportStatusDropdown,
        cellRendererParams: {
          options: [
            { value: "pending", label: "Pending" },
            { value: "resolved", label: "Resolved" },
          ],
          lockAfter: "resolved",
          onChange: (value, rowData, node) => {
            if (value === "resolved") {
              setStatusRow({ rowData, node });
              setReplyModal(true);
            }
          },
        },
      },
      {
        headerName: "Action",
        minWidth: 120,
        cellRenderer: (params) => (
          <Eye
            size={18}
            style={{ cursor: "pointer" }}
            title="View Message"
            onClick={() => {
              setSelectedSupport(params.data);
              setOpenModal(true);
            }}
          />
        ),
      },
    ],
    [page, pageSize],
  );

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-2">Support</div>
        <p className="title-sub-heading">
          Review user support requests and queries
        </p>

        <Breadcrumbs />

        {/* Search */}
        <div className="search-bar mb-4 position-relative">
          <input
            type="text"
            className="form-control ps-3 w-50"
            placeholder="Search support requests..."
            value={search}
            autoFocus
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="custom-card bg-white p-3">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <Loader size="lg" color="logo" />
            </div>
          ) : paginatedData.length === 0 ? (
            <NoData text="No support found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={paginatedData}
                  columnDefs={columnDefs}
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
                currentPage={page}
                totalPages={totalPages}
                totalData={totalCount}
                rowsPerPage={pageSize}
                handlePageChange={setPage}
                handleRowsPerPageChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            </>
          )}
        </div>

        {/* View Modal */}
        <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
          <Modal.Body>
            <Form.Group>
              <Form.Label className="fw-semibold">Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={selectedSupport?.message || ""}
                readOnly
                disabled
              />
            </Form.Group>

            <div className="text-end mt-4">
              <button
                className="button-secondary"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>

        {/* reply modal  */}
        <Modal show={replyModal} onHide={handleCloseReplyModal} centered>
          <Modal.Body className="p-3">
            <h5 className="text-center">Reply to User</h5>
            <Form.Group className="py-3">
              <Form.Label className="fw-semibold">
                Reply <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter reply..."
                value={replyText}
                onChange={(e) => {
                  setReplyText(e.target.value);
                  if (replyError) setReplyError("");
                }}
                isInvalid={!!replyError}
              />
              {replyError && (
                <div className="text-danger mt-1">{replyError}</div>
              )}
            </Form.Group>
            <div className="d-flex align-items-center justify-content-end gap-2 mt-2">
              <button
                className="button-secondary"
                onClick={handleCloseReplyModal}
              >
                Cancel
              </button>

              <button
                className="button-primary"
                onClick={() => {
                  if (!replyText.trim()) {
                    setReplyError("Reply is required");
                    return;
                  }

                  // update grid value safely
                  statusRow.node.setDataValue("status", "resolved");

                  Swal.fire({
                    title: "Resolved",
                    text: "Support resolved successfully",
                    icon: "success",
                    confirmButtonColor: "#a99068",
                  });

                  handleCloseReplyModal();
                }}
              >
                Mark Resolved
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </main>
  );
};

export default Support;
