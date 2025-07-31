import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        profile: {},
        email: null
    },
    reducers: {
        getUser: (state, action) => {
            state.user = action.payload;
        },
        getMyProfile: (state, action) => {
            state.profile = action.payload;
        },
        getEmail: (state, action) => {
            state.email = action.payload
        }
    },
});

export const { getUser, getMyProfile, getEmail } = userSlice.actions;

export default userSlice.reducer;