import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import FilterModal from "../../Components/FilterModal";
import Swal from "sweetalert2";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetPropertiesQuery,
  useDeletePropertyMutation,
} from "../../api/propertyApi";
import { LoadingComponent } from "../../Components/LoadingComponent";

ModuleRegistry.registerModules([AllCommunityModule]);

const ListingManagement = () => {
  const navigate = useNavigate();

  /* =======================
     STATE & DEBOUNCED SEARCH
  ======================= */
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    type: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        page: 1,
        search: searchInput,
      }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useGetPropertiesQuery(query);
  const allData = data?.data || [];
  const rowData = allData;
  const [deleteProperty] = useDeletePropertyMutation();

  const [filters, setFilters] = useState({
    status: "",
    propertyType: "",
  });
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const activeFilterCount = (filters.status ? 1 : 0) + (filters.propertyType ? 1 : 0);

  /* =======================
     PAGINATION VALUES
  ======================= */
  const totalCount = data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalCount / query.limit);
  const currentPage = query.page;
  const pageSize = query.limit;

  /* =======================
     FILTER HANDLERS
  ======================= */
  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({ status: "", propertyType: "" });
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: "",
      status: "",
      type: "",
    }));
  };

  /* =======================
     PAGINATION HANDLERS
  ======================= */
  const handlePageChange = (page) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      limit: size,
    }));
  };

  /* =======================
     DELETE
  ======================= */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete property?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteProperty(id).unwrap();

      Swal.fire("Deleted!", "Property deleted successfully.", "success");
    } catch (error) {
      Swal.fire(
        "Failed",
        error?.data?.message || "Failed to delete property",
        "error",
      );
    }
  };

  /* =======================
     HELPERS
  ======================= */
  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1,
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  /* =======================
     COLUMNS
  ======================= */
  const defaultColDef = useMemo(
    () => ({
      valueFormatter: (params) =>
        params.value !== undefined &&
        params.value !== null &&
        String(params.value).trim() !== ""
          ? params.value
          : "-",
    }),
    []
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (params) =>
          params.node.rowIndex + 1 + (currentPage - 1) * pageSize,
        width: 80,
      },
      {
        headerName: "Listing ID",
        field: "listingId",
        flex: 1,
        minWidth: 250,
      },

      {
        headerName: "Role",
        field: "role",
        flex: 1,
        minWidth: 200,
        valueGetter: (params) => {
          if (params.data?.ismanagerListing) return "Manager listing";
          if (params.data?.isvendorListing) return "Vendor listing";
          return params.data?.role || "-";
        },
      },
      {
        headerName: "Listing Type",
        field: "propertyType",
        flex: 1,
        minWidth: 200,
        valueGetter: (params) => {
          return (
            params.data?.propertyType ||
            params.data?.otherPropertyType ||
            params.data?.serviceCategoryType ||
            "-"
          );
        },
      },
      // {
      //   headerName: "Company Name",
      //   field: "propertyManagementCompanyName",
      //   flex: 2,
      //   minWidth: 100,
      //   cellStyle: {
      //     whiteSpace: "nowrap",
      //     overflow: "hidden",
      //     textOverflow: "ellipsis",
      //   },
      //   tooltipField: "propertyManagementCompanyName",
      // },
      {
        headerName: "Status",
        field: "status",
        minWidth: 140,
        cellRenderer: (p) => {
          if (!p.value || String(p.value).trim() === "") return "-";
          const statusMap = {
            "under-review": { label: "Under review", className: "pending" },
            contractPending: { label: "Contract Pending", className: "pending" },
            approved: { label: "Approved", className: "info" },
            dealSealed: { label: "Deal sealed", className: "" },
            rejected: { label: "Rejected", className: "inactive" },
          };

          const status = statusMap[p.value] || { label: p.value };

          return (
            <span className={`status-badge-table ${status.className || ""}`}>
              {status.label}
            </span>
          );
        },
      },

      {
        headerName: "Action",
        width: 140,
        cellRenderer: (params) => (
          <div className="d-flex gap-2">
            <button
              className="border-0 bg-transparent"
              onClick={() =>
                navigate(`/listing-management/view-listing/${params.data._id}`)
              }
            >
              <Pencil size={18} />
            </button>
            |
            <button
              className="border-0 bg-transparent text-danger"
              onClick={() => handleDelete(params.data._id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    [currentPage, pageSize],
  );

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="title-heading mb-2">Listing Management</div>
            <p className="title-sub-heading">
              Monitor and manage registered listings
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                className="button-secondary"
                style={{ height: "38px" }}
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            )}
            <button
              className="primary-button"
              onClick={() => setFilterModalOpen(true)}
              style={{ height: "38px" }}
            >
              Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
          </div>
        </div>

        <Breadcrumbs />

        {/* SEARCH BAR */}
        <div className="search-bar mb-4 position-relative">
          <input
            type="text"
            className="form-control ps-3 w-50"
            placeholder="Search by listing ID, type, role, status, date..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="custom-card bg-white p-3">
          {isLoading ? (
            <LoadingComponent isLoading fullScreen />
          ) : rowData.length === 0 ? (
            <NoData text="No listing found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  domLayout="autoHeight"
                  headerHeight={40}
                  rowHeight={48}
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
                  })}
                />
              </div>

              {/* ✅ CUSTOM PAGINATION */}
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </div>

        {/* FILTER MODAL */}
        <FilterModal
          show={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          initialFilters={filters}
          onApply={(appliedFilters) => {
            setFilters(appliedFilters);
            setQuery((prev) => ({
              ...prev,
              page: 1,
              status: appliedFilters.status,
              type: appliedFilters.propertyType,
            }));
            setFilterModalOpen(false);
          }}
        />
      </section>
    </main>
  );
};

export default ListingManagement;

