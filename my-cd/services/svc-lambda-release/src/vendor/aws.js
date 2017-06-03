'use strict'


const AWS = require('aws-sdk')


module.exports = {
  CodePipeline: () => new AWS.CodePipeline(),
  CloudFormation: () => new AWS.CloudFormation(),
  Lambda: () => new AWS.Lambda()
}
