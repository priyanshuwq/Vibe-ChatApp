import express from "express";
import { getContributions } from "../controllers/github.controller.js";

const router = express.Router();

// GET /api/github/contributions/:username
router.get("/contributions/:username", getContributions);

export default router;
