'use strict'

exports.hello_nz = (event, context, callback) => {
  const msg = 'HelloWorld NZ! 1'

  console.log(msg)
  callback(null, msg)
}

exports.hello_world = (event, context, callback) => {
  const msg = 'HelloWorld World! 1'

  console.log(msg)
  callback(null, msg)
}

exports.hello_universe = (event, context, callback) => {
  const msg = 'HelloWorld Universe! 1'

  console.log(msg)
  callback(null, msg)
}
