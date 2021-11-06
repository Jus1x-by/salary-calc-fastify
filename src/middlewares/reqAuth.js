const jwtDecode = require('jwt-decode');

const requireAuth = (request, reply, done) => {
  if (!request.headers.authorization) { 
    done(new Error('Unauthorized'));
  }
  const authToken = request.headers.authorization.split(' ')[1];
  request.user = jwtDecode(authToken);
  done()
}

module.exports = {
  requireAuth
}