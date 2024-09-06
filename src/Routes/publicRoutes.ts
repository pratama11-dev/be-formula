import { Router } from 'express';
import { createUser, LoginUser, refreshToken } from '../Controllers/Login';

const router = Router();

// user
router.post('/v1/login', LoginUser);
router.post('/v1/refresh-token', refreshToken);
router.post("/users/create-user", createUser)

export default router;