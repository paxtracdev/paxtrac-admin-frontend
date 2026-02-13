import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getUserAnalytics: builder.query({
      query: ({ range, startDate, endDate }) => ({
        url: "/reports/user-activity",
        method: "GET",
        params: {
          range,
          startDate,
          endDate,
        },
      }),
    }),
     getAllTransactions: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/AllTransactions",
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ["Transactions"],
    }),
    
  }),
});

export const { useGetUserAnalyticsQuery ,useGetAllTransactionsQuery } = analyticsApi;
