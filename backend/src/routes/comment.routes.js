import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getAllComments, updateComment } from "../controllers/comment.controller.js";
import { optionalVerifyJWT } from '../middlewares/optionalVerifyJWT.middleware.js';

const router = Router();

router.get("/get-comments/:slug", optionalVerifyJWT, getAllComments);
router.post("/create-comment/:slug", verifyJWT, addComment);
router.put("/update-comment/:commentId", verifyJWT, updateComment);
router.delete("/delete-comment/:commentId", verifyJWT, deleteComment);

export default router;