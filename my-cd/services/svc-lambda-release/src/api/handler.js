'use strict'

const AWS = require('aws-sdk')
const release = require('../release/index.js')
const log = require('../logging')


module.exports.prerelease = (event, context, callback) => {
  log.info('prerelease event', JSON.stringify(event))

  const jobId = event["CodePipeline.job"].id
  const invokeid = context.invokeid

  const prerelease = release.makePrerelease()

  prerelease({ jobId, invokeid })
    .catch((error) => {
      callback(error)
    })
    .then((data) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully pre-released version ${process.env.SVC_VERSION}`,
          input: event,
          data: data
        })
      }
      callback(null, response)
    })
}

module.exports.release = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Successfully released version ${process.env.SVC_VERSION}`,
      input: event
    })
  }

  callback(null, response)
}
