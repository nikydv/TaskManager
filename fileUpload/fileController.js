const File = require("./fileModel");
const appError = require("../Utility/appError");
const { uploadeFiles, getFiles } = require("./fileValidation");

//Function to upload files:
exports.uploadeFiles = (req, res, next) => {
  uploadeFiles(req, res)
    .then((data) => {
      File.insertMany(data)
        .then((ans) => {
          res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            result: ans,
          });
        })
    })
    .catch((err) =>  next(new appError(err, 400)));
};

//Function to return all required file's data:
exports.getFiles = (req, res, next) => {
  console.log("Inside getFiles");
  getFiles(req, res)
    .then((filesData) =>{
          if(filesData.length!=0){
            res
            .status(200)
            .json({
              success: true,
              message: "File's data received successfully!",
              totalFilesCount: filesData.length,
              result: filesData,
            })
          }else{
            res
            .status(400)
            .json({
              success: false,
              message: "No record found!",
              totalFilesCount: filesData.length,
              result: filesData,
            });
          }
      })
    .catch((err) => {console.log('error cast: ', err); next(new appError(err, 400))});
};
