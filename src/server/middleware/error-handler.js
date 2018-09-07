const info = require('debug')('server:info')
const debug = require('debug')('server:errors')
const {EC, SC} = require('../constants/index')

/**
 * Application error handler
 * @return {Function} middleware
 */
function errorHandler () {
  return (e, request, response, next) => {
    info('Error happend: %o', e)
    debug('Error happend: ', e.message)

    return response.status(e.status || SC.SERVER_ERROR)
      .json({
        success: false,
        error_code: e.error_code || EC.SERVER_ERROR,
        error: e.message
      })
  }
}

module.exports = errorHandler
