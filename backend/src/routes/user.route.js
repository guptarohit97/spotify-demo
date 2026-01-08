import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { createSong } from "../controller/admin.controller.js";


const router=Router()

router.get("/like",protectRoute,createSong)
// router.post("/",addUser)

export default router