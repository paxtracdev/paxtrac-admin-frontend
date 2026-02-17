import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    //  GET Users (Pagination + Search)
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "", role }) => ({
        url: "/users",
        method: "GET",
        params: {
          page,
          limit,
          search,
          role,
        },
      }),
      providesTags: ["Users"],
    }),

    //  GET User By ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    //  UPDATE User
    updateUser: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),

    getBids: builder.query({
      query: ({ page, limit, search, status, type }) => ({
        url: "/bid",
        params: {
          page,
          limit,
          ...(search && { search }),
          ...(status && { status }),
          ...(type && { type }),
        },
      }),
      providesTags: ["Users"],
    }),
    getBidIndivisual: builder.query({
      query: (id) => `/bids-list/${id}`,
      providesTags: ["Users"],
    }),
    startBid: builder.mutation({
      query: ({ bidId, bidTime }) => ({
        url: `/update-bidding-start/${bidId}`,
        method: "PUT",
        body: { bidTime },
      }),
      invalidatesTags: ["Users"],
    }),
    getSupport: builder.query({
      query: ({ page, limit, search }) => ({
        url: "/supports",
        method: "GET",
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ["Users"],
    }),
    bidders: builder.query({
      query: ({ page = 1, limit = 10, search, bidId }) => ({
        url: `/bids/${bidId}`,
        params: { page, limit, search },
      }),
      providesTags: ["Users"],
    }),
    broadcastBidders: builder.mutation({
      query: ({ propertyId, text }) => ({
        url: `/notify-bidders`,
        method: "POST",
        body: {
          bidId: propertyId,
          message: text,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    broadcastBidder: builder.mutation({
      query: ({ propertyId, bidderId, text }) => ({
        url: "/notify-bidder",
        method: "POST",
        body: {
          bidId: propertyId,
          bidderId: bidderId,
          message: text,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetBidsQuery,
  useGetBidIndivisualQuery,
  useStartBidMutation,
  useGetSupportQuery,
  useBiddersQuery,
  useBroadcastBiddersMutation,
  useBroadcastBidderMutation,
} = userApi;
