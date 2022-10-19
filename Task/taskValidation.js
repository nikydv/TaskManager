const Task = require('./taskModel');

exports.updateTask = (req, res) => {
    return new Promise(async (resolve, reject)=> {
        const tasks = await Task.find({ createdBy: req.user._id }, { _id: 1 });        
        let tasksArr = tasks.map((x)=>x._id.toString());
        if(tasksArr.includes(req.params.id)){
            const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
                });
            const data = await Task.findById(req.params.id);
            res.status(200).send({
                status: 'success', 
                data 
                });            
            return resolve('Task updated Successfully');    
        }else{
            return reject('Not authorised to updatte this task!');
        } 
    })
}

exports.deleteTask = (req, res) => {
    return new Promise(async (resolve, reject)=> {
        const tasks = await Task.find({ createdBy: req.user._id }, { _id: 1 });        
        let tasksArr = tasks.map((x)=>x._id.toString());
        
        if (tasksArr.includes(req.params.id)){
            //return next(new appError(`No document found with that ID: ${req.params.id}`, 404));  
            const doc = await Task.findByIdAndDelete(req.params.id);
            res.status(202).send({
                status: 'success',
                data: null
                });
            return resolve('Task deleted successfully');     
        }else{
            return reject('Not authorised to delete this task!');
        }    
    })
}