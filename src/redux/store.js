import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import { userAuthApiSlice } from "../api/authApi";
import { userApi } from "../api/userApi";
import { propertyApi } from "../api/propertyApi";
import { notificationApi } from "../api/notificationApi";
import { analyticsApi } from "../api/analyticsApi";
import { cmsApi } from "../api/cmsApi";
import { reviewApi } from "../api/reviewApi";
export const store = configureStore({
  reducer: {
    user: userReducer,
    [userAuthApiSlice.reducerPath]: userAuthApiSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userAuthApiSlice.middleware,
      userApi.middleware,
      propertyApi.middleware,
      notificationApi.middleware,
      analyticsApi.middleware,
      cmsApi.middleware,
      reviewApi.middleware,
    ),
});
