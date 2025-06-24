import "dotenv/config";
import express from "express";
import cors from "cors";
import { sequelize } from "sequelize";

import routes from "./routes/index.js";

const app = express();
const PORT = process.env.APP_PORT || 8050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1", routes);

// Err handl middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 0,
    error: "Internal Server Error",
  });
});

//404 handler

app.use("*", (req, res) => {
  res.status(404).json({
    status: 0,
    error: "Not found",
  });
});

//start server and database

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synced succesfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
