import React, { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye, Trash2, Pencil } from "lucide-react";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import Swal from "sweetalert2";
import { getStoredBlogs, deleteBlogItem, updateBlogItem } from "./BlogMockData";
import BlogViewModal from "./BlogViewModal";

const BlogList = () => {
  const navigate = useNavigate();

  // State management
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected blog for View Modal
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load stored blogs on mount
  useEffect(() => {
    setBlogs(getStoredBlogs());
  }, []);

  // Filter logic
  const filteredData = useMemo(() => {
    return blogs.filter((b) => {
      const query = search.toLowerCase();
      return (
        b.title?.toLowerCase().includes(query) ||
        b.category?.toLowerCase().includes(query) ||
        b.excerpt?.toLowerCase().includes(query)
      );
    });
  }, [blogs, search]);

  // Pagination calculation
  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Toggle Status Handler
  const handleToggleStatus = (blogItem) => {
    const isPublished = blogItem.status === "Published";
    const nextStatus = isPublished ? "Draft" : "Published";

    Swal.fire({
      title: `Change blog status for "${blogItem.title}"?`,
      text: `This will ${isPublished ? "deactivate" : "activate"} this blog post.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${isPublished ? "deactivate" : "activate"}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#a99068",
    }).then((result) => {
      if (result.isConfirmed) {
        updateBlogItem(blogItem.id, { status: nextStatus });
        setBlogs((prev) =>
          prev.map((b) => (b.id === blogItem.id ? { ...b, status: nextStatus } : b))
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Blog has been ${isPublished ? "deactivated" : "activated"}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  // Delete Handler
  const handleDelete = async (blogItem) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete blog "${blogItem.title}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a99068",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      const updated = deleteBlogItem(blogItem.id);
      setBlogs(updated);

      await Swal.fire({
        title: "Deleted!",
        text: "Blog deleted successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete blog",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  // Open Preview Modal
  const handleOpenViewModal = (blogItem) => {
    setSelectedBlog(blogItem);
    setIsModalOpen(true);
  };

  // Column definitions matching Admin theme
  const columnDefs = [
    {
      headerName: "S.No",
      width: 80,
      valueGetter: (p) => (currentPage - 1) * pageSize + p.node.rowIndex + 1,
    },
    {
      headerName: "Image",
      width: 90,
      cellRenderer: (params) => (
        <div className="d-flex align-items-center h-100">
          <img
            src={params.data.image}
            alt={params.data.title}
            className="rounded"
            style={{ width: "42px", height: "32px", objectFit: "cover" }}
          />
        </div>
      ),
    },
    {
      headerName: "Heading",
      field: "title",
      flex: 2,
      minWidth: 240,
    },
    {
      headerName: "Category",
      field: "category",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: "status",
      width: 120,
      cellRenderer: (params) => (
        <div className="d-flex align-items-center h-100">
          <Switch
            checked={params.value === "Published"}
            onChange={() => handleToggleStatus(params.data)}
            onColor="#a99068"
            uncheckedIcon={false}
            checkedIcon={false}
            height={20}
            width={40}
          />
        </div>
      ),
    },
    {
      headerName: "Created At",
      flex: 1,
      minWidth: 120,
      valueGetter: (p) =>
        p.data.date ? new Date(p.data.date).toLocaleDateString() : "-",
    },
    {
      headerName: "Action",
      width: 140,
      cellRenderer: (params) => (
        <div className="d-flex align-items-center gap-2 h-100">
          <button
            className="border-0 bg-transparent"
            title="Preview"
            onClick={() => handleOpenViewModal(params.data)}
          >
            <Eye size={18} />
          </button>
          |
          <button
            className="border-0 bg-transparent"
            title="Edit"
            onClick={() =>
              navigate(`/blogs/edit/${params.data.id}`, {
                state: { blog: params.data },
              })
            }
          >
            <Pencil size={18} />
          </button>
          |
          <button
            className="border-0 bg-transparent text-danger"
            title="Delete"
            onClick={() => handleDelete(params.data)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="title-heading">Blog Management</div>
            <p className="title-sub-heading">Manage all blogs</p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/blogs/add")}
          >
            Add Blog
          </button>
        </div>

        <Breadcrumbs />

        {/* 🔍 SEARCH */}
        <div className="search-bar mb-3">
          <input
            className="form-control w-50"
            placeholder="Search by blog heading..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* 📋 TABLE */}
        <div className="custom-card bg-white p-3">
          {paginatedData?.length === 0 ? (
            <NoData text="No blog found" />
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

              {/* CUSTOM PAGINATION */}
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </>
          )}
        </div>

        {/* Preview Modal */}
        <BlogViewModal
          blog={selectedBlog}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEdit={(blogItem) =>
            navigate(`/blogs/edit/${blogItem.id}`, {
              state: { blog: blogItem },
            })
          }
        />
      </section>
    </main>
  );
};

export default BlogList;
