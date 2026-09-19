require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { testConnection } = require("./src/config/db");
const { verifyEmailTransport } = require("./src/utils/email");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

const authRoutes = require("./src/routes/authRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");
const departmentRoutes = require("./src/routes/departmentRoutes");
const assetRoutes = require("./src/routes/assetRoutes");
const maintenanceRoutes = require("./src/routes/maintenanceRoutes");
const assetRequestRoutes = require("./src/routes/assetRequestRoutes");
const assetAssignmentRoutes = require("./src/routes/assetAssignmentRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");

const app = express();

// Trust Railway's reverse proxy
app.set("trust proxy", 1);

// Allowed frontend origins from Railway environment variable
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (for example, server-to-server requests)
      if (!origin) {
        return callback(null, true);
      }

      // Allow the deployed frontend
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject unknown origins
      return callback(null, false);
    },
    credentials: true
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ITAMS API is running"
  });
});

// Routes
app.use("/api", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/asset-requests", assetRequestRoutes);
app.use("/api/asset-assignments", assetAssignmentRoutes);
app.use("/api/inventory", inventoryRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

// Start server
(async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`🚀 ITAMS API listening on port ${PORT}`);
  });

  verifyEmailTransport();
})();