import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import Swal from "sweetalert2";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FilterModal from "../../Components/FilterModal";

ModuleRegistry.registerModules([AllCommunityModule]);

const PropertyManagement = () => {
  const navigate = useNavigate();

  /* =======================
     STATIC DEMO DATA
  ======================= */
  const demoProperty = [
    {
      id: 1,
      propertyId: "PROP-001",
      propertyType: "Multi-Family",
      companyName: "Palm Residency Pvt Ltd",
      status: "under-review",
    },
    {
      id: 2,
      propertyId: "PROP-002",
      propertyType: "Vacation Rentals",
      companyName: "Goa Holiday Homes LLP",
      status: "approved",
    },
    {
      id: 3,
      propertyId: "PROP-003",
      propertyType: "Apartment Building",
      companyName: "Whitefield Tech Park Estates",
      status: "dealSealed",
    },
    {
      id: 4,
      propertyId: "PROP-004",
      propertyType: "Single Family",
      companyName: "Baner Realty Group",
      status: "rejected",
    },
    {
      id: 5,
      propertyId: "PROP-005",
      propertyType: "Condominium",
      companyName: "Mumbai Sea View Condos",
      status: "dealSealed",
    },
  ];

  /* =======================
     STATE
  ======================= */
  const [allData, setAllData] = useState(demoProperty);
  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    propertyType: "",
  });

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
  });

  /* =======================
     PAGINATION VALUES
  ======================= */
  const totalCount = allData.length;
  const totalPages = Math.ceil(totalCount / query.limit);
  const currentPage = query.page;
  const pageSize = query.limit;

  /* =======================
     SEARCH + FILTER + PAGINATION LOGIC
  ======================= */
  useEffect(() => {
    let filtered = [...demoProperty];

    // Search
    if (searchInput) {
      filtered = filtered.filter(
        (item) =>
          item.propertyId.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.propertyType.toLowerCase().includes(searchInput.toLowerCase()),
      );
    }

    // Filter
    if (filters.status) {
      filtered = filtered.filter((i) => i.status === filters.status);
    }

    if (filters.propertyType) {
      filtered = filtered.filter(
        (i) => i.propertyType === filters.propertyType,
      );
    }

    setAllData(filtered);

    // Pagination slice
    const start = (query.page - 1) * query.limit;
    const end = start + query.limit;
    setRowData(filtered.slice(start, end));
  }, [searchInput, filters, query]);

  /* =======================
     PAGINATION HANDLERS
  ======================= */
  const handlePageChange = (page) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size) => {
    setQuery({ page: 1, limit: size });
  };

  /* =======================
     DELETE
  ======================= */
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete property?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        setAllData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "Property deleted successfully.", "success");
      }
    });
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
  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (params) =>
          params.node.rowIndex + 1 + (currentPage - 1) * pageSize,
        width: 80,
      },
      {
        headerName: "Property ID",
        field: "propertyId",
        flex: 1,
        minWidth: 160,
      },
      {
        headerName: "Property Type",
        field: "propertyType",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Company Name",
        field: "companyName",
        flex: 2,
        minWidth: 100,
        cellStyle: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        tooltipField: "companyName",
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 140,
        cellRenderer: (p) => {
          const statusMap = {
            "under-review": { label: "Under review", className: "pending" },
            approved: { label: "Approved", className: "info" },
            dealSealed: { label: "Deal sealed", className: "" },
            rejected: { label: "Rejected", className: "inactive" },
          };

          const status = statusMap[p.value] || {};

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
                navigate(
                  `/property-management/view-property?id=${params.data.id}`,
                )
              }
            >
              <Eye size={18} />
            </button>
            |
            <button
              className="border-0 bg-transparent text-danger"
              onClick={() => handleDelete(params.data.id)}
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
            <div className="title-heading mb-2">Property Management</div>
            <p className="title-sub-heading">
              Monitor and manage registered Property
            </p>
          </div>
          <button
            className="primary-button"
            onClick={() => setShowFilter(true)}
          >
            Filter
          </button>
        </div>

        <Breadcrumbs />

        {/* SEARCH */}
        <div className="search-bar mb-4">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by property ID or type..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="custom-card bg-white p-3">
          {rowData.length === 0 ? (
            <NoData text="No property found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
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

      {/* FILTER MODAL */}
      <FilterModal
        show={showFilter}
        initialFilters={filters}
        onClose={() => setShowFilter(false)}
        onApply={(appliedFilters) => {
          setFilters(appliedFilters);
          setQuery((prev) => ({ ...prev, page: 1 }));
          setShowFilter(false);
        }}
      />
    </main>
  );
};

export default PropertyManagement;
