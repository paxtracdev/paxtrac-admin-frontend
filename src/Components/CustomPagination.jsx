import  { useMemo } from "react";
import PropTypes from "prop-types";


const CustomPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  pageSize = 2,
  onPageChange,
  onPageSizeChange,
}) => {
  // const [inputPage, setInputPage] = useState<string>("");

  // Ensure values are always integers
  const intCurrentPage = useMemo(() => parseInt((currentPage), 10) || 1, [currentPage]);
  const intRowsPerPage = useMemo(() => parseInt((pageSize), 10) || 10, [pageSize]);
  const intTotalData = useMemo(() => parseInt((totalCount), 10) || 0, [totalCount]);
  const intTotalPages = useMemo(() => parseInt((totalPages), 10) || 1, [totalPages]);

  // Handle Jump to Page input
  // const handleJumpToPage = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => setInputPage(e.target.value),
  //   []
  // );

  // Handle Jump Submit
  // const handleJumpSubmit = useCallback(() => {
  //   const page = Math.min(Math.max(parseInt(inputPage, 10) || 1, 1), totalPages);
  //   handlePageChange(page);
  //   setInputPage("");
  // }, [inputPage, totalPages, handlePageChange]);

  return (
    <div className="t-pagination-c">
      {/* Rows Per Page */}
      <div className="p-rpp">
        <label>Rows per page: </label>
        <select
          value={intRowsPerPage}
          onChange={(e) => {
            if (onPageSizeChange) {
              onPageSizeChange(parseInt(e.target.value, 10));
            }
          }}
          disabled={!onPageSizeChange}
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="p-btn-grp">
        <span className="me-1">
          Page {intCurrentPage} of {intTotalPages}
        </span>
        | Entries {intTotalData}
        {[
          {
            id: "pagination-first-page",
            onClick: () => onPageChange(1),
            disabled: intCurrentPage === 1,
            icon: "M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z",
          },
          {
            id: "pagination-previous-page",
            onClick: () => onPageChange(intCurrentPage - 1),
            disabled: intCurrentPage === 1,
            icon: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
          },
          {
            id: "pagination-next-page",
            onClick: () => onPageChange(intCurrentPage + 1),
            disabled: intCurrentPage === intTotalPages,
            icon: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
          },
          {
            id: "pagination-last-page",
            onClick: () => onPageChange(intTotalPages),
            disabled: intCurrentPage === intTotalPages,
            icon: "M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z",
          },
        ].map(({ id, onClick, disabled, icon }) => (
          <button
            key={id}
            onClick={onClick}
            disabled={disabled}
            className="t-pagination"
            id={id}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d={icon}></path>
            </svg>
          </button>
        ))}
      </div>

      {/* Jump to Page */}
      {/* <div className="p-jtp">
        <input
          type="number"
          value={inputPage}
          onChange={handleJumpToPage}
          placeholder="Jump to..."
        />
        <button
          type="button"
          className="t-goto-btn"
          id="go-to-page"
          onClick={handleJumpSubmit}
          disabled={!inputPage}
        >
          Go
        </button>
      </div> */}
    </div>
  );
};

CustomPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};



export default CustomPagination;
