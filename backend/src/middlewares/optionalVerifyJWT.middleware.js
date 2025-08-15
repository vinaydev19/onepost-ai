import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const optionalVerifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "").replace("bearer ", "");

        if (!token) {
            // No token → guest user
            return next();
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id)
            .select("-password -refreshToken");

        if (user) {
            req.user = user;
        }

    } catch (error) {
        console.warn("Optional JWT check failed:", error.message);
    }

    next();
});

export { optionalVerifyJWT };
