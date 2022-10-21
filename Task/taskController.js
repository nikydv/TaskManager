const Task = require("./taskModel");
const appError = require("../Utility/appError");
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} = require("./taskValidation");

exports.home = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to Home Page", result: [] });
};

exports.createTask = async (req, res, next) => {
  createTask(req, res)
    .then((body) => {
      Task.create(req.body, {
        new: true,
        runValidators: true,
      }).then((newTask) => {
        res.status(200).send({
          success: true,
          message: "Created new task successfully",
          result: [newTask],
        });
      })
      .catch((err) => {
        next(new appError(err, 401))
       });
    })
    .catch((err) => {
    //console.log("Schema Level Error: ", err);
    next(new appError(err, 401))
   });
};

exports.updateTask = (req, res, next) => {
  updateTask(req, res)
    .then((val) => {
      Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).then((data) => {
          res.status(200).send({
            success: true,
            message: "Updated task successfully",
            result: [data],
          });
        });
    })
    .catch((err) => next(new appError(err, 401)));
};

exports.deleteTask = (req, res, next) => {
  deleteTask(req, res)
    .then(async (id) => {
      const doc = await Task.findByIdAndDelete(req.params.id);
      res.status(202).send({
        success: true,
        message: "Deleted task successfully",
        result: [],
      });
    })
    .catch((err) => next(new appError(err, 401)));
};

exports.getTasks = async (req, res, next) => {
  getTasks(req, res)
    .then((tasks) => {
      res.status(200).send({
        success: true,
        message: "Successfull response",
        totalTaskCount: tasks.length,
        result: tasks,
      });
    })
    .catch((err) => next(new appError(err, 404)));
};
