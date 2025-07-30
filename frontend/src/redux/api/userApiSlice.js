import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import { getMyProfile, getUser } from "../features/userSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: "POST",
                body: data
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: "POST",
                body: data
            }),
            async onQueryStarted(params, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(getUser(data))
                } catch (error) {
                    console.log(`error while login ${error}`);

                }
            }
        }),
        verify: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/verify`,
                method: "POST",
                body: data
            }),
        }),
        resendVerification: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/resend-verification`,
                method: "POST",
                body: data
            }),
        }),
        resetToken: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/password/reset-token`,
                method: "POST",
                body: data
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/password/reset`,
                method: "POST",
                body: data
            }),
        }),
        logout: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),
        refreshToken: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/refresh-token`,
                method: "POST",
            }),
        }),
        accountUpdate: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/account`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['User'],
        }),
        profilePicture: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile-picture`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['User'],
        }),
        passwordChange: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/password/change`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['User'],
        }),
        emailChange: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/email/change`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['User'],
        }),
        emailConfirm: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/email/confirm`,
                method: "POST",
                body: data
            }),
        }),
        profile: builder.query({
            query: () => ({
                url: `${USERS_URL}/me`,
            }),
            providesTags: ["User"],
            async onQueryStarted(params, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(getMyProfile(data))
                } catch (error) {
                    console.log(`error while fetch user profile`);

                }
            }
        }),
    })
})


export const {
    useRegisterMutation,
    useLoginMutation,
    useVerifyMutation,
    useResendVerificationMutation,
    useResetTokenMutation,
    useResetPasswordMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useProfilePictureMutation,
    usePasswordChangeMutation,
    useEmailChangeMutation,
    useEmailConfirmMutation,
    useProfileQuery,
} = userApiSlice
