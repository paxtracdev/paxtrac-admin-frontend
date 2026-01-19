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
  }),
});

export const { useGetUserAnalyticsQuery } = analyticsApi;
