const {SC} = require('../constants')
const Marker = require('../models/Marker')
const CustomError = require('../error/custom-error')

module.exports = {

  /**
   * Endpoint to check is server alive
   * @param req - request object
   * @param res - response object
   * @returns {Promise.<void>}
   */
  healthCheck: (req, res) => {
    // send health check response
    return res.status(SC.SUCCESS).json({success: true, message: 'alive'})
  },
  /**
   * generic get endpoint
   * @param headers
   * @param query
   * @param params
   * @param res
   * @param next
   * @returns {Promise.<void>}
   */
  getMarkers: async ({user}, res, next) => {

    try {
      let markers = await Marker.find({
        userId: user.id
      })

      for (let i = 0; i < markers.length; ++i) {
        markers[i] = markers[i].toObject()
        delete  markers[i].userId
        delete  markers[i].id
        delete  markers[i]._id
        delete  markers[i].__v
      }

      return res.status(SC.SUCCESS).json(markers)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  /**
   * generic post endpoint
   * @param headers
   * @param res
   * @param next
   * @returns {Promise.<void>}
   */
  addMarker: async ({user, body}, res, next) => {

    if (!body || !body.lat || !body.lng) {
      return next(new CustomError('no data provided'))
    }

    const marker = new Marker()
    marker.lat = body.lat
    marker.lng = body.lng
    marker.title = body.title
    marker.userId = user.id

    await marker.save()

    res.status(SC.SUCCESS).json()
  },
  /**
   * generic delete endpoint
   * @param headers
   * @param res
   * @param next
   * @returns {Promise.<void>}
   */
  removeMarker: async ({user, headers}, res, next) => {
    if (!headers['x-lat'] || !headers['x-lng']) {
      return next(new CustomError('no data provided'))
    }

    try {
      let markers = await Marker.find({
        userId: user.id,
        lat: headers['x-lat'],
        lng: headers['x-lng']
      })

      for (let i = 0; i < markers.length; ++i) {
        await markers[i].remove()
      }

      return res.status(SC.SUCCESS).json(markers)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  }
}
