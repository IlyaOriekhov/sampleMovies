import express from "express";
import { User } from "../models/index.js";
import { generateToken } from "../middleware/auth.js";
import { validateBody } from "../middleware/validation.js";
import { userLoginSchema } from "../validation/schemas.js";
import { unauthorized } from "../utils/error.js";

const router = express.Router();

router.post("/", validateBody(userLoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(unauthorized("Invalid credentials"));
    }

    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return next(unauthorized("Invalid credentials"));
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      status: 1,
    });
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
});

export default router;
