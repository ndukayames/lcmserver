require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/student', require('./users/student.controller'));
// app.use('/hrc', require('./hoc_registered_courses/hrc.controller'));
app.use('/rc', require('./registered_courses/registered_courses.controller'));
app.use('/lecturer', require('./lecturer/lecturer.controller'));
app.use('/classes', require('./classes/classes.controller'))
app.use('/assignment', require('./assignments/assignments.controller'))

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4200;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
