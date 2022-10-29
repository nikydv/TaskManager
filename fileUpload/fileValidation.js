const path = require("path");
const mongoose = require("mongoose");
const fs = require("file-system");
const File = require("./fileModel");

exports.uploadeFiles = (req, res) => {
  return new Promise((resolve, reject) => {
    console.log("Inside uploadFiles Validation");
    //Check first file exist or not:
    if (!req.files || Object.keys(req.files).length === 0) {
      reject("No file uploaded");
    } else {
      // The name of the input field (i.e. "files") is used to retrieve the uploaded file
      files = Object.values(req.files);
      const supportedFiles = [
        ".jpeg",
        ".jpg",
        ".png",
        ".csv",
        ".txt",
        ".pdf",
        ".xls",
        ".xlsx",
        ".mp3",
        ".mp4",
      ];
      let arr = [];
      for (let i = 0; i < files.length; i++) {
        //console.log('extension: ', path.extname(files[i].name));
        if (supportedFiles.includes(path.extname(files[i].name))) {
          if (files[i].truncated) {
            reject("File size is more than 10MB!!");
          }
          const savePath = __dirname + "/uploads/" + files[i].name;
          files[i].mv(savePath, (err) => {
            if (err) reject(err);
          });
          arr.push({
            fileName: files[i].name,
            type: files[i].mimetype,
            size: files[i].size,
          });
        } else {
          reject(`unspported file, Accept only file types: ${supportedFiles}`);
        }
      }
      resolve(arr);
    }
  });
};

//Function to delete file if exists in folder uploads:
function checkAndDeleteFile(query) {
  return new Promise((resolve, reject) => {
    File.find(query, { __v: 0 }).then((filesData) => {
      if (filesData.length != 0) {
        let filePath = __dirname + "/uploads/";
        //console.log("Received file: ", filesData);
        for (let i = 0; i < filesData.length; i++) {
          console.log("File path: ", filePath + filesData[i].fileName);
          fs.unlink(filePath + filesData[i].fileName, function (err) {
            if (err && err.code == "ENOENT") {
              // file doens't exist
              console.log(
                `File: ${filesData[i].fileName} doesn't exist, won't remove it.`
              );
            } else if (err) {
              // other errors, e.g. maybe we don't have enough permission
              console.log(
                `Error occurred while trying to remove file: ${filesData[i].fileName}`
              );
            } else {
              console.log(
                `File: ${filesData[i].fileName} deleted successfully!!`
              );
            }
          });
          resolve(filesData);
        }
      } else {
        resolve([]);
      }
    });
  });
}

exports.getFiles = (req, res) => {
  return new Promise((resolve, reject) => {
    console.log("Query String: ", req.query);
    let { id, size, fileType } = req.query;
    //Check for valid id, size and fileType first:
    if (id && !mongoose.isValidObjectId(id)) {
      return reject("Invalid Object Id!!");
    }
    if (size && isNaN(size)) {
        return reject("Invalid size value, Pls provide correct one!!");
    }
    if (fileType) {
      var storedFileType = {
        audio: 'audio/mpeg',
        video: 'video/mp4',
        image: /^image/,
        pdf: 'application/pdf',
        text: 'text/plain',
        csv: 'text/csv',
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
      if(!storedFileType[fileType]){
        return reject("Requested file type is not available, pls choose either: audio/edio/image/pdf/text/csv!!");
      }
    }
    //Based on Availability of Id and/or size provide response:
    if (id && size) {
      checkAndDeleteFile({ _id: id, size: size })
        .then((filesData) => resolve(filesData))
        .catch((err) => reject(err));
    } else if (id) {
      checkAndDeleteFile({ _id: id })
        .then((filesData) => resolve(filesData))
        .catch((err) => reject(err));
    } else if (size) {
      checkAndDeleteFile({ size: size })
        .then((filesData) => resolve(filesData))
        .catch((err) => reject(err));
    } else if(fileType){
      checkAndDeleteFile({ type: storedFileType[fileType] })
        .then((filesData) => resolve(filesData))
        .catch((err) => reject(err));
    }else{
      checkAndDeleteFile({})
        .then((filesData) => resolve(filesData))
        .catch((err) => reject(err));
    }
  });
};
