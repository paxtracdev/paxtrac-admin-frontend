import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";
import { logout } from "../redux/slice/userSlice"; // adjust path

const baseQuery = fetchBaseQuery({
  baseUrl: "http://51.161.10.63/api/admin",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token || localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // if (result?.error?.status === 401) {
  //   Swal.fire({
  //     icon: "warning",
  //     title: "Session Expired",
  //     text: "Your session has expired. Please login again.",
  //     confirmButtonText: "OK",
  //   }).then(() => {
  //     // Clear auth
  //     api.dispatch(logout());
  //     localStorage.clear();

  //     // Redirect to login
  //     window.location.href = "/login";
  //   });
  // }

  return result;
};
