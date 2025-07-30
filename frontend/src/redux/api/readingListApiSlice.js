import { apiSlice } from "./apiSlice";
import { READING_LIST_URL } from "../constants";

export const readingListApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createReadingList: builder.mutation({
            query: (data) => ({
                url: `${READING_LIST_URL}/create-readinglist`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ReadingList"],
        }),
        getReadingLists: builder.query({
            query: () => ({
                url: `${READING_LIST_URL}/get-readinglist`,
            }),
            providesTags: ["ReadingList"],
        }),
        deleteReadingList: builder.mutation({
            query: (id) => ({
                url: `${READING_LIST_URL}/delete-readinglist/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ReadingList"],
        }),
        updateReadingList: builder.mutation({
            query: ({ id, data }) => ({
                url: `${READING_LIST_URL}/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ReadingList"],
        }),
        toggleBlogInReadingList: builder.mutation({
            query: ({ id, blogId }) => ({
                url: `${READING_LIST_URL}/${id}/toggleBlog`,
                method: "POST",
                body: { blogId },
            }),
            invalidatesTags: ["ReadingList"],
        }),
    }),
});

export const {
    useCreateReadingListMutation,
    useGetReadingListsQuery,
    useDeleteReadingListMutation,
    useUpdateReadingListMutation,
    useToggleBlogInReadingListMutation,
} = readingListApiSlice;
