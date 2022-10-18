require('./Config/database');
const express = require('express');
const cookieParser = require('cookie-parser');
const taskRoutes = require('./Task/taskRoutes');
const userRoutes = require('./User/userRoutes');
const errController = require('./Utility/errController');
const appError = require('./Utility/appError');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use('/', taskRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/user', userRoutes);
app.all('*', (req, res, next)=>{
    next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});


//Global Error handling middleware:
app.use(errController);

const port = process.env.PORT || 8000;

app.listen(port, ()=> console.log(`server running at port: ${port}`));