import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

// Send message with file size validation
router.post("/send/:id", protectRoute, sendMessage);

// Delete a specific message
router.delete("/:messageId", protectRoute, deleteMessage);

export default router;
