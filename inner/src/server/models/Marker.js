/**
 * Mark mongoose model
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// mark schema
const Marker = new Schema(
  {
    userId: String,
    title: {type: String, default: 'NaN'},
    lat: Number,
    lng: Number
  })

// return the model
module.exports = mongoose.model('Marker', Marker)
