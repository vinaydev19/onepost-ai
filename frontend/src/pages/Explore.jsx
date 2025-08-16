import BlogCard from '@/components/common/BlogCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
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

function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        <div className="text-center mb-12 ">
          <h1 className="text-4xl font-bold text-[#6c46e2] bg-gradient-to-r  mb-4">
            Explore & Discover
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl text-gray-300 mx-auto">
            Find amazing content, discover new authors, and explore topics that inspire you
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blogs, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-white text-white"
            />
          </div>
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
            <SelectTrigger className="w-full md:w-[200px]  text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="text-white bg-[#020817]">
              <SelectItem className="hover:cursor-pointer hover:bg-[#1e293b]" value="popularity">Most Popular</SelectItem>
              <SelectItem className="hover:cursor-pointer hover:bg-[#1e293b]" value="recent">Most Recent</SelectItem>
              <SelectItem className="hover:cursor-pointer hover:bg-[#1e293b]" value="trending">Trending</SelectItem>
              <SelectItem className="hover:cursor-pointer hover:bg-[#1e293b]" value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 mb-6">
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((blog) => (
            <BlogCard key={`trending-${blog._id}`} post={blog} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Explore