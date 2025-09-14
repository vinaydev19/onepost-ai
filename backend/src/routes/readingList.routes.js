import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createReadingList,
    getReadingLists,
    deleteReadingList,
    updateReadingList,
    toggleBlogInReadingList
} from "../controllers/readingList.controller.js";

const router = Router();

router.post("/create-readinglist", verifyJWT, createReadingList);
router.get("/get-readinglist", verifyJWT, getReadingLists);
router.delete("delete-readinglist/:id", verifyJWT, deleteReadingList);
router.put("/:id", verifyJWT, updateReadingList);
router.post("/:id/toggleBlog", verifyJWT, toggleBlogInReadingList);


export default router;