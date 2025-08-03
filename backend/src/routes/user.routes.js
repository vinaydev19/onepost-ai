import { Router } from "express";
import {
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
    getReadingHistory,
    getBloggerProfile
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public Auth Routes
router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/verify', verifyUser);
router.post('/resend-verification', resendVerificationToken);
router.post('/password/reset-token', resetPasswordTokenGenerate);
router.post('/password/reset', resetPassword);

// Authenticated User Routes
router.post('/logout', verifyJWT, userLogout);
router.post('/refresh-token', verifyJWT, refreshAccessToken);
router.post('/google-login', verifyJWT, loginWithGoogle);

// User Profile & Account Routes
router.get('/me', verifyJWT, getCurrentUser);
router.put('/account', verifyJWT, updateAccountDetails);
router.put('/profile-picture', verifyJWT, upload.single('profilePic'), updateUserProfilePic);
router.put('/password/change', verifyJWT, changeCurrentPassword);
router.put('/email/change', verifyJWT, emailChangeVerification);
router.post('/email/confirm', verifyJWT, emailChangeConfirmation);

router.route("/profile/:username").get(verifyJWT, getBloggerProfile)
router.route("/history").get(verifyJWT, getReadingHistory)

export default router;
