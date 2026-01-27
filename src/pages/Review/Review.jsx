import React from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Star, Flag } from "lucide-react";
import noProfile from "../../assets/images/noProfile.svg";
import NoData from "../../Components/NoData";
import ItemPagination from "../../Components/ItemPagination";

const mockReviews = [
  {
    id: 1,
    customerName: "Alice Johnson",
    vendorName: "Prime Properties",
    vendorLogo:
      "https://img.freepik.com/free-vector/letter-j-r-home-logo-design-template_474888-3405.jpg",
    rating: 5,
    feedback:
      "The bidding process was smooth and transparent. Highly recommended!",
    jobDetails: "Property Bidding Assistance",
    responseTime: "20 mins",
    jobCompletionRate: "100%",
    reviewDate: "2025-01-18",
    reply: "Thank you for trusting us with your property needs!",
  },
  {
    id: 2,
    customerName: "Michael Lee",
    vendorName: "Urban Realty",
    vendorLogo:
      "https://img.freepik.com/premium-vector/creative-modern-color-full-logo-design_1271730-1034.jpg",
    rating: 4,
    feedback:
      "Good support during property evaluation, but response could be faster.",
    jobDetails: "Property Valuation & Bidding",
    responseTime: "45 mins",
    jobCompletionRate: "95%",
    reviewDate: "2025-01-14",
    reply: "We appreciate your feedback and will improve our response time.",
  },
  {
    id: 3,
    customerName: "Sophia Brown",
    vendorName: "Estate Experts",
    vendorLogo:
      "https://img.freepik.com/free-vector/real-estate-logo-luxury-gradient-design-illustrations_483537-1246.jpg",
    rating: 3,
    feedback: "Some issues with document verification, but overall okay.",
    jobDetails: "Property Documentation",
    responseTime: "1 hr",
    jobCompletionRate: "90%",
    reviewDate: "2025-01-10",
    reply: "",
  },
  {
    id: 4,
    customerName: "Daniel Carter",
    vendorName: "HomeQuest",
    vendorLogo:
      "https://img.freepik.com/free-vector/house-logo-template_441059-52.jpg",
    rating: 5,
    feedback: "Excellent service and very professional team.",
    jobDetails: "Residential Property Search",
    responseTime: "15 mins",
    jobCompletionRate: "100%",
    reviewDate: "2025-01-08",
    reply: "Glad we could help you find your perfect home!",
  },
  {
    id: 5,
    customerName: "Emma Wilson",
    vendorName: "CityScape Realty",
    vendorLogo:
      "https://img.freepik.com/free-vector/building-logo-design_23-2147504588.jpg",
    rating: 4,
    feedback: "Smooth experience overall, paperwork took a bit longer.",
    jobDetails: "Commercial Property Leasing",
    responseTime: "35 mins",
    jobCompletionRate: "96%",
    reviewDate: "2025-01-06",
    reply: "",
  },
  {
    id: 6,
    customerName: "James Anderson",
    vendorName: "Elite Estates",
    vendorLogo:
      "https://img.freepik.com/free-vector/luxury-real-estate-logo_23-2147504684.jpg",
    rating: 5,
    feedback: "Outstanding attention to detail and fast communication.",
    jobDetails: "Luxury Property Consulting",
    responseTime: "10 mins",
    jobCompletionRate: "100%",
    reviewDate: "2025-01-05",
    reply: "Thank you for your kind words!",
  },
  {
    id: 7,
    customerName: "Olivia Martinez",
    vendorName: "GreenField Realty",
    vendorLogo:
      "https://img.freepik.com/free-vector/eco-house-logo_23-2147504599.jpg",
    rating: 4,
    feedback: "Very knowledgeable agents and helpful throughout.",
    jobDetails: "Land Purchase Assistance",
    responseTime: "40 mins",
    jobCompletionRate: "97%",
    reviewDate: "2025-01-03",
    reply: "",
  },
  {
    id: 8,
    customerName: "William Turner",
    vendorName: "Metro Homes",
    vendorLogo:
      "https://img.freepik.com/free-vector/real-estate-logo-design_23-2147504586.jpg",
    rating: 2,
    feedback: "Communication gaps caused delays.",
    jobDetails: "Rental Property Management",
    responseTime: "2 hrs",
    jobCompletionRate: "85%",
    reviewDate: "2025-01-02",
    reply: "We apologize and are working on improving communication.",
  },
  {
    id: 9,
    customerName: "Ava Thompson",
    vendorName: "Skyline Realty",
    vendorLogo:
      "https://img.freepik.com/free-vector/city-building-logo_23-2147504577.jpg",
    rating: 5,
    feedback: "Fantastic experience from start to finish.",
    jobDetails: "Apartment Purchase",
    responseTime: "18 mins",
    jobCompletionRate: "100%",
    reviewDate: "2024-12-30",
    reply: "Happy to be part of your journey!",
  },
  {
    id: 10,
    customerName: "Noah Harris",
    vendorName: "BlueStone Properties",
    vendorLogo:
      "https://img.freepik.com/free-vector/stone-house-logo_23-2147504566.jpg",
    rating: 3,
    feedback: "Average service, expected quicker updates.",
    jobDetails: "Property Resale",
    responseTime: "1 hr",
    jobCompletionRate: "92%",
    reviewDate: "2024-12-28",
    reply: "",
  },
  {
    id: 11,
    customerName: "Isabella Moore",
    vendorName: "Prime Nest",
    vendorLogo:
      "https://img.freepik.com/free-vector/home-nest-logo_23-2147504555.jpg",
    rating: 4,
    feedback: "Helpful team and clear pricing structure.",
    jobDetails: "First-Time Buyer Support",
    responseTime: "30 mins",
    jobCompletionRate: "98%",
    reviewDate: "2024-12-26",
    reply: "Thank you for choosing Prime Nest!",
  },
  {
    id: 12,
    customerName: "Liam Walker",
    vendorName: "Urban Keys",
    vendorLogo:
      "https://img.freepik.com/free-vector/key-house-logo_23-2147504544.jpg",
    rating: 5,
    feedback: "Quick turnaround and excellent market knowledge.",
    jobDetails: "Investment Property Advisory",
    responseTime: "12 mins",
    jobCompletionRate: "100%",
    reviewDate: "2024-12-24",
    reply: "We appreciate your trust in our expertise.",
  },
];

const Review = () => {
    const [page, setPage] = React.useState(1);

  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(mockReviews.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReviews = mockReviews.slice(startIndex, endIndex);

  const handleFlag = (reviewId) => {
    Swal.fire({
      title: "Flag this review?",
      text: "Are you sure you want to mark this review as inappropriate?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, flag it",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call backend API here
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
                    <img
                      src={item.vendorLogo}
                      alt="vendor"
                      className="review-avatar"
                    />
                    <div>
                      <h6 className="mb-1">{item.vendorName}</h6>
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

                {/* Details */}
                <div className="mt-3">
                  <p>{item.feedback}</p>
                </div>

                {/* Reply Section */}
                {item.reply && (
                  <div className="review-reply-box mt-3">
                    <strong>Vendor Reply:</strong>
                    <p className="mb-0">{item.reply}</p>
                  </div>
                )}

                {/* Flag button */}
                <div className="d-flex align-items-end justify-content-between mt-3">
                  <div className="d-flex gap-4 mt-2">
                    <span className="small">
                      <strong>Response Time:</strong> {item.responseTime}
                    </span>
                    <span className="small">
                      <strong>Completion Rate:</strong> {item.jobCompletionRate}
                    </span>
                  </div>

                  <button
                    className="login-btn gap-1"
                    onClick={() => handleFlag(item.id)}
                  >
                    <Flag size={16} /> Flag
                  </button>
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
