import { apiSlice } from "./apiSlice";
import { FOLLOW_URL } from "../constants";

export const followApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    toggleFollow: builder.mutation({
      query: (userId) => ({
        url: `${FOLLOW_URL}/toggle-follow/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["Follow"],
    }),
    getFollowers: builder.query({
      query: (userId) => ({
        url: `${FOLLOW_URL}/followers/${userId}`,
      }),
      providesTags: ["Follow"],
    }),
    getFollowing: builder.query({
      query: (userId) => ({
        url: `${FOLLOW_URL}/following/${userId}`,
      }),
      providesTags: ["Follow"],
    }),
  }),
});

export const {
  useToggleFollowMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
} = followApiSlice
