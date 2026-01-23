import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { BLOG_DATA } from "./BlogStaticData";

const BlogList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [blogs, setBlogs] = useState(BLOG_DATA);

  /* Filter */
  const filteredData = useMemo(() => {
    return blogs.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [blogs, search]);

  /* Pagination calculations */
  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
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
      field: "title",
      flex: 1.5,
    }, 
    {
      headerName: "Status",
      field: "status",
      flex: 1,
    },
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
          if (window.confirm(`Delete blog "${params.data.title}"?`)) {
            setBlogs((prev) => prev.filter((b) => b.id !== params.data.id));
          }
        };

        return (
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn p-0 bg-transparent border-0"
              title="View / Edit"
              onClick={() =>
                navigate("/blogs/view", { state: { blog: params.data } })
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
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="title-heading">Blog Management</div>
            <p className="title-sub-heading ">Manage all blogs</p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/blogs/add")}
          >
            Add Blog
          </button>
        </div>

        <Breadcrumbs />

        {/* 🔍 Search */}
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Search by blog title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* 📋 Table */}
        <div className="custom-card bg-white p-3">
          {paginatedData.length === 0 ? (
            <NoData text="No blogs found" />
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

export default BlogList;
