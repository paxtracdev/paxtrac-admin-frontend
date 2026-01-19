import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Announcement"],
  endpoints: (builder) => ({
    // GET Announcements
    getAnnouncements: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/announcement",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Announcement"],
    }),

    //  GET Announcement By ID
    getAnnouncementById: builder.query({
      query: (id) => ({
        url: `/announcement/${id}`,
        method: "GET",
      }),
      providesTags: ["Announcement"],
    }),

    createAnnouncement: builder.mutation({
      query: (payload) => ({
        url: "/announcement",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Announcement"],
    }),

    //  DELETE Announcement
    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/announcement/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcement"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = notificationApi;
