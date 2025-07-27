import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../constants"


export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    tagTypes: ["Users"],
    endpoints: (builder) => ({}),
    keepUnusedDataFor: 60 * 60 * 24 * 7,
})