import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Eye } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

/* =======================
   STATIC DEMO DATA (SaaS Offers)
======================= */
export const MOCK_SAAS_OFFERS = [
  {
    _id: "6ac5fb2e832a8c3cd39dac47",
    firstName: "test",
    lastName: "saas",
    email: "testsaas@gmail.com",
    mobileNumber: "2563987452",
    countryOfInterest: "India",
    amountUsd: 19998,
    salesPercentage: 15,
    platformSetup: "Over $100,000",
    marketingAndStaff: "$50,000 – $100,000",
    relevantExperience: "i have 20 yrs of experience",
    paxtrac: "leadership , technical capacity",
    website: "http://www.test.com",
    confirmation: true,
    submittedAt: "2026-10-07T07:56:30.311Z",
    createdAt: "2026-10-07T07:56:30.312Z",
    updatedAt: "2026-10-07T07:56:30.312Z",
  },
  {
    _id: "6ac5fb2e832a8c3cd39dac48",
    firstName: "Alexander",
    lastName: "Wright",
    email: "alex.wright@globalrealty.io",
    mobileNumber: "+1 415 892 3410",
    countryOfInterest: "United States",
    amountUsd: 45000,
    salesPercentage: 20,
    platformSetup: "Over $100,000",
    marketingAndStaff: "Over $100,000",
    relevantExperience: "Managed large scale commercial real estate platforms in US & UK with 15+ years enterprise growth.",
    paxtrac: "strategic partnership, leadership & technical capacity",
    website: "http://www.globalrealty.io",
    confirmation: true,
    submittedAt: "2026-10-06T14:30:00.000Z",
    createdAt: "2026-10-06T14:30:00.000Z",
    updatedAt: "2026-10-06T14:30:00.000Z",
  },
  {
    _id: "6ac5fb2e832a8c3cd39dac49",
    firstName: "Sofia",
    lastName: "Chen",
    email: "sofia.chen@apacventures.com",
    mobileNumber: "+65 9123 4567",
    countryOfInterest: "Singapore",
    amountUsd: 28500,
    salesPercentage: 12.5,
    platformSetup: "$50,000 – $100,000",
    marketingAndStaff: "$25,000 – $50,000",
    relevantExperience: "12 years tech leadership & SaaS growth operations across Southeast Asia markets.",
    paxtrac: "regional execution & technical capacity",
    website: "http://www.apacventures.com",
    confirmation: true,
    submittedAt: "2026-10-05T11:15:00.000Z",
    createdAt: "2026-10-05T11:15:00.000Z",
    updatedAt: "2026-10-05T11:15:00.000Z",
  },
  {
    _id: "6ac5fb2e832a8c3cd39dac50",
    firstName: "Carlos",
    lastName: "Mendoza",
    email: "carlos.m@latamproptech.com",
    mobileNumber: "+52 55 1234 5678",
    countryOfInterest: "Mexico",
    amountUsd: 15000,
    salesPercentage: 10,
    platformSetup: "$25,000 – $50,000",
    marketingAndStaff: "$10,000 – $25,000",
    relevantExperience: "8 years proptech founder & operations lead in Latin America.",
    paxtrac: "local market expansion & sales capacity",
    website: "http://www.latamproptech.com",
    confirmation: false,
    submittedAt: "2026-10-04T09:20:00.000Z",
    createdAt: "2026-10-04T09:20:00.000Z",
    updatedAt: "2026-10-04T09:20:00.000Z",
  },
];

const SaasOffers = () => {
  const navigate = useNavigate();
  const [offers] = useState(MOCK_SAAS_OFFERS);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtered data
  const filteredOffers = useMemo(() => {
    if (!searchInput.trim()) return offers;
    const query = searchInput.toLowerCase();
    return offers.filter(
      (item) =>
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.countryOfInterest?.toLowerCase().includes(query) ||
        item.mobileNumber?.toLowerCase().includes(query) ||
        item.amountUsd?.toString().includes(query)
    );
  }, [offers, searchInput]);

  const totalCount = filteredOffers.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOffers.slice(start, start + pageSize);
  }, [filteredOffers, currentPage, pageSize]);

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
        width: 100,
        cellRenderer: (params) => (
          <button
            className="border-0 bg-transparent text-primary p-0"
            title="View Details"
            onClick={() => navigate(`/saas-offers/view/${params.data._id}`)}
          >
            <Eye size={18} style={{ color: "#a99068" }} />
          </button>
        ),
      },
    ],
    [currentPage, pageSize, navigate]
  );

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
          {paginatedOffers.length === 0 ? (
            <NoData text="No SaaS offers found" />
          ) : (
            <>
              <div
                className="ag-theme-alpine"
                style={{ width: "100%", overflowX: "auto" }}
              >
                <AgGridReact
                  theme="legacy"
                  rowData={paginatedOffers}
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
