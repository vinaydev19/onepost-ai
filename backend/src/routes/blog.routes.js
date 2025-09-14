import { Router } from 'express';
import {
    createBlog,
    getAllBlog,
    getOneBlog,
    getAllBlogByAuthor,
    updateBlog,
    deleteBlog,
    updateBlogStatus,
} from "../controllers/blog.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { optionalVerifyJWT } from '../middlewares/optionalVerifyJWT.middleware.js';

const router = Router();

router.post('/create-blog', verifyJWT, upload.fields([
    { name: "featuredImage" },
    { name: "files", maxCount: 10 }
]), createBlog);

router.get('/get-blogs', optionalVerifyJWT, getAllBlog);

router.get('/get-blog/:slug', optionalVerifyJWT, getOneBlog);

router.put('/update-blog/:id', verifyJWT, upload.fields([
    { name: "featuredImage" },
    { name: "files", maxCount: 10 }
]), updateBlog);

router.delete('/delete-blog/:id', verifyJWT, deleteBlog);

router.get('/author-blogs/:username', getAllBlogByAuthor);
router.patch('/update-blog-status/:id', verifyJWT, updateBlogStatus);


export default router;
