import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import NoData from "../../Components/NoData";
import CustomPagination from "../../Components/CustomPagination";
import { useGetUsersQuery } from "../../api/userApi";
import { LoadingComponent } from "../../Components/LoadingComponent";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function VendorManagement() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useGetUsersQuery({
    role: "vendor",
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
  });

  const vendors = data?.data || [];
  const totalCount = data?.pagination?.total || 0;
  const totalPages =
    data?.pagination?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.NO.",
        valueGetter: (params) =>
          params.node.rowIndex + 1 + (currentPage - 1) * pageSize,
        minWidth: 80,
        flex: 0.5,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "Vendor Name",
        valueGetter: (params) =>
          `${params.data.firstName || ""} ${params.data.lastName || ""}`.trim() ||
          "N/A",
        minWidth: 180,
        flex: 1,
      },
      {
        headerName: "Email",
        field: "email",
        minWidth: 220,
        flex: 1.2,
        cellStyle: { textTransform: "lowercase" },
      },
      {
        headerName: "Phone",
        field: "mobileNumber",
        minWidth: 140,
        flex: 1,
        valueGetter: (params) => params.data.mobileNumber || "N/A",
      },
      {
        headerName: "Business Name",
        minWidth: 220,
        flex: 1.5,
        valueGetter: (params) =>
          params.data.VendorbusinessDetails?.[0]?.businessName ||
          params.data.position ||
          "-",
      },
      {
        headerName: "Number of Staff",
        minWidth: 140,
        flex: 1,
        valueGetter: (params) =>
          params.data.VendorbusinessDetails?.[0]?.numberOfStaff || "-",
      },
      {
        headerName: "Licensed",
        minWidth: 120,
        flex: 0.8,
        cellRenderer: (params) => {
          const isLicensed = Boolean(
            params.data.VendorbusinessDetails?.[0]?.propertyManagementLicense,
          );
          return (
            <span
              className={`status-badge-table ${isLicensed ? "" : "inactive"}`}
            >
              {isLicensed ? "Yes" : "No"}
            </span>
          );
        },
      },
      {
        headerName: "Action",
        minWidth: 100,
        flex: 0.8,
        cellRenderer: (params) => (
          <button
            className="btn p-0 bg-transparent border-0 text-start"
            title="View Vendor Details"
            onClick={() =>
              navigate(`/user-management/view-user/${params.data._id}`)
            }
          >
            <Eye size={18} />
          </button>
        ),
      },
    ],
    [currentPage, pageSize, navigate],
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="title-heading">Vendor Management</h1>
            <p className="title-sub-heading">
              Monitor registered vendors and review their business profiles
            </p>
          </div>
        </div>

        <Breadcrumbs />

        {/* Search Toolbar */}
        <div className="search-bar mb-4 position-relative">
          <input
            type="text"
            className="form-control ps-3 w-50"
            placeholder="Search vendors by name, email or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="custom-card bg-white p-3">
          {isLoading ? (
            <LoadingComponent isLoading fullScreen />
          ) : vendors.length === 0 ? (
            <NoData text="No vendors found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={vendors}
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
}
