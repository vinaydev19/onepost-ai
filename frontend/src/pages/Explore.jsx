import BlogCard from '@/components/common/BlogCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import blogHero1 from "../assets/Logo.png";
import blogHero2 from "../assets/Logo.png";
import blogHero3 from "../assets/Logo.png";
import { useGetAllBlogsQuery } from '@/redux/api/blogApiSlice';



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

  console.log(allBlogs);

  useEffect(() => {
    if (data?.data?.blogs) {
      setAllBlogs(data.data.blogs);
    }
  }, [data]);



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
          {allBlogs.map((blog) => (
            <BlogCard key={`trending-${blog._id}`} post={blog} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Explore