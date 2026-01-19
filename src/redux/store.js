import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import { userAuthApiSlice } from "../api/authApi";
import { dashboardApi } from "../api/dashboardApi";
import { eventApi } from "../api/eventApi";
import { voteApi } from "../api/voteApi";
import { monetizationApi } from "../api/monetizationApi";
import { userApi } from "../api/userApi";
import { cmsApi } from "../api/cmsApi";
import { notificationApi } from "../api/notificationApi";
import { analyticsApi } from "../api/analyticsApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [userAuthApiSlice.reducerPath]: userAuthApiSlice.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [voteApi.reducerPath]: voteApi.reducer,
    [monetizationApi.reducerPath]: monetizationApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userAuthApiSlice.middleware,
      dashboardApi.middleware,
      eventApi.middleware,
      voteApi.middleware,
      monetizationApi.middleware,
      notificationApi.middleware,
      userApi.middleware,
      cmsApi.middleware,
      analyticsApi.middleware
    ),
});
