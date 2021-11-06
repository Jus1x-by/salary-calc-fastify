const fastify = require('fastify')({
  logger: true
})
const fastifyEnv = require('fastify-env')
const fastifyJwt = require('fastify-jwt', {
  secret: process.env.JWT_SECRET_KEY
})
// Add swagger docs
fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: { title: 'fastify-api' },
  },
})
const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    },
    JWT_SECRET_KEY: {
      type: 'string',
      default: 'qweasdzxc123asd'
    }
  }
}
// Add reading env FILE
fastify.register(fastifyEnv, {
  schema: schema,
  dotenv: true,
  data: process.env
})

// Add routes
fastify.register(require('./src/routes/auth'), { prefix: '/api/v1' })
fastify.register(require('./src/routes/employee'), { prefix: '/api/v1' })

// Entry point function
const start = async () => {
  try {
    await fastify.ready()
    await fastify.listen(process.env.PORT)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start();

