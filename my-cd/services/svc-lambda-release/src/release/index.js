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

module.exports.listStackResources = ({ StackName }) => {
  const params = {
    StackName
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

exports.listAliases = ({ FunctionName, FunctionVersion = null }) => {
  const params = {
    FunctionName,
    FunctionVersion
  }

  return new Promise(function(resolve, reject) {
    lambda.listAliases(params, function(err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

exports.createAlias = ({ FunctionName, FunctionVersion, Name }) => {
  const params = {
    FunctionName,
    FunctionVersion,
    Name
  }

  return new Promise(function(resolve, reject) {
    lambda.createAlias(params, function(err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

exports.createAlias = ({ FunctionName, FunctionVersion, Name }) => {
  const params = {
    FunctionName,
    FunctionVersion,
    Name
  }

  return new Promise(function(resolve, reject) {
    lambda.createAlias(params, function(err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

exports.updateAlias = ({ FunctionName, FunctionVersion, Name }) => {
  const params = {
    FunctionName,
    FunctionVersion,
    Name
  }

  return new Promise(function(resolve, reject) {
    lambda.updateAlias(params, function(err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

module.exports.makePrerelease = ({
  putJobSuccess = module.exports.putJobSuccess,
  putJobFailure = module.exports.putJobFailure,
  listStackResources = module.exports.listStackResources,
  publishVersion = module.exports.publishVersion,
  createAlias = exports.createAlias,
  updateAlias = exports.updateAlias
} = {}) => ({ jobId, invokeid, versionId }) => {
    // To Do: set functionName below instead of hard-coding it
    let result = {}

    // To Do: generate stack name
    return listStackResources({ StackName: 'my-micro-svc-hello-dev' })
      .then((data) => {
        // publish a version for each function in the list of resources
        const publishCalls = data.StackResourceSummaries
          .filter((e) => e && e.ResourceType
            && e.ResourceType === 'AWS::Lambda::Function')
          .map((e) => publishVersion({ FunctionName: e.PhysicalResourceId }))

        log.info('publishCalls:', publishCalls)

        return Promise.all(publishCalls)
      })
      .then((publishData) => {
        log.info('publishData', publishData)

        // map published functions to a promise chain that tries an update, then a create if that fails
        const aliasCalls = publishData
          .map((p) =>
            updateAlias({ FunctionName: p.FunctionName, FunctionVersion: p.Version, Name: 'green' })
              .catch((updateError) =>
                createAlias({ FunctionName: p.FunctionName, FunctionVersion: p.Version, Name: 'green' })
              ))

        return Promise.all(aliasCalls)
      })
      .then((aliasData) => {
        log.info('createAlias', aliasData)

        return putJobSuccess({ jobId, invokeid })
          .then(() => result)
      })
      .catch((error) => {
        log.error('Prerelease error', error)
        return putJobFailure({ jobId, invokeid })
          .then(() => result)
      })
  }

  exports.makeRelease = ({
    putJobSuccess = module.exports.putJobSuccess,
    putJobFailure = module.exports.putJobFailure,
    listStackResources = module.exports.listStackResources,
    listAliases = exports.listAliases,
    createAlias = exports.createAlias,
    updateAlias = exports.updateAlias
  } = {}) => ({ jobId, invokeid, versionId }) => {
      // To Do: set functionName below instead of hard-coding it
      let functionName = 'my-cd-svc-lambda-release-dev-PreRelease'

      // To Do: generate stack name
      return listStackResources({ StackName: 'my-micro-svc-hello-dev' })
        .then((data) => {
          log.info('listStackResources', data)

          // To Do: set functionName here
          // data.StackResourceSummaries.filter()

          return listAliases({ FunctionName: functionName })
        })
        .then((aliasData) => {
          log.info('Release aliasData', aliasData)

          return putJobFailure({ jobId, invokeid })
        })
        .catch((error) => {
          log.error('Release error', error)
          return putJobFailure({ jobId, invokeid })
        })
    }
