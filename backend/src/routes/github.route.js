import express from "express";
import { getContributions, getRawContributions } from "../controllers/github.controller.js";

const router = express.Router();

// GET /api/github/contributions/raw/:username - Returns raw GraphQL data for live graph
router.get("/contributions/raw/:username", getRawContributions);

// GET /api/github/contributions/:username - Returns computed stats
router.get("/contributions/:username", getContributions);

export default router;
