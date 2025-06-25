import express from "express";
import { User } from "../models/index.js";
import { generateToken } from "../middleware/auth.js";
import { validateBody } from "../middleware/validation.js";
import { userRegistrationSchema } from "../validation/schemas.js";
import { conflict } from "../utils/error.js";

const router = express.Router();

router.post(
  "/",
  validateBody(userRegistrationSchema),
  async (req, res, next) => {
    try {
      const { email, name, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return next(conflict("User with this email already exists"));
      }

      const user = await User.create({ email, name, password });

      const token = generateToken(user);

      res.status(200).json({
        token,
        status: 1,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      next(error);
    }
  }
);

export default router;
