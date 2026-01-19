import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const userAuthApiSlice = createApi({
  reducerPath: "userAuthApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload,
      }),
    }),

    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: "/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/reset-password/${token}`,
        method: "PUT",
        body: { password },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userAuthApiSlice;
