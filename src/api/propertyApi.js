import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const propertyApi = createApi({
  reducerPath: "propertyApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Property"],
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: ({ page, limit, search, type, status } = {}) => ({
        url: "/properties",
        params: {
          page,
          limit,
          search,
          type,
          status,
        },
      }),
      providesTags: ["Property"],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),
  }),
});

export const { useGetPropertiesQuery, useDeletePropertyMutation } = propertyApi;
