import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../constants.js"

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include",
    }),
    tagTypes: ["User", "Blogs"],
    endpoints: (builder) => ({}),
    keepUnusedDataFor: 60 * 60 * 24 * 7,
})