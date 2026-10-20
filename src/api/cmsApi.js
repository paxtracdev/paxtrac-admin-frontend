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

    // GET Terms of Use
    getTermsOfService: builder.query({
      query: () => ({ url: "/termsOfService", method: "GET" }),
      providesTags: ["CMS"],
    }),

    // PUT Terms of Use
    updateTermsOfService: builder.mutation({
      query: (body) => ({ url: "/termsOfService", method: "PUT", body }),
      invalidatesTags: ["CMS"],
    }),

    // GET Join Us
    getJoinUs: builder.query({
      query: () => ({ url: "/joinus", method: "GET" }),
      providesTags: ["CMS"],
    }),

    // PUT Join Us
    updateJoinUs: builder.mutation({
      query: (body) => ({ url: "/joinus", method: "PUT", body }),
      invalidatesTags: ["CMS"],
    }),

    // GET Page by Slug
    getPageBySlug: builder.query({
      query: (slug) => ({ url: `/page/${slug}`, method: "GET" }),
      providesTags: ["CMS"],
    }),

    // PUT Page by Slug
    updatePageBySlug: builder.mutation({
      query: ({ slug, ...body }) => ({
        url: `/page/${slug}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CMS"],
    }),

    // POST New CMS Page
    createPage: builder.mutation({
      query: (body) => ({
        url: "/page",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CMS"],
    }),

    // DELETE CMS Page
    deletePage: builder.mutation({
      query: (id) => ({
        url: `/page/${id}`,
        method: "DELETE",
      }),
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
  useGetJoinUsQuery,
  useUpdateJoinUsMutation,
  useGetPageBySlugQuery,
  useUpdatePageBySlugMutation,
  useCreatePageMutation,
  useDeletePageMutation,
} = cmsApi;

// Aliases for Terms of Use
export const useGetTermsOfUseQuery = useGetTermsOfServiceQuery;
export const useUpdateTermsOfUseMutation = useUpdateTermsOfServiceMutation;

