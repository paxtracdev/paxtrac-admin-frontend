import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const voteApi = createApi({
  reducerPath: "voteApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Voting"],

  endpoints: (builder) => ({
    //  Get voting stats
    getVotingStats: builder.query({
      query: () => "/voting/stats",
      providesTags: ["Voting"],
    }),

    //  Get all voting details
    getVotingDetails: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/voting/details",
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ["Voting"],
    }),

    //  Get single voting details
    getVotingById: builder.query({
      query: ({ id, page, limit }) => ({
        url: `/voting/view/${id}`,
        params: {
          page,
          limit,
        },
      }),
    }),

    deleteVote: builder.mutation({
      query: (voteId) => ({
        url: `/voting/${voteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Voting"],
    }),
  }),
});

export const {
  useGetVotingStatsQuery,
  useGetVotingDetailsQuery,
  useGetVotingByIdQuery,
  useDeleteVoteMutation,
} = voteApi;
