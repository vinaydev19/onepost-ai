import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Blog } from "../models/blog.model.js"
import { Comment } from "../models/comment.model.js"


const addComment = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { content } = req.body;    

    if (!slug) {
        throw new ApiError(404, "Blog not found");
    }

    if (!content) {
        throw new ApiError(400, "Content cannot be empty");
    }

    const blogId = await Blog.findOne({ slug })

    if (!blogId) {
        throw new ApiError(404, "Blog not found");
    }

    const comment = await Comment.create({
        content,
        Blog: blogId,
        commentedBy: req.user._id
    })

    if (!comment) {
        throw new ApiError(500, "Failed to add comment");
    }

    return res.status(201).json(new ApiResponse(200, { comment }, "content added successfully"));
})

const getAllComments = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
        throw new ApiError(404, "Blog not found");
    }

    const blogId = await Blog.findOne({ slug })

    if (!blogId) {
        throw new ApiError(404, "Blog not found");
    }


    const comments = await Comment.find({ Blog: blogId })
        .populate("commentedBy", "username email")

    if (!comments || comments.length === 0) {
        throw new ApiError(404, "No comments found for this blog");
    }

    return res.status(200).json(new ApiResponse(200, { comments }, "Comments fetched successfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;


    const comment = await Comment.findOneAndDelete({ _id: commentId });

    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not authorized to delete this comment");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content cannot be empty");
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not authorized to update this comment");
    }

    return res.status(200).json(new ApiResponse(200, { comment }, "Comment updated successfully"));
})


export {
    addComment,
    getAllComments,
    deleteComment,
    updateComment
}
