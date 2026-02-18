import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["CMS"],
  endpoints: (builder) => ({
    //  Get all CMS pages
    getAllPages: builder.query({
      query: () => ({
        url: "/list",
        method: "GET",
      }),
      providesTags: ["CMS"],
    }),

    //  Privacy Policy
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/privacy-policy",
        method: "GET",
      }),
      providesTags: ["CMS"],
    }),

    //  Terms & Conditions
    getTermsAndConditions: builder.query({
      query: () => ({
        url: "/terms-and-conditions",
        method: "GET",
      }),
      providesTags: ["CMS"],
    }),

    //  Update CMS Page Content
    updatePageContent: builder.mutation({
      query: ({ id, content }) => ({
        url: `/page-content/${id}`,
        method: "PUT",
        body: {
          content,
        },
      }),
      invalidatesTags: ["CMS"],
    }),
  }),
});

export const {
  useGetAllPagesQuery,
  useGetPrivacyPolicyQuery,
  useGetTermsAndConditionsQuery,
  useUpdatePageContentMutation,
} = cmsApi;
