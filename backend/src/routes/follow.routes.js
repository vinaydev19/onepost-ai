import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    toggleFollow,
    getFollowers,
    getFollowing
} from '../controllers/follow.controller.js';

const router = Router();

router.post('/toggle-follow/:userId', verifyJWT, toggleFollow);
router.get('/followers/:userId', verifyJWT, getFollowers);
router.get('/following/:userId', verifyJWT, getFollowing);

export default router;