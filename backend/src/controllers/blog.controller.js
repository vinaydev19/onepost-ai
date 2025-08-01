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
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query

    const skip = (page - 1) * limit;

    const sortOptions = {};
    if (sortBy) {
        sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
    } else {
        sortOptions.createdAt = -1;
    }

    const allBlogs = await Blog.find({})
        .sort(sortOptions)
        .limit(Number(limit))
        .skip(skip)
        .populate("author", "username email");


    const totalBlogs = await Blog.countDocuments({});

    const totalPages = Math.ceil(totalBlogs / limit);

    return res.status(200).json(new ApiResponse(200, {
        blogs: allBlogs,
        totalBlogs,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
    }, "all blogs fetched successfully"))
})

const getOneBlog = asyncHandler(async (req, res) => {
    const slug = req.params.slug

    if (!slug) {
        throw new ApiError(400, "slug is required")
    }

    const oneBlog = await Blog.findOne({ slug })

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

const getMyBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, { blogs }, "Your blogs"));
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

const searchBlogs = asyncHandler(async (req, res) => {
    const { query, page = 1, limit = 10, sortBy, sortType, } = req.query;

    const searchQuery = query ? {
        $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } }
        ]
    } : {};

    const sortOptions = {};
    if (sortBy) {
        sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
    } else {
        sortOptions.createdAt = -1; // Default sorting by createdAt
    }

    const blogs = await Blog.find(searchQuery)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("author", "username email");


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

const searchBlogsByCategory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, sortBy, sortType } = req.query

    if (!category) {
        throw new ApiError()
    }

    const searchQuery = { category: { $regex: category, $options: 1 } }

    const sortOptions = {}
    if (sortBy) {
        sortOptions[sortBy] = sortBy === "desc" ? -1 : 1
    } else {
        sortOptions.createdAt = -1
    }

    const skip = (page - 1) * limit

    const blogs = await Blog.find({ searchQuery })
        .sort(sortOptions)
        .skip((skip))
        .limit(Number(limit))
        .populate("author", "username email");

    const totalBlogs = await Blog.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalBlogs / limit);


    return res.status(200).json(new ApiResponse(200, {
        blogs,
        totalBlogs,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit),
    }, "Blogs fetched successfully"))
})

export {
    createBlog,
    getAllBlog,
    getOneBlog,
    getAllBlogByAuthor,
    updateBlog,
    deleteBlog,
    getMyBlogs,
    updateBlogStatus,
    searchBlogs,
    searchBlogsByCategory
}