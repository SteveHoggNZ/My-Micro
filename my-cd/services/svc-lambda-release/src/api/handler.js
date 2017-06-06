'use strict'

const AWS = require('aws-sdk')
const release = require('../release/index.js')
const log = require('../logging')


module.exports.prerelease = (event, context, callback) => {
  log.info('prerelease event', JSON.stringify(event))

  const jobId = event["CodePipeline.job"].id
  const UserParameters = JSON.parse(event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters)

  const invokeid = context.invokeid

  const prerelease = release.makePrerelease()

  prerelease({ jobId, invokeid, versionId: UserParameters['Version'] })
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
    .catch((error) => {
      callback(error)
    })
}

module.exports.release = (event, context, callback) => {
  log.info('release event', JSON.stringify(event))

  const jobId = event["CodePipeline.job"].id
  const UserParameters = JSON.parse(event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters)

  const invokeid = context.invokeid

  const release = release.makeRelease()

  release({ jobId, invokeid, versionId: UserParameters['Version'] })
    .then((data) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully released version ${process.env.SVC_VERSION}`,
          input: event,
          data: data
        })
      }
      callback(null, response)
    })
    .catch((error) => {
      callback(error)
    })
}
