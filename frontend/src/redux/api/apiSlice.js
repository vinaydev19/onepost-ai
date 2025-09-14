// src/redux/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants.js";
import { logout } from "../features/userSlice"; // we'll add logout below

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // important: send cookies
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // first try original request
    let result = await baseQuery(args, api, extraOptions);

    // if 401, try to refresh
    if (result?.error?.status === 401) {
        // call refresh endpoint
        const refreshResult = await baseQuery({ url: "api/v1/users/refresh-token", method: "POST" }, api, extraOptions);

        if (refreshResult?.data) {
            // refresh succeeded, retry original request
            result = await baseQuery(args, api, extraOptions);
        } else {
            // refresh failed — log out user on the client
            api.dispatch(logout());
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Blogs", "Comment"],
    endpoints: (builder) => ({}),
    keepUnusedDataFor: 60 * 60 * 24 * 7,
});
