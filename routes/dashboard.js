const { isAuthenticated } = require('../middlewares/auth-middleware')

const dashboard = async (fastify) => {
  // Protected routes
  fastify.post('/', isAuthenticated, (request, reply) => {
    return {
      isAuthenticated: true,
    }
  })
}

module.exports = dashboard
