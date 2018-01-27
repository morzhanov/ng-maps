const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {SALT, EC} = require('../constants')
const CustomError = require('../error/custom-error')
const validator = require('email-validator')

async function login(email, pwd) {
  // validate email
  if (!validator.validate(email)) {
    throw new CustomError('Not valid email.', EC.DATA_VALIDATION_FAILED)
  }

  // find user
  let user = await User.findOne({email: email})

  if (user) {
    if (user.password === 'NaN') {
      // if user try to local login when password to this account is NaN
      throw new CustomError('This account doesn\'t contains password. Please try another auth type.', EC.TRY_OTHER_AUTH)
    }

    // check if passwords matches
    if (!user.comparePassword(pwd)) {
      // password is not valid
      throw new CustomError('Wrong password.', EC.WRONG_PASSWORD)
    }

    // if user is found and password is right
    // create a token
    user.token = jwt.sign(
      {
        id: user.id,
        email: user.email
      }, SALT, {
        expiresIn: '30d'       // expires in 30 days
      })

    // save user with new token
    return await user.save()
  }

  // create new instance of User model
  user = new User()
  user.token = 'emptytoken'
  user.email = email
  user.password = pwd

  // save user
  user = await user.save()

  // create token
  user.token = jwt.sign(
    {
      id: user.id,
      email: user.email
    }, SALT, {
      expiresIn: '30d'       // expires in 30 days
    })

  // save user with new token
  user = await user.save()

  if (!user) {
    // if user already exists
    throw new CustomError('User data not saved.', EC.DATA_NOT_SAVED)
  }

  return user
}

module.exports = {
  login
}
