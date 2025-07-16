import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    toggleFollow,
    getFollowers,
    getFollowing
} from '../controllers/follow.controller.js';

const router = Router();

// Toggle follow/unfollow
router.post('/toggle-follow/:userId', verifyJWT, toggleFollow);

// Get followers of a user
router.get('/followers/:userId', verifyJWT, getFollowers);

// Get users that the current user is following
router.get('/following/:userId', verifyJWT, getFollowing);

export default router;