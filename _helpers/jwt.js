const expressJwt = require('express-jwt');
const config = require('config.json');
const studentService = require('../users/student.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/student/register',
            '/student/authenticate',
            '/hrc'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await studentService.getStudentById(payload.sub);
    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }
    done();
};