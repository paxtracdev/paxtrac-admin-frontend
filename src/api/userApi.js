import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    //  GET Users (Pagination + Search)
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/users",
        method: "GET",
        params: {
          page,
          limit,
          search,
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
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation } =
  userApi;
