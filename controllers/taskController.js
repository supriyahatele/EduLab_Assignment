const taskModel = require("../models/taskModel");
const mongoose = require('mongoose');
const createTask = async (req, res) => {
    const { title, description, priority, status, assignedTo } = req.body;
  
    // Validate that required fields are not empty, null, or undefined
    if (!title || !description || !priority || !status || !assignedTo) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
  
    // Trim values to remove unnecessary whitespace
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedPriority = priority.trim();
    const trimmedStatus = status.trim();
    const trimmedAssignedTo = assignedTo.trim();
  
    // Check if any trimmed field is empty
    if (
      !trimmedTitle ||
      !trimmedDescription ||
      !trimmedPriority ||
      !trimmedStatus ||
      !trimmedAssignedTo
    ) {
      return res
        .status(400)
        .json({ msg: 'Fields cannot be empty or contain only whitespace' });
    }
  
    try {
      const task = new taskModel({
        title: trimmedTitle,
        description: trimmedDescription,
        priority: trimmedPriority,
        status: trimmedStatus,
        assignedTo: trimmedAssignedTo,
        createdBy: req.user.userId
      });
  
      await task.save();
      return res.status(201).json(task);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server error');
    }
  };
  

// Get All Tasks (Admin only)


const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;

    const filter = {};
    if (status) filter.status = status.trim();
    if (priority) filter.priority = priority.trim();
    

    // Find tasks with pagination and filtering, populate 'assignedTo' field with 'username' only, excluding '_id'
    const tasks = await taskModel
      .find(filter)
      .populate('assignedTo', 'username -_id') 
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Check if no tasks are found
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ msg: 'No tasks found' });
    }

    const totalTasks = await taskModel.countDocuments(filter);

    return res.json({
      tasks,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

  

// Update a Task (Only assigned user or admin)
const updateTask = async (req, res) => {
    try {
      const { title, description, priority, status, assignedTo } = req.body;
  
      // Check if any update fields are provided and valid
      if (
        (title && !title.trim()) ||
        (description && !description.trim()) ||
        (priority && !priority.trim()) ||
        (status && !status.trim()) ||
        (assignedTo && !assignedTo.trim())
      ) {
        return res.status(400).json({ message: 'Fields cannot be empty or contain only whitespace' });
      }
  
      // Find the task by ID
      let task = await taskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Authorization check: Only the user assigned to the task or an admin can update it
      if (task.assignedTo.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
  
      // Update the task with validated fields
      task = await taskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      return res.json(task);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  };
  
// Delete a Task (Admin only)
const deleteTask = async (req, res) => {
  try {
    // Find the task by ID
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete the task
    await taskModel.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Task removed' });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server error');
  }
};

  

module.exports = {createTask,getAllTasks,updateTask,deleteTask};
