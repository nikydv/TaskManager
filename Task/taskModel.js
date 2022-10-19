const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = mongoose.Schema({
    date: {
        type: Date,        
        validate: [validator.isDate, 'pls provide date in yyyy/mm/dd format'],
        required: [true, 'Pls provide target date']
    },
    task: {
        type: String,
        required: [true, 'Pls provide task name']
    },
    status: {
        type: String,
        enum: ['Completed', 'Incomplete'],
        required: [true, 'Pls provide task status']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Task'
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;