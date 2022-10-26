const { resolve } = require("path");
const path = require("path");

exports.uploadeFiles = (req, res) => {
  return new Promise((resolve, reject) => {
    console.log("Inside uploadFiles Validation");
    if (!req.files || Object.keys(req.files).length === 0) {
      reject("No file uploaded");
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    files = Object.values(req.files);
    console.log("Received file: ", typeof files, files);

    
    arr = []
    // files.map((file) => 
    for(let i=0; i<files.length; i++)
    {
      const savePath = __dirname + "/uploads/" + files[i].name;
      //console.log('Current object: ', files[i]);
      files[i].mv(savePath, (err) => {
        if (err) reject(err);
      });
      arr.push({
        fileName: files[i].name,
        type: files[i].mimetype,
        size: files[i].size
      });
    };

    //console.log('In Validator: ', arr)
    resolve(arr);
    
  });
};


exports.getFiles = (req, res)=> {
    return new Promise((resolve, reject)=> {
        console.log('Query String: ', req.query);
        const { id, size } = req.query;
        if(id && size){
          console.log('If we have both size and id');
          resolve({_id: id, size: size});
        }else if(id){
          resolve({_id: id});
        }else if(size){
            resolve({size: size});
        }else{
            resolve({});
        }
    })
}
