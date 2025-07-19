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

// Route to create a new reading list
router.post("/", verifyJWT, createReadingList);

// Route to get all reading lists for the authenticated user
router.get("/", verifyJWT, getReadingLists);

// Route to delete a specific reading list by ID
router.delete("/:id", verifyJWT, deleteReadingList);

// Route to update a specific reading list by ID
router.put("/:id", verifyJWT, updateReadingList);

// Route to toggle a blog in a reading list
router.post("/:id/toggleBlog", verifyJWT, toggleBlogInReadingList);


export default router;