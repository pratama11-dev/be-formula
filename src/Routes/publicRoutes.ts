import { Router } from 'express';
import { getListUser } from '../Controllers/Users';

const router = Router();

// user
router.post("/users/list", getListUser)

export default router;