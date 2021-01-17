const fastify = require('fastify')({ logger: false })

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT
require('./db/mongoose')

fastify.register(require('./routes/auth'), { prefix: '/auth' })
fastify.register(require('./routes/dashboard', {}))

fastify.addContentTypeParser(
  'application/json',
  { parseAs: 'string' },
  function (req, body, done) {
    try {
      var newBody = {
        raw: body,
        parsed: JSON.parse(body),
      }
      done(null, newBody)
    } catch (error) {
      error.statusCode = 400
      done(error, undefined)
    }
  }
)

fastify.register(require('fastify-cors'), {
  origin: (origin, cb) => {
    if (/localhost/.test(origin) || 'https://delstore.netlify.app') {
      cb(null, true)
      return
    }
    cb(new Error('Not allowed'))
  },
})

const start = async () => {
  try {
    const response = await fastify.listen(PORT)
    console.log(`Server run on ${response}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
