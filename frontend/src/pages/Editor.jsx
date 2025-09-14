import React from 'react'
import { useState, useEffect } from 'react';
import {
    Eye, Save, Tag, Minimize, Maximize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tiptap } from '@/components/common/Tiptap';
import { useCreateBlogMutation, useGetBlogBySlugQuery, useUpdateBlogMutation } from '@/redux/api/blogApiSlice';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const Editor = ({ isEditing }) => {
    const { slug } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState("Draft");


    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mode, setMode] = useState('write');
    const [wordCount, setWordCount] = useState(0);
    const [lastSaved, setLastSaved] = useState(null);
    const [featuredImage, setFeaturedImage] = useState(null)
    const [createblog, { isLoading }] = useCreateBlogMutation()


    const navigate = useNavigate();
    const { data: blog, isLoading: isFetching } = useGetBlogBySlugQuery(slug, { skip: !isEditing });
    const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
    const blogData = blog?.data?.oneBlog?.[0];

    const categories = [
        "Technology", "Programming", "Business", "Finance", "Health", "Fitness",
        "Lifestyle", "Education", "Travel", "Food", "Design", "Writing", "Music",
        "Movies", "Science", "Environment", "Parenting", "Marketing", "Spirituality",
        "Productivity"
    ];

    useEffect(() => {
        const fetchedBlog = blog?.data?.oneBlog?.[0];
        if (fetchedBlog) {
            setTitle(fetchedBlog.title || '');
            setContent(fetchedBlog.content || '');
            setTags(fetchedBlog.tags || []);
            setCategory(fetchedBlog.category || '');
            setStatus(fetchedBlog.status || 'Draft');
            setFeaturedImage(null); // only if user uploads new one
        }
    }, [blog]);


    useEffect(() => {
        if (!content) {
            setWordCount(0);
            return;
        }
        const textContent = content.replace(/<[^>]*>/g, ' ').trim();
        const words = textContent.split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
    }, [content]);


    useEffect(() => {
        if (content || title) {
            const timer = setTimeout(() => {
                setLastSaved(new Date());
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [content, title]);

    const addTag = () => {
        const trimmed = currentTag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFeaturedImage(file);
        }
    };

    const removeImage = () => {
        setFeaturedImage(null);
    };

    // api calling
    const submitBlog = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("status", status);
        formData.append("category", category);
        tags.forEach(tag => formData.append("tags", tag));
        if (featuredImage) {
            formData.append("featuredImage", featuredImage);
        }

        try {
            if (isEditing && blogData?._id) {
                const res = await updateBlog({ id: blogData._id, formData }).unwrap();
                toast.success(res.message || "Blog updated");
                navigate(`/blog/${res.data.blog.slug}`);
            } else {
                const res = await createblog(formData).unwrap();
                toast.success(res.message || "Blog created");
                navigate(`/blog/${res.data.blog.slug}`);
            }
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong");
        }
    };

    if (isFetching) return <p className="text-white">Loading blog...</p>;

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 bg-[#020817] text-white z-50 flex flex-col">
                <div className="border-b p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Input
                            placeholder="Untitled Post"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-2xl font-bold border-none outline-none p-0 h-auto"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {wordCount} words
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(false)}>
                            <Minimize className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 p-8">
                    <Tiptap
                        content={content}
                        onChange={setContent}
                        placeholder="Start writing your story..."
                    />
                </div>

                {lastSaved && (
                    <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
                        Auto-saved {formatDate(lastSaved)}
                    </div>
                )}


            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020817] text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <Input
                                        placeholder="Untitled Post"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="text-2xl font-bold border-none outline-none p-0 h-auto"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(true)}>
                                            <Maximize className="h-4 w-4" />
                                        </Button>
                                        <Tabs value={mode} onValueChange={(v) => setMode(v)}>
                                            <TabsList className="grid w-full gap-1  grid-cols-2 bg-[#1e293b]">
                                                <TabsTrigger className={`${mode === 'write' ? "bg-[#020817]" : ""}`} value="write">Write</TabsTrigger>
                                                <TabsTrigger className={`${mode === 'preview' ? "bg-[#020817]" : ""}`} value="preview">Preview</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <Tabs value={mode} className="w-full">
                                    <TabsContent value="write" className="m-0">
                                        <Tiptap
                                            content={content}
                                            onChange={setContent}
                                            placeholder="Start writing your story..."
                                        />
                                    </TabsContent>
                                    <TabsContent value="preview" className="m-0">
                                        <div className="p-6 min-h-[600px]">
                                            <h1 className="text-4xl font-bold mb-8">{title || 'Untitled Post'}</h1>
                                            <div
                                                className="prose prose-invert prose-lg max-w-none"
                                                dangerouslySetInnerHTML={{ __html: content }}
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                                <span>{wordCount} words</span>
                                {lastSaved && <span>Auto-saved {formatDate(lastSaved)}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Cover Image</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!featuredImage ? (
                                    <div>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer px-4 py-2 bg-[#6b40e2] text-black rounded-md transition-transform duration-200 hover:scale-105"
                                        >
                                            Choose Image
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={URL.createObjectURL(featuredImage)}
                                            alt="Featured Preview"
                                            className="rounded-md max-h-48 object-cover w-full"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute bottom-2 left-2 bg-[#6b40e2] text-black rounded-md transition-transform duration-200 hover:scale-105 cursor-pointer"
                                            onClick={removeImage}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>


                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Publish</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={status === "Published"}
                                            onChange={(e) => setStatus(e.target.checked ? "Published" : "Draft")}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                    <Label htmlFor="draft-mode">Save as draft</Label>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={submitBlog} className="flex-1 bg-[#6b40e2] hover:cursor-pointer text-black transition-transform duration-200 hover:scale-105">
                                        <Save className="w-4 h-4 mr-2" />
                                        {status === "Published" ? "Published" : "Draft"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="category" className='mb-2'>Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className='text-white bg-[#020817]'>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="tags">Tags</Label>
                                    <div className="flex gap-2 mb-2 mt-2">
                                        <Input
                                            id="tags"
                                            placeholder="Add a tag"
                                            value={currentTag}
                                            onChange={(e) => setCurrentTag(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTag();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addTag} className='bg-[#6b40e2] hover:cursor-pointer text-black transition-transform duration-200 hover:scale-105' size="sm">
                                            <Tag className="w-4 h-4 " />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="cursor-pointer"
                                                onClick={() => removeTag(tag)}
                                            >
                                                {tag} ×
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
