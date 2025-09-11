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

const Editor = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [category, setCategory] = useState('');
    const [isDraft, setIsDraft] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mode, setMode] = useState('write');
    const [wordCount, setWordCount] = useState(0);
    const [lastSaved, setLastSaved] = useState(null);

    const categories = [
        "Technology", "Programming", "Business", "Finance", "Health", "Fitness",
        "Lifestyle", "Education", "Travel", "Food", "Design", "Writing", "Music",
        "Movies", "Science", "Environment", "Parenting", "Marketing", "Spirituality",
        "Productivity"
    ];

    useEffect(() => {
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
                                <CardTitle className="text-lg">Publish</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={isDraft}
                                            onChange={(e) => setIsDraft(e.target.checked)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                    <Label htmlFor="draft-mode">Save as draft</Label>
                                </div>

                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-[#6b40e2] hover:cursor-pointer text-black transition-transform duration-200 hover:scale-105">
                                        <Save className="w-4 h-4 mr-2" />
                                        {isDraft ? 'Save Draft' : 'Publish'}
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
                                                <SelectItem key={cat} value={cat.toLowerCase()}>
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
