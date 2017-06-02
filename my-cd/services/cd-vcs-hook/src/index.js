'use strict'

const AWS = require('aws-sdk')
const codebuild = new AWS.CodeBuild()
const log = require('./logging.js')

exports.hook = (event, context, callback) => {
  const update = JSON.parse(event.body)

  if (update['ref_type'] === 'tag') {
    const tag = update['ref']
    const url = update['repository']['html_url']
    const project = url.split('/').slice(-1)[0]
    const clone_dir = `/tmp/${project}`

    log.info('Processing update', tag, url)

    const build_params = {
      projectName: process.env.CODE_BUILD_PROJECT, /* required */
      environmentVariablesOverride: [
        {
          name: 'BUILD_TAG',
          value: tag
        }
      ]
    }

    codebuild.startBuild(build_params, function(err, data) {
      if (err) {
        log.error('build start failed', err.stack)
        callback('build start failed')
      } else {
        log.info('build started', data)
        const response = {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Build started!',
            input: event
          })
        }
        callback(null, response)
      }
    })
  } else {
    log.info('Ignoring update', update)

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Ignoring'
      })
    }
    callback(null, response)
  }
}
