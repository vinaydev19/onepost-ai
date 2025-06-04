import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {createComment, deleteComment, getAllComments, updateComment} from "../controllers/comment.controller";


const router = Router();

// Route to get all comments for a blog
router.get("/get-comments/:blogId", getAllComments);
// Route to create a new comment
router.post("/create-comment/:blogId", verifyJWT, createComment);
// Route to update a comment by ID
router.put("/update-comment/:commentId", verifyJWT, updateComment);
// Route to delete a comment by ID
router.delete("/delete-comment/:commentId", verifyJWT, deleteComment);

export default router;