import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getAllComments, updateComment } from "../controllers/comment.controller.js";


const router = Router();

// Route to get all comments for a blog
router.get("/get-comments/:slug", getAllComments);
// Route to create a new comment
router.post("/create-comment/:slug", verifyJWT, addComment);
// Route to update a comment by ID
router.put("/update-comment/:commentId", verifyJWT, updateComment);
// Route to delete a comment by ID
router.delete("/delete-comment/:commentId", verifyJWT, deleteComment);
 
export default router;