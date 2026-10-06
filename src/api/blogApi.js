import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Blog", "BlogCategory"],
  endpoints: (builder) => ({
    /**
     * @returns {{ status: boolean, message: string, data: Array<Object> }}
     */
    getBlogCategories: builder.query({
      query: () => ({
        url: "/blogs/categories",
        method: "GET",
      }),
      providesTags: ["BlogCategory"],
    }),

    /**
     * @param {{ name: string }} body
     * @returns {{ status: boolean, message: string, data: Object }}
     */
    createBlogCategory: builder.mutation({
      query: (body) => ({
        url: "/blogs/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BlogCategory"],
    }),

    /**
     * @param {string} id
     * @returns {{ status: boolean, message: string }}
     */
    deleteBlogCategory: builder.mutation({
      query: (id) => ({
        url: `/blogs/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogCategory"],
    }),

    /**
     * @param {{ page?: number, limit?: number, search?: string, category?: string, status?: string }} params
     * @returns {{ status: boolean, message: string, data: Array<Object>, pagination: { total: number, page: number, limit: number, totalPages: number } }}
     */
    getAdminBlogs: builder.query({
      query: ({ page = 1, limit = 10, search = "", category, status } = {}) => {
        const params = { page, limit };
        if (search) params.search = search;
        if (category) params.category = category;
        if (status) params.status = status;
        return {
          url: "/blogs",
          method: "GET",
          params,
        };
      },
      providesTags: ["Blog"],
    }),

    /**
     * @param {string} id
     * @returns {{ status: boolean, message: string, data: Object }}
     */
    getAdminBlogById: builder.query({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    /**
     * @param {FormData|Object} body - Contains title/heading, category, status, description/content, image
     * @returns {{ status: boolean, message: string, data: Object }}
     */
    createBlog: builder.mutation({
      query: (body) => ({
        url: "/blogs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Blog"],
    }),

    /**
     * @param {{ id: string, body: FormData|Object }} payload
     * @returns {{ status: boolean, message: string, data: Object }}
     */
    updateBlog: builder.mutation({
      query: ({ id, body }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Blog"],
    }),

    /**
     * @param {{ id: string, status: "Published" | "Draft" }} payload
     * @returns {{ status: boolean, message: string, data: Object }}
     */
    toggleBlogStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/blogs/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Blog"],
    }),

    /**
     * @param {string} id
     * @returns {{ status: boolean, message: string }}
     */
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  useGetAdminBlogsQuery,
  useGetAdminBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useToggleBlogStatusMutation,
  useDeleteBlogMutation,
} = blogApi;
