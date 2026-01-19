import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const monetizationApi = createApi({
  reducerPath: "monetizationApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Monetization"],
  endpoints: (builder) => ({
    //  GET Subscriptions List
    getSubscriptions: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/monetization/subscriptions",
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ["Monetization"],
    }),
  }),
});

export const { useGetSubscriptionsQuery } = monetizationApi;
