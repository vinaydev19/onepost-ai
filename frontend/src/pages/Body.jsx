import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Profile from './Profile'
import { RouterProvider } from 'react-router'
import Home from './Home'

function Body() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />

                <Route path='' element={<ProtectedRoute />}>
                    <Route path='' element={<Home />} />
                    <Route path='profile' element={<Profile />} />
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