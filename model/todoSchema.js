const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true, // The task description is mandatory
    trim: true,     // Remove extra whitespace
  },
  completed: {
    type: Boolean,
    default: false, // Default state for a new task is incomplete
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
  },
});

todoSchema.pre("save", function (next) {
  this.updatedAt = new Date(); // Automatically update the timestamp on save
  next();
});

module.exports = mongoose.model("Todo", todoSchema);
