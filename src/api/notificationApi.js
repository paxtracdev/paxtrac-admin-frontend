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
        url: "/listAllNotices",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Announcement"],
    }),

    createAnnouncement: builder.mutation({
      query: (payload) => ({
        url: "/notification",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Announcement"],
    }),
    
  }),
});

export const { useGetAnnouncementsQuery, useCreateAnnouncementMutation } =
  notificationApi;
