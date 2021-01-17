const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: (value) => {
        if (value < 2) {
          throw new Error('Name must be atleast two characters')
        }
      },
    },
    email: {
      type: String,
      required: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email address')
        }
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password

  return userObject
}

UserSchema.pre('save', async function (next) {
  const user = this
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user.password, salt)
    user.password = hashedPassword
    next()
  } catch (err) {
    next(err)
  }
})

UserSchema.statics.findByCredentials = async (email, password) => {
  const LoginFailed = "Email or password isn't valid"
  try {
    const user = await UserModels.findOne({ email })
    if (!user) {
      throw new Error(LoginFailed)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error(LoginFailed)
    }
    return user
  } catch (err) {
    throw new Error(err.message)
  }
}

UserSchema.statics.generateAuthToken = async (userPayload) => {
  const payload = userPayload.toObject()
  delete payload.__v
  delete payload.password

  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return token
  } catch (err) {
    throw new Error(err.message)
  }
}

const UserModels = mongoose.model('User', UserSchema)

module.exports = UserModels
