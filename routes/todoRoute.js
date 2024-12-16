const express = require("express");
const todoSchema = require("../model/todoSchema");
const router = express.Router();

// Get All Todos
router.get("/", async (req, res) => {
  try {
    const todos = await todoSchema.find({});
    res.status(200).json({
      isSuccessful: true,
      data: todos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({
      isSuccessful: false,
      err: error.message,
    });
  }
});

// Get Todo by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await todoSchema.findById(id);

    if (!todo) {
      return res.status(404).json({
        isSuccessful: false,
        err: "Todo not found",
      });
    }

    res.status(200).json({
      isSuccessful: true,
      data: todo,
    });
  } catch (error) {
    console.error("Error fetching todo by ID:", error);
    res.status(500).json({
      isSuccessful: false,
      err: error.message,
    });
  }
});

// Create a New Todo
router.post("/", async (req, res) => {
  try {
    const { input } = req.body;

    // Validate input
    if (!input) {
      return res.status(400).json({
        isSuccessful: false,
        err: "The 'input' field is required",
      });
    }

    const newTodo = new todoSchema({ input });
    await newTodo.save();

    res.status(201).json({
      isSuccessful: true,
      message: "Todo created successfully",
      data: newTodo,
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({
      isSuccessful: false,
      err: error.message,
    });
  }
});

// Update Todo by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { input } = req.body;

    // Validate input field
    if (!input) {
      return res.status(400).json({
        isSuccessful: false,
        err: "The 'input' field is required for update",
      });
    }

    const updatedTodo = await todoSchema.findByIdAndUpdate(id, { input }, { new: true });

    if (!updatedTodo) {
      return res.status(404).json({
        isSuccessful: false,
        err: "Todo not found",
      });
    }

    res.status(200).json({
      isSuccessful: true,
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({
      isSuccessful: false,
      err: error.message,
    });
  }
});

// Delete Todo by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await todoSchema.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({
        isSuccessful: false,
        err: "Todo not found",
      });
    }

    res.status(200).json({
      isSuccessful: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({
      isSuccessful: false,
      err: error.message,
    });
  }
});

module.exports = router;
