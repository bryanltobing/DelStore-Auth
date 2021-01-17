const {
  registerController,
  loginController,
} = require('../controller/auth-controller')

const auth = async (fastify, options) => {
  fastify.post('/register', registerController)
  fastify.post('/login', loginController)
}

module.exports = auth
