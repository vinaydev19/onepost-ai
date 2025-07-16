import { Router } from 'express';
import {
    createBlog,
    getAllBlog,
    getOneBlog,
    getAllBlogByAuthor,
    updateBlog,
    deleteBlog,
    getMyBlogs,
    updateBlogStatus,
    searchBlogs
} from "../controllers/blog.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Create a new blog
router.post('/create-blog', verifyJWT, upload.fields([
    { name: "featuredImage" },
    { name: "files", maxCount: 10 }
]), createBlog);

// Get all blogs
router.get('/get-blogs', getAllBlog);

// Get a single blog by ID
router.get('/get-blog/:slug', getOneBlog);

// Update a blog by ID
router.put('/update-blog/:id', verifyJWT, upload.fields([
    { name: "featuredImage" },
    { name: "files", maxCount: 10 }
]), updateBlog);

// Delete a blog by ID
router.delete('/delete-blog/:id', verifyJWT, deleteBlog);

// Optionally use these if needed
router.get('/author-blogs/:username', getAllBlogByAuthor);
router.get('/my-blogs', verifyJWT, getMyBlogs);
router.patch('/update-blog-status/:id', verifyJWT, updateBlogStatus);

// Search blogs
router.get('/search', verifyJWT, searchBlogs);

export default router;
