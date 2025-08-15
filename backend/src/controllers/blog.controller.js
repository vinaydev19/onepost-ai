import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Blog } from "../models/blog.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"

const createBlog = asyncHandler(async (req, res) => {
    const { title, content, status, category, tags } = req.body

    console.log([title, content, status]);


    if ([title, content, status, category, tags].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "all field are required")
    }

    const featuredImageLocalPath = req.files?.featuredImage[0].path
    const featuredImage = await uploadOnCloudinary(featuredImageLocalPath)

    if (!featuredImage?.url) {
        throw new ApiError(500, "something went wrong while uploading featured image")
    }

    let otherFilesLocalPath = [];
    if (Array.isArray(req.files?.files) && req.files.files.length > 0) {
        otherFilesLocalPath = req.files.files.map(file => file.path);
    }

    const otherFiles = [];
    for (let i = 0; i < otherFilesLocalPath.length; i++) {
        const filePath = otherFilesLocalPath[i];
        try {
            const uploadResult = await uploadOnCloudinary(filePath);

            if (uploadResult?.url) {
                otherFiles.push(uploadResult.url);
            } else {
                throw new Error("No URL returned from Cloudinary");
            }
        } catch (error) {
            console.error(`❌ Failed to upload file at index ${i}:`, error.message);
            throw new ApiError(500, `Failed to upload file at index ${i}`);
        }
    }

    const blog = await Blog.create({
        author: req.user._id,
        title,
        content,
        status,
        category,
        tags,
        featuredImage: featuredImage.url,
        files: otherFiles
    })

    if (!blog) {
        throw new ApiError(500, "something want wrong while create blog")
    }

    return res.status(200).json(new ApiResponse(200, { blog }, "blog added successfully"))
})

const getAllBlog = asyncHandler(async (req, res) => {
    const {
        query,
        category,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortType = "desc"
    } = req.query;

    const searchQuery = {};

    if (query) {
        searchQuery.$or = [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } }
        ];
    }

    if (category && category !== "All") {
        searchQuery.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const sortOptions = {};
    sortOptions[sortBy] = sortType === "desc" ? -1 : 1;

    console.log("id:", req.user?._id);

    const blogs = await Blog.aggregate([
        {
            $match: searchQuery
        },
        {
            $sort: sortOptions
        },
        {
            $skip: Number(skip)
        },
        {
            $limit: Number(limit)
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        },
        { $unwind: "$author" },
        {
            $lookup: {
                from: "likes", // Assuming likes is the collection name for likes
                localField: "_id", // Local field in the Blog collection -  current blogs id
                foreignField: "Blog", // Foreign field in the Likes collection - match blog id === this current blog id
                as: "likes" // Name of the field to add in the output documents
            }
        },
        {
            $lookup: {
                from: "comments", // Assuming comments is the collection name for comments
                localField: "_id", // Local field in the Blog collection - current blogs id
                foreignField: "Blog",  // Foreign field in the Comments collection - match blog id === this current blog id
                as: "comments", // Name of the field to add in the output documents
                pipeline: [
                    {
                        $lookup: {
                            from: "users", // Assuming users is the collection name for users
                            localField: "commentedBy", // Local field in the Comments collection - commentedBy field
                            foreignField: "_id", // Foreign field in the Users collection - match user id === commentedBy id
                            as: "commentedByUser", // Name of the field to add in the output documents
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        profilePic: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind: "$commentedByUser"
                    },
                    {
                        $lookup: {
                            from: "likes", // Assuming likes is the collection name for likes
                            localField: "_id", // Local field in the Comments collection - current comment id
                            foreignField: "comment", // Foreign field in the Likes collection - match comment id === this current comment id
                            as: "likes" // Name of the field to add in the output documents
                        }
                    },
                    {
                        $addFields: {
                            likesCount: { $size: "$likes" },
                            isLiked: {
                                $cond: {
                                    if: { $in: [{ $toObjectId: req.user?._id }, "$likes.likedBy"] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            content: 1,
                            commentedBy: 1,
                            commentedByUser: 1,
                            createdAt: 1,
                            likesCount: 1,
                            isLiked: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" }, // Count of likes
                commentsCount: { $size: "$comments" }, // Count of comments
                isLiked: {
                    $cond: {
                        if: { $in: [{ $toObjectId: req.user?._id }, "$likes.likedBy"] }, // Check if the user has liked the blog
                        then: true,
                        else: false
                    }
                },
                canEdit: {
                    $cond: {
                        if: { $eq: [req.user?._id, "$author._id"] }, // Check if the current user is the author of the blog
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                author: 1,
                title: 1,
                slug: 1,
                content: 1,
                featuredImage: 1,
                files: 1,
                status: 1,
                category: 1,
                tags: 1,
                likesCount: 1,
                commentsCount: 1,
                isLiked: 1,
                canEdit: 1,
                comments: {
                    _id: 1,
                    content: 1,
                    commentedBy: 1,
                    commentedByUser: 1,
                    likesCount: 1,
                    isLiked: 1,
                    createdAt: 1
                },
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])

    const totalBlogs = await Blog.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalBlogs / limit);

    return res.status(200).json(new ApiResponse(200, {
        blogs,
        totalBlogs,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
    }, "Blogs fetched successfully"));
});

const getOneBlog = asyncHandler(async (req, res) => {
    const slug = req.params.slug

    if (!slug) {
        throw new ApiError(400, "slug is required")
    }

    const oneBlog = await Blog.aggregate([
        {
            $match: { slug: slug }
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        },
        { $unwind: "$author" },
        {
            $lookup: {
                from: "likes", // Assuming likes is the collection name for likes
                localField: "_id", // Local field in the Blog collection -  current blogs id
                foreignField: "Blog", // Foreign field in the Likes collection - match blog id === this current blog id
                as: "likes" // Name of the field to add in the output documents
            }
        },
        {
            $lookup: {
                from: "comments", // Assuming comments is the collection name for comments
                localField: "_id", // Local field in the Blog collection - current blogs id
                foreignField: "Blog",  // Foreign field in the Comments collection - match blog id === this current blog id
                as: "comments", // Name of the field to add in the output documents
                pipeline: [
                    {
                        $lookup: {
                            from: "users", // Assuming users is the collection name for users
                            localField: "commentedBy", // Local field in the Comments collection - commentedBy field
                            foreignField: "_id", // Foreign field in the Users collection - match user id === commentedBy id
                            as: "commentedByUser", // Name of the field to add in the output documents
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        profilePic: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind: "$commentedByUser"
                    },
                    {
                        $lookup: {
                            from: "likes", // Assuming likes is the collection name for likes
                            localField: "_id", // Local field in the Comments collection - current comment id
                            foreignField: "comment", // Foreign field in the Likes collection - match comment id === this current comment id
                            as: "likes" // Name of the field to add in the output documents
                        }
                    },
                    {
                        $addFields: {
                            likesCount: { $size: "$likes" },
                            isLiked: {
                                $cond: {
                                    if: { $in: [{ $toObjectId: req.user?._id }, "$likes.likedBy"] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            content: 1,
                            commentedBy: 1,
                            commentedByUser: 1,
                            createdAt: 1,
                            likesCount: 1,
                            isLiked: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" }, // Count of likes
                commentsCount: { $size: "$comments" }, // Count of comments
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] }, // Check if the user has liked the blog
                        then: true,
                        else: false
                    }
                },
                canEdit: {
                    $cond: {
                        if: { $eq: [req.user?._id, "$author._id"] }, // Check if the current user is the author of the blog
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                author: 1,
                title: 1,
                slug: 1,
                content: 1,
                featuredImage: 1,
                files: 1,
                status: 1,
                category: 1,
                tags: 1,
                likesCount: 1,
                commentsCount: 1,
                isLiked: 1,
                canEdit: 1,
                comments: {
                    _id: 1,
                    content: 1,
                    commentedBy: 1,
                    commentedByUser: 1,
                    likesCount: 1,
                    isLiked: 1,
                    createdAt: 1
                },
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])

    if (!oneBlog) {
        throw new ApiError(404, "blog not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { oneBlog }, "blog fetched successfully"))
})

const getAllBlogByAuthor = asyncHandler(async (req, res) => {
    const username = req.params.username

    const BlogsByAuthor = await User.findOne({ username })

    if (!BlogsByAuthor) {
        throw new ApiError(404, "User not found");
    }

    const blogs = await Blog.find({ author: BlogsByAuthor._id })

    return res
        .status(200)
        .json(new ApiResponse(200, { blogs }, `Blogs by ${username} fetched successfully`));
});

const updateBlog = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
        throw new ApiError(404, "Blog not found");
    }

    const { title, content, status, category, tags } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (status) updates.status = status;
    if (category) updates.category = category;
    if (tags) updates.tags = tags;

    // TODO:

    const featuredImageLocalPath = req.files?.featuredImage?.[0]?.path

    if (featuredImageLocalPath) {
        const featuredImageUpload = await uploadOnCloudinary(featuredImageLocalPath);
        if (featuredImageUpload?.url) {
            updates.featuredImage = featuredImageUpload.url;
        }
    }

    let newFileUrls = [];
    if (Array.isArray(req.files?.files) && req.files.files.length > 0) {
        const filePaths = req.files.files.map(file => file.path);

        for (const path of filePaths) {
            const uploadResult = await uploadOnCloudinary(path);
            if (uploadResult?.url) {
                newFileUrls.push(uploadResult.url);
            }
        }
    }

    if (newFileUrls.length > 0) {
        updates.$push = { files: { $each: newFileUrls } };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { blog: updatedBlog }, "Blog updated successfully"));
});

const deleteBlog = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!id) {
        throw new ApiError(400, "Blog ID is required");
    }
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Blog deleted successfully"));
});

const updateBlogStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    if (["Draft", "Published", "Pending Approval"].some((s) => s === status) === false) {
        throw new ApiError(400, "Invalid status. Allowed values are: Draft, Published, Pending Approval");
    }

    const blog = await Blog.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { blog }, "Blog status updated"));
});


export {
    createBlog,
    getAllBlog,
    getOneBlog,
    getAllBlogByAuthor,
    updateBlog,
    deleteBlog,
    updateBlogStatus,
}