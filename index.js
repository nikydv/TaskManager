require('./database');
const express = require('express');
const cookieParser = require('cookie-parser');
const taskRoutes = require('./Routes/taskRoutes');
const userRoutes = require('./Routes/userRoutes');
const errController = require('./Controllers/errController');
const appError = require('./Utility/appError');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    //req.requestTime = new Date().toISOString();
    console.log('Cookies: ', req.cookies);
    next();
});

app.use('/', taskRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/user', userRoutes);
app.all('*', (req, res, next)=>{
    next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});


//Global Error handling middleware:
app.use(errController);

const port = 8000 || process.env.port;
app.listen(port, ()=> console.log(`server running at port: ${port}`));