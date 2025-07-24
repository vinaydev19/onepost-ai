import React from 'react'
import { Card, CardContent } from '../ui/card';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';

function BlogCard({ post, variant = "card", showImage = true }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };


    if (variant === "list") {
        return (
            <Card className="mb-6 overflow-hidden text-white hover:shadow-hover transition-all duration-300 border-[0.5px] border-gray-800">
                <CardContent className="p-6">
                    <div className="flex gap-6">
                        {showImage && (
                            <Link to={`/blog/${post.id}`} className="flex-shrink-0">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-32 h-24 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                        )}

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                                <Link to={`/profile/${post.author.username}`} className="flex items-center gap-2 text-gray-400 hover:opacity-80 transition-opacity">
                                    <Avatar className="h-6 w-6 ">
                                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                        <AvatarFallback className="text-xs">{post.author.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-white hover:text-gray-400">{post.author.name}</span>
                                </Link>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-400">{formatDate(post.publishedAt)}</span>
                                <Badge variant="secondary" className="bg-[#293c5a]">{post.category}</Badge>
                            </div>

                            <Link to={`/blog/${post.id}`} className="group">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </Link>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-8 px-3 text-gray-400 hover:cursor-pointer hover:text-red-500 hover:bg-[#1e293b] ${post.isLiked ? "text-red-500" : ""}`}
                                    >
                                        <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                                        {post.likes}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-3 text-gray-400 hover:bg-[#1e293b] hover:cursor-pointer"
                                    >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        {post.comments}
                                    </Button>

                                    <span className="text-xs text-gray-400">{post.readTime}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-8 w-8 text-gray-400 hover:text-white hover:cursor-pointer hover:bg-[#1e293b] ${post.isBookmarked ? "text-primary" : ""}`}

                                    >
                                        <Bookmark className={`h-4 w-4 ${post.isBookmarked ? "fill-current" : ""}`} />
                                    </Button>

                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-[#1e293b] hover:cursor-pointer hover:text-white">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mb-6 overflow-hidden text-white hover:shadow-hover transition-all duration-300 border-[0.5px] border-gray-800">
            {showImage && (
                <div className="relative overflow-hidden">
                    <Link to={`/blog/${post.id}`}>
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </Link>
                    <Badge className="absolute top-3 left-3 bg-background/90 text-foreground border">
                        {post.category}
                    </Badge>
                </div>
            )}

            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Link to={`/profile/${post.author.username}`} className="flex  text-gray-400 items-center gap-2 hover:opacity-80 transition-opacity">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-white hover:text-gray-400">{post.author.name}</p>
                            <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
                        </div>
                    </Link>
                </div>

                <Link to={`/blog/${post.id}`} className="group">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                    </p>
                </Link>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 text-gray-400 hover:cursor-pointer hover:text-red-500 hover:bg-[#1e293b] ${post.isLiked ? "text-red-500" : ""}`}

                        >
                            <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                            {post.likes}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-gray-400 hover:bg-[#1e293b] hover:cursor-pointer"
                        >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments}
                        </Button>

                        <span className="text-xs text-gray-400">{post.readTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 text-gray-400 hover:text-white hover:cursor-pointer hover:bg-[#1e293b] ${post.isBookmarked ? "text-primary" : ""}`}

                        >
                            <Bookmark className={`h-4 w-4 ${post.isBookmarked ? "fill-current" : ""}`} />
                        </Button>

                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-[#1e293b] hover:cursor-pointer hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

}

export default BlogCard