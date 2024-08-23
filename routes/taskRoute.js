const express = require('express');
const { createTask, getAllTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { auth } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/authorization');

const TaskRouter = express.Router();




TaskRouter.post('/createTask',auth,authorizeRoles('admin'),createTask)

TaskRouter.get('/getAllTasks',auth,authorizeRoles('admin'),  getAllTasks)

TaskRouter.patch('/updateTask/:id',auth, authorizeRoles('admin','user'), updateTask)

TaskRouter.delete('/deleteTask/:id',auth, authorizeRoles('admin'), deleteTask)


module.exports = { TaskRouter }