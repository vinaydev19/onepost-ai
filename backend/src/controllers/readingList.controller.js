import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ReadingList } from "../models/readingList.model.js"

const createReadingList = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) {
        throw new ApiError(400, "Reading list name is required");
    }

    const newReadingList = await ReadingList.create({
        name,
        description,
        userId
    });

    res.status(201).json(new ApiResponse("Reading list created successfully", newReadingList));
});

const getReadingLists = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const readingLists = await ReadingList.find({ userId }).populate("blog");

    if (!readingLists || readingLists.length === 0) {
        throw new ApiError(404, "No reading lists found");
    }

    res.status(200).json(new ApiResponse("Reading lists retrieved successfully", readingLists));
});

const deleteReadingList = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const readingListToDelete = await ReadingList.findOneAndDelete({ _id: id, userId });

    if (!readingListToDelete) {
        throw new ApiError(404, "Reading list not found");
    }

    res.status(200).json(new ApiResponse("Reading list deleted successfully", readingListToDelete));
});

const updateReadingList = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) {
        throw new ApiError(400, "Reading list name is required");
    }

    const updatedReadingList = await ReadingList.findOneAndUpdate(
        { _id: id, userId },
        { name, description },
        { new: true }
    );

    if (!updatedReadingList) {
        throw new ApiError(404, "Reading list not found");
    }

    res.status(200).json(new ApiResponse("Reading list updated successfully", updatedReadingList));
});

const toggleBlogInReadingList = asyncHandler(async (req, res) => {
    const { id } = req.params; // Reading List ID
    const { blogId } = req.body;
    const userId = req.user._id;

    if (!blogId) {
        throw new ApiError(400, "Blog ID is required");
    }

    const readingList = await ReadingList.findOne({ _id: id, userId });

    if (!readingList) {
        throw new ApiError(404, "Reading list not found or you do not have access");
    }

    const blogIndex = ReadingList.blog.findIndex(
        (b) => b.toString() === blogId
    );

    if (blogIndex === -1) {
        // Add blog to the list
        ReadingList.blog.push(blogId);
        await ReadingList.save();
        return res
            .status(200)
            .json(new ApiResponse(200, ReadingList, "Blog added to reading list"));
    } else {
        // Remove blog from the list
        ReadingList.blog.splice(blogIndex, 1);
        await ReadingList.save();
        return res
            .status(200)
            .json(new ApiResponse(200, ReadingList, "Blog removed from reading list"));
    }
});


export {
    createReadingList,
    getReadingLists,
    deleteReadingList,
    updateReadingList,
    toggleBlogInReadingList
};