const {SC, SALT} = require('../constants')
const jwt = require('jsonwebtoken')

/**
 * Middleware to check jsonwebtokens
 * @param req - request object
 * @param res - response object
 * @param next - next middleware
 */
module.exports = function (req, res, next) {
  const token = req.headers['x-token']

  console.log('token = ' + token)

  // decode token
  if (token) {
    console.log('token is available')

    // verify SALT and checks exp
    jwt.verify(token, SALT, function (err, decoded) {
      if (err) {
        console.log('token = ' + token)

        console.log('error when verify token: ' + err)

        return res.status(SC.UNAUTHORIZED)
          .json({
            success: false,
            error: 'Failed to authenticate token.'
          })
      } else {
        // if everything is good, save to request for use in other routes
        req.user = decoded
        next()
      }
    })
  } else {
    // if there is no token
    // return an HTTP response of 403 (access forbidden) and an error message
    return res.status(SC.UNAUTHORIZED)
      .json({
        success: false,
        error: 'No token provided.'
      })
  }
}
