import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useGetVotingByIdQuery } from "../../api/voteApi";
import Loader from "../../Components/Loader";
import NoData from "../../Components/NoData";

ModuleRegistry.registerModules([AllCommunityModule]);

const ViewVoting = () => {
  const navigate = useNavigate();
  const { voteId } = useParams();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: votingResponse,
    isLoading,
    isError,
  } = useGetVotingByIdQuery({
    id: voteId,
    page,
    limit: pageSize,
  });

  const suspiciousVotes = votingResponse?.data?.suspiciousVotesList || [];

  const meta = votingResponse?.meta || {};
  const vote = votingResponse?.data;

  const totalCount = meta?.totalSuspicious || 0;
  const totalPages = meta?.pages || 0;

  const [openModal, setOpenModal] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);

  const openViewModal = (row) => {
    setSelectedVote(row);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedVote(null);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        minWidth: 80,
        flex: 1,
        cellRenderer: (params) => {
          return params.node.rowIndex + 1;
        },
      },
      {
        headerName: "Voter Name",
        minWidth: 200,
        flex: 1,
        valueGetter: (params) => params.data?.voter?.name || "N/A",
      },
      {
        headerName: "Email",
        minWidth: 200,
        flex: 1,
        valueGetter: (params) => params.data?.voter?.email || "N/A",
      },
      {
        headerName: "Date",
        minWidth: 200,
        flex: 1,
        valueGetter: (params) => params.data?.activity?.date || "N/A",
      },
      {
        headerName: "Time Slot",
        minWidth: 200,
        flex: 1,
        valueGetter: (params) => params.data?.activity?.timeSlot || "N/A",
      },
      {
        headerName: "IP Address",
        minWidth: 200,
        flex: 1,
        valueGetter: (params) => params.data?.activity?.ip || "N/A",
      },
      {
        headerName: "Device",
        minWidth: 200,
        flex: 1,
        valueGetter: (params) => params.data?.activity?.device || "N/A",
      },
      {
        headerName: "Action",
        minWidth: 120,
        flex: 1,
        cellRenderer: (params) => (
          <span
            className="text-primary cursor-pointer"
            onClick={() => openViewModal(params.data)}
          >
            View
          </span>
        ),
      },
    ],
    []
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

  if (isError) {
    return (
      <div className="app-content">
        <div className="container">
          <NoData text="Voting not found" imageWidth={300} showImage={true} />
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
            <div className="title-heading mb-2">View Voting</div>
            <p className="title-sub-heading">
              Voting details & suspicious activity
            </p>
          </div>
        </div>

        <Breadcrumbs />
        <div className="custom-card bg-white p-4 mt-3 mb-4">
          <div className="title-heading text-center mb-4">Voting Details</div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Event ID</label>
              <input
                className="form-control"
                value={vote?.voteId || ""}
                readOnly
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Event Name</label>
              <input
                className="form-control"
                value={vote?.eventName || ""}
                readOnly
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Status</label>
              <input
                className="form-control"
                value={vote?.status?.toUpperCase() || ""}
                readOnly
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Total Votes</label>
              <input
                className="form-control"
                value={vote?.totalVotes ?? 0}
                readOnly
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Suspicious Votes</label>
              <input
                className="form-control fw-semibold"
                value={vote?.suspiciousVotes ?? 0}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* =====================
            SUSPICIOUS VOTES TABLE
        ====================== */}
        <div className="custom-card bg-white p-3">
          <div className="title-heading mb-3">Suspicious Votes</div>

          {isLoading ? (
            <p className="text-center">Loading suspicious votes...</p>
          ) : suspiciousVotes.length === 0 ? (
            <NoData text="No suspicious votes found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={suspiciousVotes}
                  columnDefs={columnDefs}
                  headerHeight={40}
                  rowHeight={48}
                  selection
                  domLayout="autoHeight"
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#0061ff10" : "white",
                  })}
                />
              </div>
              {totalCount > 0 && suspiciousVotes.length > 0 && (
                <CustomPagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  pageSize={pageSize}
                  onPageChange={(newPage) => setPage(newPage)}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1); // reset page
                  }}
                />
              )}
            </>
          )}
        </div>

        <Modal className="gap-0" show={openModal} onHide={closeModal} centered>
          <Modal.Body>
            <Modal.Title className="title fw-light text-center mb-3">
              Suspicious Vote
            </Modal.Title>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Voter Name</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={selectedVote?.voter?.name || ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                readOnly
                value={selectedVote?.activity?.device || ""}
              />
            </Form.Group>

            <div className="w-100 mt-4 text-end">
              <button className="button-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </main>
  );
};

export default ViewVoting;
