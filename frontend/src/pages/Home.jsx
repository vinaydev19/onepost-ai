import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import blogHero1 from "../assets/Logo.png";
import blogHero2 from "../assets/Logo.png";
import blogHero3 from "../assets/Logo.png";
import { Filter, Grid, List } from 'lucide-react';
import BlogCard from '@/components/common/BlogCard';

// Mock data for demonstration
const mockPosts = [
    {
        id: "1",
        title: "The Future of Web Development: Trends to Watch in 2024",
        excerpt: "Explore the latest trends shaping the future of web development...",
        content: "Full article content here...",
        coverImage: blogHero1,
        author: {
            name: "Sarah Chen",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            username: "sarahchen"
        },
        publishedAt: "2024-01-15",
        category: "Technology", // ✅ already valid
        likes: 124,
        comments: 23,
        readTime: "5 min read",
        isLiked: true,
        isBookmarked: false
    },
    {
        id: "2",
        title: "Building Better User Experiences with Design Systems",
        excerpt: "Learn how to create and maintain design systems...",
        content: "Full article content here...",
        coverImage: blogHero2,
        author: {
            name: "Alex Thompson",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            username: "alexthompson"
        },
        publishedAt: "2024-01-12",
        category: "Design", // ✅ already valid
        likes: 89,
        comments: 15,
        readTime: "7 min read",
        isLiked: false,
        isBookmarked: true
    },
    {
        id: "3",
        title: "Productivity Hacks for Remote Workers",
        excerpt: "Discover proven strategies and tools...",
        content: "Full article content here...",
        coverImage: blogHero3,
        author: {
            name: "Maria Rodriguez",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            username: "mariarodriguez"
        },
        publishedAt: "2024-01-10",
        category: "Personal", // ⬅️ Changed from "Productivity" to "Personal"
        likes: 156,
        comments: 31,
        readTime: "4 min read",
        isLiked: false,
        isBookmarked: false
    },
    {
        id: "4",
        title: "The Art of Code Reviews: Best Practices for Teams",
        excerpt: "Master the art of giving and receiving code reviews...",
        content: "Full article content here...",
        coverImage: blogHero1,
        author: {
            name: "David Kim",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            username: "davidkim"
        },
        publishedAt: "2024-01-08",
        category: "Technology", // ⬅️ Changed from "Development" to "Technology"
        likes: 203,
        comments: 45,
        readTime: "6 min read",
        isLiked: true,
        isBookmarked: true
    },
    {
        id: "5",
        title: "Understanding Modern CSS: Grid, Flexbox, and Beyond",
        excerpt: "Deep dive into modern CSS layout techniques...",
        content: "Full article content here...",
        coverImage: blogHero2,
        author: {
            name: "Emma Wilson",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            username: "emmawilson"
        },
        publishedAt: "2024-01-05",
        category: "Education", // ⬅️ Changed from "CSS" to "Education"
        likes: 178,
        comments: 28,
        readTime: "8 min read",
        isLiked: false,
        isBookmarked: false
    }
];


const blogCategories = [
    "All",
    "Personal",
    "Technology",
    "Business",
    "Design",
    "Education",
    "General"
];


function Home() {
    const [viewMode, setViewMode] = useState("card")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [sortBy, setSortBy] = useState("latest")

    const filteredPosts = mockPosts.filter((blog) => {
        return selectedCategory === "All" || blog.category === selectedCategory
    })

    const sortedByBlogs = [...filteredPosts].sort((a, b) => {
        if (sortBy === "popular") {
            return b.likes - a.likes
        } else if (sortBy === "comments") {
            return b.comments - a.comments
        } else {
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        }
    })

    const user = {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
        email: "john@example.com"
    };


    return (
        <div className='min-h-screen bg-[#020817]'>
            <div className='container mx-auto px-4 py-8'>
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#6c46e2]">
                        Discover Amazing Stories
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                        Explore thought-provoking articles, insights, and stories from our community of writers and creators.
                    </p>
                    <Button variant="hero" size="lg" className="bg-[#6c46e2] transition-transform duration-200 hover:scale-105 hover:cursor-pointer">
                        Start Reading
                    </Button>
                </div>

                <div className='flex flex-col md:flex-row gap-4 items-center justify-between mb-8'>
                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full bg-[#1e293b] rounded-md md:w-auto">
                        <TabsList>
                            {
                                blogCategories.map((category) => (
                                    <TabsTrigger
                                        key={category}
                                        value={category}
                                        className={`text-xs md:text-sm hover:cursor-pointer px-4 py-2 rounded-md transition-colors ${selectedCategory === category ? "bg-[#020817] text-white" : "text-slate-300 hover:text-white"}`}
                                    >
                                        {category}
                                    </TabsTrigger>

                                ))
                            }
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-4 bg-[#020817] text-white">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-40">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="text-white">
                                <SelectItem className="hover:cursor-pointer hover:bg-[#1e293b]" value="latest">Latest</SelectItem>
                                <SelectItem className="hover:cursor-pointer hover:bg-[#1e293b]" value="popular">Most Popular</SelectItem>
                                <SelectItem className="hover:cursor-pointer hover:bg-[#1e293b]" value="comments">Most Discussed</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex border border-border rounded-md">
                            <Button
                                size="sm"
                                onClick={() => setViewMode("card")}
                                className={`rounded-r-none hover:cursor-pointer ${viewMode === "card" ? "bg-[#1e293b] text-white" : "text-slate-300 hover:text-white"}`}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className={`rounded-r-none hover:cursor-pointer ${viewMode === "list" ? "bg-[#1e293b] text-white" : "text-slate-300 hover:text-white"}`}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={
                    viewMode === "card"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "max-w-4xl mx-auto"
                }>
                    {sortedByBlogs.map((post, index) => (
                        <div
                            key={post.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <BlogCard post={post} variant={viewMode} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button variant="outline" size="lg" className="border-gray-800 border-[0.5px] hover:bg-[#1e293b] text-white hover:cursor-pointer">
                        Load More Articles
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Home