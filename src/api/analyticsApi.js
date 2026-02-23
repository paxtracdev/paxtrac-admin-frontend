import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getAnalytics: builder.query({
      query: () => ({
        url: "/analytics",
        method: "GET",
      }),
    }),
    getAllTransactions: builder.query({
      query: ({ page = 1, limit = 10, search = "", status }) => ({
        url: "/AllTransactions",
        params: {
          page,
          limit,
          search,
          status,
        },
      }),
      providesTags: ["Transactions"],
    }),

    // Charts 
    getChartAnalytics: builder.query({
      query: (period) => ({
        url: "/analytic",
        method: "GET",
        params: { period },
      }),
    }),
    
  }),
});

export const { useGetAnalyticsQuery, useGetAllTransactionsQuery, useGetChartAnalyticsQuery } =
  analyticsApi;
