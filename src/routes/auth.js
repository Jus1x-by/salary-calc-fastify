const { default: fastify } = require('fastify');
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
    },
  }
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
    }
  },
}

function auth(fastify, options, done) {

  // Registration
  fastify.post('/registration', postRegistration, createUser)
  // Login
  fastify.post('/login', postLogin, loginUser)

  done()

}

module.exports = auth;