import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Swal from "sweetalert2";
import { logout } from "../redux/slice/userSlice"; // adjust path

const baseQuery = fetchBaseQuery({
  baseUrl: "http://51.161.10.63/api/admin",
  prepareHeaders: (headers, { getState }) => {
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTgxYWI2YThiMTUzMTg1OWQ4MWFlY2IiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MTIzOTcxOSwiZXhwIjoxNzcxMzI2MTE5fQ.qNn2B4Wky5NfIhXNmEIrAGEleiwEsxRQKDznYbU4Nx8";

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
