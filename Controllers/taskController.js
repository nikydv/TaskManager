const Task = require('../Models/taskModel');
const appError = require('../Utility/appError');


exports.home = (req, res) => {
    res.status(200).send(`<h1>Welcome to home page!</h1>`);
}


exports.createTask = async(req, res, next) => {
    try 
    {
        req.body.createdBy = req.user._id;
        //console.log('Data in Body: ', req.body);
        
        const newTask = await Task.create(req.body);
        res.status(200).send({
            status: 'success', 
            newTask
            });

    } catch (error) 
    {
        console.log("Error in createTask: ", error);
        next(new appError('Error in createTask!', 404));
    }
}


exports.updateTask = async(req, res, next) => {
    try 
    {
        //console.log('Update data: ', req.body);
       
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
          });

        if(updatedTask)
        {
            const data = await Task.findById(req.params.id);

            res.status(200).send({
                status: 'success', 
                data 
                });
        }
        

    } catch (error) 
    {
        console.log("Error in updating Task: ", error);
        next(new appError('Error in updating Task!', 404));
    }
}

exports.deleteTask = async(req, res, next) => {
    try 
    {
        const doc = await Task.findByIdAndDelete(req.params.id);

        if (!doc) {
          return next(new appError(`No document found with that ID: ${req.params.id}`, 404));
        }

        res.status(202).send({
        status: 'success',
        data: null
        });

    } catch (error) 
    {
        console.log('Error while deleting task: ', error);
        return next(new appError('Getting error while deleting task: ', 404));
    }
}


exports.getTasks = async (req, res, next) => {
    try 
    {
        const tasks = await Task.find({ createdBy: req.user._id }, { createdBy: 0 });
        res.status(200).send({
            status: 'success', 
            total: tasks.length,
            tasks
            });
    } catch (error) 
    {
        console.log(error);
        next(new appError('error getting all tasks!', 404));
    }
}

