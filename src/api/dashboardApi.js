import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
baseQuery: baseQueryWithAuth,
  tagTypes: ["Dashboard"],

  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
