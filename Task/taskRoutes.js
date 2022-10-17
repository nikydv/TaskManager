const express = require('express');
const taskController = require('./taskController');
const userController = require('../User/userController');

const router = express.Router();

router.get('/', taskController.home)
  

router.post('/addTask', userController.isLoggedIn, taskController.createTask)  

router.patch('/updateTask/:id', userController.isLoggedIn, taskController.updateTask) 

router.delete('/delTask/:id', userController.isLoggedIn, taskController.deleteTask) 

router.get('/getTasks', userController.isLoggedIn, taskController.getTasks)

module.exports = router;  