const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = mongoose.Schema({
    date: 
    {
        type: Date,        
        validate: [validator.isDate, 'pls provide date in yyyy/mm/dd format'],
        required: [true, 'Pls provide target date']
    },
    task:
    {
        type: String,
        required: [true, 'Pls provide task name']
    },
    status:
    {
        type: String,
        default: 'Incompleted',
        enum: ['Completed', 'Incompleted']
    },
    createdBy:
    {
        type: mongoose.Schema.ObjectId,
        ref: 'Task'
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;