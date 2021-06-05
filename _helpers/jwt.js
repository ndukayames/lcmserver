const expressJwt = require('express-jwt');
const config = require('config.json');
const studentService = require('../users/student.service');
const lecturerService = require('../lecturer/lecturer.service')

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/',
            '/student/authenticate',
            '/student/register',
            '/hrc',
            '/lecturer/create',
            '/lecturer/authenticate',
            // /\/student/i
            /\/assignment/i,
            /\/new-assignment/i,
            /\/submissions-uploads/i
            // /\/classes/i
            // /\/hrc/i
            // /\/lecturer/i
            // /\/rc/i
        ]
    });
}

async function isRevoked(req, payload, done) {

  try {

    const student = await studentService.getStudentById(payload.sub);

    done();
    
  } catch (error) {

    // return done(null, true);
  }
  try {

    const lecturer = await lecturerService.getLecturerById(payload.sub);


    done();
  } catch (error) {
    // return done(null, true);
    
  }
  return done(null, true);
};