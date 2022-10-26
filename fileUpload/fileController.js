const File = require("./fileModel");
const appError = require("../Utility/appError");
const { uploadeFiles, getFiles } = require("./fileValidation");

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

exports.getFiles = (req, res, next) => {
  console.log("Inside getFiles");
  getFiles(req, res)
    .then((query) =>
      File.find(query, {__v: 0})
        .then((ans) => {
          //console.log("Received data: ", ans);
          if(ans.length!=0){
            res
            .status(200)
            .json({
              success: true,
              message: "File's data received successfully!",
              totalFilesCount: ans.length,
              result: ans,
            });
          }else{
            res
            .status(400)
            .json({
              success: false,
              message: "No record found!",
              totalFilesCount: ans.length,
              result: ans,
            });
          }
          
        })
    )
    .catch((err) => next(new appError(err, 400)));
};
