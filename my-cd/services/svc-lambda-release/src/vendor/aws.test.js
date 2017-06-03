'use strict'

var sinon = require( 'sinon' )
var expect = require( 'chai' ).expect

var proxyquire = require("proxyquire")
proxyquire = proxyquire.noPreserveCache()

const stubs = {}
var aws = proxyquire('./aws', stubs)

// === Start Tests ===
describe('vendor/aws', function() {
  it('should export an object with the required keys', function() {
    const expectedKeys = [ 'CodePipeline', 'CloudFormation', 'Lambda' ]
    expect(Object.keys(aws)).to.deep.equal(expectedKeys, 'keys match required keys')
  })
})
