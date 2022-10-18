const express = require('express');
const taskController = require('./taskController');
const loggedInValadation = require('../User/Validation/loggedInValidation');

const router = express.Router();

router.get('/', taskController.home)
  

router.post('/addTask', loggedInValadation.isLoggedIn, taskController.createTask)  

router.patch('/updateTask/:id', loggedInValadation.isLoggedIn, taskController.updateTask) 

router.delete('/delTask/:id', loggedInValadation.isLoggedIn, taskController.deleteTask) 

router.get('/getTasks', loggedInValadation.isLoggedIn, taskController.getTasks)

module.exports = router;  