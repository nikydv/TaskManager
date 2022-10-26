const express = require('express');
const fileController = require('./fileController');

const router = express.Router();

router.post('/uploadFiles', fileController.uploadeFiles)
router.get('/getFiles', fileController.getFiles)

module.exports = router;  