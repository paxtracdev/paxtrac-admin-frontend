import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Events"],

  endpoints: (builder) => ({
    //  Get all events
    getEvents: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/events/list",
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ["Events"],
    }),

    //  Get single event details
    getEventDetails: builder.query({
      query: (id) => `/events/${id}/details`,
    }),

    //  Get flagged events
    getFlaggedEvents: builder.query({
      query: () => "/events/flagged",
      providesTags: ["Events"],
    }),

    //  Delete event
    deleteEvent: builder.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),

    //  Update event
    updateEvent: builder.mutation({
      query: ({ id, body }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Events"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventDetailsQuery,
  useGetFlaggedEventsQuery,
  useDeleteEventMutation,
  useUpdateEventMutation,
} = eventApi;
