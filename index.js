const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
require("./Config/database");
const express = require("express");
const cookieParser = require("cookie-parser");
const taskRoutes = require("./Task/taskRoutes");
const userRoutes = require("./User/userRoutes");
const fileRoutes = require('./fileUpload/fileRoutes');
const errController = require("./Utility/errController");
const appError = require("./Utility/appError");
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }
}));

app.use("/", taskRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/user", userRoutes);
app.use("/api/files", fileRoutes)
app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Global Error handling middleware:
app.use(errController);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server running at port: ${port}`));



// upload and load delete
// filter based on fileType