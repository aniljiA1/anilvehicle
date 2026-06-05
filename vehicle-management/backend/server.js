const express = require("express");
const cors = require("cors");
require("dotenv").config();

const vehicleRoutes = require("./routes/vehicles");
const initDB = require("./config/initDB");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://anilvehicle.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "🚗 Vehicle Management API is running!",
    version: "1.0.0",
    database: "SQLite (no installation required)",
    endpoints: {
      "GET /api/vehicles": "List all vehicles",
      "GET /api/vehicles/:id": "Get single vehicle",
      "POST /api/vehicles": "Add new vehicle",
      "PUT /api/vehicles/:id": "Update vehicle",
      "DELETE /api/vehicles/:id": "Delete vehicle",
    },
  });
});

app.use("/api/vehicles", vehicleRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
});

// Initialize DB then start server
initDB();

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 API: http://localhost:${PORT}/api/vehicles`);
  console.log(`\nEndpoints:`);
  console.log(`  GET    http://localhost:${PORT}/api/vehicles`);
  console.log(`  GET    http://localhost:${PORT}/api/vehicles/:id`);
  console.log(`  POST   http://localhost:${PORT}/api/vehicles`);
  console.log(`  PUT    http://localhost:${PORT}/api/vehicles/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/vehicles/:id`);
});
