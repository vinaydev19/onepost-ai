import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";


const toggleBlogLike = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
        throw new ApiError(400, "Blog slug is required");
    }

    const blogId = await Blog.findOne({ slug })

    if (!blogId) {
        throw new ApiError(404, "Blog not found");
    }

    const existingLike = await Like.findOne({
        Blog: blogId._id,
        likedBy: req.user._id
    });


    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new ApiResponse(200, {}, "Blog like removed successfully"));
    } else {
        const like = await Like.create({
            Blog: blogId._id,
            likedBy: req.user._id
        });

        if (!like) {
            throw new ApiError(500, "Failed to like the blog");
        }

        return res.status(200).json(new ApiResponse(200, { like }, "Blog liked successfully"));
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });


    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new ApiResponse(200, {}, "comment like removed successfully"));
    } else {
        const like = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        });

        if (!like) {
            throw new ApiError(500, "Failed to like the comment");
        }

        return res.status(200).json(new ApiResponse(200, { like }, "comment liked successfully"));
    }
})

const getBlogLikes = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const likes = await Like.find({ Blog: blog._id }).populate("likedBy", "name email");

    return res.status(200).json(new ApiResponse(200, { count: likes.length, likes }, "Blog likes fetched"));
});

const getCommentLikes = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const likes = await Like.find({ comment: commentId }).populate("likedBy", "name email");

    return res.status(200).json(new ApiResponse(200, { count: likes.length, likes }, "Comment likes fetched"));
});


export {
    toggleCommentLike,
    toggleBlogLike,
    getBlogLikes,
    getCommentLikes
}

