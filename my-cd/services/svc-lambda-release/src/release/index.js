'use strict'

var aws = require( '../vendor/aws.js' )
const log = require('../logging')


const codepipeline = aws.CodePipeline()
const cloudformation = aws.CloudFormation()
const lambda = aws.Lambda()


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
  // TO DO: get the correct stack
  const params = {
    StackName: 'my-cd-svc-lambda-release-dev'
  }

  return new Promise(function(resolve, reject) {
    cloudformation.listStackResources(params, function(err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

module.exports.publishVersion = ({ FunctionName }) => {
  const params = {
    FunctionName
  }

  return new Promise(function(resolve, reject) {
    lambda.publishVersion(params, function(err, data) {
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
        // data.StackResourceSummaries.filter()

        log.info('listStackResources', data)

        return publishVersion({ FunctionName: 'my-cd-svc-lambda-release-dev-PreRelease' })
          .then((publishData) => {
            log.info('publishVersion', publishData)

            return putJobFailure({ jobId })
          })
          .catch((publishError) => {
            log.error('publishVersion error', publishError)
            return putJobFailure({ jobId, invokeid })
          })
      })
      .catch((error) => {
        log.error('listStackResources error', error)
        return putJobFailure({ jobId, invokeid })
      })
  }
