import { apiSlice } from "./apiSlice";
import { BLOGS_URL } from "../constants";
import { getBlogs } from "../features/blogSlice";

export const blogApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createBlog: builder.mutation({
            query: (formData) => ({
                url: `${BLOGS_URL}/create-blog`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Blog"],
        }),
        getAllBlogs: builder.query({
            query: ({ page = 1, limit = 10, sortBy = "createdAt", sortType = "desc", category = "All", query = "" }) => ({
                url: `${BLOGS_URL}/get-blogs`,
                params: { page, limit, sortBy, sortType, category, query }
            }),
            providesTags: ["Blog", "Comment"],
            async onQueryStarted(params, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(getBlogs(data))
                } catch (error) {
                    console.log("something want wrong while fetch the blogs", error);

                }
            }
        }),
        getBlogBySlug: builder.query({
            query: (slug) => ({
                url: `${BLOGS_URL}/get-blog/${slug}`,
            }),
            providesTags: ["Blog", "Comment"],
        }),
        updateBlog: builder.mutation({
            query: ({ id, formData }) => ({
                url: `${BLOGS_URL}/update-blog/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Blog"],
        }),
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `${BLOGS_URL}/delete-blog/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),
        getBlogsByAuthor: builder.query({
            query: (username) => ({
                url: `${BLOGS_URL}/author-blogs/${username}`,
            }),
            providesTags: ["Blog"],
        }),
        getMyBlogs: builder.query({
            query: () => ({
                url: `${BLOGS_URL}/my-blogs`,
            }),
            providesTags: ["Blog"],
        }),
        updateBlogStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `${BLOGS_URL}/update-blog-status/${id}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Blog"],
        }),
    }),
});

export const {
    useCreateBlogMutation,
    useGetAllBlogsQuery,
    useGetBlogBySlugQuery,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useGetBlogsByAuthorQuery,
    useGetMyBlogsQuery,
    useUpdateBlogStatusMutation,
} = blogApiSlice
