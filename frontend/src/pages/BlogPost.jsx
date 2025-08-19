import React from 'react'
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Bookmark, Share2, Twitter, Facebook, Link as LinkIcon, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

import blogHero1 from "@/assets/Logo.png";
import blogHero2 from "@/assets/Logo.png";
import blogHero3 from "@/assets/Logo.png";

const mockPost = {
    id: "1",
    title: "The Future of Web Development: Trends to Watch in 2024",
    content: `
  <p>CSS continues to evolve, giving developers more powerful tools to create responsive, accessible, and visually stunning interfaces. In 2024, several new CSS features and practices are shaping the way we design for the web.</p>

  <h2>1. Container Queries</h2>
  <p>Container Queries are one of the most anticipated features in modern CSS. Unlike media queries that depend on viewport size, container queries adapt styles based on the size of a parent container. This makes building truly responsive components much easier.</p>

  <p>With container queries, you can create flexible, reusable components that adapt to different layouts without relying on global breakpoints.</p>

  <h2>2. CSS Subgrid</h2>
  <p>CSS Grid revolutionized layouts, and now Subgrid takes it a step further. Subgrid allows child elements to align with their parent grid’s rows or columns, solving long-standing issues with nested layouts.</p>

  <p>This gives designers precise control over complex layouts without resorting to hacks or redundant wrappers.</p>

  <h2>3. Modern CSS Color Functions</h2>
  <p>CSS now supports advanced color functions like <code>lab()</code>, <code>lch()</code>, and <code>color-mix()</code>. These functions provide better control, accessibility, and color management compared to traditional hex or RGB values.</p>

  <blockquote>
    "The future of CSS color is about precision, accessibility, and dynamic design systems."
  </blockquote>

  <p>These new functions make it easier to create themes, ensure contrast ratios, and design for wide-gamut displays.</p>

  <h2>4. Scoped Styles with <code>@scope</code></h2>
  <p>The new <code>@scope</code> rule allows developers to define styles that only apply within a specific container. This eliminates the need for deep class naming conventions and reduces style conflicts.</p>

  <p>Scoped styles are a step toward native CSS component isolation, making CSS more maintainable in large projects.</p>

  <h2>5. CSS Nesting</h2>
  <p>Inspired by preprocessors like Sass, native CSS Nesting is finally arriving. Nesting allows you to write cleaner and more structured CSS by scoping rules inside parent selectors:</p>

  <pre><code>
  .card {
    padding: 1rem;
    & h2 {
      font-size: 1.5rem;
    }
  }
  </code></pre>

  <p>This improves readability and reduces repetition, especially in component-driven development.</p>

  <h2>Conclusion</h2>
  <p>CSS in 2024 is more powerful than ever, giving developers tools that once required preprocessors or JavaScript. By embracing container queries, subgrid, new color functions, scoped styles, and nesting, you can build modern, scalable, and accessible designs with pure CSS.</p>

  <p>As with any new technology, adopt these features progressively while keeping accessibility, performance, and maintainability in mind.</p>
`,
    coverImage: blogHero1,
    author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        username: "sarahchen",
        bio: "Full-stack developer passionate about modern web technologies and user experience. Currently building tools that help developers create better applications.",
        followers: 1247,
        following: 156
    },
    publishedAt: "2024-01-15",
    category: "Technology",
    likes: 124,
    comments: 23,
    readTime: "5 min read",
    isLiked: true,
    isBookmarked: false,
    isFollowing: false
};

const mockComments = [
    {
        id: "1",
        author: {
            name: "Alex Johnson",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            username: "alexjohnson"
        },
        content: "Great insights! I especially agree with the point about AI-powered development tools. They've already changed how I work.",
        publishedAt: "2024-01-16",
        likes: 12,
        isLiked: false
    },
    {
        id: "2",
        author: {
            name: "Maria Rodriguez",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            username: "mariarodriguez"
        },
        content: "The section on performance-first development really resonates with me. Core Web Vitals have become so important for SEO.",
        publishedAt: "2024-01-16",
        likes: 8,
        isLiked: true
    }
];

const relatedPosts = [
    {
        id: "2",
        title: "Building Better User Experiences with Design Systems",
        coverImage: blogHero2,
        readTime: "7 min read"
    },
    {
        id: "3",
        title: "Understanding Modern CSS: Grid, Flexbox, and Beyond",
        coverImage: blogHero3,
        readTime: "8 min read"
    }
];

function BlogPost() {
    const { id } = useParams();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };


    return (
        <div className="min-h-screen bg-[#020817]">
            <article className="container mx-auto px-4 py-8 max-w-4xl text-white">
                {/* Header */}
                <div className="mb-8">
                    <Badge className="mb-4">{mockPost.category}</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {mockPost.title}
                    </h1>

                    <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={mockPost.author.avatar} alt={mockPost.author.name} />
                                <AvatarFallback>{mockPost.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{mockPost.author.name}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span>{formatDate(mockPost.publishedAt)}</span>
                                    <span>•</span>
                                    <span>{mockPost.readTime}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant={mockPost.isFollowing ? "secondary" : "default"}
                                size="sm"
                                className={`gap-2 ${mockPost.isFollowing ? "" : "bg-[#6c46e2]"}`}
                            >
                                <UserPlus className="h-4 w-4" />
                                {mockPost.isFollowing ? "Following" : "Follow"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Cover Image */}
                <div className="mb-8 animate-scale-in">
                    <img
                        src={mockPost.coverImage}
                        alt={mockPost.title}
                        className="w-full h-64 md:h-96 object-cover rounded-xl shadow-elegant"
                    />
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between py-4 border-y border-border mb-8 animate-slide-up">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 text-gray-400  hover:text-red-500 hover:bg-[#1e293b]  hover:cursor-pointer ${mockPost.isLiked ? "text-red-500" : ""}`}

                        >
                            <Heart className={`h-4 w-4 mr-1 ${mockPost?.isLiked ? "fill-current" : ""}`} />
                            {mockPost.likes}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-gray-400 hover:text-primary"
                        >
                            <MessageCircle className="h-5 w-5" />
                            {mockPost.comments}
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "text-gray-400 hover:text-primary",
                                mockPost.isBookmarked && "text-primary"
                            )}
                        >
                            <Bookmark className={cn("h-5 w-5", mockPost.isBookmarked && "fill-current")} />
                        </Button>

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
                    <div dangerouslySetInnerHTML={{ __html: mockPost.content }} />
                </div>

                {/* Comments Section */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-6">Comments ({mockPost.comments})</h3>

                    <div className="space-y-6">
                        {mockComments.map((comment) => (
                            <Card key={comment.id} className="animate-fade-in">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="font-semibold">{comment.author.name}</p>
                                                <span className="text-xs text-gray-400">
                                                    {formatDate(comment.publishedAt)}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 mb-3">{comment.content}</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`gap-2 text-gray-400  hover:text-red-500 hover:bg-[#1e293b]  hover:cursor-pointer  ${comment.isLiked ? "text-red-500" : ""}`}
                                            >
                                                <Heart className={`h-4 w-4 mr-1 ${comment?.isLiked ? "fill-current" : ""}`} />
                                                {comment.likes}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    )
}

export default BlogPost