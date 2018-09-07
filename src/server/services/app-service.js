const request = require('request')
const CustomError = require('../error/custom-error')
const {SC} = require('../constants')
const formidable = require('formidable')
const debug = require('debug')('main-server:server')
const os = require('os')

/**
 * Send request via request module
 * @param params - params for request
 * @returns {Promise}
 */
function sendRequest (params) {
  return new Promise(function (resolve, reject) {
    request(params, function (error, res, body) {
      if (!error && res.statusCode === SC.SUCCESS) {
        try {
          return resolve(JSON.parse(body))
        } catch (e) {
          return resolve(body)
        }
      } else {
        if (res) {
          debug('in send request status code = ' +
            res.statusCode + ' message = ' + res.message)
        }
        if (!error) {
          try {
            return reject(new CustomError(JSON.parse(body)))
          } catch (e) {
            return reject(new CustomError(body))
          }
        }
        reject(error)
      }
    })
  })
}

/**
 * Parse form data via Formidable
 * @param req - request object
 * @returns {Promise}
 */
function parseForm (req) {
  return new Promise(function (resolve, reject) {
    let form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err)
      }
      if (!fields) {
        reject(new Error('No fields.'))
      }
      if (!files) {
        reject(new Error('No files.'))
      }
      resolve([fields, files])
    })
  })
}

/**
 * print server IP
 */
function printIP () {
  const ifaces = os.networkInterfaces()

  Object.keys(ifaces).forEach(function (ifname) {
    let alias = 0

    ifaces[ifname].forEach(function (iface) {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        debug(ifname + ':' + alias, iface.address)
      } else {
        // this interface has only one ipv4 adress
        debug(ifname, iface.address)
      }
      ++alias
    })
  })
}

module.exports = {
  sendRequest,
  parseForm,
  printIP
}
