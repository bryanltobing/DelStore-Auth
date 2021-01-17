const User = require('../models/UserModel')
const {
  SUCCESS,
  ERROR,
  REGISTER_SUCCESSFULLY,
  LOGIN_SUCCESSFULLY,
} = require('../types')

const registerController = async ({ body }, reply) => {
  const newUser = new User(body.parsed)
  const email = body.parsed.email
  try {
    const emailExist = await User.findOne({ email })
    if (emailExist) {
      throw new Error('Email already exist. Choose another')
    }

    const savedUser = await newUser.save()
    if (!savedUser) {
      throw new Error('Something wrong happened. No user registered')
    }

    const userId = savedUser.id

    return {
      status: SUCCESS,
      message: REGISTER_SUCCESSFULLY,
      data: {
        id: userId,
      },
    }
  } catch (err) {
    reply.status(400)
    return {
      status: ERROR,
      message: err.message,
    }
  }
}

const loginController = async ({ body }, reply) => {
  const { email, password } = body.parsed
  try {
    const userValid = await User.findByCredentials(email, password)
    const token = await User.generateAuthToken(userValid)
    if (!userValid) {
      throw new Error()
    }
    return {
      status: SUCCESS,
      message: LOGIN_SUCCESSFULLY,
      data: {
        authToken: token,
      },
    }
  } catch (err) {
    reply.status(401)
    return {
      status: ERROR,
      message: err.message,
    }
  }
}

module.exports = {
  registerController,
  loginController,
}
