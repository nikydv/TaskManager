const Task = require("./taskModel");

exports.createTask = (req, res) => {
  return new Promise((resolve, reject) => {
    req.body.createdBy = req.user._id;
    resolve(req.body);
  });
};

exports.updateTask = (req, res) => {
  return new Promise((resolve, reject) => {
    Task.find({ createdBy: req.user._id }, { _id: 1 })
      .then((tasks) => {
        let tasksArr = tasks.map((x) => x._id.toString());
        if (tasksArr.includes(req.params.id)) {
          resolve(req.params.id, req.body);
        } else {
          reject("Not authorised to updatte this task!");
        }
      })
      .catch((err) => reject(err));
  });
};

exports.deleteTask = (req, res) => {
  return new Promise((resolve, reject) => {
    let tasks;
    Task.find({ createdBy: req.user._id }, { _id: 1 })
      .then((tasks) => {
        let tasksArr = tasks.map((x) => x._id.toString());
        if (tasksArr.includes(req.params.id)) {
          resolve(req.params.id);
        } else {
          reject("Not authorised to delete this task!");
        }
      })
      .catch((err) => reject(err));
  });
};

exports.getTasks = (req, res) => {
  return new Promise((resolve, reject) => {
    Task.find({ createdBy: req.user._id }, { createdBy: 0, __v: 0 })
      .then((tasks) => resolve(tasks))
      .catch((err) => reject(err));
  });
};
