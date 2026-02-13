import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye } from "lucide-react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import { useGetBidsQuery } from "../../api/userApi";
import BidManagementFilterModal from "../../Components/BidManagementFilterModal";

const initialProperties = [
  {
    id: "PROP-2026-001",
    propertyType: "Commercial",
    listerName: "Sarah Williams",
    status: "active",
    totalBidders: 5,
    email: "sarah.williams@prestigevacation.com",
    address: "123 Market Street, New York, NY",
  },
  {
    id: "PROP-2026-002",
    propertyType: "Vacation Rentals",
    listerName: "John Doe",
    status: "inactive",
    totalBidders: 2,
    email: "john.doe@sunriserealty.com",
    address: "45 Ocean Drive, Miami, FL",
  },
  {
    id: "PROP-2026-003",
    propertyType: "Multi-Family",
    listerName: "Michael Johnson",
    status: "active",
    totalBidders: 8,
    email: "michael.johnson@evergreenmf.com",
    address: "890 Pine Avenue, Seattle, WA",
  },
  {
    id: "PROP-2026-004",
    propertyType: "Commercial",
    listerName: "Emma Thompson",
    status: "request-reopen",
    totalBidders: 4,
    email: "emma.thompson@skyline.com",
    address: "77 Broadway, San Francisco, CA",
  },
];

const pageSizeOptions = [2, 3, 5, 10];

const BidManagement = () => {
  // Pagination state

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    propertyType: "",
  });

  const { data, isLoading, isError } = useGetBidsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchInput,
    status: filters.status,
    type: filters.propertyType,
  });
  // Data state (for flag toggle)
  const navigate = useNavigate();

  // Paginate Properties
  const properties = useMemo(() => {
    let filtered = data?.data;

    // Apply search
    if (searchInput) {
      const query = searchInput.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item?.id?.toLowerCase().includes(query) ||
          item?.propertyType?.toLowerCase().includes(query) ||
          item?.listerName?.toLowerCase().includes(query) ||
          item?.email?.toLowerCase().includes(query),
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(
        (item) => item.bidStatus?.toLowerCase() === filters.status.toLowerCase(),
      );
    }

    // Apply property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(
        (item) =>
          item.propertyType?.toLowerCase().trim() ===
          filters.propertyType.toLowerCase().trim(),
      );
    }

    return filtered;
  }, [data, searchInput, filters]);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  const totalCount = data?.pagination?.total;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Edit handler (for demo just show alert)
  const handleViewBid = (bid) => {
    navigate(`/bid-management/${bid._id}`, {
      state: {
        bid: {
          ...bid,
          bidTime: bid.bidTime ?? "2026-01-01 10:00",
        },
      },
    });
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        width: 80,
        valueGetter: (params) =>
          (currentPage - 1) * pageSize + params.node.rowIndex + 1,
        sortable: false,
      },
      {
        headerName: "Property ID",
        field: "_id",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Property Type",
        field: "propertyType",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Property Lister Name",
        field: "createdByName",
        flex: 1.5,
        minWidth: 250,
      },
      {
        headerName: "Bidding Status",
        field: "bidStatus",
        flex: 1,
        minWidth: 200,
        cellRenderer: (params) => {
          const status = params.value?.toLowerCase();

          const statusClass =
            status === "active"
              ? ""
              : status === "request-reopen"
                ? "pending"
                : "inactive";

          return (
            <span className={`status-badge-table ${statusClass}`}>
              {params.value}
            </span>
          );
        },
      },
      {
        headerName: "Total Bidders",
        field: "totalBidder",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1.5,
        minWidth: 300,
        cellStyle: {
          textTransform: "lowercase",
        },
      },
      {
        headerName: "Action",
        flex: 0.5,
        minWidth: 100,
        cellRenderer: (params) => (
          <Eye
            size={18}
            style={{ cursor: "pointer" }}
            title="View Bid"
            onClick={() => handleViewBid(params.data)}
          />
        ),
      },
    ],
    [currentPage, pageSize, navigate],
  );

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="title-heading mb-2">Bid Management</div>
            <p className="title-sub-heading"> Manage bids</p>
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
            placeholder="Search by property ID, type, lister, or email..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="custom-card bg-white p-4 mt-3">
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", overflowX: "auto" }}
          >
            <AgGridReact
              rowData={properties}
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

          {/* Custom Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      </section>

      <BidManagementFilterModal
        show={showFilter}
        onClose={() => setShowFilter(false)}
        initialFilters={filters}
        onApply={(data) => {
          setFilters(data);
          setCurrentPage(1);
          setShowFilter(false);
        }}
      />
    </main>
  );
};

export default BidManagement;
