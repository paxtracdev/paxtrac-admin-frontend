import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { VLOG_DATA } from "./VlogStaticData";
import Swal from "sweetalert2";
import { usePlansQuery } from "../../api/userApi";
const PlanList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: plans, isLoading } = usePlansQuery(id);

  const filteredData = useMemo(() => {
    return plans?.data?.filter((v) =>
      v.planName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [plans, search]);

  const totalCount = filteredData?.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData?.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const columnDefs = [
    {
      headerName: "S.No",
      width: 90,
      valueGetter: (p) => (currentPage - 1) * pageSize + p.node.rowIndex + 1,
    },
    { headerName: "Title", field: "planName", flex: 1.5 },
    {
      headerName: "Created At",
      flex: 1.2,
      valueGetter: (p) => new Date(p.data.createdAt).toLocaleDateString(),
    },
    {
      headerName: "Action",
      width: 140,
      cellRenderer: (params) => {
        const handleDelete = () => {
          Swal.fire({
            title: "Are you sure?",
            text: `You want to delete plan "${params.data.title}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#a99068",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete",
          }).then((result) => {
            if (result.isConfirmed) {
              setVlogs((prev) => prev.filter((v) => v.id !== params.data._id));

              Swal.fire({
                title: "Deleted!",
                text: "plan has been deleted successfully",
                icon: "success",
                confirmButtonColor: "#a99068",
              });
            }
          });
        };

        return (
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn p-0 bg-transparent border-0"
              title="View / Edit"
              onClick={() =>
                navigate(`/plans/${params.data._id}`, {
                  state: { plan: params.data },
                })
              }
            >
              <Eye size={18} />
            </button>
            |
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="title-heading">Plan Management</div>
            <p className="title-sub-heading">Manage all plan</p>
          </div>
          <button
            className="primary-button"
            onClick={() => navigate("/plans/add")}
          >
            Add Plan
          </button>
        </div>

        <Breadcrumbs />

        <div className="search-bar mb-3">
          <input
            className="form-control w-50"
            placeholder="Search by plan title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="custom-card bg-white p-3">
          {paginatedData?.length === 0 ? (
            <NoData text="No plans found" />
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

export default PlanList;
