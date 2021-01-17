const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')

const isAuthenticated = {
  preHandler: async (request, reply, done) => {
    try {
      const token = request.body.parsed.authToken
      const tokenDecoded = await jwt.verify(token, process.env.JWT_SECRET)
      const user = await UserModel.findById(tokenDecoded._id).select(
        '-password'
      )

      if (!user) {
        throw new Error()
      }

      request.user = user

      done()
    } catch (err) {
      let message
      if (err.message === 'jwt malformed') {
        message = 'Invalid token form'
      } else {
        message = err.message
      }
      reply.send({
        message,
      })
    }
  },
}

module.exports = {
  isAuthenticated,
}
