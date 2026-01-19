import "../assets/css/DashboardShimmer.css";
const DashboardShimmer = () => {
  return (
    <div className="col-lg-4 col-xl-3 g-3 mb-4">
      <div className="p-3 skeleton-card">
        <div className="skeleton-title shimmer"></div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="skeleton-value shimmer"></div>
          <div className="skeleton-icon shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShimmer;
