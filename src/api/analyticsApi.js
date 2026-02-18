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

export const { useGetAnalyticsQuery, useGetAllTransactionsQuery } =
  analyticsApi;
