import React from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Star, Flag } from "lucide-react";
import noProfile from "../../assets/images/noProfile.svg";
import NoData from "../../Components/NoData";
import ItemPagination from "../../Components/ItemPagination";
import Swal from "sweetalert2";
import {
  useDeleteReviewMutation,
  useGetReviewsQuery,
} from "../../api/reviewApi";
import { LoadingComponent } from "../../Components/LoadingComponent";

const Review = () => {
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useGetReviewsQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });

  const [deleteReview] = useDeleteReviewMutation();

  const currentReviews = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-US", options); // e.g., Jan 08, 2026
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="mb-4">
          <div className="title-heading mb-2">Customer Reviews</div>
          <p className="title-sub-heading">
            Monitor ratings, feedback, and vendor performance
          </p>
        </div>

        <Breadcrumbs />

        <div className="custom-card p-4 mt-3">
          {isLoading ? (
            <LoadingComponent isLoading fullScreen />
          ) : currentReviews.length === 0 ? (
            <NoData text="No reviews found" />
          ) : (
            currentReviews.map((item, index) => (
              <div key={item.propertyId || index} className="review-card mb-4">
                {/* Header */}
                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-3">
                    {/* <img
                      src={item.customerImage || noProfile}  
                      alt={item.customerName}
                      className="review-avatar"
                    /> */}
                    <div>
                      <h6 className="mb-1">
                        {item.createdBy?.firstName} {item.createdBy?.lastName}
                      </h6>
                      <div className="d-flex align-items-center gap-2">
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < item.rating ? "#FBBF24" : "#E5E7EB"}
                              stroke="none"
                            />
                          ))}
                        </div>
                        <span className="review-date">
                          {formatDate(item.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="review-tag">
                    {item.servicePropertyAddress}
                  </span>
                </div>

                {/* Feedback */}
                <div className="mt-3">
                  <p>{item.review}</p>
                </div>

                {/* Approve / Reject buttons */}
                <div className="mt-3 text-end d-flex align-items-end justify-content-between">
                  {/* Stats */}
                  <div className="d-flex gap-4 mt-2">
                    <span className="small">
                      <strong>Winner:</strong>{" "}
                      {item.winner
                        ? `${item.winner.firstName} ${item.winner.lastName}`
                        : "N/A"}
                    </span>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="login-btn"
                      style={{ background: "#e83f3f" }}
                      onClick={() => {
                        Swal.fire({
                          title: "Reject this review?",
                          text: `Are you sure you want to reject this review ?`,
                          icon: "warning",
                          confirmButtonColor: "#a99068",
                          confirmButtonText: "Yes, reject",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            try {
                              await deleteReview({
                                propertyId: item.propertyId,
                                winnerBidderId: item.winnerBidder?.id,
                              }).unwrap();

                              Swal.fire({
                                title: "Rejected!",
                                text: `Review has been rejected.`,
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false,
                              });
                            } catch (error) {
                              Swal.fire({
                                title: "Failed",
                                text: "Unable to reject this review.",
                                icon: "error",
                              });
                            }
                          }
                        });
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <ItemPagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </section>
    </main>
  );
};

export default Review;
