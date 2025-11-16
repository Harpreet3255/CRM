// server/src/routes/ai.js
import express from "express";
import { chatWithAI } from "../controllers/aiController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.post("/chat", chatWithAI);

export default router;
