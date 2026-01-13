// routes/user.route.js

import { Router } from "express";
import { getAllUsers } from "../controller/user.controller.js";

const router = Router();

router.get('/users', getAllUsers);

export default router;