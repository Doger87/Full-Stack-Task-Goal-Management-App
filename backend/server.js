 
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Allow frontend-backend communication

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Default route
app.get("/", (req, res) => {
    res.send("✅ Task Manager API is running!");
});

app.use("/api/tasks", require("./routes/taskRoutes"));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});