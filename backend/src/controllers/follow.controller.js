import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Follow } from "../models/follow.model.js";

const toggleFollow = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
        throw new ApiError(400, "You cannot follow yourself");
    }

    const existingFollow = await Follow.findOne({
        followerId: currentUserId,
        followingId: userId
    });


    if (existingFollow) {
        await existingFollow.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Unfollowed successfully"));
    } else {
        await Follow.create({
            followerId: currentUserId,
            followingId: userId
        });
        return res.status(201).json(new ApiResponse(200, {}, "Followed successfully"));
    }
});

const getFollowers = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const followers = await Follow.find({ followingId: userId }).populate('followerId', 'username email');

    return res.status(200).json(new ApiResponse(200, { followers, count: followers.length }, "Followers retrieved successfully"));
});


const getFollowing = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const following = await Follow.find({ followerId: userId }).populate('followingId', 'username email');

    return res.status(200).json(new ApiResponse(200, { following }, "Following retrieved successfully"));
});


export {
    toggleFollow,
    getFollowers,
    getFollowing
}