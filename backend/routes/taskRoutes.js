const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// 🟢 GET all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔵 POST (Create a new task)
router.post("/", async (req, res) => {
    const { title, priority } = req.body;
    try {
        const newTask = new Task({ title, priority });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Move this ABOVE `/:id`
router.delete("/clear", async (req, res) => {
    try {
        await Task.deleteMany({});
        res.status(200).json({ message: "All tasks cleared." });
    } catch (err) {
        console.error("Error clearing tasks:", err);
        res.status(500).json({ message: "Failed to clear tasks", error: err.message });
    }
});

// 🟡 PUT (Update a task)
router.put("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 🔴 DELETE (Remove a task by ID)
router.delete("/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
