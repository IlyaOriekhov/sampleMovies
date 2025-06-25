import express from "express";
import userRoutes from "./users.js";
import sessionRoutes from "./sessions.js";
import movieRoutes from "./movies.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/sessions", sessionRoutes);
router.use("/movies", movieRoutes);

export default router;
