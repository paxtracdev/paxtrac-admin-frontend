import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { VLOG_DATA } from "./VlogStaticData";
import Swal from "sweetalert2";

const VlogList = () => {
  const navigate = useNavigate();
  const [vlogs, setVlogs] = useState(VLOG_DATA);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    return vlogs.filter((v) =>
      v.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [vlogs, search]);

  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
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
    { headerName: "Title", field: "title", flex: 1.5 },
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
            text: `You want to delete vlog "${params.data.title}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#a99068",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete",
          }).then((result) => {
            if (result.isConfirmed) {
              setVlogs((prev) => prev.filter((v) => v.id !== params.data.id));

              Swal.fire({
                title: "Deleted!",
                text: "Vlog has been deleted successfully",
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
                navigate("/vlogs/view", { state: { vlog: params.data } })
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
            <div className="title-heading">Vlog Management</div>
            <p className="title-sub-heading">Manage all vlogs</p>
          </div>
          <button
            className="primary-button"
            onClick={() => navigate("/vlogs/add")}
          >
            Add Vlog
          </button>
        </div>

        <Breadcrumbs />

        <div className="search-bar mb-3">
          <input
            className="form-control w-50"
            placeholder="Search by vlog title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="custom-card bg-white p-3">
          {paginatedData.length === 0 ? (
            <NoData text="No vlogs found" />
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

export default VlogList;
