'use strict'

var sinon = require( 'sinon' )
var expect = require( 'chai' ).expect

var proxyquire = require("proxyquire")
proxyquire = proxyquire.noPreserveCache()

// === Start Tests ===
describe('putJobSuccess', function() {
  let release, stubs, putJobSuccessResult

  beforeEach(function () {
    // The stub returns an object, so beforeEach overwrites stubs rather
    // than using a sandbox.restore()
    putJobSuccessResult = sinon.stub()
    stubs = {
      '../vendor/aws.js': {
        CodePipeline: sinon.stub()
          .returns({ putJobSuccessResult }),
        CloudFormation: sinon.stub(),
        Lambda: sinon.stub()
      }
    }
    release = proxyquire('./index', stubs)
  })

  it('should return data via a promise', function() {
    putJobSuccessResult.callsArgWith(1, null, 'mock-data')

    const pjs = release.putJobSuccess({ jobId: 9 })

    expect(typeof(pjs.then)).to.equal('function', 'returns a promise')
    expect(putJobSuccessResult.callCount)
      .to.equal(1, 'putJobSuccessResult called once')
    expect(putJobSuccessResult.getCall(0).args[0])
      .to.deep.equal({ jobId: 9 }, 'putJobSuccessResult parameters correct')

    return pjs.then((data) => {
      expect(data).to.equal('mock-data', 'promise has correct data')
    })
  })

  it('should throw and error via a promise', function() {
    putJobSuccessResult.callsArgWith(1, 'mock-error')

    return release.putJobSuccess({ jobId: 9 })
      .catch((err) => {
        expect(err).to.equal('mock-error', 'promise throws error')
      })
  })
})

describe('putJobFailure', function() {
  let release, stubs, putJobFailureResult

  beforeEach(function () {
    // The stub returns an object, so beforeEach overwrites stubs rather
    // than using a sandbox.restore()
    putJobFailureResult = sinon.stub()
    stubs = {
      '../vendor/aws.js': {
        CodePipeline: sinon.stub()
          .returns({ putJobFailureResult })
      }
    }
    release = proxyquire('./index', stubs)
  })

  it('should return data via a promise', function() {
    putJobFailureResult.callsArgWith(1, null, 'mock-data')

    const pjs = release.putJobFailure({ jobId: 9, invokeid: 8 })

    expect(typeof(pjs.then)).to.equal('function', 'returns a promise')
    expect(putJobFailureResult.callCount)
      .to.equal(1, 'putJobFailureResult called once')
    expect(putJobFailureResult.getCall(0).args[0])
      .to.deep.equal({
        failureDetails: {
          message: 'Release failure',
          type: 'ConfigurationError',
          externalExecutionId: 8
        },
        jobId: 9
      }, 'putJobFailureResult parameters correct')

    return pjs.then((data) => {
      expect(data).to.equal('mock-data', 'promise has correct data')
    })
  })

  it('should throw and error via a promise', function() {
    putJobFailureResult.callsArgWith(1, 'mock-error')

    return release.putJobFailure({ jobId: 9 })
      .catch((err) => {
        expect(err).to.equal('mock-error', 'promise throws error')
      })
  })
})

describe('listStackResources', function() {
  let release, stubs

  // beforeEach(function () {
  //   // The stub returns an object, so beforeEach overwrites stubs rather
  //   // than using a sandbox.restore()
  //   putJobSuccessResult = sinon.stub()
  //   stubs = {
  //     '../vendor/aws.js': {
  //       CodePipeline: sinon.stub()
  //         .returns({ putJobSuccessResult }),
  //       Lambda: sinon.stub()
  //     }
  //   }
  //   release = proxyquire('./index', stubs)
  // })

  it('should return data via a promise', function() {
    // putJobSuccessResult.callsArgWith(1, null, 'mock-data')
    //
    // const pjs = release.putJobSuccess({ jobId: 9 })
    //
    // expect(typeof(pjs.then)).to.equal('function', 'returns a promise')
    // expect(putJobSuccessResult.callCount)
    //   .to.equal(1, 'putJobSuccessResult called once')
    // expect(putJobSuccessResult.getCall(0).args[0])
    //   .to.deep.equal({ jobId: 9 }, 'putJobSuccessResult parameters correct')
    //
    // return pjs.then((data) => {
    //   expect(data).to.equal('mock-data', 'promise has correct data')
    // })
  })

  // it('should throw and error via a promise', function() {
  //   putJobSuccessResult.callsArgWith(1, 'mock-error')
  //
  //   return release.putJobSuccess({ jobId: 9 })
  //     .catch((err) => {
  //       expect(err).to.equal('mock-error', 'promise throws error')
  //     })
  // })
})

describe('makePrerelease', function() {
  let release, putJobSuccess, putJobFailure

  beforeEach(function () {
    putJobSuccess = sinon.stub()
    putJobFailure = sinon.stub()
    release = require('./index')
  })

  it('should be a factory', function() {
    const prerelease = release
      .makePrerelease({ putJobSuccess, putJobFailure })
    expect(typeof(prerelease)).to.equal('function', 'returns a function')

    // prerelease({ jobId: 9 })
  })
})
