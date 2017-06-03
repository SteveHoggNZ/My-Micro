'use strict'

const AWS = require('aws-sdk')
const log = require('./logging.js')

exports.pre_release = (event, context, callback) => {
  const info = JSON.parse(event.body)

  console.log('got info', info)

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'pre release'
    })
  }
  callback(null, response)
}
