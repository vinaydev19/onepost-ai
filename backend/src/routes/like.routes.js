import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleBlogLike, toggleCommentLike } from "../controllers/like.controller.js";

const router = Router();

router.post("/toggle-blog-like/:slug", verifyJWT, toggleBlogLike);
router.post("/toggle-comment-like/:commentId", verifyJWT, toggleCommentLike);

export default router;