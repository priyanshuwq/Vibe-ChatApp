import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import { clearChat } from "../controllers/message.controller.js";

const router = express.Router();

// Clear chat between logged-in user & selected user
router.delete("/clear/:receiverId", protectRoute, clearChat);

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
