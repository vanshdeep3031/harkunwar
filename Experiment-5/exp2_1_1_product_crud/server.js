// ============================================================
// EXPERIMENT 2.1.1 — Product CRUD Operations with Mongoose
// CONT_24CSP-293 :: FULL STACK-I
// ============================================================
// HOW TO RUN:
//   1. Start MongoDB:     mongod
//   2. Install packages:  npm install
//   3. Start server:      npm start
//   4. Open Postman and test at http://localhost:3000
// ============================================================

const express  = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");

const app  = express();
const PORT = 3000;

// ── MIDDLEWARE ──────────────────────────────────────────────
// express.json() parses incoming JSON request bodies into
// req.body. Without this, req.body is always undefined.
app.use(express.json());

// ── ASYNC STARTUP ───────────────────────────────────────────
// We wrap startup in async so we can await mongoose.connect().
// Server only starts AFTER the DB connection is confirmed.
const startServer = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/productDB");
    console.log("✅ MongoDB connected → productDB");

    // Mount all /api/products routes from the router file
    app.use("/api/products", productRoutes);

    // Root health-check route
    app.get("/", (req, res) => {
      res.json({
        experiment: "2.1.1 - Product CRUD",
        endpoints: {
          "POST   /api/products":      "Create a product",
          "GET    /api/products":      "Get all products",
          "GET    /api/products/:id":  "Get one product",
          "PUT    /api/products/:id":  "Update a product",
          "DELETE /api/products/:id":  "Delete a product"
        }
      });
    });

    // 404 for unknown routes
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    // Global error handler (4 params = error middleware in Express)
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: "Server error", error: err.message });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running → http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
