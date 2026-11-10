import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { questionController } from "../controller/questionController.js";


const router = Router()

router.post("/chat",authMiddleware,questionController)


export default router