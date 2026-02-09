import React from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Star, Flag } from "lucide-react";
import noProfile from "../../assets/images/noProfile.svg";
import NoData from "../../Components/NoData";
import ItemPagination from "../../Components/ItemPagination";
import Swal from "sweetalert2";

const mockReviews = [
  {
    id: 1,
    customerName: "Alice Johnson",
    rating: 5,
    feedback:
      "The bidding process was smooth and transparent. Highly recommended!",
    jobDetails: "Property Bidding Assistance",
    responseTime: "20 mins",
    jobCompletionRate: "100%",
    winnerName: "Prime Properties",
    reviewDate: "2025-01-18",
  },
  {
    id: 2,
    customerName: "Michael Lee",
    rating: 4,
    feedback:
      "Good support during property evaluation, but response could be faster.",
    jobDetails: "Property Valuation & Bidding",
    responseTime: "45 mins",
    jobCompletionRate: "95%",
    winnerName: "Urban Realty",
    reviewDate: "2025-01-14",
  },
  {
    id: 3,
    customerName: "Sophia Brown",
    rating: 3,
    feedback: "Some issues with document verification, but overall okay.",
    jobDetails: "Property Documentation",
    responseTime: "1 hr",
    jobCompletionRate: "90%",
    winnerName: "Estate Experts",
    reviewDate: "2025-01-10",
  },
  {
    id: 4,
    customerName: "Daniel Carter",
    rating: 5,
    feedback: "Excellent service and very professional team.",
    jobDetails: "Residential Property Search",
    responseTime: "15 mins",
    jobCompletionRate: "100%",
    winnerName: "HomeQuest",
    reviewDate: "2025-01-08",
  },
  {
    id: 5,
    customerName: "Emma Wilson",
    rating: 4,
    feedback: "Smooth experience overall, paperwork took a bit longer.",
    jobDetails: "Commercial Property Leasing",
    responseTime: "35 mins",
    jobCompletionRate: "96%",
    winnerName: "CityScape Realty",
    reviewDate: "2025-01-06",
  },
  {
    id: 6,
    customerName: "James Anderson",
    rating: 5,
    feedback: "Outstanding attention to detail and fast communication.",
    jobDetails: "Luxury Property Consulting",
    responseTime: "10 mins",
    jobCompletionRate: "100%",
    winnerName: "Elite Estates",
    reviewDate: "2025-01-05",
  },
  {
    id: 7,
    customerName: "Olivia Martinez",
    rating: 4,
    feedback: "Very knowledgeable agents and helpful throughout.",
    jobDetails: "Land Purchase Assistance",
    responseTime: "40 mins",
    jobCompletionRate: "97%",
    winnerName: "GreenField Realty",
    reviewDate: "2025-01-03",
  },
  {
    id: 8,
    customerName: "William Turner",
    rating: 2,
    feedback: "Communication gaps caused delays.",
    jobDetails: "Rental Property Management",
    responseTime: "2 hrs",
    jobCompletionRate: "85%",
    winnerName: "Metro Homes",
    reviewDate: "2025-01-02",
  },
  {
    id: 9,
    customerName: "Ava Thompson",
    rating: 5,
    feedback: "Fantastic experience from start to finish.",
    jobDetails: "Apartment Purchase",
    responseTime: "18 mins",
    jobCompletionRate: "100%",
    winnerName: "Skyline Realty",
    reviewDate: "2024-12-30",
  },
  {
    id: 10,
    customerName: "Noah Harris",
    rating: 3,
    feedback: "Average service, expected quicker updates.",
    jobDetails: "Property Resale",
    responseTime: "1 hr",
    jobCompletionRate: "92%",
    winnerName: "BlueStone Properties",
    reviewDate: "2024-12-28",
  },
  {
    id: 11,
    customerName: "Isabella Moore",
    rating: 4,
    feedback: "Helpful team and clear pricing structure.",
    jobDetails: "First-Time Buyer Support",
    responseTime: "30 mins",
    jobCompletionRate: "98%",
    winnerName: "Prime Nest",
    reviewDate: "2024-12-26",
  },
  {
    id: 12,
    customerName: "Liam Walker",
    rating: 5,
    feedback: "Quick turnaround and excellent market knowledge.",
    jobDetails: "Investment Property Advisory",
    responseTime: "12 mins",
    jobCompletionRate: "100%",
    winnerName: "Urban Keys",
    reviewDate: "2024-12-24",
  },
];

const Review = () => {
  const [page, setPage] = React.useState(1);

  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(mockReviews.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReviews = mockReviews.slice(startIndex, endIndex);
  const [flaggedReviews, setFlaggedReviews] = React.useState(new Set());

  const handleFlag = (reviewId) => {
    Swal.fire({
      title: "Flag this review?",
      text: "Are you sure you want to mark this review as inappropriate?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a99068",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, flag it",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call backend API here
        setFlaggedReviews((prev) => new Set(prev).add(reviewId)); // add to flagged set
        Swal.fire({
          title: "Flagged!",
          text: `Review ID ${reviewId} has been flagged.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

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
          {currentReviews.length === 0 ? (
            <NoData text="No reviews found" />
          ) : (
            currentReviews.map((item) => (
              <div key={item.id} className="review-card mb-4">
                {/* Header */}
                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-3">
                    {/* <img
                      src={item.customerImage || noProfile}  
                      alt={item.customerName}
                      className="review-avatar"
                    /> */}
                    <div>
                      <h6 className="mb-1">{item.customerName}</h6>
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
                          {formatDate(item.reviewDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="review-tag">{item.jobDetails}</span>
                </div>

                {/* Feedback */}
                <div className="mt-3">
                  <p>{item.feedback}</p>
                </div>

                {/* Approve / Reject buttons */}
                <div className="mt-3 text-end d-flex align-items-end justify-content-between">
                  {/* Stats */}
                  <div className="d-flex gap-4 mt-2">
                    <span className="small">
                      <strong>Winner:</strong> {item.winnerName || "N/A"}
                    </span>
                  </div>

                  <div className="d-flex gap-2">
                    {/* <button
                      className="login-btn gap-1"
                      onClick={() => {
                        Swal.fire({
                          title: "Approve this review?",
                          text: `Are you sure you want to approve Review ID ${item.id}?`,
                          icon: "success",

                          confirmButtonColor: "#a99068",

                          confirmButtonText: "Yes, approve",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            Swal.fire({
                              title: "Approved!",
                              text: `Review ID ${item.id} has been approved.`,
                              icon: "success",
                              timer: 2000,
                              showConfirmButton: false,
                            });
                          }
                        });
                      }}
                    >
                      Approve
                    </button> */}

                    <button
                      className="login-btn" style={{ background: "#e83f3f"}}
                      onClick={() => {
                        Swal.fire({
                          title: "Reject this review?",
                          text: `Are you sure you want to reject Review ID ${item.id}?`,
                          icon: "warning",
                          confirmButtonColor: "#a99068",
                          confirmButtonText: "Yes, reject",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            Swal.fire({
                              title: "Rejected!",
                              text: `Review ID ${item.id} has been rejected.`,
                              icon: "success",
                              timer: 2000,
                              showConfirmButton: false,
                            });
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
