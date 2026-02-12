import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import { userAuthApiSlice } from "../api/authApi";
import { userApi } from "../api/userApi";
import {propertyApi} from "../api/propertyApi"
export const store = configureStore({
  reducer: {
    user: userReducer,
    [userAuthApiSlice.reducerPath]: userAuthApiSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userAuthApiSlice.middleware,
      userApi.middleware,
      propertyApi.middleware
    ),
});
