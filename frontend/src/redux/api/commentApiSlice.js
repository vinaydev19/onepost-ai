import { apiSlice } from "./apiSlice";
import { COMMENTS_URL } from "../constants";

export const commentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getComments: builder.query({
            query: (slug) => ({
                url: `${COMMENTS_URL}/get-comments/${slug}`,
            }),
            providesTags: ["Comment"],
        }),
        createComment: builder.mutation({
            query: ({ slug, content }) => ({
                url: `${COMMENTS_URL}/create-comment/${slug}`,
                method: "POST",
                body: { content },
            }),
            invalidatesTags: ["Comment"],
        }),
        updateComment: builder.mutation({
            query: ({ commentId, content }) => ({
                url: `${COMMENTS_URL}/update-comment/${commentId}`,
                method: "PUT",
                body: { content },
            }),
            invalidatesTags: ["Comment"],
        }),
        deleteComment: builder.mutation({
            query: (commentId) => ({
                url: `${COMMENTS_URL}/delete-comment/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Comment"],
        }),
    }),
});

export const {
    useGetCommentsQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentApiSlice
