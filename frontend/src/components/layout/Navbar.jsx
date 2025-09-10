import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from "../../assets/Logo.png"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut, Menu, Search, Settings, User, X } from 'lucide-react';
import { Input } from '../ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '@/redux/api/userApiSlice';
import { getEmail, getMyProfile, getUser } from '@/redux/features/userSlice';
import toast from 'react-hot-toast';

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()

    const handleSearch = (e) => {
        e.preventDefault()

        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    }

    const isActivePath = (path) => (location.pathname === path)
    const isAuthenticated = useSelector((state) => state.user.user);

    const user = {
        name: isAuthenticated?.username,
        avatar: isAuthenticated?.profilePic,
        email: isAuthenticated?.gmail
    };


    const [logoutApi] = useLogoutMutation()

    const handleSignOut = async () => {
        try {
            const res = await logoutApi().unwrap();
            dispatch(getUser(null));
            dispatch(getMyProfile(null));
            dispatch(getEmail(null));
            toast.success(res.message)
            navigate("/login");
        } catch (error) {
            console.log(`something want wrong while logout`);
            console.log(error);
            toast.error(error.data.message)
        }
    };


    return (
        <nav className='sticky top-0 z-50 w-full border-b bg-[#020817] text-white border-border'>
            <div className='container mx-auto px-4'>
                <div className='flex h-16 items-center justify-between'>
                    <Link
                        to="/"
                        className="flex items-center cursor-pointer space-x-2"
                    >
                        <img src={Logo} className='w-10 rounded-full' />
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to='/'
                            className={`text-sm cursor-pointer font-medium hover:text-white  ${isActivePath('/') ? 'text-white' : 'text-gray-700'}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/explore"
                            className={`text-sm cursor-pointer font-medium hover:text-white  ${isActivePath('/explore') ? 'text-white' : 'text-gray-400'}`}

                        >
                            Explore
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 pl-10 bg-muted/50 border-border focus:bg-background"
                            />
                        </div>
                    </form>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && user ? (
                            <>
                                <Button asChild variant="ghost" size="sm" className="hidden hover:text-[#a18be8]  cursor-pointer md:inline-flex">
                                    <Link to="/reading-lists"
                                        className={`text-sm cursor-pointer font-medium hover:text-white  ${isActivePath('/readlist') ? 'text-white' : 'text-gray-400'}`}
                                    >
                                        Reading Lists
                                    </Link>
                                </Button>

                                <Button asChild variant="default" className='cursor-pointer bg-[#6c46e2]' size="sm">
                                    <Link to="/write-new-blog"
                                        className={`text-sm hover:cursor-pointer transition-transform duration-200 hover:scale-105 font-medium `}
                                    >
                                        Write
                                    </Link>
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative cursor-pointer h-10 w-10 rounded-full">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 bg-[#020817] text-white" align="end">
                                        <DropdownMenuItem asChild>
                                            <Link to={`/profile/${isAuthenticated.username}`} className="flex cursor-pointer hover:bg-gray-800 items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to="/change-password" className="flex cursor-pointer hover:bg-gray-800 items-center">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Change Password
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to="/email-change-verification" className="flex items-center">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Change Email
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleSignOut}
                                            className="text-destructive hover:bg-gray-800 cursor-pointer">
                                            <LogOut className="mr-2 h-4 w-4 " />
                                            Sign out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Button asChild variant="ghost" className='cursor-pointer bg-[#6c46e2]' size="sm">
                                    <Link to="/login">Sign In</Link>
                                </Button>
                                <Button asChild variant="default" className='cursor-pointer bg-[#6c46e2]' size="sm">
                                    <Link to="/register">Get Started</Link>
                                </Button>
                            </div>
                        )}
                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>


                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border py-4 space-y-4 animate-slide-up">
                        <form onSubmit={handleSearch} className="px-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10"
                                />
                            </div>
                        </form>

                        <div className="flex flex-col space-y-2 px-2">
                            <Link to="/" className="block cursor-pointer py-2 text-sm font-medium">Home</Link>
                            <Link to="/explore" className="block cursor-pointer py-2 text-sm font-medium">Explore</Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to="/reading-lists" className="block cursor-pointer py-2 text-sm font-medium">Reading Lists</Link>
                                    <Link to="/write-new-blog" className="block py-2 cursor-pointer text-sm font-medium">Write</Link>
                                    <Link to="/profile" className="block py-2 cursor-pointer text-sm font-medium">Profile</Link>
                                    <Link to="/settings" className="block py-2 cursor-pointer text-sm font-medium">Settings</Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="block py-2 text-sm font-medium cursor-pointer text-destructive text-left"
                                    >
                                        Sign Out
                                    </button>                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block py-2 cursor-pointer text-sm font-medium">Sign In</Link>
                                    <Link to="/register" className="block py-2 cursor-pointer text-sm font-medium">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar