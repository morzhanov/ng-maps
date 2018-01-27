const UserService = require('../services/user-service')
const {SC, EC, TWITTER_KEY, TWITTER_SECRET} = require('../constants')
const CustomError = require('../error/custom-error')
const jwt = require('jsonwebtoken')
const request = require('request')
const passport = require('passport')

module.exports = {

  /**
   * Get user data by id
   * @param req - request object
   * @param res - response object
   * @param next - next handler object
   * @returns {Promise.<void>}
   */
  retrieve: async ({user}, res, next) => {
    try {
      // get user
      user = await UserService.getUser(user.id)
    } catch (e) {
      return next(e)
    }

    // check data
    if (!user) {
      return next(new CustomError('Data not found', EC.DATA_NOT_FOUND))
    }

    // remove user pwd
    user.password = undefined

    // send response
    res.status(SC.SUCCESS).json(user)
  },

  /**
   * Update user data by id
   * @param req - request object
   * @param res - response object
   * @param next - next handler object
   * @returns {Promise.<void>}
   */
  update: async (req, res, next) => {
    let {user, body} = req
    // check request user data
    if (!body) {
      return next(new CustomError('Data not provided', EC.DATA_NOT_PROVIDED))
    }

    try {
      // load user data
      user = await UserService.editUser(user.id, body)
    } catch (e) {
      return next(e)
    }

    // check data
    if (!user) {
      return next(new CustomError('Data not found', EC.DATA_NOT_FOUND))
    }

    // delete user password
    user.password = undefined

    // return information including token as JSON
    res.status(SC.SUCCESS).json(user)
  },

  /**
   * Delete user data by id
   * @param req - request object
   * @param res - response object
   * @param next - next handler object
   * @returns {Promise.<void>}
   */
  delete: async ({user}, res, next) => {
    try {
      // delete user
      await UserService.deleteUser(user.id)
    } catch (e) {
      return next(e)
    }

    // send response
    res.status(SC.SUCCESS).send()
  },

  twitterToken: async (req, res, next) => {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: 'http%3A%2F%2F127.0.0.1%3A4000%2Ftwitter-callback',
        consumer_key: TWITTER_KEY,
        consumer_secret: TWITTER_SECRET
      }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, {message: err.message})
      }

      const jsonStr = '{ "' + body.replace(/&/g, '", "')
        .replace(/=/g, '": "') + '"}'
      res.send(JSON.parse(jsonStr))
    })
  },

  verifyTwitterOAuth: async (req, res, next) => {
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: 'KEY',
        consumer_secret: 'SECRET',
        token: req.query.oauth_token
      },
      form: {oauth_verifier: req.query.oauth_verifier}
    }, function (err, r, body) {
      if (err) {
        return res.send(500, {message: err.message})
      }

      console.log(body)
      const bodyString = '{ "' + body.replace(/&/g, '", "')
        .replace(/=/g, '": "') + '"}'
      const parsedBody = JSON.parse(bodyString)

      req.body['oauth_token'] = parsedBody.oauth_token
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret

      res.set('key', req.body['oauth_token'])
      res.set('secret', req.body['oauth_token_secret'])
      res.status(200).send()

      // req.body['user_id'] = parsedBody.user_id
      //
      // next()
    })
  },

  sendTwitterAuthToken: async (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated')
    }

    const token = jwt.sign(
      {
        id: req.user.id
      }, 'my-secret',
      {
        expiresIn: 60 * 120
      })

    res.set('x-auth-token', token)
    return res.status(200).json(JSON.stringify(req.user))
  }
}
