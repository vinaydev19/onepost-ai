import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Blog } from "../models/blog.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"

const createBlog = asyncHandler(async (req, res) => {
    const { title, slug, content, status } = req.body

    if ([title, slug, content, status].some((field) => !field || field.trim() == "")) {
        throw new ApiError(400, "all field are required")
    }

    const featuredImageLocalPath = req.files?.featuredImage[0].path
    const featuredImage = await uploadOnCloudinary(featuredImageLocalPath)

    let otherFilesLocalPath = [];
    if (Array.isArray(req.files?.files) && req.files.files.length > 0) {
        otherFilesLocalPath = req.files.files.map(file => file.path);
    }

    const otherFiles = [];
    for (const path of otherFilesLocalPath) {
        const uploadResult = await uploadOnCloudinary(path);
        if (uploadResult?.url) {
            otherFiles.push(uploadResult.url);
        }
    }

    const blog = await Blog.create({
        author: req.user._id,
        title,
        slug,
        content,
        status,
        featuredImage: featuredImage.url,
        files: otherFiles
    })

    if (!blog) {
        throw new ApiError(500, "something want wrong while create blog")
    }

    return res.status(200).json(new ApiResponse(200, { blog }, "blog added successfully"))
})

const getAllBlog = asyncHandler(async (req, res) => {
    const allBlogs = await Blog.find({})

    return res
        .status(200)
        .json(new ApiResponse(200, { allBlogs }, "All blogs fetched successfully"))
})

const getOneBlog = asyncHandler(async (req, res) => {
    const slug = req.params.slug

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

    const BlogsByAuthor = await User.find({ username })

    if (!BlogsByAuthor) {
        throw new ApiError(404, "User not found");
    }

    const blogs = await Blog.find({ author: BlogsByAuthor._id })

    return res
        .status(200)
        .json(new ApiResponse(200, { blogs }, `Blogs by ${username} fetched successfully`));
});

const updateBlog = asyncHandler(async (req, res) => {
    const slug = req.params.slug;

    const existingBlog = await Blog.findOne({ slug });
    if (!existingBlog) {
        throw new ApiError(404, "Blog not found");
    }

    const { title, content, status } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (status) updates.status = status;

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

    const updatedBlog = await Blog.findOneAndUpdate(
        { slug },
        updates,
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { blog: updatedBlog }, "Blog updated successfully"));
});

const deleteBlog = asyncHandler(async (req, res) => {
    const slug = req.params.slug;

    const blog = await Blog.findOneAndDelete({ slug });

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
    const { slug } = req.params;
    const { status } = req.body;

    if (!["Draft", "Published", "Pending Approval"].includes(status)) {
        throw new ApiError(400, "Invalid blog status");
    }

    const blog = await Blog.findOneAndUpdate(
        { slug },
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
    getMyBlogs,
    updateBlogStatus
}