import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Grid, List } from 'lucide-react';
import BlogCard from '@/components/common/BlogCard';
import { useGetAllBlogsQuery } from '@/redux/api/blogApiSlice';

const blogCategories = [
    "All",
    "Technology",
    "Programming",
    "Business",
    "Finance",
    "Health",
    "Fitness",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
    "Design",
    "Writing",
    "Music",
    "Movies",
    "Science",
    "Environment",
    "Parenting",
    "Marketing",
    "Spirituality",
    "Productivity"
];

function Home() {
    const [viewMode, setViewMode] = useState("card")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [sortBy, setSortBy] = useState("latest")
    const [allBlogs, setAllBlogs] = useState([])

    const { data, isLoading } = useGetAllBlogsQuery({})
    
    useEffect(() => {
        if (data?.data?.blogs) {
            setAllBlogs(data.data.blogs);
        }
    }, [data]);


    const filteredPosts = allBlogs.filter((blog) => {
        return selectedCategory === "All" || blog.category === selectedCategory
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
                Loading blogs...
            </div>
        );
    }

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

                <div className='flex flex-col md:flex-row gap-4 items-center justify-end mb-8'>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-[200px] text-white">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="text-white bg-[#020817]">
                            {blogCategories.map((category) => (
                                <SelectItem key={category} className="hover:cursor-pointer hover:bg-[#1e293b]" value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40 md:w-[200px] text-white">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="text-white bg-[#020817]">
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

                <div className={
                    viewMode === "card"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "max-w-4xl mx-auto"
                }>
                    {filteredPosts.map((post, index) => (
                        <div
                            key={post._id}
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
        </div >
    )
}

export default Home