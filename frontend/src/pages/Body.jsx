import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Profile from './Profile'
import { RouterProvider } from 'react-router'
import Home from './Home'
import Explore from './Explore'
import MainLayout from './MainLayout'
import ReadingLists from './ReadingLists'
import ForgotPassword from './ForgotPassword'
import VerifyOTP from './VerifyOTP'
import PasswordReset from './PasswordReset'
import PasswordChange from './PasswordChange'
import EmailChange from './EmailChange'
import Editor from './Editor'
import BlogPost from './BlogPost'
import ChangePassword from './ChangePassword'
import EmailChangeConfirmation from './EmailChangeConfirmation'

function Body() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="verify-otp" element={<VerifyOTP />} />
                <Route path="password-reset" element={<PasswordReset />} />
                <Route path="password-change" element={<PasswordChange />} />

                <Route path='' element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path='' element={<Home />} />
                        <Route path='profile/:username' element={<Profile />} />
                        <Route path='explore' element={<Explore />} />
                        <Route path='blog/:slug' element={<BlogPost />} />
                        <Route path='reading-lists' element={<ReadingLists />} />
                        <Route path='write-new-blog' element={<Editor />} />
                        <Route path='change-password' element={<ChangePassword />} />
                        <Route path="email-change" element={<EmailChange />} />
                        <Route path="email-change-confirmation" element={<EmailChangeConfirmation />} />
                    </Route>
                </Route>
            </>
        )
    )
    return (
        <div>
            <RouterProvider router={router}></RouterProvider>
        </div>
    )
}

export default Body