'use strict'

var aws = require( '../vendor/aws.js' )
const log = require('../logging')


const codepipeline = aws.CodePipeline()
const cloudformation = aws.CloudFormation()


module.exports.putJobSuccess = ({ jobId }) => {
  const params = {
    jobId: jobId
  }

  return new Promise(function(resolve, reject) {
    codepipeline.putJobSuccessResult(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports.putJobFailure = ({ jobId, invokeid }) => {
  const params = {
    failureDetails: {
      message: 'Release failure',
      type: 'ConfigurationError',
      externalExecutionId: invokeid
    },
    jobId: jobId
  }

  return new Promise(function(resolve, reject) {
    codepipeline.putJobFailureResult(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports.listStackResources = () => {
  const params = {
    StackName: 'my-micro-cd-release-prod'
  }

  return new Promise(function(resolve, reject) {
    cloudformation.listStackResources(params, function(err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

module.exports.makePrerelease = ({
  putJobSuccess = module.exports.putJobSuccess,
  putJobFailure = module.exports.putJobFailure,
  listStackResources = module.exports.listStackResources
} = {}) => ({ jobId, invokeid }) => {
    return listStackResources()
      .then((data) => {
        log.info('listStackResources', data)
        // return putJobSuccess({ jobId })
        return putJobFailure({ jobId, invokeid })
      })
      .catch((error) => {
        log.error('listStackResources error', error)
        return putJobFailure({ jobId, invokeid })
      })
  }
