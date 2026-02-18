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
import { useGetSupportQuery } from "../../api/userApi";
import { useSupportMutation } from "../../api/userApi";

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
  const { data, isError } = useGetSupportQuery({
    page,
    pageSize,
    search: debouncedSearch,
  });

  const supportData = data?.data || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);
  const [support, { isLoading }] = useSupportMutation();

  const filteredData = useMemo(() => {
    return STATIC_SUPPORT_DATA.filter(
      (item) =>
        item.userName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [debouncedSearch]);

  const totalCount = data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (p) => p.node.rowIndex + 1 + (page - 1) * pageSize,
      },
      {
        headerName: "User Name",
        valueGetter: (params) => {
          const first = params.data?.userId?.firstName || "";
          const last = params.data?.userId?.lastName || "";
          return `${first} ${last}`.trim();
        },
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: "User Email",
        cellStyle: { textTransform: "lowercase" },
        minWidth: 250,
        flex: 1,
        valueGetter: (params) => params.data?.userId?.email || "",
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 160,
        cellRenderer: SupportStatusDropdown,
        valueFormatter: (params) => {
          if (params.value === "success") return "Resolved";
          return (
            params?.value?.charAt(0).toUpperCase() + params?.value?.slice(1)
          ); // Capitalize others
        },
        cellRendererParams: {
          options: [
            { value: "pending", label: "Pending" },
            { value: "success", label: "Resolved" },
          ],

          lockAfter: "success",
          onChange: async (value, rowData, node) => {
            if (value === "success") {
              const result = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to mark this support as resolved?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#a99068",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Resolve it!",
              });

              if (result.isConfirmed) {
                try {
                  const response = await support(rowData._id).unwrap();

                  // Update row safely by creating a new object
                  node.setData({ ...rowData, status: "success" });

                  Swal.fire({
                    title: "Resolved!",
                    text: response?.message || "Support resolved successfully",
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
          ) : supportData.length === 0 ? (
            <NoData text="No support found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={supportData}
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
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
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
      </section>
    </main>
  );
};

export default Support;
