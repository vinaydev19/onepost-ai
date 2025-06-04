import { Router } from 'express';
import { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../controllers/blog.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Route to get all blogs
router.get('/get-blogs', getAllBlogs);
// Route to get a blog by ID
router.get('get-blog/:id', getBlogById);
// Route to create a new blog
router.post('/create-blog', verifyJWT, upload.fields([
    {
        name: "featuredImage"  // Assuming you want to upload an image for the blog
    },
    {
        name: "files",
        maxCount: 10
    }
]), createBlog);
// Route to update a blog by ID
router.put('/update-blog/:id', verifyJWT, upload.fields([
    {
        name: "featuredImage"  // Assuming you want to upload an image for the blog
    },
    {
        name: "files",
        maxCount: 10
    }
]), updateBlog);
// Route to delete a blog by ID
router.delete('/delete-blog/:id', verifyJWT, deleteBlog);



// Export the router
export default router;