// routes/user.route.js

import { Router } from "express";
import { getAllUsers } from "../controller/user.controller.js";
import { checkToken, checkRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get('/users', checkToken, checkRole(['admin']), getAllUsers);

export default router;