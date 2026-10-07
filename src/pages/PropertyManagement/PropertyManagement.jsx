import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import Swal from "sweetalert2";
import { Eye, Pencil, Trash2, FilterX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../../Components/CustomDropdown";
import {
  useGetPropertiesQuery,
  useDeletePropertyMutation,
} from "../../api/propertyApi";
import { LoadingComponent } from "../../Components/LoadingComponent";

ModuleRegistry.registerModules([AllCommunityModule]);

/* =======================
   FILTER OPTIONS
======================= */
const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Under review", value: "under-review" },
  { label: "Contract Pending", value: "contractPending" },
  { label: "Deal sealed", value: "dealSealed" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const PROPERTY_TYPE_OPTIONS = [
  { label: "All Listing Types", value: "" },
  { label: "Multi-Family", value: "Multi-Family" },
  { label: "Vacation Rentals", value: "Vacation Rentals" },
  { label: "Apartment Building", value: "Apartment Building" },
  { label: "HOA Condo", value: "HOA Condo" },
  { label: "HOA Single Family", value: "HOA Single Family" },
  { label: "Co-op", value: "Co-op" },
  { label: "REO", value: "REO" },
  { label: "Commercial", value: "Commercial" },
  { label: "Single Family", value: "Single Family" },
  { label: "Single Family (portfolio)", value: "Single Family (portfolio)" },
  { label: "Other", value: "Other" },
];

const ListingManagement = () => {
  const navigate = useNavigate();

  /* =======================
     STATIC DEMO DATA
  ======================= */
  const demoProperty = [
    {
      id: 1,
      listingId: "PROP-001",
      listingType: "Multi-Family",
      companyName: "Palm Residency Pvt Ltd",
      status: "under-review",
    },
    {
      id: 2,
      listingId: "PROP-002",
      listingType: "Vacation Rentals",
      companyName: "Goa Holiday Homes LLP",
      status: "approved",
    },
    {
      id: 3,
      listingId: "PROP-003",
      listingType: "Apartment Building",
      companyName: "Whitefield Tech Park Estates",
      status: "dealSealed",
    },
    {
      id: 4,
      listingId: "PROP-004",
      listingType: "Single Family",
      companyName: "Baner Realty Group",
      status: "rejected",
    },
    {
      id: 5,
      listingId: "PROP-005",
      listingType: "Condominium",
      companyName: "Mumbai Sea View Condos",
      status: "dealSealed",
    },
  ];

  /* =======================
     STATE
  ======================= */

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    type: "",
  });
  const { data, isLoading } = useGetPropertiesQuery(query);
  const allData = data?.data || [];
  const rowData = allData;
  const [deleteProperty] = useDeletePropertyMutation();

  const [filters, setFilters] = useState({
    status: "",
    propertyType: "",
  });

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
  const handleStatusChange = (statusValue) => {
    setFilters((prev) => ({ ...prev, status: statusValue }));
    setQuery((prev) => ({
      ...prev,
      page: 1,
      status: statusValue,
    }));
  };

  const handleTypeChange = (typeValue) => {
    setFilters((prev) => ({ ...prev, propertyType: typeValue }));
    setQuery((prev) => ({
      ...prev,
      page: 1,
      type: typeValue,
    }));
  };

  const handleClearFilters = () => {
    setFilters({ status: "", propertyType: "" });
    setQuery((prev) => ({
      ...prev,
      page: 1,
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
        valueFormatter: (params) =>
          params.value && String(params.value).trim() !== ""
            ? params.value
            : "-",
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
        <div className="mb-4">
          <div className="title-heading mb-2">Listing Management</div>
          <p className="title-sub-heading">
            Monitor and manage registered listings
          </p>
        </div>

        <Breadcrumbs />

        {/* SEARCH & FILTERS TOOLBAR */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div className="search-bar flex-grow-1" style={{ maxWidth: "380px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by listing ID or type..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setQuery((prev) => ({
                  ...prev,
                  page: 1,
                  search: e.target.value,
                }));
              }}
            />
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            {/* STATUS FILTER DROPDOWN */}
            <div style={{ minWidth: "200px" }}>
              <CustomDropdown
                placeholder="All Status"
                value={filters.status}
                options={STATUS_OPTIONS}
                onChange={handleStatusChange}
              />
            </div>

            {/* LISTING TYPE FILTER DROPDOWN */}
            {/* <div style={{ minWidth: "220px" }}>
              <CustomDropdown
                placeholder="All Listing Types"
                value={filters.propertyType}
                options={PROPERTY_TYPE_OPTIONS}
                onChange={handleTypeChange}
              />
            </div> */}

            {/* CLEAR FILTERS */}
            {/* {(filters.status || filters.propertyType) && (
              <button
                className="btn btn-outline-secondary d-flex align-items-center gap-1"
                style={{
                  height: "42px",
                  borderRadius: "8px",
                  borderColor: "#a99068",
                  color: "#a99068",
                  fontWeight: "500",
                }}
                onClick={handleClearFilters}
              >
                <FilterX size={16} />
                Clear
              </button>
            )} */}
          </div>
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
      </section>
    </main>
  );
};

export default ListingManagement;

