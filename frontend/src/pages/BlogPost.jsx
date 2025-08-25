import React, { useEffect } from 'react'
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Bookmark, Share2, Twitter, Facebook, Link as LinkIcon, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetBlogBySlugQuery } from '@/redux/api/blogApiSlice';
import { useState } from 'react';
import { useToggleBlogLikeMutation } from '@/redux/api/likesApiSlice';
import toast from 'react-hot-toast';
import { CommentModal } from '@/components/common/CommentModel';
import { useSelector } from 'react-redux';


function BlogPost() {
    const { slug } = useParams();
    const { data, isLoading } = useGetBlogBySlugQuery(slug)
    const [Blog, setBlog] = useState();
    const [toggleBlogLike, { isLoading: isLiking }] = useToggleBlogLikeMutation()
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const currentUser = useSelector((state) => state.user.user);


    useEffect(() => {
        if (data?.data?.oneBlog[0]) {
            setBlog(data?.data?.oneBlog[0]);
        }
    }, [data]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const toggleLike = async (e) => {
        e.preventDefault()
        try {
            const res = await toggleBlogLike(slug).unwrap()
            toast.success(res.message)

            setBlog((prev) => ({
                ...prev,
                isLiked: !prev.isLiked,
                likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
            }))
        } catch (error) {
            console.error("Error while liking blog:", error)
            toast.error(error?.data?.message || "Something went wrong while liking")
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
                Loading blog...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020817]">
            <article className="container mx-auto px-4 py-8 max-w-4xl text-white">
                {/* Header */}
                <div className="mb-8">
                    <Badge className="mb-4">{Blog?.category}</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {Blog?.title}
                    </h1>

                    <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <Link to={`/profile/${Blog?.author?.username}`} className="flex items-center gap-2 text-gray-400 hover:opacity-80 transition-opacity">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={Blog?.author.profilePic} alt={Blog?.author.username} />
                                    <AvatarFallback>{Blog?.author.username[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{Blog?.author.username}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>{formatDate(Blog?.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Cover Image */}
                <div className="mb-8 animate-scale-in">
                    <img
                        src={Blog?.featuredImage}
                        alt={Blog?.title}
                        className="w-full h-64 md:h-96 object-cover rounded-xl shadow-elegant"
                    />
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between py-4 border-y border-border mb-8 animate-slide-up">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 text-gray-400  hover:text-red-500 hover:bg-[#1e293b]  hover:cursor-pointer ${Blog?.isLiked ? "text-red-500" : ""}`}
                            onClick={toggleLike}
                        >
                            <Heart className={`h-4 w-4 mr-1 ${Blog?.isLiked ? "fill-current" : ""}`} />
                            {Blog?.likesCount}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 hover:text-primary text-gray-400 hover:bg-[#1e293b] hover:cursor-pointer"
                            onClick={() => setIsCommentModalOpen(true)}
                        >
                            <MessageCircle className="h-5 w-5" />
                            {Blog?.commentsCount}
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "text-gray-400 hover:text-primary",
                                Blog?.isBookmarked && "text-primary"
                            )}
                        >
                            <Bookmark className={cn("h-5 w-5", Blog?.isBookmarked && "fill-current")} />
                        </Button> */}

                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                                <Share2 className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-500">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                                <LinkIcon className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-12 animate-fade-in">
                    <div dangerouslySetInnerHTML={{ __html: Blog?.content }} />
                </div>

                {/* Comments Section */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-6">Comments ({Blog?.commentsCount || Blog?.comments?.length || 0})</h3>

                    <div className="space-y-6">
                        {Blog?.comments?.map((comment) => (
                            <Card key={comment._id} className="animate-fade-in">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={comment.commentedByUser.profilePic || ""} alt={comment.commentedByUser.username} />
                                            <AvatarFallback>{comment.commentedByUser.username?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="font-semibold">{comment.commentedByUser.username}</p>
                                                <span className="text-xs text-gray-400">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 mb-3">{comment.content}</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`gap-2 text-gray-400  hover:text-red-500 hover:bg-[#1e293b]  hover:cursor-pointer  ${comment.isLiked ? "text-red-500" : ""}`}
                                            >
                                                <Heart className={`h-4 w-4 mr-1 ${comment?.isLiked ? "fill-current" : ""}`} />
                                                {comment.likesCount}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>

                            </Card>
                        ))}
                    </div>
                </div>

                <CommentModal
                    isOpen={isCommentModalOpen}
                    onClose={() => setIsCommentModalOpen(false)}
                    postId={Blog?.slug}
                    currentUser={currentUser}
                />
            </article>
        </div>
    )
}

export default BlogPost