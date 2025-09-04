import { apiSlice } from "./apiSlice";
import { FOLLOWS_URL } from "../constants";

export const followApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    toggleFollow: builder.mutation({
      query: (userId) => ({
        url: `${FOLLOWS_URL}/toggle-follow/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["Follow"],
    }),
    getFollowers: builder.query({
      query: (userId) => ({
        url: `${FOLLOWS_URL}/followers/${userId}`,
      }),
      providesTags: ["Follow"],
    }),
    getFollowing: builder.query({
      query: (userId) => ({
        url: `${FOLLOWS_URL}/following/${userId}`,
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
