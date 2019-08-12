const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const managerRoutes = require('./routes/ManagerRoute');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mbtest', {
        useNewUrlParser: true
    })
    .then(() => console.log('connected to db'))
    .catch(() => console.log('db connection error'));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        res.status(200).json({});
    }
    next();
});

app.use('/managers', managerRoutes);

app.use((req, res, next) => {
    const error = new Error('page not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;