import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { FAQ_DATA } from "./FaqStaticData";
import Swal from "sweetalert2";

const FaqList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    return FAQ_DATA.filter((f) =>
      f.question.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const columnDefs = [
    {
      headerName: "S.No",
      width: 90,
      valueGetter: (p) => p.node.rowIndex + 1,
    },
    {
      headerName: "Question",
      field: "question",
      flex: 2,
    },
    {
      headerName: "Created At",
      flex: 1,
      valueGetter: (p) => new Date(p.data.createdAt).toLocaleDateString(),
    },
    {
      headerName: "Action",
      width: 120,
      cellRenderer: (params) => {
        const handleDelete = () => {
          Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this FAQ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#a99068",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Deleted!",
                text: "FAQ deleted successfully",
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
              onClick={() =>
                navigate("/faq/view", { state: { faq: params.data } })
              }
            >
              <Eye size={18} />
            </button>
            |
            <button
              className="btn p-0 bg-transparent border-0 text-danger"
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
            <div className="title-heading">FAQ Management</div>
            <p className="title-sub-heading">Manage all FAQs</p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/faq/add")}
          >
            Add FAQ
          </button>
        </div>

        <Breadcrumbs />

        <div className="search-bar mb-3">
          <input
            className="form-control w-50"
            placeholder="Search question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="custom-card bg-white p-3">
          {paginatedData.length === 0 ? (
            <NoData text="No FAQs found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={paginatedData}
                  columnDefs={columnDefs}
                  rowHeight={48}
                  domLayout="autoHeight"
                  headerHeight={40}
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
                  })}
                />
              </div>

              <CustomPagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredData.length / pageSize)}
                totalCount={filteredData.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default FaqList;
