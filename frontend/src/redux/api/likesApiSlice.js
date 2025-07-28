import { apiSlice } from "./apiSlice";
import { LIKES_URL } from "../constants";

export const likeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        toggleBlogLike: builder.mutation({
            query: (slug) => ({
                url: `${LIKES_URL}/toggle-blog-like/${slug}`,
                method: "POST",
            }),
            invalidatesTags: ["Blog"],
        }),
        toggleCommentLike: builder.mutation({
            query: (commentId) => ({
                url: `${LIKES_URL}/toggle-comment-like/${commentId}`,
                method: "POST",
            }),
            invalidatesTags: ["Comment"],
        }),
        getBlogLikes: builder.query({
            query: (slug) => ({
                url: `${LIKES_URL}/get-blog-likes/${slug}`,
            }),
            providesTags: ["Blog"],
        }),
        getCommentLikes: builder.query({
            query: (commentId) => ({
                url: `${LIKES_URL}/get-comment-likes/${commentId}`,
            }),
            providesTags: ["Comment"],
        }),
    }),
});

export {
    useToggleBlogLikeMutation,
    useToggleCommentLikeMutation,
    useGetBlogLikesQuery,
    useGetCommentLikesQuery,
}
