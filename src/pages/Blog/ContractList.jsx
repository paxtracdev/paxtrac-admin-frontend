import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { BLOG_DATA } from "./BlogStaticData";
import Swal from "sweetalert2";
import { useContractsQuery } from "../../api/userApi";
import { useDeleteContractMutation } from "../../api/userApi";
import { LoadingComponent } from "../../Components/LoadingComponent";

const ContractList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [contract, setContract] = useState(BLOG_DATA);
  const { data, isLoading, error, refetch } = useContractsQuery();
  const [deleteContract] = useDeleteContractMutation();

  /* Filter */
  const filteredData = useMemo(() => {
    const list = data?.data || [];
    if (!search.trim()) return list;
    const term = search.toLowerCase().trim();
    return list.filter((b) => {
      const title =
        b?.contractForm ||
        b?.versions?.[0]?.contractForm ||
        b?.title ||
        b?.name ||
        "";
      return title.toLowerCase().includes(term);
    });
  }, [data, search]);

  /* Pagination calculations */
  const totalCount = filteredData?.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData?.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  /* Handlers */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // reset page on size change
  };

  /* Columns */
  const columnDefs = [
    {
      headerName: "S.No",
      width: 90,
      valueGetter: (p) => (currentPage - 1) * pageSize + p.node.rowIndex + 1,
    },
    {
      headerName: "Title",
      valueGetter: (params) =>
        params.data?.contractForm ||
        params.data?.versions?.[0]?.contractForm ||
        params.data?.title ||
        "-",
      flex: 1.5,
    },
    //     {
    //   headerName: "Status",
    //   field: "status",
    //   flex: 1,
    //   cellRenderer: (params) => {
    //     const isDraft = params.value === "Draft";

    //     return (
    //       <span
    //         className={`status-badge-table ${isDraft ? "pending" : ""}`}
    //       >
    //         {params.value}
    //       </span>
    //     );
    //   },
    // },
    {
      headerName: "Created At",
      flex: 1.2,
      valueGetter: (p) => new Date(p.data.createdAt).toLocaleDateString(),
    },
    {
      headerName: "Version",
      width: 110,
      valueGetter: (p) => `v${p.data?.versions?.[0]?.version || 1}`,
    },
    {
      headerName: "Actions",
      width: 130,
      cellRenderer: (params) => {
        const titleText =
          params.data?.versions?.[0]?.contractForm ||
          params.data?.contractForm ||
          "Contract";

        const handleDelete = async () => {
          const result = await Swal.fire({
            title: "Are you sure?",
            text: `You want to delete "${titleText}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#a99068",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete",
          });
          if (!result.isConfirmed) return;
          try {
            await deleteContract(params.data._id).unwrap();

            Swal.fire({
              title: "Deleted!",
              text: "Contract has been deleted successfully",
              icon: "success",
              confirmButtonColor: "#a99068",
            });
          } catch (err) {
            Swal.fire({
              title: "Error",
              text: err?.data?.message || "Failed to delete contract",
              icon: "error",
            });
          }
        };

        return (
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn p-0 bg-transparent border-0"
              title="View / Edit"
              onClick={() =>
                navigate(`/contracts/${params.data._id}`, {
                  state: { contract: params.data },
                })
              }
            >
              <Pencil size={18} />
            </button>
            <button
              className="btn p-0 bg-transparent border-0 text-danger"
              title="Delete"
              onClick={handleDelete}
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="title-heading">Contract Management</div>
            <p className="title-sub-heading ">Manage all contract</p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/contracts/add")}
          >
            Add contract
          </button>
        </div>

        <Breadcrumbs />

        {/* 🔍 Search */}
        <div className="search-bar mb-3">
          <input
            className="form-control w-50"
            placeholder="Search by contract title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* 📋 Table */}
        <div className="custom-card bg-white p-3">
          {isLoading ? (
            <LoadingComponent isLoading fullScreen />
          ) : error ? (
            <div className="text-center py-5">
              <p className="text-muted mb-2">Failed to load contracts. The server might have been reloading.</p>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </div>
          ) : paginatedData?.length === 0 ? (
            <NoData text="No contract found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={paginatedData}
                  columnDefs={columnDefs}
                  rowHeight={48}
                  headerHeight={40}
                  domLayout="autoHeight"
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
                  })}
                />
              </div>

              {/* ✅ SAME CustomPagination AS PROPERTY */}
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

export default ContractList;
