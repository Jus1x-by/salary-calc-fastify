const fastify = require('fastify')({
  logger: true
})

// Add swagger docs
fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: { title: 'fastify-api' },
  },
})
// Add routes
fastify.register(require('./src/routes/auth'), { prefix: '/api/v1' })

// Entry point function
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
