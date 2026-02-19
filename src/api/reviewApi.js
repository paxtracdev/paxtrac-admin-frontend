import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Review"],
  endpoints: (builder) => ({

    // Get reviews (with pagination)
    getReviews: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/review",
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["Review"],
    }),
 
    // Delete review (needs propertyId and winnerBidderId)
    deleteReview: builder.mutation({
      query: ({ propertyId, winnerBidderId }) => ({
        url: `/review/${propertyId}/${winnerBidderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),

  }),
});

export const {
  useGetReviewsQuery,
  useDeleteReviewMutation,
} = reviewApi;
