const {
  createUser,
  loginUser,
} = require('../controllers/auth');

const User = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  }
}

const postRegistration = {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password', 'firstName', 'lastName'],
      properties: {
        ...User.properties,
        password: { type: 'string' },
      },
    },
    response: {
      201: User,
      400: {
        error: { type: 'string' },
      },
      500: {
        error: { type: 'string' },
      }
    },
  },
  handler: createUser,
}

const postLogin = {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      }
    }
  },
  response: {
    200: {
      ...User.properties,
      token: { type: 'string' }
    },
    404: {
      error: 'User not found',
    },
    500: {
      error: 'Server error'
    }
  },
  handler: loginUser
}

function auth(fastify, options, done) {

  // Registration
  fastify.post('/registration', postRegistration)
  // Login
  fastify.post('/login', postLogin)

  done()

}

module.exports = auth;