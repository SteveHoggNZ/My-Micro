'use strict'

const AWS = require('aws-sdk')
const log = require('./logging.js')

exports.pre_release = (event, context, callback) => {
  console.log('got info', JSON.stringify(event))

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'pre release'
    })
  }
  callback(null, response)
}
