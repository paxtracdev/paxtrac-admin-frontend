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

    // GET Privacy Policy
    getPrivacyPolicy: builder.query({
      query: () => ({ url: "/privacypolicy", method: "GET" }),
      providesTags: ["CMS"],
    }),

    // PUT Privacy Policy
    updatePrivacyPolicy: builder.mutation({
      query: (body) => ({ url: "/privacypolicy", method: "PUT", body }),
      invalidatesTags: ["CMS"],
    }),

    // GET Terms of Service
    getTermsOfService: builder.query({
      query: () => ({ url: "/termsOfService", method: "GET" }),
      providesTags: ["CMS"],
    }),

    // PUT Terms of Service
    updateTermsOfService: builder.mutation({
      query: (body) => ({ url: "/termsOfService", method: "PUT", body }),
      invalidatesTags: ["CMS"],
    }),
 
  }),
});

export const {
  useGetAllPagesQuery,  
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetTermsOfServiceQuery,
  useUpdateTermsOfServiceMutation,
} = cmsApi;
