import { createSlice } from "@reduxjs/toolkit"


const blogSlice = createSlice({
    name: "blog",
    initialState: {
        blogs: null
    },
    reducers: {
        getBlogs: (state, action) => {
            state.blogs = action.payload
        }
    }
})

export const { getBlogs } = blogSlice.actions
export default blogSlice.reducer