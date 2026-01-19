import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import Swal from "sweetalert2";
import { Eye, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteEventMutation, useGetEventsQuery } from "../../api/eventApi";
import Loader from "../../Components/Loader";
import { ReadMoreCell } from "../../Components/ReadMoreCell";

ModuleRegistry.registerModules([AllCommunityModule]);

const EventManagement = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading, isFetching, error } = useGetEventsQuery(query);
  const [deleteEvent] = useDeleteEventMutation();

  const events = data?.data?.events || [];
  const pagination = data?.data?.pagination || {};

  const currentPage = pagination.currentPage || 1;
  const totalPages = pagination.totalPages || 1;
  const totalCount = pagination.totalEvents || 0;
  const pageSize = pagination.limit || query.limit;

  // 🔹 Pagination
  const handlePageChange = (page) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  const handlePageSizeChange = (size) => {
    setQuery((prev) => ({
      ...prev,
      limit: size,
      page: 1,
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        search: searchInput,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = async (eventId) => {
    if (!eventId) {
      Swal.fire("Error", "Invalid event ID", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(eventId).unwrap();
        Swal.fire("Deleted!", "Event removed successfully.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete event", "error");
      }
    }
  };
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (params) =>
          params.node.rowIndex + 1 + (query.page - 1) * query.limit,
        minWidth: 100,
        flex: 1,
      },
      { headerName: "Event ID", field: "eventId", minWidth: 200, flex: 1 },
      {
        headerName: "Event Name",
        field: "eventName",
        minWidth: 200,
        flex: 1,
        wrapText: true,
        autoHeight: true,
        cellRenderer: ReadMoreCell,
      },
      {
        headerName: "Participants",
        field: "participantsCount",
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 200,
        flex: 1,
      },
      {
        headerName: "Start Date",
        field: "startDate",
        valueFormatter: (p) => formatDate(p.value),

        minWidth: 150,
        flex: 1,
      },
      {
        headerName: "End Date",
        field: "endDate",
        valueFormatter: (p) => formatDate(p.value),

        minWidth: 150,
        flex: 1,
      },

      {
        headerName: "Action",
        minWidth: 200,
        flex: 1,
        cellRenderer: (params) => (
          <div className="d-flex gap-2">
            <button
              className="border-0 bg-transparent"
              title="View"
              onClick={() =>
                navigate(`/event-management/view-event/${params.data.eventId}`)
              }
            >
              <Eye size={18} />
            </button>{" "}
            |
            <button
              className="border-0 bg-transparent text-danger"
              title="Delete"
              onClick={() => handleDelete(params.data.eventId)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    [query]
  );

  if (isLoading) {
    return (
      <section className="app-content h-full overflow-auto">
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          <Loader size="lg" color="logo" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="app-content">
        <div className="container">
          <NoData text="Events not found" imageWidth={300} showImage={true} />
        </div>
      </div>
    );
  }

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">Event Management</div>
            <p className="title-sub-heading">
              Monitor and moderate ongoing and completed events
            </p>
          </div>
        </div>

        <Breadcrumbs />

        {/* SEARCH */}
        <div className="search-bar mb-4 position-relative">
          <input
            type="text"
            className="form-control ps-3"
            placeholder="Search events..."
            value={searchInput}
            autoFocus
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="custom-card bg-white p-3">
          {events.length === 0 ? (
            <NoData text="No events found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={events}
                  columnDefs={columnDefs}
                  headerHeight={40}
                  rowHeight={48}
                  domLayout="autoHeight"
                  pagination={false}
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#0061ff10" : "white",
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

export default EventManagement;
