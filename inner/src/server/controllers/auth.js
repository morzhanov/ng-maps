const User = require('../models/User')
const AuthService = require('../services/auth-service')
const UserService = require('../services/user-service')
const CustomError = require('../error/custom-error')
const {SC, EC, SALT} = require('../constants')

module.exports = {

  login: async ({headers}, res, next) => {
    // check request user data
    if (!headers['x-email'] || !headers['x-pwd']) {
      return next(new CustomError('Data not provided', EC.DATA_NOT_PROVIDED))
    }

    let user
    try {
      // login user
      user = await AuthService.login(headers['x-email'], headers['x-pwd'])
      if (headers['x-photo']) {
        user.photoUrl = headers['x-photo']
        user = user.save()
      }
    } catch (e) {
      return next(e)
    }

    // check user data
    if (!user) {
      return next(new CustomError('User not saved.', EC.DATA_NOT_SAVED))
    }

    // hide pwd and token
    user.password = undefined

    // return the information including token as JSON
    res.set('type', 0)
    res.status(SC.SUCCESS).json(user)
  },

  /**
   * Endpoint of user facebook authentication
   * @param req - request object
   * @param res - response object
   * @param next - next handler
   * @returns {Promise.<void>}
   */
  facebook: async ({headers, body}, res, next) => {
    // check data
    if (!headers['x-facebook-id'] || !headers['x-email']) {
      return next(new CustomError('Data not provided', EC.DATA_NOT_PROVIDED))
    }

    // find user by facebook id
    let user
    try {
      user = await User.findOne({'facebookId': headers['x-facebook-id']})

      if (user) {
        // if user exists login user
        user = await User.findOne({'email': headers['x-email']})

        // check if facebook ids matches
        if (!user || (user.facebookId !== headers['x-facebook-id'])) {
          return next(new CustomError('Wrong facebook id', EC.TRY_OTHER_AUTH))
        }

        res.set('type', 0)

        // if user exists create new token
        user = await UserService.createNewToken(user)
      } else {
        // if user with this email exists send try other auth
        let emailUser = await User.findOne({'email': headers['x-email']})

        if (emailUser) {
          emailUser.googleId = headers['x-facebook-id']

          emailUser = await emailUser.save()

          res.set('type', 0)

          // if user exists create new token
          user = await UserService.createNewToken(emailUser)
        } else {
          user = new User()
          user.email = headers['x-email']
          user.facebookId = headers['x-facebook-id']
          user.photoUrl = headers['x-photo']
          user.password = 'NaN'
          user.token = 'emptytoken'

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
            return next(new CustomError('User data not saved.', EC.DATA_NOT_SAVED))
          }

          res.set('type', 1)
        }
      }
    } catch (e) {
      return next(e)
    }

    if (headers['x-photo']) {
      user.photoUrl = headers['x-photo']
    }

    if (headers['x-facebook-id']) {
      user.facebookId = headers['x-facebook-id']
    }
    if (headers['x-google-id']) {
      user.googleId = headers['x-google-id']
    }

    user = await user.save()

    // hide pwd
    user.password = undefined

    // send response with all user data
    res.status(SC.SUCCESS).json(user)
  },

  /**
   * Endpoint of user google plus authentication
   * @param req - request object
   * @param res - response object
   * @param next - next handler
   * @returns {Promise.<void>}
   */
  google: async ({headers, body}, res, next) => {
    // check data
    if (!headers['x-google-id'] || !headers['x-email']) {
      return next(new CustomError('Data not provided', EC.DATA_NOT_PROVIDED))
    }

    // find user by google id
    let user
    try {
      user = await User.findOne({'googleId': headers['x-google-id']})

      if (user) {
        // if user exists login user
        user = await User.findOne({'email': headers['x-email']})

        // check if google ids matches
        if (!user || (user.googleId !== headers['x-google-id'])) {
          return next(new CustomError('Wrong google id', EC.TRY_OTHER_AUTH))
        }

        res.set('type', 0)

        // if user exists create new token
        user = await UserService.createNewToken(user)
      } else {
        // if user with this email exists send try other auth
        let emailUser = await User.findOne({'email': headers['x-email']})

        if (emailUser) {
          emailUser.googleId = headers['x-google-id']

          emailUser = await emailUser.save()

          res.set('type', 0)

          // if user exists create new token
          user = await UserService.createNewToken(emailUser)
        } else {
          user = new User()
          user.email = headers['x-email']
          user.googleId = headers['x-google-id']
          user.photoUrl = headers['x-photo']
          user.password = 'NaN'
          user.token = 'emptytoken'

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
            return next(new CustomError('User data not saved.', EC.DATA_NOT_SAVED))
          }

          res.set('type', 1)
        }
      }
    } catch (e) {
      return next(e)
    }

    if (headers['x-photo']) {
      user.photoUrl = headers['x-photo']
    }

    if (headers['x-facebook-id']) {
      user.facebookId = headers['x-facebook-id']
    }
    if (headers['x-google-id']) {
      user.googleId = headers['x-google-id']
    }

    user = await user.save()

    // hide pwd
    user.password = undefined

    // send response with all user data
    res.status(SC.SUCCESS).json(user)
  }
}
