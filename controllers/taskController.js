const taskModel = require("../models/taskModel");

const createTask=async(req,res)=>{

  const { title, description, priority, status, assignedTo } = req.body;

  try {
    const task = new taskModel({
      title,
      description,
      priority,
      status,
      assignedTo,
      createdBy: req.user.userId
    });

    await task.save();
   return res.status(201).json(task);
  } catch (err) {
    console.log(err.message);
    return  res.status(500).send('Server error');
  }
};

// Get All Tasks (Admin only)
const getAllTasks=async (req, res) => {
  try {
    const tasks = await taskModel.find().populate('assignedTo', 'username');
    return res.json(tasks);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server error');
  }
};

// Update a Task (Only assigned user or admin)
const updateTask= async (req, res) => {
  try {
    let task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.assignedTo.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task = await taskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return  res.json(task);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server error');
  }
};

// Delete a Task (Admin only)
const deleteTask = async (req, res) => {
    try {
      const task = await taskModel.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      await taskModel.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Task removed' });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server error');
    }
  };
  

module.exports = {createTask,getAllTasks,updateTask,deleteTask};
