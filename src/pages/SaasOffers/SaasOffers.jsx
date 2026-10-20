import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Eye, FileText } from "lucide-react";
import { useGetSaasOffersQuery } from "../../api/userApi";
import { LoadingComponent } from "../../Components/LoadingComponent";

ModuleRegistry.registerModules([AllCommunityModule]);

export const MOCK_SAAS_OFFERS = [];

const SaasOffers = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: serverResponse, isLoading, isFetching } = useGetSaasOffersQuery({
    page: currentPage,
    limit: pageSize,
    search: searchInput,
  });

  const offers = useMemo(() => {
    if (serverResponse?.data && Array.isArray(serverResponse.data)) {
      return serverResponse.data;
    }
    return [];
  }, [serverResponse]);

  const totalCount = serverResponse?.total ?? offers.length;
  const totalPages = serverResponse?.totalPages ?? (Math.ceil(totalCount / pageSize) || 1);

  const handleDownloadPdf = (offerId) => {
    const token = localStorage.getItem("token") || "";
    const liveUrl = import.meta.env.VITE_LIVE_URL;
    const base = liveUrl
      ? liveUrl.replace(/\/+$/, "")
      : (import.meta.env.VITE_BASE_URL || "http://localhost:5050");
    const cleanBase = base.replace(/\/api\/admin\/?$/, "");
    const url = `${cleanBase}/api/admin/saas-offers/${offerId}/pdf?token=${encodeURIComponent(token)}`;
    window.open(url, "_blank");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const formatCurrency = (val) => {
    if (val == null || val === "") return "-";
    return `$${Number(val).toLocaleString()}`;
  };

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
          (currentPage - 1) * pageSize + params.node.rowIndex + 1,
        width: 80,
      },
      {
        headerName: "Applicant Name",
        flex: 1.5,
        minWidth: 180,
        valueGetter: (params) =>
          `${params.data?.firstName || ""} ${params.data?.lastName || ""}`.trim() || "-",
      },
      {
        headerName: "Email",
        field: "email",
        flex: 2,
        minWidth: 220,
        cellStyle: { textTransform: "lowercase" },
      },
      {
        headerName: "Mobile Number",
        field: "mobileNumber",
        flex: 1.2,
        minWidth: 150,
      },
      {
        headerName: "Country",
        field: "countryOfInterest",
        flex: 1.2,
        minWidth: 140,
      },
      {
        headerName: "Offer Amount",
        field: "amountUsd",
        flex: 1.2,
        minWidth: 140,
        cellRenderer: (params) => (
          <span className="fw-semibold text-success">
            {formatCurrency(params.value)}
          </span>
        ),
      },
      {
        headerName: "Sales Share",
        field: "salesPercentage",
        flex: 1,
        minWidth: 120,
        cellRenderer: (params) =>
          params.value != null ? `${params.value}%` : "-",
      },
      {
        headerName: "Submitted Date",
        field: "submittedAt",
        flex: 1.2,
        minWidth: 140,
        valueFormatter: (params) => formatDate(params.value),
      },
      {
        headerName: "Action",
        width: 120,
        cellRenderer: (params) => (
          <div className="d-flex align-items-center gap-3" style={{ height: "100%" }}>
            <button
              className="border-0 bg-transparent p-0 cursor-pointer"
              title="View Details"
              onClick={() => navigate(`/saas-offers/view/${params.data._id}`)}
            >
              <Eye size={18} style={{ color: "#a99068" }} />
            </button>
            <button
              className="border-0 bg-transparent p-0 cursor-pointer"
              title="Download SaaS PDF Report"
              onClick={() => handleDownloadPdf(params.data._id)}
            >
              <FileText size={18} style={{ color: "#0d6efd" }} />
            </button>
          </div>
        ),
      },
    ],
    [currentPage, pageSize, navigate]
  );

  const displayOffers = useMemo(() => {
    if (serverResponse?.totalPages !== undefined) {
      return offers;
    }
    const start = (currentPage - 1) * pageSize;
    return offers.slice(start, start + pageSize);
  }, [offers, serverResponse, currentPage, pageSize]);

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* HEADER */}
        <div className="mb-4">
          <div className="title-heading mb-2">SaaS Offers</div>
          <p className="title-sub-heading">
            Review and manage incoming SaaS partnership and platform offers
          </p>
        </div>

        <Breadcrumbs />

        {/* SEARCH BAR */}
        <div className="search-bar mb-4">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by name, email, country, or amount..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* TABLE CARD */}
        <div className="custom-card bg-white p-4">
          {isLoading ? (
            <LoadingComponent isLoading fullScreen />
          ) : displayOffers.length === 0 ? (
            <NoData text="No SaaS offers found" />
          ) : (
            <>
              <div
                className="ag-theme-alpine"
                style={{ width: "100%", overflowX: "auto" }}
              >
                <AgGridReact
                  theme="legacy"
                  rowData={displayOffers}
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

              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={(p) => setCurrentPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
                pageSizeOptions={[5, 10, 20]}
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default SaasOffers;
