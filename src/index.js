import "dotenv/config";
import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.APP_PORT || 8050;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: 1,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/v1", routes);

// Error handling
app.use((err, req, res, next) => {
  // Handle http-errors
  if (err.status && err.expose) {
    return res.status(err.status).json({
      status: err.details?.status || 0,
      error: err.message,
      ...(err.details && { details: err.details.details }),
    });
  }

  // Handle Sequelize
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      status: 0,
      error: "Validation error",
      details: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Handle other errors
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    status: 0,
    error: "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 0,
    error: "Not found",
    path: req.originalUrl,
  });
});

// Start server and database
const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synced successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API base URL: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
