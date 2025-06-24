import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "my-super-secret-jwt-key-change-in-production";

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader;

    if (!token) {
      return res.status(401).json({
        status: 0,
        error: "Access token is required",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: 0,
        error: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    return res.status(401).json({
      status: 0,
      error: "Invalid token",
    });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );
};
//
export { authenticateToken, generateToken };
