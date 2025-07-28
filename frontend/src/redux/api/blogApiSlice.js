import { apiSlice } from "./apiSlice";
import { BLOGS_URL } from "../constants";

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
            query: () => ({
                url: `${BLOGS_URL}/get-blogs`,
            }),
            providesTags: ["Blog"],
        }),
        getBlogBySlug: builder.query({
            query: (slug) => ({
                url: `${BLOGS_URL}/get-blog/${slug}`,
            }),
            providesTags: ["Blog"],
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
        searchBlogs: builder.query({
            query: (params) => ({
                url: `${BLOGS_URL}/search`,
                params,
            }),
            providesTags: ["Blog"],
        }),
        // ⚠️ Fix backend to avoid duplicate `/search` route!
        searchBlogsByCategory: builder.query({
            query: (params) => ({
                url: `${BLOGS_URL}/search`,
                params,
            }),
            providesTags: ["Blog"],
        }),
    }),
});

export {
    useCreateBlogMutation,
    useGetAllBlogsQuery,
    useGetBlogBySlugQuery,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useGetBlogsByAuthorQuery,
    useGetMyBlogsQuery,
    useUpdateBlogStatusMutation,
    useSearchBlogsQuery,
    useSearchBlogsByCategoryQuery,
}
