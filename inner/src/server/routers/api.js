const {Router} = require('express')

const Marker = require('../controllers/marker')
const User = require('../controllers/user')
const Auth = require('../controllers/auth')

const JwtCheck = require('../middleware/jwt-check')
const ErrorHandler = require('../middleware/error-handler')
const NotFound = require('../middleware/not-found')

/**
 * Express router
 * @type {*|Router}
 */
const router = new Router()
const passport = require('passport')

router
  .get('/health-check', Marker.healthCheck)
  .post('/login', Auth.login)
  .post('/facebook-auth', Auth.facebook)
  .post('/google-auth', Auth.google)
  .get('/marker', JwtCheck, Marker.getMarkers)
  .post('/marker', JwtCheck, Marker.addMarker)
  .delete('/marker', JwtCheck, Marker.removeMarker)
  .get('/user', JwtCheck, User.retrieve)
  .put('/user', JwtCheck, User.update)
  .use(ErrorHandler())
  .use(NotFound('Not Found'))

module.exports = router
