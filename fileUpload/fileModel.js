const mongoose = require('mongoose');
const validator = require('validator');

const fileSchema = mongoose.Schema({
    fileName: {
        type: String,        
        required: [true, 'Pls provide fileName']
    },
    type: {
        type: String,
        required: [true, 'Pls provide file type']
    },
    size: {
        type: Number,
        required: [true, 'Pls provide file size in bytes']
    }
}, { versionKey: false });

const filesUpload = mongoose.model('FilesUpload', fileSchema);

module.exports = filesUpload;