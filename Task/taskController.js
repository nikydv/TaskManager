const Task = require('./taskModel');
const appError = require('../Utility/appError');
const { updateTask, deleteTask } = require('./taskValidation');


exports.home = (req, res) => {
    res.status(200).send(`<h1>Welcome to home page!</h1>`);
}

exports.createTask = async(req, res, next) => {
    try{
        req.body.createdBy = req.user._id;        
        const newTask = await Task.create(req.body);
        res.status(200).send({ status: 'success', newTask });
    }catch(error){
        console.log("Error in createTask: ", error);
        next(new appError('Error in createTask!', 404));
    }
}

exports.updateTask = async(req, res, next) => {
    try{
        updateTask(req, res)
          .then((res)=>console.log(res), (err) => next(new appError(err, 401)))
    }catch(error){
        console.log("Error in updating Task: ", error);
        next(new appError('Error in updating Task!', 404));
    }
}

exports.deleteTask = (req, res, next)=>{
    try{
        deleteTask(req, res)
            .then((res)=>console.log(res), (err)=> next(new appError(err, 401)))   
    }catch(error){
        console.log('Error while deleting task: ', error);
        return next(new appError('Getting error while deleting task: ', 404));
    }
}

exports.getTasks = async (req, res, next) => {
    try{
        const tasks = await Task.find({ createdBy: req.user._id }, { createdBy: 0 });
        res.status(200).send({ status: 'success', total: tasks.length, tasks });
    }catch(error){
        console.log(error);
        next(new appError('error getting all tasks!', 404));
    }
}

