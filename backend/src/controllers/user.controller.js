import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { resetPasswordConfirmationEmail, resetPasswordTokenSent, sendEmailChangeConfirmation, sendEmailChangeVerification, sendVerificationCode, sendWelcomeEmail } from "../utils/EmailSender.js"
import { oauth2Client } from "../utils/googleConfig.js"
import axios from "axios"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Mongoose } from "mongoose"

const isProd = process.env.NODE_ENV === "production";

const accessCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days (adjust as needed)
};

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something want wrong while generater the access and refresh Token")
    }
}

const userRegister = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body

    if ([username, fullName, email, password].some((field) => !field || field.trim() == '')) {
        throw new ApiError(400, "field are required")
    }

    const userExist = await User.findOne({ email })

    if (userExist) {
        throw new ApiError(400, "user is already exist this email")
    }

    const IsUserNameAvailable = await User.findOne({ username })

    if (IsUserNameAvailable) {
        throw new ApiError(400, "username is not available please choose another name")
    }

    const verificationToken = Math.floor(1000 + Math.random() * 9000)

    const user = await User.create({
        username,
        email,
        fullName,
        password,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        verificationTimeout: Date.now() + 24 * 60 * 60 * 1000
    })

    const loggedUser = await User.findById(user._id)

    if (!loggedUser) {
        throw new ApiError(500, "something want wrong while create account")
    }

    await sendVerificationCode(email, verificationToken)

    return res.status(200).json(new ApiResponse(200, { loggedUser }, "account has been created successfully"))
})

const verifyUser = asyncHandler(async (req, res) => {
    const { code } = req.body

    if (!code) {
        throw new ApiError(400, "please enter verfication code")
    }

    const user = await User.findOne({ verificationToken: code, verificationTokenExpiresAt: { $gt: Date.now() } })

    if (!user) {
        throw new ApiError(401, "verification code incorrect or expired")
    }

    await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                isVerified: true
            },
            $unset: {
                verificationToken: 1,
                verificationTokenExpiresAt: 1,
                verificationTimeout: 1
            }
        },
        {
            new: true
        }
    )

    await sendWelcomeEmail(user.email, user.username)

    res.status(200).json(new ApiResponse(200, {}, "user has been verified successfully"))
})

const resendVerificationToken = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(400, "user is not found")
    }

    const verificationToken = Math.floor(1000 + Math.random() * 9000)


    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });


    await sendVerificationCode(email, verificationToken)

    return res.status(200).json(new ApiResponse(200, {}, "verfication code sent to email"))
})

const userLogin = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if ((!username && !email) || !password) {
        throw new ApiError(400, "all field are required")
    }

    const findUser = await User.findOne({ $or: [{ username }, { email }] })

    if (!findUser) {
        throw new ApiError(404, "user is not found")
    }

    if (!findUser.isVerified) {
        throw new ApiError(401, "user is not verified yet")
    }

    const isPasswordValidate = await findUser.isPasswordCorrect(password)

    if (!isPasswordValidate) {
        throw new ApiError(401, "password is incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(findUser._id)

    const loggedUser = await User.findById(findUser._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedUser, accessToken, refreshToken },
                "user login successfully"
            )
        )
})

const userLogout = asyncHandler(async (req, resp) => {

    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    return resp
        .status(200)
        .clearCookie("accessToken", accessCookieOptions)
        .clearCookie("refreshToken", refreshCookieOptions)
        .json(new ApiResponse(200, {}, "user logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, resp) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "invalid refresh Token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh Token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return resp
            .status(200)
            .cookie("accessToken", accessToken, accessCookieOptions)
            .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "access token refreshed"));
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token");
    }
});


const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "User fetched successfully"));
});

const resetPasswordTokenGenerate = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(400, "user is not found")
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.RESETPASSWORD_TOKEN_SECRET, { expiresIn: process.env.RESETPASSWORD_TOKEN_EXPIRY })

    const resetPasswordLink = `${process.env.CLIENT_URL}/password-reset?id=${user._id}&token=${token}`

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiresAt = Date.now() + 60 * 60 * 1000;
    await user.save();


    await resetPasswordTokenSent(email, resetPasswordLink)

    return res.status(200).json(new ApiResponse(200, {}, "reset password link sent to email"))
})

const resetPassword = asyncHandler(async (req, res) => {
    const { token, password, confirmPassword } = req.body

    if (!token || !password || !confirmPassword) {
        throw new ApiError(400, "all field are required")
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } })

    if (!user) {
        throw new ApiError(401, "verification code incorrect or expired")
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    await resetPasswordConfirmationEmail(user.email, user.username)

    return res.status(200).json(new ApiResponse(200, {}, "password reset successfully"))

})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { username, fullName, bio } = req.body


    if (!fullName || !username || !bio) {
        throw new ApiError(400, "all field is required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                username,
                bio
            },
        },
        { new: true }
    ).select("-password");

    res
        .status(200)
        .json(new ApiResponse(200, { user }, "account details updated successfully"));
})

const updateUserProfilePic = asyncHandler(async (req, res) => {
    const profilePicLocalPath = req.file?.path;

    if (!profilePicLocalPath) {
        throw new ApiResponse(400, "profilePic file missing");
    }

    const profilePic = await uploadOnCloudinary(profilePicLocalPath);

    if (!profilePic.url) {
        throw new ApiResponse(400, "Error while uploading avatar file");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                profilePic: profilePic.url,
            },
        },
        {
            new: true,
        }
    ).select("-password");

    res
        .status(200)
        .json(new ApiResponse(200, { user }, "profile Pic is file uploaded successfully"));
});

const loginWithGoogle = asyncHandler(async (req, res) => {
    const code = req.query.code

    if (!code) {
        throw new ApiError(400, "Authorization code is required");
    }


    const googleRes = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(googleRes.tokens);


    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );


    const { email, name, picture } = userRes.data;

    let user = await User.findOne({ email });


    if (!user) {
        // Create user if doesn't exist
        user = await User.create({
            email,
            fullName: name,
            username: name,
            isVerified: true,
            profilePic: picture,
        });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(
            new ApiResponse(200, { user, accessToken, refreshToken }, "Logged in successfully with Google")
        );
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (
        [oldPassword, newPassword, confirmPassword].some((field) => field === "")
    ) {
        throw new ApiError(403, "all field are required");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(403, "password and confirmPasswrod should be same");
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(401, "unauthorized, request");
    }

    const isPasswordValidate = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValidate) {
        throw new ApiError(403, "old password incorrect");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password has been changed"));
});

const emailChangeVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(401, "unauthorized request");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(400, "this email is already registered");
    }

    let emailUpdate;

    if (email && email !== user.email) emailUpdate = email;

    const verificationToken = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const updateUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                isVerified: false,
                email: emailUpdate,
                verificationToken,
                verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
            },
        },
        {
            new: true,
        }
    ).select("-password -refreshToken");

    await sendEmailChangeVerification(updateUser.email, verificationToken);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { updateUser },
                "verfication Code send to your email check your inbox"
            )
        );
});

const emailChangeConfirmation = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (code.trim() === "") {
        throw new ApiError(400, "please enter verification code");
    }

    const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "Inavlid or Expired Code");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    await sendEmailChangeConfirmation(user.email, user.fullName);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "your email has been changed successfully"));
});

const getBloggerProfile = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username) {
        throw new ApiError(400, "username is required")
    }

    const user = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followingId",
                as: "followers"
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followerId",
                as: "following"
            }
        },
        {
            $addFields: {
                followersCount: {
                    $size: "$followers"
                },
                followingCount: {
                    $size: "$following"
                },
                isFollowing: {
                    $cond: {
                        if: { $in: [req.user?._id, "$followers.followerId"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                email: 1,
                bio: 1,
                followersCount: 1,
                followingCount: 1,
                isFollowing: 1,
                profilePic: 1,
                createdAt: 1
            }
        }
    ])

    if (!user?.length) {
        throw new ApiError(400, "user does not exist")
    }

    return res.status(200).json(new ApiResponse(200, user[0], "user fetched succesfully"))
})

const getReadingHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new Mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "blogs",
                localField: "readingHistory",
                foreignField: "_id",
                as: "readingHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "author",
                            foreignField: "_id",
                            as: "author",
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
                        $addFields: {
                            author: {
                                $first: "$author"
                            }
                        }
                    }
                ],
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].readingHistory,
                "reading history fetched successfully"
            )
        )
})

export {
    userRegister,
    userLogin,
    userLogout,
    verifyUser,
    resendVerificationToken,
    resetPassword,
    resetPasswordTokenGenerate,
    updateAccountDetails,
    updateUserProfilePic,
    refreshAccessToken,
    loginWithGoogle,
    changeCurrentPassword,
    emailChangeConfirmation,
    getCurrentUser,
    emailChangeVerification,
    getBloggerProfile,
    getReadingHistory,
}