import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { useToggleBlogLikeMutation } from '@/redux/api/likesApiSlice';
import { CommentModal } from './CommentModel';
import { useSelector } from 'react-redux';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useDeleteBlogMutation } from '@/redux/api/blogApiSlice';
import { ConfirmDialog } from './ConfirmDialog';

function BlogCard({ post, variant = "card", showImage = true }) {
    const [toggleBlogLike, { isLoading: isLiking }] = useToggleBlogLikeMutation()
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const currentUser = useSelector((state) => state.user.user);
    const isOwner = post?.canEdit
    const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const toggleLike = async (e) => {
        e.preventDefault()
        try {
            const res = await toggleBlogLike(post?.slug).unwrap()
            toast.success(res.message)
        } catch (error) {
            console.error("Error while liking blog:", error)
            toast.error(error?.data?.message || "Something went wrong while liking")
        }
    }

    const handleEdit = () => {
        navigate(`/blog/edit/${post.slug}`);
    };

    const handleDelete = async () => {
        try {
            const res = await deleteBlog(post._id).unwrap();
            toast.success(res.message || "Blog deleted successfully");
            setIsConfirmOpen(false);
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error(error?.data?.message || "Something went wrong while deleting");
        }
    };


    if (variant === "list") {
        return (
            <Card className="mb-6 overflow-hidden text-white hover:shadow-hover transition-all duration-300 border-[0.5px] border-gray-800">
                <CardContent className="p-6">
                    <div className="flex gap-6">
                        {showImage && (
                            <Link to={`/blog/${post?.slug}`} className="flex-shrink-0">
                                <img
                                    src={post?.featuredImage}
                                    alt={post?.title}
                                    className="w-32 h-24 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                        )}

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                                <Link to={`/profile/${post?.author?.username}`} className="flex items-center gap-2 text-gray-400 hover:opacity-80 transition-opacity">
                                    <Avatar className="h-6 w-6 ">
                                        <AvatarImage src={post?.author?.profilePic} alt={post?.author.username} />
                                        <AvatarFallback className="text-xs">{post?.author.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-white hover:text-gray-400">{post?.author.username}</span>
                                </Link>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-400">{formatDate(post?.createdAt)}</span>
                                <Badge variant="secondary" className="bg-[#293c5a]">{post?.category}</Badge>
                            </div>

                            <Link to={`/blog/${post?.slug}`} className="group">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                    {post?.title}
                                </h3>
                            </Link>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-8 px-3 text-gray-400 hover:cursor-pointer hover:text-red-500 hover:bg-[#1e293b] ${post?.isLiked ? "text-red-500" : ""}`}
                                        onClick={toggleLike}
                                    >
                                        <Heart className={`h-4 w-4 mr-1 ${post?.isLiked ? "fill-current" : ""}`} />
                                        {post?.likesCount}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-3 text-gray-400 hover:bg-[#1e293b] hover:cursor-pointer"
                                        onClick={() => setIsCommentModalOpen(true)}
                                    >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        {post?.commentsCount}
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-8 w-8 text-gray-400 hover:text-white hover:cursor-pointer hover:bg-[#1e293b] ${post?.isBookmarked ? "text-primary" : ""}`}

                                    >
                                        <Bookmark className={`h-4 w-4 ${post?.isBookmarked ? "fill-current" : ""}`} />
                                    </Button> */}

                                    {isOwner && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:bg-[#1e293b] hover:cursor-pointer hover:text-white"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-[#020817] text-white">
                                                <DropdownMenuItem
                                                    className="cursor-pointer hover:bg-gray-800 items-center"
                                                    onClick={handleEdit}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer hover:bg-gray-800 items-center text-red-500"
                                                    onClick={() => setIsConfirmOpen(true)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? "Deleting..." : "Delete"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CommentModal
                    isOpen={isCommentModalOpen}
                    onClose={() => setIsCommentModalOpen(false)}
                    postId={post?.slug}
                    currentUser={currentUser}
                />
            </Card>
        )
    }

    return (
        <Card className="mb-6 overflow-hidden text-white hover:shadow-hover transition-all duration-300 border-[0.5px] border-gray-800">
            {showImage && (
                <div className="relative overflow-hidden">
                    <Link to={`/blog/${post?.slug}`}>
                        <img
                            src={post?.featuredImage}
                            alt={post?.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </Link>
                    <Badge className="absolute top-3 left-3 bg-[#293c5a]">
                        {post?.category}
                    </Badge>
                </div>
            )}

            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Link to={`/profile/${post?.author?.username}`} className="flex  text-gray-400 items-center gap-2 hover:opacity-80 transition-opacity">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={post?.author.profilePic} alt={post?.author.username} />
                            <AvatarFallback>{post?.author.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-white hover:text-gray-400">{post?.author.username}</p>
                            <p className="text-xs text-gray-400">{formatDate(post?.createdAt)}</p>
                        </div>
                    </Link>
                </div>

                <Link to={`/blog/${post?.slug}`} className="group">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post?.title}
                    </h3>
                </Link>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 text-gray-400 hover:cursor-pointer hover:text-red-500 hover:bg-[#1e293b] ${post?.isLiked ? "text-red-500" : ""}`}
                            onClick={toggleLike}
                        >
                            <Heart className={`h-4 w-4 mr-1 ${post?.isLiked ? "fill-current" : ""}`} />
                            {post?.likesCount}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-gray-400 hover:bg-[#1e293b] hover:cursor-pointer"
                            onClick={() => setIsCommentModalOpen(true)}
                        >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post?.commentsCount}
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 text-gray-400 hover:text-white hover:cursor-pointer hover:bg-[#1e293b] ${post?.isBookmarked ? "text-primary" : ""}`}

                        >
                            <Bookmark className={`h-4 w-4 ${post?.isBookmarked ? "fill-current" : ""}`} />
                        </Button> */}

                        {isOwner && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:bg-[#1e293b] hover:cursor-pointer hover:text-white"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-[#020817] text-white">
                                    <DropdownMenuItem
                                        className="cursor-pointer hover:bg-gray-800 items-center"
                                        onClick={handleEdit}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer hover:bg-gray-800 items-center text-red-500"
                                        onClick={() => setIsConfirmOpen(true)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </CardContent>

            <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                postId={post?.slug}
                currentUser={currentUser}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Blog"
                description="Are you sure you want to delete this blog? This action cannot be undone."
            />
        </Card>
    );

}

export default BlogCard