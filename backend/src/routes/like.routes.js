import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getBlogLikes, toggleBlogLike, toggleCommentLike, getCommentLikes } from "../controllers/like.controller.js";

const router = Router();

// Route to toggle like on a blog
router.post("/toggle-blog-like/:slug", verifyJWT, toggleBlogLike);
// Route to toggle like on a comment
router.post("/toggle-comment-like/:commentId", verifyJWT, toggleCommentLike);
// Route to get likes on a blog
router.get("/get-blog-likes/:slug", getBlogLikes);
// Route to get likes on a comment
router.get("/get-comment-likes/:commentId", getCommentLikes);
// Export the router


export default router;