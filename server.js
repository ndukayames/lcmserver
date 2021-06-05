require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
var bodyParser = require('body-parser')




app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.json());

app.use(cors({
  origin: '*'
}));


// use JWT auth to secure the api
app.use(jwt());

// api routes
console.log(1)
app.use('/student', require('./users/student.controller'));
// app.use('/hrc', require('./hoc_registered_courses/hrc.controller'));
app.use('/rc', require('./registered_courses/registered_courses.controller'));
app.use('/lecturer', require('./lecturer/lecturer.controller'));
app.use('/classes', require('./classes/classes.controller'));
app.use('/assignment', require('./assignments/assignments.controller'));
app.use('/new-assignment', express.static('new-assignment')); 
app.use('/submissions-uploads', express.static('submissions-uploads')); 
app.use('/test',require('./test-server/test.controller'))

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4200;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
